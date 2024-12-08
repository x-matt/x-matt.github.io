---
title: Passion
---

![[welcome.svg|PASSION|800]]

## Intro

### File structure

| Index | Name         | Desc                                              |
| ----- | ------------ | ------------------------------------------------- |
| 01    | [[life]]     | Summary of various knowledge and insights in life |
| 02    | [[work]]     | Summary of common knowledge related to work       |
| 03    | [[tools]]    | Some tools to improve efficiency                  |
| 10    | [[archived]] | Docs that be archived                             |

## Kanban

```mermaid
---
config:
  kanban:
    ticketBaseUrl: 'https://mermaidchart.atlassian.net/browse/#TICKET#'
---
kanban
  Todo
    [English]
    docs[Create Blog about the new diagram]
  [In progress]
    id6[Create renderer so that it works in all cases. We also add som extra text here for testing purposes. And some more just for the extra flare.]
  id9[Ready for deploy]
    id8[Design grammar]@{ assigned: 'knsv' }
  id11[Done]
    id5[define getData]
    id2[Title of diagram is more than 100 chars when user duplicates diagram with 100 char]@{ ticket: MC-2036, priority: 'Very High'}
    id3[Update DB function]@{ ticket: MC-2037, assigned: knsv, priority: 'High' }
  id12[Can't reproduce]
    id3[Weird flickering in Firefox]
```
