## Q文件输出

- `out/target/product/lmi/vendor/lib64/hw`
- `camera.qcom.so` —— CAMX
- `com.qti.chi.override.so` —— CHI-CDK

```bash
adb disable-verity && adb reboot # 第一次push时需要
adb root
adb remount
adb push camera.qcom.so vendor/lib64/hw
adb push com.qti.chi.override.so vendor/lib64/hw
adb reboot
```

## ICA

是IPE的一个模块
Image Correction and Adjustment

- ICA1 - For inline EIS, LDC
- ICA2 - For MCTF

### MTCF

1. 含义：高通的多帧降噪功能
1. 判断其开启方式
    1. 打开log - `adb shell setprop persist.vendor.camera.logVerboseMask 0x200000`
    1. `camxipetf20titan480.h:199 SetTFEnable()  #### Module enable on pass full - DC64 : 0, 0, 0, 0, lmc 0` --- 关闭状态
1. 在pipeline中添加MTCF-Node

    ```xml
    <NodeProperty>
      <NodePropertyName>stabilizationType</NodePropertyName>
      <NodePropertyId>3</NodePropertyId>
      <NodePropertyDataType>UINT</NodePropertyDataType>
      <NodePropertyValue>3</NodePropertyValue>
    </NodeProperty>
    ```

## CVP

computer vision processor, 用来计算两张图片之间的MV(motion vector)，传给MFNR、MCTF、EIS

## [高通画质三类组件](https://wiki.n.miui.com/pages/viewpage.action?pageId=412252950)

1. IFE

| 组件名        | 含义                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Stat       | 统计                                                                                                                                |
| DSP        | digital signal processor , 数字信号处理器                                                                                                |
| HVX        | HVX(“Hexagon矢量扩展”，Hexagon-六边形、Vector-矢量、Extensions-扩展)是Hexagon 680 DSP的典型特性，能够在执行图像处理应用中的计算负载当中发挥重要作用，比如虚拟现实、增强现实、图像处理、视频处理、计算视觉等 |
| CSID       | 高通camera中的驱动，Camera Serial Interface Decoder Module ，摄像头串行接口解码器模块                                                                 |
| CAMIF      | Camera Interface  使外部 camera sensor 能够通过一些简单的外部协议链接到用户单元                                                                          |
| PDPC       | 过程决策程序图法， Process Decision Program Chart                                                                                          |
| CST        | ?                                                                                                                                 |
| Scaler     | 尺寸器， 可进行缩放                                                                                                                        |
| extraction | 提取                                                                                                                                |

1. BPS

| 组件名 | 含义                              |
| --- | ------------------------------- |
| HNR | Hybrid  Noise Reduction  （混合降噪） |

1. IPE

| 组件名  | 含义                                               |
| ---- | ------------------------------------------------ |
| EIS  | 电子防抖   warping ： 翘曲，弯曲                           |
| ANR  | Advanced Noise Reduction  , 高级降噪 ，作用 ： 空间降噪      |
| MCTF | Motion compensation temporal filtering ，运动补偿时间滤波 |
| TF   | Temporal filter  ，时间滤波                           |
| ASF  | Adaptive spatial filter ，自适应空间滤波器 ，作用 ： 细节增强     |
> 每个IPE都包含NPS（Noise Processing Segment）和PPS（Post Srocessing Segment）两个部分。

## LOG

### 关键字

| 关键字                | 描述                                                       |     |
| ------------------ | -------------------------------------------------------- | --- |
| usecase            | `adb logcat \| grep "camxnode.cpp:1037 Initialize()"`    |     |
| operationmode      | 查看下发的operationmode                                       |     |
| streamingon        | 使用的pipeline                                              |     |
| faceonlock         | 可以查看人脸解锁的时间                                              |     |
| FindBestSensorMode | 可查出cameraId对应的sensor的分辨率                                 |     |
| FinalizeBuffer     | sensor的图像经过ife、ipe后会有downscaler和crop，使用该关键字可以            |     |
| IFE input          | 查看ife的input的size，也就是sensor的输出                            |     |
| GetMatchingUsecase | 这个关键字会给出选择的usecaseID，usecaseID在chxusecaseutils.cpp中进行了定义 |     |

`"usecase.*selected|configure_streams|\[ DUMP\]|\[ERROR|CAM_ERR|flush\(\).*(begin|end)|close\(\)|serious error|fatal|\(-110\)|\(-38\)|TriggerRecovery|F DEBUG|Tombstone"`

### Log开关

- logInfoMask=0x50098
- logVerboseMask=0x50098
- overrideLogLevels=0x15   ----  chi的log等级开关
    >/vendor/etc/camera/camxoverridesettings.txt

格式：`CamX: [<Verbosity Level>][<Group>] <File>:<Line Number> <Function Name><Message>`

