---
title: Mfnr Problem
tags:
  - debug
---

# SuperHdSnapshot_MfnrInstance0 Process Timeout 根因分析

## 一、问题描述

```log
03-29 18:39:28.469  1047 31625 32256 E MiAlgoEngine: [AlgoFwk] MiaNode.cpp:873 operator()() [Mivi-GuardMonitor][IMG_20260329_183849.HEIC][SuperHdSnapshot_MfnrInstance0] process timeout, tid:16535, frameNum:48 abort!
```

拍照图片 `IMG_20260329_183849.HEIC`（50MP SuperHD,
8192x6144）在 MFNR 多帧降噪节点处理超时，被 GuardMonitor 强制终止。

---

## 二、事件时间线

| 时间             | 事件                              | 说明                                                                                |
| ---------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| **18:38:49.276** | `CAPTURE-START` requestId:4       | 用户按下快门，开始捕获 IMG_20260329_183849.HEIC                                     |
| **18:38:49.632** | `onCaptureStarted` frameNumber:48 | HAL 开始曝光，帧号 48                                                               |
| **18:38:50.267** | `onCaptureCompleted`              | 传感器捕获完成，原始帧数据就绪                                                      |
| **18:38:50.387** | PostProcessor 收到输入请求        | 输入格式：`Heic_OfflineSnapshotSuperHD_Camera_4_input(8192x6144)_output(8192x6144)` |
| **18:38:50.845** | 锚帧确认                          | Anchor reference frame index: 0, vndFrame:48                                        |
| **18:38:52.045** | **MfnrInstance0 获取输入**        | 3 帧 source images (port0) + 3 帧 gainmap (port3)，输出 8192x6144                   |
| **18:38:52.640** | **MfnrInstance0 开始处理**        | `processRequest running`，在 tid:16535 上执行                                       |
| **18:38:58.441** | GuardMonitor 首次报警             | `Thread tid=16535 executed 5801ms(>5000ms) TOO LONG`                                |
| **18:38:59.448** | GuardMonitor 二次报警             | 已执行 6,808ms                                                                      |
| **18:39:01.512** | GuardMonitor 持续报警             | 已执行 8,873ms                                                                      |
| **18:39:03.100** | **FATAL 超时**                    | `pipeline:IMG_20260329_183849.HEIC, Node:MfnrInstance0 process timeout!`            |
| **18:39:03.730** | GuardMonitor 报警                 | 已执行 11,089ms                                                                     |
| **18:39:04.782** | GuardMonitor 报警                 | 已执行 12,142ms                                                                     |
| **18:39:05.796** | GuardMonitor 报警                 | 已执行 13,155ms                                                                     |
| **18:39:08.810** | GuardMonitor 报警                 | 已执行 16,163ms                                                                     |
| **18:39:09.810** | GuardMonitor 报警                 | 已执行 17,170ms                                                                     |
| **18:39:10.811** | GuardMonitor 报警                 | 已执行 18,170ms                                                                     |
| **18:39:28.461** | **SKYNET MIVI fail**              | return=153000007, `SuperHdSnapshot_MfnrInstance0 process timeout`                   |
| **18:39:28.469** | **最终 ABORT**                    | `tid=16535 executed 35769 ms`，frameNum:48 被强制终止                               |
| **18:39:28.614** | 节点销毁重建                      | `SuperHdSnapshot_MfnrInstance0` releasePipeline → destroy → re-init                 |

> **关键耗时**：MFNR processRequest 从 18:38:52.640 开始，到 18:39:28.469 被 abort，共计
> **35,769ms（~36 秒）**。

---

## 三、根因分析

### 根因 1：用户连续高速拍摄，后处理流水线严重积压

用户在 **18:37:32 ~ 18:38:56** 期间（约 90 秒内），以极高频率连续拍摄了 **30+ 张 50MP
SuperHD 照片**：

