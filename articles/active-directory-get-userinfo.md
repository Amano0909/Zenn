---
title: "[Active Directory] 特定のコンテナのユーザー情報を取得する"
emoji: "📝"
type: "tech"
topics: ["active-directory", "powershell", "technology"]
published: false
---

お疲れ様です。

今回はPowerShellでADの特定のコンテナのUser情報をCSVで保存するスクリプトを紹介します。

## コード

```plain
Get-ADUser -Filter * -SearchBase "CN=xxx,DC=xxx,DC=xxx" -Properties * | Select-Object -Property Name,SamAccountName,Description,@{n='MemberOf'; e= { ( $_.memberof | % { (Get-ADObject $_).Name }) -join ";" }},LastLogonDate,Manager,Title,Department,whenCreated,Enabled,Organization | Sort-Object -Property Name | export-CSV C:\Users\xxxx\Desktop\test.csv -Encoding UTF8
```

## 解説

### Get-ADUser

- User情報を取得するコマンド

https://learn.microsoft.com/en-us/powershell/module/activedirectory/get-aduser?view=windowsserver2022-ps

### Filter

- Get-ADUserのオプション
- 取得したいUserオブジェクトを指定する
- 今回の場合ですと「*」ですべてのユーザーを指定している

### SearchBase

- Get-ADUserのオプション
- 検索する Active Directory パスを指定します。
- 今回の場合だと「"CN=xxx,DC=xxx,DC=xxx"」の部分で特定のコンテナまで指定している

### Properties

- Get-ADUserのオプション
- 出力するオブジェクトのプロパティを指定する
- 今回の場合ですと「*」ですべてのユーザー情報を指定している

### ほしい属性情報に絞る

```plain
Select-Object -Property Name,SamAccountName,Description,@{n='MemberOf'; e= { ( $_.memberof | % { (Get-ADObject $_).Name }) -join ";" }},LastLogonDate,Manager,Title,Department,whenCreated,Enabled,Organization
```

- Get-ADUserで取得した情報からほしい属性値の取り出している
- ほしい属性値についてはご自由に変更してください

### 並び替え

```plain
Sort-Object -Property Name
```

- Nameでソート（並び替え）している

### CSVで吐き出す

```plain
export-CSV C:\Users\xxxx\Desktop\test.csv -Encoding UTF8
```

- UTF8 の形式のCSVで情報を吐き出している

## まとめ

User情報をまとめて取りたいときとかって時々ありますよね。

ぜひぜひご活用ください～

それでは最後までお読みいただきありがとうございました。
