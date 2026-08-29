---
title:
type: area
domain: knowledge
category:
status: active
review:
tags:
  - memory
  - buffer
  - dma
  - android
  - linux
---

# Memory & Buffer System

> [!abstract] Core Idea  
> 这一领域研究的核心不是单纯的「内存」。
> 
> 而是：
> 
> **数据存在哪里？如何寻址？如何分配？如何共享？如何搬运？如何同步？**
> 
> Data
>  │
>  ├── Where is it stored?
>  │       └── Memory
>  │
>  ├── How is it addressed?
>  │       └── MMU / IOMMU / IOVA
>  │
>  ├── How do I get a buffer?
>  │       └── Allocation
>  │
>  ├── How do multiple modules share it?
>  │       └── DMA-BUF
>  │
>  ├── Who moves/accesses the data?
>  │       └── DMA
>  │
>  └── How is access synchronized?
>          └── Fence / Sync

---

# 1. Overview

## 1.1 System Skyview

从 SoC 的角度：

```text
                    Compute Units
          ┌───────────┼───────────┐
          │           │           │
         CPU         GPU         ISP
          │           │           │
          └───────────┼───────────┘
                      │
                 Interconnect
                   NoC / Bus
                      │
               Memory Controller
                      │
                     DDR
```

从 Software / Buffer 的角度：

