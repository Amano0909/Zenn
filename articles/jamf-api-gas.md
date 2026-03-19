---
title: "[GAS][Jamf Pro]Jamf Pro のAPIをGASで叩いてみる。"
emoji: "📝"
type: "tech"
topics: ["jamfpro", "technology"]
published: true
---

Jamf ProのAPIを叩く機会があったので備忘録として残しておく

## コード

```js
  const userName="ユーザー名"
  const password="パスワード"
  const url="https://xxxxxx.jamfcloud.com"

function getBearertoken() {
  const postUrl = `${url}/api/v1/auth/token`
  const basicAuthorization = Utilities.base64Encode(`${userName}:${password}`);
  const options = {
    "Content-Type": 'application/json',
    "headers" : {'Authorization':'Basic '+basicAuthorization},
    "method": "post",
  };

  const response=JSON.parse(UrlFetchApp.fetch(postUrl, options));
  return response.token
}

function main(){
  const apiUrl = `${url}/api/preview/computers`
  const bearerToken = getBearertoken();

  const options = {
    "Content-Type": 'application/json',
    "headers" : {'Authorization':'Bearer '+bearerToken,},
    "method": "get",
  };

  const response=JSON.parse(UrlFetchApp.fetch(apiUrl, options));
  console.log(response.totalCount)
}
```

## 解説

まず、Jamf Pro側にAPI叩く用のユーザーを作成しておく。
叩くAPIの種類によって権限は絞ってください。

SSO設定してあってもとりあえず、認証には関係ないです。
作成したユーザー名とパスワードは認証に使うのでメモしておく。

API叩くにはBearerTokenが必要なので下記を参考にbasic認証を行ってトークンをゲットする

https://developer.jamf.com/jamf-pro/reference/post_v1-auth-token

あとは取得したトークンを利用してAPIを叩く
上記コードの場合下記のAPIを叩いてJamf Proに登録されているComputer数を出してる。

https://developer.jamf.com/jamf-pro/reference/post_v1-auth-token

あとは必要なものを探して好きに叩けばいいと思う。
