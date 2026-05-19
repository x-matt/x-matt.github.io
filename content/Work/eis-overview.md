---
title: Eis overview
created: 2026-01-16
tags:
  - eis
---

## 1. EIS 厂商

- [[eis-mtk-overview|MTK-EIS]]
- [[eis-qcom-overview|Qcom-EIS]]
- [[eis-algo-his]]
- [[vidhance]]
- [[morpho]]

## 2. EIS 相关测试

### 2.1 功耗测试

- [[power#M16T 评估时候的开关对比命令|M16T 功耗评估]]
- [[power#M12-Power实测|M12 功耗评估]]

### 2.2 MTK 项目 EIS Debug

#### 平台属性配置

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

## 3. CheckList

### 3.1 MTK-自检

| 测试项                          |
| ---------------------------- |
| EIS算法版本号                     |
| EIS-debug等级的log开启方式          |
| EIS-dump方式                   |
| EISNode处理时间(需要打开debug等级的log) |
| 录像场景下EIS功能验证                 |
| UW录像场景下EIS-LDC功能验证           |
| 超级防抖下超级防抖功能验证                |
| 超级防抖下水平矫正功能验证                |
| gyro采样率                      |
| EISMargin                    |
| 校准文件版本                       |

### 3.2 看现象

- 通过APP开关EIS，开启EIS时，FOV会变小
- 录像场景下，快速抖动手机，画面会有拖影（拍摄头发时现象更直观）
- appTag - `android.control.videoStabilizationMode`

### 3.3 看Log/Dump

#### Qcom-EIS

1. 开启dump

```bash
# 1. 开启dump
adb shell "echo EISv3GyroDumpEnabled=1 >> /vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv2GyroDumpEnabled=1 >> /vendor/etc/camera/eisoverridesettings.txt"
# 2. 进入EIS场景
# 3. 进入文件夹确认是否有数据生成
adb pull /data/vendor/camera
```

1. log

- Record跑了EISV3：`camxchinodeeisv3.cpp:5115 IsEISv3Disabled(): Request * is recording 1`
- Preview跑了EISV2：`CHIEISV2`

#### VIDHANCE-EIS

1. 在Qcom平台打开LogD：`adb shell setprop vendor.vidhance.logging.level 1`
   - Preview 关键字：`PublishIca for PREVIEW`
   - Record 关键字：`PublishIca for RECORDING`

2. 在MTK平台打开LogD：`adb shell setprop vendor.vidhance.logging.level 1`
   - Preview 关键字：`Process display`
   - Record 关键字：`Process recording`

#### MTK-EIS

- `adb logcat | grep DoRSCMEEis`

## 4. On/Off EIS

### Qcom-EIS-Intro

```bash
# disableQcomEIS
adb shell "echo EISv3OperationMode=2 >>/vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv2OperationMode=2 >>/vendor/etc/camera/eisoverridesettings.txt"
adb reboot

# enableQcomEIS
adb shell "echo EISv3OperationMode=0 >>/vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv2OperationMode=0 >>/vendor/etc/camera/eisoverridesettings.txt"
adb reboot
```

### MTK-VidhanceEIS

```bash
adb shell setprop vendor.debug.tpi.s.eis.onoff 1
adb shell setprop vendor.debug.tpi.s.eis.onoff 0
```

### vidhance-EIS

```bash
adb shell setprop vendor.vidhance.enabled 0
```

## 5. Margin

| Platform | Relationship                      | e.g.         | Type         |
| -------- | --------------------------------- | ------------ | ------------ |
| MTK      | input = (100+margin)/100 x output | margin = 25  | OutputMargin |
| Qcom     | input(1-margin) = output          | margin = 0.2 | InputMargin  |

> 100/(100+margin) = 1-margin

## 6. WPE-dump

`vendor.camera.p2tpipedump.enable`

## 7. Sensor Mode Index

| cameraID              | Scene                | Resolution              | modeIndex |
| --------------------- | -------------------- | ----------------------- | --------- |
| **0** - WIDE - ofilm  | **+0** - basic       | _30fps_ - 720p/1080p/4k | 1920      |
|                       | **+1** - 60fps       | **_60fps_** - 1080p     | 1921      |
|                       | **+2** - vSuperNight | _30fps_ - 1080p         | 1922      |
|                       | **+3** - vHDR        | _30fps_ - 720p/1080p/4k | 1923      |
| **10** - WIDE - semco | **+0** - basic       | _30fps_ - 720p/1080p/4k | 1920      |
|                       | **+1** - 60fps       | **_60fps_** - 1080p     | 1921      |
|                       | **+2** - vSuperNight | _30fps_ - 1080p         | 1922      |
|                       | **+3** - vHDR        | _30fps_ - 720p/1080p/4k | 1923      |
| **1** - FRONT         | **+0** - basic       | _30fps_ - 720p/1080p    | 1920      |
| **3** - UW            | **+0** - basic       | _30fps_ - 720p/1080p    | 1920      |

## 8. Algo

### DMBR (Dynamic Motion Blur Reduction)

- 原因：
  - 曝光时长 - the exposure time
  - 运动范围 - the extent of movement and of the sensor or object
- 方案：类似于AISHUTTER，动态修改曝光(增加ISO，所以会有很多的噪点)
  - 静止时延迟曝光
  - 运动时减小曝光
- 卷帘快门：CMOS下面顺次曝光导致的，曝光时长是指定的，与MBR不是一个问题
- 优点：
  - 为静态照片营造运动感
  - 使照片更加立体自然
  - 可以突出主体
- 缺点：
  - 会消除很多细节

### 稳定性

- 使用gyro数据来计算相机旋转的角度

### OIS

- 原理：通过硬件反方向调整lens位置，保证成像到中心
- 发生在图像到达传感器之前，不会降低图像分辨率

### OIS & EIS 对比分析

> EIS and OIS have very different goals, so you can't compare them to ask which is better/worse. OIS
> primarily improves low light photography by physically compensating for hand shake within each
> single frame, and EIS improves shaky video by maintaining a consistent framing between multiple
> video frames. OIS is primarily for photo, and EIS is only for video. -- Isaac Reynolds

### 分类

- [EIS原理图](https://invensense.tdk.com/solutions/electronic-image-stabilization/)

## 9. SuperEIS

| 产品               | Sensor | EIS-Input | Margin | EIS裁切比例 | EIS-output |
| ------------------ | ------ | --------- | ------ | ----------- | ---------- |
| Mi-Qcom            | Wide   | 2956x2212 | 54     | 35%         | 1920x1080  |
| OPPO-MTK           | UW     | 2720x1536 | 42     | 40%         | 1920x1080  |
|                    | Wide   | 2112x1200 | 10     | 30%         | 1920x1080  |
| Mi-MTK             | Wide   | 2400x1360 | 25     | 35%         | 1920x1080  |
| K11R已经测试的方案 | Wide   | 2960x1664 | 54     | 35%         | 1920x1080  |

### Power

| 项目               | EIS-off-power | EIS-off-Target | superEIS-power | superEIS-Target |
| ------------------ | ------------- | -------------- | -------------- | --------------- |
| K9                 | 667.2         | 650            | 811.93         | 700             |
| K8                 | 785.16        | 810            | 961.88         | 960             |
| K9D                | 581.92        | 650            | 898.63         | 950             |
| K11R               | 617.87        | 600            | 724            | 700             |
| K11R已经测试的方案 | -             | 600            | 794            | 700             |

## 10. EIS support ITS

- 注意点:
  1. stream size 在最后一个裁切节点前, size 必须大于 HD
  2. ITS有fov检查, eis消耗的fov不能太多
