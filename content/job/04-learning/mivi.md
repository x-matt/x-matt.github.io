## 第一期: mialgoengine知识分享

- [mialgoengine知识分享](https://xiaomi.f.mioffice.cn/docx/doxk4tBZg5FQyLPrBALpwNNkZle)
![[mivi 2024-04-09 20.03.39.excalidraw]]
## 第二期: capture 流程分享

- [Mivi capture](https://xiaomi.f.mioffice.cn/docx/doxk4KiUwSLu6VaLi0gjwjjTzqk)
### requestt

### result

### mockCamera


`adb logcat | grep -Ei "photographer|asyncConfigDarkroom|finalizeRequest|prepareZSLQueue|updateFramesToContext|notifyProcPendingCapture|procPendingCaptureLoop|collectFrames|processDarkroomResult|resultCallback|BGServiceClient|processOutputRequest|MockCameraSession.*processCaptureResult"`

## 第三期: streaming流程分享

| Logtag   | Function            | SubFunction |
| -------- | ------------------- | ----------- |
| MiCamHAL | VendorCameraSession |             |
|          |                     |             |
