# tripServiceMVP プロダクトノート

Claude Code が毎回このファイルを読み込みます。
気づいたこと・やりたいことを自由に書いてください。

---

## プロジェクト概要

**旅行プランAIジェネレーター** — 条件（目的地・日数・希望など）や参考URLを入力すると、AIがリアルな旅程をJSON形式で生成し、カレンダービューで可視化・編集できるWebサービス。

- **Vercel** にデプロイ済み（GitHub push で自動デプロイ）
- **スタック**: Next.js 15 App Router / TypeScript / Tailwind CSS v4 / Supabase(PostgreSQL) / Google Gemini API
- **AI モデル**: `gemini-2.5-flash-lite`（maxOutputTokens: 8192）
- **DB**: Supabase、RLS有効、`trips` テーブル（id, share_id, title, destination, duration_days, wishes, source_url, itinerary(JSONB), created_at）
- **認証**: なし（share_id による URL 共有のみ）

---

## ファイル構成と役割

```
src/
├── app/
│   ├── page.tsx                  # トップページ（PlanFormを内包する単一カード）
│   ├── layout.tsx                # 共通レイアウト（ヘッダーのみ、フッターなし）
│   ├── trips/[id]/page.tsx       # 旅程詳細ページ（async params: Promise<{id}>）
│   └── api/
│       ├── plan/route.ts         # POST: 統合フォーム→並行スクレイプ→AI生成→保存（maxDuration=60）
│       ├── generate/route.ts     # POST: 条件→AI生成→保存（旧API、現在は使っていない）
│       ├── scrape/route.ts       # POST: URL→スクレイプ→AI生成→保存（旧API、現在は使っていない）
│       └── trips/[id]/route.ts   # PATCH: 旅程を手動保存
├── components/trips/
│   ├── PlanForm.tsx              # ★統合フォーム（目的地複数/日数/日程/出発地/人数/グループ種別/希望/URL最大5本）
│   ├── GenerateForm.tsx          # 旧: 条件入力フォーム（現在はトップページで使っていない）
│   ├── UrlForm.tsx               # 旧: URL入力フォーム（現在はトップページで使っていない）
│   ├── DatePicker.tsx            # 航空会社スタイル日程ピッカー（2ヶ月カレンダー）
│   ├── ItineraryEditor.tsx       # 旅程詳細画面（undo/redo/zoom制御 + CalendarView + ShareButton）
│   ├── CalendarView.tsx          # ★Outlookスタイルカレンダー（最重要コンポーネント）
│   ├── SpotCard.tsx              # 旅程のしおり表示（ItineraryEditorの上部）
│   └── ShareButton.tsx           # 共有リンクコピーボタン
├── lib/
│   ├── ai/gemini.ts              # Gemini API ラッパー（buildPlanPrompt / generateTripFromPlan 等）
│   ├── db/trips.ts               # Supabase CRUD
│   └── scraper.ts                # URL→本文テキスト抽出（cheerio使用）
└── types/index.ts                # 型定義（Trip, Itinerary, Spot, PlanInput, GroupType 等）
```

---

## CalendarView の設計（重要）

**ファイル**: `src/components/trips/CalendarView.tsx`

### 表示
- グリッドは常に **6〜24時** を描画（`GRID_START=6`, `GRID_END=24`）
- 高さ: `clamp(320px, calc(100vh - 540px), 440px)`（固定。内部スクロール方式）
- `overflow: auto`, `overscrollBehavior: 'contain'`（ページへのスクロール連鎖を防止）
- 外側ラッパーに `isolation: 'isolate'`（ドラッグ時のz-indexがページ要素に漏れないよう隔離）
- `BASE_PPM = 1.0`（1分 = 1px の基準値。dynamicなfitPpmは廃止）
- 実際の ppm = `BASE_PPM * zoom`（zoom は ItineraryEditor から props で受け取る）
- 初期スクロール位置: マウント時にコンテンツ開始時刻の 1時間前に自動スクロール

### ドラッグ操作
- **同一日 move**: 移動したブロックのみ動く。重なりが出る場合のみ後続を cascade push
- **他日 move**: 移動元から削除、移動先に挿入（重なるブロックを cascade push）
- **リサイズ**: 上端/下端ドラッグで時刻変更 + `applyResize()` で隣接ブロックを cascade push

### applyResize()（リサイズ時のcascade push）
- 上端を縮小 → 先行ブロックを上に押し上げ
- 下端を拡大 → 後続ブロックを下に押し下げ
- `findIndex(s => s === newSpot)`（参照等価）でリサイズ対象を特定

### Props
- `days: ItineraryDay[]`
- `onUpdateDays: (days: ItineraryDay[]) => void`
- `zoom: number`（ItineraryEditor側で管理）
- `startDate?: string`（ISO date, e.g. "2026-05-05"）

---

## ItineraryEditor の設計

**ファイル**: `src/components/trips/ItineraryEditor.tsx`

### 状態
- `days`: 現在の旅程
- `history: ItineraryDay[][]`: undoスタック（handleUpdateDays呼び出し時に積む）
- `redoStack: ItineraryDay[][]`: redoスタック（undoした内容を積む）
- `zoom: number`: カレンダーのズーム倍率（ZOOM_MAX=3.0, ZOOM_STEP=0.2）
- `saveStatus: 'idle' | 'saving' | 'saved' | 'error'`

### ツールバー（横一列・inline styles）
左から順に: [↩ 戻す] [↪ 進む] | 縦軸ラベル [−][バー][+] | spacer | [保存状態] [保存ボタン]

---

## 統合フォーム（PlanForm）の仕様

**ファイル**: `src/components/trips/PlanForm.tsx`

