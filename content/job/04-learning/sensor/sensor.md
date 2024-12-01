## Revision history

Revision |    Data    | Description
:-------:|:----------:|-------------------
  v0.1   | 2023.08.23 | Initialize release

## 1. Sensor信息查看

- 查看sensor的型号

	```bash
	adb shell dumpsys sensorservice
	adb shell test-nusensors -l
	```

- 删除NVRAM
`adb shell rm -rf /mnt/vendor/nvcfg/camera/*`

`getevent`

## 2. Camera

### 2.1. 查看模组信息

- 物理尺寸：`adb shell dumpsys media.camera| grep -i physical -A1`
- pixel尺寸：`adb shell dumpsys media.camera| grep -i arraysize -A1`

### 2.2. 供应商

- Sony (imx)
- Samsung (s5)
- OV (ov)
- 格科微 (gc)

### 2.3. 模组信息

`adb shell getprop | grep camera`

|  项目  | 模组类型  | 代号      | 描述                |
| :--: | ----- | ------- | ----------------- |
| L10A | WIDE  | imx582  | 48M (8000x6000)   |
|      | UW    | ov8856  | 8M (3264x2448)    |
|      | FRONT | imx596  | 20M               |
|      | MACRO | gc02m1  | 2M                |
| K11R | WIDE  | s5khm2  | 108M (12000x9000) |
|      | UW    | imx355  | 8M (3264x2448)    |
|      | FRONT | ov16a1q | 16M               |
|      | MACRO | s5k5e9  | 5M                |
|  K1  | WIDE  | s5kgn2  | 108M (12000x9000) |
|      | UW    | imx586  | 8M (3264x2448)    |
|      | FRONT | s5k3t2  | 16M               |
|      | TELE  | imx586  | 5M                |
| L11  | WIDE  | s5khm2  | 108M (12000x9000) |
|      | UW    | s5k4h7  | 8M (3264x2448)    |
|      | FRONT | imx596  | 20M               |
|      | MACRO | gc02m1  | 2M                |
| L2M  | WIDE  | imx707  | 50M(4096x3072)    |

### 2.2. Sensor参数定义

> 64M = 64MP = 64 mega pixel = 6400 万像素

- 4cell1
- remosaic: 将4cell1的图片，转化为Bayer结构
- demosaic
- inSensorZoom: remosic + reagionCrop

## 3. Gyro

- MTK: `/mnt/vendor/nvcfg/sensor`
- Qcom: `/mnt/vendor/persist/sensors/gyro_caldata.txt`

### 3.1. 介绍

- 原理：一个旋转物体的旋转轴所指的方向不受外力影响时，是不会改变的
	- MEMS陀螺仪依赖于相互正交的振动和转动引起的交变科里奥利力，将旋转物体的角速度转换成与角速度成正比的直流电压信号
- 陀螺仪的输出：三个轴上的角速度(roll-x-翻滚角, pitch-y-俯仰角, yaw-z-偏航角)

### 3.2. 硬件信息

命令：
`adb shell dumpsys sensorservice | grep android.sensor.gyroscope\( -A1 | sed "s:|:\n\t:g"`

|   项目   | gyro型号     | 区间(*Hz*)|
|:--------:|--------------|-------------|
|L11 & K10 | lsm6dso_gyro | $[12.5,400]$|
|   L10A   | icm4x6xx     | $[1,500]$|


```log
(PREVIEW)
03-29 20:39:31.685 20687 20687 I mtkcam-devicesessionpolicy: [0:SensorMode:SensorSettingPolicy::parseSensorParamsSetting] candidate [1] (4000x2252)@30  sensorMode:2
(VIDEO)
03-29 20:39:31.685 20687 20687 I mtkcam-devicesessionpolicy: [0:SensorMode:SensorSettingPolicy::parseSensorParamsSetting] candidate [2] (4000x3000)@30  sensorMode:1
(CAPTURE)
03-29 20:39:31.685 20687 20687 I mtkcam-devicesessionpolicy: [0:SensorMode:SensorSettingPolicy::parseSensorParamsSetting] candidate [0] (4000x3000)@30  sensorMode:0
```
