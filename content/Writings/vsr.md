---
title: Video Super Resolution -VSR
type: area
status: active
domain: work
category: feature
priority:
review:
tags:
  - vsr
---

## 状态记录

### 2023.10.26

- DX-4 仅支持inline MCNR搭配 VSR
- FHD走inline有13~26mA的power增量, 4k下面Power增量很小 ![[vsr 2025.excalidraw#^frame=vsr-flow|600]]

- MediaTek Super Resolution (MSR)

### E.G. 4K 5x

1.  Inline Mode ![[vsr 2025.excalidraw#^frame=inline|900]]
2.  Non-inline Mode ![[vsr 2025.excalidraw#^frame=non-inline|900]]
3.  Mtk Official Intro

    ![[2023-10-26-10-35-12.png|600]]
    - 遗留问题: 伪色问题比较明显, 预期tuning可解
    - 上项场景:
      - EIS inline 场景可以直接上
      - EIS non-inline 场景下需要权衡Power增量 & 牺牲了DynamicMargin
        >     1. DX-4 只能支援inline MCNR 搭配 VSR
        >     1. FHD & 4K 都要支援的话，FHD也必须走inline。若有eis queue的话，power 会比non inline 高 (FHD30 inline power 比non-inline 大 13mA , 60fps 大26mA)
        >     1. 4k的话，inline和non-inline的Power目前是差不多的,  即4k下是否搭配VSR对power无太大影响
