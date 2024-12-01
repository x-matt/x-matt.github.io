
## 是什么?
![[assets/images/raw 2024-03-22 18.11.36.excalidraw.md#^clippedframe=O7ypcndGBzGkh7Kc-YyKr|raw flow|800]]
单反/无反上的RAW基本都是私有格式, 手机上的RAW一般是通用, 公开的DNG格式

## 分类

### 按照存储方式

假设sensor raw 是 10bit[^1]

1. MIPI Raw (Mobile Industry Processor Interface)
	![[assets/images/raw 2024-03-22 18.11.36.excalidraw.md#^clippedframe=6sOjRyeUZTNNLITqJLy5c|mipi raw storage|800]]

1. Unpacked Raw
    - 低10位被占用, 高6位为空
		![[assets/images/raw 2024-03-22 18.11.36.excalidraw.md#^clippedframe=_FCoE1_XHSlVok1K6Gm1D|unpacked raw storage|500]]
- 内存占用分析
  - 同样多数量($N$)的RAW图时, mipi的单计算量为10, unpacked 则为16
  - 内存比 $M_{unpacked}/M_{mipi} = 8/5 = 1.6$

## DNG

- Digital Negative, Adobe开发的RAW格式文件

[^1]:[MIPI RAW图像数据与RAW图像数据的区别](https://deepinout.com/camera-terms/mipi-raw-image-data-and-raw-image-data-differences.html?replytocom=5366)
