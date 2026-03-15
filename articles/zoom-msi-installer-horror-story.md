---
title: "ZoomのMSIインストーラーで痛い目にあったのでまとめておく"
emoji: "📝"
type: "tech"
topics: ["technology"]
published: false
---

ZoomのMSIインストーラーについて、一回痛い目にあっているので備忘録としてまとめておく

## 発生する問題

Zoomには「Zoom ソフトウェア四半期ライフサイクル ポリシー」というものがある

https://support.zoom.com/hc/ja/article?id=zm_kb&sysparm_article=KB0061143

- Zoom は 3 か月ごと（2 月、5 月、8 月、11 月の最初の週末）に、新しい最小バージョンを適用しています
- Zoom は、アプリの特定バージョンが終了と見なされるまで、少なくとも 9 か月間はサポートするよう努めます
- 終了と見なされる時点で、ユーザーは最小バージョンまたはそれ以降に更新するよう求められます。
- 最小動作バージョンの終了が近づいても、所定期間内に更新しなかったお客様はどうなりますか？
  - お客様は、サインインまたはミーティング / ウェビナーに参加する前に、Zoom デスクトップ アプリまたはモバイルアプリを現在の最小バージョンに更新するように求められます。すぐに更新できない場合は、代わりにウェブアプリを介してミーティングに参加するオプションが提示されます。

つまりZoomは特定バージョン以上をサポートし、それより前のバージョンについてはユーザーがデスクトップアプリケーションを更新しない限りは利用できなくなります。

この前提において、管理者がなにも考えずにMSIインストーラーを利用すると痛い目にあいます。

msiのインストーラーの場合、ユーザー側でアプリケーションの更新ができないのがデフォルトだからです・・

つまり、ユーザー側でZoomクライアントをアップデートをすることができません。バージョンが固定されます。ということはある日を境に一斉にZoomクライアントが利用できなくなります。

https://support.zoom.com/hc/ja/article?id=zm_kb&sysparm_article=KB0065469

![](/images/zoom-msi-installer-horror-story/image-01.png)

## 一次対応

すでに問題が発生している場合、いくつかの対応方法があるかと思います。

ざっと思いつくもの書きます。

- ユーザー側で一度Zoomクライアントをアンイストールして最新のmsiインストーラーでインストールを行ってもらう
  - このときIntune側で古いバージョンのアプリケーションを配っている場合、再インストールが走ってしまう可能性が高いので一度アプリケーションの配布を止めます

- このあと書きますがZoomのアップデートポリシーを制御する方法は大きく分けて3通りあります。
  - すでにインストールをしてしまっているので1は利用できません。そのため、2,3の方法で対応を行います。
    - 1 MSIインストーラー実行時にオプションを指定して制御する
    - 2 GPO（管理テンプレート利用）を使って制御する
    - 3 レジストリによる制御

自分の場合は取り急ぎ、Intuneを利用してレジストリを配布しました。

