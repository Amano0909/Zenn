---
title: "Geminiのプライバシー・アクセス権周りについてメモっとく"
emoji: "📝"
type: "tech"
topics: ["technology"]
published: false
---

https://twitter.com/AmanoH0909/status/1886023933461434470

という疑問が生まれて、回答ももらえたので自分用に使いそうな部分をメモっとく

## ドキュメントから読み解く

**参照**

https://support.google.com/a/answer/15706919?hl=ja

### そもそもここでいっているGeminiとは？

> - この Google Workspace の生成 AI に関するプライバシー ハブでは、
>
>   **Gemini for Workspace**
>
>   （Gmail の文書作成サポート、Workspace のサイドパネルなど）と、ウェブ（gemini.google.com など）とモバイル（Android、iOS）の
>
>   **Gemini アプリ**
>
>   について説明します。このプライバシー ハブでは、両方のプロダクトを単に
>
>   **Gemini**
>
>   と呼びます。

- 下記の２つのことについていっている
  - **Gemini for Workspace**
  - **Gemini アプリ**
    - ウェブ（gemini.google.com など）とモバイル（Android、iOS）の Gemini アプリ

### データは学習に利用される？

> - **Gemini とのやり取りが組織外に開示されることはありません**
>
>   。Gemini は、お客様の許可なくコンテンツを組織外に共有することはありません。
>
> - **お客様のコンテンツが他のお客様のために使用されることはありません。**
>
>   お客様のコンテンツは、人間によってレビューされることも、許可なくお客様のドメイン外で生成 AI モデルのトレーニングに使用されることもありません。
>
> - いいえ。ユーザー プロンプトは、
>
>   [Cloud のデータ処理に関する追加条項](https://cloud.google.com/terms/data-processing-addendum)
>
>   に基づき、顧客データと見なされます。Workspace は、お客様からの事前の許可や指示がない限り、モデルのトレーニングに顧客データを使用することはありません。このコミットメントの概要は、
>
>   [Google Workspace サービス固有の利用規約](https://workspace.google.com/terms/service-terms/)
>
>   の「トレーニングの制限」セクションに記載されています。

- 生成AIのトレーニングに利用されることはない。つまり、機密情報をプロンプトに打ち込んでも学習による漏洩の可能性はない
- Geminiを利用してからといって勝手に情報が外部に共有されることはない

### プロンプトの保存期間は？

> - **Gemini for Workspace**
>
>   では、プロンプトや回答は保存されません。ユーザーが Gemini for Workspace の操作時に入力したプロンプトは、そのユーザー セッションのコンテキスト以外では使用されません。
>
>   [The life of a prompt: Demystifying Gemini（プロンプトのライフ: Gemini を解き明かす）](https://workspace.google.com/blog/ai-and-machine-learning/life-prompt-demystifying-gemini)
>
>   で説明されているように、Gemini セッションが終了するとデータは消去されます。
>
> - **Gemini アプリ**
>
>   では、Gemini アプリ アクティビティ（プロンプトや回答など）が
>
>   [Gemini アプリ アクティビティ](https://myactivity.google.com/product/gemini?utm_source=help)
>
>   に最大 18 か月間保存されます。チャットとアップロードされたファイルが人間のレビュアーによって確認されることはなく、生成 AI モデルのトレーニングにも使用されません。管理者は、組織の Gemini アプリへのアクセスを
>
>   [オンまたはオフ](https://support.google.com/a/answer/14571493?visit_id=638719596767444413-3024814626&fl=1&sjid=3298958633045450898-NA)
>
>   に切り替えることができます。また、Gemini アプリ アクティビティの時間を管理できるようになる機能が近日リリース予定です。このページで最新情報を随時ご確認ください。

- **Gemini for Workspace**

  はセッションがつながっている間のみ
- **Gemini アプリ**

  はMax18ヶ月

### Genemiが利用できるデータの範囲は？勝手にGoogle Driveの給与情報見られない？

> - Gemini の厳格なデータアクセス制御モデルでは、入力やセッション コンテンツがユーザーの境界を越えて漏洩することはありません。このモデルは、セッションのデータをその個々のユーザーにのみ提示するように構成されています。そのため、情報は組織の外部に出ないように非公開に保たれるだけでなく、組織内のユーザー間でも、Workspace に組み込まれている共有ファイルに対するアクセス制御に従って非公開に保たれます。
>
>   [クライアントサイド暗号化](https://support.google.com/a/answer/10741897)
>
>   （CSE）を利用すると、Gemini による機密データへのアクセスを制限できます。Google システムや Google 社員には CSE コンテンツにアクセスするための技術的な方法がないため、CSE を活用して同じ目的を達成できます。
>
> - Gemini は、プロンプトやグラウンドとなる回答のコンテキストを特定する目的で、Gemini for Workspace を利用しているユーザーがアクセス可能な Workspace 内の関連コンテンツを取得します。そのユーザーがアクセスできないドキュメントやメールのコンテンツは取得しません。
>
>   [Information Rights Management](https://support.google.com/a/answer/9656855?#irmfaq)
>
>   （ダウンロード、コピー、印刷の無効化）や
>
>   [クライアントサイド暗号化](https://support.google.com/a/answer/10741897)
>
>   などのコンテンツ制限を使用して、Gemini による機密データへのアクセスを制限することもできます。

- Geminiを利用した範囲のアクセス権はGeminiを利用しているユーザーに依存する
- つまりGoogle Driveなどのアクセス権を適切に行っていれば問題はない

### GeminiのON/OFFってどうやるんだっけ？

> コアサービスとしての Gemini アプリへのアクセスは、Google Workspace for Education の初中等教育機関を除き、デフォルトでオンになっています。Google Workspace for Education の小中高校のユーザーについては、ユーザーに対して Gemini アプリを有効にする必要があります。詳しくは、[ユーザーに対して Gemini アプリを有効または無効にする方法](https://support.google.com/a?p=gemini-ws)をご覧ください。
>
> また、サポートされている Workspace エディションでは、管理者は次の Workspace サービスで Gemini 機能とサイドパネルを有効または無効にできます。
>
> - Gmail
> - ドライブ
> - ドキュメント
> - Meet
> - チャット

- サービスごとにON・OFFを制御可能。またそもそもGemini自体をON・OFF可能

### 監査ログどうなってる？

> 対象のエディションでは、Gemini がドライブからコンテンツにアクセスしたことでトリガーされたアクティビティの監査ログを管理者が確認できます（詳しくは、[Gemini for Google Workspace のアクティビティに関する監査ログの追加について](https://workspaceupdates.googleblog.com/2024/06/adding-audit-logs-for-gemini-for-google-workspace-activity.html)をご覧ください）。今後、Google はさらに多くの Workspace アプリに Gemini 監査ログを追加していく予定です。最新情報については、[Google Workspace アップデート ブログ](https://workspaceupdates.googleblog.com/)をご確認ください。

- アクティビティの監査ログが取得可能

### Geminiって国内だけで処理できるの？

> Google Workspace サービスはグローバルな性質を持っているため、Gemini はユーザーに最も近い施設内で顧客データの処理を最適化します。ただし、Gemini は、お客様が定義したリージョンでプロンプトや回答の処理を行うことはありません。Google では、[Google の施設](https://www.google.com/about/datacenters/locations/)と[復処理者の施設](https://workspace.google.com/intl/en/terms/subprocessors.html)の所在地に関する情報を提供しています。
>
> Gemini からの回答をユーザーが承認してドキュメントまたはメールに貼り付けた後、対象となるエディションのお客様は、データ リージョン機能を使用して、対象となる顧客データを保存するリージョン（ヨーロッパなど）を選択できます。この機能は現在、[データ リージョンの対象となるデータ](https://support.google.com/a/answer/9223653)に記載されている Google Workspace のコアサービスとデータに適用されています（これは [Google Workspace サービス固有の利用規約](https://workspace.google.com/terms/service-terms/)の「データ リージョン」セクションに反映されています）。

- んー。。よくワカラナイゾ。指定したリージョンで処理できるのか？

### GeminiのWebアプリからGoogle Workspaceのファイルにアクセス可能？

> Gemini Workspace 拡張機能を使用すると、Gemini アプリを Google Workspace のアプリやサービスと接続して、生産性を高め、ワークフローを効率化できます。Google Workspace を接続すると、Gemini アプリで次のことが可能になります。
>
> - Gmail、Google ドキュメント、Google ドライブなどのアプリやサービスから要約や迅速な回答を得たり、情報を検索したりする
> - Google ToDo リストにタスクを追加、取得する
> - Google Keep でメモやリストを作成、取得する
> - Google カレンダーで予定を作成、管理する
>
> Workspace 拡張機能で Gemini を使用する場合、組織の Workspace 契約（[Cloud のデータ処理に関する追加条項](https://cloud.google.com/terms/data-processing-addendum)を含む）が適用されます。Gemini アプリでのチャットの内容やアップロードされたファイルが人間のレビュアーによって確認されることはなく、お客様の許可なく生成 AI モデルのトレーニングに使用されることもありません。
>
> **重要**: Gemini アプリでの他の拡張機能を使用する場合は、別の利用規約が適用され、この条項の対象ではありません。
>
> 管理者は、組織内のユーザーが Gemini アプリで Workspace 拡張機能にアクセスできるかどうかを制御できます。詳しくは、[Gemini で Workspace 拡張機能を有効または無効にする（ベータ版）](https://support.google.com/a/answer/15293691)をご覧ください。ユーザーは [Workspace 拡張機能](https://gemini.google.com/extensions)を有効または無効にできます。詳しくは、[仕事用または学校用の Google アカウントで Gemini アプリの拡張機能を使用する](https://support.google.com/gemini/answer/14959807?hl=en&co=GENIE.Platform%3DAndroid#zippy=%2Cexamples)をご覧ください。また、前述のように、Gemini アプリが Workspace 拡張機能経由で Workspace データにアクセスできるようするなど、ユーザーはスマート機能の設定を管理できます。これらのユーザー コントロールについて詳しくは、[Gmail で Google Workspace のスマート機能をオンにする](https://support.google.com/mail/answer/15604322?visit_id=638691086215735632-3308105832&p=workspace-smart-features-settings&rd=1)をご覧ください。

- Gemini Workspace 拡張機能っていう現状(2025/2/2)時点でベータ機能のものを利用すれば可能
- これはON・OFF可能

以上
