> High Dynamic Range

## 类型

- mf-hdr(mStream)
- staggered-hdr
![[2023-10-09-09-53-56.png|timeline|500]]
## 原理

- 人眼动态范围是100dB
- Sensor 的动态范围： 高端的 >78 dB; 消费级的 60 dB 上下；

动态范围计算公式
$DR = 20log_{10}(i_max / i_min)$

1. 8bit - (1, 255)
1. 10bit - (1, 1023)  DR = 60
1. 12bit - (1, 4095)  DR = 72

## 具体方案

1. 提高感光井能力
    1. 增加电荷容量
    1. 通过多次reset来改善容量
1. 多曝光合成

    ```cpp
    If (Intensity > a) intensity = short_exposure_frame;
    If (Intensity < b) intensity = long_exposure_frame;
    If (b<Intensity <a) intensity = long_exposure_frame x p + short_exposure_frame x q;
    ```

    - 需要很快的readout time，但是即便readout time再小，也还是又多帧导致的鬼影问题,vHDR由于运算时间有限，所以无法进行负责鬼影优化
        - 因此产生了单帧多爆的技术：stagger HDR
            - 其以“行”为单位，能降低鬼影，但是相邻两行之间的曝光时差会增加，会加剧RollingShutter引起的畸变

## vHDR

### 基础知识

![[hdr 2024-08-27 16.47.36.excalidraw|800]]

#### DOL

1. 先长曝后短曝, 等待中的line会少一些

### Qcom

- [MFHDR架构介绍](https://wiki.n.miui.com/pages/viewpage.action?pageId=561357565)
- [MFHDR图像dump](https://wiki.n.miui.com/pages/viewpage.action?pageId=567849584)

### MTK

![[2023-10-09-10-27-25.png|sample|800]]
关键字: `mtkcam-HDRStateEvaluator|mtkcam-HDRPolicyHelper`

```bash
# 强设sensorMode
adb shell setprop vendor.debug.cameng.force_sensormode 0

# 强开vHDR
adb shell setprop vendor.debug.camera.hal3.vhdr 1
adb shell setprop vendor.debug.camera.hal3.appHdrMode 3
```

![[2023-10-10-09-59-58.png|hdr format|800]]
1. Stagger HDR

- <https://gerrit.pt.mioffice.cn/c/quark/kernel-5.10/+/2620775>
- <https://gerrit.pt.mioffice.cn/c/quark/kernel-5.10/+/2622239>
- <https://gerrit.pt.mioffice.cn/c/alps/vendor/mediatek/proprietary/custom/+/2629680>
- <https://gerrit.pt.mioffice.cn/c/quark/mtkcam-android/+/2629689>

1. MStream HDR

```cpp
bool HDRPolicyHelper::isMStreamHDR() {
  return (mHDRHalMode & MTK_HDR_FEATURE_HDR_HAL_MODE_MSTREAM_CAPTURE_PREVIEW);
}

typedef enum mtk_camera_metadata_enum_hdr_hal_mode {
  MTK_HDR_FEATURE_HDR_HAL_MODE_OFF = 0x0,
  MTK_HDR_FEATURE_HDR_HAL_MODE_MVHDR = 0x1,
  MTK_HDR_FEATURE_HDR_HAL_MODE_MSTREAM_CAPTURE = 0x2,
  MTK_HDR_FEATURE_HDR_HAL_MODE_MSTREAM_PREVIEW = 0x4,
  MTK_HDR_FEATURE_HDR_HAL_MODE_MSTREAM_CAPTURE_PREVIEW =
      (MTK_HDR_FEATURE_HDR_HAL_MODE_MSTREAM_CAPTURE |
       MTK_HDR_FEATURE_HDR_HAL_MODE_MSTREAM_PREVIEW),
  MTK_HDR_FEATURE_HDR_HAL_MODE_STAGGER_2EXP = 0x8,
  MTK_HDR_FEATURE_HDR_HAL_MODE_STAGGER_3EXP = 0x10,
  MTK_HDR_FEATURE_HDR_HAL_MODE_STAGGER =
      (MTK_HDR_FEATURE_HDR_HAL_MODE_STAGGER_2EXP |
       MTK_HDR_FEATURE_HDR_HAL_MODE_STAGGER_3EXP),
} mtk_camera_metadata_enum_hdr_hal_mode_t;
```

- 确认 mfHDR

```log
% 确认mfHDR
12-14 16:54:08.908 30719 31285 D mtkcam-HDRPolicyHelper: [HDRPolicyHelper][Cam::0](0xb4000072cbf16018):HDRAppMode(0),HDRHalAppMode(0),HDRHalMode(0x6),HDRSensorMode(0x0),SensorType(0)
```

## 参考资料

1. [HDR Sensor 原理介绍](https://zhuanlan.zhihu.com/p/20705821)
1. [【笔记】HDR 成像技术学习(一)](https://blog.csdn.net/nyist_yangguang/article/details/123056556)
1. [【笔记】HDR 成像技术学习(二)](https://blog.csdn.net/nyist_yangguang/article/details/123094698)
1. [【笔记】HDR 成像技术学习(三)-- LOFIC](https://blog.csdn.net/nyist_yangguang/article/details/123122096)
1. [Omnivision HDR sensor 简介](https://zhuanlan.zhihu.com/p/348447643)
1. [HDR(High Dynamic Range)](https://wiki.n.miui.com/pages/viewpage.action?pageId=577818181)
2. [HDR(DOL/LBMF/DCG/RGBW)-MTK](https://online.mediatek.com/apps/quickstart/QS00419#QSS06209)
