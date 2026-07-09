---
title: NDD/ODT Auto Check
type: area
status: active
domain: platform
priority:
review:
tags:
  - ndd
  - mtk
---

> [!todo]
>
> - [x] capture (lpnr/mfnr) support jpegR

## Timeline

| Docs Name       |
| --------------- |
| GitLab          |
| 自动化规划           |
| O12 series 使用说明 |
| Capture相关适配     |

## Script Adaptation

### 0117

| Type    | Desc           |
| ------- | -------------- |
| FEX ID  | REQ30040715728 |
| Feature | MFNR & LPNR    |

1. command
   ```bash
   # 强开MFNR命令:
   adb shell setprop vendor.debug.camera.specshot.enable 0
   adb shell setprop persist.vendor.camera.forceMFNR 1
   # 强开LPNR命令:
   adb shell setprop vendor.debug.camera.specshot.enable 0
   adb shell setprop persist.vendor.camera.forceMFNR 0
   ```
