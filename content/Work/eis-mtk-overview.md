---
title: Eis mtk overview
type: area
status: active
domain: feature
priority:
review:
tags:
  - eis
  - mtk
---

## 1. 命令

### 1.1 确认打开

```bash
adb logcat | grep DoRSCMEEis
```

### 1.2 切换MTK-EIS与VIDHANCE-EIS

```bash
adb shell setprop persist.vendor.camera.disableMtkEIS
```


## 2. 开启EIS

### 2.1 Gyro校准

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

使用EM mode校准gyro:

```bash
adb root
adb shell setenforce 0
adb shell chmod 777 /dev/hf_manager
adb shell chmod 777 /dev/msensor
adb shell chmod 777 /dev/gsensor
adb shell chmod 777 /dev/als_ps
adb shell chmod 777 /dev/gyroscope
```

### 2.2 GIS校准

#### 预操作（设权限）

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

#### 进入EM

1. `*#*#3646633#*#*`
2. Hardware Testing
3. Camera
4. 选sensor，选Sensor Mode为Video size
5. 点击GIS Calibration

#### 修改文件

1. pull出文件 `adb pull /data/vendor/camera_dump/eis/gyro/`
2. 将 `GIS_default_parameter_main.txt` 中的文件添加到对应Sensor中
   - UW: `mt6885/hal/imgsensor/ver1/hi1337sunny_mipi_raw/camera_gis_para_hi1337sunnymipiraw.h`
   - Wide: `mt6885/hal/imgsensor/ver1/imx682sunny_mipi_raw/camera_gis_para_imx682sunnymipiraw.h`
   - Front: `mt6885/hal/imgsensor/ver1/s5k3t2sunny_mipi_raw/camera_gis_para_s5k3t2sunnymipiraw.h`

> 1. 通过 `ConfigGyroAlgo` 关键字，比对是否生效
> 1. 修改 `camera_custom_eis.cpp` 中的default值

## 3. 如何确认EIS已开启

1. 打开EIS之后FOV变小
2. 打开EIS后，手机对着桌面拍摄，手机固定不动， 使用一只手在手机preview 视野中晃动，并将手逐步靠近摄像头，当接近到一定程度（整个手所占画面的比例逐渐变大）后，此时晃动手可以看到Preview界面的背景桌面开始晃动，看到此现象可以说明EIS打开生效。背景晃动的原因是移动物体所占画面比例太大，算法无法区分是手机抖动导致的画面变化，还是大面积移动物体产生的画面变化。
3. 使用两只手机，一只打开EIS一只EIS关闭。两只手机绑定在一起同时录制video，观察两只手机所录制视频的差异。

## 4. MTK-EIS流程

输入：Request、RSCMV输出：display warp map、record warp map

| 输入    | 中间1      | 中间2       | 输出             | WarpNode                               | 输出          |
| ------- | ---------- | ----------- | ---------------- | -------------------------------------- | ------------- |
| Request | timestamp  | MTKGyro lib | display warp map | + full image(from P2A)                 | warped buffer |
| RSCMV   | image size | MTKKEIS lib | record warp map  | + full image(from record buffer queue) | ^             |

## 5. EIS 客制化

### 5.1 配置文件

> camera_custom_eis.cpp

| 参数        | 描述                                   | camera_custom_eis.cpp                     |
| ----------- | -------------------------------------- | ----------------------------------------- |
| Factor      | 裁切比                                 | EIS_FSC_FHD_FACTOR <br> EIS_FSC_4K_FACTOR |
| Queue size  | EIS buffer queue size，影响EIS性能(25) | FWDEIS_FRAMES_FHD <br> FWDEIS_FRAMES_4K2K |
| Start Frame | EIS queue 帧数，值不变                 | EIS_START_FRAME                           |
| Lossless    | 影响输入尺寸，默认有损(0)              | SUPPORT_EIS_MODE_LOSSLESS                 |

> EIS Queue 默认25张，延时为825(33\*25)，可选择drop部分帧

### 5.2 算法流程

#### EISNode

```cpp
EISNode::processEIS(const RequestPtr &request, const RSCResult &rsc)
    EISNode::prepareEIS(const RequestPtr &request, EIS_HAL_CONFIG_DATA &config)
    EISNode::processEIS30(const RequestPtr &request,
                          EIS_HAL_CONFIG_DATA &config, const RSCResult &rsc)
        {
            // 1.设置buffer
            // 2.进入算法处理
            mpEisHal->DoRSCMEEis(&qData.mConfig, &imgBaseData, ts, expTime, longExpTime);
        }
```

#### EIS HAL

`EisHalImp::DoRSCMEEis`

#### EIS Algo

- MTKEisPlus

```cpp
class MTKEisPlus
{
public:
    static MTKEisPlus* createInstance();   // EIS HAL init
    virtual void   destroyInstance(MTKEisPlus* obj) = 0;

    virtual ~MTKEisPlus(){};
    // Process Control
    virtual MRESULT EisPlusInit(void* InitInData);
    virtual MRESULT EisPlusMain(EIS_PLUS_RESULT_INFO_STRUCT *EisPlusResult);    // START
    virtual MRESULT EisPlusReset();   //Reset

    // Feature Control
    virtual MRESULT EisPlusFeatureCtrl(MUINT32 FeatureID, void* pParaIn, void* pParaOut);

private:
};
```

