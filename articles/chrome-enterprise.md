---
title: "Chrome Enterpriseについて調べたのでまとめておく"
emoji: "📝"
type: "tech"
topics: ["googleworkspace", "technology"]
published: true
---

ちょっとChrome Enterpriseについて調べる気になったのでまとめておく

## なんで利用したいのか

- Chromeのポリシーを楽に管理したいから
  - 拡張機能を管理したい
  - お気に入り管理したい
  - パスワードマネージャー周りなどChrome自体の設定を管理したい

- ChromeのUpdateもできれば管理したい

動機はこのぐらい

いま調べているのでなにができる、できないは全然ワカラナイ

楽に管理したい＝GUIで管理したい。できるかはワカラナイ

Intune、Jamfで個別に設定値を配れるのことは知っているがChromeのポリシーを変更したいのにMDMの設定を両方変更するのはめんどくさい

## 料金は？

https://chromeenterprise.google/intl/ja_jp/products/cloud-management/

を参照

- Chrome Enterprise Core:無料 ※GWS利用していればそのまま利用できる
- Chrome Enterprise Premium：1ユーザー ＄6

GWS利用していればすぐに利用できるっぽい

今回はCoreについて調べていく

### CoreとPremiumの差分は？

画像の通り

![](/images/chrome-enterprise/image-01.png)

## Chrome Enterpriseの利点

https://support.google.com/chrome/a/answer/15591684?hl=ja&ref_topic=9025410&sjid=9519376760784718939-AP

に書いてる。

- すべての Chrome ブラウザ設定とポリシーを一元的に制御および管理し、組織全体の一貫性とコンプライアンスを確保します。
  - Microsoft Windows、Apple Mac、Linux、iOS、Android の各種デバイスで動作する**Chrome ブラウザ**を、クラウドベースの単一の管理コンソールで管理できます。追加料金はかかりません。
- 組織は、すべてのプロファイルの設定、ブックマーク、履歴、拡張機能など、デバイス上のすべてを管理します。
- 管理者は、ユーザーにログインを求めることなく、Chrome の使用方法を制御できます。次のことが可能です。
  - サインイン コントロール、インストールされているアプリと拡張機能、セキュリティ、ネットワーク構成などのさまざまな設定を管理します。
  - すべてのユーザー プロファイルにポリシーとセキュリティ ブラウザの強制を適用します。
  - 特定の機能を設定または制限する。
  - アクティビティを監視します。
  - 管理対象デバイス上の任意のプロファイルにリモート コマンドを適用します。
  - 管理対象デバイス上の Chrome ブラウザを使用するすべてのユーザーに対して、**100 種類以上の Chromeポリシーを適用**できます。
  - 組織全体で**不審な拡張機能をブロック**したり、その他の一般的な IT タスクを行ったりすることができます。
- ブラウザの使用状況に関するデータの収集とレポートは、傾向の監視と分析に役立つ貴重な洞察を提供します。

管理対象にしてしまえば、いろいろ企業が求める制御が簡単にできる

## オンボーディング方法

https://support.google.com/chrome/a/answer/15591684?hl=ja&ref_topic=9025410&sjid=9519376760784718939-AP

に「組織によって管理される登録トークンの展開が必要」と書いてあるのでMDMを利用して展開することが求められる

設定方法は下記のページにまとまっている

https://support.google.com/chrome/a/topic/12005458?hl=ja&ref_topic=9027869

たぶん自分が使うのはこの辺

