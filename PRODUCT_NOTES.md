# tripServiceMVP プロダクトノート

Claude Code が毎回このファイルを読み込みます。

---

## プロジェクト概要

**旅行プランAIジェネレーター** — 条件（目的地・日数・希望など）や参考URLを入力すると、AIがリアルな旅程をJSON形式で生成し、カレンダービューで可視化・編集できるWebサービス。

- **Vercel** にデプロイ済み（GitHub push で自動デプロイ）
- **スタック**: Next.js 16 App Router / TypeScript / Tailwind CSS v4 / Supabase(PostgreSQL) / Google Gemini API
- **AI モデル**: `gemini-2.5-flash-lite`（maxOutputTokens: 8192）
- **DB**: Supabase、RLS有効、`trips` テーブル（id, share_id, title, destination, duration_days, wishes, source_url, itinerary(JSONB), created_at）
- **認証**: なし（share_id による URL 共有のみ）

---

## 現在地（フェーズ進捗サマリー）

| フェーズ | 内容 | 状態 |
|---------|------|------|
| **Phase 1** | MVP（AI生成・保存・共有・URLブログ取込） | ✅完了 |
| **Phase 2** | 編集UI改善（カレンダー・地図・宿泊・自動保存・タイトル編集） | ✅完了 |
| **Phase 3** | バイラル・発見（コピー・OGP・/explore・LP強化・モダンUI） | ✅完了 |
| **Phase 4-A** | 信頼性整備（分析・編集権限分離・最近の旅程） | ✅完了 |
| **Phase 4-B** | 公開直前の整備（429ハンドリング・レート制限・Sentry・Tier 1切替） | 🔨 着手中 |
| **Phase 4-C** | 認証・マイページ（Supabase Auth） | ❌未着手 |
| **Phase 4-D** | 成長と収益化（SEO・アフィリエイト・PWA） | ❌未着手 |

