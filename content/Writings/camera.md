---
title: Camera Params
type: area
domain: work
category: algorithm
status: active
review:
tags:
---

在计算机视觉 / 相机标定中，可以简单理解为：

> **内参（Intrinsic）：相机自己是什么样的。**  
> **外参（Extrinsic）：相机在世界里处于什么位置、朝什么方向。**


几个坐标系
1. 相机坐标系
2. 世界坐标系
3. 像素坐标系

---

## 1. 相机内参 Intrinsics

内参描述的是**相机内部的成像几何关系**。

### 1.1 Camera Matrix

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

### 1.2 畸变参数 Distortion

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

## 2. 相机外参 Extrinsics

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

## 3. 一个非常直观的理解

假设在房间里面放一台相机。

### 内参回答：

> **“这台相机本身是什么样？”**

例如：

- 焦距是多少？
- 图像中心在哪里？
- 像素是否存在非正方形问题？
- 镜头有多大畸变？

这些都是**内参**。

---

### 外参回答：

> **“这台相机现在放在哪里？”**

例如：

- 相机距离地面 1.5 m
- 向左旋转 20°
- 向下俯视 10°
- 相机在房间坐标系中的位置是多少？

这些都是**外参**。

---

## 4. 内参 + 外参如何一起使用？

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

也就是：

**世界坐标 → 相机坐标 → 图像坐标**

整个过程可以理解为：

```log
          外参
世界坐标 ───────→ 相机坐标
                    │
                    │ 内参
                    ↓
                 图像坐标
```
---
## 5. 举个具体例子

假设空间中有一个点：$$P_w​=(1,2,5)$$
首先利用外参：$$P_c​=RP_w​+t$$
得到它在相机坐标系中的位置：$$P_c​=(X_c​,Y_c​,Z_c​)$$
然后进行透视投影：
$$x = \frac{X_c}{Z_c}$$

$$y = \frac{Y_c}{Z_c}$$​

最后利用内参：
$$u=f_x​x+c_x​$$

$$v=f_y​y+c_y$$

得到这个点在图像上的像素：$$(u,v)$$
所以：

> **外参决定“这个 3D 点从相机看来在哪里”。**
> **内参决定“这个位置最终落到图像的哪个 pixel”。**

---

## 6. 双目标定中的内参和外参

对于双目相机：

```log
        Left Camera
             │
             │
             │   R, T
             │ ───────────→
             │
             │
        Right Camera
```

每个相机都有自己的内参：$$K_L​,K_R$$​

以及各自的畸变参数：$$D_L​,D_R$$​
两个相机之间还有一组非常重要的**相对外参**：$$R_{LR}​,T_{LR}$$​

它表示：

> **右相机坐标系相对于左相机坐标系的旋转和平移关系。**

### 6.1 Baseline

例如：

$$
T =
\begin{bmatrix}
120 \\
0 \\
0
\end{bmatrix}
\mathrm{mm}
$$

意味着两个相机之间的基线距离约为：

$$B=120mm$$

这个距离就是 Stereo Vision 中非常重要的：

> **Baseline（双目基线）**


---

## 7. 为什么双目可以计算深度？

经过双目标定和极线校正之后，同一个物体在左右图像中的位置会存在差异：

```log
Left Image                  Right Image

     ●                            ●
     │←────── disparity ─────────→│
```

这个位置差称为：
$$d=u_L​−u_R$$​
也就是：

> **Disparity（视差）**

在理想的双目模型中，深度可以表示为：

$$Z=\frac{fB}{d}​$$​

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

## 8. 和 Camera / EIS / OIS 的关系

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

## 9. 多摄像头手机中的情况

对于手机上的多摄像头，例如：

- Wide
- Ultra Wide
- Tele
- Main Camera

每个 Camera 都有自己的：

$$K_i​,D_i$$

不同 Camera 之间则存在相对的：

$$R_{ij}​,T_{ij}$$​

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

$$K1​,D1​,K2​,D2​,R,T$$

这基本就是一套完整的双目 / 多目相机标定参数。

---

## 10. 一句话记忆

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
相机与世界 / 其他相机之间的空间关系
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