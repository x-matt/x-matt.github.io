- [[MTK] MIVI 3.0 Streaming Crop Logic](https://xiaomi.f.mioffice.cn/wiki/wikk4CcBfpOmC3hNRPYB5RMrDEc)
- [sat控制的crop介绍](https://xiaomi.f.mioffice.cn/docx/doxk40YYvEnHTL1FLw8uydnBZAh)

ABBR     | Full Name                                   | Remark
---------|---------------------------------------------|---------------------------------------------------------
VSE      | Video Stream Engine                         | MTK的模块, 主要完成的任务是视频降噪
WPE      | Warping Engine                              | 主要用来实现图片的扭转功能(EIS, SAT, LDC等矫正算法会用)
PQDIP/PQ | Picture Quality Display Improvement Program | MTK的图像处理模块, 包含色彩增强、锐化、去噪、动态对比度, 同时负责图片的裁切/放大/缩小, 色域转换等功能
EIS      | Electronic Image Stabilization              | 电子防抖
SAT      | Spatial Alignment Transform                 | 空间对齐变换, 同时实现多摄间的平滑切换

## Module Function

### MTK HW Module

| Type | InstanceName | Function                    |
| ---- | ------------ | --------------------------- |
| VSE  | MCNR         | NR                          |
|      | WARP_MCNR    | Warrping + NR               |
|      | MCNR_PQ      | NR + Crop/Resize            |
|      | WARP_MCNR_PQ | Warrping + NR + Crop/Resize |
| WPE  | WARP         | Warrping                    |
|      | PQ           | Crop/Resize                 |
|      | WARP_PQ      | Warrping + Crop/Resize      |

### Fov Consumer

| Consumer         | CROPID | Meta                                                                                                                  | Remark                                                                   | HardWare |
| ---------------- | ------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------- |
| SensorControl/P1 | CROP1  | XIAOMI_MTK_SENSOR_SCALER_CROP_REGION  (MTK_SENSOR_SCALER_CROP_REGION)<br>`com.xiaomi.camera.sensorpolicy.cropregions` | 有sat时候由sensorControl来裁切, 没有sat时候由P1完成裁切                                  | /        |
| SAT/EIS          | CROP2  | `com.xiaomi.camera.sensorpolicy.cropregions`                                                                          | 基于warpMap的grid完成裁切, SAT&EIS同时存在时, SAT需要传matrix给EIS, 由eis生成统一的warpMap完成裁切 | WARP     |
| PQ               | CROP3  | XIAOMI_OUTPUT_DST_ZOOM_ROI                                                                                            | 需要完成app下发的zoomRatio对应的裁切比例                                               | PQ       |

## With EIS

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=Ll2EK-sV8mJeRc8hb3SzC|Dynamic Margin|700]]

### With EIS With SAT

#### InlineEIS With SAT

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=Sf_mvEASJD-1G-njklvmk|1000]]
#### NonInlineEIS With SAT

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=YqQ1K7USIlKOZj3XkPrwU|1000]]
### With EIS Without SAT

#### InlineEIS WithOut SAT

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=DevBX4NFDKPE_ShzZVEEL|1000]]
#### InlineEIS Queue WithOut SAT

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=EnGYOhkNIxATlVzin5LtR|1000]]
#### NonInlineEIS WithOut SAT

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=diY1itWearKJPwKHSp9c3|1000]]
## Without EIS

### Without EIS With SAT

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=J-jIABaPGaJj0KIFOa0ys|1000]]
### Without EIS Without SAT

![[assets/images/crop 2024-03-22 14.38.18.excalidraw.md#^frame=xAyQMFpW9WMS-1RCIQvta|1000]]
### zoomEIS

![[assets/images/zoomeis 2024-03-24 14.24.23.excalidraw.md#^frame=xRfsNllgKgsFWpM9-vjVT|1100]]

## Video Night

![[videonight.excalidraw|1100]]
