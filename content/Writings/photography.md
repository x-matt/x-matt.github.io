---
title: Photography
type: area
domain: self
category: photography
status: active
priority:
review:
tags:
image-counter: 1
---

## Light & Shade

## Three Elements of Photography

### 基础介绍

| 要素      | 标识                | 含义                          | 单位 |  趋势   |  亮度   | 劣处           | Range          |
| --------- | ------------------- | ----------------------------- | ---- | :-----: | :-----: | -------------- | -------------- |
| 快门时间  | $S$                 | 相机快门打开的时间长短        | 1/秒 | &#8593; | &#8593; | 运动模糊变严重 | $[4000, 1/30]$ |
| 光圈      | $F$(与光圈大小反比) | 相机镜头的光圈大小, 用F来表示 | /    | &#8593; | &#8593; | 景深变浅       | 1.0, 1.4...    |
| ISO感光度 | $ISO$               | 感光元件的灵敏度, 用ISO表示   | /    | &#8593; | &#8593; | 噪点增多       | $[50, 6400]$   |

### 成像原理
![[camera 2026.excalidraw#^frame=lens_params|700]]

$$
\frac{1}{s} + \frac{1}{v} = \frac{1}{f}
$$
- $s$: 物距
- $v$: 像距

景深
![[Assets/images/darkroom/photography-0.svg]]
$$
DOF = \frac{2FCs^{2}}{f^{2}}
$$
- F: 光圈值
- C: 容许弥散圆直径
- s：物距
- f: 物理焦距
#### 焦距与fov[^3]

$$
\mathrm{AFOV}[^\circ] = 2 \times \tan^{-1} \left( \frac{h}{2f} \right)
$$
- h: 成像传感器的高度
	- 视场角分为垂直视场角和水平视场角，根据传感器尺寸来计算$f_{(w,h)}$=>$f$是函数的意思
- f: 焦距

#### 画幅(传感器尺寸)

|**画幅类型**|**传感器尺寸（约）**|**常见应用**|
|---|---|---|
|**中画幅**|$44 \text{mm} \times 33 \text{mm}$ 或更大|商业摄影、极致画质需求|
|**全画幅 (Full Frame)**|**$36 \text{mm} \times 24 \text{mm}$**|**专业单反/微单、高端影像设备**|
|**APS-C 画幅 (半画幅)**|$23.5 \text{mm} \times 15.6 \text{mm}$|进阶相机、轻便微单|
|**1 英寸 / 手机传感器**|$13.2 \text{mm} \times 8.8 \text{mm}$ 或更小|旗舰手机、黑卡便携机|

#### Value介绍

| Value | 标识 | 含义                    | 公式                          |  趋势   |  亮度   | 劣处 | Range        |
| ----- | ---- | ----------------------- | ----------------------------- | :-----: | :-----: | ---- | ------------ |
| EV    | $EV$ | 曝光值 (Exposure Value) | $EV=AV+TV=log_2\frac{F^2}{S}$ | &#8593; | &#8593; | /    | $[-4.0,4.0]$ |
| AV    | $AV$ | 光圈值 (Apature Value)  | $AV=log_2F^2$                 | &#8593; | &#8595; | /    | $[-4.0,4.0]$ |
| TV    | $TV$ | 时间值 (Time Value)     | $TV=log_2\frac{1}{S}$         | &#8593; | &#8593; | /    | $[-4.0,4.0]$ |

1. 感光度
   - 硬件实现原理: 通过控制感光原件的电荷放大倍数来实现, 暗环境中捕捉更多的光线, 亮环境中捕捉较少的光线
   - 类比: 类似人眼能够适应不同光线强度的能力, 暗环境下会很敏感, 亮环境下就不敏感
   - ISO 100被认为是基准值
1. TV(Time Value)

   | TV  | S($s$) | Cal-S       |
   | --- | ------ | ----------- |
   | -1  | 2      | $2^{-(-1)}$ |
   | 0   | 1      | $2^{-(0)}$  |
   | 1   | 1/2    | $2^{-(1)}$  |
   - $S=2^{-TV}$ 或 $TV=log_2\frac{1}{S}$

1. 光圈[^1]
   - 光圈从小到大: F1.0, F1.4, F2.0, F2.8
     - **F值越小, 光圈越大, 景深越浅[^2]**
       ![[aperture 2025.excalidraw|光圈图 & 数值关系|600]]
   - 数值变化计算
     $$
     \begin{align*}
     &D=\frac{f}{F}\\
     &S=\frac{\pi}{4}D^2
     \end{align*}
     \Rightarrow S=\frac{\pi*f^2}{4*F^2}
     $$
   - 光圈$F$与面积$S$成反比, 为了实现进光量公比为2递减, $F$的公比需为$2^\frac{1}{2}$或$\sqrt{2}$递增
   - AV(Apature Value) 与 F的对应关系

     | AV  | F   | Cal-F          |
     | --- | --- | -------------- |
     | 0   | 1.0 | ${\sqrt{2}}^0$ |
     | 1   | 1.4 | ${\sqrt{2}}^1$ |
     | 2   | 2.0 | ${\sqrt{2}}^2$ |
     | 3   | 2.8 | ${\sqrt{2}}^3$ |
     - $F=2^\frac{AV}{2}$ 或 $AV=log_2F^2$

1. EV(exposure value)
   - ev值越高, 曝光越充足, 图像越亮
   - 计算公式:
     $$
     \left.\begin{align*}
      &EV = TV + AV + log_2(\frac{ISO}{100})\\
      &AV=log_2F^2\\
      &TV=log_2\frac{1}{S}
     \end{align*}\right\} \Rightarrow EV = log_2{\frac{F^2 *ISO}{S * 100}},
     $$
   - value range:
     $$
     \left\{\begin{align*}
      &F \in \{1, 1.4, 2.0, 2.8, 4.0......\}\\
      &S \in (4000, 1/30)\\
      &ISO \in (50, 12800)
     \end{align*}\right.
     $$

## 优秀视频教学

课程资源：[繁星摄影](https://52fanxing.com/)

### 麻雀大人-bilibili

- [情感人像摄影综合训练大课堂](https://www.bilibili.com/cheese/play/ss669?csource=Hp_searchresult&spm_id_from=333.337.0.0)
- [用手机把邻家女孩拍成女友！小米 12S Ultra最强人像攻略【摄影教学】](https://www.bilibili.com/video/BV1oW4y117Vw/?vd_source=852d4ef8e14fcaf3d82391cb2461a178)

[^1]: [小学生都能看懂的EV值](https://zhuanlan.zhihu.com/p/577382204)

[^2]: [摄影基础入门：5分钟读懂光圈是什么？光圈大小和景深的关系！](https://zhuanlan.zhihu.com/p/617924826?utm_id=0)

[^3]:[了解焦距与视场](https://www.edmundoptics.cn/knowledge-center/application-notes/imaging/understanding-focal-length-and-field-of-view/)
