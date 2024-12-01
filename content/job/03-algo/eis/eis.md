## 1. EIS厂商

- [[vidhance]]
- [[morpho]]
- [[job/03-algo/eis/qcom|qcom]]
- [[job/03-algo/eis/mtk|mtk]]
- [[his]]

## 2. EIS相关测试

- [[power]]
- [[release]]

### 2.1 MTK项目EIS debug

```cpp
// === 1. property for platform ===
#define KEY_TPI_EIS_DISABLE          "vendor.debug.tpi.s.eis.onoff"
#define KEY_TPI_EIS_MARGIN           "vendor.debug.tpi.s.eis.margin"
#define KEY_TPI_EIS_DYNAMIC_MARGIN   "vendor.debug.tpi.s.eis.dynamicmargin"
#define KEY_TPI_EIS_QCOUNT           "vendor.debug.tpi.s.eis.qcount"
#define KEY_TPI_EIS_TPIMODE          "vendor.debug.tpi.s.eis.tpimode"
#define KEY_TPI_EIS_WPEMODE          "vendor.debug.tpi.s.eis.warp"
#define KEY_TPI_EIS_GRID_X_NUM       "vendor.debug.tpi.s.eis.x_grid_num"
#define KEY_TPI_EIS_GRID_Y_NUM       "vendor.debug.tpi.s.eis.y_grid_num"
#define KEY_TPI_EIS_WAITINITDONE     "vendor.debug.tpi.s.eis.waitinitdone"

// === 2. property for his algo ===
#define KEY_HIS_DISABLE              "vendor.debug.tpi.s.his.onoff"
#define KEY_HIS_DEBUG                "vendor.debug.tpi.s.his.debug"
#define KEY_HIS_LOGLEVEL             "vendor.debug.tpi.s.his.loglevel"
#define KEY_HIS_CROPFACTOR           "vendor.debug.tpi.s.his.cropfactor"

// algo sub-function
#define KEY_HIS_SELFIE               "vendor.debug.tpi.s.his.selfiemode"
#define KEY_HIS_SUPEREIS             "vendor.debug.tpi.s.his.supereismode"
#define KEY_HIS_DIS                  "vendor.debug.tpi.s.his.dismode"
#define KEY_HIS_DEBLUR               "vendor.debug.tpi.s.his.deblurmode"
#define KEY_HIS_DEBLUR_RAT_DARK      "vendor.debug.tpi.s.his.deblur.ratio.dark"
#define KEY_HIS_DEBLUR_RAT_BRGT      "vendor.debug.tpi.s.his.deblur.ratio.bright"
#define KEY_HIS_DEBLUR_EXP_DARK      "vendor.debug.tpi.s.his.deblur.exp.dark"
#define KEY_HIS_DEBLUR_EXP_BRGT      "vendor.debug.tpi.s.his.deblur.exp.bright"
```

## 3. CheckList

### 3.1. MTK-自检

| 测试项                          | 验证方法                                                                 | 结论   | 备注                       |
| ---------------------------- | -------------------------------------------------------------------- | ---- | ------------------------ |
| EIS算法版本号                     | `adb shell "pkill camera*" && adb logcat \| grep "Vidhance version"` | PASS | 3.10.4                   |
| EIS-debug等级的log开启方式          | `setprop vendor.vidhance.logging.level 0`                            | PASS | -                        |
| EIS-dump方式                   | `setprop vendor.vidhance.debug.eisdump 1`                            | PASS | /data/vendor/camera_dump |
| EISNode处理时间(需要打开debug等级的log) | `adb logcat \| grep "Processing time"`                               | PASS | -                        |
| 录像场景下EIS功能验证                 | `Using configuration` （log中 stabilizer: 1）                           | PASS | 短视频场景，支持与美颜同开            |
| UW录像场景下EIS-LDC功能验证           | `Using configuration` （log中 lensDistortionCorrection: 1）             | PASS | -                        |
| 超级防抖下超级防抖功能验证                | `Using configuration` （log中 superStabilization: 1）                   | PASS | -                        |
| 超级防抖下水平矫正功能验证                | `Using configuration` （log中 horizonCorrection: 1）                    | PASS | 仅在超级防抖模式下开启              |
| gyro采样率                      | `Initialized sensor GYROSCOPE`                                       | PASS | -                        |
| EISMargin                    | `Using margin scale factor \| set eisMargin =`                       | PASS | -                        |
| 校准文件版本                       | `Parsing calibration file`                                           | PASS | -                        |

### 3.2. 看现象

- 通过APP开关EIS，开启EIS时，FOV会变小
- 录像场景下，快速抖动手机，画面会有拖影（拍摄头发时现象更直观）
- appTag - `android.control.videoStabilizationMode`

### 3.3. 看Log/Dump

1. Qcom-EIS

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
1. VIDHANCE-EIS
    1. 在Qcom平台
        打开LogD：`adb shell setprop vendor.vidhance.logging.level 1`
        - Preview 关键字：`PublishIca for PREVIEW`
        - Record 关键字：`PublishIca for RECORDING`
    1. 在MTK平台
        打开LogD：`adb shell setprop vendor.vidhance.logging.level 1`
        - Preview 关键字：`Process display`
        - Record 关键字：`Process recording`
