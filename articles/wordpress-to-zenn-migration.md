---
title: "WordPressからZennへ記事を移行した話"
emoji: "📝"
type: "tech"
topics: ["wordpress", "zenn", "codex", "github"]
published: true
---

WordPressで運用していた技術ブログの記事を、Zenn管理へ移行した。

目的は、年間のサーバー費用を減らすこと。

もともとはXserver上のWordPressで記事を書いていたが、技術記事を中心にZennへ移すことにした。移行作業ではCodexを使い、WordPressのXMLと画像データからZenn用のMarkdownを作成した。

この記事では、実際にやったこと、詰まったところ、今後同じことをやるなら気をつけたいことをまとめる。

## WordPressをやめたい

何年か前にXserverで作ったWordPressのサイトがあった。

ただ、下記の理由からやめたかった。

- 維持費用が掛かる
  - 年間で1万4000円程度掛かる
  - お小遣いユーザーの自分にとっては痛い
- セキュリティ更新が大変
  - 静的サイトではないので、いろいろセキュリティアップデートを行ってあげる必要がある
  - プラグイン、テーマ、WordPress本体など、対応すべき項目が多すぎる

そこで、WordPressをやめることを重い腰を上げて対応した。

WordPressが担っている機能として、下記があった。

- 記事
- フォーム
- 自己紹介ページ

フォームは、問い合わせフォーム等で使っていた。

これらをどう逃がそうかと考えたのが最初だった。

フォームについては捨てると割り切った。

そもそも問い合わせもなかったし、特になくてもいいかなって。

必要であれば、XのDMで連絡してね、ぐらいにしようかなと思った。

記事については、無料のブログでいいかなと思っていたので、noteかZennが候補としてあがった。

Zennは技術に特化したプラットフォームだから、それ以外のことはあまり書けない。

noteはなんでも書けるのが良さ。

ただ、自分の場合は過去の記事を見たときに、ほとんど技術的な話がメインで、それ以外の話はなかったのでZennにした。

GitHubで管理できるのもいいし、無料だし。

ホスティングという手段も考えたんだけど、管理がめんどくさいし、記事更新頻度もそこまで高くないからZennで満足できそうとなった。

次が自己紹介ページのほう。

こちらも大前提、安い、GitHubで管理が可能、が選定基準となった。

そうするとCloudflare Pagesがピッタリだった。

もともと独自ドメインの管理にCloudflareを使っていたのも理由として大きい。

参考にした記事。

