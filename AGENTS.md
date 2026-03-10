# AGENTS.md

このリポジトリは Zenn CLI で記事と本を管理する。作業時は以下のルールを優先する。

## 目的

- `articles/` に Zenn 記事を置く
- `books/` に Zenn の本を置く
- Zenn CLI が前提とする構造と命名を崩さない

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
- `published` の値が意図どおりか
- 本の `chapters` と実ファイルにズレがないか

## 参考

- https://zenn.dev/zenn/articles/install-zenn-cli
- https://zenn.dev/zenn/articles/zenn-cli-guide
