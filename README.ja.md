# 📚 Claude Code Documentation Tracker

[English](README.md)

[![Fetch Docs](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml/badge.svg)](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

Claude Codeの公式ドキュメントを自動的に取得し、変更を追跡するGitHubリポジトリです。

## ✨ ハイライト

**2025年11月の大幅改善:**
- 🎯 **不要なHTML処理を削除**（cheerio, turndown）
- 📝 **サーバーが純粋なMarkdownを返す** - 直接保存するように変更
- ✅ **結果:** 完璧なMarkdown可読性（エスケープ記号の問題を解消！）

## 🎯 特徴

- 🔄 **自動更新**: 1日2回（JST 9:00, 21:00）自動的にドキュメントを取得
- 📝 **Markdown形式**: すべてのドキュメントをMarkdown形式で保存
- 📊 **変更追跡**: Gitのコミット履歴で変更を完全に追跡
- 🚀 **TypeScript実装**: 型安全で保守性の高いコード
- ⚡ **並列処理**: 効率的なバッチ処理で高速取得
- 🔁 **リトライ機能**: 一時的なエラーに対する耐性

## 🏗️ アーキテクチャ

### なぜこんなにシンプルなのか？

このプロジェクトは以下の発見により大幅に簡素化されました：

1. Claude Codeドキュメントサーバーは`Content-Type: text/markdown`を返す
2. HTML解析が不要 → **cheerio削除** ✂️
3. HTML→Markdown変換が不要 → **turndown削除** ✂️

### Before vs After

| 項目 | Before（初期実装） | After（現在） |
|------|-------------------|--------------|
| **依存関係** | node-fetch + cheerio + turndown | node-fetchのみ |
| **処理フロー** | 取得 → HTML解析 → 変換 → 保存 | 取得 → 直接保存 |
| **Markdown品質** | エスケープ記号（`\#`, `\*`, `\[`） | クリーンなMarkdown |
| **コード複雑度** | HTML処理ロジック含む | シンプルな直接保存 |
| **パフォーマンス** | 遅い（HTML解析） | 速い（直接書き込み） |

### 改善例

**Before:**
```markdown
\# Claude Code overview
\* An AWS account with Bedrock access enabled
\[Amazon Bedrock console\](https://console.aws.amazon.com/bedrock/)
```

**After:**
```markdown
# Claude Code overview
* An AWS account with Bedrock access enabled
[Amazon Bedrock console](https://console.aws.amazon.com/bedrock/)
```

## 📁 ディレクトリ構造

```
cc-doc-tracker/
├── docs/
│   └── en/                 # 取得したMarkdownドキュメント
│       ├── overview.md
│       ├── quickstart.md
│       └── ...
├── metadata/               # メタデータ
│   ├── docs_map.md        # ドキュメント一覧
│   └── last_update.json  # 最終更新情報
├── src/                   # TypeScriptソースコード
│   ├── lib/
│   │   └── doc-fetcher.ts
│   ├── fetch-docs.ts
│   └── index.ts
└── .github/
    └── workflows/
        └── fetch-docs.yml  # GitHub Actions設定
```

## 🚀 使用方法

### ローカルで実行

1. **リポジトリをクローン**
```bash
git clone https://github.com/oikon48/cc-doc-tracker.git
cd cc-doc-tracker
```

2. **依存関係をインストール**
```bash
npm install
```

3. **ドキュメントを取得**
```bash
npm run fetch-docs
```

### 開発

```bash
# TypeScriptを直接実行（開発時）
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint

# フォーマット
npm run format
```

## 📈 変更履歴の確認

### コミット履歴で確認

```bash
# すべての変更履歴を確認
git log --oneline --grep="📝 Update Claude Code docs"

# 特定ファイルの変更履歴
git log --follow docs/en/overview.md

# 変更内容の詳細を確認
git show [commit-hash]
```

### 特定の日付の差分を確認

```bash
# 昨日から今日の変更
git diff 'HEAD@{yesterday}' HEAD -- docs/

# 特定の日付間の変更
git diff 'HEAD@{2025-11-01}' 'HEAD@{2025-11-15}' -- docs/
```

### 変更されたファイルの一覧

```bash
# 最新のコミットで変更されたファイル
git diff-tree --no-commit-id --name-only -r HEAD

# 過去7日間で変更されたファイル
git diff --name-only 'HEAD@{7 days ago}' HEAD -- docs/
```

## 📊 統計情報

メタデータは `metadata/last_update.json` に保存されます：

```json
{
  "lastMapUpdate": "2025-11-15 00:10:13 UTC",
  "lastRun": "2025-11-15T12:00:00.000Z",
  "totalDocs": 35,
  "successfulFetch": 35,
  "failedFetch": 0,
  "failedFiles": []
}
```

## 🔧 GitHub Actions

このリポジトリは以下のスケジュールで自動実行されます：

- **JST 9:00** (UTC 0:00) - 朝の更新
- **JST 21:00** (UTC 12:00) - 夜の更新

手動実行も可能です：
1. GitHubのActionsタブを開く
2. "Fetch Claude Code Documentation"を選択
3. "Run workflow"をクリック

## 🤝 コントリビューション

Issue や Pull Request は歓迎します！

### 開発手順

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📝 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- [Claude Code](https://code.claude.com/) - Anthropic's official Claude IDE
- [Git Scraping](https://simonwillison.net/2020/Oct/9/git-scraping/) concept by Simon Willison

## ⚠️ 免責事項

このプロジェクトは非公式のツールです。Claude CodeおよびAnthropicとは直接の関係はありません。
ドキュメントの著作権はAnthropicに帰属します。

## 📧 連絡先

問題や提案がある場合は、[Issues](https://github.com/oikon48/cc-doc-tracker/issues)でお知らせください。

---

最終更新: 2025-11-15