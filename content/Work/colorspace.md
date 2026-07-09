---
title: Colorspace
type: area
status: active
domain: imagedata
priority:
review:
---

- [色彩管理介绍](https://www.bilibili.com/video/BV1U541177tS?from=search&seid=14827254789180749033)
- [数字电视输出标准规范和BT601/BT709/BT2020色域转换方法资料整理](https://blog.csdn.net/qq_20797295/article/details/102679394)

### 介绍

standardRGB(影视对应于Rec.709), adobeRGB(数字颜色到物理颜色之间的映射关系)
产生图片，看图软件(查色彩空间)，ICC色彩管理文件，显示设备

JPEG 包含头文件，颜色编号

| 清晰度        | 色域   |
| ------------- | ------ |
| SDTV(标准)    | BT601  |
|               | BT656  |
| HDTV(高清)    | BT709  |
|               | BT1120 |
| UHDTV(超高清) | BT2020 |

理解不同颜色空间之间的差异可以通过比较它们的色域范围（即能够表示的颜色范围）、主要应用场景以及颜色精度等方面来进行。以下是几种常见颜色空间的比较：

| 颜色空间       | 色域范围                       | 主要应用场景                   | 特点和用途                                                         |
| -------------- | ------------------------------ | ------------------------------ | ------------------------------------------------------------------ |
| BT.601         | 较窄，适用于标清视频           | 标清电视广播                   | 用于标清视频的编码和传输，已逐渐被更高分辨率的标准取代             |
| BT.709         | 中等，适用于高清视频           | 高清电视广播、蓝光光盘         | 目前广泛应用于高清视频和广播领域                                   |
| BT.2020        | 广泛，适用于超高清视频         | 超高清电视、数字电影制作       | 能够呈现更广泛的色域范围，适应未来超高清视频内容的需求             |
| DCI-P3         | 广泛，适用于数字电影           | 数字电影制作、数字影院投影     | 比起 BT.709 更广的色域，提供更丰富的颜色表现                       |
| sRGB           | 标准，适用于计算机显示         | 互联网、计算机显示器、移动设备 | 在计算机图形和网络图像中广泛使用，提供一致的色彩表现               |
| Adobe RGB      | 广泛，适用于印刷和摄影         | 高级图像编辑、印刷、专业摄影   | 提供比 sRGB 更广泛的色域，适合印刷和高级图像处理                   |
| ProPhoto RGB   | 非常广泛，适用于高级图像       | 高级图像处理、印刷、专业摄影   | 最广泛的 RGB 色域之一，适合处理需要极高色彩精度的图像              |
| Wide Gamut RGB | 可变，适用于广泛色域需求       | 特定应用场景和硬件支持         | 一系列更广泛的 RGB 色域，根据具体需要选择合适的颜色空间            |
| ACES           | 广泛，适用于数字电影和后期制作 | 数字电影制作、后期处理         | 提供全面的颜色管理和编码系统，确保在电影制作中的色彩一致性和准确性 |

RGB->YUV->RGB
光学镜头 ->光学芯片sensor把光信号转换成RGB -> 转给主控 -> 主控把RGB 按照一定标准(BT709/BT601)转化成YUV -> 编码(H264)存储 ->解码得到YUV 数据 -> 主控把YUV 按照一定标准(BT709/BT601)转化成RGB -> LCD 显示RGB 数据

#### BT2020

让我们通过表格来总结 BT2020_ITU、BT2020_ITU_PQ 和 BT2020_ITU_HLG 之间的主要差异，重点是它们在颜色空间范围和HDR技术上的区别：

| 特点             | BT2020_ITU                   | BT2020_ITU_PQ                             | BT2020_ITU_HLG                               |
| ---------------- | ---------------------------- | ----------------------------------------- | -------------------------------------------- |
| **颜色空间范围** | 广色域，定义更广泛的颜色空间 | 广色域，定义更广泛的颜色空间              | 广色域，定义更广泛的颜色空间                 |
| **HDR技术**      | 不特定HDR技术，通常与SDR兼容 | Perceptual Quantizer（PQ），精确的HDR技术 | Hybrid Log-Gamma（HLG），兼容性更强的HDR技术 |
| **主要应用场景** | 视频广播、数字媒体等         | 超高清电视广播、数字电影制作              | 广播电视、流媒体传输                         |
| **向后兼容性**   | 兼容传统SDR设备              | 需要HDR显示设备支持                       | 兼容传统SDR设备和新的HDR设备                 |
| **优点**         | 色域扩展，适用于各种视频应用 | 提供精确的HDR显示，更丰富的图像细节       | 兼容性强，适合广播和互联网传输               |

### 普通录像

```shell
02-16 14:45:28.270 12610 12718 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]         0 1920x1080 OUT ImgFormat:17(NV21) BufPlanes(strides/sizeInBytes):[ 1920/2073600 1920/1062720 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x0(V0_BT601_625|STANDARD_BT601_625|TRANSFER_SMPTE_170M|RANGE_LIMITED) s0:d0:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE AllocImgFormat:17(NV21) AllocBufPlanes(strides/sizeInBytes):[ 1920/2073600 1920/1062720 ] Real:17(NV21) Request:17() Override:17(NV21) Hal-Client-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) Hal-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) HalStream::(consumer/producer)Usage:0/131379 0xb400007cc6308f18 phy:-1
02-16 14:45:28.270 12610 12718 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x1 1920x1080 OUT ImgFormat:9483(AFBC_NV12) BufPlanes(strides/sizeInBytes):[ 1920/3264512 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x260(V0_BT709|STANDARD_BT709|TRANSFER_SMPTE_170M|RANGE_LIMITED) s1:d0:App:UNKNOWN:0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER AllocImgFormat:9483(AFBC_NV12) AllocBufPlanes(strides/sizeInBytes):[ 1920/3264512 ] Real:9483(UNKNOWN) Request:9483() Override:9483(UNKNOWN) Hal-Client-usage:196608(0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER) Hal-usage:196608(0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER) HalStream::(consumer/producer)Usage:0/196608 0xb400007cc6309198 phy:-1
02-16 14:45:28.270 12610 12718 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x2 1920x1080 OUT ImgFormat:8960(JPEG) BufPlanes(strides/sizeInBytes):[ 3327252/3327296 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x146931712(V0_JFIF|STANDARD_BT601_625|TRANSFER_SMPTE_170M|RANGE_FULL) s2:d0:App:BLOB:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE AllocImgFormat:33(BLOB) AllocBufPlanes(strides/sizeInBytes):[ 3327252/3327296 ] Real:33(BLOB) Request:33() Override:8960(UNKNOWN) Hal-Client-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) Hal-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) HalStream::(consumer/producer)Usage:0/131123 0xb400007cc6309418 phy:-1
```

| streaming | 识别关键字       | 图片格式  | 色彩空间                                                                    |
| --------- | ---------------- | --------- | --------------------------------------------------------------------------- |
| Preview   | HW_TEXTURE       | NV21      | `0x0(V0_BT601_625\|STANDARD_BT601_625\|TRANSFER_SMPTE_170M\|RANGE_LIMITED)` |
| Record    | HW_VIDEO_ENCODER | AFBC_NV12 | `0x260(V0_BT709\|STANDARD_BT709\|TRANSFER_SMPTE_170M\|RANGE_LIMITED)`       |

| streaming | 识别关键字      | 图片格式 | 色彩空间                                                                    |
| --------- | --------------- | -------- | --------------------------------------------------------------------------- |
| Preview   | HW_TEXTURE      | NV21     | `0x0(UNKNOWN)`                                                              |
| VSS       | HW_CAMERA_WRITE | JPEG     | `0x146931712(V0_JFIF\|STANDARD_BT601_625\|TRANSFER_SMPTE_170M\|RANGE_FULL)` |
