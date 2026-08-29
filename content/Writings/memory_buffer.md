---
title: Memory & Buffer System
type: area
domain: knowledge
category: platform
status: active
priority:
review:
tags:
---

## Skyview



## 基础理论

计算机内存以下是关于CPU寄存器、主存和辅存功能及其用途的表格：

|   **存储组件**   | **功能**                                                                                                                                            | **用途**                                                                                                                       |
| :--------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
|  **CPU寄存器**   | - 高速存储，用于临时存储和操作数据。- 存取速度极快，是CPU执行指令时最先访问的存储单元。- 包括累加器、程序计数器、指令寄存器、基址寄存器、栈指针等。 | - 提供快速数据访问和处理能力。- 存储当前正在执行的指令和数据。- 用于地址计算和指令跳转等操作。                                 |
| **主存（内存）** | - 计算机的主要存储器，存储正在使用的程序和数据。- 访问速度比辅存快，但比寄存器慢。- 易失性存储器，电源关闭后数据会丢失。                            | - 存储操作系统、应用程序和当前处理的数据。- 提供CPU快速访问数据和指令的能力。- 程序运行时，CPU从主存中读取指令和数据进行处理。 |
| **辅存（外存）** | - 长期存储设备，如硬盘、固态硬盘、光盘、磁带等。- 访问速度比主存慢，但具有大容量和非易失性特点。                                                    | - 长期存储操作系统、应用程序和用户数据。- 提供大容量存储空间，适合存储大量数据和文件。- 用于备份和归档重要数据。               |

### 为什么有这些内存模块？

| **内存模块** | **原因**                                                                       |
| :----------: | :----------------------------------------------------------------------------- |
| **寄存器**   | - 速度最快，数量有限，造价昂贵。- 仅存储最常用的临时数据和指令。               |
| **主存**     | - 较大的存储空间，速度适中，成本适中。- 主要存储运行时的数据和程序。           |
| **辅存**     | - 速度最慢，但容量最大，非易失性，成本最低。- 存储大量数据和长时间保存的信息。 |

### 层次化存储体系

| **存储层次** | **特点**               | **访问顺序** |
| :----------: | :--------------------- | :----------: |
| **寄存器**   | - 速度最快，容量最小。 |      1       |
| **主存**     | - 速度适中，容量较大。 |      2       |
| **辅存**     | - 速度最慢，容量最大。 |      3       |

这种层次化的存储结构使得计算机能够在合理的成本下实现高效的数据处理和存储。

### 主存根据是否易丢失来区分

| **类型** | **概念**                                                                                          | **功能与用途**                                                                     | **所属类别** |
| -------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------ |
| **RAM**  | - 易失性存储器，电源关闭后数据丢失。- 允许快速读写任意地址的数据。- 分为DRAM和SRAM。              | - 存储当前使用的程序和数据。- 提供快速数据访问能力。- 支持操作系统和应用程序运行。 | 主存（内存） |
| **ROM**  | - 非易失性存储器，电源关闭后数据仍然保存。- 数据通常只能读取不能写入。- 包括PROM、EPROM和EEPROM。 | - 存储固件和永久性数据。- 提供系统初始化和硬件控制基本指令。- 用于计算机启动时。   | 主存（内存） |

## 处理单元

| Unit | Full Name                   | Desc                  |
| ---- | --------------------------- | --------------------- |
| CPU  | Central Processing Unit     | 组成: 控制, 存储, 计算        |
| GPU  | Graphic Processing Unit     | 工作内容: 图像              |
| DPU  | Data Processing Unit        | 工作内容: 虚拟化, 网络, 存储, 安全 |
| APU  | Accelerated Processing Unit |                       |

## 内存类型

