---
title: "Universal Printはまだ辛そうだって話"
emoji: "📝"
type: "tech"
topics: ["technology", "universal-print"]
published: false
---

会社で管理している複合機・プリンターの数が多くなってきて辛いので対策方法を考える。

そんで1番使いたかったMSのUniversal Printがまだ辛そうだからやめとくって話

## Universal Printはまだ辛そう

### 理由1：ライセンス持っていても追加コスト100%かかるでしょ

https://learn.microsoft.com/ja-jp/universal-print/fundamentals/universal-print-license

まずUniversal Print使うにはライセンス最低限必要。

![](/images/universal-print/image-01.png)

これ＋アルファ印刷に対して費用が発生します。

![](/images/universal-print/image-02.png)

1ライセンスあたり5ジョブしか処理することができません。1000ライセンス持っていても5000ジョブしか処理できない。。100%追加で費用が発生するよねって話です。

嘆いている人は自分以外にもいる模様

https://twitter.com/shao1555/status/1455379958277148674

しかもこのジョブというのは同じLAN上にいてもカウントされるようです。

https://learn.microsoft.com/ja-jp/universal-print/fundamentals/universal-print-faqs

![](/images/universal-print/image-03.png)

辛いんゴ・・

### 理由2：Hybrid構成では結局プリントサーバーが必要になる or コネクタが必要になる

https://learn.microsoft.com/ja-jp/universal-print/fundamentals/universal-print-hybrid-ad-aad-environment-setup

![](/images/universal-print/image-04.png)

Hybrid構成の場合、結局プリントサーバー立てるんかいっていう。

サーバーの面倒みたくないでござる。

また、Universal Printに対応していない機器に対してIntuneコネクタというアプリケーションをサーバーに対してインスールすることで対応させることができるのですが結局ここでもオンプレの面倒を見なければいけなくなるのです。1拠点に1台づつサーバーを置く形か拠点間ネットワークを構築して1台のサーバーにコントロールを集約する形になるでしょう。

結局なにかしらのオンプレ機器の面倒が発生するわけで辛そうというところです。

### 理由3：対応している機器がまだ少なすぎる

下記はFUJIFILMの対応機器の一覧です。

ちょっとまだ少なすぎますね。

理由2も機器自体が対応していればクリアできる問題なのですが現状では辛そうです。

https://www.fujifilm.com/fb/product/multifunction/promotion/universal_print

### 理由4：遅延が発生する？

自分で検証したわけではないので確かな情報ではないのですが下記の情報を見つけました。

間違っていたらすみません。

どうやらredditのユーザーからの情報によれば遅延が頻繁に発生するようです。

https://twitter.com/AmanoH0909/status/1588449349704749057

## じゃあプリンターの管理どうするか

てきとうに候補を書いてみる。

### SaaSで解決する

調べた感じprintixが良さげ

https://printix.net/

printixの使用感についてはクラウドネイティブさんが書いてる

https://blog.cloudnative.co.jp/8575/

あと気になっているのがこっち

https://www.papercut.com/jp-jp/

### プリントサーバー立てる

諦めてプリントサーバー立てるパターンですね。

ただ、そのために拠点間ネットワークを維持は必須になるかな。

SaaSのパターンと比較してできることなら避けたい。

### uniFLOW Online

ちょっと調べきれてないのですがCanonからでている「uniFLOW Online」というサービスならやりたいことができるかも？？

ただし、複合機を他社製品で使っている場合入れ替え待ったなし

はい。今回はUniversal Printを諦めた話を書きました。

もっといいサービスになることを期待！！

それでは～

## 追記

神アップデートきてる

https://twitter.com/AmanoH0909/status/1643781097724219392
