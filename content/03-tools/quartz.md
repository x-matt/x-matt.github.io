---
title: Quartz
---
## Install

> [!Warning] Warning
>The **newest** version of NodeJS may leads to compile problem

1. install NodeJS: `winget install OpenJS.NodeJS.LTS -v 20.9.0`
2. install sdk[^1]
	```bash
	git clone https://github.com/jackyzha0/quartz.git
	cd quartz
	npm i
	npx quartz create
	```

## Command

| Usage                 | Command                    |
| --------------------- | -------------------------- |
| build                 | `npx quartz build --serve` |
| sync & upload         | `npx quartz sync`          |
| update quartz version | `npx quartz update`        |

## Customize

1. Basic config info
	1. change title name
	2. ignore some floders & files
	3. change background color
	```tsx title="quartz/quartz.config.ts" {1, 10, 15}
    pageTitle: "✨ Coman",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian", "98-assets/excalidraw/*.md", "99-settings"],>)
    ...
    
    colors: {
	    lightMode: {
	        light: "#fbf7fd",
	        ...
		}
	}     
	```

2. Icon
	- `quartz\static\icon.png`

[^1]:[Welcome to Quartz 4](https://quartz.jzhao.xyz/)