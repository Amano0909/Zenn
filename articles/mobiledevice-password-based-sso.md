---
title: "[Azure AD]モバイルデバイスでパスワードベースのアプリケーションを利用する"
emoji: "📝"
type: "tech"
topics: ["azuread", "technology"]
published: false
---

![天野](/images/mobiledevice-password-based-sso/image-01.jpg)

天野

パスワードベースのアプリケーションがモバイルデバイスで動かないんだが・・

ちょっと上記のような問題が発生したので備忘録として残しておきます。

## 問題

パスワードベースSSOの利用にはブラウザの拡張機能が基本的には必要になります。

例えば、Chromeなら下記の拡張機能が必要です。

「My Apps Secure Sign-in Extension」

https://chrome.google.com/webstore/detail/my-apps-secure-sign-in-ex/ggjhpefgjjfobnfoldnjipclpcfbgbhl

モバイルデバイスのブラウザの場合拡張機能がインストールできません。。

ということは正常にパスワードベースSSOが動作しません。

困った。。

## 解決方法

結論「

Microsoft Edge モバイル

」を利用するのが簡単でした。

https://learn.microsoft.com/ja-jp/azure/active-directory/manage-apps/myapps-overview

> モバイルの設定で、パスワード ベースの SSO を必ず有効にしてください。既定でオフになっている場合があります。 たとえば、[設定] -> [プライバシーとセキュリティ] -> [Azure AD パスワード SSO]。

Microsoft Edge モバイルで「Azure AD パスワード SSO」を有効にしたら正常に動作が確認できました。
