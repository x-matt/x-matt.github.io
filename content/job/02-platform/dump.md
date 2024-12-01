## Qcom

### Picture

```bash
# Setting to TRUE dumps output ports of all enabled nodes. This will run extremely slow.
autoImageDump or persist.vendor.camera.autoImageDump
# Setting to TRUE dumps input port when output port is dumped. This will run extremely slow.
dumpInputatOutput or persist.vendor.camera.dumpInputatOutput
# This mask will limit dumps to only the specified nodes when autoInputImageDump is enabled
autoInputImageDumpMask Or persist.vendor.camera.autoInputImageDumpMask
```

#### IPE

```bash
autoImageDump=TRUE
autoImageDumpMask=0x2
autoImageDumpIPEoutputPortMask=0x100
autoImageDumpIPEInstanceMask=0x1
# 动态dump
dynamicImageDump=1
dynamicImageDumpTrigger=0
autoImageDumpMask=0x2
autoImageDumpIPEoutputPortMask=0x300
autoImageDumpIPEInstanceMask=0x7
```

#### IFE & IPE

```bash
autoImageDump=TRUE
autoImageDumpMask=0x3

dumpInputatOutput=TRUE
autoInputImageDumpMask=0x3

autoImageDumpIFEInstanceMask=0x1
autoImageDumpIFEoutputPortMask=0x400000

autoImageDumpIPEInstanceMask=0x2
[[autoImageDumpIPEinputPortMask]]=0x1
autoImageDumpIPEoutputPortMask=0x100
```

### META

`adb shell setprop persist.vendor.camera.dumpMetadata 3`

- 0 - disable:
- 1 - Enable metadata dump for offline pipelines
- 2 - Enable metadata dump for real-time pipelines
- 3 - Enable metadata dump for both offline and real-time pipelines
    >`/data/vendor/camera/metadata`下（需自己创建metadata目录）

## MTK

### Dump生成文件的描述

名称                                                          | 描述
--------------------------------------------------------------|-------------------------------------------------------------------------
main-P1-IMGO-PW3328-PH1848-BW4160__3280x1848_10_1.packed_word | main sensor 的P1输入
main-rrzo-PW1920-PH1440-BW3600__1920x1440_10_2.packed_word    | main sensor 的P1 rrzo buffer
main-img3o-PW1920-PH1472-BW1920__1920x1440_8_s0.yv12          | main sensor 的img3o buffer(P2Anode 下过了ISP 但是还没过MDP 的buffer，供3DNR用)
main-wdmao-PW1920-PH1080-BW1920__1920x1080_8_s0.nv21          | wdmao 代表判断为 display output buffer，也就是P2S 最终输出的main sensor的display buffer
sub-wroto-PW640-PH480-BW640__640x480_8_s0.yv12                | wroto代表判断为record output buffer，也就是 P2S 最终输出的sub sensor 的record buffer
main-undef-PW1920-PH1080-BW1920__1920x1080_8_s0.nv21          | previewCallback ，也就是P2S 最终输出的main sensor 的previewCallback buffer

![[dump 2024-03-22 16.45.53.excalidraw|1000]]

### P1

> P1下面主要是RAW图, 对于的是IMGO

1. Property 方式

    ```bash
    adb shell setprop vendor.debug.camera.dump.en 1
    adb shell setprop vendor.debug.feature.forceEnableIMGO 1
    adb shell setprop vendor.debug.camera.dump.p1.imgo 1
    ```

    >/data/vendor/camera_dump