### ⚠️ 現在のブロッカー
- **Gemini API の Free Tier 1日20リクエスト制限** に到達中。
- 公開運用するには [AI コスト・ライセンス](#%EF%B8%8F-ai-コストライセンスgemini-api) セクションを参照して Tier 1 切替を検討する必要がある。
- 詳細は本ドキュメント中段の専用セクションへ。

---

## 実装済み機能（完全リスト）

### 生成・保存
- [x] 統合フォーム（PlanForm）: 目的地複数・URL最大5本・人数・グループ種別・日程ピッカー
- [x] URL複数並行スクレイプ（Promise.allSettled、失敗URL無視）
- [x] 条件→AI旅程生成（gemini-2.5-flash-lite）
- [x] URLスクレイプ→AI旅程生成
- [x] AI生成中ローディングオーバーレイ（スピナー+ステップ進行+ヒント）
- [x] 旅程の自動保存（編集停止から3秒後にバックグラウンド保存・debounce）
- [x] 旅程の手動保存（Supabase PATCH・即時）

### 編集・カレンダー
- [x] Outlookスタイルカレンダービュー（固定480px・内部スクロール）
- [x] ドラッグ移動（同日/他日）+ リサイズ（cascade push）+ ドラッグゴースト
- [x] タッチドラッグ対応・モバイル1日表示（‹ 前日 / 翌日 › ナビ）
- [x] スポット色分け（観光=青/グルメ=オレンジ/移動=グレー/宿泊=紫/その他=緑）
- [x] 交通スタイル自動判定（沖縄→レンタカー、東京→電車 等）
- [x] ギャップ注釈（スポット間の空き時間を「XX分」表示・タップで移動ブロック挿入）
- [x] 移動ブロック: 発着時刻入力・ルートメモ・1分単位所要時間
- [x] Undo / Redo（days + sidebarSpots の完全 Snapshot 方式）
- [x] ズームコントロール（横ツールバーに統合）
- [x] おすすめスポットパネル（カレンダー↔双方向ドラッグ）
- [x] フリーブロックパネル（型タグをドラッグしてカレンダーに配置）
- [x] スポット詳細モーダル: 種別/所要時間/予約/リンク/メモ/発着時刻/Google Maps
- [x] 旅程タイトルのインライン編集（ダブルクリックで input 化）

### 地図・宿泊
- [x] Spot に address フィールド（AI生成・市区町村＋町名）→ Maps 検索精度向上
- [x] Google Maps リンク（日ごとの Directions URL ボタン、APIキー不要）
- [x] スポット詳細モーダル・宿泊モーダルに Google Maps iframe 埋め込み（非公式 output=embed）
- [x] カレンダー宿泊帯（列ヘッダー直下・シングルクリックでモーダル）
- [x] HotelDetailModal: 住所/CI-CO時刻/料金/予約URL/メモ/Maps

### バイラル・発見
- [x] share_id による URL 共有（ShareButton）
- [x] 旅程コピー機能（POST /api/trips/copy → 新 share_id で複製）
- [x] OGP 設定（動的 og 画像生成・Twitter/LINE プレビュー対応）
- [x] /explore ページ（旅程発見・カードグリッド・新着表示）

### LP・UI
- [x] モダンランディングページ（ヒーロー統合フォーム・指標バッジ・How it works）
- [x] Features セクション（6機能の説明）
- [x] FAQ セクション（4問・details/summary）
- [x] 最終CTA（二段ボタン）
- [x] グローバルヘッダー（backdrop-blur・グラデーションロゴ・将来のアバター用スロット）
- [x] フッター（再ナビ・サイト名）

### インフラ・分析・権限
- [x] GitHub Actions による Supabase keep-alive（3日ごと定期ping）
- [x] Vercel Analytics 導入（PV・経路・離脱トラッキング）
- [x] edit_token による編集権限の分離（閲覧URL ≠ 編集URL）
- [x] PATCH API で edit_token 検証（403 forbidden）
- [x] ItineraryEditor の読み取り専用モード（閲覧バナー + コピーCTA）
- [x] localStorage 「最近の旅程」（最大20件・owner/viewer 区別）
- [x] ヘッダーに 🕘 最近ボタン（ドロップダウン・編集可/閲覧のみバッジ）
- [x] Supabase に edit_token カラム追加（2026-05-16・マイグレーション実行済み）

---

## ⚠️ AI コスト・ライセンス（Gemini API）

### 背景（2026-05-16 時点）
公開運用中に **`429 Quota exceeded`** が発生。`gemini-2.5-flash-lite` の Free Tier 上限は **1日20リクエスト/モデル/プロジェクト** に制限されていることが判明。

### 2026年3月23日からの新料金体系
Google が `Prepaid billing system` を導入し、Tier 1 以上は **事前購入クレジット制** に変更。

| 項目 | Free Tier | Tier 1 |
|------|-----------|--------|
| 月額固定費 | $0 | $0（ただし$10の事前購入が必須） |
| 課金方式 | 無料 | 事前購入したクレジットから消費 |
| 1日リクエスト上限 | **20リクエスト/モデル** | $250/月の支出上限内で大幅緩和 |
| 無料枠の継続 | - | **❌ なし（Tier 1 では全使用がクレジット消費）** |
| クレジット最低額 | - | **$10** |
| クレジット最大保有 | - | $5,000 |
| クレジット有効期限 | - | **12ヶ月（使い切らないと失効）** |
| 後払い切替 | - | Tier 3 到達後のみ可能 |

### `gemini-2.5-flash-lite` の単価
- 入力: **$0.10 / 1M tokens**
- 出力: **$0.40 / 1M tokens**
- 1回あたり推定: 入力 2,000T + 出力 3,000T ≈ **$0.0014（約 0.21 円）**

### コスト試算
| 利用量 | 月額目安 |
|-------|---------|
| 100回/月 | ~$0.14（約 21 円） |
| 1,000回/月 | ~$1.40（約 210 円） |
| 5,000回/月 | ~$7（約 1,050 円） |
| **$10 のクレジットで何回?** | **約 7,000 回** |

### 今後の方針（3つの選択肢）

#### 選択肢A: 無料枠のまま運用（個人テスト用途）
- メリット: 完全に費用ゼロ
- デメリット: **1日20リクエストで詰む**。公開して人を呼べない
- 適用: 個人テスト・少人数にシェアする段階

#### 選択肢B: Tier 1 切替（$10 前払い） ★公開運用ならこれ
- メリット: 大幅緩和、$10 で **約7,000回** 使える（MVP数ヶ月分）
- デメリット: $10 は使い切る前提（12ヶ月失効）、月 $250 上限
- 適用: MVP公開・初期ユーザー獲得段階で最も現実的

#### 選択肢C: 認証 + ユーザー単位レート制限で運用
- メリット: 各ユーザーが個別の Free Tier 枠を持つ → 集約コスト0で運用可能（理論上）
- デメリット: 各ユーザーごとに API キー発行は非現実的。「ユーザーごとに自分の API キーを登録」させる UI が必要
- 適用: ユーザー数が増えて B でもコストが膨らんできた場合の発展案

### 推奨アクション
1. **当面（個人テスト）**: 選択肢A のまま運用、明日17時のリセットで開発継続
2. **公開直前（数週間以内）**: 選択肢B に切替、$10 前払いで運用開始
3. **コスト爆発防止策**: 429 エラーハンドリング改善 + ユーザーあたりの 1日リクエスト制限を実装
4. **長期**: 認証導入後、選択肢C（BYOK = Bring Your Own Key）も視野

### 関連公式ソース
- [Billing - Gemini API](https://ai.google.dev/gemini-api/docs/billing)
- [Rate limits - Gemini API](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Pricing](https://ai.google.dev/pricing)
- [Google blog: Gemini API costs control](https://blog.google/innovation-and-ai/technology/developers-tools/more-control-over-gemini-api-costs/)

---

## 次にやるべきこと — Phase 4 戦略

### Phase 4-A の3課題は解決済み（2026-05-16）

1. ~~計測できない~~ → ✅ Vercel Analytics 導入
2. ~~編集が無防備~~ → ✅ edit_token による権限分離（要 SQL マイグレーション実行）
3. ~~ユーザーが消える~~ → ✅ localStorage「最近の旅程」（暫定リテンション）

### 🟠 Phase 4-B: 公開直前の整備（1週間）

#### 1. 429 エラーハンドリング改善（工数: 30分）★最優先
**なぜ必要か**: Gemini API の `429 Quota exceeded` が発生した時、現状は生のエラーメッセージが表示される。ユーザーに分かりやすいメッセージに変換する。

実装方針:
- `/api/plan` `/api/generate` `/api/scrape` で 429 を検知
- レスポンスを 「AI生成のリクエスト上限に達しました。少し時間をおいて再試行してください」に変換
- フロント側でも 429 専用のメッセージ表示

#### 2. エラー監視（Sentry 無料枠）（工数: 1時間）
**なぜ必要か**: 本番でAI生成失敗・API timeout が起きても今は何も分からない。Vercel Analytics は PV メインで例外通知は弱い。

実装方針:
- Sentry の Next.js 自動セットアップ（`npx @sentry/wizard@latest -i nextjs`）
- 無料枠（5K errors/月）で十分

#### 3. ユーザーあたりレート制限（工数: 2〜3時間）
**なぜ必要か**: Tier 1 切替後にコスト爆発を防ぐ。1人が大量に生成して $10 を使い切るのを抑止。

実装方針:
- localStorage または IP ベースで「1日 N 回まで」を実装
- IP は信頼性低いので、cookie + localStorage の併用
- 認証導入後はユーザー単位に切替

#### 4. AI生成の精度改善（工数: 2〜4時間）
**なぜ必要か**: 時々スポット重複・時間矛盾を含む旅程が生成される。プロンプトを強化してから認証を入れる方が完成度が高い。

実装方針:
- 失敗ケースの収集（Sentry / Analytics から）
- プロンプトに「時間矛盾を避ける」「同一スポット重複禁止」を明示
- バリデーション関数の追加（生成後にチェックして再生成）

#### 5. Gemini Tier 1 切替判断（工数: 5分 + $10）
公開運用を開始する直前に [選択肢B](#選択肢b-tier-1-切替10-前払い-公開運用ならこれ) で $10 前払いに切り替える。
タイミングは「ユーザーあたりレート制限」と「429ハンドリング」が入った後。

---

### 🟢 Phase 4-C: 認証とマイページ（2〜3日）

#### 6. Supabase Auth 導入（メール magic link）（工数: 1〜2日）
- DB: `trips.user_id UUID NULL` を追加（NULL = ゲスト）
- ヘッダーに「ログイン」ボタン、ログイン後はアバターに切替
- 既存のゲスト旅程はそのまま残す（user_id NULL のまま）
- ログイン中に旅程作成 → 自動で user_id 紐付け

#### 7. /me ダッシュボード（工数: 半日）
- 自分の旅程一覧（最新順）
- 削除機能（ソフトデリート: `deleted_at`）
- /explore からの公開制御（is_public）

---

### 🟡 Phase 4-D: 成長と収益化（中期）

#### 8. SEOページ自動生成（工数: 1〜2日）
- `/plans/[destination]/[duration]` を SSG で生成
- 「沖縄 2泊3日 モデルコース」のキーワード狙い
- AI生成済みの公開旅程を埋め込み
- 内部リンクから旅程生成フォームへ誘導

#### 9. アフィリエイト統合（工数: 数時間〜）
- HotelDetailModal に「じゃらんで探す」「楽天トラベルで探す」ボタン
- ホテル名＋目的地をパラメータに渡すアフィリエイトリンク
- 実装コスト低・期待収益はユーザー数に比例

#### 10. PWA化（工数: 半日）
- `manifest.json` + service worker
- インストール可能なWebアプリに
- オフライン対応（読み取り専用キャッシュ）

---

### ❌ 今は絶対にやらないこと

- 決済・サブスクの内製実装（ユーザーが集まってから）
- ネイティブアプリ化（PWA で十分）
- 多言語対応（まず日本人ユーザーを掴む）
- AI精度の完璧化（80点で十分、ユーザー編集で補う）
- リアルタイム共同編集（複雑すぎる、需要を確認してから）
- LINE Bot / Slack 連携（後回し）

---

### 優先度マトリクス（Phase 4 残り）

| 施策 | 効果 | 工数 | 優先度 |
|------|------|------|--------|
| ✅ Vercel Analytics 導入 | ◎ 改善の指針 | 極小（30分） | 完了 |
| ✅ 編集権限の分離 + DB 移行 | ◎ シェア時の安心 | 小（3-4h） | 完了 |
| ✅ localStorage 「最近の旅程」 | ○ 暫定リテンション | 小（2-3h） | 完了 |
| 429 エラーハンドリング | ◎ UX劇的改善 | 極小（30分） | 🔴 即着手 |
| ユーザーあたりレート制限 | ◎ Tier 1 切替前提 | 中（2-3h） | 🔴 公開前必須 |
| Sentry エラー監視 | ○ 本番品質 | 極小（1h） | 🟠 早めに |
| AI 精度改善 | ○ プロダクト品質 | 中（2-4h） | 🟠 早めに |
| Gemini Tier 1 切替 ($10) | ◎ 公開可能化 | 5分 + $10 | 🟠 公開直前 |
| Supabase Auth | ◎ 本質的リテンション | 大（1-2d） | 🟢 中期 |
| /me ダッシュボード | ◎ 認証の受け皿 | 中（0.5d） | 🟢 中期（認証とセット） |
| SEOページ | ◎ 流入獲得 | 大（1-2d） | 🟡 中長期 |
| アフィリエイト | ○ 収益化 | 小（数時間） | 🟡 中長期 |
| PWA化 | ○ 体験向上 | 中（0.5d） | 🟡 中長期 |

---

## 地図機能ロードマップ

### Step 1（実装済み）: Google Maps URL ボタン
- `?api=1&origin=...&destination=...&waypoints=...` 形式。APIキー不要
- `spot.address`（AI生成住所）があればスポット名＋住所で精度向上

### Step 2（実装済み）: スポット詳細・宿泊モーダル内 Google Maps 埋め込み
- `maps.google.com/maps?q=...&output=embed` の非公式 iframe。APIキー不要・完全無料
- リスク: 非公式のため Google 側の変更で壊れる可能性あり

#### Google Maps 埋め込み方式の比較
| 方式 | 費用 | APIキー | 安定性 |
|------|------|---------|--------|
| 非公式 iframe（現採用） | 完全無料 | 不要 | △ 非公式 |
| Google Maps Embed API | 月28,000回まで無料 | 必要（クレカ登録） | ○ 公式 |
| OpenStreetMap iframe | 完全無料 | 不要 | ○ 公式 |

### Step 3（未着手）: アプリ内ルート地図（Leaflet + Nominatim）
- react-leaflet + Nominatim（OSM無料API）でアプリ内にピン＋矢印マップ
- レート制限 1req/秒、User-Agentヘッダー必須
- 旅程ページに「地図タブ」として追加予定

---

## ファイル構成と役割

```
src/
├── app/
│   ├── page.tsx                          # トップページ（ヒーロー統合フォーム・LP）
│   ├── layout.tsx                        # 共通レイアウト（ヘッダー・フッター・OGPベース）
│   ├── globals.css                       # グローバルCSS・アニメーション
│   ├── loading.tsx                       # スケルトンローディング
│   ├── not-found.tsx                     # 404
│   ├── explore/page.tsx                  # /explore 旅程発見ページ
│   ├── trips/page.tsx                    # /trips → /explore へリダイレクト
│   ├── trips/[id]/page.tsx               # 旅程詳細ページ（OGP動的設定）
│   ├── trips/[id]/opengraph-image.tsx    # 動的 OG 画像生成（1200×630）
│   ├── trips/[id]/loading.tsx            # 旅程詳細ロード中
│   └── api/
│       ├── plan/route.ts                 # POST: 統合フォーム→並行スクレイプ→AI生成→保存
│       ├── generate/route.ts             # POST: 条件→AI生成
│       ├── scrape/route.ts               # POST: URL→スクレイプ→AI生成
│       ├── trips/[share_id]/route.ts     # GET/PATCH: 旅程取得・保存（title対応）
│       └── trips/copy/route.ts           # POST: 旅程コピー（新 share_id 発行）
├── components/trips/
│   ├── PlanForm.tsx                      # ★統合フォーム
│   ├── GeneratingOverlay.tsx             # AI生成中フルスクリーンオーバーレイ
│   ├── DatePicker.tsx                    # 航空会社スタイル日程ピッカー
│   ├── ItineraryEditor.tsx               # 旅程詳細画面の親（自動保存・タイトル編集も）
│   ├── CalendarView.tsx                  # ★Outlookスタイルカレンダー（最重要）
│   ├── SuggestedSpotsPanel.tsx           # おすすめスポットサイドパネル
│   ├── FreeBlocksPanel.tsx               # フリーブロックパネル
│   ├── SpotDetailModal.tsx               # スポット詳細モーダル
│   ├── HotelDetailModal.tsx              # 宿泊詳細モーダル
│   ├── TripCard.tsx                      # 旅程カード（/・/explore で共用）
│   ├── ShareButton.tsx                   # 共有リンクコピー（閲覧URLのみ）
│   ├── CopyButton.tsx                    # 旅程コピーして派生作成（edit_token付きURLへ遷移）
│   ├── TripViewTracker.tsx               # 閲覧履歴をlocalStorageに保存（マウント時）
│   └── RecentTripsButton.tsx             # ヘッダー🕘最近ボタン（ドロップダウン）
├── hooks/
│   ├── useIsMobile.ts                    # window.matchMedia でブレークポイント検知
│   └── useRecentTrips.ts                 # localStorageベース「最近の旅程」フック
├── lib/
│   ├── ai/gemini.ts                      # Gemini API ラッパー
│   ├── db/trips.ts                       # Supabase CRUD（copyTrip 含む）
│   ├── db/supabase.ts                    # Supabase クライアント
│   ├── destinationEmoji.ts               # 目的地→絵文字マップ（40件以上）
│   └── scraper/index.ts                  # URL→本文テキスト抽出
└── types/index.ts                        # 全型定義
```

---

## CalendarView の設計（重要）

**ファイル**: `src/components/trips/CalendarView.tsx`

### 表示
- グリッド: **6〜24時**、高さ **固定 480px**（内部スクロール）
- 外側に `isolation: 'isolate'`（ドラッグ中 z-index 漏れ防止）
- `BASE_PPM = 1.0`（1分=1px 基準）、実 ppm = `BASE_PPM * zoom`
- 初期スクロール: コンテンツ開始時刻の 1時間前
- **モバイル**: `mobileDayIdx` で1日表示、‹ 前日 / 翌日 › ナビ
- **宿泊帯**: 列ヘッダー直下に配置。シングルクリックで HotelDetailModal を開く

### ドラッグ操作
- `DRAG_THRESHOLD = 5px`（mousedown からこの距離以上でドラッグ判定）
- `e.detail > 1` 早期リターン（dblclick 保護）
- タッチ対応: `touchmove`（`{ passive: false }` + `e.preventDefault()`）
- ダブルタップ: `lastTapRef`（300ms 以内の同一スポット2タップ → SpotDetailModal）
- リサイズ: 上端/下端ドラッグ + `applyResize()` で cascade push

---

## ItineraryEditor の重要な設計

### 自動保存
- 編集（handleUpdateDays / handleUpdateBoth / commitTitle）のたびに `scheduleAutoSave()` を呼ぶ
- `scheduleAutoSave` は 3秒のdebounceタイマーをセット
- `saveToDbRef` 経由で常に最新の `saveToDb`（最新state参照）を呼ぶ
- アンマウント時にタイマークリア
- 手動「保存」ボタンは即時実行（debounce無視）

### タイトル編集
- `editingTitle` state でモード切替（h1 ↔ input）
- ダブルクリックで編集モード、Enter / blur で確定、Escape でキャンセル
- 確定時に `setSaveStatus('unsaved')` → 自動保存トリガー
- PATCH /api/trips/[share_id] に `title` も含めて送信

---

## SpotDetailModal の設計

### 状態モデル（移動ブロックの発着時刻）
- `depTime`: state（HH:MM）、`arrTime`: state（HH:MM）
- `duration`: **derived**（`Math.max(1, arrTime分 - depTime分)`）

### 編集ルール
- 発を編集 → 着は固定・所要時間が変わる
- 着を編集 → 発は固定・所要時間が変わる
- 所要時間を編集 → 発は固定・着が変わる

---

## HotelDetailModal の設計

**ファイル**: `src/components/trips/HotelDetailModal.tsx`

### フィールド
| フィールド | 型 | 備考 |
|-----------|-----|------|
| name | string（必須） | 保存ボタンは name が空だと無効化 |
| address | string? | Google Maps 検索精度向上 |
| check_in | string? | "HH:MM" 形式 |
| check_out | string? | "HH:MM" 形式 |
| price_per_night | number? | 円 |
| booking_confirmed | boolean? | チェックボックス |
| booking_url | string? | 入力後「予約ページを開く →」リンク表示 |
| memo | string? | 自由記述（駐車場・朝食・アクセスなど） |

- Google Maps iframe 埋め込みあり（name 入力後に表示）
- 削除ボタン（既存ホテルのみ）
- HotelInfo は `ItineraryDay.hotel` に格納（itinerary JSONB内）

---

## OGP 設定

### 共通メタデータ（layout.tsx）
- `metadataBase`: `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL` から自動解決
- `openGraph.siteName`: "旅程ジェネレーター"、`locale`: "ja_JP"
- `twitter.card`: "summary_large_image"

### 旅程ごとのOG画像（trips/[id]/opengraph-image.tsx）
- Next.js 組み込み `ImageResponse`（Satori ベース）で生成
- サイズ: 1200×630、ランタイム: nodejs
- デザイン: 青グラデーション背景・旅程タイトル・目的地・日数
- 自動でメタタグに反映される（明示指定不要）

---

## 編集権限の設計（重要）

### 概念
- 閲覧URL: `/trips/[share_id]` — 誰でもアクセス可・編集不可
- 編集URL: `/trips/[share_id]?edit=[edit_token]` — トークン一致で編集可
- 編集トークン: ランダム32文字、`trips.edit_token` カラムに保存（NULL = レガシー、コードレベルで誰でも編集可）

### 検証経路
1. **クライアント**: TripPage が `searchParams.edit` を読み取り、`trip.edit_token` と一致するなら `editable=true`
2. **サーバー**: PATCH /api/trips/[share_id] が body の `edit_token` を `getTripByShareId` の結果と照合、不一致なら 403
3. **読み取り防止**: GET API は `edit_token` をレスポンスから除外（漏洩防止）

### ItineraryEditor の振る舞い
- `editable={false}` 時: 閲覧モードバナー表示 + Copy/Share のみ
- ツールバーの編集系（undo/redo/保存）非表示
- サイドバー（SuggestedSpots/FreeBlocks）非表示
- CalendarView の編集コールバックを undefined に
- タイトル h1 のダブルクリック編集を無効化

### 新規旅程の作成フロー
1. POST /api/plan or /generate or /scrape → `{share_id, edit_token}` を返す
2. クライアントは `/trips/{share_id}?edit={edit_token}` へ遷移
3. TripViewTracker が localStorage に owner として記録
4. シェア時は ShareButton が読み取り専用URL `/trips/{share_id}` をコピー

### マイグレーション
`docs/migrations/001_add_edit_token.sql` を Supabase Dashboard で実行する。
既存旅程は `edit_token IS NULL` のまま誰でも編集可（後方互換）、強化したい場合は UPDATE 文をコメント解除。

---

## localStorage 「最近の旅程」の設計

- キー: `tripgen.recentTrips.v1`、最大20件
- フォーマット: `RecentTrip[]`（share_id・title・destination・duration_days・role・edit_token?・accessed_at）
- `role`: `'owner'`（自分が作成 or コピー）= edit_token を保存、`'viewer'`（閲覧のみ）= edit_token なし
- 既存の owner レコードを viewer で上書きしない（owner 優先）
- ヘッダー🕘最近ボタンで開閉、外クリック・Escape で閉じる

---

## API の重要仕様

### エラーハンドリング（必須）
Vercel timeout 時にプレーンテキストが返るため `res.json()` は**使わない**:
```typescript
const text = await res.text()
try { data = JSON.parse(text) } catch { throw new Error(`サーバーエラー: ${text.slice(0, 120)}`) }
```

### タイムアウト対策
- APIルートに `export const maxDuration = 60`

### フォームボタンの必須ルール
- `type="button"` + `onClick` のみ（`type="submit"` 禁止）

---

## 移動ブロックの設計方針

スポットを動かすと隣接の移動ブロックが意味をなさなくなる問題から、**ギャップ注釈方式を採用**。

- AI はスポット間に空き時間を設けるだけ（移動ブロック非生成）
- カレンダー上の空き時間を「XX分」ラベルで表示
- ユーザーが手動でフリーブロックパネルから配置 or ギャップタップで挿入
- 移動ブロックは1分単位・発着時刻入力対応・ルートメモ欄あり

---

## 技術メモ（Claude 向け）

- **Next.js params**: `params: Promise<{ id: string }>` → `const { id } = await params`
- **Tailwind v4**: 設定ファイル不要。**重要なレイアウトは inline styles**（flexbox 崩れ防止）
- **itinerary の型**: `{ days, trip_style?, trip_style_reason?, start_date?, sidebar_spots? }`
- **hotel の格納場所**: `itinerary.days[i].hotel`（JSONB内・DB スキーマ変更不要）
- **CalendarView PPM**: `BASE_PPM = 1.0`。ppm = BASE_PPM * zoom
- **isolation: isolate**: CalendarView 外側ラッパーに必須
- **overscroll-behavior: contain**: カレンダースクロールコンテナに必須
- **useIsMobile**: SSR では `false`、クライアントマウント後に `window.matchMedia` で判定
- **Google Maps 埋め込み**: `maps.google.com/maps?q=...&output=embed`（非公式・無料）
- **ISR**: `/` と `/explore` は `export const revalidate = 60`（1分キャッシュ）
- **OG画像**: `runtime = 'nodejs'`（edge runtime で Supabase Node SDK が動かない場合あり）
- **details/summary**: globals.css でデフォルトマーカー非表示、`.faq-toggle` で ＋/− 切替
