---
title: "[Microsoft Sentinel] インシデント発生時の通知をSlackに飛ばす"
emoji: "📝"
type: "tech"
topics: ["microsoftsentinel", "technology"]
published: false
---

Microsoft Sentinelで起こったインシデントについてはすぐに気付きたいですよね。

ということで今回はMicrosoft Sentinelでインシデントが発生したらSlackの特定チャンネルに通知を飛ばす方法をまとめます。

## プレイブックを作る

まずは「プレイブック」を作成します。

ん？プレイブックとはなに？

という方は下記のDocsを参照

https://learn.microsoft.com/ja-jp/azure/sentinel/tutorial-respond-threats-playbook?tabs=LAC

> プレイブックは、アラートやインシデントに対する応答として Microsoft Sentinel から実行できる手順の**コレクション**です。 プレイブックは対応の自動化や調整に役立ちます。分析ルールまたはオートメーション ルールにそれぞれアタッチすることで、特定のアラートまたはインシデントが発生した際に自動的に実行されるように設定できます。 必要なときに手動で実行することもできます。

これだけだとよくわからないのでもう少しかみ砕きます。

よくあるインシデントの対応の流れとして下記の流れがあったとします。

1. インシデント発生
2. Slackに通知
3. インシデントに関わるアカウントのAzure ADアカウントを停止
4. 調査
5. 対応のアクションを決める
6. アクション実施
7. インシデント終了

この流れのなかでの「Slackに通知」や「インシデントに関わるアカウントのAzure ADアカウントを停止」などの

**特定のアクション**

を指してプレイブックと呼んでいます。

ちなみに流れ全体をどうするかのところを「オートメーションルール」で設定するわけです。

> [オートメーション ルール](https://learn.microsoft.com/ja-jp/azure/sentinel/automate-incident-handling-with-automation-rules)
>
> は、Microsoft Sentinel にインシデントをトリアージするのに役立ちます。 それらを使用して、インシデントを自動的に適切な担当者に割り当てたり、ノイズの多いインシデントや既知の
>
> [擬陽性](https://learn.microsoft.com/ja-jp/azure/sentinel/false-positives)
>
> を終了したり、それらの重大度を変更したり、タグを追加したりすることができます。 これらは、インシデントへの対応としてプレイブックの実行を可能にするメカニズムでもあります。

補足で、このセキュリティインシデントに対する対応の自動化を

**SOAR**

（

Security Orchestration, Automation and Response

）と呼びます。

### リソースの作成

それではプレイブックを作っていきます。

「オートメーション」をクリック

![](/images/microsoft-sentinel-incident-slack-notification/image-01.png)

「作成」⇒「インシデントトリガーを使用したプレイブック」を選択

![](/images/microsoft-sentinel-incident-slack-notification/image-02.png)

するとリソースの作成画面に飛ぶので適当に設定してください。
プレイブック名は「Slack Notifications」とかわかりやすい名前でいいと思います。

![](/images/microsoft-sentinel-incident-slack-notification/image-03.png)

接続タブもそのままで大丈夫です。

![](/images/microsoft-sentinel-incident-slack-notification/image-04.png)

### ロジックアプリ

設定が完了すると次の画面になります。
※自分は設定が完了しているのでちょっと違いますが。

プレイブックの中身はロジックアプリになります。詳細はMSのドキュメントを参照

https://learn.microsoft.com/ja-jp/azure/logic-apps/logic-apps-overview

ロジックアプリデザイナーを選択しましょう。

![](/images/microsoft-sentinel-incident-slack-notification/image-05.png)

「新しいステップ」を選択

![](/images/microsoft-sentinel-incident-slack-notification/image-06.png)

検索窓から「slack」と検索して「メッセージ投稿」を選択します。

![](/images/microsoft-sentinel-incident-slack-notification/image-07.png)

次の画面になるので、通知させたいチャンネルがあるワークスペースと接続させてください。

チャンネル名に通知させたいチャンネル名を。
※チャンネル名が候補に出てこない時は「カスタム値の入力」を選択してください

メッセージには動的コンテンツを利用します。

パブリックチャンネルではなくプライベートチャンネルに通知させたい場合はチャンネルにアプリを追加する必要があります。

![](/images/microsoft-sentinel-incident-slack-notification/image-08.png)

メッセージの中身はこんな感じでいいと思います。

![](/images/microsoft-sentinel-incident-slack-notification/image-09.png)

これでプレイブックの用意が完了しました。

## オートメーションルールの作成

次にオートメーションルールの作成を行っていきます。

部品であるプレイブックができたので流れ全体を決めていくわけです。

オートメーションをクリック

![](/images/microsoft-sentinel-incident-slack-notification/image-01.png)

「作成」⇒「オートメーションルール」を選択

![](/images/microsoft-sentinel-incident-slack-notification/image-10.png)

下記のような感じで作成します。

**オートメーション ルール名**：おまかせ **トリガー**：インシデントが作成されたとき **条件**：すべて **アクション**：プレイブックの実行（さきほど作成したプレイブックを選択） **ルールの有効期限**：無制限 **順序**：おまかせ **状態**：有効

![](/images/microsoft-sentinel-incident-slack-notification/image-11.png)

以上で完了になります！

MDE(Microsoft 365 Defender for EndPoint)と連携している方は2重で通知くるかもしれません。MDE側は通知OFFにしましょう。

## まとめ

今回はMicrosoft Sentinelの通知方法についてまとめてみました！

せっかくSentinel導入したのにインシデントに気づかないなんて本末転倒ですよね。
Slackに通知させてチームで共有しましょう。

また、オートメーションルールは通知だけじゃなくてアカウントの停止などにも使えるので運用になれてきたらそっちの設定もしたいですね。

それでは、最後までお読みいただきありがとうございました。
