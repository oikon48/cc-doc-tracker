# Claude Code 公式ドキュメント更新レポート

**対象期間**: 2026-07-25 00:00 UTC 〜 2026-07-26 18:24 UTC  
**リリース範囲**: v2.1.219 〜 v2.1.220

---

## 1. CHANGELOG ページの解説

> ページURL: https://code.claude.com/docs/en/changelog.md

直近24時間にリリースされたバージョンは以下の2件です。

### v2.1.219 (July 24, 2026) — 主要リリース

**新機能・変更点:**

- **Claude Opus 5 をデフォルト Opus モデルに採用**  
  1Mトークンコンテキスト、Fast Modeは$10/$50/MTok。

- **`sandbox.network.strictAllowlist` 設定の追加**  
  サンドボックス化されたコマンドに対して、許可リスト外のホストへの接続を拒否できるようになりました。

- **`DirectoryAdded` フックの追加**  
  `/add-dir` コマンドまたは SDK の `register_repo_root` で新しい作業ディレクトリを登録した後に発火するフックです。

- **ネストされたサブエージェントのフォワーディング対応**  
  `--forward-subagent-text` フラグで、深さ2以上のサブエージェントのテキスト・思考ブロックも `stream-json` 出力に含められるようになりました。

- **サブエージェントのネスト上限をデフォルト3に変更**  
  以前はデフォルト1でしたが、v2.1.219からはデフォルト3（メイン会話の3層下まで）になりました。無効化したい場合は `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1` を設定してください。

- **Fast Mode の Opus 4.7 サポートを完全削除**  
  非推奨は6/25から予告されていましたが、7/24付けで削除されました。`/fast` は Opus 5 と Opus 4.8 のみ対象です。

**バグ修正:**
- `claude -p` で途中のAPIエラーが原因でターンが終了した際に回答が消える問題を修正
- Remote Control クライアントでモデル切り替え後にFastモードのステータスが古いまま残る問題を修正
- Windowsで `\u` プレフィックスを含むパス（例: `C:\Users\unicorn`）が漢字に化けるバグを修正
- MCPコネクションとRemote Control設定のエラーメッセージを改善

---

### v2.1.220 (July 25, 2026)

- バグ修正および信頼性の向上（詳細非公開）

---

## 2. 公式ドキュメントの更新まとめ

直近24時間で更新されたドキュメントページを変更内容ごとに整理します。

---

### fast-mode.md ★ 重要

> URL: https://code.claude.com/docs/en/fast-mode.md

**主な変更:**
- **Opus 4.7 の Fast Mode が削除** (v2.1.219以降)。「対応モデルはOpus 5とOpus 4.8のみ」に更新。
- 価格テーブルから Opus 4.7 の行（$30/$150/MTok）を削除。
- v2.1.219 以降では Opus 5 がFast Modeのデフォルトになったことを明記。
- Opus 4.7を選択していても Fast Mode がONのままになるが、APIがリクエストを拒否する動作を説明。
- `/model` や `/config model=`、Remote Control 経由のモデル切り替え時の Fast Mode 状態変化確認メッセージについて明確化（v2.1.218+）。

---

### sub-agents.md ★ 重要

> URL: https://code.claude.com/docs/en/sub-agents.md

**主な変更:**
- **ネストされたサブエージェントのデフォルト上限が3に変更** (v2.1.219+)。以前(v2.1.217-218)はデフォルト1でネストが無効でした。
- 深さ上限に達したサブエージェントには `Agent` ツールが渡されなくなる（フォークは例外で、ツールは渡されるが使用するとエラー）。
- `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` で上限を変更できることを説明。`1` に設定するとネスト無効。
- 各バージョンごとのデフォルト値を整理した注釈を追加:
  - v2.1.172〜v2.1.216: デフォルト5層、変更不可
  - v2.1.217〜v2.1.218: デフォルト1（ネスト無効）
  - v2.1.219+: デフォルト3

---

### workflows.md ★ 重要

> URL: https://code.claude.com/docs/en/workflows.md

**主な変更 (2件のコミットにわたる更新):**

**1. ワークフローサイズガイドラインのデフォルト変更 (v2.1.219+)**
- デフォルト値が `unrestricted` から `medium`（15エージェント未満）に変更。
- `/config` の表示が `medium (default)` に、ワークフロー実行中の表示も `medium size (/config)` に。
- `workflowSizeGuideline` キーを `settings.json` で設定できるようになり、`/config` の設定より優先される（設定ファイルで指定した場合は `/config` の行が非表示になる）。

