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

## 現在地（フェーズ進捗サマリー）

| フェーズ | 内容 | 状態 |
|---------|------|------|
| **Phase 1** | MVP（AI生成・保存・共有・URLブログ取込） | ✅完了 |
| **Phase 2** | 初期改善（編集UI・地図・公開設定・一覧） | 🔨編集UI完了・地図URLボタン追加済み、他は未着手 |
| **Phase 3** | バイラル・SEO強化 | ❌未着手 |
| **Phase 4〜8** | UX強化・収益化・拡張 | ❌未着手 |

---

## フェーズ別ロードマップ

### Phase 1：MVP ✅完了

| 機能 | 状態 | 備考 |
|------|------|------|
| AIによる旅行プラン自動生成（条件入力） | ✅ | PlanForm → /api/plan → Gemini |
| 移動時間を考慮したスケジュール生成 | ✅ | ギャップ注釈方式に変更（移動ブロック非生成） |
| 生成した旅程の保存機能 | ✅ | Supabase PATCH、手動保存ボタン |
| 旅程の共有URL発行 | ✅ | share_id、ツールバーのShareButton |
| URLを貼るだけでブログ記事から旅程生成 ★ | ✅ | cheerio スクレイプ → Gemini |
| スマホ対応 | ✅ | シングルデイ表示・タッチドラッグ・縦レイアウト |

### Phase 2：初期改善 🔨進行中

| 機能 | 状態 | 備考 |
|------|------|------|
| 旅程の編集（ドラッグ&ドロップ・時間変更） | ✅ | CalendarView + SuggestedSpotsPanel + FreeBlocksPanel |
| スポット詳細編集（ダブルクリック） | ✅ | SpotDetailModal（種別/所要時間/予約/リンク/メモ） |
| 移動ブロック強化 | ✅ | 発着時刻・ルートメモ・ギャップタップで自動挿入 |
| Google Mapsリンク（URLボタン方式） | ✅ | 日ごとのDirections URLを生成してタブで開く |
| 地図表示（アプリ内埋め込み） | ❌ | Leaflet.js + Nominatim で将来実装予定（下記参照） |
| 観光地情報の自動補完（説明・画像） | ❌ | Gemini で説明文は生成済み。画像は未対応 |
| 旅行プランの公開/非公開設定 | ❌ | 認証導入が前提 |
| 他ユーザーの旅程閲覧（一覧ページ） | ❌ | `/explore` 的なページ |

### Phase 3：バイラル・SEO強化 ❌未着手

- 旅程のテンプレート化（「沖縄3日間モデルコース」等）
- 人気プランランキング
- タグ機能（カップル・グルメ・温泉など）
- 旅行プランのコピー機能（他人の旅程をそのまま使える）
- SEO用ページ自動生成（「○○ 2泊3日 モデルコース」）

### Phase 4：UX強化 ❌未着手

- チェックリスト自動生成（持ち物・やること）
- しおり（PDF）自動生成
- 日ごとのToDo管理機能
- オフライン閲覧対応（簡易）

### Phase 5：軽い収益化 ❌未着手

- 高度AI機能を有料化（細かい条件指定・複数プラン提案）
- 一部テンプレートを有料化
- 広告導入（軽め）

### Phase 6：本格収益化（最重要） ❌未着手

- ホテル・航空券のアフィリエイト導線
- 体験予約（ツアー・アクティビティ）への送客
- 旅程内に予約リンクを自動挿入（AIで自然に組み込む）
- 「このプランをそのまま予約」ボタン

### Phase 7：差別化・拡張 ❌未着手

- AIチャット型旅行相談機能
- 予算最適化（最安日程提案）
- 同行者との共同編集機能
- 旅行履歴の蓄積・レコメンド
- LINE連携（日本向けに強い）

### Phase 8：上級機能 ❌後回しでOK

- 予約メール自動解析
- ビザ・必要書類チェック
- 完全アプリ化（iOS/Android）

### やらないこと・後回し

- 最初から予約決済を内製する
- 完璧なUI/デザインを目指す（MVP精神を維持）
- 多機能化しすぎる
- グローバル展開（まず日本特化）

---

## 次に取り組むべきこと（提案）

### 🟠 Phase 2 残り（優先度順）
1. **アプリ内地図表示（Leaflet）** — Google Maps URL ボタンで使い勝手確認後に着手。下記「地図ロードマップ」参照。
2. **旅程一覧ページ（/explore）** — 認証なしで公開旅程だけ表示するシンプルな実装から。SEO効果もある。
3. **スポット画像** — Unsplash/Pexels の無料API でスポット名検索 → サムネイル表示。

