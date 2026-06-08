---
title: Synckey
aliases:
  - Sync Key Problem
tags:
  - debug
---

关键字： `MTK_HALCORE_INFO_SYNC_KEY|infoSyncKey|instance for syncKey|deviceBridge for syncKey`

### 2026/04/01

```bash
# 1、第一个回灌区先来 config，Creating new instance for syncKey 38
7442273 03-05 11:25:31.790 1047 16454 31544 D MTKHAL/PostProcDevSessionImp: MTKHAL/PostProcDevSessionImp(31544)[configureStreams] infoSyncKey = 0x26
7442276 03-05 11:25:31.790 1047 16454 31544 D MtkCam/MtkDeviceBridge: [getDeviceBridge] Creating new instance for syncKey 38
# 2、收图区来config，对应的sync key 是38，正常
7446440 03-05 11:25:31.834 1047 16454 18144 D mtkcam-dev3-utils: [endConfigureStreams] StreamId:65628, override Format:0x2203, DataSpace:0x8c20000, Size:(4096,3072), BufPlanes:{count:1, (sizeInBytes,rowStrideInBytes)=(22020096,7168), }, Results.count:2
7446469 03-05 11:25:31.834 1047 16454 18144 D MtkCam/MtkDeviceBridge: [getDeviceBridge] Returning existing instance for syncKey 38
# 3、第一个回灌区close
7456510 03-05 11:25:31.947 1047 16454 31554 D VRP-P2ANODE: [uninit](VRP0) uninit
7457038 03-05 11:25:31.955 1047 16454 31554 I VRP-P2ANODE: [uninit](VRP0) disable special memory in SMVR close
# 4、第2个回灌区又来config，带sync key =38
7461055 03-05 11:25:32.020 1047 16454 31554 D MTKHAL/PostProcDevSessionImp: MTKHAL/PostProcDevSessionImp(31554)[configureStreams] infoSyncKey = 0x26
7461057 03-05 11:25:32.020 1047 16454 31554 D MtkCam/MtkDeviceBridge: [getDeviceBridge] Returning existing instance for syncKey 38
# 5、收图区close，Releasing deviceBridge for syncKey=38，销毁收图区的resource
7460837 03-05 11:25:32.019 1047 16454 17682 D mtkcam-dev3: [4-session::close] tryrun +
7461564 03-05 11:25:32.023 1047 16454 9182 D MtkCam/MtkDeviceBridge: [releaseDeviceBridge] Releasing deviceBridge for syncKey=38
# 6、第2个回灌的vrp process request，由于对应收图的resource 已经被销毁了，拿不到gain map 触发asset。
7463201 03-05 11:25:32.039 1047 16454 16936 F MtkCam/P2G/GImg: [acquire]get invalid parameters!!! query_idx(0x0), mapIdx(8) (acquire){#582:vendor/mediatek/proprietary/hardware/mtkcam-core/feature/core/featurePipe/p2g/common/GImgImp.cpp}
```
