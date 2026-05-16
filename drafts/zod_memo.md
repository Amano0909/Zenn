# Zodを軽く理解する

## Zodとは

[Introduction](https://zod.dev/)

> ZodはTypeScriptを第一に考えた検証ライブラリです。Zodを使用すると、単純なオブジェクトから複雑なネストされたオブジェクトまで、データの検証に使用できるスキーマを定義できます。

なるほど。validation libraryとのことです。

```
import * as z from "zod";

const User = z.object({
  name: z.string(),
});

// some untrusted data...
const input = { /* stuff */ };

// the parsed result is validated and type safe!
const data = User.parse(input);

// so you can use it with confidence :)
console.log(data.name);
```

特徴

- 外部依存関係はゼロ
- Node.jsおよびすべての最新ブラウザで動作します。
- 簡潔なインターフェース

インストール

```
npm install zod
```

## 基本的な使い方

[Basic usage](https://zod.dev/basics)

なんかもろもろやる前にまずはスキーマを定義する

```
import * as z from "zod";

const Player = z.object({
  username: z.string(),
  xp: z.number()
});
```

validation には`.parse` を利用

```
Player.parse({ username: "billie", xp: 100 });
// => returns { username: "billie", xp: 100 }
```

エラーが出た場合

`ZodError`で詳細なエラーをthrow します

```
try {
  Player.parse({ username: 42, xp: "100" });
} catch(error){
  if(error instanceof z.ZodError){
    error.issues;
    /* [
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
    ] */
  }
}
```

`try/catch`が使いたくなかったら`.safeParse()`が用意されているそう

```
const result = Player.safeParse({ username: 42, xp: "100" });
if (!result.success) {
  result.error;   // ZodError instance
} else {
  result.data;    // { username: string; xp: number }
}
```

スキーマから型の抽出が`z.infer<>`で可能

```
const Player = z.object({
  username: z.string(),
  xp: z.number()
});

// extract the inferred type
type Player = z.infer<typeof Player>;

// use it in your code
const player: Player = { username: "billie", xp: 100 };
```

## スキーマ定義

[Defining schemas](https://zod.dev/api)

量が多いので使いそうなところを抜粋

### 基本的な型

```
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

`z.coerce`

```
z.coerce.string();    // String(input)
z.coerce.number();    // Number(input)
z.coerce.boolean();   // Boolean(input)
z.coerce.bigint();    // BigInt(input)
```

### リテラル型

```
const tuna = z.literal("tuna");
const twelve = z.literal(12);
const twobig = z.literal(2n);
const tru = z.literal(true);
```

`null` `undefined` `void`もいける

```
z.null();
z.undefined();
z.void(); // equivalent to z.undefined()
```

複数のリテラル値を許可する

```
const colors = z.literal(["red", "green", "blue"]);

colors.parse("green"); // ✅
colors.parse("yellow"); // ❌
```

### 文字列のバリデーション全般

```
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

簡単な文字列変換

```
z.string().trim(); // trim whitespace
z.string().toLowerCase(); // toLowerCase
z.string().toUpperCase(); // toUpperCase
z.string().normalize(); // normalize unicode characters
```

### String formats

いっぱいありそう。
詳細はリンク先確認

```
z.email();
z.uuid();
z.url();
z.httpUrl();       // http or https URLs only
z.hostname();
z.e164();          // E.164 phone numbers
z.emoji();         // validates a single emoji character
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
z.cidrv4();        // ipv4 CIDR block
z.cidrv6();        // ipv6 CIDR block
z.hash("sha256");  // or "sha1", "sha384", "sha512", "md5"
z.iso.date();
z.iso.time();
z.iso.datetime();
z.iso.duration();
```

## カスタムエラー

[Customizing errors](https://zod.dev/error-customization)

通常`ZodError`に詳細なエラーメッセージ含まれている

```
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

エラーメッセージの内容は変更が可能

```
z.string("Not a string!");
```

定義の仕方

```
z.string("Bad!");
z.string().min(5, "Too short!");
z.uuid("Bad UUID!");
z.iso.date("Bad date!");
z.array(z.string(), "Not an array!");
z.array(z.string()).min(5, "Too few items!");
z.set(z.string(), "Bad set!");
```

こっちでもOK

```
z.string({ error: "Bad!" });
z.string().min(5, { error: "Too short!" });
z.uuid({ error: "Bad UUID!" });
z.iso.date({ error: "Bad date!" });
z.array(z.string(), { error: "Bad array!" });
z.array(z.string()).min(5, { error: "Too few items!" });
z.set(z.string(), { error: "Bad set!" });
```

注意
カスタムエラーは、エラー時の message を変更するだけです。
`.parse()` の場合、バリデーションに失敗すれば通常どおり `ZodError` を throw します。
例外を投げたくない場合は `.safeParse()` を使います。

## memo　まとめ

- スキーマを定義する
- `.safeParse()` or `.parse` で検証する
  - 必要であれば`ZodError` でエラーを確認する
- `z.infer<>`　で型を抽出する
