---
title: "[GAS][Google Workspace]GWSのライセンスの残りをSlackに通知させる"
emoji: "📝"
type: "tech"
topics: ["gas", "googleworkspace", "technology"]
published: true
---

お疲れ様です！

今回はGAS（Google Apps Script）でGWS(Google Workspace)の残りライセンス数をSlackに通知させる方法について書きます。

## スプレッドシートを用意する

下記ようなスプレッドシートを用意します。

C2に事前にベンダーから購入しているライセンス数を記入しておきます。

![](/images/gws-gas-notification/image-01.png)

## Slack側の受け口を用意

次にSlack側の受け口(webhook url)を用意します。ワークフロービルダーを利用します。

変数は「text」を用意します。

![](/images/gws-gas-notification/image-02.png)

![](/images/gws-gas-notification/image-03.png)

![](/images/gws-gas-notification/image-04.png)

## コード

```js
function get_user() {
const id = 'スプレッドシートのID';
const ss = SpreadsheetApp.openById(id);
const sheet = ss.getSheetByName('シート名');
const byGWS = sheet.getRange('C2').getValue();
const all_user_list = [];
const domains =['xxxx.com','xxxj.com']

for(const domain of domains){
　　let next_token ='';
　　let count=0;
　　let option ={
　　　domain: domain,
　　　maxResults:500,
　　　pageToken:next_token
　　};
　　let users = AdminDirectory.Users.list(option);
　　next_token = users.nextPageToken;
　　count += users.users.length;
　　while(next_token){
　　　option ={
　　　　domain: domain,
　　　　maxResults:500,
　　　　pageToken:next_token
　　　};
　　　let users = AdminDirectory.Users.list(option);
　　　next_token = users.nextPageToken;
　　　count += users.users.length;
　　}
　　all_user_list.push(count)
}

const user_count = all_user_list.reduce(
　　function(sum,ele){
　　　return sum+ele;
　　}
);

sheet.getRange('D2').setValue(user_count);
const license = byGWS - user_count;
sheet.getRange('E2').setValue(license);
const text = "GWSの残りアカウント数は"+license+"です"
const obj = {text : text};
return obj
}
```

```js
function slackWorkflow(params) {
　　const url = 'さきほど発行したwebhook url';
　　const option = {
　　　method:'POST',
　　　headers:{'Content-type':'application/json'},
　　　payload:JSON.stringify(params)
　　};
　　UrlFetchApp.fetch(url,option);
}
```

```js
function slack_notification(){
　　const obj = get_user();
　　slackWorkflow(obj);
}
```

## 解説

### get_user()

GWSを利用しているユーザー数を求めています。

Method: users.listを利用します。

https://developers.google.com/admin-sdk/directory/reference/rest/v1/users/list

管理者権限が必要です。サービスとして「AdminDirectory」を追加する必要があります。

### slackWorkflow(params)

Slackにメッセージを送信しています。

### slack_notification()

get_user()でユーザー数を求めた後戻り値をslackWorkflow(params)でSlackに送っています。

定期的にSlackに通知させたい場合は時間ベースのトリガーを利用しましょう。

## まとめ

ベンダーからライセンスを購入しているとそのライセンスの管理が難しいですよね

ライセンス数が足らない！入社対応ができないなんてなったら致命的ですし。

自分の場合は朝1でSlackに残りのライセンス数を通知させてます。

GASはメールも送れるので特定のライセンス数以下になったら自動でメールを送るor Slack Connectしているチャンネルにメッセージを送るなんてしてもいいかもですね。

それでは、最後までお読みいただきありがとうございました。
