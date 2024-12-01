## 相关脚本释放

- mtkCR: <https://eservice.mediatek.com/eservice-portal/issue_manager/update/142280024>
- release:
  - capture: <https://transfer.mediatek.com/Detail/Received/Mail30030544507>
  - preview:
    - NDD: <https://transfer.mediatek.com/Detail/Received/Mail30030550551>
    - ODT: <https://transfer.mediatek.com/Detail/Received/Mail30030583937>

### 相关总结文档

- [SW ODT 使用 & 原理介绍 - MTK-Release](https://xiaomi.f.mioffice.cn/file/boxk4SxKEkjxWdgebqAoZuenqyf)
- [MTK平台NDD dump与在线仿真 - 张子凯](https://xiaomi.f.mioffice.cn/docx/doxk4lRGMl4tZEuOryDrh26jTGQ)
- [MTK odt使用方法 - 李莎莎](https://wiki.n.miui.com/pages/viewpage.action?pageId=651312797)

### 整体示意图

1. NDD提供待check模块的$input$
    1. Image(p1_in)
    1. 3A Statistics
1. ODT控制模块的$input$是否来自NDD
1. 通过确认ODT-OUT与NDD-OUT是否完全一致来判断是否PASS

### Streaming ODT

> 自动化, odt脚本中已经包含了NDD

1. 前提条件
    1. 脚本路径不要包含**中文**
    1. 使用**userdebug**版本
1. 修改`main_exec.py`中的`devideID`
1. 执行文件`main_exec.py`
    1. 中间需要切入2次进入check场景
    1. 切入等待市场可以通过 sleep 来调整
1. 支持的场景：
    1. mcnr
    1. vhdr
    1. vsdof

### Capture ODT

> 手动

1. 前提条件
    1. 脚本路径不要包含**中文**
    1. ~~使用**userdebug**版本~~
1. NDD
    1. 执行次序
        1. clean
        1. int->config
        1. open camera->start (:camera:capture时, 间隔$>5s$)
        1. pull data `adb pull data/vendor/camera_dump/`
    1. check(仅capture)
        - 执行 comparsion.exe, 看dump是否有缺少
            - 将 comparsion.exe, while_list.txt和camera_dump放到同级目录
            - 蓝色表示check correct, 粉色表示异常
1. ODT
    1. 确认adb devices查看UKeyXX & 手机编码
        - `adb shell “ls /data/vendor/camera_dump”`
    1. 修改ts&deviceID: 执行init.bat
    1. enable.bat
    1. 进入到要测试的环境
    1. start.bat(仅streaming:video_camera:)
    1. check dump图像与ndd dump图像是否一致

## NDD介绍

- 全称: Normal Data Dump
- 目的:
    1. 将相机使用过程中的 software & hardware 的$i/o$写到档案里
    2. 制定同一的命名规则
- 组成: software flow + dump function
- 包含文件: RAW、YUV、Jpeg、metadata

## ODT介绍

- 全称: On Device Tuning
- 功能: 将仿真功能由PC改成手机 (offline->online)
- 组成: software flow + readback function

- :balloon:要点
  - odt的核心就是将待check模块的input替换为NDD_dumped_image

- :exclamation:注意:
  - 步骤3, 执行完enable之后, 预览那画面是黑色
    - 原因: 通过预览伪造极暗假象, 欺骗app触发 AINR/MFNR
    - 强开aishutter
      - 强制缩短曝光：`adb shell "setprop persist.vendor.camera.motion_level 50"`  / 0恢复默认　20以上强制走抓拍　10 强制关闭抓拍
      - 强制跑入AIshutter的Node，`adb shell setprop vendor.camera.ais.simulation.mode 1`  // 0默认，1-AIMUB,  2-AIS1, 3-AINR
        - 关键字`aishutter2plugin.*process`
    - 强开ainr：`adb shell setprop vendor.debug.camera.ainr.mode 1`
    - 强开lpnr: 专业拍照模式下, shutter > 0.5是就会强制触发

## 需要check的场景

### Streaming

- MCNR
  - 1080p30
  - 1080p60
- VHDR
  - 1080p30
- HDR10+
  - 1080p30
  - 1080p60

### Capture

- MFNR
- AINR: 偏暗环境出发
- LPNR: 嵌入在R2Y-Node中, 单帧图像必过该algo
- AIMUB: N12系列开始弃用
- HDR: N12开始使用RAW-domain hdr

- MfnrInstance
  - FEATURE_MFNR `MTK_POSTPROCDEV_CAPTURE_HINT_MULTIFRAME_MFNR`
  - FEATURE_AINR `MTK_POSTPROCDEV_CAPTURE_HINT_MULTIFRAME_AINR`
  - FEATURE_AIHDR `MTK_POSTPROCDEV_CAPTURE_HINT_MULTIFRAME_AIHDR`
  - ~~FEATURE_AISHUTTER1 `MTK_POSTPROCDEV_CAPTURE_HINT_MULTIFRAME_AISHUTTER1`~~
  - FEATURE_AISHUTTER2 `MTK_POSTPROCDEV_CAPTURE_HINT_MULTIFRAME_AISHUTTER2`
- FEATURE_R2R
- FEATURE_R2Y
- FEATURE_Y2Y
- FEATURE_Y2J
- FEATURE_BSS
- FEATURE_VSE_MCNR
- FEATURE_VSE_WARP_MCNR
- FEATURE_VSE_MCNR_PQ
- FEATURE_VSE_R2Y_MCNR
- FEATURE_WPE_PQ
- FEATURE_WPE_WARP_PQ
