---
title: "[Intune]AADJ端末でユーザーにローカル管理者権限を与えたい"
emoji: "📝"
type: "tech"
topics: ["azure-ad", "intune", "technology"]
published: false
---

あまりよろしくないのですがユーザーにローカル管理者権限を与えたい場合がありますよね。

AD参加時にはGPOで制御を行っていましたがAADJ端末ではどのように制御を行えばいいでしょうか。

この辺り対応することがあったので備忘録としてとこしておきます。

## 公式ドキュメントから読み取れること

https://learn.microsoft.com/ja-jp/azure/active-directory/devices/assign-local-admin

> Azure AD 参加を使用して Windows デバイスを Azure AD に接続すると、Azure AD によって、デバイスのローカル管理者グループに次のセキュリティ プリンシパルが追加されます。
>
> - Azure AD のグローバル管理者ロール
> - Azure AD 参加済みデバイスのローカル管理者ロール
> - Azure AD 参加を実行するユーザー

つまりローカル管理者権限を与えたい場合どちらかのAzure ADロールが必要です。

- グローバル管理者ロール
- Azure AD 参加済みデバイスのローカル管理者

https://learn.microsoft.com/ja-jp/azure/active-directory/roles/permissions-reference

または、「Azure AD 参加を実行するユーザー」なのでAADJ認証時に利用したユーザーは自動的に管理者になるということです。

基本的にはこの3パターン。

端末が個人端末の場合は「Azure AD 参加を実行するユーザー」つまり、そのPCを利用するユーザーでセットアップを行ってあげれば問題はありません。

ただ、共有端末の場合はこの方法は通用しません。

1人目には管理者権限を与えることができますけど2人目以降は一般のユーザーになってしまいます。

困った。。

## 解決方法

解決方法は公式ドキュメントに書いてあります。

> Windows 10 バージョン 20H2 以降では、Azure AD グループを使用して、
>
> [ローカル ユーザーとグループ](https://learn.microsoft.com/ja-jp/windows/client-management/mdm/policy-csp-localusersandgroups)
>
> の MDM ポリシーで Azure AD 参加済みデバイスの管理者特権を管理できます。 このポリシーを使用すると、Azure AD 参加済みデバイスのローカル管理者グループに個々のユーザーまたは Azure AD グループを割り当てることができ、さまざまなデバイス グループに対して個別の管理者をきめ細かく構成できます。
>
> 組織は、Intune の
>
> [カスタム OMA-URI 設定](https://learn.microsoft.com/ja-jp/mem/intune/configuration/custom-settings-windows-10)
>
> または
>
> [アカウント保護ポリシー](https://learn.microsoft.com/ja-jp/mem/intune/protect/endpoint-security-account-protection-policy)
>
> を使用してこれらのポリシーを管理することができます。 このポリシーを使用する際の考慮事項は次のとおりです。

なるほど。

- アカウント保護ポリシー
- カスタム OMA-URI

どちらかの方法で解決ができそうです。

今回はGUIで設定できるアカウント保護ポリシーを試してみます。

## 設定方法

https://learn.microsoft.com/ja-jp/mem/intune/protect/endpoint-security-account-protection-policy

https://learn.microsoft.com/ja-jp/windows/client-management/mdm/policy-csp-localusersandgroups?WT.mc_id=Portal-fx

![](/images/aadj-local-admin/image-01.png)

エンドポイントセキュリティ>>アカウント保護>>ポリシー作成>>ローカルユーザーグループメンバーシップからプロファイルを作成します。

![](/images/aadj-local-admin/image-02.png)

- ローカルグループ
  - 管理者を選択

- グループとユーザーのアクション
  - 追加を選択

- ユーザーの種類
  - ユーザー/グループを選択
  - ローカルadminの権限を追加したいユーザーやグループを選択します。
    - 個別にユーザーを追加するのは手間なので動的グループなどを指定するといいと思います。

簡単ですが設定は以上になります。プロファイルがデバイスに適用されればローカル管理者権限がユーザーに付与されます。

## おまけ

![天野](/images/aadj-local-admin/image-03.jpg)

天野

ローカル管理者権限をユーザーに付与したくないんだけど

このパターンよくあると思います。

この場合はWindows Autopilotを利用するのが吉だと思ってます。

![](/images/aadj-local-admin/image-04.png)

## おまけ2

![天野](/images/aadj-local-admin/image-03.jpg)

天野

ローカルユーザー/ローカル管理者のパスワードをセキュアに管理したいんだけど

こちらもよくあるパターンですがヘルプ対応のために管理者権限をもったローカルユーザーを作成しておくことがあります。

このユーザーのパスワード管理が厄介です。ユーザーのパスワードを統一しておくとリスクが高いですし、パスワードを別々にしておくと管理が煩雑になります。

そんなときはWindows Local Administrator Password Solution「Windows LAPS」がおすすめです。

https://jpazureid.github.io/blog/azure-active-directory/introducing-windows-local-administrator-password-solution-with/
