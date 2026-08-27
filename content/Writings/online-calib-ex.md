---
title: Online Continuous Stereo Extrinsic Parameter Estimation
type: area
domain: knowledge
category: geometry
status:
review:
tags:
  - paper
  - calibration
  - online
---
1. 解决的问题: **目相机已经做过离线标定，但真实使用过程中两颗 Camera 的相对姿态会慢慢发生变化，导致原来的 stereo extrinsic calibration 失效；论文希望在运行过程中，仅利用每一帧的稀疏 stereo correspondence，实时估计这个变化**
2. 解决方案核心：**把“Stereo Extrinsic Re-calibration”转换成一个“每一帧利用 stereo correspondence 最小化 Epipolar Error 的 5-DOF 优化问题”，然后再利用 Kalman Filter 对这些 noisy per-frame estimates 做时序平滑。**

已知: $K, R, t$
求: $R_{realtime}$（不包含平移方向的参数）
===> 求解过程中是不需要$P$参与的

## 自由度

单个camera为 6DOF，3个旋转+3个平移，那么两个camera一共有6个rot-DOF+6个trans-DOF
- 该论文仅优化6个rot-DOF
- 因为baselinse方向上，2个camera的rot是一致的，所有固定baseline，则剩5个rot-DOF来优化

## 创新优化方案

old: 2D correspondence -> 3D points -> reprojection -> BA -> $T$
new: Sparse Stereo Correspondences -> Epipolar Error -> Extrinsic Correction (**no temporal constraints, 帧与帧之间独立**)

## Pipeline

![[calibration 2026.excalidraw#^frame=online_cam_calib_extrinsic]]