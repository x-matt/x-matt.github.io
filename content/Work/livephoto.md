---
title: Live Photo Architecture
tags:
  - livp
---

## 📋 项目概览

Live Photo 是小米相机的动态照片功能，通过多帧采集+后期处理实现防抖、画质增强和创意效果。

### 核心目标

- **画质提升**: 从 1080P 升级到 1440P 分辨率
- **防抖增强**: 基于 EIS 的多帧融合防抖
- **默认开启**: 优化 PPM，提升用户体验
- **封面一致性**: 确保预览与成片效果一致

## 🏗️ 架构设计

### 1. 整体架构分层

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                        APP Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Camera UI    │  │ Preview      │  │ Album        │     │
│  │              │  │ Display      │  │ Playback     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓ AIDL
┌─────────────────────────────────────────────────────────────┐
│                   Service/Framework Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Camera       │  │ LivePhoto    │  │ Image Queue  │     │
│  │ Service      │  │ Manager      │  │ Manager      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓ HAL3
┌─────────────────────────────────────────────────────────────┐
│                      HAL/Driver Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ QCOM HAL     │  │ EIS Node     │  │ FB Node      │     │
│  │              │  │ (YuvEis)     │  │ (Dual-FB)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓ ISP
┌─────────────────────────────────────────────────────────────┐
│                      Hardware Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Sensor       │  │ ISP          │  │ DSP/NPU      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2. 数据流架构

#### 2.1 采集阶段 (Capture Phase)

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                    Live Photo Pipeline                      │
└─────────────────────────────────────────────────────────────┘

Sensor → ISP → EIS Node → FB Node → Buffer Queue
   ↓         ↓          ↓          ↓          ↓
RAW    → YUV   → Stabilized → Enhanced  → Stored
Frame  → Frame → Frame      → Frame     → Frames
(90帧)  (90帧)  (90帧)      (90帧)      (90帧)

Key Operations:
- EIS: Electronic Image Stabilization (电子防抖)
- FB: Face Beauty (美颜)
- LDC: Lens Distortion Correction (镜头畸变校正)
```

#### 2.2 后期处理阶段 (Post-Processing)

```plaintext
┌─────────────────────────────────────────────────────────────┐
│              Offline Post-Processor Architecture            │
└─────────────────────────────────────────────────────────────┘

Input Frames (YUV)
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Frame Selection & Alignment                                │
│  - Motion Analysis                                           │
│  - Feature Matching                                          │
│  - Frame Registration                                        │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Multi-Frame Fusion                                         │
│  - Weighted Averaging                                        │
│  - Ghosting Removal                                          │
│  - Detail Enhancement                                        │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Post-Processing                                            │
│  - Face Beauty (FB)                                         │
│  - Color Grading                                            │
│  - Noise Reduction                                          │
│  - Sharpening                                               │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Encoding & Packaging                                       │
│  - H.264/H.265 Encoding                                     │
│  - Metadata Attachment                                      │
│  - File Generation (.mp4)                                   │
└─────────────────────────────────────────────────────────────┘
    ↓
Output: Final Live Photo File
```

### 3. Component Architecture

#### 3.1 LivePhoto Manager

**Responsibilities:**

- Feature toggle management
- Mode selection (v2.0, v2.5, v4.0)
- Capability negotiation
- Error handling

**Key Interfaces:**

```cpp
interface ILivePhotoManager {
    bool isSupported();
    void startSession();
    void stopSession();
    void configure(config);  // resolution, fps, mode
    void onFrameAvailable(buffer);
}
```

#### 3.2 EIS Node (YuvEis)

**Responsibilities:**

- Motion vector calculation
- Frame stabilization
- Gyro data fusion

**Configuration:**

- **v2.0**: Per-frame processing
- **v2.5**: Batch processing (90 frames)
- **v4.0**: Adaptive mode

**Performance:**

- Target: <3ms per frame
- Buffer: 90 frames (3s @ 30fps)

#### 3.3 FB Node (Dual-FB)

**Responsibilities:**

- Face detection
- Beauty algorithm application
- Skin smoothing
- Feature enhancement

**Dual Mode:**

- **Preview FB**: Real-time, low-res
- **Capture FB**: High-res, quality-focused

#### 3.4 Image Queue Manager

**Responsibilities:**

- Buffer allocation/deallocation
- Queue synchronization
- Memory optimization
- QuickView integration

**Queue Structure:**

```plaintext
┌─────────────────────────────────┐
│  Active Queue (90 frames)       │
│  - Raw frames                   │
│  - EIS processed                │
│  - FB processed                 │
└─────────────────────────────────┘
         ↓ Dequeue
