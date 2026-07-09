---
title: SAT Debug
type: area
status: active
domain: work
category: debug
priority:
review:
tags:
  - sat
---

## SensorCtrl

## SAT

### Command

> `odm/plugins/general/misat/include/sat_debug.h`

| Domain | Type          | Command                                            | Remark                    |
| ------ | ------------- | -------------------------------------------------- | ------------------------- |
| Algo   | log           | `adb shell setprop persist.vendor.sat.log.level 3` | `miSAT`                   |
|        | dump          | `adb shell setprop persist.vendor.sat.dump.flag 1` | `/data/vendor/camera/sat` |
| Plugin | log           | `adb shell setprop vendor.debug.sat.loglevel 1`    |                           |
|        | dump buffer   | `adb shell setprop vendor.debug.sat.dump.buffer 1` |                           |
|        | dump I/O info | `adb shell setprop vendor.debug.sat.dump.out 1`    |                           |
|        | bypass node   | `adb shell setprop vendor.debug.sat.bypass 1`      |                           |

- Log Keywords: `miSAT|MI_SAT`

### Algo Dump desc

- AF
- FD
- Faces
- Gyro
- OIS
- TOF
- output.csv

## ZA #za

| Domian                     | Type               | Command                                                                                                                            | Remark                  |
| -------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| SW                         | dump               | `adb shell setprop persist.vendor.ZA.dumpin.flag 1`                                                                                |                         |
|                            | log                | `adb shell setprop persist.vendor.ZA.log.level 3`                                                                                  |                         |
|                            | opt bypass         | `adb shell dumpsys activity service com.platform.cameramind/com.platform.cameramind.CameraMindService -algoByPassControl FUSION 2` | high temperature bypass |
| Alog                       | dump               | `adb shell setprop persist.vendor.ZA.dumpin.flag 1`                                                                                | `data/vendor/camera/za` |
| - Keywards: `zoomanimation | MI_ALPHA_BLENDING` |                                                                                                                                    |                         |

## Problem

### FOV

> O12 keywords

| Module     | Keyword |
| ---------- | ------- |
| SensorCtrl |         |
| SAT        |         |
| VSE        |         |
| EIS        |         |
| WPE        |         |

`cropReions.*sensorId|sensorCtrlCrop.*sensorCtrlPostCrop|crop info: sensorId|roi info: sensorId|final dst zoom roi|buffer size.*warp out size|Get ROI|PerFrameWPE`