### 入力フィールド
| フィールド | 必須 | 説明 |
|-----------|------|------|
| 目的地 | ✅ | 複数追加可。タグ形式で表示、×で削除、Enterキーで追加 |
| 旅行期間 | ✅ | 1〜14日間のステッパー |
| 旅行日程 | - | DatePickerコンポーネント（2ヶ月カレンダー） |
| 出発地 | - | テキスト入力（例: 東京） |
| 大人/子供の人数 | - | Counterコンポーネント（大人min=1, 子供min=0, max=20） |
| グループ種別 | - | 友人/家族/カップル/その他 のトグルボタン |
| やりたいこと | - | テキストエリア |
| 参考URL | - | 最大5本。1本ずつ入力欄を追加 |

### 送信フロー
1. `POST /api/plan` に `PlanInput` を送信
2. API側: URLを `Promise.allSettled()` で並行スクレイプ（失敗URLは無視）
3. `generateTripFromPlan(body, articleTexts)` でGemini生成
4. Supabaseに保存 → `share_id` を受け取り `/trips/[share_id]` に遷移

---

## API の重要仕様

### エラーハンドリング（必須）
Vercel timeout 時にプレーンテキストが返るため `res.json()` は**使わない**:
```typescript
const text = await res.text()
let data: { share_id?: string; error?: string }
try { data = JSON.parse(text) } catch { throw new Error(`サーバーエラー: ${text.slice(0, 120)}`) }
```

### タイムアウト対策
- APIルートに `export const maxDuration = 60`
- プロンプトを短くすることでGeminiの応答を高速化

### フォームボタンの必須ルール
- `type="button"` + `onClick` のみ（`type="submit"` 禁止）
- Enterキーによる意図しない送信を防止するため

---

## 実装済み機能

- [x] 統合フォーム（PlanForm）: 目的地複数・URL最大5本・人数・グループ種別など
- [x] URL複数並行スクレイプ（Promise.allSettled、失敗URL無視）
- [x] 条件→AI旅程生成（gemini-2.5-flash-lite）
- [x] URLスクレイプ→AI旅程生成
- [x] 日程ピッカー（生成時に設定 → カレンダーに日付表示）
- [x] Outlookスタイルカレンダービュー（固定高さ・内部スクロール）
- [x] ドラッグ移動（同日/他日）+ リサイズ（cascade push）
- [x] スポット色分け（観光=青/グルメ=オレンジ/移動=グレー/宿泊=紫）
- [x] 移動スポットに交通手段表示（推奨・代替）
- [x] 交通スタイル自動判定（沖縄→レンタカー、東京→電車 等）
- [x] Undo / Redo（↩ 戻す / ↪ 進む）
- [x] ズームコントロール（横ツールバーに統合）
- [x] 旅程の手動保存（Supabase PATCH）
- [x] share_id による URL 共有（ShareButton）
- [x] カレンダーのz-index隔離（isolation: isolate）
- [x] 内部スクロール（overscroll-behavior: contain で連鎖防止）

---

## 未実装・今後のアイデア（優先度順）

### 優先度 B: カレンダー右側パネル
- カレンダー左3/4、右1/8にURLから読んだスポットブロック、最右1/8にフリーブロック
- フリーブロックはドラッグ&ドロップでカレンダーに挿入可能（消費されず使い回し可）
- URLスポットが時系列なら旅程に組み込み、そうでなければ右パネルに縦並び

### 優先度 A: ブロック詳細パネル
- カレンダーブロックをクリック/ダブルクリックで詳細サイドパネルを表示
- 内容: スケジュール情報・予約要否・予約済みチェックボックス・公式/食べログリンク・メモテキストボックス
- リンクはAI自動取得を目指す（Gemini APIの制限次第）

### 優先度 D: Todoリスト
- カレンダー上部にTodoリスト
- 予約必要スポットの予約チェック・海外ビザ取得チェック等
- +ボタンでユーザー追加、削除ボタンあり

### 優先度 E: 日程カラム拡張
- 各日カラムの「○日目」ラベルとカレンダーグリッドの間に2行挿入
  - 1行目: その日のテーマ（旅程のメイン）
  - 2行目: 宿泊先名（最終日または日帰りは空白）

### 優先度: 低
- スクレイピング精度の改善（じゃらん/るるぶ/アメブロ対応）
- スポット追加・削除UI（カレンダー上でのダブルクリック等）
- 印刷・PDF出力
- 旅程のコピー（1日目を複製等）
- 共同編集機能
- お気に入り保存

---

## 技術メモ（Claude 向け）

- **Next.js params**: `params: Promise<{ id: string }>` → `const { id } = await params`
- **Tailwind**: v4系（設定ファイル不要、CSS import方式）。ただしレイアウト崩れが発生しやすいため、**重要なレイアウトはinline stylesで書く**（特にflexbox系）
- **Supabase型**: `src/types/index.ts` の `Trip` がDBの行に対応
- **itinerary の型**: `Itinerary { days, trip_style?, trip_style_reason?, start_date? }`
- **start_date**: DBの別カラムではなくitinerary JSONB内に格納
- **TransportMode / TripStyle / GroupType / PlanInput**: `src/types/index.ts` に定義済み
- **CalendarViewのPPM**: `BASE_PPM = 1.0`（dynamic fitPpmは廃止済み）。ppm = BASE_PPM * zoom
- **isolation: isolate**: CalendarView外側ラッパーに必須（ドラッグ中z-index:200のブロックがページ要素に被らないよう隔離）
- **overscroll-behavior: contain**: カレンダースクロールコンテナに必須（ページへのスクロール連鎖防止）
