---
title: "Codex AppをWindows WSL環境で使うための自分用メモ"
emoji: "📝"
type: "tech"
topics: ["codex", "wsl", "ubuntu", "windows"]
published: true
---

Codex App を Windows + WSL 環境で使うためにやったことの自分用メモです。

Windows 側に直接開発環境を作るのではなく、WSL2 / Ubuntu 側に Git や Node.js などを入れて、Codex App から WSL のリポジトリを開く構成にします。

## WSL2 / Ubuntu をインストール

PowerShell または Windows Terminal で以下を実行します。

```bash
wsl --install -d Ubuntu
```

インストール後、Ubuntu を初回起動します。

初回起動時に UNIX ユーザーを作成します。

```text
Enter new UNIX username: amano
New password:
Retype new password:
```

## Ubuntu の基本パッケージを更新する

Ubuntu 側で以下を実行します。

```bash
sudo apt update
sudo apt upgrade -y
```

よく使う基本パッケージも入れておきます。

```bash
sudo apt install -y \
  git \
  curl
```

## GitHub CLI をインストールして認証する

GitHub CLI をインストールします。

```bash
sudo apt install -y gh
```

インストール後、GitHub にログインします。

```bash
gh auth login
```

画面の案内に従って認証します。

## bubblewrap をインストールする

Codex のサンドボックス関連で使うため、`bubblewrap` を入れておきます。

```bash
sudo apt install -y bubblewrap
```

参考:

https://developers.openai.com/codex/concepts/sandboxing

## Git の初回設定

Git のユーザー名とメールアドレスを設定します。

```bash
git config --global user.name "hogehoge"
git config --global user.email "GitHubのメールアドレス"
```

設定できたか確認します。

```bash
git config --global --list
```

## Node.js と pnpm をインストールする

Node.js と pnpm は公式手順を見ながらインストールします。

https://nodejs.org/ja/download

インストール後、バージョン確認します。

```bash
node -v
npm -v
pnpm -v
```

## Codex App のフォルダ設定

Windows から WSL のファイルは以下のパスで参照できます。

```text
\\wsl$\
```

Codex App では、WSL 側に clone したリポジトリを選択します。

例:

```text
\\wsl$\Ubuntu\home\amano\dev\repo-name
```

## Codex App の設定

自分用の Codex App 設定メモです。

| 項目 | 設定 |
| --- | --- |
| 権限 | default 権限のみを選択 |
| エージェント環境 | WSL |
| 統合ターミナル | WSL |
| 言語 | 日本語 |
| 外観 | ダーク |

構成の設定です。

| 項目 | 設定 |
| --- | --- |
| 承認ポリシー | on request |
| サンドボックス設定 | Workspace write |

Git の設定です。

| 項目 | 設定 |
| --- | --- |
| サイドバーに PR アイコンを表示 | ON |

## 発生したエラー

Codex App でスレッド作成時に、以下のエラーが出ました。

```text
error creating thread: Fatal error: Codex cannot access session files at /mnt/c/Users/hogehoge/.codex/sessions (permission denied). If sessions were created using sudo, fix ownership: sudo chown -R $(whoami) /mnt/c/Users/hogehoge/.codex (underlying error: Operation not permitted (os error 1))
```

日本語にすると、だいたい以下の内容です。

```text
スレッド作成エラー:
致命的なエラーです。

Codex は以下の場所にあるセッションファイルへアクセスできません。

/mnt/c/Users/hogehoge/.codex/sessions

理由: 権限がありません。

もし、そのセッションファイルが sudo を使って作成されたものなら、
所有者を修正してください。

sudo chown -R $(whoami) /mnt/c/Users/hogehoge/.codex

根本のエラー:
操作は許可されていません。
OSエラー 1
```

参照:

https://github.com/openai/codex/issues/13762

## 解決方法

Codex App の状態ファイルを、Windows 側ではなく Linux 側のファイルシステムに置くようにします。

まず、WSL 側に Codex App 用のディレクトリを作成します。

```bash
mkdir -p ~/.codex-app/sessions
mkdir -p ~/.codex-app/worktrees
```

次に、`~/.profile` に以下を追記します。

```bash
cat <<'EOF' >> ~/.profile

# Codex Desktop on Windows + WSL workaround
# Keep Codex WSL runtime state on the Linux filesystem.
if [ "$CODEX_INTERNAL_ORIGINATOR_OVERRIDE" = "Codex Desktop" ]; then
  export CODEX_HOME="$HOME/.codex-app"
fi
EOF
```

反映するために、Ubuntu を開きなおします。

これで Codex App から WSL のリポジトリを開いたときに、セッションや worktree の状態が Linux 側に作られるようになります。

## メモ

- Windows 側の `/mnt/c/Users/hogehoge/.codex` 配下は権限まわりで詰まることがある
- WSL で作業するなら、リポジトリも Codex の状態ファイルも Linux 側に寄せた方が扱いやすい
- clone 先は `/home/amano/dev/` など、WSL 側のホーム配下にしておく
