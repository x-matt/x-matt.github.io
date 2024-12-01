
### 命令

- 确认打开 - `adb logcat | grep DoRSCMEEis`
- 切换MTK-EIS与VIDHANCE-EIS - `adb shell setprop persist.vendor.camera.disableMtkEIS`，相关[patch](http://gerrit.pt.mioffice.cn/#/c/1118231/)

### 开启EIS

#### Gyro校准

>Place the phone horizontally and keep it in static state
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
- 使用EM mode校准gyro
```bash
adb root
adb shell setenforce 0
adb shell chmod 777 /dev/hf_manager
adb shell chmod 777 /dev/msensor
adb shell chmod 777 /dev/gsensor
adb shell chmod 777 /dev/als_ps
adb shell chmod 777 /dev/gyroscope
```

#### GIS校准

##### 预操作（设权限）
> 前提：==userdebuglogger== ROM
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

##### 进入EM

1. *#*#3646633#*#*
1. Hardware Testing
1. Camera
1. 选sensor，选Sensor Mode为Video size
1. 点击GIS Calibration

##### 修改文件

1. pull出文件`adb pull /data/vendor/camera_dump/eis/gyro/`
1. 将`GIS_default_parameter_main.txt`中的文件添加到对应Sensor中
    1. UW: `mt6885/hal/imgsensor/ver1/hi1337sunny_mipi_raw/camera_gis_para_hi1337sunnymipiraw.h`
    1. Wide: `mt6885/hal/imgsensor/ver1/imx682sunny_mipi_raw/camera_gis_para_imx682sunnymipiraw.h`
    1. Front: `mt6885/hal/imgsensor/ver1/s5k3t2sunny_mipi_raw/camera_gis_para_s5k3t2sunnymipiraw.h`
        >1. 通过`ConfigGyroAlgo`关键字，比对是否生效
        >1. 修改`camera_custom_eis.cpp`中的default值

### 如何确认EIS已开启

1. 打开EIS之后FOV变小
1. 打开EIS后，手机对着桌面拍摄，手机固定不动， 使用一只手在手机preview 视野中晃动，并将手逐步靠近摄像头，当接近到一定程度（整个手所占画面的比例逐渐变大）后，此时晃动手可以看到Preview界面的背景桌面开始晃动，看到此现象可以说明EIS打开生效。背景晃动的原因是移动物体所占画面比例太大，算法无法区分是手机抖动导致的画面变化，还是大面积移动物体产生的画面变化。
1. 使用两只手机，一直打开EIS一只EIS关闭。两只手机绑定在一起同时录制video，观察两只手机所录制视频的差异。

### MTK-EIS流程

输入：Request、RSCMV
输出：display warp map、record warp map

|输入|中间1|中间2|输出|WarpNode|输出|
|--|--|--|--|--|--|
|Request|timestamp <br> |MTKGyro lib|display warp map|+ full image(from P2A)|warped buffer|
| RSCMV|image size|MTKEIS lib|record warp map|+ full image(from record buffer queue)|^|

### EIS 客制化

#### 配置文件

>camera_custom_eis.cpp

| 参数        | 描述                                  | camera_custom_eis.cpp                     |
|-------------|-------------------------------------|-------------------------------------------|
| Factor      | 裁切比                                | EIS_FSC_FHD_FACTOR <br> EIS_FSC_4K_FACTOR |
| Queue size  | EIS buffer queue size，影响EIS性能(25) | FWDEIS_FRAMES_FHD <br> FWDEIS_FRAMES_4K2K |
| Start Frame | EIS queue 帧数，值不变                 | EIS_START_FRAME                           |
| Lossless    | 影响输入尺寸，默认有损(0)              | SUPPORT_EIS_MODE_LOSSLESS                 |
>EIS Queue 默认25张，延时为825(33*25)，可选择drop部分帧

### 算法流程

EISNode -> EIS HAL -> EIS Algo

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
```cpp {.line-numbers}
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