---
title: Mis Intro
tags:
  - eis
---

## Mis 代码整体分析

1. 目录结构

```plaintext
  odm/plugins/qcom/eis/
  ├── Android.mk           # 构建文件
  ├── dummyeis/            # 空实现EIS（测试/回退）
  ├── engine/              # MIS引擎核心
  ├── his/                 # HIS算法适配层
  ├── include/             # 公共头文件
  ├── MiMotionAlgo/        # MiMotion算法库
  ├── node/                # 插件节点实现
  ├── platform/            # 平台抽象层
  ├── presensormodeservice/# 传感器模式服务
  └── util/                # 工具类
```

1. 核心类与接口

MISBase (抽象基类) - include/misbase.h

```cpp
  class MISBase {
      virtual MISResCode initialize(const MISCreateInfo &createInfo) = 0;
      virtual MISResCode process(const MISFrameData &inputData, ...) = 0;
      virtual void deInitialize() = 0;
      virtual MISResCode setCmd(const MISStreamCMD cmd, ...) = 0;
  };
```

MISEngine (核心引擎) - engine/MISEngine.h

```cpp
  class MISEngine {
      MISBase *m_algorithm;           // 算法实例
      void *m_plugin;                 // 动态库句柄
      MISAlgoType m_algoType;         // 算法类型(HIS/Dummy等)
  };
```

MISPluginConnectorBase (外观层) - node/MISPluginConnectorBase.h

```cpp
  class MISPluginConnectorBase {
      std::unique_ptr<MISEngine> m_engine;
      MISResCode processStageOne(...);   // 收集传感器数据
      MISResCode processStageTwo(...);   // 执行算法
  };
```

MISv2Plugin / MISv3Plugin (插件实现)

- MISv2Plugin: 预览流，同步处理
- MISv3Plugin: 录像流，支持帧延迟处理，有独立后台线程

MISHisAdapter (HIS算法适配器) - his/src/MISHisAdapter.h

```cpp
  class MISHisAdapter : public MISBase {
      HISClassPtr m_hisProcessor;     // HIS算法实例
      uint32_t m_lookahead;           // 前瞻帧数
  };
```

1. 调用关系架构图

```plaintext
┌─────────────────────────────────────────────────────────────┐
│ Plugin Layer (MISv2Plugin / MISv3Plugin)                    │
│ - PLUMA插件注册、生命周期管理                                 │
└─────────────────────────────┬───────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│ MISPluginConnectorBase (外观层)                             │
│ - 两阶段处理、NCS传感器数据获取                               │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ MISEngine (核心引擎)                                         │
│ - 算法动态加载、配置管理                                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ MISHisAdapter           │ │ DummyEIS                │
│ - HIS算法封装            │ │ - 空实现/测试用          │
└───────────┬─────────────┘ └─────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│ HIS Algorithm Library (libHISCppAlgos.so)                   │
└─────────────────────────────────────────────────────────────┘
```

1. 核心处理流程

初始化: Plugin.initialize() → MISPluginConnectorBase.initialize() → MISEngine.initialize()
→ 动态加载算法库→ MISHisAdapter.initialize() → HIS_INIT()

处理: Plugin.processRequest() → processStageOne(): 收集陀螺仪/OIS/加速度计数据→
processStageTwo(): 执行算法→ HIS_Add_Frm_Data() → HIS算法处理→ getResult(): 获取变换矩阵和网格

销毁: Plugin.destroy() → MISEngine.destroy() → MISHisAdapter.deInitialize() → HIS_Del_Algo()

1. 设计模式模式: 抽象工厂应用位置: MISBase 接口 + mis_create 工厂函数

模式: 外观模式应用位置: MISPluginConnectorBase 封装复杂流程

模式: 单例模式应用位置: MISPlatformInterface、MISTaskQueue

模式: 策略模式应用位置: MISAlgoType 选择不同EIS算法

模式: 生产者-消费者应用位置: MISv3Plugin 帧延迟队列处理

1. 关键数据流

输入: ProcessRequestInfoV2 → MISFrameData → HIS_FRM_DATA输出: HIS_GRID_DATA → MISTransform →
IPEICA变换

### Dis #dis

execAlgo() **algo_frameData**.dis_info = mis_frameData.misDisResData
HIS_Add_DIS_Data(algo_frameData) his_inputData.frameData = **algo_frameData**

```cpp
uint32_t MISHisAdapter::execAlgo(const MISFrameData &inputData, MISResultCallback resultCallback,
                                 ExposureIndex exposureIndex)
{
 // 1. 构造algo需要的frameinfo
 HIS_FRM_DATA frameData{};
 frameData.dis_info = inputData.misDisResData;
 HIS_Add_DIS_Data(frameData);

 // 2. 构造实际传给algo & 用作reaslt callback的meta
 //    ===> 包含 meta/frameinfo/ncsData
 MISHisInputData inputParam{};
    inputParam.inputMeta = inputData.metaData;
    inputParam.frameData = frameData;  // <=== algo 输出的 dis 数据被存下来了
    inputParam.gyroDataVec = std::move(inputData.gyroDataVec);
    inputParam.oisDataVec = std::move(inputData.oisDataVec);
   
   
}
```

```plaintext
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │  Preview Node (MISv2Plugin)                                                 │
  │    ↓                                                                        │
  │  DIS 算法计算 disinfo                                                        │
  │    ↓                                                                        │
  │  UpdateDisInfoToMetadata() → "com.mis.disinfo"                              │
  └─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │  LivePhoto Node (MISv3Plugin, m_isLivpInstance=true)                        │
  │    ↓                                                                        │
  │  processStageOne():                                                         │
  │    - 启用 MIS_DIS feature                                                   │
  │    - 不填充图像数据 (m_isDISEnabled=false)                                   │
  │    - 从 metadata 读取 "com.mis.disinfo" → inputData.misDisResData            │
  │    ↓                                                                        │
  │  MISHisAdapter::process():                                                  │
  │    - dis_mode_on = true                                                     │
  │    - isLivePhoto = true → 跳过图像处理                                       │
  │    - 使用 inputData.misDisResData 作为 dis_info                             │
  │    - HIS_Add_DIS_Data() 传递 disinfo 给算法                                  │
  └─────────────────────────────────────────────────────────────────────────────┘
```
