# Claude Code ドキュメント最新変更まとめ

> 対象コミット: `5715dd6` (2026-02-07 00:28:23 UTC)
> 変更ファイル数: 18 (+392行 / -181行)

---

## 1. Hooks — 新イベント2つ追加

**対象ファイル**: `hooks.md`, `hooks-guide.md`, `plugins-reference.md`, `agent-teams.md`

### 1-1. 新しいフックイベント: `TeammateIdle`

Agent Team のチームメイトがアイドル状態（作業完了後に停止しようとしている状態）になる直前に発火するフック。

- **目的**: チームメイトが停止する前に品質ゲートを強制できる（例: lint チェック、ビルド成果物の存在確認）
- **動作**: exit code 2 で終了すると、stderr のメッセージがフィードバックとしてチームメイトに送られ、チームメイトは停止せず作業を継続
- **入力フィールド**: `teammate_name`（アイドルになろうとしているチームメイト名）、`team_name`（チーム名）
- **制約**: マッチャー非対応（全てのチームメイトアイドルイベントで発火）、Prompt/Agent ベースフック非対応

### 1-2. 新しいフックイベント: `TaskCompleted`

タスクが完了としてマークされようとしている時に発火するフック。2つの状況で発火:
1. エージェントが TaskUpdate ツールでタスクを明示的に完了させる時
2. Agent Team のチームメイトが進行中のタスクを持ったままターンを終了する時

- **目的**: テスト実行や lint チェックなど、タスク完了の品質基準を強制できる
- **動作**: exit code 2 で終了すると、タスクは完了にならず、stderr メッセージがモデルにフィードバック
- **入力フィールド**: `task_id`, `task_subject`, `task_description`（任意）, `teammate_name`（任意）, `team_name`（任意）
- **制約**: マッチャー非対応、Prompt ベースフックはサポート、Agent ベースフック非サポート

### 1-3. その他のフック関連変更

- `agent-teams.md` に「Enforce quality gates with hooks」セクションを新規追加
- `plugins-reference.md` のフックイベント一覧に `TeammateIdle` / `TaskCompleted` を追加
- `hooks-guide.md` のイベント一覧テーブル・マッチャーテーブルを更新
- ライフサイクル図の画像が PNG → SVG に変更
- `SessionEnd` のマッチャー値に `bypass_permissions_disabled` を追加

---

## 2. Auto Memory — 新機能

**対象ファイル**: `memory.md`, `settings.md`, `how-claude-code-works.md`

Claude Code に **Auto Memory** という新しいメモリ機構が追加された。

### 何が変わったか

- Claude がセッション中に発見した情報（プロジェクトパターン、デバッグのヒント、アーキテクチャメモ、ユーザーの好みなど）を**自動的に記録**する永続ストレージ
- 従来の CLAUDE.md（ユーザーが手動で書く指示）とは異なり、**Claude 自身が自分のために書くメモ**
- 段階的ロールアウト中。`CLAUDE_CODE_DISABLE_AUTO_MEMORY=0` で強制有効化可能

