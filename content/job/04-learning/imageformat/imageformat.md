## 图像格式

### 类别

![[assets/images/imageformat 2024-04-06 03.38.29.excalidraw.md#^frame=qYTEThagfCXoeAuS1jeUU|Image Format|800]]

### 差异

#### YUV

- Y: 明亮度(Luma), 就是灰度图
- UV: 色度(Choma), 表示色彩和饱和度
  - $Cb$: 蓝色色度分量
  - $Cr$: 红色色度分量
- 收益:
    1. 兼容性: 兼容黑白电视
    1. 减少内存: 人眼对UV敏感度小, 所以可以减少UV分量
- 采样方式:
    1. YUV444: $1:1:1$ (不共享UV)
    1. YUV422: $1:0.5:0.5$ (每2个pix共享UV)
    1. YUV420: $1:0.25:0.25$ (每4个pix共享UV)
- 排列类型[^2][^3]:
    1. planar: 3个平面, Y&U&V
    1. semi-planar: 2个平面, Y&UV
    1. packed: YUV连续放置


#### RAW

- 组成: G(50%), R(25%), B(25%)
  - 原因: 人眼对绿色最敏感
  - 基于三原色, RGB

#### 内存占用

假设:

- image resolution为 W*H
- raw 为 mipi 10bit
- Memory: $value = W*H*N_{channel}*N_{depth}/8$, 单位是 *Byte*

| Format | Memory        |
| ------ | ------------- |
| RAW10  | $W*H*1*10/8$  |
| NV12   | $W*H*1.5*8/8$ |
| RGB    | $W*H*3*8/8$   |

### 生成

![[2023-10-08-11-45-19.png|图片转换流程|800]]
![[imageformat 2024-03-22 16.50.21.excalidraw|700]]


- RAW-mosaic: 由sensor直出, 是单通道
- RGB: raw图经过de-mosaic之后生成, 是三通道
- 4 cell
  - 直出16M, 但是排列有差异, 属于 split-big-mosaic(16M)
  - 亮环境下, 通过 re-mosaic将 split-big-mosaic转换成 mosaic(16M)
  - 暗环境下, 通过 merged(4in1), 将split-big-mosaic转换成 big-mosaic(4M)

![[assets/images/imageformat 2024-04-06 03.38.29.excalidraw.md#^frame=J7dAPWzn3GXQQM3RxJoTc|Sensor Type|600]]

![[imageformat 2024-07-30 11.23.42.excalidraw|Four Cell Sensor|700]]

[[raw]]
[[yuv]]


## Android相关HAL格式清单[^1]

> - system/core/include/system/graphics-base-vx.x.h
> - [google git common_types](https://android.googlesource.com/platform/hardware/interfaces/+/refs/heads/main/graphics/common/1.0/types.hal)

#colorspace 
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

HAL_PIXEL_FORMAT_YCBCR_420_888:
- $YC_bC_r$的泛化格式, 不会具体指明是YU12/YU12/NC12/NV21, 表面所有420排列, 每个分量为8bit的yuv格式[^4]
- 该格式的图像使用3个独立的buffer表示[^5]
NV21是android的PREVIEW默认图像格式


MIVI3.0的imageFormat在 `common/api/Common.h`

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

### MTK 相关format

```log
10-25 14:20:08.660  9643  9744 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]         0 1920x1080 OUT ImgFormat:17(NV21) BufPlanes(strides/sizeInBytes):[ 1920/2073600 1920/1062720 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x0(V0_JFIF|STANDARD_BT601_625|TRANSFER_SMPTE_170M|RANGE_FULL) s0:d4:App:NV21:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE AllocImgFormat:17(NV21) AllocBufPlanes(strides/sizeInBytes):[ 1920/2073600 1920/1062720 ] Real:17(NV21) Request:17() Override:0(UNKNOWN) Hal-Client-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) Hal-usage:131379(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE|HW_TEXTURE) HalStream::(consumer/producer)Usage:0/131379 StreamUseCase:0 0xb400007bae79e198 phy:-1
10-25 14:20:08.660  9643  9744 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x1 1920x1080 OUT ImgFormat:9483(AFBC_NV12) BufPlanes(strides/sizeInBytes):[ 1920/3264512 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x260(V0_BT709|STANDARD_BT709|TRANSFER_SMPTE_170M|RANGE_LIMITED) s1:d4:App:UNKNOWN:0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER AllocImgFormat:9483(AFBC_NV12) AllocBufPlanes(strides/sizeInBytes):[ 1920/3264512 ] Real:9483(UNKNOWN) Request:9483() Override:0(UNKNOWN) Hal-Client-usage:196608(0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER) Hal-usage:196608(0|HW_CAMERA_WRITE|HW_VIDEO_ENCODER) HalStream::(consumer/producer)Usage:0/196608 StreamUseCase:0 0xb400007bae79ec18 phy:-1
10-25 14:20:08.660  9643  9744 I MtkCam/ppl_context: [dump]     [IMAGE-APP-PROVIDER]       0x2 1920x1080 OUT ImgFormat:8960(JPEG) BufPlanes(strides/sizeInBytes):[ 3338692/3338752 ] startOffset:0 bufStep:0 t:0 maxBuffers:1 d/s:0x146931712(V0_JFIF|STANDARD_BT601_625|TRANSFER_SMPTE_170M|RANGE_FULL) s2:d4:App:BLOB:0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE AllocImgFormat:8960(JPEG) AllocBufPlanes(strides/sizeInBytes):[ 3338692/3338752 ] Real:33(BLOB) Request:33() Override:0(UNKNOWN) Hal-Client-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) Hal-usage:131123(0|SW_READ_OFTEN|SW_WRITE_OFTEN|HW_CAMERA_WRITE) HalStream::(consumer/producer)Usage:0/131123 StreamUseCase:0 0xb400007bae79e518 phy:-1
```

### Qcom的imageformat

> chi-cdk/api/common/chicommon.h

## 参考资料

[^1]:[Android 图像格式HAL_PIXEL_FORMAT_* vs ImageFormt.*对应关系](http://e.betheme.net/article/show-968261.html?action=onClick)
[^2]:[RAW、RGB、YUV 图像格式区别](https://zhuanlan.zhihu.com/p/559189793)
[^3]:[图像格式总结](https://zhuanlan.zhihu.com/p/538058910?utm_id=0)
[^4]:[YUV_420_888](https://developer.android.com/reference/android/graphics/ImageFormat#YUV_420_888)
[^5]:[安卓camera2 API获取YUV420_888格式详解](https://blog.csdn.net/weekend_y45/article/details/125079916)
