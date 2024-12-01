
## 1. Revision history

Revision |    Data    | Description
:-------:|:----------:|-------------------
  v0.1   | 2023.08.25 | Initialize release

## 2. Content

该文档基于8450平台总结
Qcom-EIS
supported sensor: FRONT, WIDE, ULTRA-WIDE, TELE

[ISP模块学习](https://wiki.n.miui.com/pages/viewpage.action?pageId=610853444)

https://www.canon-europe.com/pro/infobank/image-stabilisation-lenses/

## 3. 8550-Code

1. [Mis](https://opengrok-bsp.pt.xiaomi.com/xref/mivendor_t_sm8550/vendor/qcom/proprietary/chi-cdk/oem/qcom/node/mis/)
2. [qcom-eis](https://opengrok-bsp.pt.xiaomi.com/xref/mivendor_t_sm8550/vendor/qcom/proprietary/camx/src/swl/eis/)

## 4. Question

1. 什么是[QIS](https://docs.qualcomm.com/bundle/80-PN984-102/resource/80-PN984-102.pdf)
    1. Qcom image stabilization
    2. 包含 stabilization, LDC, OIS
2. 什么是DIS，基于图像的防抖  digital image stabilization
3. 什么是GME
    1. Doc: [EIS 3rd Party algorithm integration Guide]([](https://security.feishu.cn/link/safety?target=https%3A%2F%2Fdocs.qualcomm.com%2Fbundle%2FKBA-211010195120%2Fresource%2FKBA-211010195120.pdf&scene=ccm&logParams=%7B%22location%22%3A%22ccm_default%22%7D&lang=zh-CN))
    2. Gyro motion estimate
    3. Output
        1. the distortion correction grid includes rolling shutter
        2. MCTF alignment for current frame
    4. Can be used under photo mode separately

## 5. NOTES

| Node  | 解决的问题       | 实时性      | Out Param                                                                | Out子项说明                                                           |
| ----- | ----------- | -------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| EISV2 | 1. FOV抖动问题  | RealTime | stabilization_transform                                                  | 1. perspectiveMatrix                                              |
|       | 2. 畸变问题     | RealTime | distortion_correction_grid                                               | 2. LDC/ERS Grid                                                   |
|       | 3. for MCTF | RealTime | alignment_matrix_domain_undistorted & alignment_matrix_domain_stabilized | 3. Gyro Alignment Matrix                                          |
| GME   | 1. 畸变问题     | RealTime | distortion_correction_grid                                               | 1. LDC/ERS Grid                                                   |
|       | 2. for MCTF | RealTime | alignment_matrix_domain_undistorted                                      | 2. Gyro Alignment Matrix                                          |
| EISV3 | 1. FOV抖动问题  | Delayed  | stabilization_transformrdistortion_correction_grid                       | 1. perspectiveMatrix<br>2. DIS Grid<br>3. LDC/ERS Grid (from GME) |
|       | 2. for MCTF | Delayed  | alignment_matrix_domain_stabilized                                       | 4. Gyro Alignment Matrix                                          |

Variable                            | Description
------------------------------------|-------------------------------------------------------------------------------------------------------------------------------
frame_id                            | Current request ID
active_sensor_idx                   | Current sensor ID. Algorithm need to maintain instances for different cameras internally.
distortion_correction_grid          | The grid for distortion correction. Required in EISV2, GME and EISV3
stabilization_transform             | Stabilize transform matrix. Required in EISV2 and V3
alignment_matrix_domain_undistorted | MCTF alignment matrix in undistorted domain. Required in EISV2 and GME node
alignment_matrix_domain_stabilized  | MCTF alignment matrix in stabilized domain. Required in EISV2 and V3 node if it is single exposure or anchor exposure in MFHDR
has_output                          | Indicate if the output data is valid. Required for EISV2, GME and EISV3


- EIS解决的问题
    1. FOV反复交替问题 - stabilization_transform
        1. perspectiveMatrix
        2. DIS grid
    2. 畸变问题 - distortion_correction_grid
        1. LDC/ERS Grid
- M2算法及使用场景

算法厂商 | 应用场景
---------|-------------------------------
Vidhance | FRONT、SuperEIS、SuperEISPro
Morpho   | Capture Preview Zoom、Moon Mode
HIS      | 4K60
Qcom     | Others

- EIS的output
    1. alignment Matrix： MCTF用来提升画质 ，以前是用的GME但是现在这个工作由EIS做了，所以现在GMEnode不用了
        - GME : 用gyro 来计算处alignment 矩阵
        - EVA(DME+ICA) : 用image特征点来计算出alignment 矩阵
        - 然后IPE中会选取一个效果较为好的来用，我们也可以同overridesettings中的使能开关来切换用哪一个
    2. perspectiveMatrix： matrix用作来防抖
    3. grid： 做DC的

```cpp
// eisv2
typedef struct is_output_s
{
    uint32_t            frame_id;                   /**< Processed frame index  */
    uint32_t            active_sensor_idx;          /**< Active sensor index, synced with frame_id */

    NcLibWarpGrid       distortion_correction_grid; /**< distortion_correction Grid transform, synced with frame_id */

    NcLibWarp           stabilization_transform;    /**< Stabilization transform, as passed to NcLib.
                                                     *   Transforms are synced with frame_id.
                                                     *   Structure contains stabilization matrix and DIS grid in OUT_2_IN
                                                     */

    NcLibWarpMatrices   alignment_matrix_domain_undistorted;    /**< Undistorted frame alignment matrix using gyro instead of
                                                                 *   CVP/LRME, a matrix between "undistorted current" domain to "undistorted previous" domain.
                                                                 *   Transforms are synced with frame_id.
                                                                 */

    NcLibWarpMatrices   alignment_matrix_domain_stabilized;     /**< Stabilized frame alignment matrix using gyro target, a final
                                                                 *   matrix for MCTF matrix between "stabilized current" domain to "stabilized previous" domain.
                                                                 *   Transforms are synced with frame_id.
                                                                 */

    float               Mind_margins_blender_geolib;            /**< blender between maximal and minimal margins for GeoLib
                                                                 *   0 is minimal margins (== only physical margins); 1 is maximal margins (== total margins including virtual and maybe more in case of zoom).
                                                                 *   TODO (rgaizman): set this to 1 for calibration mode so we wont get unwanted VSR/IFE zoom.
                                                                 */

    float               cvp_motion_index_raw;                   /**< Amount of movement from previous frame to current frame in undistorted domain. units are in image pixels */

    cam_is_ois_mode     ois_mode;                               /**< When OIS is active in system, this will contain recommended OIS operation mode. Otherwise will contain an invalid output */

    scene_detection_t   scene_detection;                        /**< Contains the scene detection as calculated by EIS algorithm. Output is synced with frame_id */

    float               output_dist_corr_reserve[16];
    float               output_stabilize_reserve[16];

    bool                has_output;                             /**< if true, a frame was processed. Otherwise frame was not processed */
} is_output_t;

// eisv3
struct EISV3NonSplitOutput
{
    is_output_distortion_correction_t*   pEISv3OutputDist;  ///< Pointer to EISv3 distortion output
    is_output_stabilize_t*               pEISv3OutputStab;  ///< Pointer to EISv3 stabilization output
};

/** IS output data structure of eis3_process_distortion_correction() */
typedef struct is_output_distortion_correction_s
{
    uint32_t            frame_id;                               /**< Processed frame index  */
    uint32_t            active_sensor_idx;                      /**< Active sensor index, synced with frame_id */

    NcLibWarpGrid       distortion_correction_grid;             /**< distortion_correction Grid transform, synced with frame_id */

    NcLibWarpMatrices   alignment_matrix_domain_undistorted;    /**< Undistorted frame alignment matrix using gyro instead of
                                                                 *   CVP/LRME, a matrix between "undistorted current" domain to "undistorted previous" domain.
                                                                 *   Transforms are synced with frame_id.
                                                                 */

    uint64_t            mof_gyro_time;                          /**< Middle of frame (MOF) time in gyro timing axis
                                                                 *   Will be used to feed two times to any QIS instance to get alignment between those times
                                                                 *   in eis3_get_device_rotation_delta()
                                                                 */

    is_output_depth_post_processing_t   depth_valid_polygon;    /**< Depth post processing output struct */

    float               Mind_margins_blender_geolib;            /**< blender between maximal and minimal margins for GeoLib
                                                                 *   0 is minimal margins (== only physical margins); 1 is maximal margins (== total margins including virtual and maybe more in case of zoom).
                                                                 *   TODO (rgaizman): set this to 1 for calibration mode so we wont get unwanted VSR/IFE zoom.
                                                                 */

    float               cvp_motion_index_raw;                   /**< Amount of movement from previous frame to current frame in undistorted domain. units are in image pixels */

    cam_is_ois_mode     ois_mode;                               /**< When OIS is active, this will contain recommended OIS operation mode. Otherwise will contain an invalid output */

    scene_detection_t   scene_detection;                        /**< Contains the scene detection as calculated by EIS algorithm. Output is synced with frame_id */

    float               output_dist_corr_reserve[16];

    bool                has_output;                             /**< if true, a frame was processed. Otherwise frame was not processed */
} is_output_distortion_correction_t;

/** IS output data structure of eis3_process_stabilize() */
typedef struct is_output_stabilize_s
{
    uint32_t            frame_id;                               /**< Processed frame index  */
    uint32_t            active_sensor_idx;                      /**< Active sensor index, synced with frame_id */

    NcLibWarpGrid       distortion_correction_grid;             /**< distortion_correction Grid transform, synced with frame_id */

    NcLibWarp           stabilization_transform;                /**< Stabilization transform, as passed to NcLib.
                                                                 *   Transforms are synced with frame_id
                                                                 *
                                                                 *   stabilization matrix and DIS grid transforms domain: OUT_2_IN
                                                                 */

    NcLibWarpMatrices   alignment_matrix_domain_undistorted;    /**< Undistorted frame alignment matrix using gyro instead of
                                                                 *   CVP/LRME, a matrix between "undistorted current" domain to "undistorted previous" domain.
                                                                 *   Transforms are synced with frame_id.
                                                                 */

    NcLibWarpMatrices   alignment_matrix_domain_stabilized;     /**< Stabilized frame alignment matrix using gyro target, a final
                                                                 *   matrix for MCTF matrix between "stabilized current" domain to "stabilized previous" domain.
                                                                 *   Transforms are synced with frame_id.
                                                                 */

    scene_detection_t   scene_detection;                        /**< Contains the scene detection as calculated by EIS algorithm. Output is synced with frame_id */

    float               output_stabilize_reserve[16];

    bool                has_output;                             /**< if true, a frame was processed. Otherwise frame was not processed */

} is_output_stabilize_t;
```

- 子算法
  - miMotion
  - selfeis(FRONT)
- 效果优化

| 策略         | 场景            | 备注                                                         |
| ---------- | ------------- | ---------------------------------------------------------- |
| 1.结合DIS    | 室外远郊          | 亮环境易区分前后背景的场景                                              |
| 2.EIS+OIS  | 有OIS的场景       | 改善运动模糊                                                     |
| 3.动态Margin | zoom场景        | 将zoom时候多余的部分都用来做eis防抖                                      |
| 4.zoomEIS  | 拍照预览高倍率zoom场景 | 高倍率抖动剧烈的问题                                                 |
| 5.miMotion | 全场景区分，匹配不同的曝光 | 1. Dark-Still: 拉长曝光，改善画质<br>2. Outdoor- Running: 降低曝光，关OIS |

## 6. Video对齐方式

[8450 Video 对齐方式](https://wiki.n.miui.com/pages/viewpage.action?pageId=673992775)
8450新增EVA计算模块，代替之前的CVP，用于矩阵计算，相比之前的CVP模块，功能更强大，新增SGM，可以对图像分块做对齐，但Video暂时未使用

1. 对齐模式的选择：可以在dmm模块中设置：
    1. mode = 0：image based only，对齐方式在 image 和 单位阵 之间切换
    2. mode = 1：gyro based only，对齐方式在 gyro 和 单位阵 之间切换
    3. mode = 2：auto calculate，对齐方式在 image 和 gyro 之间切换
2. 切换阈值：
    1. mode = 0 :
        1. confidence < `<transform_confidence_thr_to_force_identity_transform>`时，使用单位阵
        2. confidence >`<transform_confidence_thr_to_force_identity_transform>`时，使用image align
    2. mode = 2：
        1. confidence <`<image_conf_low_threshold>`时，使用gyro align
        2. confidence >`<image_conf_high_threshold>`时，使用image align
        3. `<image_conf_low_threshold>`/`<image_conf_high_threshold>`之间为缓冲区，防止频繁切换

## 7. 其他模块

- EVA : Engine for Visual Analytics
    ![[image-3.png|timeline|900]]
  - Doc
      1. [Engine for Visual Analytics (EVA) v3.x](https://docs.qualcomm.com/bundle/80-PF777-94/resource/80-PF777-94.pdf)
      1. [Qualcomm® SnapdragonTM Engine for Visual Analytics (EVA 3) for SM8450](https://docs.qualcomm.com/bundle/80-35742-1/resource/80-35742-1.pdf)
  - 子模块
      1. Image Warping
        -  Geometric Correct Engine (GCE)
      1. Depth from Stereo (DFS)
          - **Semi-Global Matching (SGM ) 相较于CVP改进的核心点**
      1. Normalized Cross Correlation (NCC)
      1. Optical Flow (OF)
      1. Feature Extraction (HCD)
      1. Feature Descriptor Calc & Matching
      1. Downscaler
      1. Pyramid Image
  - Tuning 调节模块
    - Dense Motion Map (DMM) :  仅8450
      - 改善了对局部运动的检测能力
    - Descriptors based Motion Estimation (DME):    < 8450
- MCTF : motion compensated temporal-filtering ，运动补偿时域滤波
  - 两幅图像在合成之前需要先先估计图像之间的相互运动，其来源有二：
        1. 一是手抖引起图像全局运动
        1. 二是图像中的运动物体的局部运动
- ICA是硬件单元

## 8. 培训视频

- [EIS工具](https://kpan.mioffice.cn/webfolder/folder/home.action#folder&0.2293407533615759&folderId=5804772)
- [EIS培训](https://kpan.mioffice.cn/webfolder/folder/home.action#folder&0.5985776115567101&folderId=86103487)
  - [Digital Video Stabilization and Rolling Shutter Correction using Gyroscope 论文笔记](https://www.cnblogs.com/sinbad360/p/15017607.html)
- [NCS](https://kpan.mioffice.cn/webfolder/folder/home.action#folder&0.29767171770458667&folderId=103677673)

## 9. 投影变换

### 9.1. 进阶

1. 旋转
2. 平移
3. 刚体 = 旋转 + 平移
    - 只改变物体位置，不改变物体形状
4. 仿射
    - 改变物体位置和形状，但是保持“平直性”
5. 透视
    - 彻底改变物体位置和形状
    ![[image-1.png|project|700]]

### 9.2. 矩阵含义

- 透视变换（Perspective Transformation）的本质是将图像投影到一个新的视平面
![[image-2.png|matrix|700]]
## 10. Debug

```bash
adb wait-for-device root
adb wait-for-device remount
adb shell "echo EISv3GyroDumpEnabled=1 >> /vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv2OperationMode=2 >> /vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv3OperationMode=2 >> /vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo fovcEnable=0 >> /vendor/etc/camera/camxoverridesettings.txt"

# dump sensorData log
adb shell setprop vendor.debug.camera.overrideLogLevels 0x1FF
adb shell "echo EISv2InputDumpLogcatEnabled=1 >> /vendor/etc/camera/eisoverridesettings.txt"

# ncs log
adb shell setprop persist.vendor.camera.logInfoMask 0x800002
adb shell setprop persist.vendor.camera.logVerboseMask 0x800000
```

## 11. 参考资料

- [Wiki: multframe change in 8450](https://wiki.n.miui.com/display/~liukun7/multframe+change+in+8450)
- [Wiki: MFHDR架构介绍](https://wiki.n.miui.com/pages/viewpage.action?pageId=561357565)
- [CSDN: 透视变换](https://blog.csdn.net/m0_43609475/article/details/112847314)
- [CSDN: 仿射变换和透视变换](https://blog.csdn.net/qq_28087491/article/details/112045439)