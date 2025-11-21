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
1. docs_map.md取得
   ├── 全ドキュメントリンクを解析
   └── メタデータ抽出（最終更新時刻）

2. ローカルファイル同期
   ├── docs_mapとローカルファイルを比較
   └── 孤立ファイルを削除（docs_mapにない）

3. 各ドキュメント取得
   ├── Markdownを直接取得（HTML変換なし）
   ├── 最小限のfrontmatter追加（title, source）
   └── docs/en/[filename].mdとして保存

4. Git追跡
   ├── 新規ファイル → "Added [file]"
   ├── 変更ファイル → "Modified [file]"
   └── 削除ファイル → "Deleted [file]"
```

### データフロー

```
https://code.claude.com/docs/en/claude_code_docs_map.md
                    ↓
            [リンク解析: 46 docs]
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
| `docs_map.md` | 全ドキュメントのマスターリスト |
| `syncLocalFiles()` | docs_mapにないファイルを削除 |
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

現在の成功率：**97.8%** (45/46 ドキュメント)

最終更新日時：**2025-11-20 18:04:45 UTC**

```json
{
  "totalDocs": 46,
  "successfulFetch": 45,
  "failedFetch": 1,
  "failedFiles": ["migration-guide.md"],
  "deletedFiles": 0
}
```

### 既知の問題

- **migration-guide.md**: 現在取得に失敗しています（メタデータで追跡中）

## 🛠️ 技術スタック

- `node-fetch` - HTTPクライアント
- `dotenv` - 環境変数
- TypeScript 5.3
- GitHub Actions

## 🔧 トラブルシューティング

### ネットワークの問題

ローカル実行時にネットワークエラーが発生する場合：
```bash
# 取得スクリプトはcode.claude.comへのインターネットアクセスが必要です
npm run fetch-docs
```

サンドボックス環境やオフライン環境ではネットワークエラーが予想されます。GitHub Actionsワークフローは適切なネットワークアクセスで自動的に取得を処理します。

### 取得の失敗

失敗したドキュメント取得の詳細については、`metadata/last_update.json`を確認してください。失敗したドキュメントは追跡され、各実行で報告されます。

## 📝 ライセンス

MIT

## ⚠️ 免責事項

非公式ツールです。Claude CodeおよびAnthropicとは無関係です。

---

Claude Codeコミュニティのために ❤️