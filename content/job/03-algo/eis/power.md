## M16T 评估时候的开关对比命令

1. set EISMargin 0
```bash
adb shell setprop vendor.debug.scenario.s.eisMargin 0
adb shell setprop vendor.vidhance.preview.increasedsize 0
adb shell setprop vendor.vidhance.video.increasedsize 0
# back to the default
adb shell setprop vendor.debug.scenario.s.eisMargin 25
adb shell setprop vendor.vidhance.preview.increasedsize 1
adb shell setprop vendor.vidhance.video.increasedsize 1
```

2. set Record latency 0
```bash
adb shell setprop vendor.debug.scenario.s.eisQCount 0
adb shell setprop vendor.vidhance.video.vs.latency 0
# back to the default
adb shell setprop vendor.debug.scenario.s.eisQCount 30
adb shell setprop vendor.vidhance.video.vs.latency 30
```

3. force close FaceBeauty
```bash
adb shell setprop vendor.debug.tpi.s.fb.onoff 0
# back to the default
adb shell setprop vendor.debug.tpi.s.fb.onoff 1
```

1. test Default-ROM supEIS power

2. set inputSize to 2384x1784
```bash
adb shell setprop vendor.vidhance.preview.vs.super.cropfactor 0.81
adb shell setprop vendor.vidhance.video.vs.super.cropfactor 0.81
```

3. set inputSize to 2400x1350
```bash
adb shell setprop vendor.vidhance.video.vs.super.cropfactor 0.80
adb shell setprop vendor.vidhance.preview.vs.super.cropfactor 0.80
adb shell setprop vendor.vidhance.video.usefullfov 0
adb shell setprop vendor.vidhance.preview.usefullfov 0
```

4. delete VH-pipeline's MCTF-Node
```bash
adb push com.qti.chiusecaseselector.so vendor/lib64
adb reboot
```

5. Switch VH-Node to Qcom-Node
```bash
adb push com.qti.chiusecaseselector.so vendor/lib64
adb reboot
```

## M12-Power实测

[M12-GL HIS 功耗性能测试](https://xiaomi.f.mioffice.cn/sheets/shtk4nDrqaq6ailOMTZRLOqEo6d?sheet=IDiKAv)
[M12 相机功耗风险项评估](https://xiaomi.f.mioffice.cn/sheets/shtk4DngDlGxxkQbDVMUyP2y1Ne?sheet=rJjd6t)