[公式にページ](https://support.zoom.com/hc/ja/article?id=zm_kb&sysparm_article=KB0065469)に記載がある通り、レジストリの場所は以下です。

- HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Zoom\Zoom Meetings\General
- HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Zoom\Zoom Meetings\Meetings
- HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Zoom\Zoom Meetings\Chat

`EnableClientAutoUpdate` はGeneralに下記の値で配布します。

値の名前：EnableClientAutoUpdate
値の種類：REG_DWORD
値のデータ：1 (有効にする場合)

これで自動更新が有効になりました。

レジストリの配布方法は下記を参考に

https://qiita.com/ShinichiroKosugi/items/c69764daa18d212eeee2

## 恒久対応

恒久対応は大きく分けて2つ「MSIインストール時にオプションを指定する方法」と「ポリシーで制御する方法」です

### MSIインストール時にオプションを指定する方法

下記のページを参考にしてください

https://support.zoom.com/hc/ja/article?id=zm_kb&sysparm_article=KB0064494

https://learn.microsoft.com/ja-jp/windows-server/administration/windows-commands/msiexec#install-options

使いそうな値をピックアップしておきます

オプション

| MSIオプション | 説明 | 展開例・値 |
| --- | --- | --- |
| サイレント インストール | ユーザー操作、インストール ウィンドウ、即時の再起動なしでクライアントをインストールします。 | msiexec /i ZoomInstallerFull.msi /quiet /qn /norestart /log install.log |
| zNoDesktopShortCut | インストールまたは更新時にデスクトップ ショートカットが作成されないようにします。 | msiexec /package ZoomInstallerFull.msi /lex zoommsi.log zNoDesktopShortCut=0 |
| zSSOHost | このオプション（デフォルトで無効）を有効にすると、SSO URL を事前に設定できます。 | msiexec /package ZoomInstallerFull.msi /lex zoommsi.log zSSOHost="vanity_URL" |
| ZoomAutoUpdate | デフォルトで無効になっている場合、クライアントの [アップデートを確認] オプションが削除され、ユーザーは、Zoom クライアントの更新プログラムの確認とインストールを行えなくなります。 自動更新が有効になっている場合、ユーザーはクライアントで更新プログラムを確認でき、アップデートする際に管理者権限は必要ありません。重要事項については AutoUpdate に関する重要な注意事項をご覧ください。 | msiexec /package ZoomInstallerFull. msi /lex zoommsi.log ZoomAutoUpdate=1 |

追加設定オプション

- **zConfig:**

  特定の設定を行う必要がある場合、zConfig パラメータをインストールに選択したものを最後に追加します。

```plain
msiexec /package ZoomInstaller.msi /norestart /lex msi.log ZConfig="account=your_account_id;nogoogle=1;nofacebook=1”
```

| MSIオプション | 説明 |
| --- | --- |
| NoFacebook | Facebook サインイン オプションを削除します。 |
| NoGoogle | Google サインイン オプションを削除します。 |
| EnableAppleLogin | Apple サインイン オプションへのアクセスを許可します。 |
| DisableLoginWithEmail | メール サインイン オプションを削除します。 |
| DisableKeepSignedInWithSSO | クライアント起動時に新たに SSO サインインを要求します |
| AutoSSOLogin | SSO を使用するデフォルトのサインイン |
| ForceSSOUrl=your_company | SSO サインインのためにデフォルトの SSO URL を設定し、ロックする。たとえば、hooli.zoom.us は、ForceSSOUrl=hooli として設定されます。 |

### ポリシーで制御する方法

下記のページを参考にしてください

https://support.zoom.com/hc/ja/article?id=zm_kb&sysparm_article=KB0065469

Intuneを利用している場合、ADMXの取り込みが可能です

https://learn.microsoft.com/ja-jp/mem/intune/configuration/administrative-templates-import-custom

使いそうな値をピックアップしておきます

| レジストリ | 説明 |
| --- | --- |
| DisableCreatingDesktopShortcut | インストールまたは更新時にデスクトップ ショートカットが作成されないようにします。 |
| EnableClientAutoUpdate | ユーザーによるクライアントを通じた更新を有効にします。 無効にすると、[更新を確認] ボタンも非表示になります。重要事項については、AutoUpdate のセクションを参照してください。 |
| DisableFacebookLogin | Facebook サインイン オプションを削除します。 |
| DisableGoogleLogin | Google サインイン オプションを削除します。 |
| EnableAppleLogin | Apple サインイン オプションへのアクセスを許可します |
| DisableLoginWithEmail | メール サインイン オプションを削除します。 |
| DisableKeepSignedInWithSSO | クライアント起動時に新たに SSO サインインを要求します。 |
| ForceLoginWithSSO | SSO を使用するデフォルトのサインインです。 |
| SetSSOURL | SSO サインインのためにデフォルトの SSO URL を設定します。たとえば、hooli.zoom.us は「SetSSOURL=hooli」として設定されます。 |
| ForceSSOURL | SSO サインインのためにデフォルトの SSO URL を設定し、ロックします。たとえば、hooli.zoom.us は「ForceSSOUrl=hooli」として設定されます。 |

以上
