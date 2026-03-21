# 調査: Bashツールのコマンド実行解説（description）パラメータ

## 調査日
2026-03-21

## 調査対象
Claude Codeのchangelogおよびドキュメントを調査し、コマンド実行時にコマンドの解説（description）を入れる変更が導入されたか確認する。

## 結論

**Changelogには、Bashツールの`description`パラメータ導入に関する明示的な記載は見つからなかった。**

## 現状

現在のClaude Code（v2.1.81時点）のBashツールには `description` パラメータが存在する。このパラメータは、コマンド実行時に「そのコマンドが何をするか」を簡潔に説明するためのもの。

### descriptionパラメータの仕様（システムプロンプトより）
- コマンドの動作を能動態で簡潔に記述する
- 単純なコマンドは5〜10語程度（例: `git status` → "Show working tree status"）
- 複雑なコマンド（パイプ、特殊フラグ等）はより詳細な説明を付与
- "complex"や"risk"といった単語は使用しない

### 例
| コマンド | description |
|---|---|
| `ls` | "List files in current directory" |
| `git status` | "Show working tree status" |
| `npm install` | "Install package dependencies" |
| `find . -name "*.tmp" -exec rm {} \;` | "Find and delete all .tmp files recursively" |

## Changelog調査結果

### 調査範囲
- v0.2.21（2025年4月2日）〜 v2.1.81（2026年3月20日）
- 全エントリを確認

### 関連する可能性のあるエントリ

| バージョン | 日付 | 内容 | 関連度 |
|---|---|---|---|
| v2.1.47 | 2026-02-18 | bashパーミッション分類器が返すmatch descriptionが実際の入力ルールに対応しているか検証するよう修正（hallucinated descriptionsによる不正な許可を防止） | 低（パーミッション関連のdescription） |
| v2.1.47 | 2026-02-18 | システムプロンプトを改善し、bash代替の代わりに専用ツール（Read, Edit, Glob, Grep）を使うよう誘導 | 低（システムプロンプト変更） |
| v2.1.30 | 2026-02-03 | ツールのdescriptionやinput schemaが変更された際にプロンプトキャッシュが正しく無効化されない問題を修正 | 低（キャッシュ関連） |
| v2.1.20 | 2026-01-27 | 折りたたまれたread/searchグループの表示テキストを進行中は現在形、完了後は過去形に変更 | 低（UI表示変更） |
| v2.0.41 | 2025-11-14 | コマンドdescriptionにおけるuser settings/project settingsの誤ったラベリングを修正 | 低（設定UI関連） |

### ドキュメント調査結果
- `tools-reference.md`: Bashツールの項目に`description`パラメータの記載なし
- Bashツールの説明はコマンドの永続性動作（working directory、環境変数）のみ記載

## 考察

Bashツールの`description`パラメータは以下のいずれかの可能性がある：

1. **システムプロンプトレベルの変更**: changelogに記載されないシステムプロンプトの更新として導入された
2. **初期から存在**: ツール定義の初期バージョンから含まれていた可能性がある
3. **段階的導入**: 複数の小さな変更を通じて現在の形になった

ドキュメント（tools-reference.md）にも`description`パラメータの詳細は記載されておらず、これはモデルに対するツール定義（API側）の仕様であり、ユーザー向けドキュメントには含まれていない可能性が高い。
