---
title: "Jamf ProとEntra IDと利用してデバイスコンプライアンスを構成する際に登録がうまくいかない対処法（リダイレクトがうまくいかない問題）"
emoji: "📝"
type: "tech"
topics: ["jamf-pro", "technology"]
published: false
---

Jamf ProとEntra IDを利用してデバイスコンプライアンスを構成していたんですがEntra 側に登録がうまくいかないことがよくありました。

挙動としてはブラウザで認証をしてIntune側への登録を進めるのですが途中でフリーズするのです。

その時の対処法について備忘録として書いておきます。

※最近公式のドキュメントにマージされたのかな？公式ドキュメント読んでいる人ならこの問題躓かないかも

## 公式ドキュメント

[https://learn.jamf.com/ja-JP/bundle/technical-paper-microsoft-intune-current/page/Creating_a_Policy_Directing_Users_to_Register_Mac_Computers_with_Azure_Active_Directory.html](https://learn.jamf.com/ja-JP/bundle/technical-paper-microsoft-intune-current/page/Creating_a_Policy_Directing_Users_to_Register_Mac_Computers_with_Azure_Active_Directory.html#ariaid-title3)

の「WebView を使用するように JamfAAD を構成する」です

## やっている内容

どうやらドキュメントを読んでいるとブラウザのリダイレクトに問題があったようです。

なのでJamf側の設定を変更するように構成プロファイルを組みます。

具体的にはブラウザを利用せず、

WebView を使用するように構成します。

下記の設定を組みます。

構成プロファイル>>アプリケーションとカスタム設定

環境設定ドメイン：

com.jamf.management.jamfAAD

プロパティリスト

```plain
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>useWKWebView</key>
  <true/>
</dict>
</plist>
```

これを適用したいデバイスに当てればOKです。

今まで躓いていた部分、リダイレクトの際にフリーズしてIntune側に登録できなくなることはなくなるかと思います。