```plaintext
IMG_20260329_183732.HEIC
IMG_20260329_183735.HEIC
IMG_20260329_183737.HEIC
IMG_20260329_183742.HEIC
IMG_20260329_183743.HEIC
IMG_20260329_183745.HEIC
IMG_20260329_183746.HEIC
IMG_20260329_183749.HEIC
IMG_20260329_183750.HEIC
IMG_20260329_183752.HEIC
IMG_20260329_183757.HEIC
IMG_20260329_183758.HEIC
IMG_20260329_183800.HEIC
IMG_20260329_183802.HEIC
IMG_20260329_183803.HEIC
IMG_20260329_183804.HEIC
IMG_20260329_183805.HEIC
IMG_20260329_183817.HEIC
IMG_20260329_183822.HEIC
IMG_20260329_183826.HEIC
IMG_20260329_183827.HEIC
IMG_20260329_183828.HEIC
IMG_20260329_183835.HEIC
IMG_20260329_183839.HEIC
IMG_20260329_183849.HEIC  ← 超时的图片
IMG_20260329_183856.HEIC
```

每张 8192x6144 的图片都必须经过完整的后处理流水线：

```plaintext
MFNR (多帧降噪) → LDC (镜头畸变校正) → Depurple (去紫边) → Watermark (水印) → JPEG/HEIC 编码 → 写入存储
```

单个处理节点的耗时在正常情况下：

- swjpegInstance1：**207ms**
- LdcInstance：**184ms**
- MFNR：通常数秒（需要对 3 帧 50MP 图像进行多帧融合）

大量图片排队后处理，导致 CPU 持续满载运行。

Gallery 同时报告 **13+ 张图片** 处理超时：

```log
03-29 18:38:23.711  MiuiGallery2_ProcessingMediaManager: Media process timeout
  IMG_20260329_183732.HEIC / 183735 / 183742 / 183743 / 183745 / 183746
  / 183749 / 183750 / 183752 / 183758 / 183800 ...
```

---

### 根因 2：CPU 热节流（Thermal Throttling）激活，算力被强制降低

```log
[thermalbreak_verification] needbreak curr breakmode 2, scence id 0
set: boost:1 cpu0:2000000 cpu4:2900000 cpu7:3100000 cpumask:ff
```

| 项目                   | 状态                    |
| ---------------------- | ----------------------- |
| 热节流模式             | **breakmode 2**（激活） |
| 小核 (cpu0) 频率上限   | 2.0 GHz                 |
| 大核 (cpu4) 频率上限   | 2.9 GHz                 |
| 超大核 (cpu7) 频率上限 | 3.1 GHz                 |
| 热节流回调触发频率     | 每 50~150ms             |
| 温度传感器读取         | **多个组件读取失败**    |

热节流相关异常：

- `CamOpt_Service: get thermal fail` — 每 100~200ms 报错一次
- `ThermalMonitor.cpp:115 threadLoop() can't get current thermal` — 相机热监控线程无法读取温度
- `SkinTempMonitor: skin path error content:` — 皮肤温度传感器读取失败
- SELinux 拒绝 `hal_mimd_default` 访问
  `/sys/devices/virtual/thermal/thermal_message/board_sensor_temp`

> 连续拍摄导致设备严重发热，触发了 CPU 热节流。MFNR 作为计算密集型算法，在 CPU 降频的情况下处理速度大幅下降。

---

### 根因 3：CPU 压力极高（PSI 数据）

超时事件上报的 PSI（Pressure Stall Information）数据：

```log
PSI_10:(cpu:68.720 mem:15.670 io:2.410)
```

| 指标        | 值        | 含义                                                           |
| ----------- | --------- | -------------------------------------------------------------- |
| **CPU PSI** | **68.72** | 过去 10 秒内，**~69% 的时间**有任务因 CPU 不足而阻塞，**极高** |
| **Mem PSI** | **15.67** | 过去 10 秒内，~16% 的时间有任务因内存不足而阻塞，**偏高**      |
| **IO PSI**  | **2.41**  | IO 压力相对正常                                                |

CPU PSI 68.72 意味着系统处于严重的计算资源不足状态，绝大部分时间都有任务在等待 CPU 调度。

---

### 根因 4：内存压力导致进程大量被杀

系统在 18:38 期间积极回收内存，大量后台进程被杀死：

| 时间         | 被杀进程                                         | adj |
| ------------ | -------------------------------------------- | --- |
| 18:38:20.421 | `com.miui.gallery` (pid 20021)               | 250 |
| 18:38:26.359 | `com.google.android.apps.photos` (pid 18204) | 0   |
| 18:38:28.422 | `com.simactivate.service`                    | -   |
| 18:38:39.069 | `com.android.thememanager`                   | 700 |
| 18:38:39.858 | `com.miui.mediaeditor`                       | 700 |
| 18:38:39.871 | `com.miui.cloudservice:galleryproxy`         | 700 |
| 18:38:45~56  | Google Photos / AICore / Vending 等多个服务       | -   |

