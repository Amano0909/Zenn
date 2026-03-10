# Zenn Blog Repository

このリポジトリは、Zenn に公開する技術ブログ記事と本を管理するためのものです。

## 目的

- 技術ブログ記事を Zenn 向けに執筆する
- 必要に応じて Zenn の本も管理する
- 原稿をローカルで確認しながら安全に育てる

## 使い方

`zenn-cli` を使って記事や本を作成、プレビューします。

```bash
npx zenn preview
npx zenn new:article
npx zenn new:book
```

## 主な構成

- `articles/`
  - Zenn の記事を置く
- `books/`
  - Zenn の本を置く

## 補足

詳しい運用メモは [ZENN_CLI_GUIDE.md](./ZENN_CLI_GUIDE.md) に整理しています。  
このリポジトリで守るべき Zenn CLI のルールは [AGENTS.md](./AGENTS.md) を参照してください。