┌─────────────────────────────────┐
│  Post-Processor Input           │
│  - Selected frames              │
│  - Metadata                     │
└─────────────────────────────────┘
```

#### 3.5 Offline Post-Processor

**Architecture:**

```plaintext
┌─────────────────────────────────────────┐
│  OfflinePostProcessor                   │
│  ┌───────────────────────────────────┐  │
│  │  RequestExecutor                  │  │
│  │  - Frame selection                │  │
│  │  - Alignment                      │  │
│  │  - Fusion                         │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  MiaSession                       │  │
│  │  - MI algorithm interface         │  │
│  │  - Hardware acceleration          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  ThreadPool                       │  │
│  │  - Parallel processing            │  │
│  │  - Priority management            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Processing Flow:**

1. **Input**: Dequeue frames from Image Queue
2. **Selection**: Choose optimal frames based on motion/blur
3. **Alignment**: Register frames to reference coordinate
4. **Fusion**: Weighted merge with ghosting removal
5. **Post-process**: Apply FB, LDC, color grading
6. **Encode**: Compress to final format
7. **Output**: Deliver to Album/Storage

### 4. Version Evolution

#### v2.0 (Baseline)

- **Resolution**: 1080P (1440x1080)
- **Processing**: Per-frame EIS
- **Limitation**: Performance bottleneck, memory overhead

#### v2.5 (Current)

- **Resolution**: 1440P (1920x1440)
- **Processing**: Batch mode (90 frames)
- **Optimization**:
  - FB Node size reduction (1440P → 1080P)
  - QuickView queue reuse
  - EIS not per-frame

**Resolution Mapping:**

| Aspect Ratio | Input     | Output    |
| ------------ | --------- | --------- |
| 4:3          | 1920x1440 | 1728x1296 |
| 1:1          | 1440x1440 | 1296x1296 |
| 16:9         | 2560x1440 | 2304x1296 |
| Full         | 3200x1440 | 2880x1296 |

#### v4.0 (Roadmap)

- ~~**Default ON**: Seamless UX~~
- ~~**Auto Mode**: Motion-adaptive toggle~~
- ~~**50M Support**: High-resolution capture~~
- **PPM Optimization**: Startup time improvement
- **Consistency**: Preview ↔ Final output alignment

