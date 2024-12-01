# Weekly Review

<<[[<%tp.date.now("YYYY-[W]ww", -9)%>]] | [[<%tp.date.now("YYYY-MM")%>]] | [[<%tp.date.now("YYYY-[W]ww", 9)%>]]>>

## ## Notes Created This Week

```dataview
TABLE highlights
FROM "journal/daily"
WHERE highlights != null
AND file.day.year = number(substring(string(this.file.name), 0, 4))
AND file.day.weekyear = number(substring(string(this.file.name), 6, 8))
SORT file.day
```