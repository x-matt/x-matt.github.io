---
title: Ois
type: area
domain: work
category: feature
status: active
priority:
review:
tags:
  - ois
---

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

| 参数           | 说明                    | 参数        | 说明                 |
| -------------- | ----------------------- | ----------- | -------------------- |
| Resolution     | 12000x9000 (108M)       | Pixel Size  | 0.7um                |
| Optical Format | 1/1.52"                 | Pixel Type  | ISOCELL Plus         |
| Frame Rate     | 120fps @ 4K, 24fps @ 8K | Interface   | MIPI 4 Lane RAW      |
| Chroma         | Nonapixel               | Auto Focus  | Super-PD             |
| Product Status | Mass Production         | Application | Mobile phone, Tablet |

### 误差说明

| 参数                  | 说明                        | error in pixel |
| --------------------- | --------------------------- | -------------- |
| OIS motor sensitivity | 0.063 ~ 0.066 um/ hall_code | e              |
| sensor size           | 4000x3000                   | 3e             |
| 1080p-margin25        | 2400x1360                   | 9e/5           |
| 4k-margin0            | 3840x2176                   | 72e/25         |

### 命令说明

| 命令说明      | 参数                                                              |
| ------------- | ----------------------------------------------------------------- |
| 开启data-dump | `adb shell setprop debug.sensorprovider.dump 1`                   |
| 开关OIS       | `adb shell setprop vendor.debug.camera.disableOIS 0/1`            |
| Lock OIS      | `adb shell setprop vendor.debug.camera.OISCenteringOn 1`          |
| 初始化OIS     | `adb shell setprop vendor.debug.camera.oisGainX 16300`            |
|               | `adb shell setprop vendor.debug.camera.oisGainY 16600`            |
|               | `adb shell setprop vendor.debug.camera.oisDelayX 5`               |
|               | `adb shell setprop vendor.debug.camera.oisDelayY 5`               |
|               | `adb shell setprop vendor.debug.camera.oisSetAlgoParam.trigger 1` |

### 其他说明

- L11的采样率为 $1kHz$
- L11A的采样率为 $500Hz$

## 误差计算

以L2M为例：

- OIS数据采样率：$f = 500 \quad(Hz)$
- 获取OIS数据周期：$T = 6000 \quad(us)$
- TS计算误差：$\Delta = (T\times f^{2})^{-1}\times10^{15} = 666666\quad(ns)$ EIS要求的OIS时间周期
  [frame.timestamp, frame.timestamp + frame.exposureTime + frame.rollingShutterTime + 误差]

## SOIS

1. 优势
   1. 去除了driver ic, 降低了硬件成本
   2. 算法放置在sensorHub, 节约ois固件加载时间100ms
   3. ois algo 可以实现自研接入
2. 风险4. 校准参数一致性差5. 对sensorhub算例有依赖
3. 其他
   1. video场景防抖优先, zoom场景下跟手性优先
   2. open最前端enable ois, 避免画面出现偏移
4. sensorhub的算力 1. 处理能力 1. 时钟频率:
   sensorhub处理器的运行速度 2. 核心数量 3. 指令每周期: 每个时钟周期内执行的指令数量 2. 数据处理能力 4. 数据吞吐量 5. 并行处理能力 3. 存储和缓存 1. 内存大小 2. 缓存大小 4. 能效 1. 功耗 2. 能效比 5. 延时和响应时间 1. 数据处理延时 2. 实时处理能力 #sois

## Sync Ois #syncois

1. 原理: ois per-frame都做置中操作, 保证per-frame 能够有最大的补偿角度
2. 应用的限制:
   1. 硬件配置
   2. 回正耗时，**拍照13ms，录像10ms**
   3. 振感
   4. 声音被收录
3. 落地情况
   1. 与音源变焦, 3D立体声互斥
   2. 非 rolling shutter 时间 > 10ms 即可enable
4. 收益
   1. 降低撞边概率，per-frame可以全行程补偿，提升防抖效果
   2. 模组移动到target位置的速度更快(从中间位置开始位移)，效果更稳定
