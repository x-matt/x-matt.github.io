---
title: Chocolatey
author: Sean Matt
date: 2019-11-11 11:33:00 +0800
categories: [Tools]
tags: [chocolatey]
math: true
mermaid: true
image: /assets/img/posts/choco.jpg
---

## 安装choco
要求：Windows 7+ / Windows Server 2003+

以**管理员权限**运行cmd.exc或powershell.exe

cmd运行：

```shell
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

安装完成，运行choco 或 choco -?检查一下是否安装正确。


## 用choco安装软件
最好还是用管理员权限运行cmd.exe

```console
choco install <packagename> -y
cinst <packagename> -y
```

安装包的搜索社区[Chocolatey Gallery Packages](https://chocolatey.org/packages)

其他用法：
```console
choco install jdk8 googlechrome vscode 7zip //一次安装多个软件包
choco install nodejs.install --version 0.10.35 //安装指定版本
choco install dev-package.config //安装dev-package.config文件内描述的所有软件包
```
dev-package.config：
```xml
<?xml version="1.0" encoding="utf-8"?>
    <packages>
      <package id="jdk8" />
      <package id="googlechrome" version="71.0.3578.98" />
      <package id="vscode" />
      <package id="7zip" />
    </packages>
```
文件名称随意，但是扩展名必须是`.config`。

**通过`.config`的方式，就可以配置一个团队统一的开发环境，软件和版本都可以统一。这样可以为开发带来很多好处，避免由于开发环境不一样引起的各种不同错误。**

## 常用命令
[Command Official](https://chocolatey.org/docs/commands-reference#how-to-pass-options-switches)

- `choco list -li` 查看本地安装的软件
- `choco search nodejs` 查找安装包
- `choco outdated` 检查是否有旧版本软件
- `choco list -l --idonly > choco.txt` 导出已安装的软件列表