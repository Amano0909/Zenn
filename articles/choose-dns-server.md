---
title: "我が家に合ったDNSサーバーを速度を計測して選択しよう【DNS Benchmark】"
emoji: "📝"
type: "tech"
topics: ["cloudflare", "dns", "dns-benchmark", "google-public-dns", "quad9"]
published: false
---

ども天野です。

今回は我が家にあったDNSサーバーを選択する方法を紹介できればなと思います。さあさあ、みなさんの結果はどうなるでしょうか。

## DNSとはなんぞや

そもそもDNSってなんだっけという話と公開DNSサーバーについて復習してみます。

### DNSって？

> DNSは、Domain Name Systemの略で、その名前が示すようにインターネット上でドメイン名（ドメインネーム
>
> [※1](https://www.nic.ad.jp/ja/newsletter/No22/080.html#note01)
>
> ）を管理・運用するために開発されたシステムです。DNSはインターネットを利用するうえでなくてはならない存在であり、現在のインターネットにとって、必要不可欠なシステムの一つとなっています。
>
> では、DNSとはどのようなものなのでしょうか。
>
> インターネットに接続している機器には「IPアドレス」という固有の番号が必ず割り当てられます。そして、インターネット上におけるすべての通信は、相手先のIPアドレスが指定されることにより行われます。例えば、JPNIC Web（http://www.nic.ad.jp/）をWebブラウザで見る場合、実際にはwww.nic.ad.jpのIPアドレスである202.12.30.144という宛先IPアドレスに対して通信が行われることになります。そのためhttp://www.nic.ad.jp/を指定するかわりにhttp://202.12.30.144/とすることも可能です
>
> [※2](https://www.nic.ad.jp/ja/newsletter/No22/080.html#note02)
>
> 。
>
> しかし、このようにIPアドレスで相手先を直接指定することは、インターネットを利用する各ユーザーが、該当するWebサーバ等のIPアドレスをなんらかの方法ですべて記憶しておく必要があり、現実的ではありません。また、なんらかの理由により相手先ネットワークの構成が変更された場合、IPアドレスはしばしば付け直されたり、変更される場合があります。このような場合、以前記憶していたIPアドレスでは接続できなくなってしまいます。
>
> そのため、より人間が覚えやすく使いやすい「名前」で指定できるようにするためのしくみが必要となります。DNSはそれを実現するためのシステムです。
>
> [日本ネットワークインフォメーションセンター](https://www.nic.ad.jp/ja/newsletter/No22/080.html)
>
> より引用

ということで要は名前解決を行ってます。IPアドレスとドメインの紐付けですね。

### 公開DNSサーバーについて

DNSについての復習が終わったところで次は公開DNSサーバー(

パブリックDNSサービス

)について復習していきましょう。公開DNSサーバーは世界中の誰もが利用できるように公開されているDNSサービスのことです。ほんとに公開していただいている企業様には感謝。ここでは信頼性が高い代表的なサービスを紹介します。

#### Google Public DNS

Webの神様、世界のGoogle神が運用しているDNSサービスになります。公開は2009年と古く、

膨大な情報量を持っており、応答速度が高速で安全性が高いのが特徴です。Googleならではの信頼感がありますね。

IPアドレス：8.8.8.8 / 8.8.4.4

ホスト名：dns.google

https://developers.google.com/speed/public-dns

#### Quad9

IBMなど複数の企業が連携して提供している無料のDNSサービスになります。このDNSは個人情報の盗難や、ランサムウェアやマルウェアの感染、不正行為の実行が確認されたWebサイトからユーザーを保護することを目的しているそうです。安全性重視の方におすすめしたい。

IPアドレス：9.9.9.9 / 149.112.112.10

ホスト名：dns.quad9.net

https://techtarget.itmedia.co.jp/tt/news/1801/18/news01.html

#### Cloudflare

「Cloudflare」は、新興のDNSプロバイダです。公開は2018年の4月1日とつい最近で、アクセス時のIPアドレスなどのログを残さないのが大きな特徴です。サーバーの応答速度も早い。

IPアドレス：1.1.1.1 / 1.0.0.1

ホスト名：one.one.one.one

https://internet.watch.impress.co.jp/docs/news/1114805.html

## DNS Benchmarkを使って我が家にあったDNSサーバーを選ぶ

さぁ、ここまでで「DNS」と「公開DNSサーバー」について復習が終わったところで本題です。じゃあ、

我が家にあったDNSサーバーはどれなのか

ってところです。それにはDNSサーバーとの速度を測定してみないとわからないですよね。今回は「DNS Benchmark」というソフトを利用してみます。

使用できるのはWindowsのみです。Mac版はありません。

[ここ](https://www.grc.com/dns/benchmark.htm)

からソフトウェアをダウンロードします。したの方にあるDownloadからです。

![](/images/choose-dns-server/image-01.png)

Downloadしたファイルをダブルクリックしてもらえればソフトウェアが立ち上がります。さっそく、速度を測定してみましょう。「Nameservers」>>「Run Benchmark」を選択します。

![](/images/choose-dns-server/image-02.png)

青いゲージが終われば測定完了です。

![](/images/choose-dns-server/image-03.png)

2,3分で測定は完了します。「Sort Fastest First」に✓が入っていれば

応答速度順にDNSサーバーが並びます。補足ですが現状使用しているDNSには緑の●が入ります。

![](/images/choose-dns-server/image-04.png)

グラフの見方についてですが

赤色（キャッシュ済みのドメイン名）
緑色（キャッシュされていないドメイン名）
青色（存在しないドメイン名）

バーが短ければ短いほどレスポンスが良いことになります。これでどのDNSサーバーが速度が早いかわかりました。

もし測定したいDNSサーバーが一覧にない場合、「Add/Remove」から追加したいDNSサーバーのアドレスを入力して追加してください。

![](/images/choose-dns-server/image-05.png)

次にDNSのステータスを確認してみましょう。「Status」タブをクリックします。

![](/images/choose-dns-server/image-06.png)

大きく分けると緑マークのサーバーが良好なDNSサーバー、オレンジマークのサーバーが注意すべきDNSサーバー、赤マークのサーバーが不良なDNSサーバーです。

・DNS services are available and working(DNSサービスは利用可能で、稼働中)
・DNS queries are not being consistently answered(DNSクエリの応答に一貫性がない)
・Bad domain names are intercepted by provider(不適切なドメイン名がプロバイダに検閲されている)
・DNS queries are not being answered here(DNSクエリの応答無し)
・DNS lookup is not offered by this server(DNS検索サービスが提供されていない)

これでDNSサーバーの速度、ステータスを確認することができました。この2つの情報から自分にあったDNSサーバーを選択しましょう！

## まとめ

私の場合ですが「level 3 communications 」という企業が運用しているDNSが速度的には一番いいよという結果になりました。ですが、ちょっと聞いたことがない企業でしたので設定するのは怖く、気持ち的にも信頼できるDNSサーバーを選択したいというところがあったのでDNSサーバーは「Quad9」を選択しました。ちなみに、いままでGoogle Public DNSを使ってました。

みなさんも自分にあったDNSサーバーを選択してくださいね！よいPCライフを。

それでは＼(^o^)／
