---
title: Crop Logic
type: area
domain: work
category: platform
status: active
priority:
review:
tags:
  - mivi
  - streaming
  - crop
---

| ABBR     | Full Name                                   | Remark                                                                                                |
| -------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| VSE      | Video Stream Engine                         | MTK的模块, 主要完成的任务是视频降噪                                                                   |
| WPE      | Warping Engine                              | 主要用来实现图片的扭转功能(EIS, SAT, LDC等矫正算法会用)                                               |
| PQDIP/PQ | Picture Quality Display Improvement Program | MTK的图像处理模块, 包含色彩增强、锐化、去噪、动态对比度, 同时负责图片的裁切/放大/缩小, 色域转换等功能 |
| EIS      | Electronic Image Stabilization              | 电子防抖                                                                                              |
| SAT      | Spatial Alignment Transform                 | 空间对齐变换, 同时实现多摄间的平滑切换                                                                |

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

| Consumer         | CROPID | Meta                          | Remark                                                                   | HardWare |
| ---------------- | ------ | ----------------------------- | ------------------------------------------------------------------------ | -------- |
| SensorControl/P1 | CROP1  | MTK_SENSOR_SCALER_CROP_REGION | 有sat时候由sensorControl来裁切, 没有sat时候由P1完成裁切                                  | /        |
| SAT/EIS          | CROP2  |                               | 基于warpMap的grid完成裁切, SAT&EIS同时存在时, SAT需要传matrix给EIS, 由eis生成统一的warpMap完成裁切 | WARP     |
| PQ               | CROP3  | OUTPUT_DST_ZOOM_ROI           | 需要完成app下发的zoomRatio对应的裁切比例                                               | PQ       |

## With EIS

![[crop 2025.excalidraw#^frame=dynamic margin|Dynamic Margin On/Off|600]]

### Related Flow

![[crop 2025.excalidraw#^frame=flow|900]]

### zoomEIS

![[zoomeis 2025.excalidraw]]

## Video Night

![[videonight 2025.excalidraw|800]]