进程回收本身也消耗 CPU 资源，进一步加剧了系统负载。

---

### 根因 5：Binder 通信节流 + 系统调度延迟

**Binder 节流**：

```plaintext
Too many transaction errors, throttling freezer binder callback
```

Camera 应用（PID 10167）的 Binder 事务频繁出错并被节流，影响跨进程数据传递效率。

**系统调度延迟**：

```log
Slow dispatch (293ms), Slow delivery (255ms)
```

System Server 主线程出现显著的消息分发和投递延迟，整个系统响应能力下降。

**WakeLock 获取失败**：

```log
18:39:00.371  MiAlgoEngine: MIA_WAKELOCK_TIMEOUT fd=-1
```

MiAlgoEngine 无法获取 WakeLock，表明系统资源管理已处于异常状态。

---

## 四、因果链

```plaintext
用户在 ~90 秒内连续拍摄 30+ 张 50MP SuperHD 照片
                    │
                    ▼
    后处理流水线严重积压（MFNR / LDC / JPEG / HEIC 排队处理）
                    │
                    ▼
      CPU 长时间持续满载 → 设备温度急剧上升
                    │
                    ▼
    触发 Thermal Throttling（breakmode 2）→ CPU 频率被强制限制
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
  CPU PSI       Mem PSI        Binder 通信
  高达 68.72    达 15.67       被节流
  (严重不足)    (偏高)         (事务出错)
    │               │               │
    └───────┬───────┘               │
            ▼                       │
   系统开始杀后台进程 ◄─────────────┘
   (Gallery/Photos/CloudService 等)
            │
            ▼
   MFNR 对 3 帧 8192x6144 图像执行多帧融合降噪
   需要大量 CPU + 内存 + 带宽资源
   但这些资源全部处于受限状态
            │
            ▼
   tid:16535 执行 processRequest 持续 35,769ms 无法完成
            │
            ▼
   GuardMonitor 判定超时 → abort frameNum:48
```

---

## 五、结论

| 项目         | 说明                                                                                                                                                                                                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **直接原因** | `SuperHdSnapshot_MfnrInstance0` 在 tid:16535 上对 50MP 图像（3 帧 8192x6144）执行 MFNR 多帧降噪处理时，运行了 **35,769ms** 仍未完成，触发 GuardMonitor 超时保护机制（MiaNode.cpp:873）强制 abort                                                                                                                           |
| **根本原因** | 用户在短时间（~90 秒）内连续拍摄 30+ 张 50MP SuperHD 照片，导致：(1) 后处理流水线严重积压；(2) 持续高负载触发 **CPU 热节流**（breakmode 2），算力被强制降频；(3) **CPU PSI 高达 68.72**，系统计算资源严重不足；(4) 内存压力导致后台进程被大量杀死。MFNR 作为计算密集型算法，在资源全面受限的条件下无法在超时窗口内完成处理 |
| **影响**     | frameNum:48 对应的照片 `IMG_20260329_183849.HEIC` 的全分辨率 MFNR 后处理未完成，最终图片质量可能降级（仅保存了 quickview 预览质量的版本）；Gallery 后续也报告了该图片的媒体处理超时                                                                                                                                        |

---

## 六、建议排查方向

1. **MFNR 超时阈值是否合理**
   — 当前看到 FATAL 超时在 ~10s 触发，最终 abort 在 ~36s 触发，在热节流 + 高负载场景下是否应动态调整超时阈值
2. **连拍节流策略** — 在设备温度升高 /
   CPU 压力过大时，是否应限制用户的连拍速度或降低后处理质量等级（如从 MFNR 3 帧降为单帧）
3. **热节流感知** — 相机算法框架应能感知当前热节流状态（`thermal_level:0`
   表明相机侧未感知到热节流），据此调整处理策略
4. **温度传感器访问异常**
   — 多个组件读取温度传感器失败（SELinux 拒绝、路径读取错误），应排查传感器访问权限配置
5. **队列深度监控** — 在后处理队列积压到一定深度时提前预警或降级，避免最终超时 abort
