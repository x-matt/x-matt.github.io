---
title: Image Format
---
## Common Format
| **Domain**            | **Characteristics**                                                  | **Common Formats**                     | **Applications**                                                     | **Advantages**                                   | **Disadvantages**                                                |
| --------------------- | -------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| **Raw Domain**        | Unprocessed data directly from the image sensor                      | Bayer (RGGB, GRBG)                     | ISP front-end processing (denoising, white balance, demosaicing)     | Retains the most information, highly flexible    | Requires extensive post-processing                               |
| **YUV Domain**        | Separates image into luminance (Y) and chrominance (U, V) components | NV12, NV21, I420, YUYV                 | Video compression, transmission (e.g., H.264, H.265)                 | Reduced data size, aligns with human perception  | Subsampling may reduce quality                                   |
| **RGB Domain**        | Three-channel color model, most intuitive                            | RGB888, RGB565                         | Displays, image editing, computer vision                             | Intuitive display, natively supported by devices | Large data size, high transmission cost                          |
| **Grayscale Domain**  | Single-channel, contains only luminance information                  | Single-channel grayscale images        | Simple image processing (e.g., object detection, feature extraction) | Small data size, easy to process                 | Lacks color information                                          |
| **Frequency Domain**  | Converts spatial domain to frequency domain                          | DCT coefficients, Fourier coefficients | Image compression (JPEG), image enhancement (denoising, deblurring)  | Facilitates low- and high-frequency analysis     | Not intuitive for human interpretation, complex calculations     |
| **Depth Domain**      | Represents scene depth information (distance from camera)            | Depth maps, point clouds               | 3D reconstruction, AR, SLAM                                          | Provides spatial structure information           | Sparse data, requires combination with RGB images                |
| **Lab Domain**        | Perceptually uniform color space with luminance and color components | L, a, b components                     | Color correction, matching, image segmentation                       | Closer to human visual perception                | Complex conversion, not a native format                          |
| **Compressed Domain** | Data stored or transmitted in a compressed format                    | JPEG, HEIF                             | Storage, transmission                                                | Small data size, saves storage and bandwidth     | Requires decoding for processing, may have compression artifacts |
| **Polar Domain**      | Represents image information in polar coordinates                    | Polar coordinate formats               | Circular image processing, panoramic image unwrapping                | Optimized for specific geometric calculations    | Limited to specific use cases                                    |

## Specific Format

| Platform | Format Name                  | Domain                                                                                                | Desc                                               |
| -------- | ---------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| MTK      | P010(Packed)<br>P012(Packed) | YUV                                                                                                   | ![[MTK_YUV_P010_P012.png \| 400]]                  |
| MTK      | UFBC                         | **RAW**: UFBC_Bayer10, UFBC_Bayer12, UFBC_Bayer14<br>**YUV**: UFBC_NV12, UFBC_YUV_P010, UFBC_YUV_P012 | **U**niversal **F**rame **B**uffer **C**ompression |
| QCOM     | UBWC                         |                                                                                                       | **U**niversal **B**and**W**idth **C**ompression    |
| Common   | AFBC                         | **MTK-YUV**: NV12, YUVP010                                                                            | **A**rm **F**rame **B**uffer **C**ompressions[^1]  |

### UBWC Intro

>[!quote] Qcom official introduction
>
>**Universal bandwidth compression**[^2]
>
>Universal bandwidth compression (UBWC) is supported by all GPUs since A5x. UBWC is a unique predictive bandwith compression scheme that improves effective throughput to system memory. By minimizing the bandwidth of data, significant power savings can be achieved.
>
>UBWC works across many components in Snapdragon processors including GPU, Display, Video, and Camera. The compression supports YUV and RGB formats, and reduces memory bottlenecks. [Snapdragon Profiler](https://docs.qualcomm.com/bundle/publicresource/topics/80-78185-2/sdp.html?product=1601111740035277#sdp) typically shows surfaces as being encoded as “Optimal” (UBWC) or “Linear” (much less performant, but laid out like a C-array rather than with our proprietary compression scheme).
>
>Graphics APIs must be used correctly to maximize the use of UBWC – for example, in Vulkan VK_IMAGE_TILING_LINEAR and VK_IMAGE_TILING_OPTIMAL generally map to “Linear” and “Optimal” as expected.


[^1]:[Arm Frame Buffer Compression – Arm®](https://www.arm.com/technologies/graphics-technologies/arm-frame-buffer-compression)
[^2]:[Snapdragon Game Toolkit Documentation](https://docs.qualcomm.com/bundle/publicresource/topics/80-78185-2/overview.html?product=1601111740035277#universal-bandwidth-compression)