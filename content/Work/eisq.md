---
title: Eis FrameDelay
tags:
  - eis
  - mivi
---

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
