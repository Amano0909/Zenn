---
title: "[Intune]Intuneで検出規則を作成する際のレジストリの調べ方"
emoji: "📝"
type: "tech"
topics: ["intune", "technology"]
published: true
---

お疲れ様です。

IntuneでWin32アプリを作っているときに厄介というかしっかりと構成しなければいけないものに検出規則がありますよね。

検出規則にはいくつか指定方法があると思いますがレジストリを指定するとき
あれどのレジストリ指定すればいいんだっけ？
ってなりません。

僕も良くなるので今回は備忘録としてレジストリの調べ方を残しておきます。

## 対象となるレジストリ値

これは以下の3つが対象となります。

```plain
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
```

```plain
HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall
```

```plain
HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
```

## 具体的なコマンド

コマンドプロンプトを使います。

主に使うコマンドは「reg query」

検索したい文字列はGoogleの部分を適当に変更すれば大丈夫です。

https://learn.microsoft.com/ja-jp/windows-server/administration/windows-commands/reg-query

```plain
reg query "HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall" /s /f Google
```

```plain
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall" /s /f Google
```

```plain
reg query "HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall" /s /f Google
```

結果下記のように該当のレジストリが取れます。

```plain
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall\{6BBAE539-2232-434A-A4E5-9A33560C6283}
DisplayIcon REG_SZ C:\Program Files\Google\Drive File Stream\75.0.2.0\GoogleDriveFS.exe,0
DisplayName REG_SZ Google Drive
InstallLocation REG_SZ C:\Program Files\Google\Drive File Stream\75.0.2.0\GoogleDriveFS.exe
Publisher REG_SZ Google LLC
UninstallString REG_SZ C:\Program Files\Google\Drive File Stream\75.0.2.0\uninstall.exe
```

なので

```plain
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall\{6BBAE539-2232-434A-A4E5-9A33560C6283}
```

とかの値を使ってあげればOKです。

以上です。