- [Cloudflare PagesでAstroをデプロイする](https://izanami.dev/post/b0f59b2e-dd6b-4352-af1d-ae14f7cec707)
- [さようならWordPress。AstroとNotionで年間費用を削減した話](https://blog.cloudnative.co.jp/articles/goodbye-wordpress-astro-notion-cost-reduction/)

フレームワークはAstroを利用した。

なんもわからないけど、AIと壁打ちしながら進めたらなんとかなるでしょ、と思っていた。

結果、自己紹介ページがだいぶ営業っぽいページになってしまった。

これはこれでいいのかもしれない。笑

## 環境

もともとの環境は下記。

- WordPress
- Xserver
- 技術記事カテゴリを中心に運用

移行先と作業環境は下記。

- Zenn
- GitHub管理のZenn CLIリポジトリ
- Cloudflare Pages
- Codex

移行先を選ぶときに優先したのは、GitHubで管理できることと、安いまたは無料で運用できることだった。

## まずZenn CLIのリポジトリを用意する

最初にZenn CLI用のリポジトリを作った。

リポジトリのルール整備はCodexにやってもらった。

そのとき、Codexには下記の公式ドキュメントを読ませた。

- [Zenn CLIをインストールする](https://zenn.dev/zenn/articles/install-zenn-cli)
- [Zenn CLIの使い方](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [ZennのMarkdown記法一覧](https://zenn.dev/zenn/articles/markdown-guide)

Zenn CLIでは、基本的に下記の構成になる。

```text
articles/
books/
images/
```

記事は `articles/`、本は `books/`、画像は `images/` に置く。

自分の場合は、Zenn用に整える前の原稿置き場として `drafts/` も作った。

```text
drafts/
articles/
books/
images/
```

`drafts/` はZennにそのまま同期する場所ではなく、雑に書いたメモや、変換前の下書きを置く場所として使う。

## AGENTS.mdにルールを書いてもらう

Codexに作業してもらう前に、リポジトリのルールを `AGENTS.md` にまとめてもらった。

ここがかなり大事だった。

Zenn CLIにはファイル配置、Front Matter、slug、topicsなどのルールがある。Codexがそれを知らないまま作業すると、Zennのプレビューでエラーになるファイルができやすい。

そのため、`AGENTS.md` には下記のような内容を書いてもらった。

- `drafts/` は変換前の下書き置き場
- `articles/` にZenn記事を置く
- `books/` にZennの本を置く
- 記事タイトルは70文字以内
- 記事slugは12〜50文字
- 記事slugは半角英小文字、数字、ハイフンのみ
- topicsは18文字以内
- topicsは半角英小文字と数字のみ
- topicsにスペース、記号、ハイフンは使わない
- 本のslugも12〜50文字にする
- 本の章ファイルにはFront Matterを書く
- WordPress移行時は本文の言い回しを変えない

特に「本文の言い回しを変えない」は強めに書いておいた方がよかった。

Codexは普通に頼むと、読みやすくするために文章を少し整えようとする。今回はリライトではなく移行なので、文章の改善はしてほしくなかった。

## WordPressからXMLをエクスポートする

WordPress管理画面のエクスポート機能からXMLを取得した。

今回は技術記事だけ移行したかったので、下記の条件で絞った。

- 投稿
- カテゴリーはTechnology
- ステータスは公開済み

これで、不要な固定ページやコメントなどをなるべく含めずに、移行対象の記事をまとめて取得できた。

1記事ずつHTMLを拾ってくる方法も考えたが、記事数が多い場合はWordPressのXMLエクスポートを使った方が楽だった。

## 画像データを回収する

WordPressのXMLには、画像ファイル本体は入っていない。

XMLに入っているのは、本文中の画像URLや添付ファイル情報が中心になる。

そのため、Xserverのファイルマネージャーから `wp-content/uploads` を回収した。

WordPressの画像は、だいたい下記のような場所にある。

```text
public_html/
  wp-content/
    uploads/
```

Xserverのファイルマネージャー上では、対象ドメインの `public_html` 配下を見にいく。

画像は最終的にZennリポジトリの `images/` 配下に置いた。

ZennのGitHub連携では、リポジトリ直下の `images/` 配下に画像を置いて記事から参照できる。

## Codexで変換する

Codexには、WordPressのXMLと画像データをもとに、Zenn用Markdownへ変換してもらった。

やってもらったことは下記。

- WordPressのXMLから記事本文を抽出する
- WordPressのHTMLをZenn向けMarkdownに変換する
- WordPress独自ショートコードを必要に応じて変換する
- 記事内の画像URLを `/images/...` 参照へ置き換える
- `articles/` にZenn用Markdownを生成する
- `published: false` の下書き状態で移行する

このとき、文章については下記を明示した。

- 本文の言い回しは変えない
- 要約しない
- 文章を整えない
- 変えるのは構文だけ
- Front Matterは必要最小限だけ追加する

つまり、やってほしいのは「文章のリライト」ではなく「HTMLからMarkdownへの構文変換」だった。

## Zennで引っかかった制約

移行後は `npx zenn preview` で確認した。

この段階で、いくつかZenn側の制約に引っかかった。

### 投稿上限

Zennには、AIによるコンテンツ執筆に関する方針がある。

公式のお知らせでも、AIの利用自体は禁止しない一方で、生成AIによるコンテンツの乱造を防ぐためにユーザーごとに期間あたりの投稿上限数を設定していると説明されている。

参考

- [AIによるコンテンツ執筆に関するZennの方針について](https://info.zenn.dev/2026-03-10-ai-contents-guideline)

WordPressからZennへ移行する場合も、ここは注意した方がいい。

大量の記事を一気に公開状態へ移行することはできない。

自分の移行時は、だいたい1日2本〜4本ぐらいが移行の上限になった。

また、自分の環境では記事のステータスが `published: true` になっていても、それだけで即時に全部同期されるわけではなく、手動で同期する必要があった。

そのため、WordPressからまとめて移行する場合でも、最後の公開作業はコツコツ進める必要がある。

### 記事タイトル

記事タイトルは70文字以内にする必要がある。

WordPress記事のタイトルをそのまま持ってくると、長すぎてエラーになることがあった。

長いタイトルは、意味を変えない範囲で短くした。

### topics

`topics` はかなり制約が強かった。

実際にプレビューで確認した限り、下記に寄せるのが安全だった。

- 18文字以内
- 半角英小文字と数字のみ
- スペースは使わない
- 記号は使わない
- ハイフンも使わない

たとえば下記のように置き換えた。

```text
C++ -> cpp
C# -> csharp
google-workspace -> googleworkspace
jamf-pro -> jamfpro
azure-ad -> azuread
```

### slug

記事のslugは12〜50文字にする。

使える文字は、半角英小文字、数字、ハイフンのみ。

本のslugも12〜50文字が必要だった。

短すぎる `pmworknotes` はエラーになったので、`pm-work-notes` に変更した。

### 本の章ファイル

Zennの本では、章ファイルにもFront Matterが必要だった。

章ファイルの先頭には最低限 `title` を書く。

```md
---
title: "章タイトル"
---

本文
```

また、`config.yaml` の `chapters` に書いた章だけが同期対象になる。

### 本のカバー画像

本のカバー画像は、`cover.png` または `cover.jpeg` を `books/<book-slug>/` 配下に置く。

カバー画像は必須ではないが、ないと注意が出る。

また、縦横比は `1:1.4` が推奨だった。

最終的に `500x700` の `cover.png` を作成した。

## 画像管理で気をつけたこと

WordPressの `uploads` は、そのままだとかなり重い。

その中には、記事で使っていない画像、WordPressが自動生成した別サイズ画像、テーマやプラグインのキャッシュ画像なども含まれる。

そのため、最終的にZenn記事で使う画像だけを `images/` に置くようにした。

今回の構成では、記事ごとに画像フォルダを分けた。

```text
images/
  windows10-dualboot-delete/
  zoom-msi-installer-horror-story/
```

この形にしておくと、どの記事で使っている画像か分かりやすい。

GitHubで画像を管理すること自体は問題ない。

ただしZenn側の制約として、画像は1ファイル3MB以内にする必要がある。

参考。

- [GitHubリポジトリで画像を管理する](https://zenn.dev/zenn/articles/deploy-github-images)

画像サイズが大きい場合は、圧縮するか、Markdown側で幅指定する。

```md
![説明文](/images/example/image.png =600x)
```

## リポジトリを整理する

移行後、不要になったものは削除した。

削除対象にしたものは下記。

- WordPressのXML
- `wp-content/uploads` の元データ
- 移行用スクリプト
- 移行時だけ必要だったレポート類

最終的に残したものは下記。

- `articles/`
- `books/`
- `drafts/`
- `images/`
- `AGENTS.md`
- `README.md`
- `ZENN_CLI_GUIDE.md`
- `package.json`
- `package-lock.json`

`.gitignore` も整理して、今は下記だけにした。

```gitignore
node_modules
.DS_Store
export/
```

`export/` は一時的にWordPressのXMLや元画像を置く場所として使った。

移行後は不要なので、Git管理対象にはしない。

## Codexを使うときの注意

Codexはかなり便利だった。

ただし、移行作業では明示的に制御しないと危ないところもあった。

今回特に危なかったことは下記。

- 本文を勝手に読みやすく言い換える
- 画像ファイルを消しすぎる
- 移行スクリプトが既存記事や画像を削除する作りになる
- 文字コードや改行コードが崩れる

実際、途中で画像を消しすぎたことがあった。

元データを `export/` に残していたのでやり直せたが、元画像とXMLがなかったらかなり危なかった。

移行スクリプトを作る場合は、削除処理をデフォルトにしない方がいい。

たとえば `--clean` のような明示オプションがあるときだけ削除する形が安全だと思った。

また、作業前に `AGENTS.md` にルールを書いておくと、Codexとの作業がかなり安定する。

今回 `AGENTS.md` に書いておいてよかったことは下記。

- Zenn CLIのフォルダ構成
- 記事のFront Matter
- 本の構成
- slugの制約
- titleの70文字制限
- topicsの制約
- 画像ルール
- WordPress移行時に本文を言い換えないこと

## 今回の流れ

最終的な作業の流れは下記。

1. Zenn CLI用のリポジトリを作る
2. CodexにZenn CLIの公式ドキュメントを読ませる
3. Codexに `AGENTS.md` へリポジトリ運用ルールを書いてもらう
4. WordPressから投稿XMLをエクスポートする
5. Xserverから `wp-content/uploads` を回収する
6. XMLと画像データを `export/` に置く
7. Codexに移行スクリプトを作ってもらう
8. WordPress記事をZenn用Markdownへ変換する
9. 画像を `images/` 配下へ整理する
10. `npx zenn preview` でエラーと警告を確認する
11. title、slug、topics、画像サイズなどを直す
12. 移行用データとスクリプトを削除する

## できたもの

最終的にできたものは下記。

- [Zenn](https://zenn.dev/amano09090927)
- [Zenn用リポジトリ](https://github.com/Amano0909/Zenn)
- [自己紹介ページ](https://bunbunman.com/)

## 学び

WordPressからZennへの移行は、XMLと画像データがあればかなり自動化できる。

ただし、画像本体はXMLに含まれないので、`wp-content/uploads` は別で回収する必要がある。

また、Codexを使う場合は「文章を変えない」と明示することが大事だった。何も言わないと、Codexはよかれと思って文章を整えることがある。

Zenn側では、title、topics、slug、本の章構成などに細かい制約がある。これは早い段階で `npx zenn preview` を実行して確認した方がいい。

また、Zennには投稿上限があるため、WordPressから大量の記事を移行する場合でも一気に公開するのではなく、少しずつ同期していく必要がある。

GitHubに画像を置くこと自体は問題ないが、Zennの3MB制限を意識する必要がある。

移行用データやスクリプトは、移行が終わったら削除した方がリポジトリがすっきりする。ただし、作業中は元XMLと元画像を消さずに残しておく。

今回やってみて、Codexに任せるなら「任せるためのルール」を先に書くのが大事だと思った。

勢いでお願いするより、`AGENTS.md` に制約を書いてから進めた方が、あとから壊れたファイルを直す時間が減る。
