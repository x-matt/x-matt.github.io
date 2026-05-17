---
title: Diagram
---

## Mermaid

> [!Attention]
>
> - [ ] under class, can not using two `<`, such as `map<int, shared_ptr<Wrap>>`

### Class

1. Section
   1. All class & namespace list
   2. Special class declarations
   3. Links
   4. Appearance customization( ==obsidian can't support==)

### Gantt

Intro[^4]

```mermaid
gantt

dateFormat        YYYY-MM-DD
title             Test Mermaid
excludes weekdays 2023-01-10

section Stage One
    Completed task            :done,    des1, 2023-01-06,2023-01-08
    Active task               :active,  des2, 2023-01-09, 3d
    Future task               :         des3, after des2, 5d
    Future task2              :         des4, after des3, 5d

section Stage Two
    Completed task            :done,    des1, 2023-01-06,2023-01-08
    Active task               :active,  des2, 2023-01-09, 3d
    Future task               :         des3, after des2, 5d
    Future task2              :         des4, after des3, 5d
```

### Pic Chart

```mermaid
pie showData
    title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

### Mindmaps

```mermaid
mindmap
  root((mindmap))
    Origins
    Research
    Tools
```

### Timeline

```mermaid
timeline
    title Timeline

    section 17th-20th century
        Industry 1.0 : **
        Industry 2.0 : **
        Industry 3.0 : **

    section 21st century
        Industry 4.0 : **
        Industry 5.0 : **
```

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> First
    state First {
        [*] --> second
        second --> [*]
    }
```

### XYChart

```mermaid
---
config:
    xyChart:
        width: 900
        height: 600
    themeVariables:
        xyChart:
            titleColor: "#ff0000"
---
xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
```

### Packet

```mermaid
packet-beta
title UDP Packet
0-15: "Source Port"
16-31: "Destination Port"
32-47: "Length"
48-63: "Checksum"
64-95: "Data (variable length)"
```

## Bitfield

intro[^3]

## Ditaa

intro[^1]

## Markmap

intro[^2]

[^1]: [字符画——ditaa使用指南，文本格式下作图](https://zhuanlan.zhihu.com/p/429506479?utm_id=0)

[^2]: [JSON Options - markmap docs](https://markmap.js.org/docs/json-options)

[^3]: [wavedrom/bitfield: :cake: bit field diagram renderer](https://github.com/wavedrom/bitfield)

[^4]: [Gantt diagrams | Mermaid](http://mermaid.js.org/syntax/gantt.html)
