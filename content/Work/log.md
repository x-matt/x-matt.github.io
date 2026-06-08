---
title: Log
---

## Log Filter

### Camera Hal

#### Time Domain (⚗️)

| stage   | usage                   | Common/Mivi                                                    | MTK | Qcom |
| ------- | ----------------------- | -------------------------------------------------------------- | --- | ---- |
| open    | camera connect          | `CameraService.*connect`                                       |     |      |
| init    | config streams          | `configureStreams\|buildGraph\|MiCamService.*configureStreams` |     |      |
|         | sensor mode #sensormode | `select size\|getSensorSize.*sensorId.*sensorSize`             |     |      |
| process | links                   | `rebuildLinks\|onDispatchFrame\|makeIO_YuvMcnr.*outputMain`    |     |      |
|         | processing time         | `Plugin processRequest spend time`                             |     |      |
|         | return error            | `buffer is blocked`                                            |     |      |
| close   | camera disconnect       | `CameraService.*Disconnected`                                  |     |      |

#### Spatial Domain (🎨)

| platform | module | key words                                                                              |
| -------- | ------ | -------------------------------------------------------------------------------------- |
| mivi     | his    | - `HisPluginV2.cpp\|HISV2_PREV`<br>- `HisPluginV3.cpp\|HISV3_REC`                      |
| mtk      | mcnr   | - mivi: `VideoReprocPipe::enque Start, reqNo`<br>- old flow: `Queue Request End.*S_ME` |
|          | wpe    | - `ConfigWPE`<br>- `makeConfig_YuvMcnr`<br>- `PerFrameWPE`                             |
|          | sat    | -`MI_SAT`                                                                              |

### Camera App

`CAM_RecordingState`

### Video Codec

`MediaRecorder|MPEG4Writer`

### Display

`adb shell "dumpsys SurfaceFlinger | grep fps"`

## Log Switch

| platform | module         | property                                                                                                                       | remark              |
| -------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| app      | close screen   | `adb shell setprop hibernation_time 175000`<br>`adb shell am force-stop com.android.camera`                                    |                     |
| mivi     | general        | `adb shell setprop persist.vendor.mtk.camera.log_level 3`<br>`adb shell setprop persist.vendor.camera.mivi.groupsEnable 0xfff` |                     |
|          | timeout report | `adb shell setprop persist.vendor.camera.debug.reqabortenable 1`                                                               |                     |
|          | draw           | `adb shell setprop vendor.debug.cam.mivi.draw.enable 1`<br>`adb shell setprop vendor.debug.cam.mivi.draw.ctrl 'MAGIC'`         |                     |
| mtk      | wpe            | `adb shell setprop vendor.debug.camera.coredevice.wpe.dump 1`                                                                  |                     |
|          | vse            | `adb shell setprop vendor.debug.camera.coredevice.stream.dump 1`                                                               |                     |
| qcom     |                |                                                                                                                                |                     |
| sensor   | force dxg      | `adb shell setprop vendor.debug.camera.curSensorScenario 12`                                                                   | 1-fake_14<br>12-dxg |

## Log Introduction

### Qcom