### 🟡 その後（Phase 3 入口）
4. **旅程のコピー機能** — 「このプランをベースに作る」ボタン。バイラル効果大。
5. **公開/非公開設定** — 認証（NextAuth or Supabase Auth）を入れるタイミング。

---

## 地図機能ロードマップ

### Step 1（実装済み）: Google Maps URL ボタン
- **場所**: ItineraryEditor のカレンダー上部に横並びの日ごとリンク
- **仕組み**: `?api=1&origin=...&destination=...&waypoints=...` 形式の Directions URL をタブで開く
- **APIキー**: 不要
- **スポット精度**: `spot.address`（AI生成住所）があればスポット名＋住所、なければスポット名＋目的地でフォールバック
- **制限**: 移動ブロックはURLから除外

### Step 2（実装済み）: スポット詳細モーダル内 Google Maps 埋め込み
- **場所**: SpotDetailModal のメモ欄下（移動ブロックは非表示）
- **仕組み**: `https://maps.google.com/maps?q=スポット名+住所&output=embed&hl=ja&z=16` を iframe で埋め込み
- **APIキー**: **不要**（非公式 `output=embed` 方式）
- **費用**: **完全無料**
- **リスク**: Google が仕様変更した場合に動作しなくなる可能性あり（非公式）
- **精度**: `spot.address` があればスポット名＋住所、なければスポット名のみ

#### Google Maps 埋め込み方式の比較（参考）
| 方式 | 費用 | APIキー | 安定性 | 現状 |
|------|------|---------|--------|------|
| 非公式 iframe（`output=embed`） | 完全無料 | 不要 | △ 非公式 | ✅ 採用中 |
| Google Maps Embed API | 無料枠（月28,000回） | 必要（クレカ登録） | ○ 公式 | 将来移行候補 |
| OpenStreetMap iframe | 完全無料 | 不要 | ○ 公式 | Google Maps より見た目が地味 |

### Step 3（未着手）: アプリ内ルート地図（Leaflet + Nominatim）
- **目的**: 旅行中の移動フロー（ピン＋矢印）をアプリ内で可視化
- **ライブラリ**: `leaflet` + `react-leaflet`（OSS、APIキー不要）
- **ジオコーディング**: Nominatim（OpenStreetMap無料API）でスポット名→緯度経度変換
  - レート制限: 1リクエスト/秒、User-Agentヘッダー必須
  - 日本語スポット名の精度: やや不安定（`spot.address` を活用すると改善）
- **表示内容**: ピン（スポット）＋矢印（移動順序）、日ごとタブ切替
- **実装場所案**: 旅程ページに「地図タブ」を追加するか、カレンダー下部に折りたたみ表示

### Step 4（将来）: Google Maps JavaScript API（要APIキー）
- 精度が最優先になったタイミングで移行
- 無料枠: $200/月（中規模まで無料で使える）

---

## ファイル構成と役割

```
src/
├── app/
│   ├── page.tsx                  # トップページ（PlanFormを内包する単一カード）
│   ├── layout.tsx                # 共通レイアウト（ヘッダーのみ、フッターなし）
│   ├── loading.tsx               # ページレベルのスケルトンローディング
│   ├── trips/[id]/page.tsx       # 旅程詳細ページ（async params: Promise<{id}>）
│   └── api/
│       ├── plan/route.ts         # POST: 統合フォーム→並行スクレイプ→AI生成→保存（maxDuration=60）
│       ├── generate/route.ts     # POST: 条件→AI生成→保存（現在はトップから呼ばれていない）
│       ├── scrape/route.ts       # POST: URL→スクレイプ→AI生成→保存（現在はトップから呼ばれていない）
│       └── trips/[id]/route.ts   # PATCH: 旅程を手動保存
├── components/trips/
│   ├── PlanForm.tsx              # ★統合フォーム（目的地複数/日数/日程/出発地/人数/グループ種別/希望/URL最大5本）
│   ├── GenerateForm.tsx          # 旧: 条件入力フォーム（現在はトップページで使っていない）
│   ├── UrlForm.tsx               # 旧: URL入力フォーム（現在はトップページで使っていない）
│   ├── GeneratingOverlay.tsx     # AI生成中フルスクリーンオーバーレイ（スピナー・ステップ・ヒント）
│   ├── DatePicker.tsx            # 航空会社スタイル日程ピッカー（2ヶ月カレンダー）
│   ├── ItineraryEditor.tsx       # 旅程詳細画面（undo/redo/zoom制御 + CalendarView + サイドパネル + ShareButton）
│   ├── CalendarView.tsx          # ★Outlookスタイルカレンダー（最重要コンポーネント）
│   ├── SuggestedSpotsPanel.tsx   # おすすめスポットサイドパネル（カレンダー↔ドラッグ・挿入プレビュー）
│   ├── FreeBlocksPanel.tsx       # フリーブロックパネル（型タグをドラッグしてカレンダーに追加）
│   ├── SpotDetailModal.tsx       # スポット詳細モーダル（ダブルクリックで表示・編集）
│   └── ShareButton.tsx           # 共有リンクコピーボタン（ツールバー内に配置）
├── hooks/
│   └── useIsMobile.ts            # window.matchMedia でブレークポイント検知（SSR安全）
├── lib/
│   ├── ai/gemini.ts              # Gemini API ラッパー（buildPlanPrompt / generateTripFromPlan 等）
│   ├── db/trips.ts               # Supabase CRUD
│   └── scraper.ts                # URL→本文テキスト抽出（cheerio使用）
└── types/index.ts                # 型定義（Trip, Itinerary, Spot, SidebarSpot, PlanInput, GroupType 等）
```

