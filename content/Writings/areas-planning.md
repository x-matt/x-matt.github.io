---
title: Core Areas
type: area
domain: work
category: planning
status: active
priority:
review: daily
tags:
  - skyview
---

## Planning

### Tech

- [x] Memory ✅ 2026-08-29
- [x] Algo details ✅ 2026-08-29
- [ ] Driver
- [ ] Operation system

### Mind

- [ ] Weakness
- [ ] Job Planning

 ![[skyview 2025.excalidraw#^frame=skyview|800]]

## Model

### Data Flow

```text
┌──────────────────────────────┐
│ ① Identity                  │
│    我怎么称呼它？             │
│    ID / Path / Name          │
├──────────────────────────────┤
│ ② Reference                 │
│    我怎么访问它？             │
│    Pointer / FD / Handle     │
├──────────────────────────────┤
│ ③ Metadata                  │
│    我怎么理解它？             │
│    Format / Size / State     │
├──────────────────────────────┤
│ ④ Resource                  │
│    它实际占用了什么资源？      │
│    Memory / File / Device    │
├──────────────────────────────┤
│ ⑤ Data                      │
│    它里面实际是什么内容？      │
│    Pixels / Bytes / Samples  │
└──────────────────────────────┘
```

Camera Buffer For Example

```text
① Identity
   bufferId = 100

② Reference
   fd = 42
   addr = 0x7fxxxxxx

③ Metadata
   1920 × 1080
   NV12
   stride = 1920

④ Resource
   DMA memory allocation

⑤ Data
   YUV pixels
```