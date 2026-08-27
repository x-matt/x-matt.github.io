---
title: Online Stereo Camera Calibration From Scratch
type: area
domain: knowledge
category: geometry
status: active
review:
tags:
  - paper
  - calibration
  - online
---
[Papaer-pdf](https://www.mrt.kit.edu/z/publ/download/2017/rehder_iv17.pdf)
What problem: 
1. Camera 在使用过程中，参数可能发生变化
2. 已有的self-calibration 无法实现**real-time**校准

>**解决方案： 它没有试图让“一个巨大的 BA”跑得足够快，而是先用便宜的 Linear Triangulation / Motion Estimation 得到靠谱的 state，再用小规模 Optimization 逐步释放 X,T,K,D,TLR​ 这些变量，最后让 Full BA 只负责少量 refinement。**

基于单目camera model，生成一个方程和相关约束，此时不足够找出3D点
- a,b,c...... 这些点之间，**$K,T$相同，$P$不同**
- 增加为双目：对之前的方程可以进一步增加约束，此时可以找出3D点，
	- $a_L, a_R$这对点之间，**$K,T$不同，$P$相同**
	- 在**空间域**上，对所有的点都存在上述的约束，使用BA来得出最优参数，实现真实值与理论值的最小误差
- 增加多帧：通过**时域维度**，进一步增加数据样本数量，来加速提升最优参数的获取
	- $a^{t}, a^{t+1}, a^{t+2}...$这些点之间，**$K,P$相同，$T$不同**

![[calibration 2026.excalidraw]]

## 6-Step Pipeline

> 输入为 Stereo Images

### Scene Structure - space

输出为$P$

假设
1. stereo calibration 完成，$K$已知
2. stereo 已经 rectified，$T$已知
基于双目模型，计算出$P$
![[camera 2026.excalidraw#^frame=rectified_camera|500]]
>[!tip] 重要提示
>$B$需要是已知的，这样整个画面才是有固定尺度的

### Motion Estimation - space

已知: $K, P^{k-1}$，求$T^{k}$

- 多帧之间，同一个投影点之间 $K, P$相同，$T$不同，所以$P^{k}$与$P^{k-1}$是相同的
- 基于同一帧内的多个keypoint，做非线性优化，求出$T^{k}$
这里面相当于只考虑当前帧和上一帧，这样相当于**只优化这两帧之间的motion**
- 相较于优化所有未知量，要节省很多

一维叠加计算优化，遍历所有时序
for(i = 0; i<t_max; i++) {
	for (j = 0; j<point_max_num; j++) {
		$e_j$ 
	}
	$T_i$
}
### Feature Selection

避免过拟合，避免以下
1. bad feature
2. wrong match
3. moving object
4. poor localization
	1. Image Bucketing，避免feature集中在某给局部未知

### Structure + Motion Optimization - space+time

已知$K,T^{1->n},P$, 但都是初步估计值，先把geometry搞稳定，再优化camera model
- 固定$K$，优化 $T, P$
- 进行完整的BA, 所有时间内所有的点，都进行BA

二维叠加计算优化
for(i = 0; i<t_max; i++) {
	for (j = 0; j<point_max_num; j++) {
		$e_{ij}$
	}
}

### Projection Optimization - space+time

固定$T^{1->n},P$, 优化$K$

一维叠加计算优化
for(i = 0; i<t_max; i++) {
	for (j = 0; j<point_max_num; j++) {
		$e_{ij}$
	}
}
$K$

### Full Calibration - space+time

$K,T^{1->n},P$ 都不固定，一起进行优化

### Summary

| Step                  | Structure (X) | Motion (T) | Intrinsic/Distortion/Stereo Extrinsic (K) |
| --------------------- | ------------: | ---------: | ----------------------------------------: |
| 1. Scene              |             ✅ |          ❌ |                                        固定 |
| 2. Motion             |            固定 |          ✅ |                                        固定 |
| 3. Feature            |             — |          — |                                         — |
| 4. Structure + Motion |             ✅ |          ✅ |                                        固定 |
| 5. Projection         |        固定/弱优化 |         固定 |                                         ✅ |
| 6. Full Calibration   |             ✅ |          ✅ |                                         ✅ |
