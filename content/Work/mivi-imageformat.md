---
title: Mivi Imageformat
type: area
status: active
domain: imagedata
priority:
review:
tags:
  - mivi
---

## Based on Folder Structure

![[mivi-structure#Folder Structure]]

## Add a new format

### Format Convert

```cpp title="hal/adapter/mtk/hwadapter/decoupleutil/DecoupleUtil.cpp" {6-8, 26-28}
auto DecoupleUtil::convertFormat(const MiaPixelFormat &src, EImageFormat &dst) -> int
{
    switch (src) {
    ......

    case CAM_FORMAT_PACKED_P012:
        dst = eImgFmt_MTK_YUV_P012;
        break;

    ......

    default:
        dst = static_cast<EImageFormat>(src);
        MLOGW(LogGroupCore, "convert format failed");
        break;
    }
    return 0;
}

auto DecoupleUtil::convertFormat(const EImageFormat &src, MiaPixelFormat &dst) -> int
{
    switch (src) {

    ......

    case eImgFmt_MTK_YUV_P012:
        dst = CAM_FORMAT_PACKED_P012;
        break;

    ......

    default:
        dst = static_cast<MiaPixelFormat>(src);
        MLOGW(LogGroupCore, "convert format failed");
        break;
    }
    return 0;
}
```

### PostProcessor

```cpp title="hal/micam-core/RealtimePostProcessor.cpp" {4-5}
uint32_t RealtimePostProcessor::convertFormat(int format)
{
    ......
    } else if (format == micam::eImgFmt_MTK_YUV_P012) {
        return CAM_FORMAT_PACKED_P012;
    ......
}
```
