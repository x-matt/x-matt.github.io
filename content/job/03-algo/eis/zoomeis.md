## 1. Revision history

Revision |    Data    | Description
:-------:|:----------:|-------------------
  v0.1   | 2022.09.20 | Initialize release

## 2. Content

[TOC]

<!-- pagebreak -->

## 3. 缩略词说明

| 缩写   | 全称                             | 说明                                               |
| ---- | ------------------------------ | ------------------------------------------------ |
| FOV  | Filed of View                  | 视场角                                              |
| EIS  | Electronic Image Stabilization | 电子防抖                                             |
| P1   | Pass 1                         | MTK的pileline模块，用于接收sensor的图，转换成RAW/YUV           |
| P2   | Pass 2                         | MTK的pileline模块，接收P1出的图，内部串接三方算法                  |
| P2S  | P2-Streaming                   | 针对recording & preview的P2子模块                      |
| P2C  | P2-Capture                     | 针对snapshot的P2子模块                                 |
| VMDP | Vendor Multimedia Data Path    | MTK的一个模块，用于三方算法后处理，可以完成色彩转换，裁切，resize，旋转，图像增强等工作 |

## 4. 文档需求

该文章旨在基于MTK平台，将拍照预览防抖功能转化为技术需求，设计系统架构，拆解成各个模块需要完成的工作，控制风险，确保按期高质量完成。

## 5. 需求识别

### 5.1. 功能需求

ZoomEIS主要是为了应对当zoom到高倍率时，预览画面抖动的问题。

- 长焦拍照的场景下预览画面的稳定性对用户拍照体验的影响愈发的明显，尤其体现在月亮模式，预览画面的抖动目标难以捕获。
- ZoomEIS主要是在高倍率的场景下增加电子防抖的功能，增强预览画面的稳定性，降低用户取景难度。

### 5.2. 细节需求

1. 保证该功能开启前后，FOV覆盖比例一致
2. 保证功能开启之后，预览和拍照生成的图片FOV一致

### 5.3. 落地需求

1. 在L11-二供机器上进行预研工作
2. 预期在K9/K9B项目进行落地
3. 基于自研HIS算法进行预研工作

## 6. Usecase设计

1. 根据识别到的用户需求，ZoomEIS的主要应用场景是：
    1. 拍照场景（包含1:1，3:4，9:16，全屏）
    2. 月亮模式

2. 底层会根据APP下发的 operationMode & AppMode 判断是否使能该功能
    - 更细致的会在用户zoom到一定倍率(zoomRatio)的时候增加预览防抖的效果。

## 7. 架构设计
 
### 7.1. 系统软件架构

