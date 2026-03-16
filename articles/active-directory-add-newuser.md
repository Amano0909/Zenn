---
title: "[Active Directory]新規ユーザーをCSVで取り込む"
emoji: "📝"
type: "tech"
topics: ["activedirectory", "powershell", "technology"]
published: true
---

今回はActive Directoryに新規でユーザーをCSVで取り込む方法を紹介しようと思います。
新入社員が大量に入ってくるときに使ってくださいね。

## コード

```plain
Import-csv 2.csv -Encoding Default | Foreach-Object {
$no=$_."No"
$samAccountName=$_."SamAccountName"
$displayName=$_."DisplayName"
$surname=$_."Surname"
$givenName=$_."GivenName"
$office=$_."Office"
$userPrincipalName=$_."UserPrincipalName"
$emailAddress=$_."EmailAddress"
$pwd = ConvertTo-SecureString "好きな初期パスワード" -AsPlainText -Force
$title=$_."Title"

New-ADUser $displayName -Path "コンテナ名"`
-SamAccountName $samAccountName -AccountPassword $pwd -Surname $surname -GivenName $givenName -DisplayName $displayName -Office $office -UserPrincipalName $userPrincipalName -EmailAddress $emailAddress -Enabled $true -Title $title
Set-ADUser -Identity $samAccountName -ChangePasswordAtLogon $true
Write-Host $no
}
pause
```

## 解説

主に「New-ADUser」と「Set-ADUser」を利用します。

Docsは下記です。

https://learn.microsoft.com/en-us/powershell/module/activedirectory/new-aduser?view=windowsserver2022-ps

https://learn.microsoft.com/en-us/powershell/module/activedirectory/set-aduser?view=windowsserver2022-ps

```plain
Import-csv 2.csv -Encoding Default | Foreach-Object {}
```

ここでCSVを取り込んで行ごとに処理をします。取り込むCSVの名前は適当に処理してください。

```plain
$no=$_."No"
$samAccountName=$_."SamAccountName"
$displayName=$_."DisplayName"
$surname=$_."Surname"
$givenName=$_."GivenName"
$office=$_."Office"
$userPrincipalName=$_."UserPrincipalName"
$emailAddress=$_."EmailAddress"
$pwd = ConvertTo-SecureString "好きな初期パスワード" -AsPlainText -Force
$title=$_."Title"
```

ここでCSVから各ユーザーの属性値を変数に代入しています。

必要な属性値が足らない場合は付け加えてください。

注意点だけ書きます。

- no
  - なくても大丈夫です。自己流で処理が終わったか見やすいように「`Write-Host $no`」で書き出しているだけです。

- pwd
  - ユーザーの初期パスワードを定義しています。
  - Docsにも書いてありますが「AccountPassword <SecureString>」利用文字列はSecureStringでないといけません。

https://learn.microsoft.com/ja-jp/powershell/module/microsoft.powershell.security/convertto-securestring?view=powershell-7.2

```plain
New-ADUser $displayName -Path "コンテナ名"`
-SamAccountName $samAccountName -AccountPassword $pwd -Surname $surname -GivenName $givenName -DisplayName $displayName -Office $office -UserPrincipalName $userPrincipalName -EmailAddress $emailAddress -Enabled $true -Title $title
```

ここで実際に「New-ADUser」で新規ユーザーを作成しています。

ここでも必要な属性値が足らない場合はDocsに従い付け加えるといいと思います。

Pathはユーザー作成したいコンテナを指定してください。

```plain
Set-ADUser -Identity $samAccountName -ChangePasswordAtLogon $true
Write-Host $no
```

「Set-ADUser」コマンドで「次回ログオン時にパスワード変更が必要」をTrueにしています。

このコマンドを入れないと初期パスワードのままアカウントが利用されてしまうので注意しましょう。

`Write-Host $no`はなくても大丈夫です。

## まとめ

大量に新入社員が来たときはアカウント作成が辛いですよね。。
少しでもスクリプトを使って楽をしましょう。
