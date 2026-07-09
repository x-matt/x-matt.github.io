---
title: Zero Shutter Lag - ZSL
type: area
status: active
domain: platform
priority:
review:
tags:
  - mivi
  - zsl
---

### ZSLQ

1. 功能目标
   1. 预览的RAW数据缓存
   2. 拍照的ZSL选帧策略
2. TBM: CHITargetBufferManager #tbm
   1. TBM 可以管理 Metadata/ExternalBuffer/InternalBuffer
   2. ZSLQ包含有两个TBM，一个管理 RAW-Buffer(InternalBuffer)，一个管理对应的Meta
3. Qcom ZSLQ Intro
   ![[structure 2025.excalidraw#^frame=Qcom ZSLQ|500]]
