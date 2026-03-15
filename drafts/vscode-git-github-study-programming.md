---
title: "VSCode,Git,GitHubでプログラミング練習環境を整えよう"
emoji: "📝"
type: "tech"
topics: ["git", "github", "technology", "vscode"]
published: false
---

今日はプログラミングの練習環境について書きたいと思います。

プログラミングを練習し始めたときいろいろな環境で練習しますよね。家だったり、仕事場だったり、カフェだったり。

質問ですがそのときそのときで使用しているPCは一緒ですか？

ノートパソコンだったり、会社貸与のPCだったり、デスクトップだったりしません？

ぼくの場合は3端末ほど使いまわしたりしています。

そんなときに問題になることがあるんですね。
そう！練習問題どこまで進めたかわからない問題！！

プログラミングの練習方法でよくある写生。
いろいろな環境で練習し始めるとコードが端末、端末に散ってしまってバラバラに。
そして、PCのデータが吹き飛んだときにはコードに書いてあったメモ書きも一緒にどこかへ・・

今日はそんな「練習問題どこまで進めたかわからない問題」と「やべーデータ吹き飛んでコードまっさら問題」を解決する方法をお伝えします。

## VSCodeをインストール&簡単な設定

今回はコードエディターにVSCodeを使っているのでとりあえずVSCodeをインストールしましょう。

ダウンロードは[こちら](https://code.visualstudio.com/)から

VSCodeは多くのプログラミング言語に対応しているソースコードエディターです。

補完とか、シンタックスハイライトとか、拡張機能があったり、もちろん日本語にも対応。

エディターなにを選べばいいかわかんなーいって方にとりあえずおすすめ

インストールはすべてデフォルトで大丈夫です。

インストールが完了したら日本語化しましょう。
赤枠の部分をクリックして〜
![](/images/vscode-git-github-study-programming/image-01.png)

検索欄に「japanese」と入力して「Japanese Language Pack for ...」をインストールしましょう。
再起動を求めれるので再起動を。

![](/images/vscode-git-github-study-programming/image-02.png)

したら同じ調子で「Git History」と検索してヒットした拡張機能をインストール！

![](/images/vscode-git-github-study-programming/image-03.png)

これでVSCodeの準備は整いました。

## Gitをインストール

では次にGitについて知りましょう。

Gitとは

> Git（ギット[2][3][4]）は、プログラムのソースコードなどの変更履歴を記録・追跡するための分散型バージョン管理システムである。Linuxカーネルのソースコード管理に用いるためにリーナス・トーバルズによって開発され、それ以降ほかの多くのプロジェクトで採用されている。Linuxカーネルのような巨大プロジェクトにも対応できるように、動作速度に重点が置かれている。現在のメンテナンスは濱野純 (英語: Junio C Hamano) が担当している [wiki](https://ja.wikipedia.org/wiki/Git)より

いわゆるバージョン管理のためのツールになります。
Gitについて詳しく書くとそれで1記事終わってしまいますのでくわしくは[こちら](https://www.kagoya.jp/howto/it-glossary/develop/git/)の方の記事を参考にしてみてください。

それではGitをインストールしていきましょう。
まずは[公式サイト](https://git-scm.com/downloads)からGitをダウンロードしてください。

ダウンロードが終わりましたらインストールしていきましょう。
すべてデフォルトで大丈夫です。

インストールが終わったらGitがうまくインストールされているかコマンドプロンプトから下記のコマンドで確認してください。

```plane
git --version
```

うまくバージョン情報が表示できれば大丈夫です。

次にgitの最低限必要なのユーザー情報の初期設定を済ませてしまいましょう。
コマンドプロンプトで

```plane
git config --global user.name hogehoge
git config --global user.email hogehoge@gmail.com
```

と入力。

これでGitが使えるようになりました。

## GitHubに登録しよう

次にGitHubに登録しましょう。

GitHubとは

> GitHubは、ユーザのみなさんからヒントを得て作成された開発プラットフォームです。オープンソースプロジェクトやビジネスユースまで、GitHub上にソースコードをホスティングすることで数百万人もの他の開発者と一緒にコードのレビューを行ったり、プロジェクトの管理をしながら、ソフトウェアの開発を行うことができます。

いわゆる開発者のためのプラットフォームになります。
自分のコードをネット上に公開したり、複数人で開発を行う際にオンラインでコードを管理するサービスになるんです。
今回はこれを利用します。

登録を[こちら](https://github.co.jp/)から行います。

## VSCode,Git,GitHubでプログラミング練習環境を用意する

準備は整いました。

まず、GitHubで新たな「リポジトリ」を作成します。
サインインした画面の右上、自分のアイコンをクリックして「Your repositories」を選択しましょう。

![](/images/vscode-git-github-study-programming/image-04.png)

「NEW」をクリック

![](/images/vscode-git-github-study-programming/image-05.png)

Repository name に好きな名前を
Private に✓を
・・・with a README に✓を
そしてCreate repository ををクリックしましょう。

![](/images/vscode-git-github-study-programming/image-06.png)

これで練習用のリポジトリが作成されました。
先程作成したリポジトリを確認してClone or download を押して表示されるURLをコピーしてください。

![](/images/vscode-git-github-study-programming/image-07.png)

そしたら自分のPCのローカルに練習用のフォルダを作成してVSCodeでフォルダを開いてください。
そして「ターミナルで開く」をクリック

![](/images/vscode-git-github-study-programming/image-08.png)

ターミナルが開いたら下記のコマンドを入力
*URLのところは先程コピーしたURL

```plane
git clone URL
```

コマンドを入力するとGitHubに登録した際のユーザー名をパスワードを求められるので素直に入力。これでローカルのフォルダとオンライン上にあるリポジトリが紐付けられました。

試しになにかファイルを作成してみましょう。
*今回は「text.txt」というファイルをリポジトリに追加してみます。

ファイルを作成すると「ファイルが更新・追加されたよ〜」とアイコンが表示されます。

![](/images/vscode-git-github-study-programming/image-09.png)

そして「＋」ボタンを押して、「変更をステージ」を行います。

![](/images/vscode-git-github-study-programming/image-10.png)

そして、そして〜
✓ボタンを押して変更をコミットしましょう。
コミットの際、コメントは忘れないように〜
*コミットとステージングの違いは調べてみてください

![](/images/vscode-git-github-study-programming/image-11.png)

最後にGitHubにプシュします。
実際にGitHubにログインしてうまくアップロードできているか確かめてくださいね。

![](/images/vscode-git-github-study-programming/image-12.png)

これでオンラインにコードが保存されたのでどの端末からでもプログラミングの練習ができますね！
他の端末でコードをいじる際はまず同じ方法でコードをコピーします。

これ。

```plane
git clone URL
```

そして変更を他の端末でも反映させたい場合は他端末で下記のコマンドを入力しましょう。

```plane
git pull
```

これで変更が反映されます。

ちなみにコミットの履歴を見たいという場合はVSCode上でSHIFT＋CONTROL＋Pで「git log」と検索。

![](/images/vscode-git-github-study-programming/image-13.png)

![](/images/vscode-git-github-study-programming/image-14.png)

いままでのコミットが視覚的に確認できるのでめっちゃ便利です。

以上を参考にしてもらってVSCode,Github,Gitを利用して快適なプログラミング練習環境を整えましょう〜！

記事を見てくださってありがとうございました。
ではでは(・ω・)ノシ
