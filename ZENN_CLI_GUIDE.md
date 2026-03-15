# Zenn CLI メモ

このリポジトリは `zenn-cli` を使って、Zenn の記事 (`articles/`) と本 (`books/`) をローカル管理するためのものです。

## インストール

1. Node.js を使える状態にする
2. プロジェクトを作る
3. `zenn-cli` をインストールする

```bash
npx zenn init
npm install zenn-cli
```

このリポジトリではすでに `package.json` に `zenn-cli` が入っているため、通常は追加インストール不要です。

## 基本コマンド

```bash
npx zenn preview
npx zenn new:article
npx zenn new:book
```

- `npx zenn preview`
  - ローカルプレビューを起動する
- `npx zenn new:article`
  - 新しい記事ファイルを作る
- `npx zenn new:book`
  - 新しい本ディレクトリを作る

## フォルダ構造

```text
.
├─ articles/
│  └─ <slug>.md
├─ books/
│  └─ <book-slug>/
│     ├─ config.yaml
│     ├─ <chapter1>.md
│     └─ <chapter2>.md
├─ package.json
└─ README.md
```

- `articles/`
  - 記事ファイルを置く
- `books/`
  - 本ごとのディレクトリを置く
- `books/<book-slug>/config.yaml`
  - 本のタイトル、概要、公開設定などを管理する

## 記事の作り方

記事は `articles/<slug>.md` に保存します。先頭には Front Matter を書きます。

```md
---
title: "記事タイトル"
emoji: "😸"
type: "tech"
topics: ["javascript", "nodejs"]
published: false
---
```

重要なポイント:

- `title` は 70 文字以内
- `slug` は 12〜50 文字
- 使える文字は半角英小文字 (`a-z`)、数字 (`0-9`)、ハイフン (`-`) のみ
- `type` は `tech` または `idea`
- `published: false` なら下書き
- `published: true` にすると公開対象

## 本の作り方

`npx zenn new:book` で本用ディレクトリが作られます。

本はおおむね次の形で管理します。

```text
books/<book-slug>/
├─ config.yaml
├─ introduction.md
└─ chapter1.md
```

`config.yaml` では以下のような項目を持ちます。

```yaml
title: "本のタイトル"
summary: "本の概要"
topics:
  - javascript
published: false
price: 0
chapters:
  - introduction
  - chapter1
```

重要なポイント:

- 章ファイルは `books/<book-slug>/` 配下に置く
- `chapters` に並べた順で本の章順が決まる
- 無料本は `price: 0`
- 有料本は Zenn 側の販売条件も考慮する

## Zenn Markdown で重要な記法

執筆時は Zenn 独自記法もよく使います。

### 見出し

- 見出しは `##` から始めるのが推奨
- `#` は記事タイトルがあるため本文では多用しない

### 画像

```md
![Altテキスト](https://画像のURL)
![Altテキスト](https://画像のURL =600x)
```

- 画像の横幅は `=600x` のように指定できる
- Alt テキストを付ける
- 画像直下の `*キャプション*` はキャプション風に表示される

### コードブロック

````md
```ts
const message = "hello";
```

```ts:app.ts
const message = "hello";
```

```diff ts:app.ts
- const oldValue = 1;
+ const newValue = 2;
```
````

- 言語指定でシンタックスハイライトされる
- `言語:ファイル名` でファイル名表示ができる
- `diff 言語名` で差分表示もできる

### 数式

- ブロック数式は `$$` で囲む
- インライン数式は `$...$`
- `$$` の前後は空行にする

### メッセージと詳細表示

```md
:::message
メッセージ
:::

:::message alert
警告メッセージ
:::

:::details タイトル
詳細内容
:::
```

- 補足は `:::message`
- 注意喚起は `:::message alert`
- 折りたたみは `:::details タイトル`

### 埋め込み

- URL だけの行でリンクカードになる
- X の投稿 URL だけの行で埋め込める
- YouTube URL だけの行で埋め込める
- GitHub のファイル URL だけの行で埋め込める

### 脚注とコメント

```md
脚注の例[^1]

[^1]: 脚注の内容

<!-- 公開されないメモ -->
```

- 脚注が使える
- HTML コメントは公開ページに表示されない
- 複数行コメントには対応しない

## ふだんの運用

1. `npx zenn preview` でプレビューを起動
2. `articles/` または `books/` に原稿を追加
3. Front Matter や `config.yaml` を整える
4. Markdown 記法崩れを確認する
5. `published` を確認して公開状態を切り替える
6. Git で管理して push する

## このリポジトリで意識すること

- 記事は `articles/` 直下に置く
- 本は `books/<book-slug>/` 単位で管理する
- ファイル名や slug の命名ルールを崩さない
- 公開前は `published: false` を維持する
- 本は `config.yaml` の `chapters` と実ファイルを一致させる
- 見出しは `##` 開始を基本にする
- 画像には Alt テキストと必要に応じて幅指定を付ける
- 注意書きや補足は Zenn 独自記法を優先する

## 参考

- [Zenn CLI をインストールする](https://zenn.dev/zenn/articles/install-zenn-cli)
- [Zenn CLI の使い方](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Zenn の Markdown 記法一覧](https://zenn.dev/zenn/articles/markdown-guide)
