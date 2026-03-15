---
title: "[Intune]Intunewinファイルであれこれする"
emoji: "📝"
type: "tech"
topics: ["intune", "technology"]
published: false
---

Intunewinファイルを使ってあれこれしているので備忘録として残しておく。

これを読む前に下記のブログに目を通すことを推奨。

https://qiita.com/ShinichiroKosugi/items/c69764daa18d212eeee2

レジストリの検出規則が分からない場合は下記に目を通すことを推奨

https://amano-yuruyuru.com/intune-registry-detection-rule

## ショートカットをデスクトップに作成しておくやーつ

```plain
#WshShellオブジェクトを作成
$shell = New-Object -ComObject WScript.Shell

#ショートカットへのオブジェクトを作成
$lnk = $shell.CreateShortcut("C:\Users\Default\Desktop\HelpCenter.url")

#リンク先パス設定
$lnk.TargetPath = "https://xxxxxxx"

#ショートカットを保存
$lnk.Save()

#ショートカットへのオブジェクトを作成
$lnk2 = $shell.CreateShortcut("C:\Users\Default\Desktop\MyApps.url")

#リンク先パス設定
$lnk2.TargetPath = "https://myapplications.microsoft.com/"

#ショートカットを保存
$lnk2.Save()
```

- どういったスクリプトか？
  - ユーザーのデスクトップにショートカットを作成する

- インストールコマンド
  - powershell.exe -executionpolicy remotesigned -file "xxxx.ps1"

- 検出規則
  - 手動規則

## Chocolateyを使っていろいろインストールするやーつ

```plain
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
choco install googlechrome -y
choco install googledrive -y
choco update all -y
```

- どういったスクリプトか？
  - Chocolateyを使ってアプリケーションをインストールする
  - インストールできるソフトウェアは下記から検索が可能

https://community.chocolatey.org/packages

- インストールコマンド
  - powershell.exe -executionpolicy remotesigned -file "xxxx.ps1"

- 検出規則
  - ファイル or レジストリ

## ローカルユーザーを作成する

```plain
@echo off
net user admin xxxxxx /add
wmic useraccount where Name="admin" set PasswordExpires=False
net localgroup "administrators" admin /add
net localgroup "users" admin /delete
exit
```

- どういったスクリプトか？
  - ローカルユーザー（管理者権限あり）を作成する

- インストールコマンド
  - xxxxx.bat

- 検出規則
  - スクリプト

```plain
$test = Get-LocalUser | select Name
if ($test.Name.Contains("admin")){
Write-Output "Detected"
exit 0
} else {
exit 1
}
```

以上。ときどき追加していきます。