![[livephoto 2025.excalidraw#^frame=livp4|700]]

### 5. Performance Architecture

#### 5.1 Latency Budget

```plaintext
Total Capture-to-Preview: ~500ms
├─ Frame Collection: 3000ms (90 frames @ 30fps)
├─ Buffer Transfer: 50ms (AIDL)
├─ Post-Processing: 120ms (EIS + Fusion)
├─ Encoding: 30ms
└─ File Write: 100ms
```

#### 5.2 Memory Architecture

```plaintext
Memory Pool (estimated 200MB)
├─ Frame Buffer: 90 × 1920×1440 × 1.5 bytes ≈ 37MB
├─ EIS Working: 2 × 1920×1440 × 1.5 bytes ≈ 8MB
├─ FB Working: 2 × 1080×1080 × 1.5 bytes ≈ 3.5MB
├─ Fusion Buffer: 1920×1440 × 1.5 bytes ≈ 4MB
└─ Codec Buffer: ≈ 150MB (H.265)
```

#### 5.3 Performance Risks & Mitigation

| Risk                  | Impact | Mitigation                          |
| --------------------- | ------ | ----------------------------------- |
| YuvEis高频调用 (90次) | High   | Batch optimization, DSP offload     |
| FB高频调用 (90次)     | High   | Dual-FB reduction, NPU acceleration |
| 回图延迟增加          | Medium | Async queue, priority scheduling    |
| Memory pressure       | Medium | Dynamic buffer allocation           |

### 6. Integration Architecture

#### 6.1 AIDL Interface

```java
interface ILivePhotoService {
    // Initialization
    void init(Surface previewSurface, Surface recordSurface);

    // Configuration
    void setMode(int mode);  // 2.0, 2.5, 4.0
    void setResolution(int width, int height);
    void enableFeature(int feature);  // EIS, FB, LDC

    // Frame Flow
    void onFrameInput(FrameBuffer buffer, Metadata meta);
    void onFrameOutput(FrameBuffer buffer);

    // Control
    void start();
    void stop();
    void flush();

    // Callback
    void onResult(LivePhotoResult result);
    void onError(int errorCode);
}
```

#### 6.2 Mock Camera Integration

**Challenge**: Need continuous frame stream for processing

**Solution:**

1. **Repeating Request**: Modify framework to maintain capture
2. **New Instance**: Create dedicated MockCamera for LivePhoto
3. **Surface Management**: Separate preview/record surfaces

**Architecture:**

```plaintext
Camera App → MockCamera Service → LivePhoto Service
                ↓ (repeating req)      ↓ (frame stream)
           Preview Surface      Image Queue Manager
```

#### 6.3 Feature Combination

**Pipeline:**

```plaintext
Raw Frame
    ↓
┌─────────────────┐
│  EIS (Stabilize)│
└─────────────────┘
    ↓
┌─────────────────┐
│  FB (Beauty)    │
└─────────────────┘
    ↓
┌─────────────────┐
│  LDC (Correct)  │
└─────────────────┘
    ↓
Processed Frame
```

**Order Matters:**

1. EIS first (motion correction)
2. FB second (beauty on stable frame)
3. LDC last (lens correction)

### 7. Exception Handling Architecture

#### 7.1 Error Scenarios

```plaintext
┌─────────────────────────────────────────┐
│  Exception Handler                      │
├─────────────────────────────────────────┤
│  1. Camera Exit                         │
│     → Flush queue                       │
│     → Release buffers                   │
│     → Save partial result               │
│                                          │
│  2. Scene Switch                        │
│     → Reconfigure pipeline              │
│     → Clear old frames                  │
│     → Reset EIS state                   │
│                                          │
│  3. Frame Drop                          │
│     → Adaptive frame selection          │
│     → Skip to next valid frame          │
│     → Log for analysis                  │
│                                          │
│  4. Memory Pressure                     │
│     → Reduce buffer count               │
│     → Lower resolution                  │
│     → Emergency flush                   │
└─────────────────────────────────────────┘
```

#### 7.2 Recovery Strategy

| Scenario           | Detection              | Action               | User Impact |
| ------------------ | ---------------------- | -------------------- | ----------- |
| Frame drop >20%    | Frame count monitoring | Reduce buffer size   | Minimal     |
| Processing timeout | Timer (500ms)          | Skip frame, continue | Minimal     |
| Memory full        | System callback        | Drop oldest frames   | Noticeable  |
| Hardware error     | HAL callback           | Fallback to v2.0     | Significant |

### 8. Debug & Monitoring Architecture

#### 8.1 Debug Tags

| Tag                                                       | Purpose        | Example |
| --------------------------------------------------------- | -------------- | ------- |
| `vendor.debug.camera.liveshot.version`                    | Version info   | `2.5`   |
| `capabilities.videoStabilization.isLivePhotoEISSupported` | HAL capability | `true`  |
| `com.liveshot.enabled`                                    | Feature toggle | `1`     |

#### 8.2 Performance Monitoring

```plaintext
┌─────────────────────────────────────────┐
│  Metrics Collector                      │
├─────────────────────────────────────────┤
│  • Frame latency (push/pop)             │
│  • Processing time per stage            │
│  • Memory usage peak                    │
│  • Buffer queue depth                   │
│  • Error rate                           │
│  • User-perceived latency               │
└─────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────┐
│  Analytics Dashboard                    │
│  - Real-time monitoring                 │
│  - Trend analysis                       │
│  - Alert system                         │
└─────────────────────────────────────────┘
```

#### 8.3 Bypass Mechanisms

```bash
# YuvEis Bypass
adb shell dumpsys activity service com.cameramind/com.cameramind.CameraMindService -algoByPassControl LIVEPHOTO_EIS 2

# FB Bypass
adb shell setprop vendor.debug.camera.liveshot.fb.bypass 1

# Force Version
adb shell setprop vendor.debug.camera.liveshot.version 2.5
```

### 9. Optimization Strategies

#### 9.1 Frame Rate Optimization

**Problem**: EV list causes stuttering

**Solution:**

```plaintext
HDR Sequence (Before):
ev-- → ev- → ev0 → ev-- → ev+
5 frames → 167ms

Optimized (After):
ev- → ev0 → ev+
3 frames → 100ms
Reduction: 40%
```

#### 9.2 High Frame Rate Interpolation

- Capture: 60fps
- Display: 120fps
- Interpolation: Motion-compensated frame generation

#### 9.3 EV- Preview

- Send EV- frames early for preview
- Reduce perceived latency
- Async processing

### 10. Future Roadmap

#### 10.1 v4.0 Enhancements

1. **AI-Enhanced Fusion**
   - ML-based frame selection
   - Semantic segmentation for selective processing

2. **Cloud Processing**
   - Offload heavy processing to cloud
   - Progressive enhancement

3. **Real-time Preview**
   - Live preview of final effect
   - WYSIWYG capture

4. **Smart Mode Detection**
   - Gyro + accelerometer fusion
   - Auto toggle based on motion intensity

#### 10.2 Technical Debt

- [ ] Refactor EISNode initialization
- [ ] Standardize AIDL interfaces
- [ ] Improve error recovery
- [ ] Add comprehensive unit tests
- [ ] Document all configuration parameters

## 📝 Project Management

### Active Tasks

> [!todo]
>
> - [x] Dual-FB based on O1 performance research (2025-02-11 → 2025-02-12)
> - [ ] EISv3 solution research
> - [ ] Confirm OPPO LivePhoto EIS flow logic
> - [x] Hand-raise detection in ASD @Li Ya
> - [x] Out-of-order issue mitigation @Tang Han Sheng
> - [x] LivePhoto + ZoomEIS logic @Wang Yue ✅ 2025-03-15
> - [x] EISNode init exception fix
> - [x] Combine AIDL validation
> - [x] Pre-enable YuvEIS ✅ 2025-03-08

### Open Questions

> [!question]
>
> 1. What is the callback timing in v2.0方案, and what's the exact logic?
> 2. How to handle error after dequeue in AIDL flow?

### Performance Metrics (OPPO Find X8 Pro Reference)

`SUPER_EIS_JNI` Performance:

| Status     | Frame Range | Time Cost | Notes               |
| ---------- | ----------- | --------- | ------------------- |
| Push       | 31-60       | 96ms      | Initial buffer fill |
| Push & Pop | 61-90       | 3ms/frame | Steady state        |

**Flow:**

1. Frames 31-59: Push only (buffering)
2. Frames 60+: Push & Pop (continuous)

### Patch Status

| Module        | Status  |
| ------------- | ------- |
| processor     | Pending |
| postprocessor | Active  |
| appsurface    | Active  |

**Branch Strategy:**

- Master → O1-CAM
- Key changes:
  ```cpp
  mMiaSession = getMiaOfflineSessionInstance(mSignature);
  mThread = std::make_unique<ThreadPool>(RTSULTTHREADNUM, -3);
  ```

---

_Last Updated: 2026-03-18_ _Architecture Version: 4.0_ _Document Status: Active_
