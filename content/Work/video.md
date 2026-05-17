## 视频的生成

- In: light
- Out: `.mp4`
  ![[video 2025.excalidraw#^frame=full_logic|800]]
- HDR10: 静态调整亮度和对比度
- HDR10+/ DolbyVision: 动态调整亮度和对比度
- HDR算法是增大画面中的pixel范围, 将长曝的$[10, 20]$, 短曝的$[5, 15]$, 结合成新的图片$[5, 20]$

### 视频全链路

![[video 2025.excalidraw#^frame=color|600]]

- Color Gamut: 由图像的bit位数决定, 假设是8 bit, range就是$[0, 255]$, 最小值代表极暗(黑色), 最大值代表极亮(白色), 三个通道就是 $256*256*256$种组合
  - 其表示的是设备本身数据采集的能力
- Long Exp + Short Exp 就是HDR算法
- ColorSpace: 代表着每个数值所表示的具体色彩, 是一种mapping关系
  - colorSpace可以理解为坐标系, 同一个颜色可以用不同坐标系来表达, 通过维度可以区分为 color gamut(2-D) & color volume(3-D)
    ![[video 2025.excalidraw#^frame=link|600]]
- generate image: 基于设备属性, 将light转换成image, image本身的色彩丰富度由设备本身决定(color gamut)
- show image: image在呈现的时候, 遵循一套规则去显示, 避免在不同设备个体呈现的画面不一致的问题
- Others: generate & show本质上是两套独立的体系, 可以各自独立工作, 但是为了保证效果, 所以在generate时候需要与show的时候保持一致的标准(colorSpace)

## 评价指标

### 主观

![[video 2025.excalidraw#^frame=video_evaluate|主观评测维度|600]]

### 客观

![[video 2025.excalidraw#^frame=objective|客观评测维度|600]]

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

  - 多色彩图片
  - 多问题图片
  - B帧[^1]检测
  - media info

## 未来发展方向的思考

- 高帧率，高解析力 （性能&Power的优化）
- 开启专业性模式
  - 运动系：GoPro，DJI Action

### DJI

| 产品系列    | 核心买点                               |
| ----------- | -------------------------------------- |
| Mavic系列   | 便携性、高性能、易于操控               |
| Phantom系列 | 专业级航拍、高稳定性、高质量影像       |
| Air系列     | 中等价位、高性价比、易于使用           |
| Mini系列    | 轻量级、入门级、易于上手               |
| Spark系列   | 超小型、趣味互动、易于分享             |
| FPV系列     | 沉浸式飞行体验、高速穿越、实时图传     |
| Osmo系列    | 手持稳定器、多功能、适合多种拍摄场景   |
| Ronin系列   | 专业级稳定器、高精度、多平台适用       |
| Inspire系列 | 专业级无人机平台、模块化设计、商业应用 |

## 视频成片大小

1. 影响因素
   1. 比特率/码率 bitrate
      1. 定义: 单位时间内传输或处理的数据量
      2. 单位: bps(bit-pre-second)/kbps/Mbps
   2. 长度 duration
   3. 编码格式和压缩效率
      1. 编码格式: h.264/h.265
      2. 压缩效率: 码率控制 & 压缩质量设置
   4. 分辨率 resolution
2. 计算事例
   - bitrate: 5 Mbps
   - duration: 10min (600s)
   - 总数据量: 5Mbps \* 600s = 3000Mbit = 375 MByte

## LOG模式[^2]

是一种色彩编码格式

### 基础概念

LOG（Logarithmic Gamma）是一种**对数曲线**：

- 把传感器的**线性光信号**
- 用**对数方式压缩亮部和暗部**
- 让有限的 bit-depth（8/10/12bit）里**装下更多动态范围**
  结果：
- 画面：灰、反差小、不鲜艳
- 数据：高光不过曝、暗部细节更多
- 目的：方便后期调色（LUT / Color Grading）
  常见 LOG：
- Sony：S-Log2 / S-Log3
- Canon：C-Log
- Panasonic：V-Log
- DJI / 手机厂商：自定义 LOG

### 软件的相关适配(减少前端处理，延后调色)

1. sensor -> isp （少处理，避免强处理）
   1. 保持线性数据
      1. 不能过早做gamma
      2. 关闭/减弱自动对比度、增强类算法
   2. 3a调整
      1. ae策略偏向保高光
      2. awb要稳定
      3. nr/sharpen/tone mapping 要保守
2. isp -> hal 1. bit depth 使用10bit，避免画面断层2. 调整colorspace 3. 三方算法(fb/sn/sr)尽量少接入
   ![[video 2025.excalidraw#^frame=LOG|LOG与BT.709的对比|600]]

[^1]: [视频编码中常见的I，P，B帧，一次弄明白](https://zhuanlan.zhihu.com/p/614236013)

[^2]: [一篇文章了解什么是相机的LOG灰片、RAW、Rec. 709格式 - 知乎](https://zhuanlan.zhihu.com/p/1931408079234245195)
