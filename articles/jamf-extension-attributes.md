---
title: "[Jamf]利用しているコンピュータの拡張属性についてまとめる"
emoji: "📝"
type: "tech"
topics: ["jamf", "jamf-pro", "technology"]
published: false
---

今回は実際に使っているJamfの拡張属性についてまとめようと思います。

## そもそも「コンピュータの拡張属性」とは？

公式のドキュメントはこちらになります。

https://docs.jamf.com/ja/10.41.0/jamf-pro/documentation/Computer_Extension_Attributes.html

> 拡張属性を使用すると、追加のインベントリ情報を収集できます。拡張属性値は、次のいずれかの入力タイプを使用して入力されます:
>
> - テキストフィールド
> - ポップアップメニュー
> - スクリプト
> - LDAP 属性マッピング
>
> Jamf Pro では、Jamf Pro で利用可能なテンプレートから、または手動で拡張属性を作成できます。Jamf Pro API を介してプログラムで拡張属性を作成することもできます。詳しくは、の「[Extension Attributes (拡張属性)](https://developer.jamf.com/developer-guide/docs/extension-attributes)」を参照してください。

Jamfは標準でかなりのイベントリ情報をすることが可能です。

ただ、標準で取ってこれないものもあります。
たとえば、「キーボードの配列」などです。

コンピュータの拡張属性とは標準で引っ張ってこれない端末の情報をスクリプトなどで取ってくる・手動で定義する機能になります。

また、拡張属性で収集された情報については標準のイベントリ情報と同じで「スマートグループ」で利用が可能です。

ちなみに英語で「Extension attributes」といいますので困った際は英語で検索すると幸せになれるかもしれせん。

### 拡張属性入力タイプ

拡張属性の入力タイプは4つほどあります。

- テキストフィールド
- ポップアップメニュー
- スクリプト
- LDAP 属性マッピング

この中で一番利用する頻度が高いのは「スクリプト」になります。
自動で端末の属性値を引っ張ってこれるので楽です。スマートグループとも相性がいいです。

「テキストフィールド」「ポップアップメニュー」は主に都度都度手動で属性値を設定するときに利用すると思いますが自分は使ってないです。利用方法としてはコンピュータの「利用開始日」や「廃棄日」などを定義するときに使えると思います。※API利用でほかの資産管理システムとかと連携できるのかな？

「LDAP 属性マッピング」はADと連携していれば用途はあると思いますが自分は利用していません。

### スクリプトにおける拡張属性の定義方法

これは公式ドキュメントに書いてありますが下記の方法です。

> - スクリプトで拡張属性を読み込む際は、`<result></result>` タグに挟まれたテキストが Jamf Pro に保存されます。

引っ張ってきたい情報をechoして <result></result>タグで囲ってあげればOKです。

例　Mac コンピュータからホスト名を収集を収集する。

```bash
#!/bin/bash
echo "<result>`hostname 2>&1`</result>"
```

### 設定方法

コンピュータ管理-拡張属性

![](/images/jamf-extension-attributes/image-01.png)

「新規」から作成可能です。

![](/images/jamf-extension-attributes/image-02.png)

次にスクリプト作成画面になりますので適当に値を入力していきます。

![](/images/jamf-extension-attributes/image-03.png)

- 表示名
  - 任意わかりやす物で

- 有効 (スクリプト入力タイプのみ)
  - スクリプトタイプならOFFにすることが可能です。まぁ一度定義したらOFFにすることはあまりありません。

- 説明

  拡張属性の説明
  - 任意わかりやす物で

- データタイプ
  - 取ってくるデータの型を定義
  - String(文字列)、Integer(整数)、Date(日にち)の3種類

- 入力タイプ
  - 入力タイプを選択

## 利用スクリプト

それでは実際に利用しているスクリプトを紹介します。

### 端末で利用しているApple IDを引っ張ってくる

```bash
#!/bin/sh

currentuser=$(/bin/ls -la /dev/console | /usr/bin/cut -d ' ' -f 4)
icloud=$(/usr/libexec/PlistBuddy -c "print" /Users/$currentuser/Library/Preferences/MobileMeAccounts.plist | grep AccountID | sed 's/^[ \t]*AccountID = //g')
echo "<result>$icloud</result>"
```

### 端末のキーボードタイプを判定する

```bash
#!/bin/sh

echo "<result>$(ioreg -rln AppleHIDKeyboardEventDriverV2 | grep "KeyboardLanguage" | awk '{print $4}' | sed s/\"//g | head -n 1)</result>"
```

### モバイルアカウントがあるか判定する

```bash
#!/bin/bash

NETACCLIST=$(dscl . list /Users OriginalNodeName | awk '{print $1}' 2>/dev/null)
if [ "$NETACCLIST" == "" ]; then
echo "<result>No Mobile Accounts</result>"
else
echo "<result>$NETACCLIST</result>"
fi
exit 0
```

このスクリプトは普通の会社では使わないかもしれません。
ADバインドからJamf Connectに移行した場合モバイルアカウントを持っていないかどうかチェックするために利用することが多いと思います。詳しくは

[公式ドキュメント](https://docs.jamf.com/technical-articles/Demobilizing_and_Unbinding_Mobile_Accounts_with_Jamf_Connect_and_Jamf_Pro.html)

を参考に。

### PCが起動しっぱなしの日数を取ってくる

```bash
#!/bin/bash

#get uptime output
uptimeOutput=$(uptime)

#detect "day" by removal and then string comparison, awk gets number of days between "up " and " day"
[ "${uptimeOutput/day/}" != "${uptimeOutput}" ] && uptimeDays=$(awk -F "up | day" '{print $2}' <<< "${uptimeOutput}")

#less than a day echo 0
echo "<result>${uptimeDays:-0}</result>"
```

### Jamf Connectが利用できているか判定する

[こちら](https://www.too.com/apple/apple_tips/OSupdate_withconnect.html)

のTooさんの記事を参考に

```bash
#!/bin/bash

if [[ $( /usr/local/bin/authchanger -print | grep JamfConnectLogin ) ]]; then
  echo "<result>Enabled</result>"
else
  echo "<result>Disabled</result>"
```

### 補足

GitHubなので検索すると公開してくれている方いらっしゃいますね。

この辺りを

パクら

参考にさせてもらいましょう。

https://github.com/search?q=jamf+Extension+attributes&type=Repositories

## まとめ

今回はJamfの拡張属性について触れました。

標準のイベントリに拾ってきたい属性値がない場合はスクリプトで拾ってこれるか試してみましょう。

最後まで記事を読んでくださりありがとうございました。