---

## CalendarView の設計（重要）

**ファイル**: `src/components/trips/CalendarView.tsx`

### 表示
- グリッドは常に **6〜24時** を描画（`GRID_START=6`, `GRID_END=24`）
- 高さ: **固定 480px**（内部スクロール方式）
- `overflow: auto`, `overscrollBehavior: 'contain'`（ページへのスクロール連鎖を防止）
- 外側ラッパーに `isolation: 'isolate'`（ドラッグ時のz-indexがページ要素に漏れないよう隔離）
- `BASE_PPM = 1.0`（1分 = 1px の基準値）、実際の ppm = `BASE_PPM * zoom`
- 初期スクロール位置: マウント時にコンテンツ開始時刻の 1時間前に自動スクロール
- **モバイル**: `mobileDayIdx` state で1日分のみ表示、‹ 前日 / 翌日 › ナビゲーション

### ドラッグ操作（マウス＋タッチイベント対応）
- **`DRAG_THRESHOLD = 5px`**: mousedown からこの距離以上動いた時のみドラッグ判定
- **`e.detail > 1` 早期リターン**: ダブルクリック2回目の mousedown は即リターン（dblclick イベント保護）
- **タッチ対応**: `touchstart`→`startDragFromTouch`、`touchmove`（`{ passive: false }`＋`e.preventDefault()`）、`touchend`
- **ダブルタップ検知**: `lastTapRef`（300ms 以内に同一スポットを2回タップ → SpotDetailModal を開く）
- **ドラッグゴースト**: move ドラッグ中は `position:fixed` のゴースト要素がカーソルをピクセル単位で追随（scale(0.93)）
- **同一日 move**: 移動したブロックのみ動く。重なりが出る場合のみ後続を cascade push
- **他日 move**: 移動元から削除、移動先に挿入（重なるブロックを cascade push）
- **リサイズ**: 上端/下端ドラッグで時刻変更 + `applyResize()` で隣接ブロックを cascade push
- **カレンダー→サイドバー**: マウスがサイドバー領域に入ると検出し、mouseUp 時に `onMoveToSidebar` を呼ぶ

### ギャップ注釈
- スポット間の空き時間を「XX分」ラベルで表示（移動ブロック削除の代替）
- 親コンテナは `pointerEvents: 'none'`、ボタン子要素は `pointerEvents: 'auto'`（ドラッグ妨げず）
- `onGapClick` prop が渡されている場合は「＋ XX分」と表示し、クリックで移動ブロックの SpotDetailModal を開く

### Props（現在）
```typescript
interface Props {
    days: ItineraryDay[]
    startDate?: Date
    zoom: number
    onUpdateDays: (updated: ItineraryDay[]) => void
    onDropSuggestedSpot?: (dayIdx: number, time: string, spot: SidebarSpot, spotIdx: number) => void
    onDropFreeBlock?: (dayIdx: number, time: string, type: SpotType) => void
    onMoveToSidebar?: (spot: Spot, dayIdx: number, spotIdx: number, mouseX: number, mouseY: number) => void
    onDraggingToSidebarChange?: (v: boolean) => void
    onSidebarDragMove?: (mouseY: number) => void
    onDoubleClickSpot?: (spot: Spot, dayIdx: number, spotIdx: number) => void
    sidebarRef?: React.RefObject<HTMLDivElement | null>
    onDragStart?: (spot: Spot) => void
    onDragEnd?: () => void
    onGapClick?: (dayIdx: number, time: string, duration: number) => void
}
```

