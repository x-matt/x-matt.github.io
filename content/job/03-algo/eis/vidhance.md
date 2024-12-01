
### 开启Log

`setprop vendor.vidhance.logging.level 1`

### 运用场景

1. 运动跟拍
1. 超级防抖
1. 普通防抖
1. 前置防抖
    >跟防抖相关的dmbr需要打开，超级防抖的HC需要打开，超广的时候需要打开ldc

### Feature

1. Live video stabilization
1. Temporal noise reduction

### Vidhance Live Auto Zoom

目的：实时跟拍物体，自动变焦
优势：
    低功耗
    弱光下高性能
    可以与OIS集成

### 分辨率

| 参数                           | 720       | 1080P30   | 1080P60   | 4K        |
|--------------------------------|-----------|-----------|-----------|-----------|
| "mCfgInfo.mStreamingSize(RRZO) | 1600x1216 | 1920x1456 | 1936x1088 | 3840x2896 |
| mCfgInfo.mMaxOutSize           | 1280×720  | 1920×1080 | 1920×1080 | 3840×2160 |
| "EIS-Out                       | 1280×720  | 1920×1080 | 1934×1088 | 3840×2160 |
| Req-mISensorSize               | 4624×3472 | 4624×3472 | 4624×2600 | 4624×3472 |
| Req-mISensorClip(浮动值)       | 4456×3346 | 4624×3472 | 4624×2600 | 4624×3472 |
| Req-iSrcZoomROI                | 1280×728  | 1920×1090 | 1934×1088 | 3840×2168 |

### 打开每一帧陀螺仪的数据

```bash
adb root
adb shell setenforce 0
adb remount
adb shell setprop vendor.vidhance.video.sensorlogger 1
adb shell mkdir /data/tmp
adb shell chmod 777 /data/tmp
adb shell chmod 777 /data/media
adb shell chmod 777 /data/media/0
adb shell chmod 777 /data/media/0/DCIM
adb shell chmod 777 /data/media/0/DCIM/Camera
```
>adb pull /data/tmp

问题：
- isensor、asensor、ncs之间的区别
- 开关更多的log
- 掌握mk文件（在里面定义宏）

### enable Sensor log
```bash
adb root
adb shell setenforce 0
adb remount
adb shell setprop vendor.vidhance.video.sensorlogger 1
adb shell mkdir /data/tmp
adb shell chmod 777 /data/tmp
adb shell chmod 777 /data/media
adb shell chmod 777 /data/media/0
adb shell chmod 777 /data/media/0/DCIM
adb shell chmod 777 /data/media/0/DCIM/Camera
```

### Gyro samplingrate
```bash
adb shell setprop debug.sensorprovider.dump 3
adb shell setprop persist.vendor.mtk.camera.log_level 3
adb shell pkill camera*
```