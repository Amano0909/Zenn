# Zenn Blog Repository

このリポジトリは、Zenn に公開する技術ブログ記事と本を管理するためのものです。`drafts/` で下書きを作り、整えた内容を `articles/` や `books/` に反映する運用を前提にしています。

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

- `drafts/`
  - Zenn 変換前の下書き Markdown を置く
- `articles/`
  - Zenn の公開用記事を置く
- `books/`
  - Zenn の本を置く

## 補足

- 詳しい運用メモは [ZENN_CLI_GUIDE.md](./ZENN_CLI_GUIDE.md) を参照
- このリポジトリで守るべきルールは [AGENTS.md](./AGENTS.md) を参照
