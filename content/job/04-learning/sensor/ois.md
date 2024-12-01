## OIS的作用

1. 像隐形三脚架
1. 提升夜景拍摄品质
1. 增加画面亮度，提升阴影处细节

### 分类

1. 镜头移动(最常用)
1. sensor移动
1. 两者一起移动

### 组成

1. OIS Gyro (两轴):　感知角度，芯片LSM6DSO支持两路Gyro输出
1. OIS Controller:　OIS控制单元，软件OIS算法实现
    - 硬件OIS：通过MCU来处理gyro数据
    - 软件OIS：通过sensorHUB来计算gyro的积分(节约MCU的成本)
1. OIS driver:采用两颗HALL驱动芯片AK7323，分别控制X,Y方向的镜头移动
1. Actuatior:移动镜组

## L11 预研

- EIS: vidhance v-3.12.0
- OIS: AKM S5KHM2 108M；9cell1

### Sensor[详细参数](https://www.samsung.com/semiconductor/image-sensor/mobile-image-sensor/S5KHM2/)

参数           | 说明                    | 参数        | 说明
---------------|-------------------------|-------------|---------------------
Resolution     | 12000x9000 (108M)       | Pixel Size  | 0.7um
Optical Format | 1/1.52"                 | Pixel Type  | ISOCELL Plus
Frame Rate     | 120fps @ 4K, 24fps @ 8K | Interface   | MIPI 4 Lane RAW
Chroma         | Nonapixel               | Auto Focus  | Super-PD
Product Status | Mass Production         | Application | Mobile phone, Tablet

### 误差说明

参数                  | 说明                        | error in pixel
----------------------|-----------------------------|---------------
OIS motor sensitivity | 0.063 ~ 0.066 um/ hall_code | e
sensor size           | 4000x3000                   | 3e
1080p-margin25        | 2400x1360                   | 9e/5
4k-margin0            | 3840x2176                   | 72e/25

### 命令说明

命令说明      | 参数
--------------|----------------------------------------------------------------
开启data-dump | `adb shell setprop debug.sensorprovider.dump 1`
开关OIS       | `adb shell setprop vendor.debug.camera.disableOIS 0/1`
Lock OIS      | `adb shell setprop vendor.debug.camera.OISCenteringOn 1`
初始化OIS     | `adb shell setprop vendor.debug.camera.oisGainX 16300`
^             | `adb shell setprop vendor.debug.camera.oisGainY 16600`
^             | `adb shell setprop vendor.debug.camera.oisDelayX 5`
^             | `adb shell setprop vendor.debug.camera.oisDelayY 5`
^             | `adb shell setprop vendor.debug.camera.oisSetAlgoParam.trigger 1`

### 其他说明

- L11的采样率为 $1kHz$
- L11A的采样率为 $500Hz$

## 误差计算

以L2M为例：

- OIS数据采样率：$f = 500 \quad(Hz)$
- 获取OIS数据周期：$T = 6000 \quad(us)$
- TS计算误差：$\Delta = (T\times f^{2})^{-1}\times10^{15} = 666666\quad(ns)$
EIS要求的OIS时间周期
[frame.timestamp, frame.timestamp + frame.exposureTime + frame.rollingShutterTime + 误差]

## 相关文档

[MTK软件OIS介绍](https://wiki.n.miui.com/pages/viewpage.action?pageId=573596469)
[L11低成本OIS方案介绍](https://xiaomi.f.mioffice.cn/docs/dock4IsWWqVxfRG0ozneE5xKNkd)
[OIS数据传输](https://xiaomi.f.mioffice.cn/docs/dock4bw66nrHKMBsB6pfWSHV9Jc?sidebarOpen=1)
