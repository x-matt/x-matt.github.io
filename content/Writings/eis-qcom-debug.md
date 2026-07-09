---
title: Eis Qcom debug
type: area
status: active
domain: work
category: debug
priority:
review:
tags:
  - eis
  - qcom
---

## 1. Debug命令

```bash
adb wait-for-device root
adb wait-for-device remount
adb shell "echo EISv3GyroDumpEnabled=1 >> /vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv2OperationMode=2 >> /vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv3OperationMode=2 >> /vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo fovcEnable=0 >> /vendor/etc/camera/camxoverridesettings.txt"

# dump sensorData log
adb shell setprop vendor.debug.camera.overrideLogLevels 0x1FF
adb shell "echo EISv2InputDumpLogcatEnabled=1 >> /vendor/etc/camera/eisoverridesettings.txt"

# ncs log
adb shell setprop persist.vendor.camera.logInfoMask 0x800002
adb shell setprop persist.vendor.camera.logVerboseMask 0x800000
```

## 2. EIS开关命令

### 2.1 Qcom-EIS

```bash
# disableQcomEIS
adb shell "echo EISv3OperationMode=2 >>/vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv2OperationMode=2 >>/vendor/etc/camera/eisoverridesettings.txt"
adb reboot

# enableQcomEIS
adb shell "echo EISv3OperationMode=0 >>/vendor/etc/camera/eisoverridesettings.txt"
adb shell "echo EISv2OperationMode=0 >>/vendor/etc/camera/eisoverridesettings.txt"
adb reboot
```

## 3. Margin

| Platform | Relationship             | e.g.         | Type        |
| -------- | ------------------------ | ------------ | ----------- |
| Qcom     | input(1-margin) = output | margin = 0.2 | InputMargin |

## 4. WPE-dump

`vendor.camera.p2tpipedump.enable`

## 5. 参考资料

- [Wiki: multframe change in 8450](https://wiki.n.miui.com/display/~liukun7/multframe+change+in+8450)
- [Wiki: MFHDR架构介绍](https://wiki.n.miui.com/pages/viewpage.action?pageId=561357565)
