---
title: Shell
type: area
status: active
domain: work
category: tool
priority:
review:
tags:
---

## Bash

### Theme

#### ys theme

```bash title="~.oh-my-zsh\themes\ys.zsh-theme" {3, 6, 15}
# Mar 2013 Yad Smood

local gray_color="%{%F{242}%}"  # define 242 gray color

# VCS
YS_VCS_PROMPT_PREFIX1=" %{$gray_color%}on%{$fg[blue]%} "
YS_VCS_PROMPT_PREFIX2=":%{$fg[cyan]%}"
...
PROMPT="
%{$terminfo[bold]$fg[blue]%}#%{$reset_color%} \
%(#,%{$bg[yellow]%}%{$fg[black]%}%n%{$reset_color%},%{$fg[cyan]%}%n) \
${gray_color}@%{$reset_color%} \
%{$fg[green]%}%m \
${gray_color}in%{$reset_color%} \
%{$terminfo[bold]$fg[yellow]%}%~%{$reset_color%}\
${hg_info}\
```

## PowerShell[^1]

### Config file

- `notepad $PROFILE`
  ```powershell title="$HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1"
  # config oh-my-posh
  oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\ys.omp.json" | Invoke-Expression
  # add icons
  Import-Module -Name Terminal-Icons
  # alias
  Set-Alias boot 'adb reboot bootloader'
  function .. { Set-Location .. }
  function ... { Set-Location ... }
  function lt { Get-ChildItem | Sort-Object LastWriteTime | Format-Table -AutoSize }
  function l { Get-ChildItem -Force }
  function tosky {
      Remove-Item -Recurse -Force -Path "D:\skyview\core\*"
      Copy-Item -Recurse -Force -Path "D:\notes\brain\*" -Destination "D:\skyview\core\"
  }
  function tocloud {
      Remove-Item -Recurse -Force -Path "D:\notes\brain\*"
      Copy-Item -Recurse -Force -Path "D:\skyview\core\*" -Destination "D:\notes\brain\"
  }
  ```

### Delete unneeded command

- `code $env:USERPROFILE\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt`

### PSReadLine

![Transforming PowerShell experience with PSReadLine - YouTube](https://www.youtube.com/watch?v=Q11sSltuTE0)

The command search will based on the existed history command

```powershell
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
```

### Source Settings[^3]

查看当前winget源

```text
winget source list
```

删除原winget源

```text
winget source remove winget
```

修改为[中科大](https://zhida.zhihu.com/search?content_id=680128973&content_type=Answer&match_order=1&q=%E4%B8%AD%E7%A7%91%E5%A4%A7&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NjkwODMwNTEsInEiOiLkuK3np5HlpKciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjo2ODAxMjg5NzMsImNvbnRlbnRfdHlwZSI6IkFuc3dlciIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.9_N07Ae9HjJOY5-9Tdj4MM1qDoTxU0FUuwB3AACpiYk&zhida_source=entity)的源

```text
winget source add winget https://mirrors.ustc.edu.cn/winget-source
```

如果要恢复使用 Microsoft 官方源，可以使用以下命令进行重置：

```text
winget source reset winget
```

### Others

| command               | config                                    |
| --------------------- | ----------------------------------------- |
| `winget settings`[^2] | `"visual": { "progressBar": "rainbow" },` |
| `$PSVersionTable`     | get version                               |

```pwsh
function tosite {
    Remove-Item -Recurse -Force -Path "D:\site\personal\content\*"\
    Remove-Item -Recurse -Force -Path "D:\site\work\content\*"
    Copy-Item -Recurse -Force -Path "D:\notes\brain\personal\*" -Destination "D:\site\personal\content\"
    Copy-Item -Recurse -Force -Path "D:\notes\brain\work\*" -Destination "D:\site\work\content\"
}
function tocloud {
    Remove-Item -Recurse -Force -Path "D:\notes\brain\personal\*"
    Remove-Item -Recurse -Force -Path "D:\notes\brain\work\*"
    Copy-Item -Recurse -Force -Path "D:\site\personal\content\*" -Destination "D:\notes\brain\personal\"
    Copy-Item -Recurse -Force -Path "D:\site\work\content\*" -Destination "D:\notes\brain\work\"
}
```

## Tmux

| Usage                 | Command                |
| --------------------- | ---------------------- |
| vertical split window | `tmux split-window -v` |
| horizon split window  | `tmux split-window -h` |
| new windows           | `tmux new-window`      |

[^1]: [about_Profiles - PowerShell | Microsoft Learn](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_profiles?view=powershell-7.4#profile-types-and-locations)

[^2]: [settings command | Microsoft Learn](https://learn.microsoft.com/en-us/windows/package-manager/winget/settings)

[^3]: [如何解决 winget upgrade 尝试更新源失败的问题？ - 知乎](https://www.zhihu.com/question/556211877/answer/3575323001)
