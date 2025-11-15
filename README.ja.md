# 📚 Claude Code Documentation Tracker

[English](README.md)

[![Fetch Docs](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml/badge.svg)](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Claude Codeの公式ドキュメントを自動取得し、変更を追跡するツールです。

## 🎯 特徴

- 🔄 **自動更新**: 1日2回（JST 9:00, 21:00）
- 📝 **純粋なMarkdown**: ソースから直接保存
- 📊 **Git追跡**: 完全な変更履歴
- 🚀 **TypeScript**: 型安全な実装
- ⚡ **軽量**: 最小限の依存関係

## 🚀 クイックスタート

```bash
# クローン
git clone https://github.com/oikon48/cc-doc-tracker.git
cd cc-doc-tracker

# インストール
npm install

# ドキュメント取得
npm run fetch-docs
```

## 📁 構造

```
cc-doc-tracker/
├── docs/en/          # 取得したドキュメント（45ファイル）
├── metadata/         # 取得統計
├── src/              # TypeScriptソース
└── .github/          # GitHub Actions
```

## 📊 使用方法

### 変更追跡

```bash
# 更新履歴
git log --oneline --grep="📝 Update"

# 日付比較
git diff 'HEAD@{yesterday}' HEAD -- docs/

# ファイル履歴
git log --follow docs/en/overview.md
```

### 開発

```bash
npm run dev        # 開発モード
npm run build      # TypeScriptビルド
npm run lint       # リント
```

## 🤖 自動化

自動実行時刻：
- **JST 9:00** (UTC 0:00)
- **JST 21:00** (UTC 12:00)

手動実行：Actionsタブ → "Run workflow"

## 📈 統計

現在の成功率：**97.8%** (45/46 ドキュメント)

```json
{
  "totalDocs": 46,
  "successfulFetch": 45,
  "failedFetch": 1
}
```

## 🛠️ 技術スタック

- `node-fetch` - HTTPクライアント
- `dotenv` - 環境変数
- TypeScript 5.3
- GitHub Actions

## 🤝 コントリビューション

PR歓迎！シンプルで保守しやすいコードを心がけてください。

## 📝 ライセンス

MIT

## ⚠️ 免責事項

非公式ツールです。Claude CodeおよびAnthropicとは無関係です。

---

Claude Codeコミュニティのために ❤️