1. MTK-EIS
    - `adb logcat | grep DoRSCMEEis`

## 4. On/Off EIS

1. Qcom-EIS

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

1. MTK-VidhanceEIS

    ```bash
    adb shell setprop vendor.debug.tpi.s.eis.onoff 1
    adb shell setprop vendor.debug.tpi.s.eis.onoff 0
    ```

1. vidhance-EIS

    ```bash
    adb shell setprop vendor.vidhance.enabled 0
    ```

## 5. Margin

| Platform | Relationship                      | e.g.         | Type         |
|----------|-----------------------------------|--------------|--------------|
| MTK      | input = (100+margin)/100 x output | margin = 25  | OutputMargin |
| Qcom     | input(1-margin) = output          | margin = 0.2 | InputMargin  |

> 100/(100+margin_MTK) = 1-margin_Qcom

## 6. WPE-dump

`vendor.camera.p2tpipedump.enable`

## 7. Sensor Mode Index

| cameraID              | Scene                | Resolution              | modeIndex |
|-----------------------|----------------------|-------------------------|:---------:|
| **0** - WIDE - ofilm  | **+0** - basic       | *30fps* - 720p/1080p/4k |   1920    |
|                       | **+1** - 60fps       | ***60fps*** - 1080p     |   1921    |
|                       | **+2** - vSuperNight | *30fps* - 1080p         |   1922    |
|                       | **+3** - vHDR        | *30fps* - 720p/1080p/4k |   1923    |
| **10** - WIDE - semco | **+0** - basic       | *30fps* - 720p/1080p/4k |   1920    |
|                       | **+1** - 60fps       | ***60fps*** - 1080p     |   1921    |
|                       | **+2** - vSuperNight | *30fps* - 1080p         |   1922    |
|                       | **+3** - vHDR        | *30fps* - 720p/1080p/4k |   1923    |
| **1** - FRONT         | **+0** - basic       | *30fps* - 720p/1080p    |   1920    |
| **3** - UW            | **+0** - basic       | *30fps* - 720p/1080p    |   1920    |

## 8. Algo

- [DMBR](https://weareimint.com/dynamic-motion-blur-reduction/)
  - 原因：
    - 曝光时长-the exposure time
    - 运动范围-the extent of movement and of the sensor or object
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
- [稳定性](https://weareimint.com/video-stabilization/)
  - 使用gyro数据来计算相机旋转的角度
- OIS
  - 原理：通过硬件反方向调整lens位置，保证成像到中心
  - 发生在图像到达传感器之前，不会降低图像分辨率
- OIS & EIS [对比分析](https://smartphones.gadgethacks.com/news/why-eis-is-actually-better-than-ois-for-videos-0195575/)

> EIS and OIS have very different goals, so you can't compare them to ask which is better/worse. OIS primarily improves low light photography by physically compensating for hand shake within each single frame, and EIS improves shaky video by maintaining a consistent framing between multiple video frames. OIS is primarily for photo, and EIS is only for video. -- Isaac Reynolds

- [分类](https://actioncamguides.com/types-of-stabilization-in-action-cameras/)
- [EIS原理图](https://invensense.tdk.com/solutions/electronic-image-stabilization/)

## 9. SuperEIS

| 产品          | Sensor | EIS-Input | Margin | EIS裁切比例 | EIS-output |
| ----------- | ------ | --------- | ------ | ------- | ---------- |
| Mi-Qcom     | Wide   | 2956x2212 | 54     | 35%     | 1920x1080  |
| OPPO-MTK    | UW     | 2720x1536 | 42     | 40%     | 1920x1080  |
|             | Wide   | 2112x1200 | 10     | 30%     | 1920x1080  |
| Mi-MTK      | Wide   | 2400x1360 | 25     | 35%     | 1920x1080  |
| K11R已经测试的方案 | Wide   | 2960x1664 | 54     | 35%     | 1920x1080  |

### 9.1. Power

| 项目          | EIS-off-power | EIS-off-Target | superEIS-power | superEIS-Target |     |
| ----------- | ------------- | -------------- | -------------- | --------------- | --- |
| K9          | 667.2         | 650            | 811.93         | 700             |     |
| K8          | 785.16        | 810            | 961.88         | 960             |     |
| K9D         | 581.92        | 650            | 898.63         | 950             |     |
| K11R        | 617.87        | 600            | 724            | 700             |     |
| K11R已经测试的方案 | -             | 600            | 794            | 700             |     |

![[2023-08-28-14-55-19.gif|eis裁切动画|700]]
## EIS support ITS
#eis/its
- 相关patch: https://gerrit.pt.mioffice.cn/q/topic:eis_its
- 注意点:
	1. stream size 在最后一个裁剪节点前, size 必须大于 HD
	2. ITS有fov检查, eis消耗的fov不能太多