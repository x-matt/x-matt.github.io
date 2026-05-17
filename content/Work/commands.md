---
title: MTK EIS 命令与调试
created: 2026-01-16
tags:
  - eis
  - mtk
  - debug
---

## 1. 基础命令

### 1.1 确认EIS开启

```bash
adb logcat | grep DoRSCMEEis
```

### 1.2 切换MTK-EIS与VIDHANCE-EIS

```bash
adb shell setprop persist.vendor.camera.disableMtkEIS
```


## 2. Gyro校准命令

### 2.1 基础校准

Place the phone horizontally and keep it in static state

```bash
adb root
adb remount
adb push high_freq_sensor_tool vendor
adb shell
chmod 777 vendor/high_freq_sensor_tool
./vendor/high_freq_sensor_tool -c 4,1,20000000,0
# Another Console
./vendor/high_freq_sensor_tool -c 4,3,0,0
cat mnt/vendor/nvcfg/sensor/gyro_cali.json
```

### 2.2 EM mode校准gyro

```bash
adb root
adb shell setenforce 0
adb shell chmod 777 /dev/hf_manager
adb shell chmod 777 /dev/msensor
adb shell chmod 777 /dev/gsensor
adb shell chmod 777 /dev/als_ps
adb shell chmod 777 /dev/gyroscope
```

## 3. GIS校准命令

### 3.1 预操作（设权限）

前提：**userdebuglogger** ROM

```bash
adb wait-for-device
adb root
adb wait-for-device
adb shell setenforce 0
adb wait-for-device
adb shell mkdir /data/vendor/camera_dump/eis
adb wait-for-device
adb shell chmod 777 /data/vendor/camera_dump/eis
adb wait-for-device
adb shell mkdir /data/vendor/camera_dump/eis/gyro
adb wait-for-device
adb shell chmod 777 /data/vendor/camera_dump/eis/gyro
## 取出文件 GIS_default_parameter_main.txt
adb pull /data/vendor/camera_dump/eis/gyro/
```

### 3.2 进入EM

1. `*#*#3646633#*#*`
2. Hardware Testing
3. Camera
4. 选sensor，选Sensor Mode为Video size
5. 点击GIS Calibration

### 3.3 修改文件

1. pull出文件 `adb pull /data/vendor/camera_dump/eis/gyro/`
2. 将 `GIS_default_parameter_main.txt` 中的文件添加到对应Sensor中
   - UW: `mt6885/hal/imgsensor/ver1/hi1337sunny_mipi_raw/camera_gis_para_hi1337sunnymipiraw.h`
   - Wide: `mt6885/hal/imgsensor/ver1/imx682sunny_mipi_raw/camera_gis_para_imx682sunnymipiraw.h`
   - Front: `mt6885/hal/imgsensor/ver1/s5k3t2sunny_mipi_raw/camera_gis_para_s5k3t2sunnymipiraw.h`

> 1. 通过 `ConfigGyroAlgo` 关键字，比对是否生效
> 1. 修改 `camera_custom_eis.cpp` 中的default值

## 4. EIS开关命令

### 4.1 MTK-VidhanceEIS

```bash
# 开启
adb shell setprop vendor.debug.tpi.s.eis.onoff 1
# 关闭
adb shell setprop vendor.debug.tpi.s.eis.onoff 0
```

### 4.2 vidhance-EIS

```bash
adb shell setprop vendor.vidhance.enabled 0
```

## 5. M16T 评估开关对比命令

### 5.1 set EISMargin 0

```bash
adb shell setprop vendor.debug.scenario.s.eisMargin 0
adb shell setprop vendor.vidhance.preview.increasedsize 0
adb shell setprop vendor.vidhance.video.increasedsize 0
# back to the default
adb shell setprop vendor.debug.scenario.s.eisMargin 25
adb shell setprop vendor.vidhance.preview.increasedsize 1
adb shell setprop vendor.vidhance.video.increasedsize 1
```

### 5.2 set Record latency 0

```bash
adb shell setprop vendor.debug.scenario.s.eisQCount 0
adb shell setprop vendor.vidhance.video.vs.latency 0
# back to the default
adb shell setprop vendor.debug.scenario.s.eisQCount 30
adb shell setprop vendor.vidhance.video.vs.latency 30
```

### 5.3 force close FaceBeauty

```bash
adb shell setprop vendor.debug.tpi.s.fb.onoff 0
# back to the default
adb shell setprop vendor.debug.tpi.s.fb.onoff 1
```

### 5.4 test Default-ROM supEIS power

### 5.5 set inputSize to 2384x1784

```bash
adb shell setprop vendor.vidhance.preview.vs.super.cropfactor 0.81
adb shell setprop vendor.vidhance.video.vs.super.cropfactor 0.81
```

### 5.6 set inputSize to 2400x1350

```bash
adb shell setprop vendor.vidhance.video.vs.super.cropfactor 0.80
adb shell setprop vendor.vidhance.preview.vs.super.cropfactor 0.80
adb shell setprop vendor.vidhance.video.usefullfov 0
adb shell setprop vendor.vidhance.preview.usefullfov 0
```

### 5.7 delete VH-pipeline's MCTF-Node

```bash
adb push com.qti.chiusecaseselector.so vendor/lib64
adb reboot
```

### 5.8 Switch VH-Node to Qcom-Node

```bash
adb push com.qti.chiusecaseselector.so vendor/lib64
adb reboot
```

## 6. EIS调试属性

### 6.1 平台属性配置

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

