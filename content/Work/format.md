---
title: Format
type: area
status: active
domain: imagedata
priority:
review:
---

## 图片格式

常见的色彩编码系统: **RGB** / **YUV** / **RAW**

![[format 2025.excalidraw#^frame=imageformat|Image Format|600]]

## RGB

- 基于三原色 红/绿/蓝
- 模拟/数字信号与伽马矫正:

| RGB      | 无伽马矫正  | 有伽马矫正     | 取值            |
| -------- | ----------- | -------------- | --------------- |
| 模拟信号 | $RGB$       | $R'G'B'$       | $R,G,B\in[0,1]$ |
| 数字信号 | $R_dG_dB_d$ | $R'_dG'_dB'_d$ |                 |

## YUV

### 基础概念

- **Y**: 明亮度 (Luma), 就是灰度图
- **UV**: 色度 (Chroma), 表示色彩和饱和度
  - $C_b$: 蓝色色度分量
  - $C_r$: 红色色度分量
- YUV / YCbCr / YPbPr
  - 日常中 $YC_bC_r$ 默认等价于 YUV, b 代表蓝色, r 代表红色
- 优点:
  1. 亮度信号 (Y) 与色度信号 (UV) 相互独立, 兼容黑白电视
  2. 利用人眼对色度敏感度低于亮度的特性, 减少存储容量和传输带宽

### 信号表示

| YUV      | 无伽马矫正 | 有伽马矫正 | Type    | Y range        | UV Range             |
| -------- | ---------- | ---------- | ------- | -------------- | -------------------- |
| 模拟信号 | $YCC$      | $Y'P_bP_r$ | -       | $Y\in[0,1]$    | $U,V\in[-0.5,0.5]$   |
| 数字信号 | $YC_bC_r$  | $Y'C_bC_r$ | Full    | $Y\in[0,255]$  | $C_b,C_r\in[0,255]$  |
|          |            |            | Limited | $Y\in[16,235]$ | $C_b,C_r\in[16,240]$ |

Limited Range 的目的: **解决滤波 (模数转换) 后的过冲现象**

> [!quote] Y' values are conventionally shifted and scaled to therange [16, 235] (referred to as
> studio swing or "TV levels")rather than using the full range of [0, 255] (referred to asfull swing
> or "PC levels"). This practice was standardized inSMPTE-125M in order to accommodate signal
> overshoots("ringing") due to filtering. The value 235 accommodates amaximal black-to-white
> overshoot of 255 − 235 = 20, or 20 /(235 − 16) = 9.1%, which is slightly larger than
> thetheoretical maximal overshoot (Gibbs phenomenon) of about 89% of the maximal step. The toe-room
> is smaller, allowingonly 16 / 219 = 7.3% overshoot, which is less than thetheoretical maximal
> overshoot of 8.9%. This is why 16 isadded to Y' and why the Y' coefficients in the basictransform
> sum to 220 instead of 255. U and V values, whichmay be positive or negative, are summed with 128
> to make themalways positive, giving a studio range of 16–240 for U and V.(These ranges are
> important in video editing and production,since using the wrong range will result either in an
> imagewith "clipped" blacks and whites, or a low-contrast image.)

### 采样方式 (4:4:4 / 4:2:2 / 4:2:0)

原因: 人眼对色度敏感度低于亮度, 以此消除富裕的色彩内存

![[yuv-sampling 2025.excalidraw|YUV图像排列|500]]

| 类型  | 比例  | 扫描线上采样点数 | 扫描线个数 | 内存           |
| ----- | ----- | :--------------: | :--------: | -------------- |
| 4:4:4 | 4:4:4 |       1:1        |    1:1     | 3×Resolution   |
| 4:2:2 | 4:2:2 |       2:1        |    1:1     | 2×Resolution   |
| 4:1:1 | 4:1:1 |       4:1        |    1:1     | 1.5×Resolution |
| 4:2:0 | 4:1:1 |       2:1        |    2:1     | 1.5×Resolution |

UV 共享关系:

- YUV444: $1:1:1$ (不共享 UV)
- YUV422: $1:0.5:0.5$ (每 2 个 pix 共享 UV)
- YUV420: $1:0.25:0.25$ (每 4 个 pix 共享 UV)

### 排列与存储方式

排列类型[^2][^3]:

1. **planar**: 3 个平面, Y / U / V
2. **semi-planar**: 2 个平面, Y / UV
3. **packed**: YUV 连续放置

具体存储格式:

- **YUV444**
  - YUV444p: `YYYYYYYY VVVVVVVV UUUUUUUU`
- **YUV422**
  - YUV422p: `YYYYYYYY VVVV UUUU`
  - YUYV: `YUYV YUYV YUYV YUYV`
  - UYVY: `UYVY UYVY UYVY UYVY`
- **YUV420**
  - YUV420p
    - YV12: `YYYYYYYY VV UU`
    - I420: `YYYYYYYY UU VV`
  - YUV420sp
    - NV12: `YYYYYYYY UVUV`
    - NV21: `YYYYYYYY VUVU`

### 色彩系统间转换

在计算机程序中所进行的 YUV / RGB 转换, 大部分情况都是指 $Y'C_bC_r$ 和 $R'_dG'_dB'_d$ 间的转换

1. 数模转换: $R'_dG'_dB'_d \Leftrightarrow R'G'B'$
2. 模拟内转换: $R'G'B' \Leftrightarrow Y'P_bP_r$
3. 模数转换: $Y'P_bP_r \Leftrightarrow Y'C_bC_r$

## RAW

### RAW基础概念

![[format 2025.excalidraw#^frame=raw flow|Raw Flow|800]]

- 组成: G (50%), R (25%), B (25%)
  - 原因: 人眼对绿色最敏感
  - 基于三原色 RGB
- 来源差异:
  - 单反/无反上的 RAW 基本都是私有格式
  - 手机上的 RAW 一般是通用公开的 **DNG** (Digital Negative, Adobe 开发) 格式

### 存储方式

按照存储方式分类, 假设 sensor raw 是 10bit[^6]:

1. **MIPI Raw** (Mobile Industry Processor Interface)
   ![[format 2025.excalidraw#^frame=mipi raw storage|MIPI Raw Storage|500]]
2. **Unpacked
   Raw**: 低 10 位被占用, 高 6 位为空 ![[format 2025.excalidraw#^frame=unpacked raw storage|Unpacked Raw Storage|500]]

内存占用分析:

- 同样数量 ($N$) 的 RAW 图, MIPI 单位计算量为 10, Unpacked 为 16
- 内存比 $M_{unpacked}/M_{mipi} = 8/5 = 1.6$

### Sensor 与生成流程

![[format 2025.excalidraw#^frame=r2j|Raw to Jepg|500]]

- **RAW-mosaic**: 由 sensor 直出, 是单通道
- **RGB**: raw 图经过 de-mosaic 之后生成, 是三通道
- **4 cell**:
  - 直出 16M, 但是排列有差异, 属于 split-big-mosaic (16M)
  - 亮环境下, 通过 re-mosaic 将 split-big-mosaic 转换成 mosaic (16M)
  - 暗环境下, 通过 merged (4in1), 将 split-big-mosaic 转换成 big-mosaic (4M)

![[format 2025.excalidraw#^frame=sensortype|600]]
![[format 2025.excalidraw#^frame=Raw Domain|Four Cell Sensor|700]]

## 内存计算

假设:

- image resolution 为 W\*H
- raw 为 mipi 10bit
- 公式: $value = W*H*N_{channel}*N_{depth}/8$, 单位是 _Byte_

| Format | Memory        |
| ------ | ------------- |
| RAW10  | $W*H*1*10/8$  |
| NV12   | $W*H*1.5*8/8$ |
| RGB    | $W*H*3*8/8$   |

## 平台格式定义

### Android HAL[^1]

> - `system/core/include/system/graphics-base-vx.x.h` #colorspace
> - [google git common_types](https://android.googlesource.com/platform/hardware/interfaces/+/refs/heads/main/graphics/common/1.0/types.hal)

```cpp
// stream format
HAL_PIXEL_FORMAT_RGBA_8888 = 1,
HAL_PIXEL_FORMAT_RGBX_8888 = 2,
HAL_PIXEL_FORMAT_RGB_888 = 3,
HAL_PIXEL_FORMAT_RGB_565 = 4,
HAL_PIXEL_FORMAT_BGRA_8888 = 5,
HAL_PIXEL_FORMAT_YCBCR_422_SP = 16,
HAL_PIXEL_FORMAT_YCRCB_420_SP = 17,  // NV21
HAL_PIXEL_FORMAT_YCBCR_422_I = 20,
HAL_PIXEL_FORMAT_RGBA_FP16 = 22,
HAL_PIXEL_FORMAT_RAW16 = 32, // a single-channel, 16-bit, little endian format
HAL_PIXEL_FORMAT_BLOB = 33,
HAL_PIXEL_FORMAT_IMPLEMENTATION_DEFINED = 34,
HAL_PIXEL_FORMAT_YCBCR_420_888 = 35,
HAL_PIXEL_FORMAT_RAW_OPAQUE = 36,
HAL_PIXEL_FORMAT_RAW10 = 37,
HAL_PIXEL_FORMAT_RAW12 = 38,
HAL_PIXEL_FORMAT_RGBA_1010102 = 43,
HAL_PIXEL_FORMAT_Y8 = 538982489,
HAL_PIXEL_FORMAT_Y16 = 540422489,
HAL_PIXEL_FORMAT_YV12 = 842094169,
// 后续增加
HAL_PIXEL_FORMAT_YCBCR_P010 = 54,

// stream dataspace
HAL_DATASPACE_JFIF = 257,
HAL_DATASPACE_V0_JFIF = 146931712,  // ((STANDARD_BT601_625 | TRANSFER_SMPTE_170M) | RANGE_FULL)
HAL_DATASPACE_BT709 = 260,
HAL_DATASPACE_V0_BT709 = 281083904,  // ((STANDARD_BT709 | TRANSFER_SMPTE_170M) | RANGE_LIMITED)
```

- `HAL_PIXEL_FORMAT_YCBCR_420_888`:
  - $YC_bC_r$
    的泛化格式, 不会具体指明是 YU12/YV12/NV12/NV21, 表示所有 420 排列、每个分量为 8bit 的 yuv 格式[^4]
  - 该格式的图像使用 3 个独立的 buffer 表示[^5]
- `NV21` 是 android 的 PREVIEW 默认图像格式

### MIVI3.0

> `mivifwk-common/api/Common.h`

```cpp
enum MiaPixelFormat {
    CAM_FORMAT_UNDEFINED = 0x0, // for pipeline check, not a useful format
    CAM_FORMAT_YUV_420_NV21 = 17,
    CAM_FORMAT_RAW16 = 32,
    CAM_FORMAT_BLOB = 33,
    CAM_FORMAT_IMPLEMENTATION_DEFINED = 34,
    CAM_FORMAT_YUV_420_NV12 = 35,
    CAM_FORMAT_RAW_OPAQUE = 36,
    CAM_FORMAT_RAW10 = 37,
    CAM_FORMAT_RAW12 = 38,
    CAM_FORMAT_RAW14 = 41,
    CAM_FORMAT_Y16 = 540422489,
    CAM_FORMAT_YV12 = 842094169,
    CAM_FORMAT_Y8 = 0x20203859,
    CAM_FORMAT_P010 = 54, // ImageFormat's P010 0x3
    CAM_FORMAT_MTK_NV12 = 4096,
    CAM_FORMAT_JPEG = 8960,
    PRIVATE_START = 1 << 30,
    CAM_FORMAT_PACKED_P010 = PRIVATE_START, // mtk R3 P010
    CAM_FORMAT_YUV_420_NV21_ALIGN128,       // mtk front portrait 128 alignment
};
```

### MTK ImageFormat

> `include/mtkcam-halif/def/ImageFormat.h`

### Qcom ImageFormat

> `camx/core/hal/camxcommontypes.h`

[^1]: [Android 图像格式HAL*PIXEL_FORMAT\*\* vs ImageFormt.*对应关系](http://e.betheme.net/article/show-968261.html?action=onClick)

[^2]: [RAW、RGB、YUV 图像格式区别](https://zhuanlan.zhihu.com/p/559189793)

[^3]: [图像格式总结](https://zhuanlan.zhihu.com/p/538058910?utm_id=0)

[^4]: [YUV_420_888](https://developer.android.com/reference/android/graphics/ImageFormat#YUV_420_888)

[^5]: [安卓camera2 API获取YUV420_888格式详解](https://blog.csdn.net/weekend_y45/article/details/125079916)

[^6]: [MIPI RAW图像数据与RAW图像数据的区别](https://deepinout.com/camera-terms/mipi-raw-image-data-and-raw-image-data-differences.html?replytocom=5366)
