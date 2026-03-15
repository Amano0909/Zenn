---
title: "[Active Directory]ADユーザーのパスワードを一括で更新する"
emoji: "📝"
type: "tech"
topics: ["activedirectory", "powershell", "technology"]
published: false
---

お疲れ様です！

今回はユーザーのパスワードを一括で更新するPower Shellを紹介します。

あまり利用する機会は少ないですがときどきありますよね。

指定した部署の全員のパスワードリセットしたいときとか。

## コード

```plain
Import-csv 2.csv -Encoding Default | Foreach-Object {
$no=$_."No"
$samAccountName=$_."SamAccountName"
$pwd = ConvertTo-SecureString "パスワード" -AsPlainText -Force
Set-ADAccountPassword -Identity $samAccountName -NewPassword $pwd -Reset
Set-ADUser -Identity $samAccountName -ChangePasswordAtLogon $true
Write-Host $no
}
pause
```

## 解説

主に「

`Set-ADAccountPassword`」と「

`Set-ADUser`」を使います。

https://learn.microsoft.com/en-us/powershell/module/activedirectory/set-adaccountpassword?view=windowsserver2022-ps

https://learn.microsoft.com/en-us/powershell/module/activedirectory/set-aduser?view=windowsserver2022-ps

```plain
Import-csv 2.csv -Encoding Default | Foreach-Object {}
```

こでCSVを取り込んで行ごとに処理をします。取り込むCSVの名前は適当に処理してください。

```plain
$no=$_."No"
$samAccountName=$_."SamAccountName"
$pwd = ConvertTo-SecureString "パスワード" -AsPlainText -Force
```

ここでユーザーの「

`SamAccountName`」を指定します。

また、パスワードを「$pwd」の変数に代入して指定しています。ユーザーごとにパスワードを変えたい場合は新しく変数を作成して”パスワード”のとこに入れるといいと思います。

ドキュメントにも書いてありますが「NewPassword <SecureString>」の利用文字列はSecureStringでないといけません。

https://learn.microsoft.com/ja-jp/powershell/module/microsoft.powershell.security/convertto-securestring?view=powershell-7.2

Noはなくても大丈夫です。
自己流で処理が終わったか見やすいように「Write-Host $no」で書き出しているだけです。

```plain
Set-ADAccountPassword -Identity $samAccountName -NewPassword $pwd -Reset
```

ここで実際にパスワードをリセットしています。

```plain
Set-ADUser -Identity $samAccountName -ChangePasswordAtLogon $true
```

「Set-ADUser」コマンドで「次回ログオン時にパスワード変更が必要」をTrueにしています。

このコマンドを入れないと初期パスワードのままアカウントが利用されてしまうので注意しましょう。

`Write-Host $no`はなくても大丈夫です。

## まとめ

大量のユーザーのパスワードリセットをGUIでポチポチリセットしてくのはつらいのでPower Shellを使うと楽ができますよね。

なるべく楽していきましょう。

それでは、最後までお読みいただきありがとうございました。
