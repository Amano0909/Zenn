---
title: "Hono APIをCloudflare Pages Functionsで動かす自分用メモ"
emoji: "🔥"
type: "tech"
topics: ["hono", "cloudflare", "react", "vite"]
published: true
---

## この記事の前提

この記事は、非プログラマー寄りの自分が、Hono公式ドキュメントとCloudflare公式ドキュメントを読みながら、**React + Vite + Hono + Cloudflare Pages Functions** の全体像を理解するためのメモです。

また記事作成自体にAI（Codex）を利用しています。

想定している技術スタックは以下です。

```txt
Core:
  TypeScript

Web App:
  React
  Vite
  Hono
  Zod
  React Hook Form
  Drizzle ORM
  D1 / PostgreSQL / SQLite

Deploy:
  Cloudflare Pages
  Cloudflare Workers / Pages Functions
  Wrangler

Code:
  GitHub
  Codex
```

自分の目的は、Honoを全部覚えることではありません。

まずは、**Cloudflare Pages上でReactの画面とHono APIをどう共存させるのか** を理解することでした。

特に重要なのは、次の3つだと思ってます。

```txt
1. Honoの基本
   app、route、Context、c.req、c.json など

2. Cloudflare Pages Functionsの基本
   functionsディレクトリ、onRequest、ファイルベースルーティング

3. HonoとCloudflare Pages Functionsの接続
   const app = new Hono().basePath("/api")
   export const onRequest = handle(app)
```

結論からいうと、React + Vite + Cloudflare Pages + Hono APIで考える場合、かなり重要なのはこの形でした。結構混乱しました。わけわかめ

```ts
const app = new Hono().basePath("/api");

export const onRequest = handle(app);
```

これは、Hono側で `/api` をbase pathとして持たせたうえで、Cloudflare Pages Functionsの入口である `onRequest` にHonoアプリを接続するためのコードです。

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

## 参照した公式ドキュメント

この記事で参照した主な公式ドキュメントです。

### Hono公式

