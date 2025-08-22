---
title: Design
---
### Related Webs

| Type          | Web                                                                                                                                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color         | [Converting Colors](https://convertingcolors.com/)                                                                                                                                                                                                                                          |
| Icon          | [GrapheMica](https://graphemica.com/)<br>[Material Icons](https://fonts.google.com/icons)<br>[Vector Icons and Stickers](https://www.flaticon.com/)<br>[codicon](https://microsoft.github.io/vscode-codicons/dist/codicon.html)<br>[octicon](https://primer.style/design/foundations/icons) |
| Blog          | [Vonge](https://jazzed-kale.cloudvent.net/projects/)                                                                                                                                                                                                                                        |
| Design System | Microsoft - [Fluent 2 Design System](https://fluent2.microsoft.design/)<br>Google - [Material Design](https://m3.material.io/)                                                                                                                                                              |

### Wonderful color

| Range  | Color         | Light  | Middle | Heavy  | Desc          |
| ------ | ------------- | ------ | ------ | ------ | ------------- |
| Feishu | Green         | d9f5d6 | b7edb1 | 8ee085 |               |
|        | Purple        | ece2fe | cdb2fa | ad82f7 |               |
|        | Blue          | e1eaff | bacefd | 82a7fc |               |
|        | Yellow        | ffffcc | fffca3 | fff67a |               |
|        | Orange        | feead2 | fed4a4 | ffba6b |               |
|        | Red           | fde2e2 | fbbfbc | f98e8b |               |
|        | Grey          | ebecee | dddfe1 | dee0e3 |               |
| Others | pink          | b76287 |        |        |               |
|        | deep blue     | 073642 |        |        |               |
|        | dark blue     | 282c34 |        |        | one half dark |
|        | orange yellow | fedeb9 |        |        |               |
|        | light blue    | f4f4f5 |        |        |               |

### Mermaid

| Range    | Shape             | Color                                  |
| -------- | ----------------- | -------------------------------------- |
| I/O      | Parallelogram     | red - `fill:#fbbfbc,stroke:#f98e8b`    |
| SubGraph | Rounded rectangle | orange - `fill:#feebd3,stroke:#ffba6b` |

```mermaid
---
title: Color Sample
---
flowchart LR
    A1:::io@{ shape: lean-r, label: "In-Main" }
    A2:::io@{ shape: lean-r, label: "In-Aux" }
    Z:::io@{ shape: lean-l, label: "Out" }
    C1:::node@{shape: rounded, label: "Sat" }
    C2:::node@{shape: rounded, label: "Eis" }
    classDef io fill:#fbbfbc,stroke:#f98e8b
    style mivi fill:#feebd3,stroke:#ffba6b
  
    A1-->C1
    A2-->C1
    subgraph mivi
        C1-->C2
    end
    C2-->Z
```
