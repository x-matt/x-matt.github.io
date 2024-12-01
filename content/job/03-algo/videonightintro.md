> 本文档旨在介绍夜景视频Feature相关的基础特性，方便快速入门

## Algo

- 夜景视频算法是目前项目中，唯一一个**RAW**-domain的Streaming类算法
- 由于其处理的是RAW数据，该算法的处理性能功耗目前均较高，目前落地的项目中还只支持24fps
- 算法厂商
    - JIIGAN - [O10](https://source-v.dun.mi.com/opengrok-v/xref/mivendor_v_mt6899/vendor/xiaomi/proprietary/mivifwk/external/odm/plugins/mtk/jiganvideonight/)
    - Xiaomi 自研 - [N12系列/N11A](https://source-u.dun.mi.com/opengrok-u/xref/mivendor_u_mt6897/vendor/xiaomi/proprietary/mivifwk/external/odm/plugins/mtk/mivideonight/)
- 主要Input
    - Image Buffer
        - Format: BAYER10/BAYER12/BAYER14/BAYER16
        - Size:FHD/4K
        - Bayer Pattern : RGGB/BGGR/GRBG/GBRG
        ```cpp
        struct SANCSVQImage
        {
            ANC_SVQ_COLOR_FORMAT type;       ///< 图像类型
            ANC_SVQ_IMAGE_ROTATION rotation; ///< 图像旋转角度
            int width;                       ///< 宽度(pixel)；有效数据宽度（列数）
            int height;                      ///< 宽度(pixel)；有效数据搞定（行数）
            int stride;                      ///< length of width (bytes)
            int scanline;                    ///< length of height (bytes)
            SANCSVQBlob data;                ///< 图像数据
            SANCMetadata metadata;           ///< Raw 数据metadata信息
            SANCFacedata faces_data;         ///< 人脸框信息，可传入多个人脸框
            SANCSVQBayerInfo bayer_info;     ///< Bayer pattern
        };
        ```
        
    - AE Params & AWB Params
        ```cpp
        struct SANCMetadata
        {
            // EV params
            float gamma;        ///< Gamma 矫正参数
            float iso;          ///< ISO
            float sensor_gain;  ///< sensor total gain
            float sensor_dgain; ///< sensor digintal gain
            float isp_gain;     ///< sensor isp gain
            float drc_gain;
            // AWB params
            float rgb_gain[3];       ///< WB gain, 必须按照RGGB 顺序传入
            float ccm[9];            ///< Color Correction Matrix 3x3
            float black_level[4];    ///< RGGB 4 channel black level
            float lux_index;         ///< Lux index
            float shutter;           ///< shutter time (s)
            float color_temperature; ///< 色温参数
            // Reserved
            float reserved[8]; ///< to make this struct total 32 x 'float'
        };
        ```

## Flow
### 基础方案
- 收图：RAW
- Feature Combine：EISV2, EISV3

### 1080P Flow Chart
- 现状：针对1080P场景，夜景视频目前有两套数据流方案，一套方案是算法输入为4K，输出为4K，另一套方案算法输入为4K，输出为1080P
- 提出4K-in/4K-out原因：能够让1080P场景下，效果更好，同时与4K场景共享算法逻辑
- 4K-in/4K-out的弊端：flow本身会带来Power增量，对芯片性能要求也会更高，所以建议中低端机型不导入该方案

#### 方案一: 4K-in/4K-out

- 算法的输入输出均为4K，交由后面的VSE模块，完成从4096的尺寸，resize为2400的尺寸给eis来使用