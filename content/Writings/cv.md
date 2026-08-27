---
title: Computer Vision
type: area
domain: knowledge
category: cv
status: active
review:
tags:
  - skyview
---

## Skyview

| Level           | Details                                                                                                            | Desc             |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------- |
| Problem Level   | - Geometry<br>- Motion<br>- Perception<br>- Image processing                                                       | 解决的问题属于什么范围      |
| Method Level    | - Classical<br>- Learning-based<br>- Hybrid                                                                        | 解决问题时候用的方法属于什么范围 |
| Algorithm Level | - SIFT<br>- Optical Flow<br>- Kalman Filter<br>- ......                                                            | 具体解决问题的方法逻辑      |
| Task Level      | - Stabilization<br>- Stitching<br>- HDR Imaging<br>- Depth Estimation<br>- 3D Reconstruction<br>- Object Detection | 完成什么目标           |
| Product Level   | - EIS<br>- HDR Video<br>- Panorama Mode<br>- Night Video<br>- ......                                               | 产品能力             |


![[cv 2025.excalidraw#^frame=2d_3d|600]]

###  2D->3D

> **3D视觉问题通常围绕 Geometry、Pose、Scale、Calibration 这些未知量/参数展开，而通过多视角观测、物理先验和额外传感器提供约束，再利用 Optimization（如 BA）联合求解。**

| 名称              | 本质                    | 典型变量                             | 是不是未知量？       |
| --------------- | --------------------- | -------------------------------- | ------------- |
| **Geometry**    | 场景几何结构                | $P_i=(X,Y,Z)$                    | ✅ 通常是         |
| **Pose**        | 相机的位置和姿态              | $T => R,t$                       | ✅ 通常是         |
| **Calibration** | 相机模型参数                | $K,\ distortion,\ R_{LR},T_{LR}$ | ⚠️ 可以已知，也可以未知 |
| **Scale**       | 整个 reconstruction 的尺度 | $s$                              | ⚠️ 单目中通常存在歧义  |

默认输入都包含有 2D observations

| Problem                | Known                       | Unknown                | Solver                   |
| ---------------------- | --------------------------- | ---------------------- | ------------------------ |
| Stereo Reconstruction  | $K_L​,K_R​,R_{LR}​,T_{LR}$​ | $P$                    | Triangulation            |
| PnP                    | $K,P$                       | $T$                    | PnP                      |
| Monocular SfM          | $K$                         | $T,P$ (重点关注$P$)        | SfM + Triangulation + BA |
| Self-Calibration + SfM | -                           | $K,T,P$                |                          |
| VO                     | $K$                         | $T_t, P_i$ (重点关注$T_t$) |                          |
| VIO                    | $K,s$                       | $T_t, P_i$ (重点关注$T_t$) |                          |


| 方法          | 需要什么                  | 能否得到3D    |
| ----------- | --------------------- | --------- |
| 单目 + 2D点    | 内参$K$                 | ❌ 只有射线    |
| 单目 + 已知深度   | 内参 + 深度               | ✅         |
| 双目          | 左右内参$K_L,K_R$，外参$R,T$ | ✅         |
| 多目          | ≥2个不同视角相机 + 标定        | ✅         |
| 单目 + 已知平面   | 内参 + 平面约束             | ✅         |
| 单目 + 已知3D尺寸 | 几何先验                  | ✅         |
| 单目 + 深度网络   | learned prior         | ✅，但依赖模型先验 |
| 单目 + 时序运动   | 多帧                    | ✅/尺度可能不确定 |


| 输入                   | 能否估计相机参数                             | 3D尺度                     | 能否得到3D Structure |
| -------------------- | ------------------------------------ | ------------------------ | ---------------- |
| 单目 + 多帧              | 可以做 Self-Calibration                 | ❌ 无绝对尺度                  | ✅ 可以             |
| 双目 + 多帧              | 可以做 Self-Calibration[[online-calib]] | **如果 baseline 已知 → 有尺度** | ✅                |
| 单目 + 多帧 + 已知尺度信息     | 可以                                   | ✅                        | ✅                |
| 单目 + 多帧 + 额外 3D/尺度约束 | 可以                                   | ✅                        | ✅                |



## Problems

![[cv 2025.excalidraw#^frame=CV_problems|600]]

## Methods

### For Geometry
![[life.base#Geometry]]

#### Calibration

- Offline stereo calibration
- Online Calibration
**两篇online优化方案对比**

| div                          | [[online-calib-ex\|Online Extrinsic]] | [[online-calib\|Online Calibration]] |
| ---------------------------- | ------------------------------------- | ------------------------------------ |
| 解决什么                         | Stereo 外参漂移                           | BA 优化太慢                              |
| 优化对象                         | Stereo extrinsic                      | Structure + Camera Motion            |
| 核心约束                         | Epipolar constraint                   | Reprojection error                   |
| 是否需要 3D structure            | **不需要**                               | 需要                                   |
| 是否需要 temporal correspondence | **不需要**                               | 通常需要                                 |
| 是否做 BA                       | **不做**                                | 做                                    |
| 状态维度                         | 5 DOF                                 | 通常更多                                 |
| 时序处理                         | Kalman Filter                         | 分阶段 optimization                     |
| 核心思想                         | **把 calibration 变成轻量状态跟踪**            | **把 BA 拆解成更快的优化流程**                  |

>[!tips] 视觉系统向 realtime 优化的两个方向
>1. 重新思考：到底需要优化哪些变量、需要哪些约束、哪些变量其实可以直接消掉[[online-calib-ex]]
>2. 把原来的 optimization “算得更快”[[online-calib]]


|方向|核心思想|典型方法|
|---|---|---|
|① **减少变量**|不优化不必要的变量|固定 intrinsics、固定 baseline、5DOF|
|② **改变优化问题**|用更简单的约束替代复杂优化|Epipolar error 替代 3D + reprojection|
|③ **分解优化**|把大问题拆成多个小问题|BA → Structure / Motion / Projection|
|④ **降低数据量**|不处理所有 pixels / features|Sparse feature、keyframe、ROI|
|⑤ **降低计算精度/复杂度**|单次计算做得更便宜|FP16、INT8、近似算法、lookup table|
|⑥ **降低计算频率**|不需要每帧都重新算|KF、keyframe、multi-rate|
|⑦ **系统级并行/硬件加速**|算法本身不变，但让执行更快|GPU/NPU/DSP、pipeline、异步|

### For Reconstruction
![[life.base#Reconstruction]]

- SFM: 相机运动和稀疏结构
- MVS: 已知相机几何下的稠密结构
![[cv 2025.excalidraw#^frame=reconstruction_flow|800]]

For Motion

![[life.base#Motion]]
## Sparse & Dense 划分

| -              | Sparse             | Dense              |
| -------------- | ------------------ | ------------------ |
| Feature        | 少量 feature         | 几乎每个 pixel         |
| Depth          | 少量 depth points    | 每个 pixel 一个 depth  |
| Stereo         | 少量匹配点              | 每个 pixel disparity |
| Tracking       | 少量 feature tracks  | 大量/全部 pixel        |
| Reconstruction | Sparse Point Cloud | Dense Point Cloud  |
| 计算量            | 通常较低               | 通常较高               |
| 数据量            | 小                  | 大                  |

>**Sparse = “只关心一些点”。**  
>**Dense = “想知道整张图”。**


## Key Stage

### Triangulation

已知两个投影点和相机参数，求3D点
$$
x_1, x_2, R_1, t_1, R_2, t_2 => X
$$

### Bundle Adjustment

Triangulation 中的输入 $x_1, x_2, R_1, t_1, R_2, t_2$ 中包含有不准确的信息的话，会导致3D point $X$ 也不准确
BA主要优化 $R_1, t_1, R_2, t_2, X$