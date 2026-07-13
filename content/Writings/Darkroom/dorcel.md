---
title: Marc Dorcel
category: studio
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
        - studio == link("dorcel")
    order:
      - file.name
    image: note.cover
    imageAspectRatio: 0.7143
    cardSize: 150

```