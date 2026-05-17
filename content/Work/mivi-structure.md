---
title: Global Structure
tags:
  - mivi
---

## Timeline

| Year | Version  | Main Problem                                                          | Main Change                 | Platform             |
| ---- | -------- | --------------------------------------------------------------------- | --------------------------- | -------------------- |
| 2018 | MIVI 1.0 | 1. 解决拍照速度慢的问题<br>2. 新项目适配周期长                                          | 1. 拍照异步后处理<br>2. 将算法与HAL解耦  | QCOM                 |
| 2021 | MIVI 2.0 | 1. 同时维护miui & 三方两套<br>2. 多帧拍照受高频AIDL/HIDL影响，性能差<br>3. 与平台耦合性高，无法下放ODM | 1. 三方能力开放<br>2. 跨平台         | QCOM                 |
| 2023 | MIVI 3.0 | 1. 预览算法没有上移动<br>2. 没有跨平台，人力无法复用                                       | 1. ZSLQ上移<br>2. Streaming上移 | QCOM<br>MTK<br>XRing |

### MIVI 1.0

1. V1.0 ![[structure 2025.excalidraw#^frame=MIVI1|800]]
   - 新增：
     1. post processor
     2. miaframework
     3. vt camera: 安卓原生的reprocess逻辑，capture request是穿插在preview
        request中间，可能会导致预览卡顿问题
        1. 拍照与预览解耦
        2. 两个拍照之间解耦
1. V1.5 ![[structure 2025.excalidraw#^frame=MIVI1.5|800]]

### MIVI 2.0

![[structure 2025.excalidraw#^frame=MIVI2|800]]

### MIVI 3.0

![[structure 2025.excalidraw#^frame=MIVI3|800]]

#### Folder Structure

| One-stage Module | Two-stage Module      | Desc                                                                                                                                  |
| ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| hal              | micam-service         | ICameraProvider -> AidlCameraProvider                                                                                                 |
|                  | micam-halif           | AidlCameraProvider -> IMicamProvider                                                                                                  |
|                  | micam-core            | IMicamProvider -> MiCameraProvider                                                                                                    |
|                  | adapter               | - mtk: MiCameraProvider -> AdapterProvider -> **IMtkcamProvider**<br>- qcom: MiCameraProvider -> AdapterProvider -> **camera_module** |
| mialgoengine     | session/pipeline/node |                                                                                                                                       |
| immune-system    |                       |                                                                                                                                       |

1. micam-core
   1. photographer
      1. 构造 vendor request
      2. 下发vendor request
      3. 接收 result buffers
      4. 接收 result meta
      5. 接收 result notify

#### Second-Order Logic

![[structure 2025.excalidraw#^frame=mivi3_skyview|800]]

## Knowledge Sharing

### 第一期: mialgoengine知识分享

### 第二期: capture 流程分享

- `adb logcat | grep -Ei "photographer|asyncConfigDarkroom|finalizeRequest|prepareZSLQueue|updateFramesToContext|notifyProcPendingCapture|procPendingCaptureLoop|collectFrames|processDarkroomResult|resultCallback|BGServiceClient|processOutputRequest|MockCameraSession.*processCaptureResult"`
