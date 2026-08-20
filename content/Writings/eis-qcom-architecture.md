---
title: Eis qcom architecture
type: area
domain: work
category: feature
status: active
priority:
review:
tags:
  - eis
  - qcom
---

## 1. EIS节点对比

| Node  | 解决的问题                                   | 实时性   | Out Param                                                                                                                         | Out子项说明                                                                                   |
| ----- | -------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| EISV2 | 1. FOV抖动问题<br>2. 畸变问题<br>3. for MCTF | RealTime | stabilization_transform<br>distortion_correction_grid<br>alignment_matrix_domain_undistorted & alignment_matrix_domain_stabilized | 1. perspectiveMatrix<br>2. LDC/ERS Grid<br>3. Gyro Alignment Matrix                           |
| GME   | 1. 畸变问题<br>2. for MCTF                   | RealTime | distortion_correction_grid<br>alignment_matrix_domain_undistorted                                                                 | 1. LDC/ERS Grid<br>2. Gyro Alignment Matrix                                                   |
| EISV3 | 1. FOV抖动问题<br>2. for MCTF                | Delayed  | stabilization_transform<br>distortion_correction_grid<br>alignment_matrix_domain_stabilized                                       | 1. perspectiveMatrix<br>2. DIS Grid<br>3. LDC/ERS Grid (from GME)<br>4. Gyro Alignment Matrix |

## 2. EIS解决的问题

### 2.1 FOV反复交替问题

- stabilization_transform
  - perspectiveMatrix
  - DIS grid

### 2.2 畸变问题

- distortion_correction_grid
  - LDC/ERS Grid

## 3. EIS输出结构

### 3.1 EISV2输出

```cpp
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
```

### 3.2 EISV3输出

```cpp
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

## 4. 变量说明

| Variable                            | Description                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| frame_id                            | Current request ID                                                                                                             |
| active_sensor_idx                   | Current sensor ID. Algorithm need to maintain instances for different cameras internally.                                      |
| distortion_correction_grid          | The grid for distortion correction. Required in EISV2, GME and EISV3                                                           |
| stabilization_transform             | Stabilize transform matrix. Required in EISV2 and V3                                                                           |
| alignment_matrix_domain_undistorted | MCTF alignment matrix in undistorted domain. Required in EISV2 and GME node                                                    |
| alignment_matrix_domain_stabilized  | MCTF alignment matrix in stabilized domain. Required in EISV2 and V3 node if it is single exposure or anchor exposure in MFHDR |
| has_output                          | Indicate if the output data is valid. Required for EISV2, GME and EISV3                                                        |

## 5. EVA模块

### 5.1 EVA子模块

1. Image Warping
   - Geometric Correct Engine (GCE)
1. Depth from Stereo (DFS)
   - **Semi-Global Matching (SGM ) 相较于CVP改进的核心点**
1. Normalized Cross Correlation (NCC)
1. Optical Flow (OF)
1. Feature Extraction (HCD)
1. Feature Descriptor Calc & Matching
1. Downscaler
1. Pyramid Image

### 5.2 Tuning 调节模块

- Dense Motion Map (DMM) : 仅8450
  - 改善了对局部运动的检测能力
- Descriptors based Motion Estimation (DME): < 8450

## 6. MCTF (motion compensated temporal-filtering)

运动补偿时域滤波

- 两幅图像在合成之前需要先先估计图像之间的相互运动，其来源有二：
  1. 一是手抖引起图像全局运动
  1. 二是图像中的运动物体的局部运动

## 7. ICA

- ICA是硬件单元

## 8. Video对齐方式

### 8.1 对齐模式的选择

可以在dmm模块中设置：

1. mode = 0：image based only，对齐方式在 image 和 单位阵 之间切换
2. mode = 1：gyro based only，对齐方式在 gyro 和 单位阵 之间切换
3. mode = 2：auto calculate，对齐方式在 image 和 gyro 之间切换

### 8.2 切换阈值

1. mode = 0 :
   1. confidence < `<transform_confidence_thr_to_force_identity_transform>`时，使用单位阵
   2. confidence >`<transform_confidence_thr_to_force_identity_transform>`时，使用image align
2. mode = 2：
   1. confidence <`<image_conf_low_threshold>`时，使用gyro align
   2. confidence >`<image_conf_high_threshold>`时，使用image align
   3. `<image_conf_low_threshold>`/`<image_conf_high_threshold>`之间为缓冲区，防止频繁切换

## 9. 参考资料

- [Wiki: multframe change in 8450](https://wiki.n.miui.com/display/~liukun7/multframe+change+in+8450)
- [Wiki: MFHDR架构介绍](https://wiki.n.miui.com/pages/viewpage.action?pageId=561357565)
