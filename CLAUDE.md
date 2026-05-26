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

ハイブリッドAIクライアントは `src/lib/ai/client.ts` に内包されている
（以前は外部の `~/Documents/ClaudeCode/local-llm/shared-client` を `file:` 依存で
参照していたが、Vercel が外部パスを解決できずデプロイが失敗していたため、必要な
コードをこのリポジトリへ vendor した）。

## 振り分けの現状
- `generateTripFromArticle` → ローカル開発時は Ollama(Qwen2.5 3B)、本番は Gemini
- `generateTripFromInput`   → 常に Gemini
- `generateTripFromPlan`    → 常に Gemini
- 振り分けは `src/lib/ai/client.ts` 内の `aiRoutes` で制御(`USE_OLLAMA` 環境変数で切替)
- Ollama 接続先は `OLLAMA_HOST` 環境変数（デフォルト `http://localhost:11434`）

## 参考ドキュメント
- 統合仕様(このプロジェクト固有): `docs/local-llm-integration.md`
- 基盤側の全体設計: `~/Documents/ClaudeCode/local-llm/docs/design.md`
- カスタムModelfile定義: `~/Documents/ClaudeCode/local-llm/modelfiles/`

## AI処理を変更する際の注意
- 既存3関数のシグネチャは変えない(API route との契約)
- ローカル/Gemini の切替は環境変数 `USE_OLLAMA` で制御
- 新しい AI 処理を追加する時は、`src/lib/ai/client.ts` の `aiRoutes` に
  タスク種別(例:`recommend`, `embed-query`)を追加してから `ai.complete()` を呼ぶ
- 外部 local-llm パッケージ側に新タスクを追加した場合、必要な実装はこのリポジトリ
  にも反映する（vendor 済みのため）
