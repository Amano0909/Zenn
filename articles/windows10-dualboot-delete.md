---
title: "デュアルブート削除方法"
emoji: "📝"
type: "tech"
topics: ["linux", "technology"]
published: true
---

Linuxを試したい！
そうだ、Ubuntuを使ってみよう!

と勢い任せにUbuntuとデュアルブートをやってみたはいいが使用しなくなってアンイストール方法がわからぬ。。今回はそんな人のための解決方法。

ちなみにUbuntuのインストール自体はWindowsとは別ドライブの場合です。

## コマンドプロンプトを起動

Windows システムツールからコマンドプロンプトを立ち上げてください。
その際、必ず「**管理者として実行を**」選択してください

![](/images/windows10-dualboot-delete/image-01.png)

![](/images/windows10-dualboot-delete/image-02.png)

## こまんど

まず

```plane
cd c:\
```

でCドライブディスクの ルートに移動します。
そして次のコマンドでブート情報を調べます。

https://learn.microsoft.com/ja-jp/windows-hardware/drivers/devtest/bcd-boot-options-reference

```plane
bcdedit /enum firmware
```

![](/images/windows10-dualboot-delete/image-03.jpg)

上記のような画面になると思います。

このなかでdescriptionがubuntuいう項目がないでしょうか。
僕の画像ですと、すでに削除してしまったためありません。

identifier の値が識別番号になります。
さっそく削除してきましょう。
次のコマンドです。

```plane
bcdedit /delete {識別番号}
```

このコマンドで削除されます。
もう一度

```plane
bcdedit /enum firmware
```

のコマンドを実行してdescriptionの値がubutuの項目が消えていれば成功です！
最後にUbuntuをインストールしたドライブはフォーマットしておきましょう。