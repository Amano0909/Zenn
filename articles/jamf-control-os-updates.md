---
title: "[Jamf]OSのアップデートを制御する"
emoji: "📝"
type: "tech"
topics: ["jamfpro", "technology"]
published: false
---

お疲れ様です。

今回はJamfでのOS制御について簡単にまとめます。

## 構成プロファイルでの制御

一番ベターなやり方ではないでしょうか。

構成プロファイルでOSのアップデート制御を行います。

設定は下記にあります。

「制限」のペイロード⇒「

Functionality

」

![](/images/jamf-control-os-updates/image-01.png)

下の方に設定があります。

![](/images/jamf-control-os-updates/image-02.png)

メジャーアップデートとマイナーアップデートそれぞれ制御できます。

マイナーアップデートはセキュリティ関連のアップデートが多いので短めで、メジャーアップデートは各社のタイミングで制御すればいいんじゃないでしょうか。

これで通知を出さず、ユーザーにはシステム環境設定で利用可能な項目として表示されなくなります。

## 制限付きソフトウェアで制御

上記の構成プロファイルでの制御をしても、インストーラーをユーザーに直接叩かれるとアップデートできてしまいます。

例えば下記のコマンドで最新のインストーラーが入手可能です。

```plain
softwareupdate --fetch-full-installer
```

https://applech2.com/archives/20191018-macos-1015-catalina-softwareupdate-cmd-support-fetch-full-installer.html

それでは、ここはどうやって制御したらいいのでしょうか。

「制限付きソフトウェア」を使います。

![](/images/jamf-control-os-updates/image-03.png)

ここでインストーラーのプロセス名をブロックすることで制御します。

こんな感じです。

![](/images/jamf-control-os-updates/image-04.png)

Scopeを定めないと制御できないのでお忘れなく。

また、インストーラーのプロセス名は伝統的に下記のようでした。

新しいメジャーアップデートがあった際に参考にしてください

```plain
Install macOS "OS名".app
例
Install macOS Ventura.app
Install macOS Monterey.app
```

所属しているコミュニティで教えてもらいましたが名前変更されてしまうと動いてしまうようです。
もうそこまでやる人は捕まえて説明しましょうｗ
スマートグループでOSの状況を確認しているとすぐに気づけるので幸せになれると思いました。

## 「InstallAssitant」を制限付きソフトウェアでの制御する

最終手段です。

このプロセスはすべてのmacOSインストーラーで利用されるプロセス名になります。

これを制御すると確実にmacOSのアップデートを止めることができます。

ただし、メジャーアップデート・マイナーアップデート関係なく止めてしまいます。

セキュリティ関連のアップデートが多いマイナーアップデートは止めたくないですよね。

なので最終手段です。

設定方法は「制限付きソフトウェア」と同じですね。

## まとめ

Macのアップデート制御については構成プロファイル＋制限付きソフトウェア（インストーラー名）でやるのがいいんではないでしょうか。

InstallAssitantを止めるのは最終手段ですね。

そういえば、Jamf公式のOS制御に関する動画あったので貼ってきます。

https://www.youtube.com/embed/ozmDIbAyMhI

あと良さげな記事も。

https://www.jamf.com/ja/blog/reinstall-a-clean-macos-with-one-button/

https://www.too.com/apple/apple_tips/OS_update.html

それでは、最後までお読みいただきありがとうございました。
