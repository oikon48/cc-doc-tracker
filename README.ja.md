# 📚 Claude Code Documentation Tracker

[English](README.md)

[![Fetch Docs](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml/badge.svg)](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Claude Codeの公式ドキュメントを自動取得し、変更を追跡するツールです。

## 🎯 特徴

- 🔄 **自動更新**: 1日4回（JST 3:00, 9:00, 15:00, 21:00）
- 📝 **純粋なMarkdown**: ソースから直接保存
- 📊 **Git追跡**: 完全な変更履歴
- 🗑️ **完全同期**: 新規追加、更新、削除を検知
- 🚀 **TypeScript**: 型安全な実装
- ⚡ **軽量**: 最小限の依存関係

## 🔍 仕組み

### システムアーキテクチャ

```
1. ソースを並行取得
   ├── llms.txt（正のURL一覧）
   └── docs_map.md（タイトルと構造）

2. マージ＆重複排除
   ├── 両ソースを統合
   └── 重複URLを削除

3. ローカルファイル同期
   ├── マージ済みリストとローカルファイルを比較
   └── 孤立ファイルを削除（ソースにない）

4. 各ドキュメント取得
   ├── Markdownを直接取得（HTML変換なし）
   ├── 最小限のfrontmatter追加（title, source）
   └── docs/en/[filename].mdとして保存

5. Git追跡
   ├── 新規ファイル → "Added [file]"
   ├── 変更ファイル → "Modified [file]"
   └── 削除ファイル → "Deleted [file]"
```

### データフロー

```
┌─ llms.txt (正のソース) ─┐   ┌─ docs_map.md (タイトル) ─┐
│  48 URLs               │   │  44 URLs + metadata     │
└──────────┬─────────────┘   └───────────┬─────────────┘
           └────────────┬─────────────────┘
                        ↓
              [マージ＆重複排除: 48 docs]
                        ↓
              [同期: 孤立ファイル削除]
                        ↓
             [取得: Markdown直接取得]
                        ↓
               [Git: 全変更を追跡]
```

### 主要コンポーネント

| コンポーネント | 目的 |
|--------------|------|
| `llms.txt` | 正のURL一覧（常に最新） |
| `docs_map.md` | タイトルと構造（更新停止の可能性あり） |
| `mergeDocLists()` | 両ソースのマージ・重複排除 |
| `syncLocalFiles()` | マージ済みリストにないファイルを削除 |
| `fetchDoc()` | 個別ドキュメントの取得と保存 |
| `metadata/` | 統計と失敗を記録 |

## 🤖 自動化

自動実行時刻：
- **JST 3:00** (UTC 18:00)
- **JST 9:00** (UTC 0:00)
- **JST 15:00** (UTC 6:00)
- **JST 21:00** (UTC 12:00)

手動実行：Actionsタブ → "Run workflow"

## 📈 統計

現在の成功率：**100%** (48/48 ドキュメント)

```json
{
  "totalDocs": 48,
  "successfulFetch": 48,
  "failedFetch": 0,
  "deletedFiles": 0
}
```

## 🛠️ 技術スタック

- `node-fetch` - HTTPクライアント
- `dotenv` - 環境変数
- TypeScript 5.3
- GitHub Actions

## 📝 ライセンス

MIT

## ⚠️ 既知の制限事項

- `claude_code_docs_map.md` は更新が停止する可能性あり（最後の確認: 2025-11-06）
- `llms.txt` を正のURL一覧として使用
- サブディレクトリパス（例: `sdk/migration-guide.md`）に対応

## ⚠️ 免責事項

非公式ツールです。Claude CodeおよびAnthropicとは無関係です。

---

Claude Codeコミュニティのために ❤️