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
| **Phase 4** | 信頼性・リテンション・成長（分析・認証・権限・SEO・収益化） | 🔨 着手中 |

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

### インフラ
- [x] GitHub Actions による Supabase keep-alive（3日ごと定期ping）

---

## 次にやるべきこと — Phase 4 戦略

### 現状の本質的な3つの課題（Phase 1-3 で残った問題）

1. **計測できない** — Vercel Analytics 未導入。PV・離脱箇所・コンバージョン率が見えず、改善の方向性が決められない
2. **編集が無防備** — share_id を知る人は誰でも編集できる。共有先に勝手に書き換えられるリスク
3. **ユーザーが消える** — URLを失えば旅程も永遠に消える。認証もリテンションメカニズムもない

---

### 🔴 Phase 4-A: Pre-Launch Polish（リリース前の必須整備・効果大・工数小）

#### 1. Vercel Analytics 導入（工数: 30分）
**なぜ最優先か**: 計測がないと、どの施策が効いているか分からない。リリース直後から計測してデータを蓄積すべき。

実装イメージ:
- `npm i @vercel/analytics`
- `app/layout.tsx` に `<Analytics />` を追加するだけ
- 標準で PV・経路・OS・国別が Vercel ダッシュボードで見える

#### 2. 編集権限の分離（工数: 3〜4時間）
**なぜ必須か**: 現状、share_id を知る人は誰でも編集できる。LINE 等で URL をシェアした瞬間に相手も編集可能になってしまい、安心してシェアできない。

実装方針:
- `trips` テーブルに `edit_token VARCHAR(16)` 追加（既存レコードはバッチで埋める）
- 編集 URL: `/trips/[share_id]?edit=[token]`、閲覧専用 URL: `/trips/[share_id]`
- ItineraryEditor の編集機能を `editable` プロップで制御
- 閲覧モードでも「コピーして自分用に作る」は可能（既存のCopyButtonを活用）
- 作成者は両 URL を保有、シェア時は閲覧 URL のみを渡す UI に

---

### 🟠 Phase 4-B: 信頼性とリテンション暫定対応（1週間）

#### 3. localStorage「最近の旅程」（工数: 2〜3時間）
**なぜ必要か**: 認証導入前の暫定リテンション解。ブラウザに直近のshare_idを保存し、URLを失っても自分が見た旅程を辿れるようにする。

実装方針:
- 旅程ページにアクセス時に localStorage に push（最大10件）
- ヘッダーに「最近見た」ボタン追加 → ドロップダウン or 簡易ページ
- 認証導入後も補助的に残す

#### 4. エラー監視（Sentry 無料枠）（工数: 1時間）
**なぜ必要か**: 本番でAI生成失敗・API timeout が起きても今は何も分からない。

実装方針:
- Sentry の Next.js 自動セットアップ
- 無料枠（5K errors/月）で十分

#### 5. AI生成の精度改善（工数: 2〜4時間）
**なぜ必要か**: 時々スポット重複・時間矛盾を含む旅程が生成される。プロンプトを強化してから認証を入れる方が完成度が高い。

実装方針:
- 失敗ケースの収集（Sentry / Analytics から）
- プロンプトに「時間矛盾を避ける」「同一スポット重複禁止」を明示
- バリデーション関数の追加（生成後にチェックして再生成）

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

### 優先度マトリクス（Phase 4）

| 施策 | 効果 | 工数 | 優先度 |
|------|------|------|--------|
| Vercel Analytics 導入 | ◎ 改善の指針 | 極小（30分） | 🔴 即着手 |
| 編集権限の分離 | ◎ シェア時の安心 | 小（3-4h） | 🔴 即着手 |
| localStorage 「最近の旅程」 | ○ 暫定リテンション | 小（2-3h） | 🟠 早めに |
| Sentry エラー監視 | ○ 本番品質 | 極小（1h） | 🟠 早めに |
| AI 精度改善 | ○ プロダクト品質 | 中（2-4h） | 🟠 早めに |
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
│   ├── ShareButton.tsx                   # 共有リンクコピー
│   └── CopyButton.tsx                    # 旅程コピーして派生作成
├── hooks/
│   └── useIsMobile.ts                    # window.matchMedia でブレークポイント検知
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