### 文件与数值的对应关系

| 😊                  | ...... | CamxLogGroupHAL | CamxLogGroupPProc | CamxLogGroupISP | CamxLogGroupIFace | CamxLogGroupSensor | CamxLogGroupNone | 对应值(十六进制) |
| ------------------- | ------ | --------------- | ----------------- | --------------- | ----------------- | ------------------ | ---------------- | --------- |
| **logVerboseMask**  | 0      | 1               | 0                 | 0               | 0                 | 0                  | 0                | 0X80      |
| **logPerfInfoMask** | 0      | 1               | 0                 | 0               | 0                 | 0                  | 0                | 0X80      |
| **logMetaEnable**   | 0      | 1               | 0                 | 0               | 0                 | 0                  | 0                | 0X80      |
| **logInfoMask**     | 0      | 1               | 0                 | 0               | 0                 | 0                  | 0                | 0X80      |
| **......**          | .....  | .....           | .....             | .....           | .....             | .....              | .....            | ......    |

- 第一列 - log类别名 `vendor/qcom/proprietary/camx/src/settings/common/camxsettings.xml`
  - settingsSubGroup Name="Log and Trace Settings"
- 第一行 - Group类别 `vendor/qcom/proprietary/camx/src/utils/camxtypes.h`

### Qcom-Debugging-Guide(8350)

1. Log Level开关

| Name                | VariableName     | Default Value | Setprop                                |
| ------------------- | ---------------- | ------------- | -------------------------------------- |
| Verbose Log Mask    | logVerboseMask   | 0             | persist.vendor.camera.logVerboseMask   |
| Entry/Exit Log Mask | logEntryExitMask | 0             | persist.vendor.camera.logEntryExitMask |
| Info Log Mask       | logInfoMask      | 0xFFFFFFFF    | persist.vendor.camera.logInfoMask      |
| Warning Log Mask    | logWarningMask   | 0xFFFFFFFF    | persist.vendor.camera.logWarningMask   |
| System Log Enable   | systemLogEnable  | TRUE          | persist.vendor.camera.systemLogEnable  |

```cpp
    // The verbosity tag for a given debug print message
    typedef UINT32 CamxLog;
    static const CamxLog CamxLogDebug                   = 0;            ///< Debug messages
    static const CamxLog CamxLogError                   = 1;            ///< Error messages
    static const CamxLog CamxLogWarning                 = 2;            ///< Warning messages
    static const CamxLog CamxLogConfig                  = 3;            ///< Config messages
    static const CamxLog CamxLogInfo                    = 4;            ///< Informational messages
    static const CamxLog CamxLogVerbose                 = 5;            ///< Verbose messages
    static const CamxLog CamxLogPerfInfo                = 6;            ///< Performance info message
    static const CamxLog CamxLogPerfWarning             = 7;            ///< Performance warning message
    static const CamxLog CamxLogDRQ                     = 8;            ///< DRQ logging
    static const CamxLog CamxLogMeta                    = 9;            ///< Metadata logging
    static const CamxLog CamxLogEntryExit               = 10;           ///< Entry/Exit messages
    static const CamxLog CamxLogReqMap                  = 11;           ///< Request mapping messages
    static const CamxLog CamxLogDump                    = 12;           ///< Recovery Dump messages
    static const CamxLog CamxLogMax                     = 13;           ///< Max verbosity levels
```

> src/core/camxsettingsmanager.cpp


1. Log Group

| Driver Group Name   | Value     | Description                  | HEX     | BIN       |
| ------------------- | --------- | ---------------------------- | ------- | --------- |
| CamxLogGroupNone    | (1 << 0)  | Generic default group        |         | 0000,0001 |
| CamxLogGroupSensor  | (1 << 1)  | Sensor                       |         | 0000,0010 |
| CamxLogGroupTracker | (1 << 2)  | Tracker                      |         | 0000,0100 |
| CamxLogGroupISP     | (1 << 3)  | ISP                          |         | 0000,1000 |
| CamxLogGroupPProc   | (1 << 4)  | Post processor               |         | 0001,0000 |
| CamxLogGroupMemMgr  | (1 << 5)  | MemMgr                       |         | 0010,0000 |
| CamxLogGroupPower   | (1 << 6)  | Power                        |         | 0100,0000 |
| ==CamxLogGroupHAL== | (1 << 7)  | HAL                          | 0x80    | 1000,0000 |
| CamxLogGroupJPEG    | (1 << 8)  | JPEG                         |         |           |
| CamxLogGroupStats   | (1 << 9)  | 3A algorithms                |         |           |
| CamxLogGroupCSL     | (1 << 10) | Camera service layer         |         |           |
| CamxLogGroupApp     | (1 << 11) | Application                  |         |           |
| CamxLogGroupUtils   | (1 << 12) | Utilities                    |         |           |
| CamxLogGroupSync    | (1 << 13) | Synchronization/mutex/fences |         |           |
| CamxLogGroupMemSpy  | (1 << 14) | Memory tracker               |         |           |
| CamxLogGroupFormat  | (1 << 15) | Format                       |         |           |
| CamxLogGroupCore    | (1 << 16) | Core camera system           |         |           |
| CamxLogGroupHWL     | (1 << 17) | Hardware layer               |         |           |
| ==CamxLogGroupChi== | (1 << 18) | Camera HAL interface         | 0x40000 |           |
| CamxLogGroupDRQ     | (1 << 19) | Deferred request queue       |         |           |
| CamxLogGroupFD      | (1 << 20) | Face detection               |         |           |

    >camxtypes.h