![[qcom#LOG]]

==OLD_VERSION==

## 关键字

| 关键字                                            | 解释                                                                                      | 平台 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- |
| `+ sensor`                                        | SFP init 阶段--TPIMgr_PluginWrapper.cpp 中 createsession，查看 P2 的输入输出 size，margin | MTK  |
| `CAM_RecordingState\|MediaRecorder\|MPEG4Writer`  | 查看录像启停状态                                                                          | MTK  |
| `create pipe\|destroy pipe\|UsageHint mDualMode=` | FeaturePipe 的创建和销毁                                                                  | MTK  |
| `getOperatingMode`                                | 获取 operationmode                                                                        | MTK  |
| `prepareIORequest`                                | 查看初始化配置信息                                                                        | MTK  |

### MTK关键字

- A: init
- B: config
- C: process

| Tag                                 | KeyWord                              |
| ----------------------------------- | ------------------------------------ |
| CAM_CameraScreenNail                | onFrameAvailable first frame arrived |
| MtkCam/P1NodeImp                    | mpCamIO                              |
| MtkCam/StreamingPipe/P2SWNode       | -                                    |
| MtkCam/StreamingPipe/Pipe           | prepareIORequest                     |
| MtkCam/StreamingPipe/TPINode        | -                                    |
| MtkCam/StreamingPipe/TPI_MGR_Plugin | genFrame                             |
| MtkCam/StreamingPipe/VMDPNode       | -                                    |
| MtkCam/ppl_context                  | dump                                 |
|                                     | dispatch                             |
|                                     | makeAppImageStreamBuffer             |
|                                     | onDispatchFrame                      |
|                                     | releaseAction                        |
|                                     | sendFrameToRootNodes                 |
| mtkcam-AppStreamMgr                 | convertCallbackParcelToHidl          |
| mtkcam-FeatureSettingPolicy         | evaluateStreamConfiguration          |
| mtkcam-P1HwSettingPolicy            | -                                    |
| mtkcam-PipelineModelSession         | submitRequest                        |
| mtkcam-dev3-hidl                    | convertStreamConfigurationFromHidl   |
| mtkcam-dev3-utils                   | beginConfigureStreams                |

### Qcom关键字

| 关键字               | 描述                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| FinalizeBuffer       | sensor 的图像经过 ife、ipe 后会有 downscaler 和 crop，使用该关键字可以                                        |
| FindBestSensorMode   | 可查出 cameraId 对应的 sensor 的分辨率                                                                        |
| GetMatchingUsecase   | 这个关键字会给出选择的 usecaseID，usecaseID 在 chxusecaseutils.cpp 中进行了定义                               |
| IFE input            | 查看 ife 的 input 的 size，也就是 sensor 的输出                                                               |
| faceonlock           | 可以查看人脸解锁的时间                                                                                        |
| operationmode        | 查看下发的 operationmode                                                                                      |
| streamingon          | 使用的 pipeline                                                                                               |
| usecase              | `adb logcat \| grep "camxnode.cpp:1037 Initialize()"`                                                         |
| 查看 pipeline        | `adb logcat \| grep -Eia "topology" \| awk '{if($14~"Link"){{for(i=14;i<21;++i)printf " %s ", $i}print ""}}'` |
| OnPipelineSelect     | pipeline选择                                                                                                  |
| ProcessRequestIdDone | node处理情况                                                                                                  |

## MTK

### 软件抓Log

1. `*#*#3646633#*#*`
2. `adb pull sdcard/debuglogger/mobilelog/.`：提取命令

### 抓取 db 文件

```bash
adb wait-for-device
adb root
adb wait-for-device
adb shell setenforce 0
adb shell setprop persist.vendor.mtk.aee.mode 3
adb shell setprop persist.vendor.mtk.aeev.mode 3
adb shell setprop persist.vendor.aeev.core.direct enable
adb shell setprop persist.vendor.aeev.core.dump enable
adb reboot
```

**使用方法：**

1. 执行aee.bat 抓取db.03.NE log（打开mobile log 且enable tag log）
2. `adb pull /data/aee_exp` 或者 `/sdcard/mtklog/aee_exp`
3. 右键QAAT-Check 解析db.03.NE.dbg文件
4. 查看\_exp_detail.txt log分析

### Log Level

1. 预操作

   ```bash
   adb shell setenforce 0
   adb shell setprop persist.vendor.mtk.camera.log_level 3
   adb shell pkill camera*
   ```

1. MTK Camera2 APP

   ```bash
   adb root
   adb shell setprop vendor.debug.mtkcam.loglevel 3
   ```

1. Camera Device HAL3

   ```bash
   adb root
   adb shell setprop debug.camera.log.CameraDevice3 2
   # dump session param in configure stage
   # log requests from framework
   # log results from pipeline
   ```

   - 在 Log 中搜索 tag: `mtkcam-dev3`

1. AppStreamMgr

   ```bash
   adb root
   adb shell setprop vendor.debug.camera.log.AppStreamMgrX
   # X>=1, dump per-frame callback image/meta/shuttererror message
   # X>=2, dump per-frame control metadata
   # X>=3, dump per-frame result metadata
   ```

   - 在 log 中搜索 tag：`mtkcam-AppStreamMgr`
   - 会有关键 log：`mtkcam-AppStreamMgr:[x-CallbackHandler::performCallback]`

1. Pipeline

   ```bash
   adb root
   adb shell setprop persist.vendor.debug.camera.log X
   adb reboot
   # X>=2, Log every IPipelineFrame settings
   # X>=3, Log every IPipelineFrame settings and its PipelineContext
   ```

   - 在 log 中搜索 tag：`mtkcam-PipelineFrameBuilder`
   - 有关键 log：`mtkcam-PipelineFrameBuilder: App image stream buffers=`

1. P1Node

   ```bash
   adb root
   adb shell setprop vendor.debug.camera.log.p1node 3
   ```

   - For userdebug load
     - 有关键 log：`mtkcam-PipelineFrameBuilder: App image stream buffers=`
     - adb shell setprop vendor.debug.camera.log.p1nodei 3
   - For user load
     - 有关键 log：`MtkCam/P1NodeImp: [setupAction]`
     - 在 log 中搜索 tag: `MtkCam/P1NodeImp`

1. Preview/Record 时 P2S

   ```bash
   # 开 P2StreamingNode 下 StreamingFeaturePipe 层以上
   # (包括 DispatchProcessor/StreamingProcessor)的 log：
   adb root
   adb shell setprop vendor.debug.mtkcam.p2.log 1
   # Open per-frame I/O buffer & cropper info
   adb shell setprop vendor.debug.trace.p2.{MODULE} 1
   # Open module’s trace log, such as P2Util / StreamingProcessor
   # 开 StreamingFeaturePipe log：
   adb root
   adb shell setprop vendor.debug.fpipe.force.printio 1
   adb shell setprop vendor.debug.tpi.s.log 1
   ```

1. Capture 时 P2C

   ```bash
   adb root
   adb shell setprop vendor.debug.camera.capture.log 3
   ```

1. JpegNode

   ```bash
   adb shell setprop vendor.debug.camera.log.JpegNode 2
   ```

1. force enable MFNR，MFNR 相关的 log

   ```bash
   # force enable MFLL:
   adb root
   adb shell setprop vendor.mfll.force 1
   # 开 MFNR 相关的 log:
   adb shell setprop vendor.mfll.log_level 3
   adb shell pkill camerahalserver
   adb shell pkill cameraserver
   ```

1. FD

   ```bash
   adb shell setprop vendor.debugcamera.log 0
   adb shell setprop vendor.debug.camera.log.FDNode 3
   ```

1. PQ

   ```bash
   adb root
   adb wait-for-device
   adb shell setenforce 0
   adb logcat -G 200M
   adb logcat -c
   adb shell setprop log.tag.PQ VERBOSE
   adb shell setprop persist.log.tag.PQ VERBOSE
   adb shell lshal debug vendor.mediatek.hardware.pq@2.3::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 0x7
   adb shell lshal debug vendor.mediatek.hardware.pq@2.4::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 0x7
   adb shell lshal debug vendor.mediatek.hardware.pq@2.5::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 0x7
   adb shell lshal debug vendor.mediatek.hardware.pq@2.6::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 0x7
   adb shell lshal debug vendor.mediatek.hardware.pq@2.7::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 0x7
   adb shell setprop persist.vendor.logmuch false
   adb shell "echo 2 > /proc/mtprintk"
   ```

1. MDP & PQ

   ```bash
   adb root
   adb shell setprop vendor.dp.frameChange.disable 1
   adb shell setprop vendor.dp.log.enable 1
   adb shell setprop persist.log.tag.PQ VERBOSE
   adb shell setprop persist.vendor.logmuch false
   adb shell setprop vendor.dp.log.enable 1
   adb shell "pidof surfaceflinger | xargs kill"
   adb shell "pidof cameraserver | xargs kill"
   adb shell "pidof camerahalserver | xargs kill"
   adb shell "pidof media.codec | xargs kill"
   adb shell "pidof android.hardware.graphics.composer@2.1-service | xargs kill"
   adb shell "pidof android.hardware.graphics.composer@2.2-service | xargs kill"
   adb shell "pidof vendor.mediatek.hardware.mms@1.5-service | xargs kill"
   adb shell lshal debug vendor.mediatek.hardware.pq@2.3::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 7
   adb shell lshal debug vendor.mediatek.hardware.pq@2.4::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 7
   adb shell lshal debug vendor.mediatek.hardware.pq@2.5::IPictureQuality --pqparam_debug_property vendor.debug.pq.dredriver.dbg 7
   ```

### TPI

```bash
# LogD:
adb root
adb shell setenforce 0
adb shell setprop persist.vendor.mtk.camera.log_level 3
adb shell "pkill camera*"

# 开启frameNum
adb shell setprop debug.cam.drawid 1

# 开TPI的Log
adb shell setprop vendor.debug.tpi.s 1
adb shell setprop vendor.debug.tpi.s.log 1
adb shell setprop vendor.debug.fpipe.print.topology 1
adb shell setprop vendor.debug.fpipe.print.ioctrl 1
adb shell "pkill camera*"

# flow size 相关问题确认
adb shell setprop vendor.debug.p2g.mgr.printio 1
adb shell setprop vendor.debug.fpipe.force.printio 1
adb shell pkill camera*
```

### AE

```bash
adb shell setprop debug.cam.drawid 1
adb shell setprop vendor.debug.cam.drawid.size 6
adb shell setprop debug.cam.draw.ctrl 'ISO,MAGIC,EXP'
```

### PQDIP

```bash
adb shell setprop vendor.camera.pqdipdbglog.enable 1
adb shell setprop vendor.camera.pqdmalog.enable 1
adb shell setprop vendor.camera.pqpipelog.enable 1
# adb shell setprop vendor.camera.pqdumptpipe.enable 1
# adb shell setprop vendor.camera.pqrzlog.enable 1
adb shell setprop vendor.debug.mdpw 1
```

### keyWords

keywords：`PQMATRIX|setColorspace`

## 其他

1. 查看sensor端配置的分辨率
   1. `adb shell dumpsys media.camera`
   2. `android.scaler.availableStreamConfigurations`
3. 判断算法是否调用GPU
   - `readelf -d com.qti.node.eisv3.so | grep NEED`
