---
title: "Windows10のDNS設定変更"
emoji: "📝"
type: "tech"
topics: ["dns", "technology", "windows10"]
published: false
---

ども天野です。

前回「我が家にあったDNSサーバーはどれなのか」ってことで記事にしましたが、DNSの変更方法がわからない方もいるので記事にしようと思います。

https://amano-yuruyuru.com/choose-dns-server

## PCでのDNS変更作業

タスクバーのPCアイコンを右クリックしてください。

![](/images/change-dns-memo/image-01.png)

「ネットワークとインターネットの設定を開く」をクリック

![](/images/change-dns-memo/image-02.png)

「ネットワークと共有センター」を開きます。

![](/images/change-dns-memo/image-03.png)

「アダプターの設定の変更」をクリック

![](/images/change-dns-memo/image-04.png)

自分が接続しているネットワークを右クリックしてプロパティを選択します。

![](/images/change-dns-memo/image-05.png)

「インターネットプロトコル　バージョン4(TCP/IPv4)」のプロパティを選択

![](/images/change-dns-memo/image-06.png)

「次のDNSサーバーのアドレスを使う」に✓をいれ、優先DNSと代替DNSを入力すれば完了です。

![](/images/change-dns-memo/image-07.png)

## ルーター側の設定を変更する

上記の方法だと自分の家にある、すべての機器の設定を1台、1台変更しなければいけませんよね。これはメンドクサイ。ということで、ネットワークの大元となるルーターの設定を変更してきましょう。

ルータにアクセスしてください。※ルータへのアクセス方法がわからない方は「ルーターの機器名＋初期設定」とかで検索していただければアクセス方法はヒットすると思います。

私の場合ですがNURO光から配られてるF660Aという機器を使用しています。ルータにアクセスした後はDNSサーバーの設定を変更する項目があると思いますのでその項目を変更します。

https://amano-yuruyuru.com/nuro-review

設定変更が完了すれば、すべての機器のDNSが設定したDNSサーバーに変更になります。

![](/images/change-dns-memo/image-08.png)

## DNSサーバーが変更されたか確認する

「Windowsシステムツール」からコマンドプロンプトを起動してください。

![](/images/change-dns-memo/image-09.png)

下記のコマンドを打ってください。

```plane
ipconfig /all
```

現在のDNSが確認できますので自分が設定したものになっていればうまく変更できています。

![](/images/change-dns-memo/image-10.png)

うまくDNSの設定変更ができればいいですね！

それでは＼(^o^)／
