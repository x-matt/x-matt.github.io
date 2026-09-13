---
title: Stitching
type: area
domain: knowledge
category: vision-task
status: active
review:
tags:
  - stitching
---
## 横纵分析

[[video stitching]]

## Algo Pipeline
![[cv 2025.excalidraw#^frame=stitching_pipeline|150]]

## 旋转的表示方法



| 表示              | 本质   | 优点                   | 缺点                | 常见用途                    |
| --------------- | ---- | -------------------- | ----------------- | ----------------------- |
| Euler Angles    | 3个角度 | 人容易理解                | 无Gimbal Lock、顺序敏感 | UI、debug、参数配置           |
| Rotation Matrix | 3x3  | 直接做坐标转换              | 9个参数有冗余           | 几何计算、Warp               |
| Quaternion      | 4个参数 | 稳定、无Gimbal Lock、适合插值 | 不直观               | IMU、Tracking、Rose、SLERP |


### Rotation Matrix
$R\in SO(3)$

### Euler Angles

将3D-rotation拆成 roll-pitch-yaw
- 有Gimnal Lock
### Quaternion

$q=(w,x,y,z)$
$w$ 是scale part
$(x,y,z)$是vector part


## Flow

Stitching
- Global Geometry
	- Rotation
	- Extrinsic
- Parallax
	- Translation
	- Depth
	- Optical Flow/Local Warp
- Image Fusion
	- Seam
	- Exposure
	- Blending