- [Hono - Getting Started / Basic](https://hono.dev/docs/getting-started/basic)
- [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)
- [Hono - Hono Stacks](https://hono.dev/docs/concepts/stacks)
- [Hono - App](https://hono.dev/docs/api/hono)
- [Hono - Routing](https://hono.dev/docs/api/routing)
- [Hono - Context](https://hono.dev/docs/api/context)
- [Hono - HonoRequest](https://hono.dev/docs/api/request)
- [Hono - Validation](https://hono.dev/docs/guides/validation)
- [Hono - Middleware](https://hono.dev/docs/guides/middleware)
- [Hono - HTTPException](https://hono.dev/docs/api/exception)
- [Hono - Best Practices](https://hono.dev/docs/guides/best-practices)
- [Hono - Testing](https://hono.dev/docs/guides/testing)

### Cloudflare公式

- [Cloudflare Pages Functions - Get started](https://developers.cloudflare.com/pages/functions/get-started/)
- [Cloudflare Pages Functions - API reference](https://developers.cloudflare.com/pages/functions/api-reference/)
- [Cloudflare Pages Functions - Routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Cloudflare Pages Functions - Bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Workers - Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)

### HTTPステータスコード

- [MDN - HTTP レスポンスステータスコード](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Status)

## Honoとは何か

Honoは、ざっくりいうと **APIサーバーを作るための軽量Webフレームワーク** です。

Hono公式のGetting Startedでは、Honoを使うとプロジェクト作成、コード記述、ローカル開発、デプロイまでをすばやく進められると説明されています。また、アプリケーションコードの多くは複数のランタイムで同じように動かせるが、入口部分はランタイムによって変わる、と説明されています。

参照元: [Hono - Getting Started / Basic](https://hono.dev/docs/getting-started/basic)

自分の用途では、Honoは次の役割を担当します。

```txt
ブラウザから来たリクエストを受ける
↓
URLごとに処理を分ける
↓
入力値を検証する
↓
DB処理を呼ぶ
↓
JSONで返す
```

Reactアプリとの関係で見ると、Honoはここです。

```txt
React画面
  ↓ fetch
Hono API ← ここ
  ↓
Drizzle ORM
  ↓
Cloudflare D1
```

つまり、画面そのものはReactが担当し、データ取得・登録・更新・削除などのAPI処理をHonoが担当する、という理解です。

## Honoの最小構成

Honoの基本形は以下です。

```ts
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
```

Hono公式のGetting Startedでも、`src/index.ts` にHonoアプリを書き、`new Hono()` でアプリを作り、`app.get()` でGETリクエストを処理し、最後に `export default app` する例が紹介されています。

参照元: [Hono - Getting Started / Basic](https://hono.dev/docs/getting-started/basic)

ここで覚えることは以下です。

```txt
app
  Honoアプリ本体

app.get()
  GETリクエストを受けるルート定義

"/"
  URLのパス

c
  Context。リクエスト情報を読んだり、レスポンスを返したりする箱

c.text()
  テキストレスポンスを返す

c.json()
  JSONレスポンスを返す
```

自分の雑な理解

```txt
app = API全体
app.get("/path", handler) = GET /path に来たら handler を動かす
c = 今回のリクエストとレスポンスを扱う箱
```

## JSONを返すAPI

業務アプリでよく使うのは、HTMLを返す処理よりもJSONを返すAPIです。

```ts
app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});
```

Hono公式のGetting Startedでも、`/api/hello` へのGETリクエストに対して `application/json` のレスポンスを返す例が紹介されています。

参照元: [Hono - Getting Started / Basic](https://hono.dev/docs/getting-started/basic)

React側から見ると、Hono APIは次のように呼び出されます。

```ts
const res = await fetch("/api/hello");
const data = await res.json();

console.log(data.message);
```

つまり、こういう関係です。

```txt
React「データちょうだい」
↓
Hono「JSONで返すよ」
↓
React「画面に表示するよ」
```

## `c.req` でリクエスト情報を取得する

Honoでは、URLパラメータやクエリ文字列を `c.req` から取得できます。

```ts
app.get("/posts/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");

  c.header("X-Message", "Hi!");

  return c.text(`You want to see ${page} of ${id}`);
});
```

Hono公式のGetting Startedでは、`c.req.query()` でURLクエリ、`c.req.param()` でパスパラメータを取得し、`c.header()` でレスポンスヘッダーを追加する例が紹介されています。

参照元: [Hono - Getting Started / Basic](https://hono.dev/docs/getting-started/basic)

たとえば、以下のURLにアクセスしたとします。

```txt
/posts/123?page=2
```

この場合、取得される値は次のようになります。

```txt
c.req.param("id")    → 123
c.req.query("page") → 2
```

自分用に言うと、`c.req` は「今回ブラウザから送られてきたリクエストの中身を見る入口」です。

## GET以外のHTTPメソッド

Honoでは、GETだけでなくPOST、PUT、DELETEなども扱えます。

```ts
app.post("/posts", (c) => c.text("Created!", 201));

app.delete("/posts/:id", (c) => {
  return c.text(`${c.req.param("id")} is deleted!`);
});
```

Hono公式のGetting Startedでも、GETだけでなくPOST、PUT、DELETEも扱えると説明されています。

参照元: [Hono - Getting Started / Basic](https://hono.dev/docs/getting-started/basic)

業務アプリでは、だいたい次のように使い分けます。

```txt
GET
  データを取得する

POST
  データを新規作成する

PUT / PATCH
  データを更新する

DELETE
  データを削除する
```

## Cloudflare Pagesとは何か

Hono公式のCloudflare Pagesドキュメントでは、Cloudflare PagesはフルスタックWebアプリケーション向けのEdge platformであり、静的ファイルとCloudflare Workers由来の動的コンテンツを扱える、と説明されています。また、HonoはCloudflare Pagesをサポートしており、Viteの開発サーバーやWranglerによるデプロイにも触れられています。

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

自分の中では、Cloudflare Pagesはこういう理解です。

```txt
Cloudflare Pages
  ├─ 静的ファイル
  │    React / Vite のビルド結果
  │
  └─ 動的処理
       Hono API / Pages Functions
```

つまり、Cloudflare Pagesは単なる静的サイト置き場ではなく、Pages Functionsを使うことでAPIも持てます。

自分の構成でいうと、以下のようになります。

```txt
React / Vite
  → 画面を作る

Cloudflare Pages
  → Reactのビルド結果を配信する

Cloudflare Pages Functions
  → API処理を動かす

Hono
  → Pages Functions上でAPIルーティングを書く
```

## Hono公式のCloudflare Pages Starter

Hono公式のCloudflare Pagesページでは、`create-hono` で `cloudflare-pages` テンプレートを選んでプロジェクトを作る流れが紹介されています。基本ディレクトリ構成では、`src/index.tsx` がサーバーサイドの入口、`public` が静的ファイル置き場として説明されています。

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

公式の例では、`src/index.tsx` に以下のようなHonoアプリを書きます。

```tsx
import { Hono } from "hono";
import { renderer } from "./renderer";

const app = new Hono();

app.get("*", renderer);

app.get("/", (c) => {
  return c.render(<h1>Hello, Cloudflare Pages!</h1>);
});

export default app;
```

ここで注意したいのは、この例は **HonoでHTML/JSXを返す構成** になっていることです。

自分が作りたい構成は、どちらかというと以下です。

```txt
React
  画面担当

Hono
  API担当
```

そのため、Hono公式のCloudflare Pages Starterは重要ですが、自分の用途では `c.render()` やJSXレンダリングは最初から使う想定がないです。

## Cloudflare Pages Functionsとは何か

Cloudflare Pages Functionsは、Cloudflare Pages上で動くサーバー側の処理です。

Cloudflare公式ドキュメントでは、Pages Functionを作るにはプロジェクトルートに `/functions` ディレクトリを作ると説明されています。また、`/functions` ディレクトリにファイルを書くと、そのファイル構成に応じてWorkerが生成され、指定されたルートで動くと説明されています。

参照元: [Cloudflare Pages Functions - Get started](https://developers.cloudflare.com/pages/functions/get-started/)

一番小さい例はこうです。

```ts
export function onRequest(context) {
  return new Response("Hello, world!");
}
```

Cloudflare公式では、`onRequest` handlerは `context` オブジェクトを受け取り、`Response` または `Promise<Response>` を返す必要があると説明されています。

参照元: [Cloudflare Pages Functions - Get started](https://developers.cloudflare.com/pages/functions/get-started/)

自分用に理解すると、Cloudflare Pages Functionsはこうです。

```txt
リクエストが来る
↓
Cloudflare Pagesが functions ディレクトリを見る
↓
該当するファイルの onRequest を呼ぶ
↓
onRequest が Response を返す
↓
ブラウザに返る
```

## `onRequest` とは何か

Cloudflare Pages Functionsでは、基本的に `onRequest` がリクエスト処理の入口になります。

Cloudflare公式のAPI referenceでは、より具体的な `onRequestVerb` がexportされていない限り、`onRequest` が呼ばれると説明されています。たとえば、`onRequestGet` がexportされていればGETリクエストではそちらが呼ばれます。

参照元: [Cloudflare Pages Functions - API reference](https://developers.cloudflare.com/pages/functions/api-reference/)

```ts
export function onRequest(context) {
  return new Response("Hello");
}
```

これは、HTTPメソッドに関係なく呼ばれる入口です。

一方で、GETだけに反応したい場合は以下のように書けます。

```ts
export function onRequestGet(context) {
  return new Response("GET only");
}
```

ただし、Honoを使う場合は、HTTPメソッドごとの分岐はHono側の `app.get()` や `app.post()` に任せることが多いです。

## Cloudflare Pages Functionsのファイルベースルーティング

Cloudflare Pages Functionsは、`functions` ディレクトリのファイル構成によってURLが決まります。

Cloudflare公式では、Functionsはファイルベースルーティングを使い、`/functions` ディレクトリ構造がFunctionを実行するルートを決めると説明されています。たとえば `/functions/helloworld.js` は `/helloworld` に対応します。

参照元: [Cloudflare Pages Functions - Routing](https://developers.cloudflare.com/pages/functions/routing/)

イメージは以下です。

```txt
functions/index.ts
  → /

functions/helloworld.ts
  → /helloworld

functions/api/hello.ts
  → /api/hello
```

つまり、Cloudflare Pages Functionsは、まずファイルの場所でURLを決めます。

## `[[route]].ts` とは何か

HonoをAPIサーバーとして使う場合、以下のようなファイルを作ることがあります。

```txt
functions/api/[[route]].ts
```

これは、`/api` 配下の複数階層のリクエストをまとめて受けるためのファイルです。

Cloudflare公式では、二重ブラケットを使ったファイル名、たとえば `/users/[[user]].js` は、`/users/` 配下の任意の深さのルートにマッチすると説明されています。

参照元: [Cloudflare Pages Functions - Routing](https://developers.cloudflare.com/pages/functions/routing/)

つまり、以下のようなURLをまとめて受けられます。

```txt
/api/health
/api/posts
/api/posts/1
/api/posts/1/comments
```

これをCloudflare Pages Functions側で受けたあと、実際の細かいルーティングはHonoに任せます。

## HonoとCloudflare Pages Functionsをつなぐ

ここが一番大事です。

Honoアプリは、通常以下のように作ります。

```ts
import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ ok: true });
});
```

しかし、Cloudflare Pages Functionsが直接探しているのは `app` ではありません。Cloudflare Pages Functionsが呼び出す入口は `onRequest` です。

そのため、Honoの `app` をCloudflare Pages Functionsの `onRequest` として公開する必要があります。

そこで出てくるのが以下です。

```ts
import { handle } from "hono/cloudflare-pages";

const app = new Hono().basePath("/api");

export const onRequest = handle(app);
```

Hono公式のCloudflare Pagesドキュメントでは、`functions/api/[[route]].ts` にHonoアプリを書き、`const app = new Hono<Env>().basePath('/api')` としたうえで、最後に `export const onRequest = handle(app)` する構成が紹介されています。

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

## `export const onRequest = handle(app)` の意味

この1行は、かなり重要です。

```ts
export const onRequest = handle(app);
```

自分用に分解すると、以下です。

```txt
export const onRequest
  Cloudflare Pages Functionsに対して、
  「このファイルのリクエスト処理はこれです」と伝える

handle(app)
  HonoのappをCloudflare Pages Functionsで動く形に変換する
```

つまり、この1行は以下の意味になります。

```txt
Cloudflare Pages Functionsに来たリクエストを、
Honoアプリに渡して処理させる
```

もう少し雑にいうと、こうです。

```txt
Cloudflare Pages Functionsの入口
  onRequest

Honoの入口
  app

両者をつなぐ変換役
  handle(app)
```

この理解がないと、HonoアプリをCloudflare Pages Functions上でどう動かすのかが分かりにくいです。

## `/api` はどこで扱うのか

ファイルの場所が以下だとします。

```txt
functions/api/[[route]].ts
```

この場合、Cloudflare Pages Functionsとしては `/api` 配下のリクエストをこのファイルで受けます。

たとえば、ブラウザからのURLは以下です。

```txt
/api/posts
```

Hono側のルートはこう書けます。

```ts
const app = new Hono().basePath("/api");

app.get("/posts", (c) => {
  return c.json({ posts: [] });
});
```

この場合、`/api` は `handle()` の第二引数ではなく、Honoの `basePath("/api")` で指定します。

`functions/api/[[route]].ts` が `/api` 配下のリクエストを受け、Hono側でも `basePath("/api")` を持たせることで、`/api/posts` に対して `app.get("/posts")` のルートがマッチします。

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)  
参照元: [Hono - Routing / Base path](https://hono.dev/docs/api/routing)

自分の理解ではこうです。

```txt
実際のURL:
  /api/posts

Cloudflare Pages Functions:
  functions/api/[[route]].ts が受ける

Hono内のルート:
  basePath("/api") + /posts
```

この形にすると、Hono側のコードは `/api` を意識しすぎずに書けます。

## `export default app` と `export const onRequest = handle(app)` の違い

混乱しました。。

HonoのGetting StartedやCloudflare Pages Starterでは、以下のように `export default app` する例があります。

```ts
export default app;
```

参照元: [Hono - Getting Started / Basic](https://hono.dev/docs/getting-started/basic)  
参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

一方で、Cloudflare Pages Functionsの `functions/api/[[route]].ts` にHono APIを書く構成では、以下のように書きます。

```ts
const app = new Hono().basePath("/api");

export const onRequest = handle(app);
```

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

自分用に整理すると、以下です。

```txt
Hono Starter / Vite plugin寄りの入口:
  src/index.tsx
  export default app

Cloudflare Pages Functions寄りの入口:
  functions/api/[[route]].ts
  const app = new Hono().basePath("/api")
  export const onRequest = handle(app)
```

どちらもHonoをCloudflare Pagesで動かすための方法ですが、React + Viteの画面とHono APIを分けて理解するなら、`functions/api/[[route]].ts` の形のほうが分かりやすいです。

## React + Vite + Hono APIの基本構成

自分が理解しやすい構成は以下です。

```txt
project-root/
├── src/
│   ├── App.tsx
│   └── main.tsx
│
├── functions/
│   └── api/
│       └── [[route]].ts
│
├── package.json
├── vite.config.ts
└── wrangler.toml
```

役割は以下です。

```txt
src/
  Reactの画面を書く

functions/api/[[route]].ts
  Hono APIを書く

vite.config.ts
  Viteの設定

wrangler.toml
  ローカル開発用のCloudflare設定
```

Hono公式のCloudflare Pagesドキュメントでも、Pages Functionsのhandlerとして `handle(app)` をexportする構成が紹介されています。

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

## Hono APIのサンプル

まずはDBなしで、固定値を返すAPIにすると分かりやすいです。

```ts
// functions/api/[[route]].ts
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

const app = new Hono().basePath("/api");

app.get("/health", (c) => {
  return c.json({ ok: true });
});

app.get("/posts", (c) => {
  return c.json({
    posts: [
      { id: "1", title: "Hello Hono" },
      { id: "2", title: "Learning Cloudflare Pages Functions" },
    ],
  });
});

app.get("/posts/:id", (c) => {
  const id = c.req.param("id");

  return c.json({
    post: {
      id,
      title: "Sample post",
    },
  });
});

export const onRequest = handle(app);
```

この場合、実際にアクセスするURLは以下です。

```txt
GET /api/health
GET /api/posts
GET /api/posts/1
```

ただし、Hono側の各ルートは以下のように `/api` なしで書いています。

```txt
/health
/posts
/posts/:id
```

この対応関係が重要です。

## Bindingsとは何か

HonoをCloudflareで使うと、Bindingsという言葉が出てきます。

Cloudflare公式では、BindingsはWorkerがCloudflare Developer Platform上のリソースとやり取りできるようにするもの、と説明されています。

参照元: [Cloudflare Workers - Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)

自分用にいうと、Bindingは以下です。

```txt
Cloudflare側のリソースを、
Hono / Pages Functions から使えるようにする接続設定
```

たとえば以下のようなものです。

```txt
Variables
  環境変数

KV
  キーバリュー型の保存先

D1
  CloudflareのサーバーレスDB

R2
  オブジェクトストレージ
```

Cloudflare PagesのBindingsドキュメントでは、D1はCloudflareのnative serverless databaseとして説明されています。

参照元: [Cloudflare Pages Functions - Bindings](https://developers.cloudflare.com/pages/functions/bindings/)

## Pages Functionsでは `context.env` からBindingを使う

Cloudflare Pages Functionsの公式ドキュメントでは、D1 database bindingを設定すると、Function code内の `context.env` からアクセスできる例が紹介されています。

参照元: [Cloudflare Pages Functions - Bindings](https://developers.cloudflare.com/pages/functions/bindings/)

Cloudflare Pages Functionsだけで書くと、たとえば以下のような形です。

```ts
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const result = await context.env.DB.prepare("SELECT * FROM posts").all();

  return Response.json(result);
};
```

つまり、Cloudflare Pages Functionsの世界では、Bindingは `context.env` に生えます。

## Honoでは `c.env` からBindingを使う

Honoを使う場合は、CloudflareのBindingを `c.env` から使います。

Hono公式のContextドキュメントでは、Cloudflare Workers環境の環境変数、Secrets、KV namespaces、D1 database、R2 bucketなどのBindingsは、`c.env.BINDING_KEY` からアクセスできると説明されています。

参照元: [Hono - Context](https://hono.dev/docs/api/context)

D1を使う場合のイメージは以下です。

```ts
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.get("/posts", async (c) => {
  const result = await c.env.DB.prepare("SELECT * FROM posts").all();

  return c.json(result);
});

export const onRequest = handle(app);
```

ここで重要なのは以下です。

```txt
type Bindings
  Hono側で使うCloudflareリソースの型定義

DB: D1Database
  DBという名前のD1 Bindingを使うという意味

new Hono<{ Bindings: Bindings }>()
  HonoのContextにBindingsの型を教える

c.env.DB
  Cloudflare側でBindingされたD1にアクセスする
```

## `wrangler.toml` と本番設定

Hono公式のCloudflare Pagesドキュメントでは、Cloudflare Pagesではローカル開発に `wrangler.toml` を使い、本番環境ではCloudflare DashboardでBindingsを設定すると説明されています。

参照元: [Hono - Getting Started / Cloudflare Pages](https://hono.dev/docs/getting-started/cloudflare-pages)

自分用に整理すると以下です。

```txt
ローカル開発:
  wrangler.toml にBindingを書く

本番環境:
  Cloudflare DashboardでBindingを設定する
```

D1を使う場合、ローカルでは `wrangler.toml` にD1 Bindingを書きます。  
本番では、Cloudflare Pagesのプロジェクト設定からD1 database bindingを追加します。

Cloudflare PagesのBindingsドキュメントでも、D1 databaseをPages FunctionにBindingするには、Wrangler configuration fileまたはCloudflare dashboardで設定できると説明されています。

参照元: [Cloudflare Pages Functions - Bindings](https://developers.cloudflare.com/pages/functions/bindings/)

## Routing：URLと処理の対応表

Hono公式のRoutingでは、`app.get()`、`app.post()`、`app.put()`、`app.delete()` などのHTTPメソッドごとのルーティング、ワイルドカード、`app.all()`、`app.on()`、複数メソッド、複数パス、パスパラメータ、`basePath()` などが紹介されています。

参照元: [Hono - Routing](https://hono.dev/docs/api/routing)

ルーティングの基本的な考え方は下記です。

```ts
app.get("/posts", (c) => {
  return c.json({ posts: [] });
});
```

意味はこれです。

```txt
GET /posts に来たら
この関数を実行して
JSONを返す
```

HTTPメソッドは、だいたい次のように使います。

```ts
app.get("/posts", (c) => c.text("List posts"));
app.post("/posts", (c) => c.text("Create post", 201));
app.put("/posts/:id", (c) => c.text("Update post"));
app.delete("/posts/:id", (c) => c.text("Delete post"));
```

`/posts/:id` のように書くと、URLの一部を変数として扱えます。

```ts
app.get("/posts/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});
```

```txt
/posts/1 にアクセスしたら、id は 1
/posts/abc にアクセスしたら、id は abc
```

`basePath()` もHono公式のRoutingで紹介されています。

```ts
const api = new Hono().basePath("/api");
api.get("/posts", (c) => c.text("List posts")); // GET /api/posts
```

参照元: [Hono - Routing / Base path](https://hono.dev/docs/api/routing)

この記事の構成でも、`functions/api/[[route]].ts` と `basePath("/api")` を使い、個別ルートでは `/api` なしで書くほうが読みやすいです。

```txt
Cloudflare Pages Functions側:
  functions/api/[[route]].ts
  export const onRequest = handle(app)

Hono側:
  const app = new Hono().basePath("/api")
  app.get("/posts", ...)
```

## Context：`c` はリクエストごとの箱

Honoのコードでよく出てくる `c` は、Contextです。

Hono公式のContextドキュメントでは、Contextオブジェクトはリクエストごとに作られ、レスポンスが返るまで保持されるものとして説明されています。Contextからは、リクエスト情報、レスポンス、ステータスコード、ヘッダーなどを扱えます。

参照元: [Hono - Context](https://hono.dev/docs/api/context)

よく使うものは以下です。

```ts
c.req.param("id")      // URLパラメータ
c.req.query("q")       // クエリ文字列
await c.req.json()     // JSONボディ
c.json(...)            // JSONで返す
c.text(...)            // テキストで返す
c.status(201)          // HTTPステータスを設定
c.header("X-...", "") // レスポンスヘッダーを設定
c.env                  // Cloudflare Bindingsへの入口
```

自分用にかなり雑に言うと、こうです。

```txt
c = 今回のリクエストに関する全部入りの箱
```

## HonoRequest：リクエストの中身を読む

HonoRequestは、`c.req` から触るリクエスト情報です。

Hono公式のHonoRequestドキュメントでは、`param()`、`query()`、`queries()`、`header()`、`parseBody()`、`json()` などが紹介されています。

参照元: [Hono - HonoRequest](https://hono.dev/docs/api/request)

よく使いそうなものは以下です。

```txt
param()
  /posts/:id の id を取る

query()
  ?q=hono の q を取る

queries()
  複数のクエリ値を取る

header()
  リクエストヘッダーを見る

parseBody()
  form-data などを読む

json()
  JSONボディを読む
```

POSTされたJSONを読むなら、素の書き方はこうです。

```ts
app.post("/posts", async (c) => {
  const body = await c.req.json();

  return c.json({ received: body }, 201);
});
```

ただし、この時点では「JSONを読んだだけ」です。値が正しい形かどうかは、次のValidationでチェックします。

## Validation：入力値をチェックする

業務アプリでは、POSTされた値をそのまま信じるのは危ないはずです。

```ts
const body = await c.req.json();
```

だけだと、JSONは読めても、`body` が期待した形かどうかは分かりません。

Hono公式のValidationでは、Validatorはmiddlewareとして使い、検証済みの値はhandler内で `c.req.valid()` から取得する流れが説明されています。検証対象には `json`、`query`、`header`、`param`、`cookie` などがあります。

参照元: [Hono - Validation](https://hono.dev/docs/guides/validation)

自分の場合はZodを使う想定なので、`@hono/zod-validator` を使います。

参照元: [Zod validator middleware for Hono](https://github.com/honojs/middleware/tree/main/packages/zod-validator)

```ts
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono().basePath("/api");

const createPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().optional(),
});

app.post("/posts", zValidator("json", createPostSchema), async (c) => {
  const body = c.req.valid("json");

  return c.json(
    {
      message: "created",
      post: body,
    },
    201,
  );
});

export const onRequest = handle(app);
```

重要なのはここです。

```ts
zValidator("json", createPostSchema);
```

これは、POSTされたJSONを `createPostSchema` で検証する、という意味です。

そして、検証済みの値はこれで取り出します。

```ts
const body = c.req.valid("json");
```

`await c.req.json()` は生のJSONを読むだけです。`c.req.valid("json")` は、Validatorを通った値を取り出します。

自分用の理解はこれでOKです。

```txt
zValidator
  入力値を検証する検問

c.req.valid("json")
  検問を通ったデータを取り出す

await c.req.json()
  生のJSONを読むだけ
```

## Validation失敗時のレスポンス

`zValidator()` の検証に失敗した場合、そのルートのhandlerには基本的に進みません。

```txt
POST /api/posts
↓
zValidator("json", createPostSchema)
↓
成功したらhandlerへ
↓
const body = c.req.valid("json")

失敗したら
↓
zValidator側でレスポンスを返す
↓
handlerには進まない
```

失敗時の返し方を自分で決めたい場合は、`zValidator` の第3引数にcallbackを渡します。

参照元: [Hono - Error handling in Validator](https://hono.dev/examples/validator-error-handling)

```ts
app.post(
  "/posts",
  zValidator("json", createPostSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          ok: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "入力内容が正しくありません",
            issues: result.error.issues,
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    const body = c.req.valid("json");

    return c.json(
      {
        ok: true,
        post: body,
      },
      201,
    );
  },
);
```

バリデーションエラーは、基本的に「クライアントから来た入力値がおかしい」ので、`400 Bad Request` などの400系を返すことが多いです。

参照元: [MDN - HTTP レスポンスステータスコード](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Status)

## Middleware：API共通処理をまとめる

HonoにはMiddlewareという仕組みがあります。

Hono公式のMiddlewareドキュメントでは、Middlewareはendpoint handlerの前後で動き、dispatch前にRequestを見たり、dispatch後にResponseを操作できると説明されています。また、Middlewareは `await next()` して次へ進むか、Responseを返してそこで処理を終了できます。

参照元: [Hono - Middleware](https://hono.dev/docs/guides/middleware)

```ts
app.use(async (c, next) => {
  console.log("before");
  await next();
  console.log("after");
});
```

理解するポイントは以下です。

```txt
app.use()
  共通処理を登録する

next()
  次のmiddleware / handlerへ進む

await next() の前
  API本体の前に実行される

await next() の後
  API本体の後に実行される
```

Hono公式のMiddlewareドキュメントでは、登録順によってMiddlewareの実行順が決まることも説明されています。

参照元: [Hono - Middleware / Execution order](https://hono.dev/docs/guides/middleware)

業務アプリで使いそうなMiddlewareは以下です。

- [Hono - Logger Middleware](https://hono.dev/docs/middleware/builtin/logger)
- [Hono - CORS Middleware](https://hono.dev/docs/middleware/builtin/cors)
- [Hono - Secure Headers Middleware](https://hono.dev/docs/middleware/builtin/secure-headers)
- [Hono - Request ID Middleware](https://hono.dev/docs/middleware/builtin/request-id)

最初は、Loggerだけ入れておくと挙動を見やすいです。

```ts
import { logger } from "hono/logger";

app.use(logger());
```

## Error Handling：想定外エラーを共通処理する

Honoには `app.onError()` があり、未捕捉エラーのレスポンスを共通化できます。

Hono公式のAppドキュメントでは、`app.onError` はuncaught errorsを扱い、カスタムResponseを返せるものとして説明されています。

参照元: [Hono - App / Error Handling](https://hono.dev/docs/api/hono)

```ts
app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      ok: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバー側でエラーが発生しました",
      },
    },
    500,
  );
});
```

また、Hono公式のAppドキュメントでは、`app.notFound()` によってNot Found Responseをカスタマイズできると説明されています。

参照元: [Hono - App / Not Found](https://hono.dev/docs/api/hono)

```ts
app.notFound((c) => {
  return c.json(
    {
      ok: false,
      error: {
        code: "NOT_FOUND",
        message: "Not Found",
      },
    },
    404,
  );
});
```

## `HTTPException` とは何か

Hono公式のHTTPExceptionドキュメントでは、致命的なエラーが起きたときにHonoやmiddlewareが `HTTPException` をthrowすることがあり、これはエラーレスポンスを返しやすくするためのHono独自のErrorだと説明されています。また、自分でstatus codeやmessage、custom responseを指定してthrowすることもできます。

参照元: [Hono - HTTPException](https://hono.dev/docs/api/exception)

```ts
import { HTTPException } from "hono/http-exception";

throw new HTTPException(401, {
  message: "Unauthorized",
});
```

最初は無理に使わなくてもよいです。まずは `return c.json(..., 404)` のように明示的に返すだけでも十分です。

## Validationエラーと `app.onError` の違い

混乱したのでまとめ。

```txt
zValidatorのエラー
  入力値が不正
  ルートのhandlerに入る前に止める
  400などを返す
  app.onErrorには基本流さない

app.onError
  handlerやmiddlewareの中で投げられた未捕捉エラーを拾う
  500などの共通レスポンスを返す
  ログ出力にも使う
```

つまり、以下のように分けると分かりやすいです。

```txt
入力ミス・形式不正
  → zValidatorのhookで400

データが見つからない
  → handler内で404を返す、またはHTTPException

DB障害・想定外例外
  → app.onErrorで500
```

## よく使うHTTPステータスコード

HTTPステータスコードは、HTTPの標準として定義されているものから、アプリ開発者が状況に合うものを選びます。

参照元: [MDN - HTTP レスポンスステータスコード](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Status)

最初によく使うのは以下です。

```txt
200 OK
  普通に成功した

201 Created
  新規作成に成功した

400 Bad Request
  リクエストの形式や入力値がおかしい

401 Unauthorized
  認証されていない

403 Forbidden
  認証はされているが権限がない

404 Not Found
  指定されたデータやURLが存在しない

409 Conflict
  重複や競合がある

422 Unprocessable Content
  JSON形式は読めるが、業務ルール的に処理できない

500 Internal Server Error
  サーバー側で想定外エラー
```

## App

Hono公式のAppページでは、`Hono` が最初にimportされ、最後まで使われるprimary objectだと説明されています。また、Honoインスタンスには `app.HTTP_METHOD()`、`app.all()`、`app.on()`、`app.use()`、`app.route()`、`app.basePath()`、`app.notFound()`、`app.onError()`、`app.fetch()`、`app.request()` などのメソッドがあると整理されています。

参照元: [Hono - App](https://hono.dev/docs/api/hono)

このページで特に見るところは以下です。

```txt
app.notFound()
  404の共通レスポンスをカスタマイズする

app.onError()
  未捕捉エラーの共通レスポンスをカスタマイズする

app.route()
  大きくなったAPIを分割して結合する

app.basePath()
  Honoアプリ側に共通prefixを持たせる

app.request()
  Honoアプリにテスト用のリクエストを投げる

Generics
  BindingsやVariablesに型を付ける
```

### `Bindings` と `Variables` の型指定

Hono公式のAppページでは、Genericsを使うことでCloudflare Workers Bindingsや、`c.set()` / `c.get()` で使うvariablesの型を指定できると説明されています。

参照元: [Hono - App / Generics](https://hono.dev/docs/api/hono)

```ts
type Bindings = {
  DB: D1Database;
  API_TOKEN: string;
};

type Variables = {
  currentUser: {
    id: string;
    name: string;
  };
};

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();
```

自分用に分けるとこうです。

```txt
Bindings
  Cloudflare側から渡されるもの
  例: c.env.DB, c.env.API_TOKEN

Variables
  MiddlewareなどでHonoの処理中にセットするもの
  例: c.set("currentUser", user), c.get("currentUser")
```

この違いは、認証やDB接続を整理するときに効いてきます。

### `strict` mode

Hono公式のAppページでは、strict modeはデフォルトで `true` で、`/hello` と `/hello/` を区別すると説明されています。`strict: false` を指定すると、両方を同じように扱えます。

参照元: [Hono - App / strict mode](https://hono.dev/docs/api/hono)

```ts
const app = new Hono({ strict: false });
```

最初はデフォルトのままでよいですが、`/hello` と `/hello/` の違いでハマったらここを思い出します。

## Best Practices

Honoは自由に書けますが、自由に書きすぎると型推論が効きにくくなります。

Hono公式のBest Practicesでは、できるだけRuby on Rails風のControllerを作らないほうがよい、と説明されています。理由は、handlerをルート定義から切り離すと、パスパラメータなどの型推論が難しくなるためです。

参照元: [Hono - Best Practices](https://hono.dev/docs/guides/best-practices)

避けたい例はこうです。

```ts
import type { Context } from "hono";

const getPost = (c: Context) => {
  const id = c.req.param("id");
  return c.json({ id });
};

app.get("/posts/:id", getPost);
```

この書き方は悪いわけではありませんが、Honoの型推論のうまみが減りやすいです。

公式が勧める基本形は、ルート定義のすぐ後ろにhandlerを書く形です。

```ts
app.get("/posts/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});
```

Hono公式のBest Practicesでも、この形ならpath parameterを推論できると説明されています。

参照元: [Hono - Best Practices / Don't make Controllers when possible](https://hono.dev/docs/guides/best-practices)

### 大きくなったら `app.route()` で分ける

Hono公式のBest Practicesでは、大きいアプリを作る場合、`app.route()` を使ってファイルを分ける例が紹介されています。

参照元: [Hono - Best Practices / Building a larger application](https://hono.dev/docs/guides/best-practices)

たとえば、投稿APIとユーザーAPIを分けるなら、こういう考え方です。

```ts
// routes/posts.ts
import { Hono } from "hono";

const posts = new Hono();

posts.get("/", (c) => c.json({ posts: [] }));
posts.post("/", (c) => c.json({ message: "created" }, 201));
posts.get("/:id", (c) => c.json({ id: c.req.param("id") }));

export default posts;
```

```ts
// routes/users.ts
import { Hono } from "hono";

const users = new Hono();

users.get("/", (c) => c.json({ users: [] }));
users.get("/:id", (c) => c.json({ id: c.req.param("id") }));

export default users;
```

```ts
// functions/api/[[route]].ts
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import posts from "../../routes/posts";
import users from "../../routes/users";

const app = new Hono().basePath("/api");

app.route("/posts", posts);
app.route("/users", users);

export const onRequest = handle(app);
```

この場合、実際のURLはこうなります。

```txt
GET /api/posts
GET /api/posts/1
GET /api/users
GET /api/users/1
```

Hono側のルート分割は、`/api` ではなく、`/posts` や `/users` の単位で考えると読みやすいです。

## Testing

Hono公式のTestingでは、Honoアプリはテストしやすく、Requestを作ってHonoアプリに渡し、Responseを検証できると説明されています。便利な方法として `app.request()` が紹介されています。

参照元: [Hono - Testing](https://hono.dev/docs/guides/testing)

たとえば、次のようなAPIがあるとします。

```ts
const app = new Hono();

app.get("/posts", (c) => {
  return c.text("Many posts");
});

app.post("/posts", (c) => {
  return c.json(
    {
      message: "Created",
    },
    201,
  );
});
```

GETのテストはこう書けます。

```ts
test("GET /posts", async () => {
  const res = await app.request("/posts");

  expect(res.status).toBe(200);
  expect(await res.text()).toBe("Many posts");
});
```

POSTのテストはこうです。

```ts
test("POST /posts", async () => {
  const res = await app.request("/posts", {
    method: "POST",
  });

  expect(res.status).toBe(201);
  expect(await res.json()).toEqual({
    message: "Created",
  });
});
```

JSONを送るテストなら、`Content-Type: application/json` を付けます。

```ts
test("POST /posts with JSON", async () => {
  const res = await app.request("/posts", {
    method: "POST",
    body: JSON.stringify({ title: "Hello" }),
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  expect(res.status).toBe(201);
});
```

Hono公式のTestingでは、JSONデータをPOSTする例や、`app.request()` の第3引数にmock envを渡して `c.env` をテストする例も紹介されています。

参照元: [Hono - Testing / Request and Response](https://hono.dev/docs/guides/testing)  
参照元: [Hono - Testing / Env](https://hono.dev/docs/guides/testing)

Cloudflare D1などのBindingを使う場合、テストではmockを渡す考え方になります。

```ts
const MOCK_ENV = {
  DB: {
    prepare: () => {
      // mocked D1
    },
  },
};

test("GET /posts with env", async () => {
  const res = await app.request("/posts", {}, MOCK_ENV);

  expect(res.status).toBe(200);
});
```

## 自分の中の全体像

ここまでをまとめると、全体像はこうです。

```txt
ブラウザ
  ↓
Cloudflare Pages
  ↓
静的ファイルなら React/Vite のビルド結果を返す
  ↓
/api 配下なら Pages Functions が動く
  ↓
functions/api/[[route]].ts
  ↓
onRequest
  ↓
handle(app)
  ↓
Hono app
  ↓
basePath("/api")
  ↓
app.get("/posts")
  ↓
必要なら c.env.DB でD1にアクセス
  ↓
c.json() でJSONを返す
```

重要な対応関係は以下です。

```txt
Cloudflare Pages Functionsの入口:
  onRequest

Honoアプリの本体:
  app

Cloudflare Pages FunctionsとHonoをつなぐもの:
  handle(app)

Cloudflare側のリソースにアクセスする入口:
  c.env

D1にアクセスする入口:
  c.env.DB
```

## 今回の最重要ポイント

今回一番重要なのは、以下です。

```ts
const app = new Hono().basePath("/api");

export const onRequest = handle(app);
```

これは、単なるおまじないではありません。

```txt
Cloudflare Pages FunctionsのonRequestとして、
Honoアプリを動かすための接続コード。
そして /api は Hono の basePath として持たせる
```

です。

Cloudflare Pages Functionsは `onRequest` を探します。  
Honoは `app` にルーティングを書きます。  
その2つをつなぐのが `handle(app)` です。
`/api` のprefixは `handle()` の第二引数ではなく、`basePath("/api")` で扱います。

```txt
Cloudflare Pages
  「onRequestある？」

functions/api/[[route]].ts
  「あるよ。handle(app) を渡すよ」

Hono
  「basePath('/api') つきで /posts や /health を処理するよ」
```

この理解があると、Cloudflare Pages上でHono APIが動く理由がかなり見えました。