![[memory_buffer 2025.excalidraw#^frame=memory|700]]

| Type[^5] | Full Name            | Deac                                                                      |
| -------- | -------------------- | ------------------------------------------------------------------------- |
| RAM      | random access memory | 1. 与CPU直接交换数据<br>2. 俗称的内存条<br>3. 电源关闭时不能保存数据      |
| ROM      | read only memory     | 1. 用作永久保存<br>2. 只能读，不能写<br>3. 存放基础数据和程序，如BIOS ROM |
| Cache    | -                    | 1. 位于CPU与RAM之间                                                       |

### Memory Save

1. swap: 将进程不常用的内存交换到磁盘中
2. zRAM: 将进程不常用的内存压缩存储在内存某个区域，无 I/O 操作

### Memory Usage

![[memory_buffer 2025.excalidraw#^frame=memory usage|600]]

| 名称[^6] | 全称                  | 含义                                                 |
| -------- | --------------------- | ---------------------------------------------------- |
| VSS      | Virtual Set Size      | 占用的虚拟内存的大小(包括共享库所占用的内存)         |
| RSS      | Resident Set Size     | 实际上占用的物理内存的大小(包括共享库占用)           |
| PSS      | Proportional Set Size | 实际上占用的物理内存的大小(比例分配共享库占用的内存) |
| **USS**  | Unique Set Size       | 进程独自占用的物理内存(不包括共享库占用的内存)       |

1. Measure
   1. `procrank`[^7]

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

![[memory_buffer 2025.excalidraw#^frame=buffer_core_logic]]

### cache #cache

#### 与内存的相互关系

![[memory_buffer 2025.excalidraw#^frame=skyview|700]]

#### 内存的相关操作

![[memory_buffer 2025.excalidraw#^frame=flow_diagram|700]]

#### 各缓存操作的功能和作用

| **操作**          | **功能**                                                   | **作用**                                                 |
| ----------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| **Clean**         | 将缓存中已修改的数据写回主存，保持数据一致性。             | 确保主存中的数据是最新的，防止数据丢失或不一致。         |
| **Invalidate**    | 将缓存中的某个条目标记为无效，使缓存重新加载主存中的数据。 | 保证数据一致性，特别是在多处理器系统中。                 |
| **Flush**         | 将所有脏数据写回主存，并使缓存中的所有条目失效。           | 确保所有数据同步到主存，常用于系统关机、重启等操作。     |
| **Write-Back**    | 数据修改时仅在缓存中更新，替换或刷新时才写回主存。         | 减少写操作，提高性能。                                   |
| **Write-Through** | 数据修改时立即写回主存。                                   | 确保主存数据总是最新的，简化一致性管理，但可能降低性能。 |
| **Prefetch**      | 预先加载主存中的数据到缓存中。                             | 减少内存访问延迟，提高访问速度。                         |
| **Evict**         | 将某个缓存条目移出缓存，为新数据腾出空间。                 | 实现缓存管理策略，优化缓存使用效率。                     |

### buffer和cache的差异

| 特性             | 缓冲区（Buffer）                                   | 缓存（Cache）                              |
| ---------------- | -------------------------------------------------- | ------------------------------------------ |
| **用途**         | 协调不同速度或不同时间的操作，临时存储数据         | 存储频繁访问的数据，提高访问速度           |
| **位置**         | 通常位于内存或I/O设备之间                          | 通常位于CPU内部或靠近主存的位置            |
| **数据存储**     | 临时存储数据，数据使用后通常会被移除               | 存储频繁访问的数据，数据可能会被多次使用   |
| **数据管理策略** | FIFO（先进先出）或循环队列                         | LRU（最近最少使用）、LFU（最少频繁使用）等 |
| **目的**         | 提高数据传输效率，协调生产者和消费者之间的速度差异 | 减少数据访问延迟，提高系统性能             |
| **使用场景**     | I/O操作、多媒体处理、网络传输等                    | CPU缓存、磁盘缓存、网页缓存等              |

### file和buffer的差异

| 特征     | 文件 (File)          | 缓冲区 (Buffer)    |
| -------- | -------------------- | ------------------ |
| 存储位置 | 存储在存储设备上     | 存储在内存中       |
| 类型     | 持久化数据           | 临时数据           |
| 操作     | 文件系统相关操作     | 读取、写入、处理等 |
| 生命周期 | 持续存在             | 临时存在           |
| 可持久化 | 是                   | 否                 |
| 管理方式 | 通过文件系统         | 编程接口和逻辑     |
| 访问方式 | 顺序访问、随机访问等 | 直接读写           |
| 存储单位 | 字节序列             | 字节序列           |

### 内存共享框架: DMA-BUF

- 是一个内存共享的通用框架, 专门解决跨进程, 跨硬件之间的内存共享问题
- 通过对buffer的封装, 使buffer可以像文件一样访问, 通过fd实现buffer的传递，共享
- 组成
  - exporter: 分配和管理buffer
  - importer: 使用buffer的使用者
    - ION Buffer & DMA-Buffer Heaps 都是基于DMA-BUF实现的内存分配/管理器, 其均为对exporter的封装
    - 设备目录 `dev/dma_heap/`

![[memory_buffer 2025.excalidraw#^frame=dma_buffer_structure|DMA-BUF 架构示意图|500]]

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

| 特征           | DMA-BUF Heap                 | ION                            |
| -------------- | ---------------------------- | ------------------------------ |
| 内存分配方式   | 由内核动态分配内存           | 由用户态驱动程序分配内存       |
| 内存共享能力   | 支持多个进程之间的内存共享   | 支持多个进程之间的内存共享     |
| 内存管理复杂度 | 较低，不需要专门的内存管理器 | 较高，需要用户态驱动程序管理   |
| 性能影响       | 较小，内核级别的操作         | 较大，涉及用户态和内核态切换   |
| 系统集成       | 部分 Linux 内核版本支持      | Android 平台默认的内存管理方案 |

> - DAM-BUF: 内存共享的通用框架; 既不是DMA, 也不是Buffer
>   - 内存分配器:
>     `ION`/`DAM-Buffer-heaps`, 目前基本都会用DMA-Buffer-heaps, 其优势是可以做进程权限设置
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

| 特性           | GraphicBuffer                    | ANativeWindowBuffer        | AHardwareBuffer                  |
| -------------- | -------------------------------- | -------------------------- | -------------------------------- |
| 实现和用途     | 用于图形渲染和图像处理           | 用于与原生窗口系统进行交互 | 用于跨进程共享硬件加速的图形数据 |
| 引入版本       | 较早引入                         | 较早引入                   | Android 8.0 引入                 |
| 共享机制       | 同一进程内部使用                 | 同一进程内部使用           | 跨进程直接共享                   |
| 主要接口和功能 | Android Framework 提供的类和接口 | Android NDK 提供的结构体   | Android Framework 提供的类和接口 |
| 典型应用场景   | 图形渲染、图像处理               | 原生窗口系统交互、绘图     | 跨进程图形数据共享               |

| 特性       | gralloc                        | DMA-BUF heap                       |
| ---------- | ------------------------------ | ---------------------------------- |
| 实现和用途 | Android 系统中的图形内存分配器 | Linux 内核中的 DMA 内存管理机制    |
| 功能       | 分配和管理图形数据的内存       | 允许设备之间共享内存               |
| 分配方式   | 用户空间调用系统服务或库来分配 | 内核空间在设备驱动程序中分配       |
| 共享机制   | 通常在同一进程内部共享         | 允许在不同设备之间共享             |
| 应用场景   | Android 图形渲染和图像处理     | 设备间高速数据传输，例如图形和视频 |

### Linux Space

| 空间名称                              | 描述                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| 用户空间 (User Space)                 | 用户程序执行的地址空间，包含应用程序和用户态的库函数。       |
| 内核空间 (Kernel Space)               | 内核执行的地址空间，包含操作系统内核及其核心功能和驱动程序。 |
| I/O 空间 (I/O Space)                  | 用于管理设备寄存器和控制设备数据传输的地址空间。             |
| 物理地址空间 (Physical Address Space) | 系统中的物理内存地址空间。                                   |
| 虚拟地址空间 (Virtual Address Space)  | 进程可用的地址空间，包括用户空间和内核空间。                 |
| DMA 空间 (Direct Memory Access Space) | 用于直接内存访问的地址空间，允许外部设备直接访问系统内存。   |

## BufferQueue

![[memory_buffer 2025.excalidraw#^frame=sequence|Buffer Queue]]

buffer的5种状态 -
[struct BufferState](https://android.googlesource.com/platform/frameworks/native/+/refs/heads/main/libs/gui/include/gui/BufferSlot.h)

- `FREE`,`DEQUEUED`,`QUEUED`,`ACQUIRED`,`SHARED`

```cpp
struct BufferState {
    uint32_t mDequeueCount;
    uint32_t mQueueCount;
    uint32_t mAcquireCount;
    bool mShared;
}
struct BufferSlot {
 sp<GraphicBuffer> mGraphicBuffer;
 EGLDisplay mEglDisplay;
 BufferState mBufferState;
 bool mRequestBufferCalled;
 uint64_t mFrameNumber;
 bool mAcquireCalled;
 // ......
}

class BufferQueue : public RefBase {
public:
    // 构造函数和析构函数
    BufferQueue();
    ~BufferQueue();

    // 生产者接口
    sp<IBufferQueueProducer> getProducerInterface();

    // 消费者接口
    sp<IBufferQueueConsumer> getConsumerInterface();

    // 其他成员函数和数据成员
private:
    // 内部实现细节
    Vector<BufferItem> mQueue; // queued buffer
    BufferSlot mSlots;
};

class IBufferQueueProducer : public IInterface {
public:
    // allocate buffer
    virtual status_t requestBuffer(int slot, sp<GraphicBuffer>* buf);
    virtual status_t dequeueBuffer();

    // fill buffer
    virtual status_t queueBuffer(int slot) = 0;

    // others
};

class IBufferQueueConsumer : public IInterface {
public:
    // acquire buffer
    virtual status_t acquireBuffer(sp<GraphicBuffer>* buf, int* slot) = 0;

    // release buffer
    virtual status_t releaseBuffer(int slot) = 0;

    // others
};
```

## Hal Buffer Manager(HBM)

[android 官方文档](https://source.android.com/docs/core/camera/buffer-management-api?hl=zh-cn)

![[file-20250116190628393.png|android-9|600]]

![[file-20250116190659865.png|android-10|600]]

- 目的: 节省内存消耗
- 方法:
  1. request中的controlMeta与buffers剥离开, 不同步下发
  1. 在HAL的末尾处(用到buffer的地方), 再下发buffers

## BufferQueue Intro

![[memory_buffer 2025.excalidraw#^frame=communication|Communication|600]]

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

1. [火遍全网的DPU，到底是个啥？](https://baijiahao.baidu.com/s?id=1741407351814338781&wfr=spider&for=pc)
2. [一文读懂APU/BPU/CPU/DPU/EPU/FPU/GPU等处理器](https://www.xjx100.cn/news/619002.html?action=onClick)
3. [DMA简介](https://blog.csdn.net/baidu_31437863/article/details/114824649)
4. [【STM32】DMA原理一文搞懂DMA](https://mp.weixin.qq.com/s?__biz=MzU1NjEwMTY0Mw==&mid=2247579317&idx=1&sn=13782b6f38b8277d345b6ecc2343425a&chksm=fbc9cfd1ccbe46c71534d1c8f545bdc41827132d6a32a4cfdeafa384b59c97649aca5244a5bb&scene=27)
5. [内存管理 —— ION](https://kernel.meizu.com/2017/11/18//memory%20management%20-%20ion.html/)
6. [Camera Buffer Management](https://zhuanlan.zhihu.com/p/468033445)
7. [万字长文丨深入理解Linux进程间通信](https://zhuanlan.zhihu.com/p/551299533)
8. [Android 系统中AHardwareBuffer、ANativeWindowBuffer和GraphicBuffer的关系](https://deepinout.com/android-system-analysis/android-display-related/android-ahardwarebuffer-anativewindowbuffer-graphicbuffer-relationship.html#ftoc-heading-1)
9. [将 ION 堆转换为 DMA-BUF 堆](https://source.android.com/docs/core/architecture/kernel/dma-buf-heaps?hl=zh-cn)

[^1]: [Android 图形组件](https://source.android.com/docs/core/graphics?hl=zh-cn#android-graphics-components)

[^2]: [BufferQueue 学习总结](https://blog.csdn.net/hexiaolong2009/article/details/99225637#commentBox)

[^3]: [linux(栈回溯篇)](https://zhuanlan.zhihu.com/p/460686470)

[^4]: [DMA-BUF简单介绍](https://blog.csdn.net/u011795345/article/details/129306630)

[^5]: [内存、RAM、ROM、Cache的关系\_rom、ram是内存吗-CSDN博客](https://blog.csdn.net/m0_47221702/article/details/120428680)

[^6]: [Linux：VSS、RSS、PSS和USS的图解说明\_pss usss-CSDN博客](https://blog.csdn.net/whbing1471/article/details/105523704)

[^7]: [Using procrank to measure memory usage on embedded Linux | 2net.co.uk](https://2net.co.uk/tutorial/procrank)
