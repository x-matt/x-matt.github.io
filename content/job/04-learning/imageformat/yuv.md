
## 术语简介

1. 色彩编码系统
    - RGB
    - YUV
    - HSV

| YUV  | 无伽马矫正     | 有伽马矫正      | 取值                                                                                                 |
| ---- | --------- | ---------- | -------------------------------------------------------------------------------------------------- |
| 模拟信号 | $YCC$     | $Y'P_bP_r$ | $Y\in[0,1]\space \space \\U,V\in[-0.5,0.5]$                                                        |
| 数字信号 | $YC_bC_r$ | $Y'C_bC_r$ | - full range <br>$$Y,C_b,C_r\in[0, 255]$$ - limited range <br>$Y\in[16,235] \\C_b,C_r\in[16, 240]$ |

| RGB  | 无伽马矫正       | 有伽马矫正          | 取值              |
| ---- | ----------- | -------------- | --------------- |
| 模拟信号 | $RGB$       | $R'G'B'$       | $R,G,B\in[0,1]$ |
| 数字信号 | $R_dG_dB_d$ | $R'_dG'_dB'_d$ |                 |

limited range的目的：**解决滤波（模数转换）后的过冲现象**
>[!quote] Y' values are conventionally shifted and scaled to therange [16, 235] (referred to as studio swing or "TV levels")rather than using the full range of [0, 255] (referred to asfull swing or "PC levels"). This practice was standardized inSMPTE-125M in order to accommodate signal overshoots("ringing") due to filtering. The value 235 accommodates amaximal black-to-white overshoot of 255 − 235 = 20, or 20 /(235 − 16) = 9.1%, which is slightly larger than thetheoretical maximal overshoot (Gibbs phenomenon) of about 89% of the maximal step. The toe-room is smaller, allowingonly 16 / 219 = 7.3% overshoot, which is less than thetheoretical maximal overshoot of 8.9%. This is why 16 isadded to Y' and why the Y' coefficients in the basictransform sum to 220 instead of 255. U and V values, whichmay be positive or negative, are summed with 128 to make themalways positive, giving a studio range of 16–240 for U and V.(These ranges are important in video editing and production,since using the wrong range will result either in an imagewith "clipped" blacks and whites, or a low-contrast image.)

1. YUV/YCbCr/YPbPr
    - 亮度：Y
    - 色度：UV/CbCr/PbPr
    > $YC_bC_r$日常中默认等价于YUV
    > b代表蓝色，r代表红色

1. YUV 的优点：
    1. YUV表示法的重要性是它的亮度信号 (Y) 和色度信号 (U 、V) 是相互独立的
    1. 减少存储空间和数据传输带宽，利用人眼的特性来降低数字彩色图像所需要的存储容量

### 4:4:4、4:2:2、4:2:0
- 原因：人眼对色度的敏感度要低于对亮度的敏感度，消除富裕出的色彩的内存
![[yuv-20240315094603941.png|YUV图像排列|700]]

| 类型    | 比例    | 扫描线上采样点数 | 扫面线个数 | 内存             |
| ----- | ----- | :------: | :---: | -------------- |
| 4:4:4 | 4:4:4 |   1:1    |  1:1  | 3×Resolution   |
| 4:2:2 | 4:2:2 |   2:1    |  1:1  | 2×Resolution   |
| 4:1:1 | 4:1:1 |   4:1    |  1:1  | 1.5×Resolution |
| 4:2:0 | 4:1:1 |   2:1    |  2:1  | 1.5×Resolution |

- 存储方式
    1. YUV444
        1. YUV444p：YYYYYYYY VVVVVVVV UUUUUUU
    1. YUV422
        1. YUV422p：YYYYYYYY VVVV UUUU
        1. YUVY：YUYV YUYV YUYV YUYV
        1. UYVY：UYVY UYVY UYVY UYVY
    1. YUV420
        1. YUV420p：
            - YV12：YYYYYYYY VV UU
            - I420：YYYYYYYY UU VV
        1. YUV420sp：
            - NV12：YYYYYYYY UVUV
            - NV21：YYYYYYYY VUVU

### 色彩系统间转换

在计算机程序中所进行的YUV/RGB转换，大部分情况都是指$Y'C_bC_r$和$R'_dG'_dB'_d$间的转换

1. 数模转换: $R'_dG'_dB'_d \Leftrightarrow R'G'B'$
1. 模拟内转换: $R'G'B' \Leftrightarrow Y'P_bP_r$
1. 模数转换: $Y'P_bP_r \Leftrightarrow Y'C_bC_r$

$$
    f\;=\;\frac1{255} \\
    scale\;=\;\left\{\begin{array}{l}{\lbrack219\;224\;224\rbrack}^T\;on\;narrow\;range\\{\lbrack255\;255\;255\rbrack}^T\;on\;full\;range\end{array}\right. \\
    offset\;=\;\left\{\begin{array}{l}{\lbrack219\;224\;224\rbrack}^T\;on\;narrow\;range\\{\lbrack255\;255\;255\rbrack}^T\;on\;full\;range\end{array}\right.
$$

## 参考资料

1. [YUV介绍](https://www.cnblogs.com/sddai/p/10302979.html)
1. [YUV-Wiki](https://en.wikipedia.org/wiki/YUV)
1. [YUV格式详解](https://blog.csdn.net/iva_brother/article/details/84036877)
1. [YUV与RGB互转各种公式](https://www.cnblogs.com/luoyinjie/p/7219319.html)
1. [color range问题总结](https://blog.csdn.net/yue_huang/article/details/77164579)
1. [一篇文章搞清楚编程中YUV和RGB间的相互转换](https://blog.csdn.net/sunty2016/article/details/106589379#commentBox)