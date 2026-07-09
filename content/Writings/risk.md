---
title: Risk
type: project
status: active
domain: work
category: feature
priority:
review:
tags:
  - livp

---

- 验证机型：O1
- 验证版本：2025/02/08 daily

patch:

| name              | property                                        | Default Value |
| ----------------- | ----------------------------------------------- | ------------- |
| maxBufDepth       | `persist.vendor.camera.algoEngine.maxBufQDepth` | 50            |
| plugin delayCount | `vendor.debug.livephoto.delaycount`             | 45            |
| fwk depth         | `vendor.camera.debug.lvcount`                   | 48            |

## Log Filter

| Info                  | Command                                                                      |
| --------------------- | ---------------------------------------------------------------------------- |
| delay node 缓存帧数量 | `DELAY_NODE\|set mVideoStop to`                                              |
| ipe/mis node耗时      | `DumpNodeProcessingTime`                                                     |
| plugin 耗时           | `SatPreview_YuvEISInstance1.*Plugin processRequest spend time\|MISV4.*cost=` |
