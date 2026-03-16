---
title: "[Jamf]イベントリ収集時にタイムアウトエラーがおきる件について"
emoji: "📝"
type: "tech"
topics: ["error", "jamf", "jamfpro", "technology"]
published: true
---

## 問題、エラー内容

エラー内容はこんな感じ
※濁すとこは適当に変更してます。

```plain
An error occurred while running the policy "Update Inventory_Once every day" on the computer "xxxxx".
Actions from policy log:
　Executing Policy Update Inventory_Once every day
　Running Recon...
　Retrieving inventory preferences from https://xxxxx/...
　Locating package receipts...
　Searching path: /System/Applications
　Locating accounts...
　Locating software updates...
　Locating printers...
　Gathering application usage information from the JamfDaemon...
　Searching path: /Applications
　Locating hardware information (macOS 11.6.0)...
　Software update timed out after 300 seconds.
The complete policy log is available in the JSS at:
https://
Computer Info:
ID: xxxxx
IP Address: xxxxx
Serial Number: xxxxx
```

最初このエラーみたとき「？？？」状態でしたがよくよくエラー内容を見てみると「Update Inventory_Once every day」というポリシーがこけているようです。

このポリシーは毎日イベントリ収集をしてくれているポリシー。

なるほど。イベントリ収集に問題がありそうです。

## 原因はどうやらソフトウェアアップデートを収集設定にあるっぽい

原因を探していたらJamf Notionに同じようなエラー内容のスレッドを発見

https://community.jamf.com/t5/jamf-pro/recon-error-software-update-timed-out-after-300-seconds/td-p/268937

スレッドの内容を確認するとどうやら「利用できるソフトウェアアップデートを収集」にチェックが入っているとイベントリ収集がタイムアウトしてこけているっぽい。

なるほど。
ちなみにこの設定はここです。

コンピュータ管理-管理フレームワーク-イベントリ収集-
利用できるソフトウェアアップデートを収集

![](/images/inventory-timeout/image-01.png)

↓

![](/images/inventory-timeout/image-02.png)

## 対策：とりあえず、OFFが推奨っぽい

これわからんなーとTwitterで呟いていたらJamfの営業さんから声がかかりケースオープンしていただくことに。。親切of親切

https://twitter.com/AmanoH0909/status/1569157201201340421

そしてJamf側から下記の回答をもらいました。

> 「Software update timed out after 300 seconds.」の件に関しまして、弊社のEngineerに確認したところ、この問題は、sofwareupdateのAPIに関連するものです。現在、Apple様によるこの問題の解決を待っているところです。 検証機で確認したところ、OSは12.6で、「利用できるソフトウェアアップデートを収集」にチェックが入っている場合、タイムアウトのエラーを出さずにインベントリ更新を実行することができました。 ただし、このエラーは断続的に発生する可能性があるため、Apple様によって問題が解決されるまでは、この機能を無効にすることをお勧めします。 詳細については、下記のリンクをご覧ください https://developer.apple.com/forums/thread/701096 （英語のみ）

おー、なるほど。
Jamf側の問題というより、Apple側のAPIの問題っぽいです。

とりあえず、無効にするのがお勧めらしいです。
ということで一旦OFFります！

## まとめ

今回はJamf でインベントリ収集エラーがでたときの対応についてまとめました。
Notion調べてみて解決しない場合はおとなしくケースオープンするのがよさそうですね。
ご覧いただきありがとうございました。
