---
title: Shell
---

## Bash

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
### Others

| command               | config                                  |
| --------------------- | --------------------------------------- |
| `winget settings`[^2] | "visual": { "progressBar": "rainbow" }, |


[^1]:[about_Profiles - PowerShell | Microsoft Learn](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_profiles?view=powershell-7.4#profile-types-and-locations)
[^2]:[settings command | Microsoft Learn](https://learn.microsoft.com/en-us/windows/package-manager/winget/settings)