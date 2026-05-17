---
title: MTK EIS 客制化配置
created: 2026-01-16
tags:
  - eis
  - mtk
---

## 1. 配置文件

### 1.1 camera_custom_eis.cpp

| 参数        | 描述                                   | camera_custom_eis.cpp                     |
| ----------- | -------------------------------------- | ----------------------------------------- |
| Factor      | 裁切比                                 | EIS_FSC_FHD_FACTOR <br> EIS_FSC_4K_FACTOR |
| Queue size  | EIS buffer queue size，影响EIS性能(25) | FWDEIS_FRAMES_FHD <br> FWDEIS_FRAMES_4K2K |
| Start Frame | EIS queue 帧数，值不变                 | EIS_START_FRAME                           |
| Lossless    | 影响输入尺寸，默认有损(0)              | SUPPORT_EIS_MODE_LOSSLESS                 |

> EIS Queue 默认25张，延时为825(33\*25)，可选择drop部分帧

## 2. GIS校准文件修改

### 2.1 修改位置

将 `GIS_default_parameter_main.txt` 中的文件添加到对应Sensor中

| Sensor | 文件路径                                                                              |
| ------ | ------------------------------------------------------------------------------------- |
| UW     | `mt6885/hal/imgsensor/ver1/hi1337sunny_mipi_raw/camera_gis_para_hi1337sunnymipiraw.h` |
| Wide   | `mt6885/hal/imgsensor/ver1/imx682sunny_mipi_raw/camera_gis_para_imx682sunnymipiraw.h` |
| Front  | `mt6885/hal/imgsensor/ver1/s5k3t2sunny_mipi_raw/camera_gis_para_s5k3t2sunnymipiraw.h` |

### 2.2 验证方法

1. 通过 `ConfigGyroAlgo` 关键字，比对是否生效
2. 修改 `camera_custom_eis.cpp` 中的default值

## 3. 属性配置

### 3.1 平台属性

```cpp
// === 1. property for platform ===
#define KEY_TPI_EIS_DISABLE          "vendor.debug.tpi.s.eis.onoff"
#define KEY_TPI_EIS_MARGIN           "vendor.debug.tpi.s.eis.margin"
#define KEY_TPI_EIS_DYNAMIC_MARGIN   "vendor.debug.tpi.s.eis.dynamicmargin"
#define KEY_TPI_EIS_QCOUNT           "vendor.debug.tpi.s.eis.qcount"
#define KEY_TPI_EIS_TPIMODE          "vendor.debug.tpi.s.eis.tpimode"
#define KEY_TPI_EIS_WPEMODE          "vendor.debug.tpi.s.eis.warp"
#define KEY_TPI_EIS_GRID_X_NUM       "vendor.debug.tpi.s.eis.x_grid_num"
#define KEY_TPI_EIS_GRID_Y_NUM       "vendor.debug.tpi.s.eis.y_grid_num"
#define KEY_TPI_EIS_WAITINITDONE     "vendor.debug.tpi.s.eis.waitinitdone"
```

### 3.2 HIS算法属性

```cpp
// === 2. property for his algo ===
#define KEY_HIS_DISABLE              "vendor.debug.tpi.s.his.onoff"
#define KEY_HIS_DEBUG                "vendor.debug.tpi.s.his.debug"
#define KEY_HIS_LOGLEVEL             "vendor.debug.tpi.s.his.loglevel"
#define KEY_HIS_CROPFACTOR           "vendor.debug.tpi.s.his.cropfactor"

// algo sub-function
#define KEY_HIS_SELFIE               "vendor.debug.tpi.s.his.selfiemode"
#define KEY_HIS_SUPEREIS             "vendor.debug.tpi.s.his.supereismode"
#define KEY_HIS_DIS                  "vendor.debug.tpi.s.his.dismode"
#define KEY_HIS_DEBLUR               "vendor.debug.tpi.s.his.deblurmode"
#define KEY_HIS_DEBLUR_RAT_DARK      "vendor.debug.tpi.s.his.deblur.ratio.dark"
#define KEY_HIS_DEBLUR_RAT_BRGT      "vendor.debug.tpi.s.his.deblur.ratio.bright"
#define KEY_HIS_DEBLUR_EXP_DARK      "vendor.debug.tpi.s.his.deblur.exp.dark"
#define KEY_HIS_DEBLUR_EXP_BRGT      "vendor.debug.tpi.s.his.deblur.exp.bright"
```

## 4. Margin配置

### 4.1 MTK Margin计算

MTK使用OutputMargin：

```plaintext
input = (100+margin)/100 x output
margin = 25
```

### 4.2 Margin关系

| Platform | Relationship                      | e.g.         | Type         |
| -------- | --------------------------------- | ------------ | ------------ |
| MTK      | input = (100+margin)/100 x output | margin = 25  | OutputMargin |
| Qcom     | input(1-margin) = output          | margin = 0.2 | InputMargin  |

> 100/(100+margin_MTK) = 1-margin_Qcom
