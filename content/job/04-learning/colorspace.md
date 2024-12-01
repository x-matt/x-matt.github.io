## ColorSpace

#colorspace 

[色彩管理介绍](https://www.bilibili.com/video/BV1U541177tS?from=search&seid=14827254789180749033)
[数字电视输出标准规范和BT601/BT709/BT2020色域转换方法资料整理](https://blog.csdn.net/qq_20797295/article/details/102679394)

### 介绍

standardRGB(影视对应于Rec.709), adobeRGB(数字颜色到物理颜色之间的映射关系)
产生图片，看图软件(查色彩空间)，ICC色彩管理文件，显示设备

JPEG 包含头文件，颜色编号

| 清晰度        | 色域     |
| ---------- | ------ |
| SDTV(标准)   | BT601  |
|            | BT656  |
| HDTV(高清)   | BT709  |
|            | BT1120 |
| UHDTV(超高清) | BT2020 |

理解不同颜色空间之间的差异可以通过比较它们的色域范围（即能够表示的颜色范围）、主要应用场景以及颜色精度等方面来进行。以下是几种常见颜色空间的比较：

| 颜色空间           | 色域范围            | 主要应用场景          | 特点和用途                             |
| -------------- | --------------- | --------------- | --------------------------------- |
| BT.601         | 较窄，适用于标清视频      | 标清电视广播          | 用于标清视频的编码和传输，已逐渐被更高分辨率的标准取代       |
| BT.709         | 中等，适用于高清视频      | 高清电视广播、蓝光光盘     | 目前广泛应用于高清视频和广播领域                  |
| BT.2020        | 广泛，适用于超高清视频     | 超高清电视、数字电影制作    | 能够呈现更广泛的色域范围，适应未来超高清视频内容的需求       |
| DCI-P3         | 广泛，适用于数字电影      | 数字电影制作、数字影院投影   | 比起 BT.709 更广的色域，提供更丰富的颜色表现        |
| sRGB           | 标准，适用于计算机显示     | 互联网、计算机显示器、移动设备 | 在计算机图形和网络图像中广泛使用，提供一致的色彩表现        |
| Adobe RGB      | 广泛，适用于印刷和摄影     | 高级图像编辑、印刷、专业摄影  | 提供比 sRGB 更广泛的色域，适合印刷和高级图像处理       |
| ProPhoto RGB   | 非常广泛，适用于高级图像    | 高级图像处理、印刷、专业摄影  | 最广泛的 RGB 色域之一，适合处理需要极高色彩精度的图像     |
| Wide Gamut RGB | 可变，适用于广泛色域需求    | 特定应用场景和硬件支持     | 一系列更广泛的 RGB 色域，根据具体需要选择合适的颜色空间    |
| ACES           | 广泛，适用于数字电影和后期制作 | 数字电影制作、后期处理     | 提供全面的颜色管理和编码系统，确保在电影制作中的色彩一致性和准确性 |

RGB->YUV->RGB
光学镜头 ->光学芯片sensor把光信号转换成RGB -> 转给主控 -> 主控把RGB 按照一定标准(BT709/BT601)转化成YUV -> 编码(H264)存储 ->解码得到YUV 数据 -> 主控把YUV 按照一定标准(BT709/BT601)转化成RGB -> LCD 显示RGB 数据

### 现象

| 组别  | 场景   | 流       | 格式  | 对比度 |
| --- | ---- | ------- | --- | --- |
| A   | 普通录像 | Preview | 601 | 深   |
|     |      | Record  | 709 | 深   |
|     | 短视频  | Preview | 0   | 暗   |
| B   | 普通录像 | Preview | 709 | 深   |
|     |      | Record  | 709 | 深   |
|     | 短视频  | Preview | 709 | 暗   |
| C   | 普通录像 | Preview | 601 | 暗   |
|     |      | Record  | 601 | 暗   |
|     | 短视频  | Preview | 0   | 暗   |

### 普通录像

```log
02-16 14:45:28.270 12610 12718 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]         0 1920x1080 OUT ImgFormat:17(NV21) BufPlanes(strides/sizeInBytes):[ 1920/2073600 1920/1062720 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x0(V0_BT601_625|STANDARD_BT601_625|TRANSFER_SMPTE_170M|RANGE_LIMITED) s0:d0:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE AllocImgFormat:17(NV21) AllocBufPlanes(strides/sizeInBytes):[ 1920/2073600 1920/1062720 ] Real:17(NV21) Request:17() Override:17(NV21) Hal-Client-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) Hal-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) HalStream::(consumer/producer)Usage:0/131379 0xb400007cc6308f18 phy:-1
02-16 14:45:28.270 12610 12718 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x1 1920x1080 OUT ImgFormat:9483(AFBC_NV12) BufPlanes(strides/sizeInBytes):[ 1920/3264512 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x260(V0_BT709|STANDARD_BT709|TRANSFER_SMPTE_170M|RANGE_LIMITED) s1:d0:App:UNKNOWN:0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER AllocImgFormat:9483(AFBC_NV12) AllocBufPlanes(strides/sizeInBytes):[ 1920/3264512 ] Real:9483(UNKNOWN) Request:9483() Override:9483(UNKNOWN) Hal-Client-usage:196608(0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER) Hal-usage:196608(0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER) HalStream::(consumer/producer)Usage:0/196608 0xb400007cc6309198 phy:-1
02-16 14:45:28.270 12610 12718 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x2 1920x1080 OUT ImgFormat:8960(JPEG) BufPlanes(strides/sizeInBytes):[ 3327252/3327296 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x146931712(V0_JFIF|STANDARD_BT601_625|TRANSFER_SMPTE_170M|RANGE_FULL) s2:d0:App:BLOB:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE AllocImgFormat:33(BLOB) AllocBufPlanes(strides/sizeInBytes):[ 3327252/3327296 ] Real:33(BLOB) Request:33() Override:8960(UNKNOWN) Hal-Client-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) Hal-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) HalStream::(consumer/producer)Usage:0/131123 0xb400007cc6309418 phy:-1
```

| streaming | 识别关键字            | 图片格式      | 色彩空间                                                                          |
| --------- | ---------------- | --------- | ----------------------------------------------------------------------------- |
| Preview   | HW_TEXTURE       | NV21      | `0x0(V0_BT601_625\|STANDARD_BT601_625\|TRANSFER_SMPTE_170M\|RANGE_LIMITED)`   |
| Record    | HW_VIDEO_ENCODER | AFBC_NV12 | `0x260(V0_BT709\|STANDARD_BT709\|TRANSFER_SMPTE_170M\|RANGE_LIMITED)`         |
| 异常record  | HW_VIDEO_ENCODER | AFBC_NV12 | `0x260(V0_BT601_625\|STANDARD_BT601_625\|TRANSFER_SMPTE_170M\|RANGE_LIMITED)` |
| VSS       | HW_CAMERA_WRITE  | JPEG      | `0x146931712(V0_JFIF\|STANDARD_BT601_625\|TRANSFER_SMPTE_170M\|RANGE_FULL)`   |

### 短视频/Vlog/电影镜头/魔法分身

```log
02-16 15:08:08.213 12610 16308 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x7 1280x720 OUT ImgFormat:17(NV21) BufPlanes(strides/sizeInBytes):[ 1280/921600 1280/493440 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x0(UNKNOWN) s7:d0:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE AllocImgFormat:17(NV21) AllocBufPlanes(strides/sizeInBytes):[ 1280/921600 1280/493440 ] Real:17(NV21) Request:17() Override:17(NV21) Hal-Client-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) Hal-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) HalStream::(consumer/producer)Usage:0/131379 0xb400007cbc386118 phy:-1
02-16 15:08:08.213 12610 16308 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x8 1280x720 OUT ImgFormat:8960(JPEG) BufPlanes(strides/sizeInBytes):[ 1624418/1624448 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x146931712(V0_JFIF|STANDARD_BT601_625|TRANSFER_SMPTE_170M|RANGE_FULL) s8:d0:App:BLOB:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE AllocImgFormat:33(BLOB) AllocBufPlanes(strides/sizeInBytes):[ 1624418/1624448 ] Real:33(BLOB) Request:33() Override:8960(UNKNOWN) Hal-Client-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) Hal-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) HalStream::(consumer/producer)Usage:0/131123 0xb400007cc630cd98 phy:-1
```

streaming | 识别关键字       | 图片格式  | 色彩空间
----------|------------------|-----------|-----------------------------------------------------------------------------
Preview   | HW_TEXTURE       | NV21      | `0x0(UNKNOWN)`
VSS       | HW_CAMERA_WRITE  | JPEG      | `0x146931712(V0_JFIF\|STANDARD_BT601_625\|TRANSFER_SMPTE_170M\|RANGE_FULL)`

### 普通录像(修改前)

color_range=tv
color_space=bt470bg
color_transfer=bt709
color_primaries=bt470bg

### 普通录像(修改后)

color_range=tv
color_space=bt709
color_transfer=bt709
color_primaries=bt709

### 短视频

color_range=tv
color_space=unknown
color_transfer=unknown
color_primaries=unknown

### 夜景-FHD

color_range=tv
color_space=bt709
color_transfer=bt709
color_primaries=bt709

### 夜景-4K

color_range=tv
color_space=bt2020nc
color_transfer=bt709
color_primaries=bt2020

### debug

```bash
adb shell setprop vendor.camera.pqdipdbglog.enable 1
adb shell setprop debug.mtkcam.utils.gralloc.loglevel 2
adb shell setprop vendor.camera.pqdmalog.enable 1
adb shell setprop vendor.camera.pqpipelog.enable 1
adb shell setprop vendor.debug.mdpw 1
```

关键字：`PQMATRIX|setColorspace`

### 进展

1. default is BT601_LIMITED
    - 合入patch前(亮度无差异)：
        1. 普通录像模式下：
            Preview：0->0 0x20000000
            Record：0->1 0x20000000

            ```log
            03-09 10:56:21.603 25113 26590 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            03-09 10:56:21.623 25113 26591 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(1),MAT_EN(1),MTX_SEL(8)
            ```

        1. 短视频模式：
            0->0 0x40000000
    - 合入patch后(亮度有差异)：
        1. 普通录像模式下
            Preview：2->1 0x20000000
            Record：2->2 0x60000000

            ```log
            03-09 11:11:11.088  1774  2465 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(2),outProfile(1),MAT_EN(1),MTX_SEL(12)
            03-09 11:11:11.098  1774  2464 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(2),outProfile(2),MAT_EN(0),MTX_SEL(0)
            ```

        1. 短视频模式:
            0->0 0x40000000
1. default is BT601_FULL
    - 合入patch前(亮度有差异)：
        1. 普通录像模式下：
            Preview:0->0 无
            Record:0->0 无

            ```log
            03-09 10:56:21.603 25113 26590 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            03-09 10:56:21.603 25113 26590 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            ```

        1. 短视频模式：
            0->0 0x40000000
    - 合入patch后(亮度有差异，比合入前更大)：
        1. 普通录像模式下
            Preview:2->0 无
            Record:2->2 0x60000000

            ```log
            03-09 10:59:45.855 27364 27741 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(2),outProfile(0),MAT_EN(1),MTX_SEL(11)
            03-09 10:59:45.833 27364 27740 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(2),outProfile(2),MAT_EN(0),MTX_SEL(0)
            ```

        1. 短视频模式:
            0->0 0x40000000
1. default is UNKNOWN
    - 合入patch前(亮度无差异)：
        1. 普通录像模式下：
            Preview:0->0 0x40000000
            Record:0->0 0x40000000

            ```log
            03-09 10:56:21.603 25113 26590 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            03-09 10:56:21.603 25113 26590 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            ```

        1. 短视频模式：
            0->0 0x40000000
    - 合入patch后(亮度有差异，比合入前更大)：
        1. 普通录像模式下
            Preview:2->0 0x40000000
            Record:2->2 0x60000000

            ```log
            03-09 10:59:45.855 27364 27741 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(2),outProfile(0),MAT_EN(1),MTX_SEL(11)
            03-09 10:59:45.833 27364 27740 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(2),outProfile(2),MAT_EN(0),MTX_SEL(0)
            ```

        1. 短视频模式:
            0->0 0x40000000

1. add two patches
    - 合入patch前(亮度无差异)：
        1. 普通录像模式下：
            Preview:0->0 0x40000000
            Record:0->0 0x40000000

            ```log
            03-09 10:56:21.603 25113 26590 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            03-09 10:56:21.603 25113 26590 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            ```

        1. 短视频模式：
            0->0 0x40000000
    - 合入patch后(亮度有差异，比合入前更大)：
        1. 普通录像模式下
            Preview:0->0 0x40000000
            Record:0->2 0x60000000

            ```log
            03-17 16:57:31.570 16606 22030 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(0),MAT_EN(0),MTX_SEL(0)
            03-17 16:57:31.572 16606 22030 D PQDIPDrv: [set_pqdip_wrot] PQMATRIX: inProfile(0),outProfile(2),MAT_EN(1),MTX_SEL(9)
            ```

        1. 短视频模式:
            0->0 0x40000000

> pqdip_meta.h

```cpp
enum IMG_PROFILE_ENUM {
  IMG_PROFILE_DEFAULT,
  IMG_PROFILE_JPEG = IMG_PROFILE_DEFAULT,
  IMG_PROFILE_FULL_BT601 = IMG_PROFILE_JPEG,
  IMG_PROFILE_BT601,  // Limited range
  IMG_PROFILE_BT709,
  IMG_PROFILE_BT2020,      // not support for output
  IMG_PROFILE_FULL_BT709,  // not support for output
  IMG_PROFILE_FULL_BT2020  // not support for output
};
```

### 影响场景

主设：
普通录像
超级防抖
vHDR
视频美颜/虚化
视频滤镜
专业录像(eis_on & eis_off)
延时摄影
慢动作
专业录像下面的LOG模式
电影镜头-慢快门
电影镜头-长曝光延时
视频夜景

VLOG主界面
VLOG进去之后
短视频
电影镜头-滑动变焦
电影镜头-时间静止
电影镜头-平行梦境
萌拍
前后双景
魔法分身主界面
魔法分身进去

### 夜景视频

#### L2M

no-patch   预览显示亮，其他暗
with-patch
no-patch-custmoze
with-patch-custmoze

#### L11

no-patch
with-patch
no-patch-custmoze
with-patch-custmoze
