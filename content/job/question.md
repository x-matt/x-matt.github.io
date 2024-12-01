## 缓存帧相关问题

### 录像结束时间

`adb logcat | grep -E "stopVideoRecording>>true|onMediaRecorderReleased<<time|updateThumbnail needAnimation"`

## checkBuffer

### Jira & CR

- [DAUMIER-5551](https://jira.n.xiaomi.com/browse/DAUMIER-5551)
- [DAUMIER-5416](https://jira.n.xiaomi.com/browse/DAUMIER-5416)
- [ALPS07284706](https://eservice.mediatek.com/eservice-portal/issue_manager/update/123447087)

#### tpi 初始化code

- createSession
  - createPluginSession
    - negotiate
      - getConfigSetting
    - selection_print
- initPlugin
  - initNode

#### debug 步骤

1. 在eisNode的init()中添加sleep函数
2. p2Run设为 MFALSE

#### log开关

```bash
# LogD:adb root
adb shell setenforce 0
adb shell setprop persist.vendor.mtk.camera.log_level 3
adb shell "pkill camera*"
# 开TPI的Log
adb shell setprop vendor.debug.tpi.s 1
adb shell setprop vendor.debug.tpi.s.log 1
adb shell setprop vendor.debug.fpipe.print.topology 1
adb shell setprop vendor.debug.fpipe.print.ioctrl 1
# otherLog:
adb shell setprop vendor.debug.trace.p2.P2ANode 1
adb shell "pkill camera*"
# 打开如下的debug开关
# vendor\mediatek\proprietary\hardware\mtkcamcore\feature\core\featurePipe\streaming\DebugControl.h
define TRACE_TPI_NODE 0-->1
```

### Log 分析

#### c

```log
05-24 10:26:11.424243 11053 18960 I MtkCam/StreamingPipe/TPI_MGR: [initNode]Plugin (MI_FEATURE_VIDHANCE_EIS) init 34 ms
05-24 10:26:11.435306 11053 18954 F MtkCam/P2G/P2GMgr: [checkBuffer]WMPF0 in buffer should not NULL! (checkBuffer){#258:vendor/mediatek/proprietary/hardware/mtkcam-core/feature/core/featurePipe/p2g/p2gMgr/P2GMgr.cpp}
05-24 10:26:11.461179 11053 18962 D MtkCam/StreamingPipe/TPI_MGR: [genFrame]TPIFrame#2(meta=0xb4000078f1a10430)(preyuv=1)(yuv=0)(yuv2=0)(async=0)(repr_disp=0)(repr_rec=0): [8/MI_FEATURE_VIDHANCE_EIS(preYuv)run=1]
```

#### d

```log
<!-- 第二帧带有eis-run -->
05-24 11:09:53.607320 11872 13029 D MtkCam/StreamingPipe/TPI_MGR: [genFrame]TPIFrame#2(meta=0xb400006eecaee7f0)(preyuv=1)(yuv=0)(yuv2=0)(async=0)(repr_disp=0)(repr_rec=0): [8/MI_FEATURE_VIDHANCE_EIS(preYuv)run=1]
<!-- 第一个request #19 处理时间过长 -->
05-24 11:09:56.219332 11872 11879 W ULogGuard: R AppRequest:19 executed 2659 ms(>2500) TOO LONG; compelledDelay = 0 ms
```

#### e

```log
<!-- tpiFrame #1, appRequest #20, eis_run = 0 -->
05-24 14:50:35.626352 32507 13244 D MtkCam/StreamingPipe/TPI_MGR: [genFrame]TPIFrame#1(meta=0xb400007bb7ccbbb0)(preyuv=0)(yuv=0)(yuv2=0)(async=0)(repr_disp=0)(repr_rec=0):
05-24 14:50:35.626401 32507 13244 D MtkCam/StreamingPipe/Pipe: [prepareIORequest]P2S cam 0 MWFrame:#0 MWReq:#20, frame 1-1  master/slave/fd(0/-1/0) ReqNo(1), feature=0x0000(NONE), cycle(16), fps(n/a)=(60/60), ZoomRoi(A[(3801.980x2138.614)@(19.010,10.693)], ), SFPIO: sensor(0):YUV1(sz=1)[0xb400007be819e8d8(3840x2160) (3840.00x2160.00)@(0.00,0.00) full(3840x2160)]YUV2(sz=1)[0xb400007be819ea18(960x540) (3840.00x2160.00)@(0.00,0.00) full(3840x2160)]App=1 Hal=1 P1App=1 PhyApp=0}group=gid_in_a:()-{s(0) F0(sz=1)[0xb400007be819e8d8(3840x2160) (3840.00x2160.00)@(0.00,0.00) full(3840x2160)]F1(sz=1)[0xb400007be819ea18(960x540) (3840.00x2160.00)@(0.00,0.00) full(3840x2160)]App=1 Hal=1 P1App=1 PhyApp=0}group=gid_out_a:()-{disp[0xb400007be819ec98(1920x1080)c(146931712) ]sid(0):(1920x1080) tran=0 type=PV crop(3801.98x2138.61)@(19.01,10.69)AppO=1 HalO=1 phyAppO=0}
<!-- eisNode init 完成 -->
05-24 14:50:35.634128 32507 13241 I MtkCam/StreamingPipe/TPI_MGR: [initNode]Plugin (MI_FEATURE_VIDHANCE_EIS) init 55 ms
<!-- checkBuffer 报错 -->
05-24 14:50:35.648763 32507 13235 F MtkCam/P2G/P2GMgr: [checkBuffer]WMPF0 in buffer should not NULL! (checkBuffer){#258:vendor/mediatek/proprietary/hardware/mtkcam-core/feature/core/featurePipe/p2g/p2gMgr/P2GMgr.cpp}
<!-- tpiFrame #2, appRequest #21, eis_run = 1 -->
05-24 14:50:35.664646 32507 13244 D MtkCam/StreamingPipe/TPI_MGR: [genFrame]TPIFrame#2(meta=0xb400007bb7ccdcf0)(preyuv=1)(yuv=0)(yuv2=0)(async=0)(repr_disp=0)(repr_rec=0): [8/MI_FEATURE_VIDHANCE_EIS(preYuv)run=1]
<!-- appRequest #20 报处理超时 -->
05-24 14:50:39.568176 32507 32509 W ULogGuard: R AppRequest:20 executed 3991 ms(>2500) TOO LONG; compelledDelay = 0 ms
```

```cpp
        ALOGE("matao OIS instance +++ ");
        struct timeval start, end;
        gettimeofday( &start, NULL );
        if ((IS_WIDE_CAMERA == this->mSId) && !mPeripheralCtrl.get()) {
            mPeripheralCtrl = mtk::hal3a::IPeripheralController::GetInstance(this->mSId);
            if (!mPeripheralCtrl.get())
                VIDHANCE_LOG_ERROR("mPeripheralCtrl createInstance failed");
        }
        // usleep(50000);
        gettimeofday( &end, NULL );
        auto processingTime = 1000 * ( end.tv_sec - start.tv_sec ) + (end.tv_usec - start.tv_usec) / 1000;
        ALOGE("matao vidhance_eis init ois time: %ld\n", processingTime);
        ALOGE("matao OIS instance --- ");
```

## stress

- [DAUMIER-7982](https://jira.n.xiaomi.com/browse/DAUMIER-7982)
- [ALPS07372544](https://eservice.mediatek.com/eservice-portal/issue_manager/update/124977460)

### 日志分析

```log
<!-- appRequest 8453 -->
06-20 08:40:35.321228  7840 27568 D MtkCam/P2/MWFrameRequest: [printIOMap] P2S cam 0 MWFrame:#8213 MWReq:#8453, frame 8214 : iomap: [0]=>img[3/2], meta[3/2], fps[45.31]
06-20 08:40:35.322490  7840 27620 D MtkCam/StreamingPipe/TPI_MGR: [genFrame]TPIFrame#8214(meta=0xb4000074090c3a30)(preyuv=0)(yuv=1)(yuv2=0)(async=0)(repr_disp=0)(repr_rec=0): [8/MI_FEATURE_VIDHANCE_EIS(div)run=1]

<!-- app下发结束录像 -->
06-20 08:40:35.447834 26134 26134 I CAM_VideoModule: [K_PROCESS]: [CAM_PERF]stopVideoRecording>>true

<!-- request 8466 有record request -->
06-20 08:40:35.593174  7840 27620 D MtkCam/StreamingPipe/Pipe: [prepareIORequest]P2S cam 0 MWFrame:#8226 MWReq:#8466, frame 8227-8227  master/slave/fd(0/-1/0) ReqNo(8227), feature=0x82000(TPI_YUV+FSC), cycle(16), fps(n/a)=(60/60), ZoomRoi(A[(1920.000x1080.000)@(240.000,135.000)], ), SFPIO: sensor(0):YUV1(sz=1)[0xb4000073e0d3b398(2400x1350) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]YUV2(sz=1)[0xb4000073e0d3b4d8(1200x676) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_P(sz=1)[0xb400007402eaa0d8(576x336) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_C(sz=1)[0xb4000073e0d3b258(576x336) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]App=1 Hal=1 P1App=1 PhyApp=0}group=gid_in_a:()-{s(0) F0(sz=1)[0xb4000073e0d3b398(2400x1350) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]F1(sz=1)[0xb4000073e0d3b4d8(1200x676) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_P(sz=1)[0xb400007402eaa0d8(576x336) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_C(sz=1)[0xb4000073e0d3b258(576x336)
06-20 08:40:35.593194  7840 27620 D MtkCam/StreamingPipe/Pipe: [prepareIORequest](4096.00x2304.00)@(0.00,0.00) full(4096x2304)]App=1 Hal=1 P1App=1 PhyApp=0}group=gid_out_a:()-{disp[0xb4000074102b8018(1920x1080)c(146931712) ]sid(0):(1920x1080) tran=0 type=PV crop(1920.00x1080.00)@(240.00,135.00)rec[0xb400007402ea2798(1920x1080)c(281083904) ]sid(0):(1920x1080) tran=0 type=VR crop(1920.00x1080.00)@(240.00,135.00)AppO=1 HalO=1 phyAppO=0}

<!-- 8466 对应的PV待释放，匹配的 8441 的VR已释放 -->
06-20 08:40:35.693159  7840 27613 D MtkCam/P2/MWFrame: [doRelease] P2S cam 0 MWFrame:#8226 MWReq:#8466, frame 8227 : all streams(10), using(5), status: s10:d0:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE(1),s11:d0:App:UNKNOWN:0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER(2),Meta:App:Control(2),Hal:Meta:P1:Dynamic_0(2),Hal:Meta:P2S:Dynamic(1),App:Meta:P1:Dynamic_0(2),App:Meta:P2S:Dynamic(1),Hal:Image:RSSO_0(2),Hal:Image:P1:ResizeYuv28673_0(1),Hal:Image:P1:ResizeYuv28674_0(1),
06-20 08:40:35.693511  7840 27613 D MtkCam/P2/MWFrame: [doRelease] P2S cam 0 MWFrame:#8201 MWReq:#8441, frame 8202 : all streams(10), using(0), status: s10:d0:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE(0),s11:d0:App:UNKNOWN:0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER(1),Meta:App:Control(1),Hal:Meta:P1:Dynamic_0(1),Hal:Meta:P2S:Dynamic(0),App:Meta:P1:Dynamic_0(1),App:Meta:P2S:Dynamic(0),Hal:Image:RSSO_0(0),Hal:Image:P1:ResizeYuv28673_0(0),Hal:Image:P1:ResizeYuv28674_0(0),

<!-- request#8467 无record request -->
06-20 08:40:35.613544  7840 27620 D MtkCam/StreamingPipe/Pipe: [prepareIORequest]P2S cam 0 MWFrame:#8227 MWReq:#8467, frame 8228-8228  master/slave/fd(0/-1/0) ReqNo(8228), feature=0x82000(TPI_YUV+FSC), cycle(16), fps(n/a)=(60/60), ZoomRoi(A[(1920.000x1080.000)@(240.000,135.000)], ), SFPIO: sensor(0):YUV1(sz=1)[0xb4000073e0d39318(2400x1350) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]YUV2(sz=1)[0xb400007403065398(1200x676) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_P(sz=1)[0xb4000073e0d3b258(576x336) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_C(sz=1)[0xb40000743c36e558(576x336) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]App=1 Hal=1 P1App=1 PhyApp=0}group=gid_in_a:()-{s(0) F0(sz=1)[0xb4000073e0d39318(2400x1350) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]F1(sz=1)[0xb400007403065398(1200x676) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_P(sz=1)[0xb4000073e0d3b258(576x336) (4096.00x2304.00)@(0.00,0.00) full(4096x2304)]ME_C(sz=1)[0xb40000743c36e558(576x336)
06-20 08:40:35.613563  7840 27620 D MtkCam/StreamingPipe/Pipe: [prepareIORequest](4096.00x2304.00)@(0.00,0.00) full(4096x2304)]App=1 Hal=1 P1App=1 PhyApp=0}group=gid_out_a:()-{disp[0xb400007403065618(1920x1080)c(146931712) ]sid(0):(1920x1080) tran=0 type=PV crop(1920.00x1080.00)@(240.00,135.00)AppO=1 HalO=1 phyAppO=0}

<!-- eis-algo触发结束录像 -->
06-20 08:40:35.703023  7840 27617 I DivisionPlugin: [VIDHANCE] process(): Start stop recording

<!-- VR的#8442 ~ #8452 正常释放 -->
06-20 08:40:35.717886  7840 27613 D MtkCam/P2/MWFrame: [doRelease] P2S cam 0 MWFrame:#8202 MWReq:#8442, frame 8203 : all streams(10), using(0), status: s10:d0:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE(0),s11:d0:App:UNKNOWN:0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER(1),Meta:App:Control(1),Hal:Meta:P1:Dynamic_0(1),Hal:Meta:P2S:Dynamic(0),App:Meta:P1:Dynamic_0(1),App:Meta:P2S:Dynamic(0),Hal:Image:RSSO_0(0),Hal:Image:P1:ResizeYuv28673_0(0),Hal:Image:P1:ResizeYuv28674_0(0),
06-20 08:40:35.812267  7840 27613 D MtkCam/P2/MWFrame: [doRelease] P2S cam 0 MWFrame:#8212 MWReq:#8452, frame 8213 : all streams(10), using(0), status: s10:d0:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE(0),s11:d0:App:UNKNOWN:0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER(1),Meta:App:Control(1),Hal:Meta:P1:Dynamic_0(1),Hal:Meta:P2S:Dynamic(0),App:Meta:P1:Dynamic_0(1),App:Meta:P2S:Dynamic(0),Hal:Image:RSSO_0(0),Hal:Image:P1:ResizeYuv28673_0(0),Hal:Image:P1:ResizeYuv28674_0(0),

<!-- 生成缩略图 -->
06-20 08:40:36.859553 26134 26134 D CAM_ImageSaver: updateThumbnail needAnimation:true

<!-- 超时报错#8453 -->
06-20 08:40:36.991121  7840  7842 W ULogGuard: TimeBomb [Frame 8214 has not dequed from driver] of M[S_EISWarp:1004016] executed 1185 ms(>1000) TOO LONG, dispatch key = Camera_Driver_WPE
06-20 08:40:37.991266  7840  7842 W ULogGuard: R AppRequest:8453 executed 2751 ms(>2500) TOO LONG; compelledDelay = 0 ms
```

## 4k60

### setting

1. 功耗
    - pre-tpi
    - qcount =0
    - cropFactor 0.8->0.86，直出4K引起FOV减小
1. 丢oisData引起卡顿
    - close OIS
1. 效果问题
    - qcount
    - cropFactor
