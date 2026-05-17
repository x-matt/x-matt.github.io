---
tags:
  - mivi
---

# Mivi 相机架构文档

## 目录

- [整体架构](mivi_structure.md#整体架构)
- [预览流程](mivi_structure.md#预览流程)
- [拍照流程](mivi_structure.md#拍照流程)
- [录像流程](mivi_structure.md#录像流程)
- [平台适配层](mivi_structure.md#平台适配层)
- [数据流总结](mivi_structure.md#数据流总结)
- [架构特点](mivi_structure.md#架构特点)

---

## 整体架构

```plaintext
┌─────────────────────────────────────────────────────────────────────────┐
│                        Camera Framework (Android)                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Camera Provider Service                         │
│  (hal/micam-service/)                                                   │
│  • CameraProvider.cpp - 提供设备列表和设备接口                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Camera Device                                 │
│  (hal/micam-core/CameraDevice.h/cpp)                                    │
│  • IMicamDevice接口实现                                                 │
│  • 设备生命周期管理                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              Session                                    │
│  (hal/micam-core/Session.h/cpp)                                         │
│  • configureStreams() - 流配置                                          │
│  • processRequest() - 请求处理                                          │
│  • processResult() - 结果处理                                           │
│  • notify() - 通知处理                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  管理:                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐ │
│  │  RTProcessor    │  │  ZSLProcessor   │  │  PostProcessor集群      │ │
│  │  (实时预览)      │  │  (零快门延迟)    │  │                         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            CameraMode                                   │
│  (hal/micam-core/CameraMode.h/cpp)                                     │
│  • 模式管理 (Photo/Video/Pro模式等)                                     │
│  • buildConfigToVendor() - 构建厂商配置                                 │
│  • buildConfigToDarkroom() - 构建后期配置                               │
│  • createPreviewer() - 创建预览器                                       │
│  • createPhotographer() - 创建摄影师                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                ▼                                       ▼
  ┌─────────────────────────────┐        ┌─────────────────────────────┐
  │      Previewer (预览)        │        │    Photographer (拍照)       │
  └─────────────────────────────┘        └─────────────────────────────┘
                │                                       │
                ▼                                       ▼
  ┌─────────────────────────────┐        ┌─────────────────────────────┐
  │  RealtimePostProcessor      │        │  OfflinePostProcessor       │
  │  (实时后期处理)               │        │  (离线后期处理)              │
  └─────────────────────────────┘        └─────────────────────────────┘
                │                                       │
                └───────────────┬───────────────────────┘
                                ▼
          ┌─────────────────────────────────────────┐
          │         MialgoEngine (算法引擎)          │
          │  (mialgoengine/)                         │
          │  • MiaNode - 算法节点                    │
          │  • MiaPipeline - 管道管理                 │
          │  • MiaPluginModule - 插件管理             │
          └─────────────────────────────────────────┘
                                │
                                ▼
          ┌─────────────────────────────────────────┐
          │        Vendor HAL (厂商HAL)             │
          │  • MTK (hal/micam-policy/mtk/)          │
          │  • QCOM (hal/micam-policy/qcom/)        │
          └─────────────────────────────────────────┘
```

---

## 预览流程

```plaintext
Camera App
    │
    ▼ configureStreams(config)
CameraDevice → Session.configureStreams()
    │
    ▼ CameraMode.buildConfigToVendor()
Stream Configuration → Vendor HAL
    │
    ▼ processRequest(request)
Session → Previewer.buildRequestToDarkroom()
    │
    ▼ submitRequest()
Vendor HAL → Sensor获取数据
    │
    ▼ processResult(result)
Session → RealtimePostProcessor.processBuffer()
    │
    ▼ MiaAlgo Engine实时处理
    (ISP, 3A, 美颜等算法)
    │
    ▼ Surface绘制
Camera Framework → App显示
```

**关键文件:**

- `hal/micam-core/Previewer.h/cpp` - 预览请求处理
- `hal/micam-core/RealtimePostProcessor.h/cpp` - 实时后期处理
- `hal/micam-core/RTProcessor.h/cpp` - 实时处理器封装

---

## 拍照流程

```plaintext
Camera App 触发拍照
    │
    ▼ createCaptureRequest()
CameraDevice → Session.processRequest()
    │
    ▼ createPhotographer()
CameraMode → (根据模式选择Photographer类型)
    │
    ├─ SinglePhotographer - 单拍
    ├─ BurstPhotographer - 连拍
    ├─ HdrPhotographer - HDR拍摄
    ├─ SupernightPhotographer - 超级夜景
    ├─ BokehPhotographer - 人像虚化
    ├─ SuperHDPhotographer - 超高分辨率
    ├─ ProfessionalPhotographer - 专业模式
    ├─ FusionPhotographer - 多摄融合
    └─ SrPhotographer - 超分辨率
    │
    ▼ buildRequestToDarkroom()
Photographer → 构建离线处理请求
    │
    ▼ ZSLProcessor (如果启用ZSL)
从ZSL队列获取最新帧或直接拍摄
    │
    ▼ Vendor HAL → Sensor capture
获取拍照帧
    │
    ▼ PostProcessor.processBuffer()
离线后期处理
    │
    ▼ MiaAlgo Engine (多帧处理)
    • 多帧融合
    • 噪声抑制
    • 锐化增强
    • 色彩校正
    │
    ▼ JPEG编码
    │
    ▼ 保存到gallery
Result Callback → Camera Framework
```

**关键目录:**

```plaintext
hal/micam-core/photographers/     # 各类摄影师实现
├── SinglePhotographer.h/cpp
├── BurstPhotographer.h/cpp
├── HdrPhotographer.h/cpp
├── SupernightPhotographer.h/cpp
├── BokehPhotographer.h/cpp
├── SuperHDPhotographer.h/cpp
├── ProfessionalPhotographer.h/cpp
└── FusionPhotographer.h/cpp
```

**关键文件:**

- `hal/micam-core/PostProcessor.h/cpp` - 离线后期处理
- `hal/micam-core/OfflinePostProcessor.h/cpp` - 特殊功能离线处理
- `hal/micam-core/ZSLProcessor.h/cpp` - 零快门延迟处理

---

## 录像流程

```plaintext
Camera App 开启录像
    │
    ▼ configureStreams(video配置)
CameraDevice → Session.configureStreams()
    │
    ▼ CameraMode.buildConfigToVideoConfig()
配置Video Stream + Preview Stream
    │
    ▼ processRequest(video + preview)
Session → Previewer (处理预览和视频流)
    │
    ├─────────────┬─────────────────┐
    ▼             ▼                 ▼
Video Stream   Preview Stream    Quickview
    │             │                 │
    ▼             ▼                 ▼
Vendor HAL     RealtimePostProcessor   (拍照快照)
(编码前)      (实时预览处理)         QuickviewProcessor
    │             │                 │
    ├─────────────┴─────────────────┤
    ▼                           ▼
MediaCodec                   QuickviewPostProcessor
(H264/H265编码)               (快照后处理)
    │                           │
    ▼                           ▼
Video File                   保存快照
```

**关键文件:**

- `hal/micam-core/QuickviewProcessor.h/cpp` - 快照缓冲管理
- `hal/micam-core/QuickviewPostProcessor.h/cpp` - 快照后期处理
- `hal/micam-core/LiveQuickviewProcessor.h/cpp` - Live Photo处理

---

## 平台适配层

```plaintext
┌─────────────────────────────────────────────────────────────┐
│              共享核心层 (Core HAL)                            │
│  hal/micam-core/                                            │
└─────────────────────────────────────────────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
  ┌───────┐   ┌──────────┐   ┌─────────┐
  │  MTK  │   │   QCOM   │   │  xRING  │
  │Policy │   │  Policy  │   │ Policy  │
  └───────┘   └──────────┘   └─────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│              配置文件 (JSON Pipeline)                         │
│  external/odm/config/pipeline/{platform}/                    │
│  • *preview.json                                             │
│  • *video.json                                               │
│  • *offlinelivephoto.json                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 数据流总结

```plaintext
┌─────────────────────────────────────────┐
│              Camera App                  │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        CameraProvider/Device             │
│        (hal/micam-service/core)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│              Session                      │
│      (hal/micam-core/Session)            │
└───────────────┬─────────────────────────┘
                │
  ┌─────────────┼─────────────────────┐
  │             │                     │
┌─▼─────────┐  ┌─▼──────┐    ┌────────▼─────────┐
│ Previewer │  │Photo-  │    │ QuickviewProc    │
│ (预览流)   │  │grapher │    │ (录像快照)        │
└─┬─────────┘  └─┬──────┘    └────────┬─────────┘
  │             │                     │
┌─▼─────────┐  ┌─▼──────┐    ┌────────▼─────────┐
│Realtime   │  │Offline │    │ QuickviewPost    │
│PostProc   │  │Post    │    │ Proc             │
└─┬─────────┘  └─┬──────┘    └────────┬─────────┘
  │             │                     │
  └─────────────┼─────────────────────┘
                │
┌───────────────▼────────────────────┐
│       MiaAlgoEngine                │
│  (mialgoengine/)                   │
│  • ISP算法                         │
│  • 3A算法 (AE/AWB/AF)              │
│  • 多帧融合                         │
│  • 超分/降噪/HDR                   │
│  • 美颜/虚化                       │
└───────────────┬────────────────────┘
                │
┌───────────────▼────────────────────┐
│      Vendor HAL                    │
│  (MTK/QCOM/xRING)                  │
└─────────────────────────────────────┘
```

---

## 架构特点

1. **分层清晰** - 服务层、会话层、模式层、处理器层分离明确
2. **平台适配** - 通过Policy层适配不同平台(MTK/QCOM/xRING)
3. **插件化** - 通过Plugin Module支持各种算法扩展
4. **模式解耦** - Previewer和Photographer分别处理预览和拍照，便于扩展