- [Microsoft Intune でブラウザを登録する（Windows）](https://support.google.com/chrome/a/answer/10728773?hl=ja&ref_topic=12005458)
- [iOS を対象に Chrome Enterprise Core を設定する](https://support.google.com/chrome/a/answer/10377492)
- [Jamf Pro でブラウザを登録する（iOS）](https://support.google.com/chrome/a/answer/10529250?hl=ja&ref_topic=12005458)
- [Jamf Pro（macOS）でブラウザを登録する](https://support.google.com/chrome/a/answer/9771882?hl=ja&ref_topic=12005458)

また手動でも登録できるっぽい

https://support.google.com/chrome/a/answer/9301891?hl=ja&ref_topic=9301744&sjid=9519376760784718939-AP#zippy=

のステップ2を参照

- Windowsはレジストリの変更
- Macはテキストファイルの配置
- iOSはチョットワカラナイ　手動登録できるのか？

## とりあえず設定しておけ項目?

- [Chrome ブラウザおよびプロファイルに関するレポートを有効にする](https://support.google.com/chrome/a/answer/9301421)
  - 拡張機能、ブラウザのバージョンなどなど取れるようになる
- [ブラウザのイベント レポートを有効にする](https://support.google.com/chrome/a/answer/9301421)
  - パスワードの再利用、マルウェアのダウンロード、拡張機能のインストールなどのブラウザ イベントが取れるようになる

## 利用できそうな機能・ポリシー

[Chrome Enterprise Core ガイド](https://support.google.com/chrome/a/answer/9597753)のPDFを参照。大体やりたかったことできそう。

- ユーザーとブラウザの設定
  - [ユーザーまたはブラウザに Chrome のポリシーを設定する](https://support.google.com/chrome/a/answer/2657289)にいじれる項目全部のってる
  - ざっと見とりあえず使いそうなもの
    - パスワードマネージャー
    - 管理対象のブックマーク
    - Chromeブラウザの更新
- アプリと拡張機能
  - 拡張機能の管理
- ブラウザのバージョンレポート
  - ブラウザのバージョンレポートの表示
- アプリと拡張機能のレポート
  - アプリと拡張機能のレポート

## 除外項目

ドキュメントを読んでいて自分が気にしなくていい点を適当にまとめておく

- Chrome ブラウザのユーザーレベル管理を設定する
  - BYODを許可する企業向けかな？自分は関係ないので除外

https://support.google.com/chrome/a/answer/9025411?hl=ja&sjid=9519376760784718939-AP&visit_id=638722047432532511-1636534969&ref_topic=9312683&rd=1

- Android デバイスを対象に Chrome ブラウザ クラウド管理を設定する
  - Androidを利用していないので除外

https://support.google.com/chrome/a/answer/11480811?hl=ja&ref_topic=9027869&sjid=9519376760784718939-AP

## 注意点・補足

- 1台のデバイスに複数の Chrome ブラウザがインストールされている場合、ブラウザリストには単一の管理対象ブラウザとして表示されます。
- 登録トークンは登録時にのみ使用されます。登録後、トークンは管理コンソールで取り消すことができます。ただし、登録済みのブラウザは登録されたままになります。
- Windows では、Chrome ブラウザの登録に管理者権限が必要なため、システム インストールのみがサポートされています。
- 組織部門ごとに使用できる登録トークンは 1 つのみ
- ブラウザの登録解除はGUIでもできるが公式のスクリプトでもできる
  - [UnenrollBrowser サンプル スクリプト](https://github.com/google/ChromeBrowserEnterprise/blob/main/ps/src/cbcm/README.md#unenroll-the-browser)
- 登録トークンとデバイストークンを確認する必要がある場合は[2. クラウド管理型の Chrome ブラウザを登録する](https://support.google.com/chrome/a/answer/9301891)の「登録とデバイストークンの場所」を確認
- デバイスの再登録をする場合は[2. クラウド管理型の Chrome ブラウザを登録する](https://support.google.com/chrome/a/answer/9301891)の「デバイスを再登録する」を確認
- 登録プロセス中に次の情報がアップロードされる
  - デバイス ID
  - 登録トークン
  - マシン名
  - OS のプラットフォーム
  - OS のバージョン
  - Windows BIOS シリアル番号
- ベストプラクティス
  - ブラウザの登録やポリシーの設定をルートレベルで行うことは非推奨
    - ポリシーが適用されていない新しい組織部門を容易に作成できるようにするため
  - クラウドレポートを有効化しろ
  - 拡張機能を管理しろ
  - Chromeの更新方法を管理しろ
  - 複雑な組織構造にしない
    - 本番と検証の2つのOUだけを持つことをおすすめする
  - 管理対象ブラウザレポートのアップロード頻度を最小の3時間に設定して、デフォルトの24時間よりも頻繁にレポートが表示されるようにすることをおすすめする

## 疑問点・検証すること

- テナントが違うUserに対してポリシーはどのように効くのか
  - あくまでブラウザが管理対象になるだけでUserがどのテナントに所属しているかは関係ない？
- ポリシーのバッティングについて
  - Intune,Jamfなどでポリシーをすでに配布していた場合どのような挙動になるのか
  - [書いてあった](https://support.google.com/chrome/a/answer/9301892?hl=ja&ref_topic=9301744&sjid=9519376760784718939-AP)MDM側が優先されそう？
    - 複数のソースで競合するポリシーが設定されている場合
      - Windows グループ ポリシーなどのオンプレミス プラットフォームで設定されたマシンレベルのポリシーは、登録済みブラウザのポリシーよりも優先されます。
      - 登録済みブラウザのポリシーは、ユーザー アカウントに設定されたポリシーよりも優先されます。ポリシーがリストである場合、値はマージされません。
      - ポリシーが適用されていることを確認するには、ユーザーのパソコンで**chrome://policy**にアクセスします。
  - [こっちのほう](https://support.google.com/chrome/a/answer/9037717?hl=en#zippy=%2Cplatform-policies)が詳しく書いてあった
    - ポリシーの優先順位は変更できるっぽい
    - デフォルの優先順位は下記
      - 1 プラットフォームポリシー
      - 2 マシンクラウドポリシー
      - 3 OSユーザーポリシー
      - 4 クラウド ユーザー ポリシー (Chrome プロファイル)

以上メモ書きでしたー
触る機会はあると思うのでそのときにやっていきま
