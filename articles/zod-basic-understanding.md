---
title: "Zodを軽く理解するための自分用メモ"
emoji: "🧩"
type: "tech"
topics: ["zod", "typescript"]
published: true
---

## この記事の前提

この記事は、Zodの公式ドキュメントを読みながら、まずは最低限の使い方を軽く理解するための自分用メモです。

Zodを完全に使いこなすというより、次のあたりをざっくり押さえるのが目的です。

- Zodとは何か
- スキーマをどう定義するか
- `.parse()` と `.safeParse()` の違い
- `z.infer<>` で型を取り出す流れ
- よく使いそうなスキーマ定義
- カスタムエラーの書き方

参照した公式ドキュメントはこちらです。

- [Introduction](https://zod.dev/)
- [Basic usage](https://zod.dev/basics)
- [Defining schemas](https://zod.dev/api)
- [Customizing errors](https://zod.dev/error-customization)

## Zodとは

公式ドキュメントでは、ZodはTypeScriptを第一に考えた検証ライブラリと説明されています。

Zodを使うと、単純なオブジェクトから複雑なネストされたオブジェクトまで、データの検証に使えるスキーマを定義できます。

なるほど。validation libraryとのことです。

```ts
import * as z from "zod";

const User = z.object({
  name: z.string(),
});

// some untrusted data...
const input = {
  /* stuff */
};

// the parsed result is validated and type safe!
const data = User.parse(input);

// so you can use it with confidence :)
console.log(data.name);
```

特徴としては、このあたりが挙げられています。

- 外部依存関係はゼロ
- Node.jsおよびすべての最新ブラウザで動作する
- インターフェースが簡潔
- TypeScriptの型推論と組み合わせられる

インストールはこれ。

```sh
npm install zod
```

## 基本的な使い方

なんかもろもろやる前に、まずはスキーマを定義します。

```ts
import * as z from "zod";

const Player = z.object({
  username: z.string(),
  xp: z.number(),
});
```

検証には `.parse()` を使います。

```ts
Player.parse({ username: "billie", xp: 100 });
// => returns { username: "billie", xp: 100 }
```

バリデーションに失敗した場合、`.parse()` は `ZodError` を throw します。

```ts
try {
  Player.parse({ username: 42, xp: "100" });
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues;
    /*
    [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ]
    */
  }
}
```

`try/catch` が使いたくなかったら、`.safeParse()` が用意されているそうです。

```ts
const result = Player.safeParse({ username: 42, xp: "100" });

if (!result.success) {
  result.error; // ZodError instance
} else {
  result.data; // { username: string; xp: number }
}
```

スキーマから型の抽出も `z.infer<>` で可能です。

```ts
const Player = z.object({
  username: z.string(),
  xp: z.number(),
});

// extract the inferred type
type Player = z.infer<typeof Player>;

// use it in your code
const player: Player = { username: "billie", xp: 100 };
```

これは便利そう。

スキーマを1回定義して、検証と型の両方に使えるという理解でよさそうです。

## スキーマ定義

量が多いので、使いそうなところを抜粋します。

### 基本的な型

```ts
import * as z from "zod";

// primitive types
z.string();
z.number();
z.bigint();
z.boolean();
z.symbol();
z.undefined();
z.null();
```

### 型の変換

`z.coerce` を使うと、入力値を指定した型へ変換しようとします。

```ts
z.coerce.string(); // String(input)
z.coerce.number(); // Number(input)
z.coerce.boolean(); // Boolean(input)
z.coerce.bigint(); // BigInt(input)
```

たとえば `z.coerce.number()` は `Number(input)` のような変換を試みる、という感じです。

### リテラル型

```ts
const tuna = z.literal("tuna");
const twelve = z.literal(12);
const twobig = z.literal(2n);
const tru = z.literal(true);
```

`null`、`undefined`、`void` もいけます。

```ts
z.null();
z.undefined();
z.void(); // equivalent to z.undefined()
```

複数のリテラル値を許可する書き方もあります。

```ts
const colors = z.literal(["red", "green", "blue"]);

colors.parse("green"); // OK
colors.parse("yellow"); // Error
```

### 文字列のバリデーション全般

よく使いそうな文字列のバリデーションです。

```ts
z.string().max(5);
z.string().min(5);
z.string().length(5);
z.string().regex(/^[a-z]+$/);
z.string().startsWith("aaa");
z.string().endsWith("zzz");
z.string().includes("---");
z.string().uppercase();
z.string().lowercase();
```

簡単な文字列変換もできます。

```ts
z.string().trim(); // trim whitespace
z.string().toLowerCase(); // toLowerCase
z.string().toUpperCase(); // toUpperCase
z.string().normalize(); // normalize unicode characters
```

### String formats

いっぱいありそう。

詳細は公式ドキュメントを確認するのがよさそうです。

```ts
z.email();
z.uuid();
z.url();
z.httpUrl(); // http or https URLs only
z.hostname();
z.e164(); // E.164 phone numbers
z.emoji(); // validates a single emoji character
z.base64();
z.base64url();
z.hex();
z.jwt();
z.nanoid();
z.cuid();
z.cuid2();
z.ulid();
z.ipv4();
z.ipv6();
z.mac();
z.cidrv4(); // ipv4 CIDR block
z.cidrv6(); // ipv6 CIDR block
z.hash("sha256"); // or "sha1", "sha384", "sha512", "md5"
z.iso.date();
z.iso.time();
z.iso.datetime();
z.iso.duration();
```

## カスタムエラー

通常、`ZodError` には詳細なエラーメッセージが含まれています。

```ts
import * as z from "zod";

const result = z.string().safeParse(12); // { success: false, error: ZodError }

result.error.issues;
// [
//   {
//     expected: 'string',
//     code: 'invalid_type',
//     path: [],
//     message: 'Invalid input: expected string, received number'
//   }
// ]
```

エラーメッセージの内容は変更できます。

```ts
z.string("Not a string!");
```

定義の仕方はいくつかあります。

```ts
z.string("Bad!");
z.string().min(5, "Too short!");
z.uuid("Bad UUID!");
z.iso.date("Bad date!");
z.array(z.string(), "Not an array!");
z.array(z.string()).min(5, "Too few items!");
z.set(z.string(), "Bad set!");
```

こっちでもOK。

```ts
z.string({ error: "Bad!" });
z.string().min(5, { error: "Too short!" });
z.uuid({ error: "Bad UUID!" });
z.iso.date({ error: "Bad date!" });
z.array(z.string(), { error: "Bad array!" });
z.array(z.string()).min(5, { error: "Too few items!" });
z.set(z.string(), { error: "Bad set!" });
```

注意点として、カスタムエラーはエラー時の `message` を変更するだけです。

`.parse()` の場合、バリデーションに失敗すれば通常どおり `ZodError` を throw します。

例外を投げたくない場合は `.safeParse()` を使います。

## まとめ

- まずスキーマを定義する
- `.parse()` または `.safeParse()` で検証する
- 必要であれば `ZodError` でエラーを確認する
- `z.infer<>` でスキーマから型を抽出できる

Zodは「型を定義する」「値を検証する」「その型をTypeScript側でも使う」がまとまっていて、かなり便利そうでした。