1. NDD dump

    [NDD_DUMP_P1](https://xiaomi.f.mioffice.cn/file/boxk4Gs2g12tNabQ1qVLMjjxPKh)

    ```log
    08-29 01:30:02.882 14785 15714 D MtkCam/SensorPipe: [enque] sensorId(1) jobId(41)   requestFd(887) bin(0) portSel(0) nodeIds( 1:18 1:19 1:11 1:12 1:4{e:1 b:0} 1:1    1:22 1:23 1:20 6:32 6:31 )
    ```

- 根据`portSel`来确认RAW图是从哪个节点出的图
- 具体code:
  - [M12](https://source-t.dun.mi.com/opengrok-t/xref/mivendor_t_mt6985/vendor/mediatek/proprietary/hardware/mtkcam-interfaces/include/mtkcam-interfaces/hw/camsys/pipe_mgr/PipeMgrDefs.h#221)

  ```cpp
  enum class MainStreamPathControl : uint8_t {
    UNPROCESSED = 0,
    AFTER_BPC,
    AFTER_FRZ,
    AFTER_FUS,
    AFTER_DGN,
    AFTER_LSC,
    AFTER_HLR,
    AFTER_LTM,
    FULLY_PROCESSED = AFTER_LTM,
  };
  ```

![[job/02-platform/mivi/mivi#相关port|video night sample]]

### P2

[MTK-预览或录像画面异常问题的 buffer dump和处理](https://online.mediatek.com/apps/quickstart/QS00137#QSS02416)

1. P2S
    - P2S I/O buffer - *P2_DumpPlugin.cpp*
        1. mode 1: NDD mode dump
            ```bash
            adb root
            adb shell rm -rf /data/vendor/camera_dump/*
            adb shell setprop vendor.debug.p2f.dump.enable 1
            adb shell setprop vendor.debug.p2f.dump.mode 1
            # start dump
            adb shell setprop vendor.debug.camera.preview.dump 1
            # finish dump
            adb shell setprop vendor.debug.camera.preview.dump 0
            adb pull /data/vendor/camera_dump
            ```

        1. mode 2: debug mode dump

            ```bash
            adb root
            adb shell mkdir /data/vendor/p2_dump
            adb shell setprop vendor.debug.p2f.dump.enable 1
            adb shell setprop vendor.debug.p2f.dump.mode 2
            # start dump at Frame50
            adb shell setprop vendor.debug.p2f.dump.start  50
            # finish dump after dump 70 frames
            adb shell setprop vendor.debug.p2f.dump.count  70
            # 上面两行可以被替换为下面这两行
            # 立刻dump并dump40张
            adb shell setprop vendor.debug.camera.continue.dump 40
            adb shell setprop vendor.debug.camera.continue.dump 0
            ```

            >/data/vendor/p2_dump
        - Dump file filter

            ```cpp {.line-numbers}
            // P2_DumpPlugin.h 中定义的 mask
            enum DUMP_IN {
            DUMP_IN_RRZO,   --> 0x1
            DUMP_IN_IMGO,   --> 0x2
            DUMP_IN_LCSO,   --> 0x4
            };
            enum DUMP_OUT {
            DUMP_OUT_DISPLAY,    --> 0x1
            DUMP_OUT_RECORD,     --> 0x2
            DUMP_OUT_FD,         --> 0x4 /* 目前FD Buffer尚未支持dump */
            DUMP_OUT_PREVIEWCB,  --> 0x8
            };
            ```

            ```bash
            # 过滤命令
            # 只dump RRZO & LCSO，看到IMGO 一律不dump
            adb shell setprop vendor.debug.p2f.dump.in 5
            # 只dump Display & PreviewCB
            adb shell setprop vendor.debug.p2f.dump.out 9
            ```

    - TPINode dump - *DebugControl.h*

        ```bash
        adb root
        adb shell setenforce 0
        adb shell rm -rf /data/vendor/dump/*
        adb shell mkdir /data/vendor/dump
        # 打开 per-frame check dump
        adb shell setprop vendor.debug.tpi.s 1
        # start dump
        adb shell setprop vendor.debug.tpi.s.dump 1
        # finish dump
        adb shell setprop vendor.debug.tpi.s.dump 0
        ```

        >/data/vendor/dump
1. P2C
    1. P2A

        ```bash
        adb root
        adb shell setenforce 0
        adb shell setprop vendor.debug.camera.p2.dump 1
        adb shell setprop vendor.debug.camera.dump.campipe 1
        ```

        >data/vendor/camera_dump
    1. Depth/bokeh/YuvNode buffer dump:

        ```bash
        adb root
        adb shell setenforce 0
        adb shell mkdir sdcard/capturePipe
        adb shell setprop vendor.debug.camera.capture.yuv.img.dump 1
        adb shell setprop vendor.debug.camera.capture.depth.img.dump 1
        adb shell setprop vendor.debug.camera.capture.bokeh.img.dump 1
        ```

        >/sdcard/capturePipe
    1. JpegNode buffer dump:

        ```bash
        adb root
        adb shell setenforce 0
        adb shell setprop vendor.debug.camera.dump.JpegNode 1
        ```

        >/sdcard/DCIM/Camera/
    1. MFNR buffer dump:

        ```bash
        adb root
        adb shell setenforce 0
        adb shell setprop vendor.debug.camera.mfll.dump 1
        ```

        >/data/vendor/camera_dump
    1. Raw16Node dump:

        ```bash
        adb root
        adb shell setenforce 0
        adb shell setprop vendor.debug.camera.log.Raw16Node 1
        ```

        >/sdcard/DCIM/Camera/RAW10_%d_%d_%d.raw
1. VMDP

    ```bash
    adb root
    adb shell setenforce 0
    # draw magic number
    adb shell setprop debug.cam.drawid 1
    adb shell rm -rf /data/vendor/dump/*
    adb shell mkdir /data/vendor/dump
    adb shell setprop vendor.debug.fpipe.frame.setting 1
    # 开vendorMDPNode 的 dump开关
    adb shell setprop vendor.debug.mask.fpipe.vmdp 1
    # 有多个tpi时，开 tpi的dump开关
    adb shell setprop vendor.debug.mask.fpipe.tpi 4/7
    # 使用MTK EIS时，开 WarpNode 的 dump开关
    # (全部 dump，240 是开 display相关的dump，15 是开 record 相关的 dump)
    adb shell setprop vendor.debug.mask.fpipe.warp 240/15
    # 开始dump
    adb shell setprop vendor.debug.fpipe.force.dump -1
    # 结束dump：
    adb shell setprop vendor.debug.fpipe.force.dump 0
    adb pull /data/vendor/dump
    ```

    > - main_wdmao_full： P2A出来的buffer
    > - main_wdmao： 用于预览的buffer
    > - main_wdmao： 从main_wdmao_full出的图
    main_wdmao_full正常的话，说明异常应该是在过完三方算法或者其他什么环节后出现的
    > 定义在StreamingFeatureNode.cpp中 enableDumpMask()函数
    sfp中的成员调用该函数

### FD

- FD Node

    ```bash
    adb root
      adb shell mkdir /sdcard/fddata
    adb shell rm -rf /sdcard/fddata/*
      adb shell setprop vendor.debug.camera.fd.detail.dump 1
      adb shell setprop vendor.debug.camera.fd.detail.log 1
      adb shell setprop vendor.debug.camera.log.FDNode 1
      adb shell setenforce 0
       adb pull /sdcard/fddata/
    ```

- FDNode dump:

    ```bash
    adb root
    adb remount
    adb shell rm -r sdcard/fddata/*
    adb shell mkdir sdcard/fddata
    adb shell setprop vendor.debug.camera.fd.detail.dump 1
    ```