### 保存場所

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # エントリーポイント（毎セッション先頭200行が自動読み込み）
├── debugging.md       # トピック別の詳細メモ
├── api-conventions.md
└── ...
```

- プロジェクト毎に独立（git リポジトリルートで判別）
- Git worktree は別ディレクトリ扱い
- トピックファイルは必要時にオンデマンドで読み込み

### 管理方法

- `/memory` コマンドでファイルセレクタからアクセス
- 「pnpm を使うことを覚えておいて」のような自然言語で保存を依頼
- 環境変数: `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`（オフ）/ `=0`（オン）

### 関連する他ファイルの変更

- `settings.md`: 環境変数テーブルに `CLAUDE_CODE_DISABLE_AUTO_MEMORY` を追加
- `how-claude-code-works.md`: 「Sessions are ephemeral」→「Sessions are independent」に変更。Auto Memory による永続化について言及
- `memory.md`: メモリタイプ一覧テーブルに Auto Memory 行を追加、説明文を「4つのメモリロケーション」→「いくつかのメモリロケーション」に修正

---

## 3. Checkpointing — Summarize 機能の追加

**対象ファイル**: `checkpointing.md`, `best-practices.md`, `interactive-mode.md`, `keybindings.md`

`/rewind` メニューに **Summarize from here** オプションが追加された。

### 新しい /rewind メニュー

| アクション | 説明 |
|---|---|
| Restore code and conversation | コードと会話の両方を巻き戻し |
| Restore conversation | 会話だけ巻き戻し（コード変更は維持） |
| Restore code | コードだけ巻き戻し（会話は維持） |
| **Summarize from here** (新) | 選択メッセージ以降を要約に圧縮。ファイルは変更なし |
| Never mind | キャンセル |

### Restore vs. Summarize

- Restore: 状態を巻き戻す（コード変更・会話履歴をもとに戻す）
- Summarize: 選択メッセージ以降をAI生成の要約に置き換え、コンテキストウィンドウを節約。`/compact` の部分適用版
- 元のメッセージはトランスクリプトに保存されるため、Claude は必要に応じて詳細を参照可能

### 関連する他ファイルの変更

- `best-practices.md`: リワインドの説明に「or summarize from a selected message」を追加。コンテキスト管理のTipsに部分要約のヒントを追加
- `interactive-mode.md`: `Esc+Esc` のキーボードショートカット説明を「Rewind or summarize」に更新。`/rewind` コマンド説明にも要約機能を追記
- `keybindings.md`: `MessageSelector` コンテキストの説明を「Rewind and summarize dialog」に更新

---

## 4. Subagent — 機能強化

**対象ファイル**: `sub-agents.md`, `cli-reference.md`

### 4-1. 新しい frontmatter フィールド

| フィールド | 説明 |
|---|---|
| `maxTurns` | サブエージェントが停止するまでの最大ターン数 |
| `mcpServers` | サブエージェントが利用できる MCP サーバー（名前参照またはインライン定義） |

### 4-2. `delegate` パーミッションモードの追加

Agent Team のリーダー向けの調整専用モード。チーム管理ツールのみに制限される。

### 4-3. Task(agent_type) によるサブエージェント生成の制限

`--agent` フラグで実行されるメインスレッドのエージェントについて、`tools` フィールドでホワイトリスト制限が可能に:

```yaml
tools: Task(worker, researcher), Read, Bash  # worker と researcher のみ生成可能
```

- `Task`（括弧なし）: 全サブエージェント許可
- `Task` を省略: サブエージェント生成を禁止
- メインスレッド（`claude --agent`）のみに適用

### 4-4. CLI `--agents` フラグのフィールド拡充

`cli-reference.md` のテーブルに以下が追加:
- `disallowedTools`, `skills`, `mcpServers`, `maxTurns`

---

## 5. Skills — 改善

**対象ファイル**: `skills.md`, `settings.md`

### 5-1. `--add-dir` からのスキル読み込み

`--add-dir` で追加したディレクトリ内の `.claude/skills/` にあるスキルが自動読み込みされ、ライブ変更検出もサポート。セッション中の編集で再起動不要。

### 5-2. スキル文字バジェットの動的化

- 旧: 固定 15,000 文字
- 新: コンテキストウィンドウの **2%** で動的にスケール（フォールバック: 16,000 文字）
- `settings.md` の `SLASH_COMMAND_TOOL_CHAR_BUDGET` の説明も更新

---

## 6. Amazon Bedrock — 出力トークン設定セクション削除

**対象ファイル**: `amazon-bedrock.md`

「5. Output token configuration」セクションが完全に削除。以前推奨されていた `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` / `MAX_THINKING_TOKENS=1024` の設定が不要に。

---

## 7. その他の変更

| ファイル | 変更内容 |
|---|---|
| `llms.txt` | `checkpointing.md` の説明文を「Track, rewind, and summarize...」に更新 |
| `changelog.md` | HTML/メタデータの更新（内容的な変更なし） |

---

## まとめ

このコミットの主なテーマは3つ:

1. **Agent Teams の品質管理強化**: `TeammateIdle` / `TaskCompleted` フックにより、チームメイトの作業やタスク完了にプログラマティックな品質ゲートを設けられるようになった
2. **Auto Memory の導入**: Claude が自動的に学習内容を永続化し、セッションを跨いで知識を蓄積する仕組みが追加された
3. **Checkpointing の Summarize 機能**: `/rewind` メニューから会話の部分的な要約が可能になり、コンテキストウィンドウの効率的な管理ができるようになった
