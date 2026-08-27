---
title: Camera Model
type: area
domain: knowledge
category: geometry
status: active
priority:
review:
tags:
---

在计算机视觉 / 相机标定中，可以简单理解为：

> **Camera Model: 3D->2D**
> 	**Intrinsic：相机自己是什么样的。**
> 	**Extrinsic：相机在世界里处于什么位置、朝什么方向。**


>[!question] Question
>理想双目模型中，两颗lens的$f$得是完全一致的？

## Coordinate System

几个坐标系[^1]
1. 世界坐标系$\{W\}$，$P_w(x_w,y_w,z_w)$
2. 相机坐标系$\{C\}$，$P_c(x_c,y_c,z_c)$
3. 图像坐标系$\{I\}$
4. 像素坐标系$\{P\}$

![[camera 2026.excalidraw#^frame=pinhole_camera|700]]

规律：
1. 世界坐标系一般为[惯性系](https://zhida.zhihu.com/search?content_id=241619457&content_type=Article&match_order=1&q=%E6%83%AF%E6%80%A7%E7%B3%BB&zhida_source=entity)，位置可任意指定。
2. 相机坐标系通常以光心$O$作为[原点](https://zhida.zhihu.com/search?content_id=241619457&content_type=Article&match_order=1&q=%E5%8E%9F%E7%82%B9&zhida_source=entity)，垂直像平面向前为z轴，x轴与图像坐标系x轴同向，y轴与图像坐标系y轴同向。
3. 图像坐标系以[光轴](https://zhida.zhihu.com/search?content_id=241619457&content_type=Article&match_order=1&q=%E5%85%89%E8%BD%B4&zhida_source=entity)与图像平面的交点为原点，x，y方向分别与像素坐标系的u,v方向一致。
4. 像素坐标系则是以图像的左上角为原点，u指向像素行的方向，v指向像素列的方向。

一个物体在世界坐标系的位置到像素坐标系的位置通常是通过，[世界坐标系](https://zhida.zhihu.com/search?content_id=241619457&content_type=Article&match_order=5&q=%E4%B8%96%E7%95%8C%E5%9D%90%E6%A0%87%E7%B3%BB&zhida_source=entity)  相机坐标系  图像坐标系  像素坐标系这个流程进行转换的。

---

## Intrinsics

内参描述的是**相机内部的成像几何关系**。

### Camera Matrix

通常表示为：

$$
K=
\begin{bmatrix}
f_x & 0 & c_x\\
0 & f_y & c_y\\
0 & 0 & 1
\end{bmatrix}
$$

其中：

| 参数    | 含义                        |
| ----- | ------------------------- |
| $f_x$ | x 方向焦距，通常以 pixel 为单位      |
| $f_y$ | y 方向焦距，通常以 pixel 为单位      |
| $c_x$ | 主点（Principal Point）的 x 坐标 |
| $c_y$ | 主点（Principal Point）的 y 坐标 |

例如一颗 4000 × 3000 的摄像头可能具有：

$$
K=
\begin{bmatrix}
2800 & 0 & 2000\\
0 & 2800 & 1500\\
0 & 0 & 1
\end{bmatrix}
$$

这里的 $2800$ 并不是说真实焦距是 2800 mm，而是：

> **折算到像素坐标系中的焦距。**

---

### Distortion

> 实际光线到达 Sensor 的位置 ≠ 理想针孔模型计算的位置 =》==non-linear camera model==

实际镜头通常存在畸变，因此相机标定除了 Camera Matrix，还需要估计畸变参数。

常见参数包括：
- 径向畸变：$k_1,k_2,k_3,\dots$
- 切向畸变：$p_1,p_2,\dots$

例如 OpenCV 中常见的形式：

$$
D=[k_1,k_2,p_1,p_2,k_3]
$$

因此实际进行相机标定时，通常所说的**内参**可能包括：

$$
\boxed{K+D}
$$

也就是：

> **Camera Matrix + Distortion Coefficients**

---

## Extrinsics

外参描述的是：

> **相机坐标系和世界坐标系之间是什么关系。**

通常表示为：

$$
[R|t]
$$

其中：

- $R$：3 × 3 旋转矩阵（Rotation Matrix）
- $t$：3 × 1 平移向量（Translation Vector）

世界坐标系中的一个点：

$$
P_w=
\begin{bmatrix}
X_w\\
Y_w\\
Z_w
\end{bmatrix}
$$

转换到相机坐标系：

$$
P_c=RP_w+t
$$

即：

$$
\begin{bmatrix}
X_c\\
Y_c\\
Z_c
\end{bmatrix}
=
R
\begin{bmatrix}
X_w\\
Y_w\\
Z_w
\end{bmatrix}
+t
$$

---
## Intrinsics + Extrinsics

这是计算机视觉中非常核心的一条公式：

$$
s
\begin{bmatrix}
u\\
v\\
1
\end{bmatrix}
=
K
[R|t]
\begin{bmatrix}
X_w\\
Y_w\\
Z_w\\
1
\end{bmatrix}
$$

假设空间中有一个点：

$$
P_w=(1,2,5)
$$

首先利用外参：

$$
P_c=RP_w+t
$$

得到它在相机坐标系中的位置：

$$
P_c=(X_c,Y_c,Z_c)
$$

然后进行透视投影：

$$
\begin{aligned}
x &= \frac{X_c}{Z_c} \\
y &= \frac{Y_c}{Z_c}
\end{aligned}
$$

最后利用内参：

$$
\begin{aligned}
u &= f_x x + c_x \\
v &= f_y y + c_y
\end{aligned}
$$


得到这个点在图像上的像素：

$$
(u,v)
$$

所以：

> **外参决定“这个 3D 点从相机看来在哪里”。**
> **内参决定“这个位置最终落到图像的哪个 pixel”。**

---

## Dual Camera

### Dual Camera Model

1. 两个相机光心在同一水平线上
2. 成像平面平行

![[camera 2026.excalidraw#^frame=rectified_camera|600]]


```log
Left Image                  Right Image

     ●                            ●
     │←────── disparity ─────────→│
```

这个位置差称为：

$$
d=u_L−u_R
$$

也就是：

> **Disparity（视差）**

在理想的双目模型中，深度可以表示为：

$$
Z=\frac{fB}{d}
$$

其中：

| 参数  | 含义              |
| --- | --------------- |
| $Z$ | 物体距离 / 深度       |
| $f$ | 焦距              |
| $B$ | Stereo Baseline |
| $d$ | 左右图像之间的视差       |

所以：

> **内参提供 $f$，外参提供 $B$，左右图像提供 disparity，最终得到深度。**

---

### Epipolar Constraint

> **极线约束解决的是：当我在一个相机里看到一个 2D 点时，它在另一个相机里“不可能出现在任意位置”，而只能落在一条特定的极线上。**

Stereo Matching 时候使用

![[camera 2026.excalidraw#^frame=epipolar_constraint|700]]

已知：
image 1, image 2, $p_1,K_1, K_2, R_{12}, t_{12}$
则：$\overline{{O_1}{O_2}}$,  $\overrightarrow{{O_1}{p_1}}$, $\overrightarrow{{e_2}{p_b}}$ 均可推算出
=》 **$p_1$已知，$p_2$一定在射线 $\overrightarrow{{e_2}{p_b}}$上, 反之亦然**


---
### Stereo Calibration

每个相机都有自己的内参：

$$
K_L,K_R
$$

以及各自的畸变参数：

$$
D_L,D_R
$$

两个相机之间还有一组非常重要的**相对外参**：

$$
R_{LR},T_{LR}
$$

它表示：

> **右相机坐标系相对于左相机坐标系的旋转和平移关系。**

#### Online Calibration

![[vo#Online Calibration]]

### Stereo Rectification

![[rectification#Basic]]

### Stereo Matching

---

## 和 Camera / EIS / OIS 的关系

从 Camera HAL / 视频算法的角度，可以这样理解：

| 概念             | Camera 中的意义                   |
| -------------- | ----------------------------- |
| **Intrinsics** | 相机自身的成像参数                     |
| $f_x,f_y$      | 焦距对应的 pixel 参数                |
| $c_x,c_y$      | Principal Point               |
| **Distortion** | Lens Distortion               |
| **Extrinsics** | Camera 与其他坐标系之间的关系            |
| $R$            | Camera Orientation            |
| $T$            | Camera Position / Translation |
| Stereo $R,T$   | 左右摄像头之间的相对姿态                  |
| Baseline       | Stereo 外参中的平移距离               |

---

## 多摄像头手机中的情况

对于手机上的多摄像头，例如：

- Wide
- Ultra Wide
- Tele
- Main Camera

每个 Camera 都有自己的：

$$
K_i,D_i
$$

不同 Camera 之间则存在相对的：

$$
R_{ij},T_{ij}
$$

可以理解成：

```
                    World
                      │
              ┌───────┴───────┐
              ↓               ↓
        Wide Camera       Tele Camera
              │               │
           K1, D1           K2, D2
              │               │
              └──── R,T ──────┘
                  Stereo
                Extrinsics
```

因此，在多摄像头系统中，经常会看到：

$$
K1,D1,K2,D2,R,T
$$

这基本就是一套完整的双目 / 多目相机标定参数。

---

## 一句话记忆

> **内参 = 相机“怎么看”世界。**
> 
> **外参 = 相机“在哪里看”世界。**

进一步可以记成：

```log
Intrinsics
    ↓
相机本身的成像模型
    ↓
K + D

Extrinsics
    ↓
相机与世界其他相机之间的空间关系
    ↓
R + T
```

对于双目：

```log
左相机：K_L + D_L
右相机：K_R + D_R
          │
          │ R + T
          ↓
      Stereo Geometry
          │
          ↓
       Disparity
          │
          ↓
        Depth
```

[^1]: [相机成像原理](https://zhuanlan.zhihu.com/p/690700014)
