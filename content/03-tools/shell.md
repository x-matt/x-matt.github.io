---
title: Shell
---

## Bash


## PowerShell[^1]

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

[^1]:[about_Profiles - PowerShell | Microsoft Learn](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_profiles?view=powershell-7.4#profile-types-and-locations)