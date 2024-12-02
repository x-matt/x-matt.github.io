## Mermaid

[Mermaid 使用教程：从入门到精通](https://zhuanlan.zhihu.com/p/627356428)

### Gantt

官方说明: <http://mermaid.js.org/syntax/gantt.html>

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
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
```

### Timeline

```mermaid
timeline
    title Timeline of Industrial Revolution

    section 17th-20th century
        Industry 1.0 : Machinery, Water power, Steam <br>power
        Industry 2.0 : Electricity, Internal combustion engine, Mass production
        Industry 3.0 : Electronics, Computers, Automation

    section 21st century
        Industry 4.0 : Internet, Robotics, Internet of Things
        Industry 5.0 : Artificial intelligence, Big data,3D printing
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

## Bitfield

```bitfield {vspace=100}
[
  {name: 'IPO',   bits: 8},
  {               bits: 7},
  {name: 'BRK',   bits: 5, type: 4},
  {name: 'CPK',   bits: 1},
  {name: 'Clear', bits: 3, type: 5},
  {               bits: 8}
]
```

## Ditaa[^1]

## Markmap

[官方Doc](https://markmap.js.org/docs/json-options)

[^1]:[字符画——ditaa使用指南，文本格式下作图](https://zhuanlan.zhihu.com/p/429506479?utm_id=0)
