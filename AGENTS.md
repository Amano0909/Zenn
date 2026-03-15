# AGENTS.md

このリポジトリは Zenn CLI で記事と本を管理する。作業時は以下のルールを優先する。

## 目的

- `articles/` に Zenn 記事を置く
- `books/` に Zenn の本を置く
- Zenn CLI が前提とする構造と命名を崩さない
- Zenn の Markdown 記法に沿って執筆する

## 最重要ルール

- 記事ファイルは `articles/<slug>.md` に置く
- 本は `books/<book-slug>/` ディレクトリ単位で管理する
- 本の設定は `books/<book-slug>/config.yaml` に置く
- 本の章ファイルは `books/<book-slug>/` 配下に置く
- 本の章順は `config.yaml` の `chapters` で管理する
- Zenn CLI の想定外の階層変更はしない

## 記事ルール

- 記事ファイル先頭には Front Matter を必ず書く
- `title`、`emoji`、`type`、`topics`、`published` を明示する
- `title` は 70 文字以内に収める
- `topics` は 18 文字以内に収める
- `topics` は半角英小文字と数字のみを使う
- `topics` にスペースや記号は使わない
- `topics` にハイフンも使わない
- `C++` は `cpp`、`C#` は `csharp` のように置き換える
- `type` は `tech` または `idea`
- `published: false` は下書き、`published: true` は公開対象
- slug は 12〜50 文字
- slug には半角英小文字、数字、ハイフンのみを使う
- slug に日本語、大文字、スペース、アンダースコアは使わない

## 本ルール

- 本ごとに `books/<book-slug>/config.yaml` を持つ
- `config.yaml` には少なくとも `title`、`summary`、`topics`、`published`、`price`、`chapters` を持たせる
- `chapters` に書いた名前と章ファイル名を一致させる
- 章ファイルは Markdown で作る
- 無料本は `price: 0` を使う

## Markdown ルール

- 見出しはアクセシビリティの観点から `##` 開始を基本にする
- リストは `-` または `*` を使う
- コードブロックには可能な限り言語を指定する
- ファイルを示すコードは `言語:ファイル名` を使ってよい
- 差分説明には `diff 言語名` を使ってよい
- 数式ブロックの `$$` 前後には空行を入れる
- 画像には可能な限り Alt テキストを付ける
- 画像が大きすぎる場合は `=○○x` で幅を指定する
- 補足は `:::message`、警告は `:::message alert` を優先する
- 折りたたみは `:::details タイトル` を使う
- URL 単独行による埋め込みを使える
- 公開されないメモには単一行の HTML コメントを使う

## WordPress からの移行時ルール

- WordPress 独自ショートコードはそのまま残さない
- 生の HTML は必要最小限にし、Zenn 標準 Markdown や独自記法へ寄せる
- WordPress から移行する記事タイトルも 70 文字以内に調整する
- WordPress 由来のカテゴリやタグは `topics` 制約に合わせて 18 文字以内の英小文字・数字のみに整える
- 画像は移行後も参照切れしない URL を使う
- 大きすぎる画像は圧縮または幅指定を検討する
- 内部リンクは WordPress ドメイン依存のまま放置しない

## 作業ルール

- 新規記事は原則 `npx zenn new:article` を使って作成する
- 新規本は原則 `npx zenn new:book` を使って作成する
- 執筆や確認時は `npx zenn preview` を使う
- 既存構造を壊す変更をする前に、Zenn CLI 互換性を確認する
- `articles/` と `books/` 以外に本文管理用の独自階層を勝手に増やさない

## 推奨チェック

- ファイル配置が Zenn CLI の標準構造に沿っているか
- slug が命名ルールを満たしているか
- Front Matter または `config.yaml` の必須項目が揃っているか
- 記事タイトルが 70 文字以内か
- `topics` が 18 文字以内か
- `topics` にスペースや記号が入っていないか
- `topics` にハイフンが入っていないか
- `published` の値が意図どおりか
- 本の `chapters` と実ファイルにズレがないか
- 見出し階層が不自然でないか
- 画像の Alt テキストとサイズ指定が適切か
- Zenn 独自記法へ置き換えられる箇所が残っていないか

## 参考

- https://zenn.dev/zenn/articles/install-zenn-cli
- https://zenn.dev/zenn/articles/zenn-cli-guide
- https://zenn.dev/zenn/articles/markdown-guide
