---
title: MIVI V3.0 - MIVI3
type: area
domain: work
category: platform
status: active
priority:
review:
tags:
  - mivi
---

## Software Architecture and Interface Preview

### Basic Client-Server Mechanism

![[structure 2025.excalidraw#^frame=client-server architecture|600]]

### Total Logic

1. AOSP + MTK ![[structure 2025.excalidraw#^frame=AOSP-MTK|700]]
2. AOSP +MI +MTK/QCOM/XRING ![[structure 2025.excalidraw#^frame=AOSP-MI-Platform|700]]

| Interface         | AOSP Camera AIDL Interface | MI Camera HAL Interface | MTK Camera HAL Interface | QCOM Camera HAL Interface |
| ----------------- | -------------------------- | ----------------------- | ------------------------ | ------------------------- |
| IProvider         | ICameraProvider            | IMicamProvider          | IMtkcamProvider          |                           |
| IProviderCallback | ICameraProviderCallback    | IMicamProviderCallback  | IMtkcamProviderCallback  |                           |
| IDevice           | ICameraDevice              | IMicamDevice            | IMtkcamDevice            |                           |
| IDeviceSession    | ICameraDeviceSession       | IMicamDeviceSession     | IMtkcamDeviceSession     |                           |
| IDeviceCallback   | ICameraDeviceCallback      | IMicamDeviceCallback    | IMtkcamDeviceCallback    |                           |

## Implementation Details

### Module Intro

| Usage         | Name                                                     | Desc |
| ------------- | -------------------------------------------------------- | ---- |
| Executor      | Photographer/Previewer/OfflineArchiver                   |      |
| Porcessor     | ZSLProcessor/RTProcessor/QuickViewProcessor              |      |
| PostProcessor | Postprocessor/RealtimePostprocessor/OfflinePostprocessor |      |

#### VendorCamera

1. open

   ```cpp
   int VendorCamera::open(const std::shared_ptr<micam::IMicamDeviceCallback> &callback, std::shared_ptr<micam::IMicamDeviceSession> &session)
   {
    // 1. create VendorCameraSession
    auto misession = std::make_shared<VendorCameraSession>(this);

    // 2. open Adapter IMicamDevice
    std::shared_ptr<micam::IMicamDeviceSession> halSession = nullptr;
    auto status = mDevice->open(misession, halSession);

    // 3. open VendorCameraSession
    status = misession->open(halSession);
   }
   ```

#### Session

1. configure
   ```mermaid
   sequenceDiagram
       autonumber
       VendorCameraSession ->> Session : configureStreams()
       Session ->> +CameraMode : createCameraMode()
       CameraMode ->> CameraMode : buildFwkConfiguration()
       CameraMode ->> -Session : TODO
       Session ->> +ZSLQ : createZSLQueues()
       ZSLQ ->> -Session : TODO
       Session ->> Session : createStreamingDarkroom()
       Session -) RealtimePostProcessor : configureStreams()
       RealtimePostProcessor --) Session : OK(0)
   ```
2. process
   ```mermaid
   sequenceDiagram
       autonumber
       VendorCameraSession ->> Session : processRequest()
       Session ->> Session : longExposureSetting()
       alt isSnapshot && !mFirstFrameArrived
           Session ->> Session : createDarkroom()
           Session -) PostProcessorManager : configureStreams()
           PostProcessorManager --) Session : return
       end
       Session ->> Session : processVendorRequest()
   ```

#### Photographer

![[structure 2025.excalidraw#^frame=photographer|600]]

- 功能
  1. 构造vendor requests
  2. 下发vendor requests
  3. 接收所有result

#### PostProcessor

- capture: 1-session ~ N-photpgrapher ~ 1-DARKROOM ~ N-cap_postprocessor
- streaming: 1-session ~ N-previewer ~ 1-DARKROOM ~ 1-stream_postprocessor

#### MockCamera
