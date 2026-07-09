---
title: Android Structure
type: area
status: active
domain: android
priority:
review: daily
tags:
  - skyview
---

![[structure 2025.excalidraw#^frame=Android Abstract|600]]

| Abstract | Factory          | Android              | Desc         |
| -------- | ---------------- | -------------------- | ------------ |
| 1-stage  | Factory          | ICameraProvider      | only one     |
| 2-stage  | Workshop         | ICameraDevice        | multi or one |
| 3-stage  | Production Cycle | ICameraDeviceSession | multi or one |

- Factory的最终产物是 Product
- CameraHal3的最终产物是 Image