### 重要な実装パターン
- **コールバック ref パターン**: `useCallback` の deps に含めると毎フレーム再生成される props は `useRef` に入れて参照
- **`tempRef`**: `temp` state を ref にも同期。`onMouseUp` の deps から `temp` を外して毎フレーム再生成を防ぐ
- **`dragMovedRef`**: ドラッグしたかどうかのフラグ。`startDrag` でリセット、`onMouseMove` で閾値超えたらtrue

---

## ItineraryEditor の設計

**ファイル**: `src/components/trips/ItineraryEditor.tsx`

### 状態
- `days`: 現在の旅程
- `sidebarSpots: SidebarSpot[]`: おすすめスポットパネルのスポット一覧
- `history: Snapshot[]`: undoスタック（`Snapshot = { days, sidebarSpots }`）
- `redoStack: Snapshot[]`: redoスタック
- `zoom: number`: カレンダーのズーム倍率（ZOOM_MAX=3.0, ZOOM_STEP=0.2）
- `saveStatus: 'saved' | 'saving' | 'unsaved'`
- `receivingSidebar`: サイドバーがドラッグ受付中かどうか
- `sidebarInsertHint: number | null`: サイドバーの挿入位置インデックス
- `draggingCalendarSpot`: ドラッグ中のスポット情報（サイドバープレビュー用）
- `editingSpot`: ダブルクリックで開く SpotDetailModal 用

### 画面レイアウト（上から順）
1. しおり表紙（グラデーション青カード）
2. ツールバー: [↩ 戻す] [↪ 進む] | 縦軸 [−][バー][+] | spacer | [保存状態] [保存ボタン] | | [🔗 シェア]
3. Google Maps リンク行: 🗺️ Google Maps | [1日目] [2日目] ...（日ごとの Directions URL）
4. カレンダー + サイドパネル（モバイルは縦積み）

### Undo/Redo の注意点
- history/redoStack は `Snapshot = { days, sidebarSpots }` を格納（両方まとめて復元）
- `handleUpdateDays`（days のみ変更）でも Snapshot を保存する（サイドバーも含めた完全な履歴）

