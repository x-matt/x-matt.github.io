## 处理单元

- CPU (Central Processing Unit)
  - 组成: 控制, 存储, 计算
- GPU (Graphic Processing Unit)
  - 工作内容: 图像
- DPU (Data Processing Unit)
  - 工作内容: 虚拟化, 网络, 存储, 安全
- APU (Accelerated Processing Unit)

## 内存类型

1. RAM
1. zRAM
1. 存储器

[进程大小分类](https://blog.csdn.net/weixin_32388647/article/details/116756533)

| 名称  | 全称                    | 含义                          |
| --- | --------------------- | --------------------------- |
| VSS | Virtual Set Size      | 占用的虚拟内存的大小(包括共享库所占用的内存)     |
| RSS | Resident Set Size     | 实际上占用的物理内存的大小(包括共享库占用)      |
| PSS | Proportional Set Size | 实际上占用的物理内存的大小(比例分配共享库占用的内存) |
| USS | Unique Set Size       | 进程独自占用的物理内存(不包括共享库占用的内存)    |

## DMA

1. 是什么?
    - Direct Memory Access
    - 将原本CPU的相关数据搬运的工作, 都交给DMA控制器, CPU脱身干别的事情
    - ​DMA 是一种允许外围设备（硬件子系统）直接访问系统主内存的机制(绕开CPU)
1. 为什么?
    - DMA 主要是用于读写数据用的
    - 没有DMA时候, CPU在做数据传输(copy等)时候, 没法做其他事情, 大量数据搬运肯定导致CPU堵塞

## Buffer

| 概念           | 描述                            | 应用模块     | 目的                    |
| :----------- | :---------------------------- | :------- | :-------------------- |
| DMA          | 一种技术                          | 计算机系统    | 将CPU负责数据转移的工作剥离出来给DMA |
| DMA-BUF      | 一个内存共享机制                      | Linux 内核 | 不同模块/设备共享内存           |
| dma-buffer   | 一块允许在CPU和其他子系统之间共享的buffer[^4] | Linux 内核 | 内存共享的实际载体             |
| DMA-BUF Heap | 一种基于DMA-BUF的内存管理框架            | Linux 内核 | 不同进程直接共享内存            |
| ION          | 一种基于DMA-BUF的内存管理框架            | Android  | 不同进程直接共享内存            |
| gralloc      | 一种图形内存分配器                     | Android  | 分配和管理图形数据的内存          |

### buffer和cache的差异

|特性|缓冲区（Buffer）|缓存（Cache）|
|---|---|---|
| **用途** | 协调不同速度或不同时间的操作，临时存储数据 | 存储频繁访问的数据，提高访问速度 |
|**位置**|通常位于内存或I/O设备之间|通常位于CPU内部或靠近主存的位置|
|**数据存储**|临时存储数据，数据使用后通常会被移除|存储频繁访问的数据，数据可能会被多次使用|
|**数据管理策略**|FIFO（先进先出）或循环队列|LRU（最近最少使用）、LFU（最少频繁使用）等|
|**目的**|提高数据传输效率，协调生产者和消费者之间的速度差异|减少数据访问延迟，提高系统性能|
|**使用场景**|I/O操作、多媒体处理、网络传输等|CPU缓存、磁盘缓存、网页缓存等|

### file和buffer的差异

| 特征   | 文件 (File)  | 缓冲区 (Buffer) |
| ---- | ---------- | ------------ |
| 存储位置 | 存储在存储设备上   | 存储在内存中       |
| 类型   | 持久化数据      | 临时数据         |
| 操作   | 文件系统相关操作   | 读取、写入、处理等    |
| 生命周期 | 持续存在       | 临时存在         |
| 可持久化 | 是          | 否            |
| 管理方式 | 通过文件系统     | 编程接口和逻辑      |
| 访问方式 | 顺序访问、随机访问等 | 直接读写         |
| 存储单位 | 字节序列       | 字节序列         |

### 内存共享框架: DMA-BUF

- 是一个内存共享的通用框架, 专门解决跨进程, 跨硬件之间的内存共享问题
- 通过对buffer的封装, 使buffer可以像文件一样访问, 通过fd实现buffer的传递，共享
- 组成
  - exporter: 分配和管理buffer
  - importer: 使用buffer的使用者
    - ION Buffer & DMA-Buffer Heaps 都是基于DMA-BUF实现的内存分配/管理器, 其均为对exporter的封装
    - 设备目录 `dev/dma_heap/`
![[memory 2024-04-15 14.48.23.excalidraw|DMA-BUF 架构示意图|600]]


### 内存分配器: ION (DAM-BUF exporter)

1. 是什么?
    - Interprocess Communication Over Non-Contiguous Memory
    - 一种Android操作系统中的共享内存机制，它提供了一种在不同进程之间共享图形和视频数据的方式
    - 主要概念
        - Heap:
        - Client:
        - Handle:
1. 为什么?
    - 解决内存碎片化管理, 用来支持不同的内存分配机制
        - CARVOUT(PMEM)
        - 物理连续内存(kmalloc)
        - 虚拟地址连续但物理地址不连续内存(vmalloc)
        - IOMMU

| 特征      | DMA-BUF Heap    | ION                 |
| ------- | --------------- | ------------------- |
| 内存分配方式  | 由内核动态分配内存       | 由用户态驱动程序分配内存        |
| 内存共享能力  | 支持多个进程之间的内存共享   | 支持多个进程之间的内存共享       |
| 内存管理复杂度 | 较低，不需要专门的内存管理器  | 较高，需要用户态驱动程序管理      |
| 性能影响    | 较小，内核级别的操作      | 较大，涉及用户态和内核态切换      |
| 系统集成    | 部分 Linux 内核版本支持 | Android 平台默认的内存管理方案 |

>- DAM-BUF: 内存共享的通用框架; 既不是DMA, 也不是Buffer
>   - 内存分配器: `ION`/`DAM-Buffer-heaps`, 目前基本都会用DMA-Buffer-heaps, 其优势是可以做进程权限设置
>   - [ELC-2020-Andrew-Davis-dma-buf-heaps.pdf (elinux.org)](https://elinux.org/images/f/f2/ELC-2020-Andrew-Davis-dma-buf-heaps.pdf)

### GraphicBuffer

```cpp
// FD -> GraphicBuffer
int fd = received_fd; // 接收到的文件描述符
native_handle_t* nativeHandle = native_handle_create(1, 0);
nativeHandle->data[0] = fd;
sp<GraphicBuffer> graphicBuffer = new GraphicBuffer(width, height, format, usage, nativeHandle);

// GraphicBuffer -> FD
sp<GraphicBuffer> graphicBuffer = new GraphicBuffer(width, height, format, usage);
native_handle_t* nativeHandle = graphicBuffer->handle;
int fd = nativeHandle->data[0]; // 获取 DMA-BUF 文件描述符
```

- ANativeWindowBuffer: 描述一块 DMA-Buffer, 对`native_handle_t`进行了封装
- GraphicBuffer: 继承自ANativeWindowBuffer
- AHardwareBuffer: 没有具体的类型，是个空结构体，类似于void 类型
  - AHardwareBuffer <-----> GraphicBuffer: 用reinterpret_cast<> 无地址偏移，直接强转
  - ANativeWindowBuffer <------> GraphicBuffer: 用static_cast<>, 有地址偏移
  - AHardwareBuffer <------> ANativeWindowBuffer: 需要先转成GraphicBuffer，再做第二次类型转换

| 特性      | GraphicBuffer             | ANativeWindowBuffer | AHardwareBuffer           |
| ------- | ------------------------- | ------------------- | ------------------------- |
| 实现和用途   | 用于图形渲染和图像处理               | 用于与原生窗口系统进行交互       | 用于跨进程共享硬件加速的图形数据          |
| 引入版本    | 较早引入                      | 较早引入                | Android 8.0 引入            |
| 共享机制    | 同一进程内部使用                  | 同一进程内部使用            | 跨进程直接共享                   |
| 主要接口和功能 | Android Framework 提供的类和接口 | Android NDK 提供的结构体  | Android Framework 提供的类和接口 |
| 典型应用场景  | 图形渲染、图像处理                 | 原生窗口系统交互、绘图         | 跨进程图形数据共享                 |

|特性|gralloc|DMA-BUF heap|
|---|---|---|
|实现和用途|Android 系统中的图形内存分配器|Linux 内核中的 DMA 内存管理机制|
|功能|分配和管理图形数据的内存|允许设备之间共享内存|
|分配方式|用户空间调用系统服务或库来分配|内核空间在设备驱动程序中分配|
|共享机制|通常在同一进程内部共享|允许在不同设备之间共享|
|应用场景|Android 图形渲染和图像处理|设备间高速数据传输，例如图形和视频|

### Linux Space

| 空间名称                                | 描述                             |
| ----------------------------------- | ------------------------------ |
| 用户空间 (User Space)                   | 用户程序执行的地址空间，包含应用程序和用户态的库函数。    |
| 内核空间 (Kernel Space)                 | 内核执行的地址空间，包含操作系统内核及其核心功能和驱动程序。 |
| I/O 空间 (I/O Space)                  | 用于管理设备寄存器和控制设备数据传输的地址空间。       |
| 物理地址空间 (Physical Address Space)     | 系统中的物理内存地址空间。                  |
| 虚拟地址空间 (Virtual Address Space)      | 进程可用的地址空间，包括用户空间和内核空间。         |
| DMA 空间 (Direct Memory Access Space) | 用于直接内存访问的地址空间，允许外部设备直接访问系统内存。  |

## Hal Buffer Manager(HBM)

[android 官方文档](https://source.android.com/docs/core/camera/buffer-management-api?hl=zh-cn)

![[2023-09-25-17-32-19.png|android - 9|700]]
![[2023-09-25-17-32-57.png|android - 10|700]]
- 目的: 节省内存消耗
- 方法:
    1. request中的controlMeta与buffers剥离开, 不同步下发
    1. 在HAL的末尾处(用到buffer的地方), 再下发buffers

## BufferQueue

![[2023-09-25-19-44-50.png|通信|600]]

通信过程[^1][^2]

- 定义: 是一对队列, 可以调节缓存区从生产方到消耗方的固定周期

## 文件描述符(File Descriptor)

### Type

- 标准输入(`STDIN_FILENO`)：默认为 0，代表程序的标准输入流
- 标准输出(`STDOUT_FILENO`)：默认为 1，代表程序的标准输出流
- 标准错误(`STDERR_FILENO`)：默认为 2，代表程序的标准错误输出流
### Operators

- `open`：打开文件或设备，返回文件描述符
- `read`：从文件描述符读取数据
- `write`：向文件描述符写入数据
- `close`：关闭文件描述符
- `dup`：复制文件描述符
- `dup2`：复制文件描述符，并指定新的文件描述符
- `pipe`：创建一个管道，返回两个文件描述符
- `fcntl`：操作文件描述符的状态和属性

## 分析

- Perfetto:[官方指导说明](https://developer.android.com/tools/perfetto?hl=zh-cn)
- addr2line
- 栈回溯[^3]

## 参考

1. [Android内存概述](https://xiaomi.f.mioffice.cn/docs/dock4xIr3vuMq1z3EdyEZeyiIwe)
1. [火遍全网的DPU，到底是个啥？](https://baijiahao.baidu.com/s?id=1741407351814338781&wfr=spider&for=pc)
1. [一文读懂APU/BPU/CPU/DPU/EPU/FPU/GPU等处理器](https://www.xjx100.cn/news/619002.html?action=onClick)
1. [DMA简介](https://blog.csdn.net/baidu_31437863/article/details/114824649)
1. [【STM32】DMA原理一文搞懂DMA](https://mp.weixin.qq.com/s?__biz=MzU1NjEwMTY0Mw==&mid=2247579317&idx=1&sn=13782b6f38b8277d345b6ecc2343425a&chksm=fbc9cfd1ccbe46c71534d1c8f545bdc41827132d6a32a4cfdeafa384b59c97649aca5244a5bb&scene=27)
1. [内存管理 —— ION](https://kernel.meizu.com/2017/11/18//memory%20management%20-%20ion.html/)
1. [Camera Buffer Management](https://zhuanlan.zhihu.com/p/468033445)
1. [万字长文丨深入理解Linux进程间通信](https://zhuanlan.zhihu.com/p/551299533)
1. [Android 系统中AHardwareBuffer、ANativeWindowBuffer和GraphicBuffer的关系](https://deepinout.com/android-system-analysis/android-display-related/android-ahardwarebuffer-anativewindowbuffer-graphicbuffer-relationship.html#ftoc-heading-1)
1. [将 ION 堆转换为 DMA-BUF 堆](https://source.android.com/docs/core/architecture/kernel/dma-buf-heaps?hl=zh-cn)

[^1]:[Android 图形组件](https://source.android.com/docs/core/graphics?hl=zh-cn#android-graphics-components)
[^2]:[BufferQueue 学习总结](https://blog.csdn.net/hexiaolong2009/article/details/99225637#commentBox)
[^3]:[linux(栈回溯篇)](https://zhuanlan.zhihu.com/p/460686470)
[^4]:[DMA-BUF简单介绍](https://blog.csdn.net/u011795345/article/details/129306630)
