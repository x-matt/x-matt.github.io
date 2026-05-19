---
title: Qcom related resource
tags:
  - qcom

---

## Docs

- [Feature2 Demo Video](https://docs.qualcomm.com/bundle/resource/video/VD80-48667-1)
- [SM7450_Feature2_Buffer_Negotiation (Chinese)](https://docs.qualcomm.com/bundle/resource/video/VD80-36666-1C)
- fence?
- [Camera SW - Camx, CHI and Pipeline (English)](https://docs.qualcomm.com/bundle/resource/video/VD80-PC212-1)
- [80-P9301-61 Qualcomm Spectra Linux Camera Debugging User Guide](https://docs.qualcomm.com/bundle/resource/topics/80-P9301-61/Camera_user_mode_driver_UMD.html)
- [SM8750 Camera Pipeline Flows and Migration Guidelines](https://docs.qualcomm.com/bundle/80-PN984-65/resource/80-PN984-65_REV_AB_SM8750_Camera_Pipeline_Flows_and_Migration_Guidelines.pdf)
- [Apollo Camera Architecture Quick Start Guide for ISVs](https://docs.qualcomm.com/bundle/80-PN984-66/resource/80-PN984-66_REV_AA_Apollo_Camera_Architecture_Quick_Start_Guide_for_ISVs.pdf)
- [SM8750/SM8750P Linux Android Camera Overview](https://docs.qualcomm.com/bundle/80-64995-82/resource/80-64995-82_REV_AA_SM8750_SM8750P_Linux_Android_Camera_Overview.pdf)

### SM8850

#### PPM Improvment

![[file-20250106160943809.png|700]]

#### Related Files

![[file-20250106161244728.png|700]]

[SM8650 Linux Android Camera Overview](https://docs.qualcomm.com/bundle/80-74889-82/resource/80-74889-82_REV_AA_SM8850_SM8850P_Linux_Android_Camera_Overview.pdf)

## Camx-Chi

### Development

1. V1
   1. 基础架构：提供相机基础的处理流水线
   2. 功能：基本的功能
2. V2
   1. isp：denoise，colorCorrection，3a
   2. node：拓展节点类型和数量，增加硬件能力
3. V3: 模块化设计和可拓展
   1. 模块化：每个node可以独立开发
   2. 拓展性：增加对多种传感器和图形处理硬件的支持
4. V4: 性能优化和高级功能
   1. 性能优化：提升处理性能和效率
   2. 高级功能：增加对高速连拍/HDR/夜景等的支持
5. V5: ai和机器学习
   1. ai集成：引入人工智能和机器学习算法
   2. 实时处理：实现实时处理，提升响应速度
6. V6: 多摄和3D成像
   1. multi camera
   2. 3D
7. 未来：
   1. 5g： 5g和云计算能力，提供远程处理和实时数据传输
   2. ai：自动化智能化的相机功能
   3. ar视频：
      [apple spatial video](https://www.apple.com.cn/newsroom/2023/12/apple-introduces-spatial-video-capture-on-iphone-15-pro/)

### Details

- CamX-Chi
  1. chi是抽象-camx是具体实现
  2. chi是为了更好得实现不同平台版本之间的兼容
  3. chi主要负责拓扑逻辑的配置设定，下达camx具体执行

- Core Conception
  1. session
     1. 定义：时域，代表一次相机操作的上下文，管理整个操作周期内的资源和状态
     2. 作用：初始化相机硬件/配置参数/启动数据流/管理生命周期
  2. usecase
     1. 定义：表示具体的相机使用场景和配置方案，拍照、录像......
     2. 作用：定义特定场景下的参数配置和功能需求/指导session如何配置pipeline&node
  3. pipeline
     1. 定义：图形处理的流水线
     2. 作用：管理图形处理的各个阶段，确保数据流的正确处理和传递

```cpp
// usecase 配置结构体
struct UsecaseConfig {
 int mode;
 // others
}
// pipeline 结构体
struct Pipeline {
 Node* noes;
 int node_count'
}
// Session 结构体
struct Session {
 UsecaseConfig usecase_config;
 Pipeline pipeline;
}
```
