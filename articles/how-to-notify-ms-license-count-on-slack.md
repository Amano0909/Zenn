---
title: "MS系のライセンス数をSlackに通知させる"
emoji: "📝"
type: "tech"
topics: ["gas", "technology"]
published: true
---

情シスの運用業務で困るのがライセンス切れ

今回はMS系のライセンス数を取得して、Slackに通知させるGASを書いたので備忘録として残しておく

## コード

**getAccesstoken**

```js
function getAccesstoken() {

 const clientID ="xxx";
 const clientSecret="xxx";
 const tenantID="xxx";
 const tokenUrl=`https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;

 const payload={
  "client_id":clientID,
  "client_secret":clientSecret,
  "grant_type":"client_credentials",
  "scope":"https://graph.microsoft.com/.default"
 };

 const options={
  "method":"POST",
  "contentType":"application/x-www-form-urlencoded",
  "payload":payload
 };

 const response = UrlFetchApp.fetch(tokenUrl, options);
 const tokenData = JSON.parse(response.getContentText());
 const accessToken = tokenData.access_token;

 return accessToken;
}
```

**getApiResponse**

```js
function getApiResponse(apiURL){
 const accessToken = getAccesstoken();
 const url = `https://graph.microsoft.com/v1.0/${apiURL}`;

 const options={
  "method":"GET",
  "headers":{
  "Authorization": `Bearer ${accessToken}`
  }
 };

 const response = UrlFetchApp.fetch(url, options);
 const apiResponse = JSON.parse(response.getContentText());
 return apiResponse
}
```

**getUseSku**

```js
function getUseSku(){
 const data = getApiResponse("subscribedSkus");
 let values = [];

 for(let i of data.value){
  if(i.skuPartNumber=="EMS" || i.skuPartNumber=="MDATP_XPLAT" || i.skuPartNumber=="OFFICESUBSCRIPTION"||
  i.skuPartNumber=="O365_BUSINESS"){
   let value = [];
   value.push(i.skuPartNumber);
   value.push(i.prepaidUnits.enabled);
   value.push(i.consumedUnits);
   value.push(i.prepaidUnits.enabled - i.consumedUnits);
   values.push(value);
  };
 }

 return values;
}
```

**writeMs**

```js
function writeMs() {
 const ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

 const msData = getUseSku();
 msData.unshift(["ライセンス名","購入数","使用数","残り"]);

 ss.getRange(1, 1, msData.length, 4).setValues(msData);
}
```

**webhookSlack**

```js
function webhookSlack(url,message) {
 const webhookUrl = url;

 const payload = {
  "text": message,
 };

 const options = {
  "method" : "post",
  "contentType" : "application/json",
  "payload" : JSON.stringify(payload)
 };

 UrlFetchApp.fetch(url, options);
}
```

**main**

```js
function main(){
 writeMs();
 const ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 const data = ss.getRange(2,1,ss.getLastRow()-1,4).getValues();
 const webhookUrl = "xxx"

 let messages = "";
 for(let i of data){
  const message = `${i[0]}の残りライセンス数は${i[3]}です\n`;
  messages = messages+message;
 }

 webhookSlack(webhookUrl,messages);
}
```

## 解説

### 大まかな流れ

- API叩くためにEntra ID側にアプリケーションを作成する
  - アプリケーションの作成方法などはクラメソさんの[記事](https://dev.classmethod.jp/articles/get-azuread-signin-log/)が参考になる
  - 今回叩くのは`subscribedSkus`なので[公式ページ](https://learn.microsoft.com/ja-jp/graph/api/subscribedsku-list?view=graph-rest-1.0&tabs=http)を参考に適切に権限を設定する
    - `LicenseAssignment.Read.All`の権限あれば大丈夫そう
- アプリケーションの作成が終わったら下記の値をメモしておく
  - clientID: クライアントID
  - clientSecret: クライアントシークレット
  - tenantID : テナントID
- Slack側の受け口を用意する
  - 簡単なのはSlackワークフロー
    - [Slack 外部で開始されるワークフローを作成する](https://slack.com/intl/ja-jp/help/articles/360041352714-%E3%83%AF%E3%83%BC%E3%82%AF%E3%83%95%E3%83%AD%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B---Slack-%E5%A4%96%E9%83%A8%E3%81%A7%E9%96%8B%E5%A7%8B%E3%81%95%E3%82%8C%E3%82%8B%E3%83%AF%E3%83%BC%E3%82%AF%E3%83%95%E3%83%AD%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)を参考に
    - カスタム変数として`text`を用意しておく
  - Webhook URLをメモしておく
- スプレッドシートの用意＆コードの実行
  - メモした値をコードの中の変数に適切に設定しておく
    - clientID: クライアントID
    - clientSecret: クライアントシークレット
    - tenantID : テナントID
    - webhookUrl：Webhook URL
  - 今回トークン情報などベタ書きしているなら本来なら[プロパティサービス](https://qiita.com/massa-potato/items/2209ff367d65c5dd6181)を利用するのが良きなのでいい感じに設定してください
  - 定期的に通知がほしいならトリガーを定期的に実行するようにすれば良し

### getAccesstokenについて

- 引数：なし
- 戻り値：アクセストークン
- アクセストークン取得用の関数
  - [公式ページ](https://learn.microsoft.com/ja-jp/graph/auth-v2-service?tabs=http)を参考に書いている

### getApiResponseについて

- 引数：叩くURL
  - `https://graph.microsoft.com/v1.0/hogehoge`の`hogehoge`部分を引数として渡す
- 戻り値：APIのレスポンス
- 取得したアクセストークンを利用してAPIを叩いて、レスポンスを取得する関数

### getUseSkuについて

- 引数：なし
- 戻り値：SKUに関する配列。各SKUに対して下記の情報
  - skuPartNumber：SKU名
  - prepaidUnits.enabled：ライセンス数
  - consumedUnits：使用ライセンス数
  - ライセンス数と使用ライセンス数の差分

- [subscribedSkus](https://learn.microsoft.com/ja-jp/graph/api/subscribedsku-list?view=graph-rest-1.0&tabs=http)

  を叩いてSKUに関する情報を取得している関数
  - ほしいSKUのみ if文で取得しているのでここは各々いい感じに設定してください
    - 識別子については[公式ページ](https://learn.microsoft.com/ja-jp/entra/identity/users/licensing-service-plan-reference)を参考に

### writeMsについて

- 引数：なし
- 戻り値：なし
- getUseSkuを利用して取得したデータをスプレッドシートに書き出す関数

### webhookSlack

- 引数
  - url：Webhook送信先のURL
  - message：通知内容

- 戻り値：なし
- Slackにメッセージ飛ばす用の関数

### main

- 引数：なし
- 戻り値：アクセストークン
- ここまで作成した関数を組み合わせて実行しているだけの関数
  - 定期的に通知がほしいならこの関数をGASのトリガー設定で定期的に実行する

以上～
