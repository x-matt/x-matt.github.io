## 相关命令

| Usage               | Property                                                                                                                          | Desc                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| node bypass         | `vendor.debug.videonight.node.bypass.enable`                                                                                      | node内部做memory copy                             |
| dump I/O            | `vendor.debug.videonight.dump.enable`                                                                                             | 图片目录在 `data/vendor/camera/`                    |
| set task limitation | `vendor.debug.videonight.task.prev.limit`<br>`vendor.debug.videonight.task.rec.limit`<br>`vendor.debug.videonight.task.rec.delay` | 目的是解决mivi3.0中任务堆积问题<br>任务过度时候, node内部做bypass操作 |
## O10相关Patch

| Patch                                                                                                               | Desc                              |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [4217806](https://gerrit.pt.mioffice.cn/c/platform/vendor/xiaomi/proprietary/mivifwk-external/+/4217806?usp=search) | add jigan videonight              |
| [bring up](https://gerrit.pt.mioffice.cn/q/topic:o10_jigan_vn)                                                      | bring up jigan videonight         |
| [4406003](https://gerrit.pt.mioffice.cn/c/platform/vendor/xiaomi/proprietary/mivifwk-external/+/4406003?usp=search) | fix ev/ccm/rgbGain value abnormal |
| [driver sensor mode](https://gerrit.pt.mioffice.cn/q/topic:vidoe_night_mode)                                        | driver config sensormode          |
| [mivi sensor mode](https://gerrit.pt.mioffice.cn/q/topic:o10_videonight)                                            | mivi config sensor mode           |





```bash
# 1. 确认config文件
adb shell
cd odm/etc/camera/
ls -l supervq_model
ls -l svq_cache

# 2. 确认算法库 libanc_supervq.so
adb shell
cd odm/lib64
ls -l libanc_supervq.so

# 3. dump in/out
adb shell setprop vendor.debug.videonight.dump.enable 1
## 路径 /data/vendor/camera/

# 4. bypass node
adb shell setprop vendor.debug.videonight.node.bypass.enable 1

# 5. push debug 动态库
adb push com.xiaomi.plugin.jgvideonight.so odm/lib64/camera/plugins/
adb shell "pkill camera*"
```

- 关键字:
    1. 集成部分：`JIGAN_VIDEONIGHT` 
    2. 算法部分：`AncSDK`

## Input 参数

1. sensor gain (afe gain)
	在高通的ISP（Image Signal Processor）中，AFE（Analog Front End）是指模拟前端模块，它是ISP的一个重要组成部分。AFE主要负责将从图像传感器中读取的模拟信号进行处理和转换，以便后续数字信号处理模块进行处理。
	
	具体来说，AFE模块包括了模拟增益控制、模拟滤波、模拟-数字转换（ADC）等功能。其中，模拟增益控制可以调整图像传感器输出的信号强度，以适应不同的光照条件；模拟滤波可以去除信号中的噪声和干扰；模拟-数字转换则将模拟信号转换为数字信号，以便后续数字信号处理模块进行处理。
	
	AFE模块的设计和实现对于ISP的性能和图像质量有着重要的影响。高通的ISP中采用了先进的AFE设计和技术，以提供更高的图像质量和更好的性能。

1. isp gain
	ISPGain是ISP模块中的一个参数，用于控制数字信号的增益。它可以调整ISP中数字信号处理模块的增益，以适应不同的图像亮度条件。ISPGain的调节方式是通过改变数字电路中的增益系数来实现的，因此它是一个数字增益参数。

1. sensorGain作用于模拟信号, ispGain作用于数字信号

- 总结：
    1. gain是放大倍数
    1. 根据作用域分为：模拟增益(Analog Gain) & 数字增益(Digital Gain)
    1. ISO属于模拟增益

## DXG

- DAG: digital analog gain
  - 在gain amplifier中实现
- DCG: Dual Conversion Gain
  - HCG: high conversion gain
  - LCG: low conversion gain
  - 在CVC中实现
  - 优势[^1]
	  1. extend dynamic range
	  2. reproduce motion artifact free
	  3. low-noise images in challenging lighting conditions

## N12相关问题及patch

### patch合集
1. [Bring up videoNight mivi flow](https://gerrit.pt.mioffice.cn/q/topic:MIVI3_NIGHTVIDEO)
2. 夜景Crop问题优化适配
	1. [gerrit-external](https://gerrit.pt.mioffice.cn/c/platform/vendor/xiaomi/proprietary/mivifwk-external/+/3816236)
	2. [gerrit-core](https://gerrit.pt.mioffice.cn/c/platform/vendor/xiaomi/proprietary/mivifwk-core/+/3792741)
3. 夜景视频算法导入 [gerrit](https://gerrit.pt.mioffice.cn/q/topic:MIVI_VIDEO_NIGHT_PRE)
4. 解决夜景视频 cameraID remap 引起的hang问题 [gerrit](https://gerrit.pt.mioffice.cn/c/platform/vendor/xiaomi/proprietary/mivifwk-core/+/3793654)
5. support dxg
	1. [port select](https://gerrit.pt.mioffice.cn/c/alps/vendor/mediatek/proprietary/custom/+/3816609)
	2. [algo support](https://gerrit.pt.mioffice.cn/c/platform/vendor/xiaomi/proprietary/mivifwk-external/+/3745525)
	3. [mivi support](https://gerrit.pt.mioffice.cn/c/platform/vendor/xiaomi/proprietary/mivifwk-core/+/3754953)
### customFeature 问题
![[2024-02-29#Videonight 集成 vn]]

- [^1]:  [OMNIVISION’s DCG™ Technology](https://www.ovt.com/technologies/dcg-technology/) 