**2. プラグインでのワークフロー配布が可能に**
- プラグインの `workflows/` ディレクトリにスクリプトを置くことでワークフローを共有できるようになった。
- プラグイン名でネームスペース化される（例: `acme-tools` プラグインの `release-audit` スクリプト → `/acme-tools:release-audit`）。

**3. ワークフロー保存時のシンボリックリンク確認 (v2.1.216+)**
- 保存先にシンボリックリンクが存在する場合、書き込まずにエラーを表示するようになった。

---

### settings.md ★ 重要

> URL: https://code.claude.com/docs/en/settings.md

**主な変更:**
- **`workflowSizeGuideline` がユーザー/プロジェクト settings.json で設定可能に** (v2.1.219+)。以前はグローバル設定（`~/.claude.json`）のみだったが、任意のsettingsファイルで設定できるようになった。
- グローバル設定テーブルから `workflowSizeGuideline` を削除し、available settings テーブルに移動。デフォルト値は `medium`。

---

### mcp.md ★ 重要

> URL: https://code.claude.com/docs/en/mcp.md

**主な変更:**
- **「削除せずにサーバーを無効化する」セクションを新設**。
  - `/mcp` パネルでトグルを切り替えるとサーバーを設定を保持したまま接続停止できる。
  - `disabledMcpServers`（ユーザー設定・プラグインサーバー向けのオプトアウトリスト）と `enabledMcpServers`（デフォルトOFFのビルトインサーバー向けオプトインリスト）の使い分けを説明。
  - `.mcp.json` で定義されるサーバーを管理する `enabledMcpjsonServers`/`disabledMcpjsonServers` とは別物であることを明記。
- プラグイン提供のMCPサーバーの説明文を全体的に明確化。

---

### auto-mode-config.md

> URL: https://code.claude.com/docs/en/auto-mode-config.md

**主な変更:**
- **「拒否された操作のレビュー」セクションを大幅に拡充**。
  - allow ルール追加、`autoMode.environment` への追加、再試行の3つの対処法を具体的に説明。
  - 拒否理由の表示について詳述：v2.1.208以降は多くのセッションで `Blocked by classifier` という固定テキストが表示され、一部のセッション(v2.1.193+)ではモデルが書いた説明文が表示される場合もある。
- **「繰り返される拒否への対処」**というサブセクションを追加。

---

### hooks.md

> URL: https://code.claude.com/docs/en/hooks.md

**主な変更:**
- `PreToolUse` フックの入力スキーマを更新：Bash ツールの `tool_input` に `description`、`timeout`、`run_in_background` フィールドが追加されたことを明記。
- `tool_use_id` フィールドが共通フィールドとして追加された旨を説明。
- `PermissionDenied` フックの `reason` フィールドの説明を更新：v2.1.208以降は `Blocked by classifier` という固定テキストになっていることを明記。

---

### permission-modes.md

> URL: https://code.claude.com/docs/en/permission-modes.md

**主な変更 (2件のコミットにわたる更新):**
- **planモードのテーブル説明を更新**：`plan` モードで auto mode が使用可能な場合、classifierで承認されたコマンドは自動実行されることを追記。
- **`rm -rf /` などの危険コマンドの扱い変更** (v2.1.218+)：auto mode でもこれらを classifier に回すようになった（以前はプロンプトを表示）。
- **bypassPermissions モードと plan モードの関係を明確化**：bypass permissions が使用可能なセッションでは plan モードのブロックが適用されない。
- protected paths の扱いをモード別に更新した表を追加。

---

### agent-view.md

> URL: https://code.claude.com/docs/en/agent-view.md

2件のコミットで小規模な修正・明確化が行われました。

---

### troubleshoot-install.md

> URL: https://code.claude.com/docs/en/troubleshoot-install.md

小規模な追記・修正が行われました。

---

### plugin-marketplaces.md

> URL: https://code.claude.com/docs/en/plugin-marketplaces.md

文章の明確化・修正が行われました。

---

### errors.md

> URL: https://code.claude.com/docs/en/errors.md

大幅な改訂（204行変更）が行われました。エラーリファレンスの整理・更新です。

---

### agent-sdk/subagents.md

> URL: https://code.claude.com/docs/en/agent-sdk/subagents.md

サブエージェントのネスト深さ制限に関する説明を `sub-agents.md` に合わせて更新。

---

*このレポートは自動生成されました。生成日時: 2026-07-26*
