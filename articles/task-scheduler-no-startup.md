---
title: "タスクスケジューラが起動できない問題について"
emoji: "📝"
type: "tech"
topics: ["taskscheduler", "technology"]
published: false
---

お疲れ様です！

今回はHAADJ(Hybrid Azure AD Join)展開中に起きた問題についてまとめようと思います。

HAADJなんじゃそりゃという方は最初の方はすっ飛ばしてください。

## 起きた問題

現在所属している企業ではHAADJ端末を展開中なのですがうまくPCオブジェクトがAzure ADに同期されない問題が起きていました。

そこで該当の端末を調べてみたところなんとタスクスケジューラが起動できない状態だったのです。

エラー内容は「

リモートコンピューターが見つかりませんでした

」というメッセージでした。

![](/images/task-scheduler-no-startup/image-01.png)

タスクスケジューラが起動しないということはHAADJできません。これは、タスクスケジューラによって設定されているタスクが実行されることによってHAADJは実行されるからです。

詳しくは下記のMSブログを推奨です！

https://jpazureid.github.io/blog/azure-active-directory/troubleshoot-hybrid-azure-ad-join-managed/

> パス : [タスクスケジューラ] – [タスクスケジューラ ライブラリ] – [Microsoft] – [Windows] – [Workplace Join]
>
> タスク名 : Automatic-Device-Join

具体的には上記タスクが実行されないとHAADJできないです。

## 試したこと

https://matarin1725.com/archives/19840463.html

上記の記事を参考にやれることはやってみましたが、うまくいかず。。

### 原因を見つける

これは僕ではなく先輩が見つけてくれたんですが下記のログが確認できました。

イベントビューアーで「Windows ログ」⇒「Application」

> ソフトウェア保護サービスの 2117-12-01T17:16:41Z の再起動をスケジュールできませんでした。エラー コード: 0x80041315。

## 対処法

このエラーの対処法を調べたところ下記のような対処法を見つけました。

レジストリエディタで下記の値を設定します。

```plain
コンピューター\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TimeBrokerSvc
```

の Start の値を 3 にします。

私の場合はStartの値が4になっていました。

![](/images/task-scheduler-no-startup/image-02.png)

この値を設定後再起動したところタスクスケジューラが無事起動しました。

### このレジストリ値はなんなのか

このレジストリ値について調べてみるとランタイムブローカーというプロセスに関係しているようです。

それでは、ランタイムブローカーとはなんなのか

> ランタイム ブローカーは、Windows 8 でデビューし、Windows 10 でも継続する公式の Microsoft コア プロセスです。これは、Windows ストアから入手したユニバーサル アプリ (Windows 8 では Metro アプリと呼ばれていました) がすべてのアクセス許可を宣言しているかどうかを判断するために使用されます。あなたの場所やマイクにアクセスできるように。常にバックグラウンドで実行されていますが、ユニバーサル アプリを起動すると、そのアクティビティが増加する可能性があります。これは、構成した信頼とプライバシーの設定でユニバーサル アプリをフックする仲介者のようなものと考えることができます。
>
> [What Is “Runtime Broker” and Why Is It Running on My PC?](https://www.howtogeek.com/268240/what-is-runtime-broker-and-why-is-it-running-on-my-pc/)から引用

なるほど。なにかしらWindowsアプリケーションに関係してそうなプロセスのようです。

このプロセスが起動していないためタスクスケジューラが起動できなかったと考えられます。

また、設定値については下記のようです。

> 次のエントリを見つけます:
>
> [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TimeBroker] "Start"=dword:00000003
>
> 3 を 4 に変更します。
>
> [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\TimeBroker] "Start"=dword:00000004
>
> 4 は無効、3 は手動、2 は自動起動です。
>
> 編集前の元の値は 3 でした。無効にするには 4 に設定します。MODIFY メニュー選択で 3 を 4 に変更し、regedit を終了してシステムを再起動するだけです。
>
> [Runtime Broker and Antimalwear high resource usage.](https://answers.microsoft.com/en-us/insider/forum/all/runtime-broker-and-antimalwear-high-resource-usage/db65a40f-477b-4af8-a2ac-3a24571751d1)
>
> から引用

私の場合設定値がなにかしらの原因で4だったためランタイムブローカーが起動せず、タスクスケジューラが起動できなくなっていたようでした。

## まとめ

今回はタスクスケジューラが起動できない問題についてまとめました。

企業で利用しているPCならADのGPOかIntuneで設定してもいいかなとは思いました。

それでは、最後までお読みいただきありがとうございました。