- Process Input Date

```cpp
typedef struct
{
    EIS_PLUS_FE_INFO_STRUCT fe_info;
    EIS_PLUS_EIS_INFO_STRUCT eis_info;
    EIS_PLUS_SENSOR_INFO_STRUCT sensor_info;
    EIS25_FE_INFO_STRUCT fe_result; // 20151221 New
    EIS25_FM_INFO_STRUCT fm_result;
    EIS_AE_DATA_STRUCT AE_data;
    MFLOAT block_size;
    MINT32 gyro_block_size;
    MINT32 RSSoWidth;
    MINT32 RSSoHeight;
    MINT32 MVWidth;
    MINT32 MVHeight;
    MINT32 imgiWidth;
    MINT32 imgiHeight;
    MINT32 CRZoWidth;
    MINT32 CRZoHeight;
    MINT32 FSCProcWidth;
    MINT32 FSCProcHeight;
    MINT32 FovAlignWidth; //fov aligned output width
    MINT32 FovAlignHeight;//fov aligned output height
    EIS_PLUS_COORDINATE WarpGrid[4]; //warp's gird for fov aligned area
                                     //(4 points: x0,y0 x1,y1) (x2,y2 x3,y3)
    MINT32 *FSCScalingFactor;
    MINT32 SRZoWidth;
    MINT32 SRZoHeight;
    MINT32 oWidth;
    MINT32 oHeight;
    MINT32 TargetWidth;
    MINT32 TargetHeight;
    MINT32 cropX;
    MINT32 cropY;
    MUINT64 frame_t;
    MBOOL  mv_idx; //0:wide, 1:tele
    MINT32 RSCLevel;
    //skew
    MFLOAT Trs;
    MINT32 process_mode; // 20151221 New
    MINT32 process_idx; // 20151221 New
    MINT32 ShutterTime;
    MINT32 frame_rate;
}EIS_PLUS_SET_PROC_INFO_STRUCT, *P_EIS_PLUS_SET_PROC_INFO_STRUCT;
```

- Result

```cpp
typedef struct
{
    MINT32*                  GridX;                // Grid X[Grid_W*Grid_H]
    MINT32*                  GridY;                // Grid Y[Grid_W*Grid_H]
    MINT32*                  GridX_standard;                // Grid X[Grid_W*Grid_H]
    MINT32*                  GridY_standard;                // Grid Y[Grid_W*Grid_H]
    MUINT32                  ClipX;    // image offset X
    MUINT32                  ClipY;    // image offset Y
}EIS_PLUS_RESULT_INFO_STRUCT, *P_EIS_PLUS_RESULT_INFO_STRUCT;
```

## 6. MTK-60帧缓存 & HBM

### 6.1 M16T 评估时候的开关对比命令

1. set EISMargin 0

```bash
adb shell setprop vendor.debug.scenario.s.eisMargin 0
adb shell setprop vendor.vidhance.preview.increasedsize 0
adb shell setprop vendor.vidhance.video.increasedsize 0
# back to the default
adb shell setprop vendor.debug.scenario.s.eisMargin 25
adb shell setprop vendor.vidhance.preview.increasedsize 1
adb shell setprop vendor.vidhance.video.increasedsize 1
```

1. set Record latency 0

```bash
adb shell setprop vendor.debug.scenario.s.eisQCount 0
adb shell setprop vendor.vidhance.video.vs.latency 0
# back to the default
adb shell setprop vendor.debug.scenario.s.eisQCount 30
adb shell setprop vendor.vidhance.video.vs.latency 30
```

1. force close FaceBeauty

```bash
adb shell setprop vendor.debug.tpi.s.fb.onoff 0
# back to the default
adb shell setprop vendor.debug.tpi.s.fb.onoff 1
```

1. test Default-ROM supEIS power
2. set inputSize to 2384x1784

```bash
adb shell setprop vendor.vidhance.preview.vs.super.cropfactor 0.81
adb shell setprop vendor.vidhance.video.vs.super.cropfactor 0.81
```

1. set inputSize to 2400x1350

```bash
adb shell setprop vendor.vidhance.video.vs.super.cropfactor 0.80
adb shell setprop vendor.vidhance.preview.vs.super.cropfactor 0.80
adb shell setprop vendor.vidhance.video.usefullfov 0
adb shell setprop vendor.vidhance.preview.usefullfov 0
```

1. delete VH-pipeline's MCTF-Node

```bash
adb push com.qti.chiusecaseselector.so vendor/lib64
adb reboot
```

1. Switch VH-Node to Qcom-Node

```bash
adb push com.qti.chiusecaseselector.so vendor/lib64
adb reboot
```

### 6.2 MTK 60帧缓存


### 6.3 HBM (Hal Buffer Management)

- android tag: `MTK_INFO_SUPPORTED_BUFFER_MANAGEMENT_VERSION`
- hal core tag:
  - `MTK_HALCORE_SUPPORT_HAL_BUFFER_MANAGEMENT`

策略: Preparatory/Immediate/Cached

**Preparatory**: request一下去就申请buffer
**Immediate**: 检测到没有带appOutBuffer, 就会立即去拿buffer

填写app-buffer的位置是哪儿? MTK-HAL

producer & confumer 总的限制为64块

FHD下面增量为2-3 mips
