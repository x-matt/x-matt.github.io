## 视频的生成

- In: light
- Out: `.mp4`
![[assets/images/video 2024-03-22 17.36.33.excalidraw.md#^frame=wo8emUGEYu4-SaC4iLWIF|700]]

- HDR10: 静态调整亮度和对比度
- HDR10+/ DolbyVision: 动态调整亮度和对比度
- HDR算法是增大画面中的pixel范围, 将长曝的$[10, 20]$, 短曝的$[5, 15]$, 结合成新的图片$[5, 20]$

### 视频全链路
![[assets/images/video 2024-03-22 17.36.33.excalidraw.md#^frame=oKH6JRCF9QSGUVFQXIT1M|700]]

- Color Gamut: 由图像的bit位数决定, 假设是8 bit, range就是$[0, 255]$, 最小值代表极暗(黑色), 最大值代表极亮(白色), 三个通道就是 $256*256*256$种组合
  - 其表示的是设备本身数据采集的能力
- Long Exp + Short Exp 就是HDR算法
- ColorSpace: 代表着每个数值所表示的具体色彩, 是一种mapping关系
  - colorSpace可以理解为坐标系, 同一个颜色可以用不同坐标系来表达, 通过维度可以区分为 color gamut(2-D) & color volume(3-D)

![[assets/images/video 2024-03-22 17.36.33.excalidraw.md#^frame=EFN7YkTPoNDz_54o8-7wx|700]]
- generate image: 基于设备属性, 将light转换成image, image本身的色彩丰富度由设备本身决定(color gamut)
- show image: image在呈现的时候, 遵循一套规则去显示, 避免在不同设备个体呈现的画面不一致的问题
- Others: generate & show本质上是两套独立的体系, 可以各自独立工作, 但是为了保证效果, 所以在generate时候需要与show的时候保持一致的标准(colorSpace)

## 评价指标

### 主观

![[assets/images/video 2024-03-22 17.36.33.excalidraw.md#^frame=PGS5VCybr_yu_s3KO_AHX|主观测试|600]]

### 客观

![[assets/images/video 2024-03-22 17.36.33.excalidraw.md#^frame=33kZ7FRpAixkzIIc2mdFn|客观测试|600]]

优化策略方向:

1. 压缩格式
    1. Qcom: UBWC - Universal BandWidth Compression
    1. MTK: UFBC - Universal Frame Buffer Compression
    1. ARM: AFBC - [Arm Frame Buffer Compression](https://www.arm.com/technologies/graphics-technologies/arm-frame-buffer-compression)

1. MTK 压缩相关总结
    1. AFBC开启的条件为:
        1. no SW Read&Write
        1. support format: NV12, YUVP010
    1. UFBC开启的条件为:
        1. no SW Read&Write
        1. support format: UFBC_Bayer10, UFBC_Bayer12, UFBC_Bayer14, UFBC_NV12, UFBC_YUV_P010, UFBC_YUV_P012
    1. 开启规律
        - 与MTK HAL交互的flow使用的compression是UFBC
        - 除了MTK HAL使用的compression是AFBC

## Profile

- app log `frameRate=`
- 通过修改 `vendor/etc/media_profiles_V1_0.xml`来调整

    ```xml
    <EncoderProfile quality="8kuhd" fileFormat="mp4" duration="30">
                <Video codec="h264"
                       bitRate="96000000"
                       width="7680"
                       height="4320"
                       frameRate="30" />
                <Audio codec="aac"
                       bitRate="256000"
                       sampleRate="48000"
                       channels="2" />
         </EncoderProfile>
    ```

- 确认的关键log `MediaCodec:   int32_t bitrate`

## 视频基础体验优化

- [N2/N3视频基础体验优化测试工具](https://xiaomi.f.mioffice.cn/docx/doxk4QMsR0NcAzBiVo114tGkjFg)
	- 多色彩图片
	- 多问题图片
	- B帧[^1]检测
	- media info

## 未来发展方向的思考

- 高帧率，高解析力 （性能&Power的优化）
- 开启专业性模式
	- 运动系：GoPro，DJI Action

### DJI

| 产品系列 | 核心买点 |
|-----------|----------|
| Mavic系列 | 便携性、高性能、易于操控 |
| Phantom系列 | 专业级航拍、高稳定性、高质量影像 |
| Air系列 | 中等价位、高性价比、易于使用 |
| Mini系列 | 轻量级、入门级、易于上手 |
| Spark系列 | 超小型、趣味互动、易于分享 |
| FPV系列 | 沉浸式飞行体验、高速穿越、实时图传 |
| Osmo系列 | 手持稳定器、多功能、适合多种拍摄场景 |
| Ronin系列 | 专业级稳定器、高精度、多平台适用 |
| Inspire系列 | 专业级无人机平台、模块化设计、商业应用 |


## 参考文档

1. [Colour Gamut vs Colour Space: What Do They Mean and What’s The Difference?](https://prismplus.sg/blogs/blog/colour-gamut-vs-colour-space-what-do-they-mean-and-what-s-the-difference#:~:text=A%20colour%20space%20is%20a%20mathematical%20model%20that%20defines%20how,display%2C%20reproduce%2C%20or%20capture.&text=A%20mathematical%20model%20that%20defines%20colour%20representation.)

[^1]: [视频编码中常见的I，P，B帧，一次弄明白](https://zhuanlan.zhihu.com/p/614236013)