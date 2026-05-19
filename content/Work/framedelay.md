---
title: Eis Framedelay
tags:
  - framedelay
  - eis
---

- XM MTK平台相机预研规划项
- MTK-EIS 60帧缓存

## Flow

![[60q 2025.excalidraw#^frame=flow|700]]

```mermaid
gantt
dateFormat        YYYY-MM-DD
title             Test Mermaid
excludes weekdays 2023-01-10

section 功能导通
    完成EIS基础上移                :done,     des1, 2023-09-20,2023-10-13
    导通EIS缓存帧               :active,   des2, after des1, 14d
    上移架构开启HBM             :         des3, after des2, 5d
    Future task2              :         des4, after des3, 5d

section 功能验证评估
```

![[60q 2025.excalidraw#^frame=flow_diagram|600]]

![[60q 2025.excalidraw#^frame=new_flow|600]]

```mermaid
classDiagram
class TPIData {
    +bool mIsValid
    +bool mPushOnly
    +RequestPtr mRequest
    +BasicImg mInput
    +TPIQData()
    +~TPIQData()
}
class BasicImg {
    +std::shared_ptr~IIBuffer~ mBuffer
    +BasicImg()
    +~BasicImg()
}
class TPINode {
    -queue~TPIQData~ mTPIQueue
}
BasicImg --* TPIData
```

## HBM #hbm

- android tag: `MTK_INFO_SUPPORTED_BUFFER_MANAGEMENT_VERSION`
- hal core tag:
  - `MTK_HALCORE_SUPPORT_HAL_BUFFER_MANAGEMENT`

strategy: Preparatory/Immediate/Cached

![[60q 2025.excalidraw#^frame=hbm_flow|500]]

Preparatory: request一下去就申请buffer Immediate: 检测到没有带appOutBuffer, 就会立即去拿buffer

填写app-buffer的位置是哪儿? MTK-HAL

producer & confumer 总的限制为64块

FHD下面增量为2-3 mips

## 设计思路

在EIS内部实现缓存帧功能

- 录像结尾的30帧需要设置nodeProperty为 `CONCURRENCY_MODE`, 才能一帧返回多帧数据

## 60帧缓存帧

1. fwk的bufferQueue `vendor.fwk.stream.record.maxBuffer`
1. mivi的bufferQueue `mialgoengine/MiaBufferManager.h` : `MAX_BUFFER_QUEUE_DEPTH`
1. eisqueue `vendor.debug.tpi.s.his.qcount`
   - ![[eisq 2025.excalidraw|eis queue flow|600]]
   - describe for the above flow

     | stage | function             | method 1 | method 2 |
     | ----- | -------------------- | -------- | -------- |
     | 1     | only push            | 6 - 15   | 6 - 15   |
     | 2     | push & pop           | 16 - 20  | 16 - 20  |
     | 3     | notified (red point) | 21       | 20       |
     | 4     | only pop             | >21      | >20      |
