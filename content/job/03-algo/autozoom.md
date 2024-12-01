## Qcom(K9)

```bash
adb pull /vendor/etc/camera/det_quantize.dlc
adb pull /vendor/lib64/libfocus.so
```

## 自检表

| 测试项                                  | 验证方法                                      | 结论                                         | 备注 |
|-----------------------------------------|-----------------------------------------------|----------------------------------------------|------|
| EIS算法版本号                           | `adb shell "pkill camera*" && adb logcat      | grep "Vidhance version"`                     | PASS |
| Tracker算法版本号                       | `adb logcat                                   | grep "AutozoomManager: ProcessInit version"` | PASS |
| EIS-debug等级的log开启方式              | setprop vendor.vidhance.logging.level 0       | PASS                                         | -    |
| EIS-dump方式                            | setprop vendor.vidhance.debug.eisdump 1       | PASS                                         | -    |
| EISNode处理时间(需要打开debug等级的log) | `adb logcat                                   | grep "Processing time"`                      | PASS |
| EIS功能验证                             | “Using configuration” （log中 stabilizer: 1） | PASS                                         | -    |
| Autozoom功能验证                        | “Using configuration” （log中 autoZoom: 1）   | PASS                                         | -    |
| Tracker功能验证                         | “config MI_TRACKER_Plugin Done”               | PASS                                         | -    |