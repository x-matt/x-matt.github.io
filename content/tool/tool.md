## Platform Common

### For debug

#### 小米编程助手

<https://xiaomi.f.mioffice.cn/docx/doxk4a2DWg50cGNUbKJbHKTntAb>

#### 看Log

1. [Klogg](https://klogg.filimonov.dev/)
1. [TextAnalysisTool.NET](https://textanalysistool.github.io/)
    - Mtk capture flow
    - Mtk stream flow
    - Open Camera

#### 看Pic

- YUV/Raw: [Vooya](https://www.offminor.de/downloads.html)
- 手机投屏电脑: [Vysor](https://www.vysor.io/)

### 切换python版本

1. 查看你系统中有哪些Python的二进制文件可供使用：`ls /usr/bin/python*`
1. 查看python替换版本信息：`update-alternatives --list python`

    如果出现 update-alternatives：error：no alternatives for python
    则表示Python 的替换版本尚未被update-alternatives 命令识别。想解决这个问题，我们需要更新一下替   换版本，将Python2.7和python3.5放入其中。执行以下命令：

    ```bash
    sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1
    sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.5 2
    ```

1. 使用以下命令随时在列出的python替换版本中任意切换。
	1. `sudo update-alternatives --config python`
	2. 输入“1”，就切换到2.7版本了，相反如果之前默认版本为2.7的输入“2”则切换到3.5版本了。

1. 现在再查一下默认Python版本：`python --version`

### Git/Repo
#repo

| 作用        | 命令                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------- |
| 统筹建立本地分支  | `repo start dev --all`                                                                                |
| 单独新建本地分支  | `git checkout -b <本地分支名> <远程主机名>/<远程分支名>`                                                             |
| 统一上传代码    | `repo upload .`                                                                                       |
| git单独上传代码 | `git push ssh://matao3@git.mioffice.cn:29418/quark/mtkcam-core HEAD:refs/for/bsp-matisse-s --no-thin` |
| 同步单个仓     | `repo sync -c quark/mtkcam-core`                                                                      |
| 克隆多个提交    | `git fetch --unshallow`  or  `git fetch --depth=10`                                                   |

1. 技巧
    1. 创建本地分支并链接到远程库
        1. `repo start dev --all` //建立本地与远程分支的链接，不需要知道远程分支名是什么就可以建立对应的链接
        1. `git branch --set-upstream-to=<远程主机名>/<远程分支名> <本地分支名>`
        1. `git checkout -b <本地分支名> <远程主机名>/<远程分支名>`
    1. `git stash` & `git stash pop`：有修改时临时缓存
    1. git commit 后接四类命令
        - git commit -m`xxx`
        - git commit -a -m`xxx` 将没1执行add命令的修改一 | 提交
        - git commit --amend *修改上一次提交信息
        - git commit -s 添加 Signed-off-by 信息
    1. `git log --start` : 查看每个commit的修改文件
    1. 批量操作
        - 删除分支 `repo forall -c “git branch | sed -e /^*/d | xargs git branch -D”`
        - 批量创建分支 `repo forall -c “repo start [分支名] –all”`
1. 提交代码
    1. `git checkout –b bsp-umi-q miui/bsp-umi-q -- track`   :新增分支连接到远程分支
    1. `git add 文件名` ：把本地代码修改增加到BUFFER中
    1. `git commit –s` ：增加提交代码的描述；`Ctrl+X →Y→enter`保存文件
    1. `repo upload .` :提交
       - 或者`git push origin HEAD:resf/for/mybranch`

### Mindmap

- web: <https://wanglin2.github.io/mind-map/#/>
- software: Xmind, mubu
- plugin: maekmap

## Windows

### 将所有程序默认以管理员模式运行

1. 进入注册表
1. 目录： `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System`
1. EnableLUA = 0
1. 重启电脑

### PowerShell

1. 命令
    - check版本: `$PSVersionTable`
1. 配置OhMyPosh
    1. 创建配置文件`New-Item -path $profile -type file –force`
    1. 配置文件中添加配置命令`oh-my-posh --init --shell pwsh --config ~/jandedobbeleer.omp.json | Invoke-Expression`

### 软件推荐合集

- 卸载工具：Geek Uninstaller `winget install GeekUninstaller.GeekUninstaller`
- 文献工具: Zotero `winget install zotero`

## Linux

1. `nautilus`：在终端打开文件夹
1. `md5sum`/`sha256sum`:查看.so/.iso文件的编码

### Shell

| 命令                     | 说明              |
| ---------------------- | --------------- |
| `cat /etc/shells`      | 在检查下系统的 shell   |
| ~/.oh-my-zsh           | oh-my-zsh 的安装目录 |
| ~/.zshrc               | Zsh 的配置文件位置     |
| chsh -s /bin/zsh root  | zsh为默认shell     |
| chsh -s /bin/bash root | bash为默认shell    |

### Plugins

- 自带的：
  - git
  - z
  - vscode
  - adb
  - sudo
- 三方：
  - zsh-autosuggestions: `git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
  - zsh-syntax-highlighting: `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`

### 软件推荐

- exifTool: [完全入门指南](https://www.rmnof.com/article/exiftool-introduction/)
- [terminator](https://gnome-terminator.org/)

### Zotero

1. **下载**: 下载`tar.bz2`结尾的文件
2. **解压**: 挪到opt文件夹 `sudo cp -r Zotero_linux-x86_64/ /opt/`
3. **安装**: 给相关文件添加执行权限
	```bash
	sudo chmod +x zotero
	sudo chmod +x zotero-bin
	sudo chmod +x set_launcher_icon
	```
4. **运行**: `sudo ./set_launcher_icon` & `./zotero`
5. 添加快捷方式
	1. `cp zotero.desktop ~/.local/share/applications`
	2. 修改执行文件地址 `Exec=bash /opt/Zotero_linux-x86_64/zotero`

## VSCode相关

### VSCode快捷键

| 快捷键                | 说明            |
| ------------------ | ------------- |
| `Ctrl+Shift+K`     | 删除行           |
| `Ctrl+Home`        | 到达文件首部        |
| `Ctrl+End`         | 到达文件尾部        |
| `Ctrl+Shift+\`     | 在一对括号之间跳转     |
| `Ctrl+Enter`       | 从下一行重新开始      |
| `Ctrl+Shift+Enter` | 从上一行重新开始      |
| `Alt+上下方向键`        | 将当前行整体上下移动    |
| `Ctrl+Shift+o`     | 打开所有函数        |
| `Ctrl+Tab`         | 在最近打开的文件之间跳转  |
| `Ctrl+Shift+A`     | 整段注释          |
| `Alt+Shift+I`      | 多行代码的最后一行创建光标 |
| `Ctrl+D`           | 选中最近的同样的字符    |

### 插件推荐

1. todo tree
1. trailing spaces

### Markdown Preview Enahanced

1. codeBlock中自动换行
    1. `ctrl + shift +p` -> customize css
    1. 添加如下code

        ```css
        pre, code {
          white-space: pre-wrap;
        }
        ```

1. [使用Admonition功能](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)
    - type
      - note
      - abstract
      - info
      - tip
      - success
      - question
      - warning
      - failure
      - danger
      - bug
      - example
      - quote
    - sample

		```bash
		!!! note This is the admonition title
			This is the admonition body
		```

1. 修改css文件
    1. 调用命令 `ctrl+shift+p`->`MPE: Customize CSS`
    1. 调整image的位置
		```less
		img {
		  max-width: 50%;
		  // 图片居中
		  display: block;
		  margin: 0 auto;
		}
		```

### Todo Tree

```json
"todo-tree.general.statusBar": "total",
"todo-tree.filtering.excludeGlobs": ["**/node_modules", "*.xml", "*.XML"],
"todo-tree.filtering.ignoreGitSubmodules": true,
"todo-tree.tree.showCountsInTree": true,
"todo-tree.highlights.customHighlight": {
    "BUG": {
      "icon": "bug",
      "foreground": "#F56C6C",
      "type": "line"
    },
    "FIXME": {
      "icon": "flame",
      "foreground": "#FF9800",
      "type":"line"
    },
    "TODO":{
      "icon": "check-circle",
      "foreground": "#e6d330",
      "type":"line"
    },
    "[ ]":{
      "icon": "dot-fill",
      "foreground": "#e6d330",
      "type":"tag"
    },
    "[x]":{
      "icon": "dot-fill",
      "foreground": "#258512",
      "hideFromTree": true,
      "type":"tag"
    },
    "[m]":{
      "icon": "dot-fill",
      "foreground": "#0a978b",
      "type":"tag"
    },
    "[w]":{
      "icon": "dot-fill",
      "foreground": "#6cc505",
      "type":"tag"
    },
    "HACK":{
      "icon": "versions",
      "foreground": "#E040FB",
      "type":"line"
    },
    "XXX":{
      "icon": "unverified",
      "foreground": "#E91E63",
      "type":"line"
    }
  },
  "todo-tree.general.rootFolder": "${workspaceFolder}",
  "todo-tree.general.tags": [
    "[ ]",
    "[x]",
    "[w]",
    "[m]",
    "TODO",
    "BUG",
    "FIXME",
    "HACK",
    "XXX"
  ],
```

- icon的参考网址:
    1. [codicon](https://microsoft.github.io/vscode-codicons/dist/codicon.html)
    1. [octicon](https://primer.style/design/foundations/icons)

## 配置文件

### Ubuntu(~/.bashrc)

终端运行`alias`查看所有设定的别名
```bash
##### start Custom #####

# General
## to dir
alias work='cd ~/zone'
alias ssd='cd /ssd'
alias out='cd out/target/product/'
alias tobash='cd ~/Documents/Notes/bash'
alias totrace='cd ~/Documents/trace'
### project l11
alias codel11='cd /ssd/matisse'
alias debugl11='cd ~/zone/matisse'
alias flashl11='cd ~/Documents/flashPackage/l11_matisse'
## log related
alias logc='adb logcat -c'
alias logbig='adb logcat -G 256M'
alias operationmode='adb logcat | grep -Ei "operationmode|operatingmode"'
## camera
alias boot='adb reboot bootloader'
alias camkill='. ~/Documents/Notes/bash/kill_camera.sh'
alias sanity='adb pull sdcard/MIUI/BSPTESTREPORT/BSPTest_Report.html'
## others
alias npp='notepad-plus-plus'

# MTK hot key
alias camcore='cd vendor/mediatek/proprietary/hardware/mtkcam-core'
alias algoup='cd vendor/xiaomi/proprietary/algorithm_manager'
alias custom='cd vendor/mediatek/proprietary/custom'
alias logd='adb shell setenforce 0 && adb shell setprop persist.vendor.mtk.camera.log_level 3 && adb shell "pkill camera*"'

# Qcom hot key
alias camx='cd vendor/qcom/proprietary/camx'
alias chi='cd vendor/qcom/proprietary/chi-cdk'
# alias st_lmi='cd ~/lmi/packages/apps/MiCloudLib/android-sdk/platform-tools/systrace'
alias systrace='python systrace.py -b 20480 -t 5 -o systrace_1.html camera sched'
alias onlycamlog_enable='adb shell "echo enableAsciiLogging=1 >> /vendor/etc/camera/camxoverridesettings.txt"'
alias onlycamlog='adb shell rm /data/vendor/camera/*.txt && adb pull /data/vendor/camera && python merge_text_logs.py -o camera_log.txt -d ./camera'
alias logget='adb pull vendor/etc/camera/camxoverridesettings.txt'
# alias logset='cd ~/tmp && adb push camxoverridesettings.txt vendor/etc/camera'
alias logset='adb shell "echo logInfoMask=0x50098 >> /vendor/etc/camera/camxoverridesettings.txt" && adb shell "echo overrideLogLevels=0x15 >> /vendor/etc/camera/camxoverridesettings.txt"'
alias getcamx='adb shell cat /vendor/etc/camera/camxoverridesettings.txt | sed -e "s:.*=:`echo -e \"\033[34;1m&\033[0m\"`:g"'

##### end Custom #####
```

## 编译过程

1. `source build/envsetup.sh`
1. `lunch`
1. 针对不同项目选择不同数字标号
1. `make bootimage`  第一次需要先编译kernel
1. 进入 CMAX/CHI-CDK 的工作目录(建议先编译CHI，再编译CAMX)
1. 终端输入 `mm/mma` (一般mma编译时间较长,其会加载依赖项,一般第一次编译时执行该命令)
    >[理解Android编译命令](https://blog.csdn.net/zhengqijun_/article/details/80227927)

## 合并Patch

1. `diff -urN alps_pre alps >XXX.patch` ：生成PATCH
1. `patch -p1 < xxx.patch` ：到指定文件夹，运行patch

## [Grep](https://mp.weixin.qq.com/s?__biz=MzAxOTc1OTY4NA==&mid=2650855336&idx=1&sn=d19b4edc9359d1bcfa3bca0ead2fbd7b&chksm=80366083b741e9951040eb26c78acd588ac30eaf5dce74c369ff42b0fac2637676039e84973f&scene=21#wechat_redirect)

grep常用命令整理

1. 在文件中匹配正则表达式
	- 基础正则表达式：
> [!note]  说明
>- 后向引用：引用前面的分组括号中的模式所匹配到的字符
>- 分组括号中的模式匹配到的内容或被正则表达式引擎自动记录于内部的变量中：
>	1. 模式从左侧起，第一个左括号及与之匹配的右括号之间模式匹配到的内容
>	2. 模式从左侧起，第二个左括号及与之匹配的右括号之间模式匹配到的内容

| 符合          | 含义                                |
| ----------- | --------------------------------- |
| `^^`        | 锚定行首                              |
| `$`         | 锚定行尾                              |
| `.`         | 匹配任一一个字符                          |
| `*`         | 匹配零个或多个先前字符                       |
| `\?`        | 匹配其前面的字符0次或者1次；                   |
| `\+`        | 匹配其前面的字符1次或者多次；                   |
| `\{m\}`     | 匹配其前面的字符m次（\为转义字符）                |
| `\{m,n\}`   | 匹配其前面的字符至少m次，至多n次                 |
| `()`        | 将一个或多个字符捆绑在一起，当做一个整体进行处理，反向引用照常使用 |
| `[]`        | 匹配一个指定范围内的字符                      |
| `[^]`       | 匹配指定范围外的任意单个字符                    |
| `\<` / `\b` | 锚定词首                              |
| `\>` / `\b` | 锚定词尾（可用\<PATTERN\>：匹配完整单词）        |
| `\(\)`      | 将多个字符当做一个整体进行处理                   |

1. 参数说明

| 参数                                                      | 含义                                                              |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `"this" demo_file`                                      | 从单个文件中查找指定的字符串                                                  |
| `"this" demo_*`                                         | 从多个文件中查找指定的字符串                                                  |
| `-i`                                                    | 忽略大小写                                                           |
| `-w`                                                    | 查找全匹配,不包括子字符串                                                   |
| `-A,-B,-C`                                              | 来查看after/before/around 行 -A, 显示匹配后N行- -B, 显示匹配前N行- -C, 显示匹配前后N行 |
| `export GREP_OPTIONS='--color=auto' GREP_COLOR='100;8'` | 用GREP_OPTIONS来让查找的项醒目                                           |
| `-r`                                                    | 搜索所有的文件及子目录                                                     |
| `-v`                                                    | 过滤匹配项                                                           |
| `-c`                                                    | 计算匹配的数量                                                         |
| `-l`                                                    | 显示匹配的文件名                                                        |
| `-o`                                                    | 只显示匹配的字符串                                                       |
| `-n`                                                    | 显示行数                                                            |
| `-b`                                                    | 显示匹配的字符字节位置                                                     |
| `ps -ef \| grep ab[c]`                                  | ps+grep时不抓到自己的进程                                                |
| `-E`                                                    | 使用扩展的正则表达式                                                      |

`grep -Erain`

## Echo

```bash
echo -n # 不换行
echo `ifconfig`
echo “`ifconfig`”
echo -e # 转义字符
```

### 常用的转义字符

命令 | 说明
-----|---------------------------------------------------------------------
`\b` | 转义相当于按退格键（backspace），但前提是“\b”后面存在字符，具体效果参考下方示例
`\c` | 不换行输出，在“\c”后面不存在字符的情况下，作用相当于echo -n，具体效果参考下方示例
`\n` | 换行，效果看示例
`\f` | 换行，但是换行后的新行的开头位置连接着上一行的行尾，具体效果查看示例
`\v` | 与\f相同
`\t` | 转以后表示插入tab，即制表符，已经在上面举过例子
`\r` | 光标移至行首，但不换行，相当于使用“\r”以后的字符覆盖“\r”之前同等长度的字符，只看这段文字描述的话可能不容易理解，具体效果查看示例
`\\` | 表示插入“\”本身

## Cat

1. 命令格式
`cat [选项] [文件]`

1. 常用参数

| 参数                      | 描述                           |
| ----------------------- | ---------------------------- |
| `-A --show-all`         | 等价于 -vET                     |
| `-b --number-nonblank`  | 对非空输出行编号                     |
| `-e`                    | 等价于 -vE                      |
| `-E --show-ends`        | 在每行结束处显示 $                   |
| `-n --number`           | 对输出的所有行编号,由 1 开始对所有输出的行数编号   |
| `-s --squeeze-blank`    | 有连续两行以上的空白行，就代换为一行的空白行       |
| `-t`                    | 与 -vT 等价                     |
| `-T --show-tabs`        | 将跳格字符显示为 ^I                  |
| `-u`                    | (被忽略)                        |
| `-v --show-nonprinting` | 使用 ^ 和 M- 引用，除了 LFD 和 TAB 之外 |

1. 最后一行到第一行反向输出
`tac [选项] [文件]`

## Binutils

对二进制文件进行处理

### Readelf

1. 常用参数

| 参数   | 描述                                           |
| ---- | -------------------------------------------- |
| `-a` | Equivalent to -dhlnSs                        |
| `-d` | Show dynamic section                         |
| `-h` | Show ELF header                              |
| `-l` | Show program headers                         |
| `-n` | Show notes                                   |
| `-p` | Dump strings found in named/numbered section |
| `-S` | Show section headers                         |
| `-s` | Show symbol tables (.dynsym and .symtab)     |
| `-W` | Don't truncate fields (default in toybox)    |
| `-x` | Hex dump of named/numbered section           |

### addr2line[^3]

- 作用: 转换地址到文件名和行号
- 使用手册: `man addr2line`
    ```bash
    -a --addresses：在函数名、文件和行号信息之前，显示地址，以十六进制形式。
    -b --target=<bfdname>：指定目标文件的格式为bfdname。
    -e --exe=<executable>：指定需要转换地址的可执行文件名。
    -i --inlines ： 如果需要转换的地址是一个内联函数，则输出的信息包括其最近范围内的一个非内联函数的信息。
    -j --section=<name>：给出的地址代表指定section的偏移，而非绝对地址。
    -p --pretty-print：使得该函数的输出信息更加人性化：每一个地址的信息占一行。
    -s --basenames：仅仅显示每个文件名的基址（即不显示文件的具体路径，只显示文件名）。
    -f --functions：在显示文件名、行号输出信息的同时显示函数名信息。
    -C --demangle[=style]：将低级别的符号名解码为用户级别的名字。
    -h --help：输出帮助信息。
    -v --version：输出版本号。
    ```

## file

`file *.so` 可以用来确认so是 32bit还是64bit

```bash
$ file libcvface_api_32.so
libcvface_api_1.so: ELF 32-bit LSB shared object, ARM, EABI5 version 1 (SYSV), dynamically linked, interpreter /system/bin/linker, stripped

$ file libcvface_api_64.so
libcvface_api.so: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, stripped
```

## Dendron

1. 在使用paste image的时候
    - linux下面需要安装xclip软件
    - 使用`ctrl + alt +v` 完成图片的粘贴
2. 学习视频 [Youtube](https://www.youtube.com/watch?v=nfvx8rv77NA)

## Ubuntu小工具命令

1. find
1. locate
1. split

## Trace[🔗](https://blog.csdn.net/omnispace/article/details/77620667#t10)

### 分析

- [edge://tracing/](edge://tracing/)
- [https://ui.perfetto.dev/](https://ui.perfetto.dev/)

#### Frame

- 每一帧就显示为圆圈 - 1秒60帧(大约一帧16.6毫秒)
- 问题进程：
    1. UI Thread
    1. Render Thread

### 抓取

1. 直接命令行抓取
	 - 教程: [link](https://perfetto.dev/docs/quickstart/android-tracing#recording-a-trace-through-the-cmdline)
	```bash
	curl -O https://raw.githubusercontent.com/google/perfetto/main/tools/record_android_trace chmod u+x record_android_trace # See ./record_android_trace --help for more 
	./record_android_trace -o trace_file.perfetto-trace -t 30s -b 64mb sched freq idle am wm gfx view binder_driver hal dalvik camera input res memory
	```

#### 抓取步骤

1. 终端执行以下代码

    ```bash
    adb root && adb remount
    adb shell "echo vendor.debug.trace.perf=1 >> /system/build.prop"
    adb shell "echo traceGroupsEnable=0x100C0 >>/vendor/etc/camera/camxoverridesettings.txt"
    adb shell sync && adb reboot
    adb root
    adb shell "echo 1 > d/tracing/events/camera/enable"
    ```

1. 安装Android SDK
`sudo apt update && sudo apt install android-sdk`

1. 开始抓取systrace
一般执行以下命令就可以:

`python ~/Android/Sdk/platform-tools/systrace/systrace.py gfx camera view input sched freq video irq workq hal -b 20480 -t 5 -o trace.html`

1. 查看systrace
打开以下网站，加载之前生成的html就可以了`chrome://tracing`
>[!warning] 注意
>1. 需要注意的是systrace经常会抓不到完整的，常常需要多抓几次
>1. 如果不完整需要重复以上重新抓取

### 快捷键

1. 导航

| 导航操作 | 作用              |
| ---- | --------------- |
| w    | 放大，[+shift]速度更快 |
| s    | 缩小，[+shift]速度更快 |
| a    | 左移，[+shift]速度更快 |
| d    | 右移，[+shift]速度更快 |

1. 常用快捷键

| 常用操作 | 作用                      |
| ---- | ----------------------- |
| f    | 放大当前选定区域                |
| m    | 标记当前选定区域                |
| v    | 高亮VSync                 |
| g    | 切换是否显示60hz的网格线          |
| 0    | 恢复trace到初始态，这里是数字0而非字母o |
1. 一般快捷键

| 一般操作  | 作用                  |
| ----- | ------------------- |
| h     | 切换是否显示详情            |
| /     | 搜索关键字               |
| enter | 显示搜索结果，可通过← →定位搜索结果 |
| `     | 显示/隐藏脚本控制台          |
| ?     | 显示帮助功能              |

## [FFmpeg](https://www.ffmpeg.org/)

包含三大工具: ffmpeg.exe, ffplay.exe, ffprobe.exe

### ffmpeg.exe

- 用途: 用于编解码
- 工作流程
![[tool 2024-03-22 18.10.39.excalidraw|1200]]

#### streams 输出流信息

| 属性                          | 说明                   |
| --------------------------- | -------------------- |
| index                       | 流所在的索引区域             |
| Codec_name                  | 编码名                  |
| Codec_long_name;            | 编码全名                 |
| Codec_type                  | 编码类型                 |
| Codec_time_base             | 编码的时间戳计算基础单位         |
| Codec_tag_string            | 编码的标签数据              |
| width/height                | 视频的宽和高               |
| pix_fmt                     | 图像显示图像色彩格式           |
| level                       | 编码的level             |
| r_frame_rate/avg_frame_rate | 实际帧率/平均帧率            |
| time_base                   | 时间基数(用来做timestamp计算) |
| start_time                  | 起始时间                 |
| duration                    | 总时长                  |
| n_frames                    | 帧数                   |
| handle_name                 | 句柄名称                 |
| sample_fmt                  | 音频的原始采样格式            |
| sample_rate                 | 音频的采样率               |
| channels                    | 信道数目                 |

#### format 输出封装格式信息

属性             | 说明
-----------------|-------
nb_streams       | 流通道数
format_long_time | 封装格式全称
duration         | 总时长
bit_rate         | 码率
format_name      | 封装格式
start_time       | 起始时间
size             | 文件大小

#### ffmpeg拆分帧

```bash
ffmpeg -i *.mp4 -f image2 pic-%03d.jpeg
```

### ffprobe.exe

- 用途: 内容分析

XML、INI、JSON、CSV、FLAT

- colorspace表述说明[^4]
  - “full range” = “jpeg” = “pc” = “cg” = “high rgb”
  - “limited range” = “mpeg” = “tv” = “broadcast” = “low rgb”

#### 样例[^1][^2]

```bash
# 帧率，尺寸，帧数
ffprobe ***.mp4 -v error -select_streams v -show_entries stream=r_frame_rate,width,height,nb_frames
ffprobe ***.mp4  -loglevel fatal -show_streams -select_streams v -print_format json | grep -E "r_frame_rate|\"width|\"height|nb_frames|color"
```

### ffplay.exe

- 用途: 播放器

## Android

### adb

官方说明[🔗](https://developer.android.com/studio/command-line/adb#directingcommands)

作用           | 命令
-------------|------------------------------
查询设备       | adb devices -l
发送到特定设备 | adb -s device-a install a.apk
安装应用       | adb install
文件传送       | adb push/pull
停止adb服务    | abd kill-server
帮助           | adb --help

### [logcat](https://developer.android.com/studio/command-line/logcat)

#### 缓冲区

缓冲区 | 介绍
-------|-----------------------
main   | 用于存储大多数应用日志
system | 用于存储源自 Android 操作系统的消息
crash  | 用于存储崩溃日志
radio|包含无线装置/电话相关消息的缓冲区
events|已经过解译的二进制系统事件缓冲区消息
> 使用`-b`来选择

#### 输出格式

| 日志输出格式          | 说明                                          |
| --------------- | ------------------------------------------- |
| brief           | 显示优先级、标记以及发出消息的进程的 PID                      |
| long            | 显示所有元数据字段，并使用空白行分隔消息                        |
| process         | 仅显示 PID                                     |
| raw             | 显示不包含其他元数据字段的原始日志消息                         |
| tag             | 仅显示优先级和标记                                   |
| thread          | 旧版格式，显示优先级、PID 以及发出消息的线程的 TID               |
| threadtime（默认值） | **data-time-PID-TID-priority-tag:-message** |
| time            | 显示日期、调用时间、优先级、标记以及发出消息的进程的 PID              |
> 使用`-v`来选择

#### 过滤器

过滤日志输出

| 符号  | 说明                  |
| --- | ------------------- |
| `V` | 详细（最低优先级）           |
| `D` | 调试                  |
| `I` | 信息                  |
| `W` | 警告                  |
| `E` | 错误                  |
| `F` | 严重错误                |
| `S` | 静默（最高优先级，绝不会输出任何内容） |

> - 表达式：`tag:priority ...`
> - tag:感兴趣的标记
> - priority:最低优先级
>e.g.: `adb logcat ActivityManager:I MyApp:D *:S`

#### 选项说明

选项          | 说明
--------------|----------------
-b \<buffer\> | 选择缓冲区
-c            | 清除
-e \<expr\>   | 正则
-m \<count\>  | 输出\<count\>行后退出
-g            | 指定缓冲区大小并退出
-s            | 设置等级为silent
-v            | 设置日志的输出格式
-D            | 输出缓冲区之间的分割线
-G \<size\>   | 设置日志环形缓冲区的大小
--pid=\<pid\> | 仅输出来自给定PID的日志

## VIM

### vim和vi的区别

1. 搜索不同
    1. vi不支持正则
    1. vim支持正则
1. 脚语言不同
    1. vi没有自己的脚本预言，只是编辑工具
    1. vim有自己的脚本，可做二次开发
1. 共享不同
    1. vi配置性差，无法共线文件
    1. vim可以配置，vimrc可以共享

[^1]:[ffprobe常用命令](https://www.jianshu.com/p/e14bc2551cfd)
[^2]:[FFmpeg命令行工具-实用命令](https://www.jianshu.com/p/124aee284a61)
[^3]:[Linux addr2line 命令](https://blog.csdn.net/mayue_web/article/details/115335388)
[^4]:[记录一个ffmpeg解码生成YUV的 color range 问题](https://blog.csdn.net/tao475824827/article/details/124732658)
