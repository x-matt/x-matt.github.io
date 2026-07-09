---
title: Eis mtk architecture
created: 2026-01-16
type: area
status: active
domain: feature
priority:
review:
tags:
  - eis
  - mtk
---

## 1. MTK-EIS流程

输入：Request、RSCMV输出：display warp map、record warp map

| 输入    | 中间1      | 中间2       | 输出             | WarpNode                               | 输出          |
| ------- | ---------- | ----------- | ---------------- | -------------------------------------- | ------------- |
| Request | timestamp  | MTKGyro lib | display warp map | + full image(from P2A)                 | warped buffer |
| RSCMV   | image size | MTKKEIS lib | record warp map  | + full image(from record buffer queue) | ^             |

## 2. EISNode处理流程

### 2.1 EISNode::processEIS

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

### 2.2 EIS HAL

`EisHalImp::DoRSCMEEis`

### 2.3 EIS Algo

#### MTKEisPlus 类

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

#### Process Input Date

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

#### Result

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

## 3. EIS 客制化

### 3.1 配置文件

> camera_custom_eis.cpp

| 参数        | 描述                                   | camera_custom_eis.cpp                     |
| ----------- | -------------------------------------- | ----------------------------------------- |
| Factor      | 裁切比                                 | EIS_FSC_FHD_FACTOR <br> EIS_FSC_4K_FACTOR |
| Queue size  | EIS buffer queue size，影响EIS性能(25) | FWDEIS_FRAMES_FHD <br> FWDEIS_FRAMES_4K2K |
| Start Frame | EIS queue 帧数，值不变                 | EIS_START_FRAME                           |
| Lossless    | 影响输入尺寸，默认有损(0)              | SUPPORT_EIS_MODE_LOSSLESS                 |

> EIS Queue 默认25张，延时为825(33\*25)，可选择drop部分帧

## 4. HBM (Hal Buffer Management)

### 4.1 HBM相关Tag

- android tag: `MTK_INFO_SUPPORTED_BUFFER_MANAGEMENT_VERSION`
- hal core tag:
  - `MTK_HALCORE_SUPPORT_HAL_BUFFER_MANAGEMENT`

### 4.2 策略

策略: Preparatory/Immediate/Cached

**Preparatory**: request一下去就申请buffer
**Immediate**: 检测到没有带appOutBuffer, 就会立即去拿buffer

### 4.3 其他信息

填写app-buffer的位置是哪儿? MTK-HAL

producer & confumer 总的限制为64块

FHD下面增量为2-3 mips

## 5. Sensor Mode Index

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

## 6. Margin

| Platform | Relationship                      | e.g.         | Type         |
| -------- | --------------------------------- | ------------ | ------------ |
| MTK      | input = (100+margin)/100 x output | margin = 25  | OutputMargin |
| Qcom     | input(1-margin) = output          | margin = 0.2 | InputMargin  |

> 100/(100+margin_MTK) = 1-margin_Qcom

## 7. WPE-dump

`vendor.camera.p2tpipedump.enable`
