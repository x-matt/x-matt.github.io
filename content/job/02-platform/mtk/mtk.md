## 规划总结

### 尝试项

1. EIS支持60帧缓存帧
1. 8k场景下尝试增加缓存帧
1. VSR 在DX-4落地
1. sat切换不平滑 M12/A Video EIS+SAT 切换不平滑问题
1. eis内部配合on/off ois来改善eis+sat时候的切换效果
1. 夜景视频算法使用rawResizer去resize image
1. 尽量跑Inline-flow来提升TNC效果

### 待平台协助点

1. UFBC能够全链路支持, 含camera & video
    - 目前UFBC仅仅在camera范围内被支持, 且目前闭源三方算法无法读取识别
        - 一方面开放给三方算法读的权限, 让SAT/EIS这些场景都能够开启UFBC, 提升基础录像场景的功耗性能表现
        - 一方面同时支持camera, video模块, 进一步提升改善重载的功耗性能表现(4k60/8k)
    - 验收标准
        - 三方算法能够正常读取到image的内容
        - 重载场景下功耗性能与qcom对齐(4k60/8k)
1. AFBC格式能够全场景enable, 包括电影模式
1. 支持配置两组basic setting, video能够有更大的fov
    - 目前sensor已经支持两组不同的basic setting, 4:3/16:9是两套独立的setting, 目前mtk还不支持,该配置的收益是可以让video等active size为16:9的场景有更大的FOV
1. 慢动作场景增加vss功能
1. eis全场景覆盖

## 基础知识

- RRZO
  - Raw Reorder and Zoom Out
  - 对isp输入的原始数据进行预处理
- IMGO
  - Image Output
  - 输出isp处理后的图像数据

## 官方PDF文档密码：**9518252186**

## [文件目录](https://online.mediatek.com/QuickStart/QS00137#QSS01427)

1. mtkcam(HAL1/HAL3)
    - aaa\
    - drv\
    - include\
    - utils\
1. mtkcam3(Only HAL3)
    - include\
    - main\
    - 3rdparty\
    - pipeline\
    - feature\

## 文件输出

> out/target/product/cezanne/vendor/lib64

```bash
adb disable-verity && adb reboot # 第一次push时需要
adb root && adb remount && adb push libmtkcam_3rdparty.customer.so vendor/lib64 && adb reboot
```

## WPE

目的：实时图像转换
优势：【相较于GPU】

- 低功耗
- 空间占用面积小

[Homograph](https://zhuanlan.zhihu.com/p/74597564)

- 刚体变换：平移+旋转，只改变物体位置，不改变物体形状
- 仿射变换：改变物体位置和形状，但是保持“平直性”
- 投影变换：彻底改变物体位置和形状

步骤：

1. 双线性差值
2. 双三次差值
3. 填充输出

判断调用的是standalone or directlink Mode
`adb logcat | grep -Ei "mdpcrop|wpeo"`
//代表standalone 有出WPEO WPO2,    mdpcrop_en: 0 代表沒有開MDP direct link
`wpeo_en: (1), wpeo2_en: (1), wpe_mdpcrop_en: (0)`
WPE 跟DIP 一樣, 目前不管是stand alone mode 或是 direct link MDP mode, 都會透過MDP driver 把硬體設定下到kernel driver.
所以log 才會顯示_wpestartMdp.

## [ImageBuffer](https://wiki.n.miui.com/pages/viewpage.action?pageId=559095604)

> vendor\mediatek\proprietary\hardware\mtkcam\utils\imgbuf

1. ION申请buffer的地方

```cpp {.line-numbers}
MBOOL
IonImageBufferHeap::
doAllocIon(MyIonInfo& rIonInfo, size_t boundaryInBytesToAlloc)
{
    if (IIonDeviceProvider::get()->queryLegacyIon() > 0)
        return doAllocLegacyIon(rIonInfo, boundaryInBytesToAlloc);
    else
        return doAllocAOSPIon(rIonInfo, boundaryInBytesToAlloc);
}
```

> IonImageBufferHeap.cpp

| Buffer参数                           | 作用                                                                                                          |
|--------------------------------------|---------------------------------------------------------------------------------------------------------------|
| IImageBufferHeap                     | 各种Heap的基类，e.g.：Ion，Gralloc,Graphic,Pmem                                          |
| IImageBufferAllocator                | 申请的中间代理，通过alloc()构建IImageBufferHeap，返回IImageBuffer 指针                                          |
| IImageBuffer                         | IImageBufferHeap 的wrapper                                                                                    |
| IImageBufferHeap class               | An interface to describe a buffer heap for an image.                                                          |
| IImageBuffer class                   | An interface to describe a buffer within an image heap                                                        |
| IImageBufferHeap-derived calsses     | Classes for managing various heap sources, such an Pmem, ION, malloc, and so on.                              |
| IImageBufferAllocator calss          | An interface to assist in allocating/freeing IImageBuffer class of mostly-used buffer.                        |
| BufferHeapPool class                 | 管理 bufferHeap，调用ImageBufferHeap申请buffer，以及维护使用和空闲的两个队列                                    |
| FrameBufferManager class             | 作为 BufferHeapPool的wrapper，提供接口给stream 获取buffer。                                                     |
| IPipelineBufferSetFrameControl class | 调用 FrameBufferManager 申请buffer，提供接口 getMetaBuffer(), getImageBuffer() 等API 给 Node 申请相关内存使用。 |

## ISP7

### Vidhance-EIS 集成顺序

1. 放置SDK
将SDK文件夹放置到目录`mtkcam-core/thirdparty/customer/mi_vidhance_eis/DivisionPlugin.cpp`
2. 关闭MTK-EIS
`mtkcam-android/main/hal/core/device/3.x/policy/FeatureSettingPolicy_Streaming.cpp`
disableEIS
3. mk文件中加库文件
`mtkcam-core/thirdparty/customer/Android.mk`

### 说明文档

目录： `vendor/mediatek/proprietary/hardware/mtkcam-halif/Documentation`
执行命令： `make all`

#### framework

1. introduction
1. getting started
1. advanced customized
1. device
1. data collection
1. post processing
    1. WPE
        - logTag `MtkCam/CoreDeviceWPE`
1. example
1. api
1. legacy customization interface
1. information

#### featuresSettingPolicy

1. evaluateStreamConfiguration(out, in, createInfo)
    1. updateStreamConfiguration(out, in, createInfo)
    1. updateStreamConfiguration_Streaming(out, in, createInfo)
        1. get_streaming_scenario()
        1. updateStreamConfigurationTPI(pStreamingParams)
            - preTpi
            - postTpi
    1. evaluateP1DMASetting_Streaming(out, in, createInfo)
        1. refineYUVSize()
