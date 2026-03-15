---
title: "[Intune]Windows端末のIPv6をレジストリで管理する"
emoji: "📝"
type: "tech"
topics: ["intune", "technology"]
published: false
---

お疲れ様です。

たまたま、Windows端末のIPv6をIntune制御する機会があったので備忘録として残しておきます。

## 対象のレジストリ

https://learn.microsoft.com/ja-jp/troubleshoot/windows-server/networking/configure-ipv6-in-windows

設定するのはこいつですね。

**場所**: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters\` **名前**: DisabledComponents **種類**: REG_DWORD **最小値**: 0x00 (既定値) **最大値**: 0xFF (IPv6 が無効)

今回の場合「

IPv6 よりも IPv4 を優先する

」を設定したいと思います。

つまり設定する値は以下

10 進数の 32

16 進数の 0x20

バイナリ xx1x xxxx

「

IPv6 を無効にする代わりに推奨されます。

」とドキュメントに書いてあるのでIPv6無効にする要件が出てきたらこの値を候補にいれてもいいかなと思っています。

## レジストリ値のエクスポート＆intunewinファイルの作成

レジストリエディターを開いてください※Windowsボタンを押して「rege」とか打つと候補に出てきます。

該当のレジストリを右クリックしてエクスポートします。

今回の場合ですと

`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters\`です。

![](/images/intune-ipv6-memo/image-01.png)

「reg」拡張子のファイルがエクスポートされるのでメモ帳とかで中身を確認して余計な値を削除します。

今回余計な値を削除すると下記のような感じになりました。

```plain
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters]
"DisabledComponents"=dword:00000020
```

これで配るレジストリはできました。

ちょっと今回は省略しますがこのregファイルをツールを使いintunewinファイルにします。

https://qiita.com/ShinichiroKosugi/items/c69764daa18d212eeee2

## Intuneで配る

ここまでで配りたいregをintunewinファイルにすることができました。

なのであとはIntuneで配るだけです。

Microsoft Intune 管理センターからアプリを追加します。

最初にintunewinファイルはどれか聞かれるので先ほど作成したファイルを選択します。

![](/images/intune-ipv6-memo/image-02.png)

### アプリ情報タブ

- 名前：適当に決めてください
- 説明：適当に決めてください
- 発行元：適当に決めてください

他の値はDefaultで大丈夫です。

### プログラム

- インストールコマンド：regedit.exe /s ipv6.reg
  - ファイル名はintunewinファイルを作成したときに利用したregファイルの名前を指定してください

- アンインストールコマンド：regedit.exe /s ipv6.reg
  - インストールコマンドと同じで大丈夫です

- デバイスの再起動
  - なにもしない

他の値はDefaultで大丈夫です。

### 必要条件

- オペレーティングシステムのアーキテクチャ：要件に合ったものを選択してください
- 最低限のオペレーティングシステム：要件に合ったものを選択してください

他の値はDefaultで大丈夫です。

### 検出規則 ※一番重要

- 規則の形式：検出規則を手動で構成する
  - 規則の構成：レジストリ
  - キーパス：HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters
  - 値の名前：DisabledComponents
  - 検出方法：文字列を比較
  - 演算子：指定の値に等しい
  - 値：32

ここの設定値が一番重要です。文字列比較では10進数の値を指定しましょう。

あとは適当な割り当てを行えばデバイスにレジストリが配られます。

以上です。

なにかしら参考になったらうれしいです。
