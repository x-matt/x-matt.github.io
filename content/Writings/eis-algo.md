---
title: Eis Algorithm
type: area
domain: knowledge
category: vision-task
status: active
priority:
review:
tags:
---

## Gyro Based

Digital Video Stabilization and Rolling Shutter Correction using Gyroscopes

![Digital Video Stabilization and Rolling Shutter Correction using Gyroscopes](https://www.youtube.com/watch?v=I54X4NRuB-Q)

解决的现象：camera motion -> image motion -> video shake
解决的思路：**重新生成一个“虚拟相机轨迹”，让它比原始相机运动更加平滑**


1. video stabiliztion: 3 stages
	1. camera motion estimation
	2. motion smoothing (actual camera motion)
	3. [[warping|image warping]]
2. rolling shutter correction: 3 stages
	1. camera motion estimation
	2. motion smoothing
	3. [[warping|image warping]] (actual camera motion)

### 什么 EIS 可以主要只处理 Rotation

- Gyro → 角速度 → **积分一次** → 角度
- Accelerometer → 加速度 → **积分两次** → 位移
gyro 的累计误差更小

近处物体和远处物体产生的 image motion 不一样
- 所以如果相机发生明显 translation：$Image Motion \neq Single Global Warp$, 需要额外指导 $Depth(X)$


1. eis 本身的效果实现可以用一个透视变换矩阵 $H$ 来表示
2. rsc因为每行的$H$ 是不同的，依赖$\Delta t$ 算出每行的矩阵，所以使用Warp Grid 更简单通用
3. eis+ldc+rec 通过warp grid，可以统一到一个维度里面传给后处理，硬件基于grid做线性插值

## Algo Pipeline

![[cv 2025.excalidraw#^frame=eis_pipeline]]