1. CHI Log

| LogLevelName     | LogLevelName_MASK     | Value |
| ---------------- | --------------------- | ----- |
| CHX_LOG_ERROR    | CHX_LOG_ERROR_MASK    | 1     |
| CHX_LOG_WARN     | CHX_LOG_WARN_MASK     | 2     |
| CHX_LOG_CONFIG   | CHX_LOG_CONFIG_MASK   | 4     |
| CHX_LOG_INFO     | CHX_LOG_INFO_MASK     | 8     |
| CHX_LOG_DUMP     | CHX_LOG_DUMP_MASK     | 16    |
| CHX_LOG_VERBOSE  | CHX_LOG_VERBOSE_MASK  | 32    |
| CHX_LOG          | CHX_LOG_MASK          | 64    |
| CHX_LOG_CORE_CFG | CHX_LOG_CORE_CFG_MASK | 128   |

    > chxdebugprint.h

1. Topology logs
    - camxhaldevice.cpp
    - camxpipeline.cpp
1. HAL
    1. initialize
        - camxhaldevice.cpp
    1. per-frame requests
        - camxsession.cpp
1. Sensor module
    - camxsensornode.cpp

## USECASE ID

```cpp{.line-numbers}
enum class UsecaseId
{
    NoMatch             = 0,
    Default             = 1,
    Preview             = 2,
    PreviewZSL          = 3,//三方+算法上移
    MFNR                = 4,
    MFSR                = 5,
    MultiCamera         = 6,//多摄-b+多个stream
    QuadCFA             = 7,
    RawJPEG             = 8,
    MultiCameraVR       = 9,//多摄-a+VR
    Torch               = 10,
    YUVInBlobOut        = 11,
    VideoLiveShot       = 12,//三方视频超夜
    SuperSlowMotionFRC  = 13,
    Feature2            = 14,
    Depth               = 15,//深度
[[ifdef]] __XIAOMI_CAMERA__
    VTCAM               = 16,//VTCamera
    ParallelVTCamMC     = 17,//VTCamera
    MaxUsecases         = 18,
[[else]]
    MaxUsecases         = 16,
[[endif]]
};
```

/data/property# cat presist_properties
分析日志三部曲

1. 看压测分析报告
1. 看media.camera
    1. camera device number枚举个数
        chxlogicalcameratablexiaomi.cpp
    1. connect disconnect 对应log connect call
1. 查看log文件

## image format

```cpp
typedef enum {
    HAL_PIXEL_FORMAT_RGBA_8888 = 1,
    HAL_PIXEL_FORMAT_RGBX_8888 = 2,
    HAL_PIXEL_FORMAT_RGB_888 = 3,
    HAL_PIXEL_FORMAT_RGB_565 = 4,
    HAL_PIXEL_FORMAT_BGRA_8888 = 5,
    HAL_PIXEL_FORMAT_YCBCR_422_SP = 16,
    HAL_PIXEL_FORMAT_YCRCB_420_SP = 17,
    HAL_PIXEL_FORMAT_YCBCR_422_I = 20,
    HAL_PIXEL_FORMAT_RGBA_FP16 = 22,
    HAL_PIXEL_FORMAT_RAW16 = 32,
    HAL_PIXEL_FORMAT_BLOB = 33,
    HAL_PIXEL_FORMAT_IMPLEMENTATION_DEFINED = 34,
    HAL_PIXEL_FORMAT_YCBCR_420_888 = 35,
    HAL_PIXEL_FORMAT_RAW_OPAQUE = 36,
    HAL_PIXEL_FORMAT_RAW10 = 37,
    HAL_PIXEL_FORMAT_RAW12 = 38,
    HAL_PIXEL_FORMAT_RGBA_1010102 = 43,
    HAL_PIXEL_FORMAT_Y8 = 538982489,
    HAL_PIXEL_FORMAT_Y16 = 540422489,
    HAL_PIXEL_FORMAT_YV12 = 842094169,
} android_pixel_format_t;
```

> system/core/include/system/graphics-base-v1.0.h
