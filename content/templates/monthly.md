# Monthly Review:

[[<% tp.date.now("YYYY-MM", "P-1M") %>]] <== <button class="date_button_today">This Month</button> ==> [[<% tp.date.now("YYYY-MM", "P+1M") %>]]

---

```dataview
TABLE aliases
FROM "journal"
WHERE aliases != null
AND file.day.year = number(substring(this.file.name, 0, 4))
AND dateformat(date(file.name), "yyyy-MM") = replace(this.file.name, "M", "")
SORT file.day
```

---

```dataview
TABLE WITHOUT ID file.day.weekyear AS Week, highlights
FROM "journal/daily"
WHERE highlights != null
AND file.day.year = number(substring(this.file.name, 0, 4))
AND dateformat(date(file.name), "yyyy-MM") = replace(this.file.name, "M", "")
SORT file.day
```