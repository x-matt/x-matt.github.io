---
title: Tinto Brass
category: director
cover: "[[tinto.webp]]"
---
```base
filters:
  and:
    - file.inFolder("Writings/Darkroom")
formulas:
  last_modified: file.mtime.relative()
properties:
  formula.last_modified:
    displayName: updated
views:
  - type: cards
    name: Dorcel
    filters:
      and:
        - director == link("tinto")
    order:
      - file.name
    sort:
      - property: birth
        direction: ASC
    image: note.cover
    imageAspectRatio: 0.7143
    cardSize: 150

```
