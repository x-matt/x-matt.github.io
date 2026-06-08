---
title: Quartz
---
## Install

> [!Warning] Warning
>- The **newest** version of NodeJS may leads to compile problem
>- Block NodeJS version: `winget pin add --id OpenJS.NodeJS.LTS --blocking`[^2]

1. install NodeJS: `winget install OpenJS.NodeJS.LTS -v 20.9.0`
2. install sdk[^1]
	```bash
	git clone https://github.com/jackyzha0/quartz.git
	cd quartz
	npm i
	npx quartz create
	```

## Command

| Usage                 | Command                                   |
| --------------------- | ----------------------------------------- |
| build                 | `npx quartz build --serve -d FOLDER_NAME` |
| sync & upload         | `npx quartz sync`                         |
| update quartz version | `npx quartz update`                       |

## Customize

1. Basic config info
	1. change title name
	2. ignore some floders & files
	3. change background color
	```tsx title="quartz/quartz.config.ts" {1, 10, 15}
    pageTitle: "Colin",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian", "98-assets/excalidraw/*.md", "99-settings", "-1. Capture", "0. PeriodicNotes"],
    ...
    
    colors: {
	    lightMode: {
	        light: "#ffffff",
	        ...
		}
	}     
	```

2. Icon
	- `quartz\static\icon.png`

## Further Development

| Type               | Desc                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| support excalidraw | [embed.excalidraw](https://www.emilebangma.com/Quartz/Quartz-Syncer-Docs/embed.excalidraw) |


[^1]:[Welcome to Quartz 4](https://quartz.jzhao.xyz/)
[^2]:[pin 命令 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/package-manager/winget/pinning#examples-1)