### buildMapsUrl（Google Maps URL生成）
```typescript
// 移動ブロックを除いたスポット名＋目的地を waypoint に並べた Directions URL
function buildMapsUrl(day: ItineraryDay, destination: string): string {
    const spots = day.spots.filter(s => s.type !== '移動')
    if (spots.length === 0) return ''
    const parts = spots.map(s => encodeURIComponent(`${s.name} ${destination}`))
    return `https://www.google.com/maps/dir/${parts.join('/')}`
}
```

---

## SpotDetailModal の設計

**ファイル**: `src/components/trips/SpotDetailModal.tsx`

### 状態モデル（移動ブロックの発着時刻）
- `depTime`: state（HH:MM）— 出発時刻
- `arrTime`: state（HH:MM）— 到着時刻（`spot.time + duration_minutes` で初期化）
- `duration`: derived（`Math.max(1, toMinsLocal(arrTime) - toMinsLocal(depTime))`）

### 発着時刻の編集ルール
- 発を編集 → 着は固定・所要時間が変わる
- 着を編集 → 発は固定・所要時間が変わる
- 所要時間（± ボタン）を編集 → 発は固定・着が変わる（`arrTime = depTime + newDuration`）

### 移動ブロック専用フィールド
- 「発着時刻」セクション（移動のみ表示）
- ヘッダーに `🚌 HH:MM → HH:MM · XX分` を表示
- メモ欄が「ルートメモ」に変わりプレースホルダーも変更

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
1. 送信ボタン押下 → `GeneratingOverlay`（フルスクリーンオーバーレイ）を表示
2. `POST /api/plan` に `PlanInput` を送信
3. API側: URLを `Promise.allSettled()` で並行スクレイプ（失敗URLは無視）
4. `generateTripFromPlan(body, articleTexts)` でGemini生成
5. Supabaseに保存 → `share_id` を受け取り `/trips/[share_id]` に遷移

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

### フォームボタンの必須ルール
- `type="button"` + `onClick` のみ（`type="submit"` 禁止）
- Enterキーによる意図しない送信を防止するため

---

## 移動ブロックの設計方針

AI生成時に移動ブロックを挿入すると、スポットを動かした瞬間に移動ブロックが意味をなさなくなる問題があった。
**選択肢Cを採用**: ギャップ注釈方式（移動ブロックは生成しない）

- AI はスポット間に十分な空き時間を設けるだけ（移動ブロックを生成しない）
- カレンダー上の空き時間を「XX分」ラベルで表示
- ユーザーが必要に応じてフリーブロックパネルから移動ブロックを手動で配置
- ギャップ注釈をタップ → 移動ブロックの詳細モーダルが開き、そのまま追加できる
- 移動ブロックは1分単位・発着時刻入力対応

---

## 実装済み機能

- [x] 統合フォーム（PlanForm）: 目的地複数・URL最大5本・人数・グループ種別など
- [x] URL複数並行スクレイプ（Promise.allSettled、失敗URL無視）
- [x] 条件→AI旅程生成（gemini-2.5-flash-lite）
- [x] URLスクレイプ→AI旅程生成
- [x] AI生成中ローディングオーバーレイ（GeneratingOverlay: スピナー+ステップ進行+ヒント）
- [x] 日程ピッカー（生成時に設定 → カレンダーに日付表示）
- [x] Outlookスタイルカレンダービュー（固定高さ480px・内部スクロール）
- [x] ドラッグ移動（同日/他日）+ リサイズ（cascade push）
- [x] ドラッグゴースト（scale(0.93)・カーソル追随・スナップ先プレースホルダー表示）
- [x] タッチドラッグ対応（モバイル）
- [x] モバイル1日表示（‹ 前日 / 翌日 › ナビ・ダブルタップで詳細）
- [x] スポット色分け（観光=青/グルメ=オレンジ/移動=グレー/宿泊=紫/その他=緑）
- [x] 交通スタイル自動判定（沖縄→レンタカー、東京→電車 等）
- [x] ギャップ注釈（スポット間の空き時間を「XX分」表示・タップで移動ブロック挿入）
- [x] Undo / Redo（days + sidebarSpots の完全 Snapshot 方式）
- [x] ズームコントロール（横ツールバーに統合）
- [x] 旅程の手動保存（Supabase PATCH）
- [x] share_id による URL 共有（ツールバー内 ShareButton）
- [x] おすすめスポットパネル（SuggestedSpotsPanel）: カレンダー↔双方向ドラッグ
- [x] カレンダー→サイドバー ドラッグ時リアルタイム挿入位置プレビュー（PreviewSpotCard）
- [x] フリーブロックパネル（FreeBlocksPanel）: 型タグをドラッグしてカレンダーに配置（移動ブロック含む）
- [x] スポット詳細モーダル（SpotDetailModal）: 種別/所要時間/予約/リンク/メモ/発着時刻/ルートメモ
- [x] 移動ブロック発着時刻（発変更→着固定/着変更→発固定/所要時間変更→発固定）
- [x] Google Maps リンク（日ごとの Directions URL ボタン、APIキー不要）
- [x] スポット詳細モーダルに Google Maps iframe 埋め込み（非公式 output=embed 方式、APIキー不要・完全無料）
- [x] Spot に address フィールド追加（AI生成、市区町村＋町名レベル）→ Maps 検索精度向上
- [x] カレンダーのz-index隔離（isolation: isolate）
- [x] 内部スクロール（overscroll-behavior: contain で連鎖防止）
- [x] sidebar_spots の DB 保存（itinerary JSONB 内の `sidebar_spots` フィールド）
- [x] GitHub Actions による Supabase keep-alive（3日ごと定期ping）

---

## 技術メモ（Claude 向け）

- **Next.js params**: `params: Promise<{ id: string }>` → `const { id } = await params`
- **Tailwind**: v4系（設定ファイル不要、CSS import方式）。ただしレイアウト崩れが発生しやすいため、**重要なレイアウトはinline stylesで書く**（特にflexbox系）
- **Supabase型**: `src/types/index.ts` の `Trip` がDBの行に対応
- **itinerary の型**: `Itinerary { days, trip_style?, trip_style_reason?, start_date?, sidebar_spots? }`
- **start_date**: DBの別カラムではなくitinerary JSONB内に格納
- **sidebar_spots**: itinerary JSONB内の配列。`SidebarSpot { name, type, duration_minutes, description?, popularity? }`
- **TransportMode / TripStyle / GroupType / PlanInput**: `src/types/index.ts` に定義済み
- **CalendarViewのPPM**: `BASE_PPM = 1.0`。ppm = BASE_PPM * zoom
- **isolation: isolate**: CalendarView外側ラッパーに必須（ドラッグ中z-index:200のブロックがページ要素に被らないよう隔離）
- **overscroll-behavior: contain**: カレンダースクロールコンテナに必須（ページへのスクロール連鎖防止）
- **グローバルCSSアニメーション**: `globals.css` に `spin-ring`, `float-plane`, `shimmer`, `fade-in-up`, `dot-bounce` 等を定義済み
- **useIsMobile**: `src/hooks/useIsMobile.ts`。SSR では `false` を返し、クライアントマウント後に `window.matchMedia` で判定
