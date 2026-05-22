# tripServiceMVP × ローカルLLM 統合仕様

**作成日**: 2026-05-23
**ステータス**: 設計確定・実装前(フェーズA着手前のスタブ)

---

## 概要

本プロジェクトは `~/Documents/ClaudeCode/local-llm/` のローカルLLM基盤と連携し、
ハイブリッド戦略(Ollama + Gemini)でAI処理を実行する。

## 関連ドキュメント(必ず参照)

- **全体設計(基盤側 SSOT)**: `~/Documents/ClaudeCode/local-llm/docs/design.md`
- **共通クライアントAPI**: `~/Documents/ClaudeCode/local-llm/shared-client/README.md`(フェーズD実装時に作成)
- **カスタム Modelfile**: `~/Documents/ClaudeCode/local-llm/modelfiles/`

## ルーティング設定

### 現状(設計のみ・未実装)

| 関数 | タスク名 | 開発環境 | 本番環境 |
|---|---|---|---|
| `generateTripFromArticle` | `extract` | qwen2.5-3b-extract(Ollama) | gemini-2.5-flash-lite |
| `generateTripFromInput` | `generate-trip-input` | gemini-2.5-flash-lite | gemini-2.5-flash-lite |
| `generateTripFromPlan` | `generate-trip-plan` | gemini-2.5-flash-lite | gemini-2.5-flash-lite |

### 将来追加予定(フェーズB:過去プランRAG機能)

| 処理 | タスク名 | モデル | 備考 |
|---|---|---|---|
| プラン Embedding | `embed-plan` | nomic-embed-text(Ollama) | pgvector に保存 |
| クエリ Embedding | `embed-query` | nomic-embed-text(Ollama) | 検索時に都度生成 |
| 推薦理由生成 | `recommend` | qwen3-4b-chat(Ollama) | 類似プラン上位N件を文脈に |

## 環境変数

| 変数 | 用途 | デフォルト |
|---|---|---|
| `USE_OLLAMA` | ローカルLLMの強制ON/OFF | `NODE_ENV === 'development'` |
| `OLLAMA_HOST` | Ollama サーバー宛先 | `http://localhost:11434` |
| `GEMINI_API_KEY` | Gemini APIキー(フォールバック用・必須) | — |

## 段階的ロールアウト計画

| 期間 | アクション |
|---|---|
| Week 1 | ローカル開発のみ Ollama 使用、Gemini と並走比較 |
| Week 2 | フォールバック付きで本番デプロイ(`USE_OLLAMA=true` 時のみOllama) |
| Week 3 | ログ分析 → フォールバック率5%以下なら定着 |

## トラブルシュート

| 症状 | 対処 |
|---|---|
| Ollamaに繋がらない | `brew services start ollama` で起動 |
| 抽出精度が悪い | Modelfile 調整は基盤側で(`local-llm/modelfiles/`) |
| 開発機メモリ不足 | `USE_OLLAMA=false` で一時的にGemini固定 |
| 本番でエラー多発 | ログを `local-llm/logs/usage.jsonl` で確認 |

## 設計判断ログ

各設計判断の詳細は基盤側に集約されている:

- **なぜ Ollama か(LM Studio との比較)** → `local-llm/docs/decisions/001-ollama-vs-lmstudio.md`
- **なぜ Qwen2.5 3B(抽出用)か** → `local-llm/docs/decisions/002-model-selection.md`
- **なぜハイブリッド構成か** → `local-llm/docs/design.md` セクション 1-3

## ハードウェア将来計画

メモリ8GB MBA M2 での実用範囲を超えたら、`local-llm/docs/design.md` セクション 10 に基づき Mac mini M4 Pro 48GB 増設等を検討する。

---

## 実装ステータス(随時更新)

- [x] フェーズD: 基盤整備(`local-llm/` 配下の実装) — 2026-05-23 完了
  - shared-client (TDD 30/30 PASS / npm link 接続済)
  - Modelfile 3種定義 — `ollama create` はユーザー実行待ち
  - ベンチマーク基盤 (`benchmarks/extract-eval.ts`)
  - 全ドキュメント完備
- [x] フェーズA: `generateTripFromArticle` ローカル化 — 2026-05-23 完了
  - `src/lib/ai/client.ts` 追加(USE_OLLAMA 環境変数で切替)
  - `generateTripFromArticle` を `ai.complete('extract', ...)` に書き換え
  - 既存テスト含め 16/16 PASS / 型チェック OK
  - 実機テストは Ollama インストール後に `scripts/eval-ollama-extract.ts`
- [ ] フェーズB: 過去プランRAG機能
- [ ] フェーズC: ネット検索エージェント
