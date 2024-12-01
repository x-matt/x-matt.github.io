>Motion compensation temporal filtering

[L2 MCTF功能pipeline添加方法](https://wiki.n.miui.com/pages/viewpage.action?pageId=588381551)

MCTF (Motion compensation temporal filtering) mode can provide high-quality low-power temporal  noise filter for both preview and video recorder.

Mode                 | Flow          | NR Algo Name | Confige HW Mode
---------------------|---------------|--------------|------------------------------------
Still(Single-Frame)  | capture       | -            | BPS + IPE
^                    | preview/video | -            | IFE + IPE
Dynamic(Multi-Frame) | capture       | MFNR         | BLEND (BPS + IPE) + POST (BPS +IPE)
^                    | preview/video | MCTF         | IFE + IPE

## 确认Align模式

```bash
adb root
adb shell setprop persist.dbg.keep_debugfs_mounted true
adb reboot
adb root
adb remount
adb shell mount -t debugfs none /d
adb shell "echo 0x4 > /d/msm_cvp/fw_level"
adb shell logcat -b kernel -c
adb shell logcat -b kernel > xxxx(file path)\log.txt

# Using image based align
# Using Gyro based align
```

## 参考资料

1. [How to Check MCTF Alignment Type on  SM8450](https://security.feishu.cn/link/safety?target=https%3A%2F%2Fdocs.qualcomm.com%2Fbundle%2FKBA-221106062412%2Fresource%2FKBA-221106062412.pdf&scene=ccm&logParams=%7B%22location%22%3A%22ccm_default%22%7D&lang=zh-CN)
