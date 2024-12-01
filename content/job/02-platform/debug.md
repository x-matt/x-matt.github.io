## Video

### 问题复现log开启

```bash
# 1.
adb shell setprop vendor.debug.tpi.s.his.loglevel 1
adb shell setprop vendor.debug.tpi.s.his.debug 1
adb shell setprop debug.cam.d
adb shell setenforce 0 && adb shell setprop persist.vendor.mtk.camera.log_level 3
adb shell "pkill camera*"

# 2.
[[复现问题]]

# 3.
#3.1. dump文件
adb pull data/vendor/camera/
# 3.2. 录屏文件
# 3.3. 录制生成的文件
# 3.4. log
adb pull data/debuglogger/

# 上述命令重启就会失效
```
