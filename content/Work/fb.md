---
title: Face Beauty
type: area
status: active
domain: feature
priority:
review:
tags:
  - fb
---

## FaceBeauty

### sm8850 - mivi

| Stage      | Func                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| Init       | initialize()<br>-> init()                                                                                                  |
| Processing | isEnable<br>-> GetAlgoParams() // get fd_count<br>----> GetBeautyFeatureParams()                                           |
|            | processRequest()<br>-> GetFrameInfo()<br>-> GetFaceFeatureParams()<br>-> processBuffer()<br>----> SetPreviewBeautyParams() |
| Uninit     | uninit()                                                                                                                   |
|            | destroy()                                                                                                                  |
