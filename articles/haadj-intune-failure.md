---
title: "[Azure AD][Hybrid Azure AD Join][Intune]HAADJ時にIntuneにうまく登録されないときの対処"
emoji: "📝"
type: "tech"
topics: ["azure-ad", "hybrid-azure-ad-join", "intune", "technology"]
published: false
---

HAADJ＆Intune登録についててきとうに書く

全台Intuneへ登録するのだいぶ辛い

## とりあえず、チェックするポイント

- 端末を利用しているか？
- 端末は社内ネットワークにつながっているか？
- 端末の利用者はEMSのライセンスが付与されているか？
- 端末のアカウントはローカルアカウントではなくADのアカウントか？
- 端末には最新のGPOが当たっているか？

とりあえず、だいたいの端末はこれらを確認すれば解決します。

大きく失敗のステータスは以下のパターンになる。

### Hybrid Azure AD参加できているがIntuneに登録されていない状態

HAADJできているがIntuneに登録されていないパターン。

だいたいの企業でHAADJ＆Intune登録するときはGPOを利用すると思う。

https://learn.microsoft.com/ja-jp/windows/client-management/enroll-a-windows-10-device-automatically-using-group-policy

HAADJが正常にできているのにIntuneに登録できていない場合、GPO周りが怪しいので疑ってみる。

```plain
dsregcmd /status
```

コマンドでAzureAdJoined と DomainJoined が YES に設定＆PRTを取得できていることが確認できればほとんどのパターンでうまくIntune登録されるはず。

あと端末のGPO適用状況は下記のコマンドで確認できる

```plain
.\gpresult.exe -v
```

### Hybrid Azure AD参加できていないし、Intuneに登録されてもいない。ただ、PCオブジェクト自体は同期されている

このパターンの場合以下のことを疑う。

- 利用者のアカウントはAD、AADにAAD Connectで同期されているか
- ローカルユーザーを利用していないか

想定したユーザーで端末を利用しているか疑うのが吉です。

### そもそも、PCオブジェクト自体がない

タスクスケジューラ周りを疑ってください。

あとそもそも端末を利用しているのか。

https://amano-yuruyuru.com/task_scheduler-no_startup

## トラブルシューティングについて

大体はMSのブログ・ドキュメントを参考にすれば解決します。

https://jpazureid.github.io/blog/azure-active-directory/troubleshoot-hybrid-azure-ad-join-managed/

https://learn.microsoft.com/ja-jp/troubleshoot/mem/intune/troubleshoot-windows-auto-enrollment

https://learn.microsoft.com/ja-jp/troubleshoot/mem/intune/troubleshoot-windows-enrollment-errors

上記のトラブルシューティング記事を参考に解決できなかった場合、AD＆AADからPCオブジェクトを削除＆再登録パターンが良きです。

ただ、AD、AAD側から端末を削除したとしても端末側のステータスは変わらいので下記のコマンドでHAADJから抜けます。※必ず管理者としてコマンドプロンプトを立ち上げてください。

```plain
dsregcmd.exe /debug /leave
```

https://learn.microsoft.com/ja-jp/azure/active-directory/devices/faq

トラブルシューティング＆再登録してもうまくいかなかった場合・・・

諦めて新しい端末を渡しましょうｗ

それでは、読んでいただきありがとうございました。
