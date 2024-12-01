## APP

1. 拉apk
`adb pull system/priv-app/MiuiCamera/MiuiCamera.apk`

1. push apk

```bash
adb shell umount -l /product
adb root
adb remount
adb push MiuiCamera.apk /product/priv-app/MiuiCamera/
adb reboot
```

## [Sanity](https://wiki.n.miui.com/pages/viewpage.action?pageId=411582753)

```bash
wget http://cnbj1-fds.api.xiaomi.net/camera-devtest/00/apks/install_apk.sh -O install_apk.sh
chmod +x install_apk.sh
./install_apk.sh device-Num
```

## Upload

### MTK

```bash
# mtkcam3
git push ssh://matao3@gerrit.pt.mioffice.cn:29418/alps/vendor/mediatek/proprietary/hardware/mtkcam3 HEAD:refs/for/bsp-ares-r --no-thin
# mtkcam
git push ssh://matao3@gerrit.pt.mioffice.cn:29418/alps/vendor/mediatek/proprietary/hardware/mtkcam HEAD:refs/for/bsp-ares-r --no-thin
```

## 进程

### MTK进程

`ps -A |grep camera*`

USER(用户)   | PID(进程) | PPID(父进程)   | VSZ(虚拟内存)     | RSS(常驻内存)    | WCHAN | ADDR | S | NAME
-------------|-----------|----------------|---------|--------|-------|------|---|-------------------
cameraserver | 1001      | 1 - init       | 62912   | 25532  | 0     | 0    | S | cameraserver
cameraserver | 1088      | 1 - init       | 3694748 | 213992 | 0     | 0    | S | camerahalserver
u0_a76       | 25237     | 712 - zygote64 | 7922872 | 336608 | 0     | 0    | S | com.android.camera