![[assets/images/zoomeis 2024-03-24 14.24.23.excalidraw.md#^frame=OPnlqzlh2HU_QBOQvmoKg|Fig.One ZoomEIS框架图|400]]

- 步骤：
    1. APP下发请求，经由CameraService传递给CameraHAL
    2. HAL层构建pipeline
        1. 先由Sensor生成原始图像
        2. 经由P1进行Crop/Resize 生成后处理算法预期的图片
        3. P2中EIS开始处理生成Crop信息传递给VMDP(内含WPE)
        4. VMDP对图片进行Crop&Resize，交给Preview

### 7.2. 算法处理流程

![[assets/images/zoomeis 2024-03-24 14.24.23.excalidraw.md#^frame=aRG4gfAAiIPcDDu5NQJz-| EISNode中，处理流程图|400]]

- 步骤：
    1. Start：根据OperationMode/AppMode来区分出需要开启该功能的场景
    2. Config：配置加载zoomEIS对应的 lib、setting 等
    3. Process：循环单帧处理
        1. Decide：通过zoomRatio判断该帧是否需要进行防抖处理
        2. ExecuteAlgo：执行算法
        3. Gengrate shift： 生成shift给Capture，保证拍照与预览的FOV一致
        4. Generate warpMap：生成cropInfo给Preview

1. 多场景下size梳理

| L11       | ActiveSize | TargetSize |
| --------- | ---------- | ---------- |
| 1:1       | 4000x3000  | 1440x1080  |
| 4:3       | 4000x3000  | 1440x1080  |
| 16:9      | 4000x3000  | 1920x1440  |
| Full size | 4000x3000  | 2400x1800  |

## 8. 重要技术要点

### 8.1. 裁切
![[assets/images/zoomeis 2024-03-24 14.24.23.excalidraw.md#^frame=ia5pDZ_FOZe4G6UfPYn6p|默认的Pipeline裁切逻辑|700]]

1. P1和P2同时具有Crop&Resize的能力，Crop有FOV损失，Resize(包含downScale & upScale)无FOV损失，Crop默认情况下均为中心crop
2. 图中的P1-In为sensor activity size，P2-Out为target size，P1最多只能裁切到target size，若剩余部分需要裁切，则交由P2进行裁切（对应的zoomRatio节点值为 P1-In.w / P2-Out.w）
3. 为了保证最终生成的图片解析力不会损失太多，方案中将仅仅利用原先交由P2模块crop的那一部分进行防抖，P1部分的逻辑保持不变
4. 样例说明：
    1. Capture(4:3) - 2x

| Buffer Name  | Size      | In-to-Out Behavior                                                    |
| ------------ | --------- | --------------------------------------------------------------------- |
| P1-In        | 4000x3000 | -                                                                     |
| P1-Out/P2-In | 1440x1080 | 1. Center-crop to: (2000x1500)@(1000,750) <br>2. Resize to: 1440x1080 |
| P2-Out       | 1440x1080 | 1. Resize to: 1440x1080                                               |

    2. Capture(4:3) - 5x

| Buffer Name  | Size      | In-to-Out Behavior                                                |
| ------------ | --------- | ----------------------------------------------------------------- |
| P1-In        | 4000x3000 | -                                                                 |
| P1-Out/P2-In | 1440x1080 | 1. Center-crop to: (1440x1080)@(1280,960)                         |
| P2-Out       | 1440x1080 | 1. Center-crop to: (800x600)@(320,240)<br>2. Resize to: 1440x1080 |

        总结：普通拍照，4:3场景下
        1. zoomRatio P2有无裁切余量的分界点为 _4000 / 1440 = 2.777778_
        2. 2x下，仅P1需要做Crop，一次性将FOV损耗完
        3. 5x下：
            1. P1做第一次Crop，并Crop到 1440x1080，损耗其中一部分FOV
            2. P2负责接下来的FOV损耗，进行第二次Crop，这一部分FOV损失便可用来做防抖

### 8.2. 偏移

![[assets/images/zoomeis 2024-03-24 14.24.23.excalidraw.md#^frame=DK3gZgmsz-1RnjwBp_ith|中心裁切|600]]
![[assets/images/zoomeis 2024-03-24 14.24.23.excalidraw.md#^frame=gmcbhb8eHZTDk0FpdRVz0|按照eis-cropInfo进行裁切|600]]
- 样例说明：普通拍照，4:3场景，5x

| Buffer Name   | Size      | In-to-Out Behavior                                                |
| ------------- | --------- | ----------------------------------------------------------------- |
| P1-In         | 4000x3000 | -                                                                 |
| P1-Out/P2-In  | 1440x1080 | 1. Center-crop to: (1440x1080)@(1280,960)                         |
| P2-Out-Normal | 1440x1080 | 1. Center-crop to: (800x600)@(320,240)<br>2. Resize to: 1440x1080 |
| P2-Out-EIS    | 1440x1080 | 1. EIS-crop to: (800x600)@(340,270)<br>2. Resize to: 1440x1080    |

    1. 上述表格中，Cropped-buffer左上角点的坐标在默认做Center-crop时，匹配到Input的坐标为(320,240)，经过EIS计算之后，其匹配到的点为(340,270)，针对P2-In而言，其Shift值则为(20,30)。
    2. shift值在传递给capture的时候，需要转换成基于P1-In的shift值

### 8.3. 与ISZ串联

1. ISZ介绍
以L11使用的s5khm2(108M，9-in-1)为例：

- 当zoom到3X以上时，seamless快速切换sensor mode，让sensor输出fullsize crop 12M。此时sensor输出的12M RAW自带2x zoom的效果。
- 这意味着想要得到6x zoom的效果，ISZ模式只需要在12M RAW上再做一次2x zoom即可，得到预览/拍照底图为3M(12M/4)。
- 而normal模式则需要在12M RAW上直接做4x zoom，得到的拍照底图为0.78M(12M/16)。
- 所以ISZ模式下成片清晰度得到了巨大的提升。

| ISZ status | User zoomRatio | P1-In-Size     | P1-In-FOV | P2-Crop-FOV | P2-Out 底图 |
| ---------- | -------------- | -------------- | --------- | ----------- | --------- |
| off        | 6x             | 4000*3000(12M) | 1x        | 6x          | 0.75M     |
| on         | 6x             | 4000*3000(12M) | 3x        | 2x          | 3M        |

| L11              | 1:1                 | >            | >                | >               | 4:3                      | 16:9                | full                |
| ---------------- | ------------------- | ------------ | ---------------- | --------------- | ------------------------ | ------------------- | ------------------- |
| preZoomRatioThre | 4000/1440<br>2.7777 | >            | >                | >               | 4000/1440<br>2.7777      | 4000/1920<br>2.0833 | 4000/2400<br>1.6666 |
| ISZzoomRatioThre | >                   | >            | >                | >               | >                        | >                   | 3x                  |
| combineThre      | 3*2.777             | >            | >                | >               | 3*2.777                  | 3*2.0833            | 3*1.6666            |
| total_zoom       | 1 - 2.7             | 1 - 2.7      | 2.7 - 3          | 3 - 8.3(isz-on) | 8.3 - 10(isz-on)         | -                   | -                   |
| pre_zoom         | -                   | = total_zoom | = 2.7            | = total_zoom/3  | = 2.7                    | -                   | -                   |
| post_zoom        | -                   | = 1          | = total_zoom/2.7 | = 1             | = total_zoom/combineThre | -                   | -                   |

1. 难点

- 9-in-1的sensor，ISZ的开启倍率为3x，4-in-1的sensor，ISZ的开启倍率则为2x，ISZ在达到开启倍率之后，还是会根据环境的亮暗来动态on/off，这就导致交给P2的可裁切区域也会随之发生跳变，因此EIS若启用动态margin功能，就会出现跳变前cropFactor为0.5，跳变后变为0.1的现象，画面切换瞬间会有明显抖动。

针对上述问题，需要根据实际效果进一步确定：

- 什么倍率下开启zoomEIS功能？
- 是否需要使用动态Margin功能？

## 9. 基础风险评估以及解决方案应对

### 9.1. 功耗、性能、内存

### 9.2. 效果对比

## 10. 异常处理机制

温度过高、性能不足、内存不足、算法异常、外部干扰时的合理解决方案

## 11. Test case

## 12. Milestone

## 13. 各组接口人

## 14. 评审结果
