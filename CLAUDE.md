# プロジェクト概要
旅行プランAI生成アプリ（MVP）

# コア機能
- URLを入力すると旅程を生成
- 条件（行き先・日数・希望）から旅程をAI生成
- Outlookスタイルのカレンダーで旅程を可視化・編集

# 優先事項
まずMVPを最速で作る。ユーザーが使いながら改善していく方針。

# 重要：毎回必ず読むこと
セッション開始時に必ず `PRODUCT_NOTES.md` を読み込んでください。
プロジェクト全体の設計・実装済み機能・ファイル役割・技術メモが書かれています。
ユーザーの要望・アイデアも記載。未実装のものは積極的に実装してください。

# コーディング規約
- TypeScript 厳格モード
- コメントは WHY が明白でない場合のみ
- `res.json()` は使わず `res.text()` + `JSON.parse()` でエラーハンドリング
- フォームボタンは `type="button"` + `onClick` のみ（Enter 誤送信防止）

# ローカルLLM連携(ハイブリッドAI戦略)

このプロジェクトは `~/Documents/ClaudeCode/local-llm/` のローカルLLM基盤と
連携している。Claude Code で作業する際は以下を念頭に置くこと。

## 振り分けの現状
- `generateTripFromArticle` → ローカル開発時は Ollama(Qwen2.5 3B)、本番は Gemini
- `generateTripFromInput`   → 常に Gemini
- `generateTripFromPlan`    → 常に Gemini
- 振り分けは `src/lib/ai/client.ts` で制御(`USE_OLLAMA` 環境変数で切替)

## 詳細ドキュメント(必ず参照)
- 統合仕様(このプロジェクト固有): `docs/local-llm-integration.md`
- 基盤側の全体設計: `~/Documents/ClaudeCode/local-llm/docs/design.md`
- 実装プラン: `~/Documents/ClaudeCode/local-llm/docs/plans/`
- カスタムModelfile定義: `~/Documents/ClaudeCode/local-llm/modelfiles/`

## AI処理を変更する際の注意
- 既存3関数のシグネチャは変えない(API route との契約)
- ローカル/Gemini の切替は環境変数 `USE_OLLAMA` で制御
- 新しいAI処理を追加する時は、まず `local-llm/shared-client` 側に
  タスク種別(例:`recommend`, `embed-query`)を増やしてから、
  本プロジェクトで `ai.complete()` を呼ぶ
