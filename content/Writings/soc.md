---
title: SoC
type: area
domain: knowledge
category: hardware
status: active
review:
tags:
---
## System on Chip

![[soc 2026.excalidraw]]

## Mobile SoC 

| Hardware        | MediaTek      | Qualcomm    | Apple         |
| --------------- | ------------- | ----------- | ------------- |
| CPU             | ARM Cortex 为主 | ARM 架构 / 自研 | Apple 自研      |
| GPU             | ARM Mali 为主   | Adreno 自研   | Apple 自研      |
| NPU             | MTK APU       | Hexagon AI  | Neural Engine |
| DSP             | MTK DSP/专用单元  | Hexagon     | 专用单元          |
| ISP             | MTK ISP       | Spectra     | Apple ISP     |
| Camera Warp     | WPE 等         | IPE/BPS 等   | Apple 专用 IP   |
| Modem           | MTK           | Qualcomm    | 集成方案依平台       |
| SoC Integration | MTK           | QCOM        | Apple         |

### Spectra's Development

| 时间        | Snapdragon        | Spectra         | 核心演进                                   |
| --------- | ----------------- | --------------- | -------------------------------------- |
| **2016**  | 820               | 第一代             | **14-bit Dual ISP**                    |
| **2017**  | 835               | Spectra 180     | 第二代、多摄/深度                              |
| **2018**  | 845               | Spectra 280     | 新架构、CV增强                               |
| **2019**  | 855               | Spectra 380     | CV / AI协同增强                            |
| **2020**  | 865               | Spectra 480     | 更强 Dual ISP、8K等                        |
| **2021**  | 888               | **Spectra 580** | **首次 Triple ISP**                      |
| **2022**  | 8 Gen 1           | 18-bit Spectra  | **首次 18-bit ISP**(isp internal buffer) |
| **2023+** | 8 Gen 2 / 8 Gen 3 | Spectra         | **Cognitive ISP / AI语义处理**             |

## Hardware Evaluation

Hardware Evaluation
│
├── 1. Performance（性能）
│   ├── Throughput
│   ├── Latency
│   └── Benchmark Score
│
├── 2. Power（功耗）
│   ├── Dynamic Power
│   ├── Static Power
│   └── Peak / Average Power
│
├── 3. Energy Efficiency（能效）
│   ├── Performance / Watt
│   └── Energy / Task
│
├── 4. Resources（资源）
│   ├── Compute
│   ├── Cache / Memory
│   └── Bandwidth
│
└── 5. System Behavior（系统行为）
    ├── Thermal
    ├── Sustained Performance
    └── Utilization

### CPU

1. Frequency: CPU 每秒钟运行多少个 Clock Cycle
2. IPC（Instructions Per Cycle）: 每个 Clock Cycle 能完成多少条指令
3. CPI（Cycles Per Instruction）

### GPU

1. FLOPS / TFLOPS(Floating Point Operations Per Second)
2. Fill Rate: GPU 每秒可以处理多少 Pixel / Texture
3. Shader Throughput
4. Memory Bandwidth

| Category  | CPU                 | GPU                |
| --------- | ------------------- | ------------------ |
| 核心目标      | Low Latency         | High Throughput    |
| 主频        | GHz                 | MHz / GHz          |
| 基础性能      | IPC                 | FLOPS              |
| 并行能力      | Core Count          | Shader / ALU Count |
| Memory    | Cache + Latency     | Bandwidth + Cache  |
| Benchmark | Geekbench / SPEC    | 3DMark / GFXBench  |
| 功耗        | W                   | W                  |
| 能效        | Performance/W       | FPS/W / FLOPS/W    |
| 持续性能      | Sustained CPU Score | Sustained FPS      |
| 热         | Thermal Throttling  | Thermal Throttling |