---
title: "[Microsoft Defender SmartScreen]SmartScreenで特定のアプリを除外することはできるのか"
emoji: "📝"
type: "tech"
topics: ["microsoftdefender", "technology"]
published: true
---

お疲れ様です。

たまたま、業務中に発生したSmartScreenの問題についてまとめます

## 問題点

![](/images/smartscreen-control/image-01.png)

検証中のアプリがSmartScreenにブロックされて起動できない。。
困った。。

私が所属している企業では基本的に端末の制御には「セキュリティ ベースライン」を利用しています。

https://learn.microsoft.com/ja-jp/mem/intune/protect/security-baseline-settings-mdm-all?pivots=mdm-november-2021

原因はおそらく「Microsoft Defender for Endpoint ベースライン」の下記の設定。

- SmartScreen 警告をユーザーが無視できないようにする:はい
- Windows SmartScreen を有効にする：はい
- Microsoft Edge 従来版には SmartScreen が必要：はい
- 悪意のあるサイトへのアクセスをブロックする：はい
- 未検証のファイルのダウンロードをブロックする：はい
- Microsoft Defender SmartScreen の構成：有効
- サイトの Microsoft Defender SmartScreen プロンプトをバイパスしない：有効
- ダウンロードに関する Microsoft Defender SmartScreen の警告をバイパスしない：有効
- 望ましくない可能性のあるアプリをブロックするよう Microsoft Defender SmartScreen を構成する ：有効

う～む。困った。SmartScreenで特定のアプリのみ除外する設定はないのかと考えました。

調べたところこれと似たような下記のような設定は見つかりました。

ただ、検証したところこれではなかったです。

https://learn.microsoft.com/ja-jp/microsoft-365/security/defender-endpoint/configure-extension-file-exclusions-microsoft-defender-antivirus?view=o365-worldwide

## Microsoftに聞いてみる

調べたり、考えたりしたところで結局結論はでませんでした。

ということでMSのサポートに頼ってみました。

この情報は2022年10月時点での情報です。新しい機能が追加になる可能性もあるので必ずドキュメントを探したり、Microsoftに聞いてみましょう。

### 質問

お世話になっております。
SmartScreenの除外設定について教えてください。

現在Microsoft Defender for Endpoint ベースラインで下記の設定を利用しています。

SmartScreen 警告をユーザーが無視できないようにする:はい
Windows SmartScreen を有効にする：はい
Microsoft Edge 従来版には SmartScreen が必要：はい
悪意のあるサイトへのアクセスをブロックする：はい
未検証のファイルのダウンロードをブロックする：はい
Microsoft Defender SmartScreen の構成：有効
サイトの Microsoft Defender SmartScreen プロンプトをバイパスしない：有効
ダウンロードに関する Microsoft Defender SmartScreen の警告をバイパスしない：有効
望ましくない可能性のあるアプリをブロックするよう Microsoft Defender SmartScreen を構成する ：有効

この設定で特定のアプリを起動しようとすると下記のようなエラー内容がでます。
「Microsoft Defender SmartScreen は認識されないアプリの起動を停止しました。このアプリを実行すると、PC が危険にさらされる可能性があります。」発行元：不明な発行元

このアプリケーションのみをSmarScreenの対象外としたいのですが可能でしょうか？

下記の設定はPUAに関するものなので別物だと思っているのですが認識あっていますでしょうか？
https://learn.microsoft.com/ja-jp/microsoft-365/security/defender-endpoint/configure-extension-file-exclusions-microsoft-defender-antivirus?view=o365-worldwide

### 回答

恐れ入りますが、Microsoft Defender SmartScreen にて除外設定を行う機能につきましては、現時点ではご提供に至っておりません。
天野 様のご要望に沿いかねる結果となり、誠に心苦しい限りでございますが、現在の機能上の制限である事をご理解賜りますようお願い申し上げます。

つきましては、本事象の対応策といたしまして、Microsoft Defender for Endpoint ベースラインの設定値であります、[SmartScreen 警告をユーザーが無視できないようにする] を "未構成 " へ設定変更していただき、保存していただくことをご検討いただけますと幸いでございます。
上記設定後、ユーザーにて、該当アプリケーションを実行する際、警告が表示されますが [詳細情報] をクリックし、[実行] を行っていただくことで、アプリ実行をすることが可能となるかと判断しております。

また、お寄せいただきました公開情報につきましては、天野 様のご認識のとおり、Microsoft Defender ウイルス対策 に関する除外設定のドキュメントとなりますため、Microsoft Defender SmartScreen にて本設定をすることはできかねる動作となります。

## まとめ

現時点ではSmartScreenはそこまで細かく制御はできないようです。
実運用でまだ問題はでてきていませんが問題が発生したら考えないとですね。
また、Microsoftのアップデートに期待です！

それでは、最後までお読みいただきありがとうございました。
