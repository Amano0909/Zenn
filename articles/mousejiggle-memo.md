---
title: "[フリーソフト]Mouse Jiggler（マウスが微妙に動くツール）の使い方"
emoji: "📝"
type: "tech"
topics: ["technology"]
published: true
---

お疲れ様です。

たまたま、仕事で触る機会があったフリーソフトを紹介しようと思います。
その名も
「Mouse Jiggler」
なにをするツールかというと**マウスを微妙に動かすだけ**。**ただそれだけ**

## ダウンロード＆インストール

GitHubで公開されてます。

ダウンロードは下記から

https://github.com/arkane-systems/mousejiggler/releases

赤枠のどちらかをダウンロードしてください。

Zipを解凍すればそのまま使えます。

![](/images/mousejiggle-memo/image-01.png)

portable版ではない方は「.NET 5 runtime」が必要です。

ただ、作者的にはポータプル版はおすすめではないらしいようです。

> Mouse Jiggler のポータブル バージョン (つまり、.NET 5 ランタイムを必要としないため、.NET 5 ランタイムがインストールされていないロックダウンされた企業のマシンにインストールできるバージョン) は、MouseJiggler-portable としてリリース ページで入手できます。 。ジップ。解凍して行ってください。
>
> **他の代替手段がある場合は、このバージョンを使用しないでください。**

READMEを読むと作者的にはChocolateyの利用をお勧めしていますね。

下記のコマンドでインストールが可能です。

```plain
choco install mouse-jiggler
```

「Chocolatey」とはhocolatey Software社が開発しているコマンドラインツールです。コマンドラインからいろんなソフトウェアがインストール可能です。「Chocolateyなんじゃそりゃ」という方はZip版でいいかと思います。

## 使い方

MouseJigglerを起動すると下記の画面になります。

![](/images/mousejiggle-memo/image-02.png)

- Jiggling?
  - チェックを入れると、マウスが微妙に動きます。

- Settings
  - チェックを入れると設定項目を表示します。

- Zen Jiggle?
  - チェックを入れると、マウスが微妙に動くのを隠してくれます。
    - 内部的には動いているのでご安心をｗ

- Minimize on Start?
  - チェックを入れるとマウスを動かす感覚を調整できます。
    - Defaultだと1秒っぽいです。

- 🔽
  - チェックを入れると「MouseJiggler」を最小化します。

### ちょっと応用的な使い方

「Mouse Jiggler」はコマンドラインでオプションを追加して起動することができます。

オプションは下記のような設定があります。

> Options:
> -j, --jiggle Start with jiggling enabled.
> -m, --minimized Start minimized (sets persistent option). [default: False]
> -z, --zen Start with zen (invisible) jiggling enabled (sets persistent option). [default: False]
> -s, --seconds <seconds> Set number of seconds for the jiggle interval (sets persistent option). [default: 1]
> --version Show version information
> -?, -h, --help Show help and usage information

なので下記のようなコマンドで起動すると「マウスを微妙に動かすをON＆マウスが微妙に動くのを隠して＆最小化」して起動することが可能です。

```plain
MouseJiggler.exe -j -m -z
```

これをps1ファイルとかで保存してスタートアップに登録しておけば再起動するごとに「Mouse Jiggler」がいい感じに立ち上がってきます。

## 使い道を考える

### スクリーンセーバーを起動させない

まず一番の候補はこれでしょう。

GPOなどで強制的に10分とかでスクリーンセーバーを起動させるような設定をしている会社さんは多いと思います。

なにかのスクリーンセーバーが立ち上がると支障がある作業中に起動しておくと幸せになれるとかと。

あとはずっと画面をつけっぱなしにしておく必要がある端末。たとえば、ダッシュボードを常に画面に表示させておく必要がある端末とかに設定しておくと良いかと。

根本的にはMDMのルールとかを見直す必要があると思いますが一時しのぎ的な使い方はありだと思います。

### 在宅ワーク、監視されている状況下で・・・

これ以上はなにもいいません。。。笑
そういう使い方をしている人はいるんじゃないかと予測できます。

私個人的には監視自体反対なんですけどね。
成果物がちゃんと評価できる環境であればいいかなと。

## まとめ

今回は「Mouse Jiggler」についてまとめてみました。
もしかしたら、使う機会があるかもしれませんので参考にしてみてくださいね。

それでは、最後までお読みいただきありがとうございました。
