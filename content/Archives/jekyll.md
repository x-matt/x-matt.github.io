---
title: Jekyll
tags:
  - archived/tools
---
System environment

- Windows 10
- chocolatey

## Stage[^1]

```powershell
cinst ruby --version=2.6.5.1      # install ruby
cinst msys2 --params "/NoUpdate"  # install msys2 without system update
Update-SessionEnvironment / refreshenv # refresh environment vars
ridk install 2 3                  # use ruby's ridk to update the system and install development toolchain
gem install jekyll                # install jekyll
gem install bundler               # install bundler
bundle install
bundle exec jekyll serve
```

## Attention
- change source
	```powershell {title="msys64\etc\pacman.d"}
	Server = https://mirrors.tuna.tsinghua.edu.cn/msys2/mingw/i686
	Server = https://mirrors.tuna.tsinghua.edu.cn/msys2/mingw/x86_64
	Server = https://mirrors.tuna.tsinghua.edu.cn/msys2/msys/$arch
	```
- update gem source：
	```powershell
	gem sources --add https://mirrors.tuna.tsinghua.edu.cn/rubygems/ --remove https://rubygems.org/
	```

[^1]:[Chocolatey Software | MSYS2 20241208.0.0](https://community.chocolatey.org/packages/msys2)