![[memory_buffer 2025.excalidraw#^frame=sw_skyview|500]]

> [!important]  
> `DMA`、`DMA-BUF`、`DMA-HEAP` 名字相似，但属于**不同问题域**。
> 
> |Component|核心问题|
> |---|---|
> |DMA|谁来搬运 / 访问数据？|
> |DMA-BUF|如何共享同一个 Buffer？|
> |DMA-HEAP|如何分配 DMA-BUF？|
> |ION|Legacy 的 DMA-BUF Heap Allocator Framework|
> |Gralloc|Android 如何请求和管理 Graphic / Hardware Buffer？|

---

# Part I — Memory

# 2. Memory Hardware

## 2.1 Memory Hierarchy

计算机采用层次化存储体系：

```text
Fast / Expensive / Small
        ▲
        │
    Register
        │
    L1 Cache
        │
    L2 Cache
        │
    L3 / LLC
        │
 On-chip SRAM
        │
   DRAM / DDR
        │
 Storage / UFS
        │
Large / Cheap / Slow
```

不同层级的核心权衡：

| Level      | Speed     | Capacity       | Cost / bit | Typical Usage               |
| ---------- | --------- | -------------- | ---------- | --------------------------- |
| Register   | Very High | Very Small     | Very High  | CPU execution               |
| Cache      | Very High | Small          | High       | Frequently accessed data    |
| SRAM       | High      | Small / Medium | High       | On-chip buffer / scratchpad |
| DRAM / DDR | Medium    | Large          | Medium     | Main Memory                 |
| UFS / SSD  | Low       | Very Large     | Low        | Persistent Storage          |

---

## 2.2 Register

Register 是处理单元内部最快的存储资源。

特点：
- 容量非常小
- 延迟最低
- 与处理单元紧密耦合
- 用于保存当前执行过程中的数据

常见类型：
- General Purpose Register
- Program Counter
- Stack Pointer
- SIMD / Vector Register

> Register 通常属于 Compute Unit 的微架构资源，而不是独立的 External Memory。

---

## 2.3 Cache

Cache 是位于 Compute Unit 与 Main Memory 之间的高速存储层。

典型结构：

```text
CPU
 │
 ├── L1 Cache
 │
 ├── L2 Cache
 │
 └── L3 / LLC
        │
        ▼
       DDR
```

主要目的：

> **减少访问 DDR 的平均延迟。**

Cache 通常使用 SRAM 实现。

因此：

```text
Cache ≠ SRAM
```

更准确的关系：

```text
SRAM
  │
  ├── Cache
  │
  └── Scratchpad / Local Memory
```

---

## 2.4 SRAM

SRAM：

```text
Static Random Access Memory
```

特点：
- 速度快
- 不需要像 DRAM 一样周期性刷新
- 面积大
- 单位容量成本高

常见用途：
- CPU Cache
- ISP Local Buffer
- DSP Local Memory
- NPU SRAM
- Hardware Scratchpad

---

## 2.5 DRAM / DDR

DRAM：

```text
Dynamic Random Access Memory
```

DDR：

```text
Double Data Rate DRAM
```

在手机 SoC 中：

> **DDR 是 CPU、GPU、ISP、NPU、DSP 等多个 Hardware Unit 共享的 Main Memory。**

典型访问路径：

```text
CPU / GPU / ISP / NPU
           │
           ▼
          NoC(Network on Chip)
           │
           ▼
   Memory Controller
           │
           ▼
          DDR
```

---

## 2.6 Memory Controller

Memory Controller 负责协调 SoC 对 DDR 的访问。

主要职责：
- Request Arbitration
- Memory Scheduling
- DRAM Timing Control
- Bandwidth Management
- QoS

多个 Hardware Unit 同时访问 DDR：

```text
CPU ───┐
GPU ───┤
ISP ───┼──► NoC ───► Memory Controller ───► DDR
NPU ───┤
DSP ───┘
```

因此：

> **DDR Performance 不只是 DDR Chip 本身的能力，还受到 Memory Controller 和 Interconnect 的影响。**

---

## 2.7 Storage

Storage 用于长期保存数据。

手机中典型：

```text
UFS: Universal Flash Storage
```

与 DDR 的区别：

|-|DDR|UFS|
|---|---|---|
|Purpose|Main Memory|Persistent Storage|
|Volatile|Yes|No|
|Latency|Low|Higher|
|Access|Byte / Memory Access|Block / File I/O|
|Typical Data|Runtime Data|File / App / Media|

---

# 3. Memory Management & Addressing

# 3.1 Virtual Memory

现代 OS 通常不会让 Application 直接操作 Physical Address。

Application 使用：

```text
Virtual Address
```

通过：

```text
MMU
```

转换：

```text
Virtual Address
      │
      ▼
     MMU
      │
      ▼
Physical Address
```

---

## 3.2 Virtual Address

每个 Process 通常拥有自己的 Virtual Address Space。

```text
Process A

0x0000 ──────────────► VA
                         │
                         ▼
                        MMU
                         │
                         ▼
                        PA
```

优点：
- Process Isolation
- Memory Protection
- Simplified Address Management
- Virtual Memory

---

## 3.3 Physical Address

Physical Address：

> 实际对应 Physical Memory 的地址。

例如：

```text
Physical DRAM

0x80000000
     │
     ▼
 Physical Pages
```

CPU Virtual Address：

```text
VA
 │
 ▼
MMU
 │
 ▼
PA
 │
 ▼
DDR
```

---

## 3.4 MMU

MMU：

```text
Memory Management Unit
```

主要职责：

- VA → PA Translation
- Memory Protection
- Page Table Walk
- Permission Check

---

## 3.5 IOMMU / SMMU

CPU 有：

```text
MMU
```

Device：

```text
ISP
GPU
NPU
DSP
```

通常需要：

```text
IOMMU
```

ARM 平台通常称：

```text
SMMU
```

基本关系：

```text
Device
  │
  ▼
 IOVA
  │
  ▼
IOMMU / SMMU
  │
  ▼
 Physical Address
  │
  ▼
   DDR
```

---

## 3.6 IOVA

IOVA：

```text
I/O Virtual Address
```

Device 通常不直接看到 CPU Virtual Address。

可以理解：

```text
CPU
VA
 │
 ▼
MMU
 │
 ▼
PA
```

而：

```text
Device
IOVA
 │
 ▼
IOMMU
 │
 ▼
PA
```

> [!important]  
> Device Address ≠ CPU Virtual Address
> 
> Device Address 也不一定直接等于 Physical Address。

这对于：
- ISP
- GPU
- Camera
- Video Codec

非常重要。

---

## 3.7 User Space vs Kernel Space

需要区分：

### Execution / Privilege Domain

```text
User Space
    │
    │ syscall
    ▼
Kernel Space
```

### Address Translation

```text
CPU VA
  │
 MMU
  │
 PA
```

### Device Address Translation

```text
IOVA
 │
IOMMU
 │
 PA
```

不要将：

```text
User Space
Kernel Space
Virtual Address
Physical Address
```

理解成完全同一个维度。

---

## 3.8 Swap

Swap：

> 将暂时不活跃的内存页面换出到 Storage。

```text
DDR
 │
 │ Memory Pressure
 ▼
Storage
```

优点：
- 扩展可用 Memory
缺点：
- Storage Latency 高

---

## 3.9 zRAM

zRAM：

> 在 RAM 中创建一个压缩的 Memory Region。

```text
Original Data
      │
      ▼
   Compress
      │
      ▼
    zRAM
```

特点：

- 不需要访问 Physical Storage
- 节省 Memory
- 需要 CPU Compression / Decompression

---

# 4. Memory Usage

## 4.1 Process Memory Metrics

![[memory_buffer 2025.excalidraw#^frame=memory usage|300]]

|Name|Full Name|Meaning|
|---|---|---|
|VSS|Virtual Set Size|Process mapped virtual memory|
|RSS|Resident Set Size|Currently resident physical memory|
|PSS|Proportional Set Size|Shared memory proportionally divided|
|USS|Unique Set Size|Memory uniquely owned by the process|

简单理解：

```text
VSS
│
├── Private Mapping
├── Shared Mapping
└── Not necessarily resident in RAM

RSS
│
└── Currently resident pages

PSS
│
└── Shared pages are proportionally counted

USS
│
└── Private physical memory only
```

---

## 4.2 Measurement

常见工具：

```text
procrank
```

用于查看 Android / Embedded Linux Process Memory Usage。

---

# Part II — Buffer

# 5. Buffer Basics

## 5.1 What is Buffer?

Buffer：

> **用于临时承载和传递数据的一块 Memory Region。**

例如 Camera：

```text
Sensor
   │
   ▼
Frame Buffer
   │
   ▼
 ISP
   │
   ▼
Output Buffer
   │
   ▼
 GPU / Display
```

Buffer 本身：

> 不等于某种特定 Hardware。

它可以位于：

- DRAM
- SRAM
- Device Local Memory

但在 Android Camera / Graphics 中：

> 通常讨论的是由 DRAM 支持的 Shared Buffer。

---

## 5.2 Buffer Lifecycle

一个典型 Buffer：

```text
Allocate
    │
    ▼
Configure
    │
    ▼
Fill / Write
    │
    ▼
Share
    │
    ▼
Consume / Process
    │
    ▼
Release
    │
    ▼
Reuse / Free
```

---

## 5.3 Buffer vs Cache

| -             | Buffer                             | Cache                            |
| ------------- | ---------------------------------- | -------------------------------- |
| Core Purpose  | Temporary data transport / storage | Reduce memory access latency     |
| Data Owner    | Explicitly managed                 | Mostly hardware / system managed |
| Lifetime      | Defined by software / pipeline     | Determined by cache policy       |
| Typical Usage | Camera frame                       | Frequently accessed data         |
| Management    | Explicit                           | Hardware / OS policy             |

核心区别：

> **Buffer 关注 Data Flow。**
> **Cache 关注 Access Performance。**

---

## 5.4 File vs Buffer

| -                | File             | Buffer                   |
| ---------------- | ---------------- | ------------------------ |
| Main Purpose     | Persistent data  | Runtime data             |
| Typical Location | UFS / SSD        | Memory                   |
| Lifetime         | Persistent       | Usually temporary        |
| Access           | File System / FD | Memory / Hardware Access |

注意：

> Buffer 也可能通过 File Descriptor 表示或传递，例如 DMA-BUF。

但：

```text
Buffer ≠ File
```

FD 只是 Linux 中一种：

> **Handle / Reference Mechanism**

---

# Part III — Buffer Allocation

# 6. Allocation

## 6.1 Core Question

Allocation 解决：

> **Where and how do I get a Buffer?**

不同场景：

```text
CPU Normal Memory
        │
      malloc
```

```text
Shared Hardware Buffer
        │
   DMA-HEAP / ION
```

```text
Android Graphic Buffer
        │
      Gralloc
```

---

## 6.2 malloc

`malloc()`：

> User Space 的通用 Memory Allocation API。

```text
Application
     │
     ▼
   malloc
     │
     ▼
 Process Virtual Memory
```

最终底层可能涉及：

- brk
- mmap
- Physical Page Allocation

但：

> `malloc()` 本身不是 DMA-BUF Allocation Framework。

---

## 6.3 ION (Legacy)

ION 是 Android 历史上广泛使用的：

> **Heap-based Shared Buffer Allocation Framework。**

核心概念：

```text
ION
 │
 ├── Heap
 │
 ├── Client
 │
 └── Handle
```

典型流程：

```text
User Space
    │
    ▼
  ION API
    │
    ▼
 ION Heap
    │
    ▼
 Allocate Buffer
    │
    ▼
 DMA-BUF
```

### Heap

Heap 表示不同类型的 Allocation Source。

不同平台可能有：

- System Heap
- CMA / Contiguous Memory
- Carveout
- Secure Heap
- Vendor Heap


> [!important]  
> 不要简单理解为：
> 
> ```text
> ION = Interprocess Communication
> ```
> 
> 对理解 Android Buffer Architecture 来说，更重要的是：
> > **ION 是历史上的 Heap-based Shared Buffer Allocation Framework。**

---

## 6.4 DMA-BUF Heaps

DMA-BUF Heaps 是 Linux 中用于：

> **从指定 Heap 分配 DMA-BUF Object 的 Framework。**

典型：

```text
/dev/dma_heap/
```

例如：

```text
/dev/dma_heap/system
```

基本流程：

```text
User Space
    │
    ▼
DMA-HEAP
    │
    ▼
Select Heap
    │
    ▼
Allocate Memory
    │
    ▼
Return DMA-BUF FD
```

### Important

DMA-HEAP：

```text
Allocation
```

DMA-BUF：

```text
Sharing
```

两者关系：

```text
DMA-HEAP
    │
 Allocate
    ▼
DMA-BUF
    │
 Share
    ▼
Multiple Devices
```

---

## 6.5 ION vs DMA-BUF Heaps

|-|ION|DMA-BUF Heaps|
|---|---|---|
|Position|Legacy Android Framework|Upstream Linux Framework|
|Allocation Model|Heap-based|Heap-based|
|Output|DMA-BUF|DMA-BUF|
|Userspace Interface|`/dev/ion`|`/dev/dma_heap/<heap>`|
|Extensibility|Vendor-specific differences common|More standardized|
|Status|Gradually deprecated|Modern approach|

> [!important]  
> ION 和 DMA-BUF Heaps 都可以理解为：
> 
> **Heap-based DMA-BUF Exporter / Allocator。**
> 
> 它们不是：
> 
> ```text
> ION → User Space Allocator
> DMA-HEAP → Kernel Allocator
> ```
> 
> 这种简单二分。

---

# 7. Gralloc

Gralloc：

> Android Graphics / Hardware Buffer Allocation Interface。

它解决的问题不是简单的：

> 「申请多少字节的 Memory」。

而是：

> **根据 Usage、Format、Size 等需求，为 Android Hardware Client 请求合适的 Buffer。**

例如：

```text
Width
Height
Format
Usage
```

这些 Usage 可能包括：

```text
GPU
Camera
Display
CPU
Video
```

典型关系：

```text
Application / Framework / HAL
             │
             ▼
           Gralloc
             │
      Allocation Policy
             │
             ▼
      Vendor Allocator
             │
             ├── DMA-HEAP
             │
             ├── Vendor Heap
             │
             └── Other Backend
             │
             ▼
            Buffer
```

> [!important]  
> Gralloc 和 DMA-HEAP 不属于同一层。
> 
> ```text
> Gralloc
>   ↓
> Allocation Policy / Interface
>   ↓
> Vendor Allocator
>   ↓
> DMA-HEAP / Vendor Backend
> ```

---

# Part IV — Buffer Sharing

# 8. DMA-BUF

## 8.1 What is DMA-BUF?

DMA-BUF 是 Linux Kernel 的：

> **Shared Buffer Framework。**

核心目的：

> 让多个 Device Driver / Subsystem / Process 能够访问同一个 Buffer，而不需要为每个 Hardware Unit 再复制一份。

例如：

```text
          One Buffer
              │
      ┌───────┼────────┐
      │       │        │
      ▼       ▼        ▼
     ISP     GPU      CPU
```

DMA-BUF 的核心不是：

```text
Move Data
```

而是：

```text
Share Buffer
```

---

## 8.2 DMA vs DMA-BUF

这是最容易混淆的地方。

|-|DMA|DMA-BUF|
|---|---|---|
|Type|Data Access / Transfer Mechanism|Kernel Buffer Sharing Framework|
|Core Question|Who moves/accesses data?|Who shares the same buffer?|
|Hardware|Yes|Mainly Kernel Software Framework|
|Move Data|Yes|No|
|Share Buffer|No|Yes|

因此：

> **DMA-BUF ≠ DMA Engine**

名字中的：

```text
DMA
```

表示该 Buffer Framework 主要服务于：

> Hardware DMA Access。

---

## 8.3 Exporter

Exporter：

> 创建并管理 DMA-BUF 的一方。

职责可能包括：

- Allocate Backing Memory
- Manage Buffer Lifetime
- Provide DMA-BUF Operations


例如：

```text
DMA-HEAP
    │
    ▼
Allocate Buffer
    │
    ▼
Export DMA-BUF
```

---

## 8.4 Importer

Importer：

> 使用已有 DMA-BUF 的 Device / Driver。

例如：

```text
DMA-BUF
    │
    ├── Exporter
    │
    └── Importer
          │
          ├── ISP
          ├── GPU
          └── Video Codec
```

Importer 不需要知道：

> Buffer 最初是如何分配的。

---

## 8.5 DMA-BUF FD

DMA-BUF 可以暴露为：

```text
File Descriptor
```

因此：

```text
Process A
    │
 DMA-BUF FD
    │
    ▼
Process B
```

可以通过 IPC 传递对同一个 Buffer 的 Handle。

注意：

> FD 是 Handle，不是 Buffer Data 本身。

---

## 8.6 Zero-copy

传统 Copy：

```text
ISP Buffer
    │
    │ Copy
    ▼
GPU Buffer
```

可能需要：

```text
DDR Read
+
DDR Write
```

DMA-BUF：

```text
        Same Buffer
             │
      ┌──────┴──────┐
      ▼             ▼
     ISP           GPU
```

可以减少：

```text
Memory Copy
```

这通常称为：

```text
Zero-copy
```

但要注意：

> Zero-copy 不代表系统完全没有任何 Memory Transaction。
> 
> 它通常指：
> 
> **避免在 Software Pipeline 中额外复制完整数据 Buffer。**

---

# Part V — Data Movement

# 9. DMA

## 9.1 What is DMA?

DMA：

```text
Direct Memory Access
```

核心思想：

> **让 DMA-capable Hardware 在较少 CPU 数据搬运参与的情况下直接访问 Memory。**

例如：

```text
CPU
 │
 │ Configure
 ▼
ISP
 │
 │ DMA Write
 ▼
DDR
```

或者：

```text
DDR
 │
 │ DMA Read
 ▼
GPU
```

---

## 9.2 Why DMA?

没有 DMA：

```text
CPU
 │
 │ Read
 ▼
Source
 │
 │ CPU Copy
 ▼
Destination
```

CPU 需要参与大量 Data Copy。

使用 DMA：

```text
CPU
 │
 │ Configure
 ▼
DMA-capable Hardware
 │
 │
 ▼
Memory / Device
```

CPU 可以：

- Configure
- Submit
- Handle Completion

而不需要参与每一个 Data Transfer。

---

## 9.3 DMA 不一定意味着独立 DMA Controller

初学时常见：

```text
CPU
 │
 ▼
DMA Controller
 │
 ▼
DDR
```

但 SoC 中更一般的理解是：

> **Hardware Unit 本身可能就是 Bus Master / DMA-capable Device。**

例如：

```text
ISP
 │
 │ AXI Transaction
 ▼
NoC
 │
 ▼
Memory Controller
 │
 ▼
DDR
```

因此：

```text
DMA
```

更应该理解为：

> **Device Direct Memory Access Capability / Mechanism**

而不只是某一个独立的 DMA Controller。

---

## 9.4 CPU Copy vs DMA

### CPU Copy

```text
Source
   │
   ▼
  CPU
   │
   ▼
Destination
```

例如：

```cpp
memcpy(dst, src, size);
```

特点：
- CPU 参与
- 占用 CPU Execution Resource
- 对小数据可能足够高效

---

### DMA

```text
CPU
 │
 │ Configure
 ▼
Device / DMA Engine
 │
 │
 ▼
Source ─────────► Destination
```

特点：

- CPU 不需要执行每一个 Copy Instruction
- 适合大数据 / Streaming Data
- 常用于 Camera / Display / Video

---

# Part VI — Cache & Coherency

# 10. Cache

## 10.1 Memory Relationship

![[memory_buffer 2025.excalidraw#^frame=skyview|500]]

---

## 10.2 Cache Operations

![[memory_buffer 2025.excalidraw#^frame=flow_diagram|700]]

|Operation|Meaning|
|---|---|
|Clean|将 Dirty Cache Line 写回 Memory|
|Invalidate|使 Cache Line 失效|
|Clean + Invalidate|写回并失效|
|Write-Back|修改先保留在 Cache，之后写回|
|Write-Through|修改同时写入下一级 Memory|
|Prefetch|提前加载数据|
|Evict|移除 Cache Line|

> [!warning]  
> 不同 CPU Architecture / OS API 中：
> 
> ```text
> Flush
> ```
> 
> 的具体语义可能不同。
> 
> 因此工程中更推荐明确写：
> 
> ```text
> Clean
> Invalidate
> Clean + Invalidate
> ```

---

# 11. CPU ↔ Device Coherency

这是 Camera / DMA Buffer 中非常重要的问题。

## 11.1 CPU → Device

CPU 修改数据：

```text
CPU
 │
 │ Write
 ▼
CPU Cache
 │
 │ Clean
 ▼
DDR
 │
 │ DMA Read
 ▼
Device
```

如果 CPU 的 Dirty Data 还停留在 Cache：

```text
Device
```

直接从 DDR 读取时：

> 可能读到旧数据。

因此可能需要：

```text
Cache Clean
```

---

## 11.2 Device → CPU

Device 写入：

```text
Device
 │
 │ DMA Write
 ▼
DDR
```

但是：

```text
CPU Cache
```

可能仍保存旧数据。

因此：

```text
Device
 │
 ▼
DDR
 │
 │ Cache Invalidate
 ▼
CPU
```

CPU 再次访问时才能获取新数据。

---

## 11.3 Hardware Coherency

部分 SoC / Hardware 支持：

```text
Hardware Cache Coherency
```

因此：

> 并不是所有 DMA Access 都需要 Software 手动执行 Cache Clean / Invalidate。

实际行为取决于：
- CPU Architecture
- Interconnect
- IOMMU
- Device Coherency Capability
- Buffer Attributes


因此 Camera Platform Debug 时不能简单认为：

```text
DMA
=
Always Manual Cache Flush
```

---

# Part VII — Synchronization

# 12. Buffer Synchronization

共享 Buffer 之后，还需要解决：

> **什么时候可以访问？**

例如：

```text
ISP
 │
 │ Writing
 ▼
Buffer
 │
 │ Not Ready
 ▼
GPU
```

如果 GPU 提前读取：

> Data Race / Data Corruption

因此需要：

```text
Synchronization
```

---

## 12.1 Fence

Fence 表示：

> 某个 Asynchronous Hardware Operation 是否完成。

例如：

```text
ISP
 │
 │ Write Buffer
 ▼
Buffer
 │
 ▼
Release Fence
 │
 ▼
GPU Wait
 │
 ▼
Read Buffer
```

---

## 12.2 Producer / Consumer

典型模型：

```text
Producer
    │
    │ Fill Buffer
    ▼
 Buffer
    │
    │ Fence
    ▼
Consumer
```

Buffer System 通常需要明确：

```text
Buffer
 │
 ├── Owner
 ├── Producer
 ├── Consumer
 ├── State
 └── Fence
```

---

# Part VIII — Android Buffer System

# 13. Android Buffer Representation

Android 中同一块 Hardware Buffer 可能通过不同层的 Object 表示。

```text
Application / NDK
       │
       ▼
AHardwareBuffer
       │
       ▼
ANativeWindowBuffer
       │
       ▼
GraphicBuffer
       │
       ▼
native_handle_t
       │
       ▼
DMA-BUF FD / Other Handles
```

> [!note]  
> 上图表示概念关联，不代表所有 Android Version / Implementation 都严格按照固定对象转换路径。

---

## 13.1 native_handle_t

`native_handle_t`：

> Native Handle 的基础表示。

通常可以携带：

- File Descriptor
- Integer Metadata

例如：

```text
native_handle_t
      │
      ├── FD
      │     └── DMA-BUF FD
      │
      └── Integer Data
            ├── Metadata
            └── Other Handles
```

---

## 13.2 GraphicBuffer

`GraphicBuffer`：

> Android Framework / Native Graphics 中常用的 Graphic Buffer C++ Abstraction。

它通常描述：
- Width
- Height
- Format
- Usage
- Native Handle

---

## 13.3 ANativeWindowBuffer

`ANativeWindowBuffer`：

> Native Window Buffer Interface / Representation。

它与：

```text
Surface
BufferQueue
GraphicBuffer
```

等 Android Graphics Framework 紧密相关。

---

## 13.4 AHardwareBuffer

`AHardwareBuffer`：

> Android NDK 提供的 Hardware Buffer Abstraction。

用于让 Native Application / Library 使用：

- GPU
- Camera
- Hardware Accelerators

相关 Buffer。

> [!warning]  
> 不建议使用：
> 
> ```text
> GraphicBuffer = 同进程
> AHardwareBuffer = 跨进程
> ```
> 
> 这种方式理解。
> 
> 是否跨进程共享主要取决于：
> 
> - Binder / IPC
>     
> - Native Handle
>     
> - File Descriptor
>     
> - Underlying Buffer Sharing Mechanism
>     

---

## 13.5 关于类型转换

原笔记中的：

```cpp
reinterpret_cast
static_cast
```

等具体实现细节不建议作为该 Domain 的核心知识。

因为：
- 与 Android Version 强相关
- 与具体 Framework Implementation 强相关
- 容易将 ABI / Internal Implementation 当成通用 Architecture

建议单独建立：

```text
Android Graphics
└── GraphicBuffer Implementation
```

深入记录。

---

# 14. Gralloc

## 14.1 Role

Gralloc 位于 Android Hardware Buffer System 中。

可以理解：

```text
Client
  │
  │ Request
  ▼
Gralloc Interface
  │
  ▼
Vendor Allocator
  │
  ▼
Underlying Memory Backend
```

Client 提供：

```text
Width
Height
Format
Usage
```

Allocator 决定：

```text
How to allocate?
Which heap?
Which memory property?
```

---

## 14.2 Gralloc vs DMA-HEAP

|-|Gralloc|DMA-HEAP|
|---|---|---|
|Layer|Android|Linux Kernel / UAPI|
|Core Role|Hardware Buffer Allocation Interface / Policy|Allocate DMA-BUF from Heap|
|Input|Format / Usage / Size|Heap + Size|
|Output|Android Hardware Buffer Handle|DMA-BUF FD|
|Typical Usage|Graphics / Camera / Display|Shared DMA Buffer Allocation|

关系：

```text
Android Client
       │
       ▼
     Gralloc
       │
       ▼
Vendor Allocator
       │
       ▼
DMA-HEAP
       │
       ▼
 DMA-BUF
```

实际 Vendor Platform：

> Backend 不一定只有 DMA-HEAP。

---

# 15. BufferQueue

BufferQueue 是 Android Graphics System 中的：

> **Producer-Consumer Buffer Management Mechanism。**

核心：

```text
Producer
    │
    ▼
BufferQueue
    │
    ▼
Consumer
```

![[memory_buffer 2025.excalidraw#^frame=communication|Communication|400]]

---

## 15.1 Core Flow

```text
FREE
 │
 │ dequeue
 ▼
DEQUEUED
 │
 │ producer fills
 ▼
QUEUED
 │
 │ consumer acquires
 ▼
ACQUIRED
 │
 │ release
 ▼
FREE
```

BufferQueue 还支持：

```text
SHARED
```

等特殊状态。

---

## 15.2 State

参考：

[struct BufferState](https://android.googlesource.com/platform/frameworks/native/+/refs/heads/main/libs/gui/include/gui/BufferSlot.h)

常见状态：

```text
FREE
DEQUEUED
QUEUED
ACQUIRED
SHARED
```

---

## 15.3 Communication

![[memory_buffer 2025.excalidraw#^frame=sequence|Buffer Queue]]

BufferQueue 解决的核心不是：

> 如何分配 DDR。

而是：

> **如何管理 Producer 与 Consumer 对一组 Buffer 的 Ownership 和 Lifecycle。**

---

# Part IX — Camera Buffer System

# 16. Camera Buffer

Camera Pipeline：

```text
Sensor
   │
   ▼
 ISP
   │
   ▼
Camera Buffer
   │
   ├────────► GPU
   │
   ├────────► NPU
   │
   ├────────► CPU
   │
   └────────► Display
```

Camera Buffer 通常需要：

```text
Allocation
Sharing
DMA Access
Synchronization
Reuse
```

---

## 16.1 Camera Buffer Core Questions

### 1. 谁分配？

```text
Framework
HAL
Gralloc
Vendor Allocator
```

### 2. 谁拥有？

```text
Framework
HAL
ISP
Algorithm Node
```

### 3. 谁写？

```text
ISP
GPU
CPU
```

### 4. 谁读？

```text
GPU
CPU
Display
Encoder
```

### 5. 什么时候可用？

```text
Fence
Buffer State
Request Lifecycle
```

---

# 17. Camera HAL Buffer Flow

一个简化流程：

```text
Camera App
    │
    ▼
Camera Framework
    │
    ▼
Camera HAL
    │
    │ Buffer Request
    ▼
Gralloc / Allocator
    │
    ▼
Underlying Buffer
    │
    ▼
DMA-BUF / Handle
    │
    ├──────────────┐
    │              │
    ▼              ▼
   ISP            GPU
    │              │
    └──────┬───────┘
           │
           ▼
          DDR
```

实际 Pipeline 可能更加复杂：

```text
Sensor
  │
  ▼
IFE
  │
  ▼
IPE
  │
  ▼
GPU / CPU / Encoder
  │
  ▼
Display
```

但底层核心问题一致：

> **同一帧数据如何以最低 Copy Cost 在多个 Hardware Unit 之间传递。**

---

# 18. HAL Buffer Manager (HBM)

官方文档：

[Camera HAL Buffer Management API](https://source.android.com/docs/core/camera/buffer-management-api?hl=zh-cn)

![[file-20250116190628393.png|android-9|600]]

![[file-20250116190659865.png|android-10|600]]

HBM：

> Camera HAL 中用于优化 Buffer Allocation 和 Buffer Lifecycle 的机制。

核心目的：

> **降低不必要的 Buffer 常驻数量，从而减少 Memory Consumption。**

传统模式：

```text
Framework
    │
    │ Request
    ▼
Metadata + Buffers
    │
    ▼
HAL
```

HBM 模式：

```text
Framework
    │
    ▼
Metadata Request
    │
    ▼
HAL
    │
    │ Need Buffer Later
    ▼
Request Stream Buffer
```

核心思想：

> **Buffer 可以按需请求，而不一定在 Capture Request 一开始就全部提供给 HAL。**

因此：

> HBM 不只是简单的：
> 
> ```text
> controlMeta 与 buffer 分开下发
> ```
> 
> 更准确的是：
> 
> **Framework 与 HAL 之间改变了 Buffer Provisioning / Ownership 的时机。**

---

# Part X — End-to-End

# 19. Camera End-to-End Flow

下面用一个完整例子串起所有概念。

---

## Step 1 — Allocate

```text
Camera Framework / HAL
        │
        ▼
      Gralloc
        │
        ▼
Vendor Allocator
        │
        ▼
DMA-HEAP / Vendor Heap
        │
        ▼
      DMA-BUF
```

---

## Step 2 — Address Mapping

```text
DMA-BUF
   │
   ▼
Device Attachment
   │
   ▼
 IOVA
   │
   ▼
IOMMU / SMMU
   │
   ▼
  PA
```

---

## Step 3 — ISP Writes

```text
ISP
 │
 │ DMA Write
 ▼
NoC
 │
 ▼
Memory Controller
 │
 ▼
DDR Buffer
```

---

## Step 4 — Synchronization

```text
ISP
 │
 │ Complete
 ▼
Fence Signal
 │
 ▼
GPU / Consumer
```

---

## Step 5 — GPU Reads

```text
DMA-BUF
   │
   ▼
GPU Import
   │
   ▼
IOVA Mapping
   │
   ▼
GPU Access
```

---

## Full Flow

```text
                    Allocation
                        │
                        ▼
                 Gralloc / Allocator
                        │
                        ▼
                     DMA-BUF
                        │
            ┌───────────┼───────────┐
            │           │           │
            ▼           ▼           ▼
          CPU          ISP         GPU
            │           │           │
            │         DMA Write    DMA Read
            │           │           │
            └───────────┼───────────┘
                        │
                       NoC
                        │
                 Memory Controller
                        │
                       DDR
                        │
                  Synchronization
                        │
                       Fence
```

---

# Part XI — File Descriptor

# 20. File Descriptor

FD：File Descriptor

本质：

> Linux Process 中用于引用 Kernel Object 的整数 Handle。

常见：

```text
0 → STDIN
1 → STDOUT
2 → STDERR
```

在当前 Domain 中最重要的是：

```text
DMA-BUF FD
```

例如：

```text
DMA-BUF Object
       │
       ▼
 File Descriptor
       │
       ▼
Process A
       │
       │ IPC
       ▼
Process B
```

因此：

> FD 可以用于传递对同一个 Kernel Object / Buffer 的引用。

不需要在本笔记深入：

```text
open
read
write
pipe
dup
```

这些建议移动到：

```text
Linux
└── File Descriptor
```

---

# Part XII — Debug & Analysis

# 21. Memory Analysis

## Process Memory

```text
procrank
```

查看：
- VSS
- RSS
- PSS
- USS

---

## Performance Trace

```text
Perfetto
```

可用于分析：

- CPU
- GPU
- Scheduling
- Memory
- Camera Pipeline

官方：

[Perfetto](https://developer.android.com/tools/perfetto?hl=zh-cn)

---

## Buffer Debug

Camera / Graphics Buffer Debug 时重点关注：

```text
Buffer
 │
 ├── Size
 ├── Format
 ├── Usage
 ├── FD
 ├── Owner
 ├── Producer
 ├── Consumer
 ├── IOVA
 ├── Fence
 └── Lifetime
```

推荐 Debug 思路：

```text
1. 谁 Allocate？
        │
2. Buffer 在哪里？
        │
3. 谁持有 FD / Handle？
        │
4. 谁正在访问？
        │
5. IOMMU Mapping 是否正确？
        │
6. Fence 是否完成？
        │
7. Cache 是否一致？
```

---

# 22. Key Concept Summary

## 22.1 Core Map

```text
Memory & Buffer System
│
├── Memory Hardware
│   ├── Register
│   ├── Cache
│   ├── SRAM
│   ├── DRAM / DDR
│   └── Storage
│
├── Addressing
│   ├── Virtual Address
│   ├── Physical Address
│   ├── MMU
│   ├── IOVA
│   └── IOMMU / SMMU
│
├── Buffer
│   ├── Lifecycle
│   ├── Allocation
│   │   ├── malloc
│   │   ├── ION
│   │   └── DMA-HEAP
│   │
│   └── Sharing
│       └── DMA-BUF
│
├── Data Movement
│   ├── memcpy
│   ├── DMA
│   └── DMA-capable Device
│
├── Coherency
│   ├── Cache Clean
│   ├── Cache Invalidate
│   └── Hardware Coherency
│
├── Synchronization
│   ├── Fence
│   ├── Producer
│   ├── Consumer
│   └── Ownership
│
├── Android Buffer System
│   ├── Gralloc
│   ├── native_handle_t
│   ├── GraphicBuffer
│   ├── ANativeWindowBuffer
│   ├── AHardwareBuffer
│   └── BufferQueue
│
└── Camera Buffer System
    ├── Stream Buffer
    ├── Buffer Lifecycle
    ├── HAL Buffer Manager
    └── Hardware Pipeline
```

---

# 23. DMA Family

这是最容易混淆的一组概念。

|Name|Layer|Core Responsibility|
|---|---|---|
|DMA|Hardware / System Mechanism|Move / access data|
|DMA Engine|Hardware|Execute DMA transactions|
|DMA-capable Device|Hardware|Directly access memory|
|DMA-BUF|Linux Kernel|Share buffer|
|DMA-HEAP|Linux Kernel|Allocate DMA-BUF|
|ION|Legacy Android/Linux|Heap-based DMA-BUF allocation|
|DMA-BUF FD|Linux|Handle used to reference / transfer DMA-BUF|

最重要的关系：

```text
DMA-HEAP / ION
       │
       │ Allocate
       ▼
     DMA-BUF
       │
       │ Share
       ▼
ISP / GPU / NPU
       │
       │ DMA Access
       ▼
       DDR
```

---

# 24. Five Core Questions

以后遇到任何 Camera Buffer 问题，都可以从这五个问题分析：

## Q1. 数据存在哪里？

```text
DDR
SRAM
Cache
```

---

## Q2. Hardware 如何找到它？

```text
CPU
VA
 ↓
MMU
 ↓
PA
```

```text
Device
IOVA
 ↓
IOMMU
 ↓
PA
```

---

## Q3. Buffer 如何获得？

```text
malloc
ION
DMA-HEAP
Gralloc
```

---

## Q4. 如何共享？

```text
DMA-BUF
FD
Handle
```

---

## Q5. 如何搬运和同步？

```text
DMA
 ↓
Data Movement

Fence
 ↓
Synchronization
```

---

# References

## Official

- [Linux Kernel - DMA-BUF Documentation](https://www.kernel.org/doc/html/latest/driver-api/dma-buf.html)
- [Linux Kernel - DMA-BUF Heaps](https://www.kernel.org/doc/html/latest/userspace-api/dma-buf-heaps.html)
- [AOSP - Transition from ION to DMA-BUF Heaps](https://source.android.com/docs/core/architecture/kernel/dma-buf-heaps?hl=zh-cn)
- [Android Camera HAL Buffer Management API](https://source.android.com/docs/core/camera/buffer-management-api?hl=zh-cn)
- [Android Graphics Components](https://source.android.com/docs/core/graphics?hl=zh-cn)
- [BufferSlot.h](https://android.googlesource.com/platform/frameworks/native/+/refs/heads/main/libs/gui/include/gui/BufferSlot.h)

## Previous References

- [DMA简介](https://blog.csdn.net/baidu_31437863/article/details/114824649)
- [【STM32】DMA原理一文搞懂DMA](https://mp.weixin.qq.com/s?__biz=MzU1NjEwMTY0Mw==&mid=2247579317&idx=1&sn=13782b6f38b8277d345b6ecc2343425a&chksm=fbc9cfd1ccbe46c71534d1c8f545bdc41827132d6a32a4cfdeafa384b59c97649aca5244a5bb&scene=27)
- [内存管理 —— ION](https://kernel.meizu.com/2017/11/18//memory%20management%20-%20ion.html/)
- [Camera Buffer Management](https://zhuanlan.zhihu.com/p/468033445)
- [BufferQueue 学习总结](https://blog.csdn.net/hexiaolong2009/article/details/99225637)
- [Linux：VSS、RSS、PSS和USS](https://blog.csdn.net/whbing1471/article/details/105523704)
- [Using procrank to measure memory usage](https://2net.co.uk/tutorial/procrank)