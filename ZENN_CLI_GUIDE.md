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

## ふだんの運用

1. `npx zenn preview` でプレビューを起動
2. `articles/` または `books/` に原稿を追加
3. Front Matter や `config.yaml` を整える
4. `published` を確認して公開状態を切り替える
5. Git で管理して push する

## このリポジトリで意識すること

- 記事は `articles/` 直下に置く
- 本は `books/<book-slug>/` 単位で管理する
- ファイル名や slug の命名ルールを崩さない
- 公開前は `published: false` を維持する
- 本は `config.yaml` の `chapters` と実ファイルを一致させる

## 参考

- [Zenn CLI をインストールする](https://zenn.dev/zenn/articles/install-zenn-cli)
- [Zenn CLI の使い方](https://zenn.dev/zenn/articles/zenn-cli-guide)
