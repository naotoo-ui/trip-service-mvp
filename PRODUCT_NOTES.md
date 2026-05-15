# tripServiceMVP プロダクトノート

Claude Code が毎回このファイルを読み込みます。

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
| **Phase 2** | 初期改善（編集UI・地図・宿泊管理） | 🔨ほぼ完了、公開設定・一覧のみ未着手 |
| **Phase 3** | バイラル・発見（コピー・OGP・探索ページ） | ❌未着手 ← **次の最優先** |
| **Phase 4〜** | UX強化・収益化・拡張 | ❌未着手 |

---

## 実装済み機能（完全リスト）

- [x] 統合フォーム（PlanForm）: 目的地複数・URL最大5本・人数・グループ種別・日程ピッカーなど
- [x] URL複数並行スクレイプ（Promise.allSettled、失敗URL無視）
- [x] 条件→AI旅程生成（gemini-2.5-flash-lite）
- [x] URLスクレイプ→AI旅程生成
- [x] AI生成中ローディングオーバーレイ（GeneratingOverlay: スピナー+ステップ進行+ヒント）
- [x] Outlookスタイルカレンダービュー（固定高さ480px・内部スクロール）
- [x] ドラッグ移動（同日/他日）+ リサイズ（cascade push）+ ドラッグゴースト
- [x] タッチドラッグ対応・モバイル1日表示（‹ 前日 / 翌日 › ナビ）
- [x] スポット色分け（観光=青/グルメ=オレンジ/移動=グレー/宿泊=紫/その他=緑）
- [x] 交通スタイル自動判定（沖縄→レンタカー、東京→電車 等）
- [x] ギャップ注釈（スポット間の空き時間を「XX分」表示・タップで移動ブロック挿入）
- [x] 移動ブロック: 発着時刻入力・ルートメモ・1分単位所要時間
- [x] Undo / Redo（days + sidebarSpots の完全 Snapshot 方式）
- [x] ズームコントロール（横ツールバーに統合）
- [x] 旅程の手動保存（Supabase PATCH）
- [x] share_id による URL 共有（ツールバー内 ShareButton）
- [x] おすすめスポットパネル（SuggestedSpotsPanel）: カレンダー↔双方向ドラッグ
- [x] フリーブロックパネル（FreeBlocksPanel）: 型タグをドラッグしてカレンダーに配置
- [x] スポット詳細モーダル（SpotDetailModal）: 種別/所要時間/予約/リンク/メモ/発着時刻/Google Maps
- [x] Spot に address フィールド（AI生成、市区町村＋町名レベル）→ Maps 検索精度向上
- [x] Google Maps リンク（日ごとの Directions URL ボタン、APIキー不要）
- [x] スポット詳細モーダルに Google Maps iframe 埋め込み（非公式 output=embed 方式）
- [x] カレンダー宿泊帯（列ヘッダー直下・シングルクリックでモーダル）
- [x] HotelDetailModal: 住所/CI-CO時刻/料金/予約URL/メモ/Google Maps iframe
- [x] GitHub Actions による Supabase keep-alive（3日ごと定期ping）

---

## 次にやるべきこと — リリース戦略の深考察

### 現状の本質的な問題

現時点では「使えるプロダクト」にはなっているが、**以下の3つの欠陥がある**：

1. **発見できない** — URL を知っている人しか使えない。Google 検索にも出ない
2. **バイラルしない** — シェアされても見た人が何もできない（コピーして自分用にできない）
3. **ユーザーが消える** — アカウントなし → URLを失えば旅程も消える → リテンションゼロ

これらを解決しないと、友人に紹介しても広がらない。

---

### 🔴 最優先: リリース前に必ずやること（効果大・工数小）

#### 1. 旅程コピー機能（工数: 2〜3時間）
**なぜ最優先か**: 共有URLを受け取った人が「このプランいいな → 自分用にカスタマイズしたい」と思った瞬間が最大の獲得チャンス。今はそのまま使えない。

実装イメージ:
- 旅程詳細ページに「このプランをコピーして使う」ボタンを追加
- POST /api/trips/copy → 同じ itinerary で新しい share_id を発行 → 新しいページに遷移
- コピー元の share_id を `source_trip_id` として記録するとバイラル分析にも使える

#### 2. OGP（SNSシェア画像）の設定（工数: 1〜2時間）
**なぜ必須か**: LINE・Twitter でシェアした時にリンクプレビューが表示されないと、クリック率が激減する。旅行プランのシェアは LINE が主流（日本）。

実装イメージ:
- `trips/[id]/page.tsx` に `generateMetadata()` を追加
- `og:title`: 旅程タイトル、`og:description`: 「${目的地} ${日数}日間の旅程プラン」
- 画像は静的OGP（`/og-default.png`）で十分。余裕があれば satori で動的生成も可

```typescript
export async function generateMetadata({ params }) {
    const trip = await getTripByShareId(id)
    return {
        title: `${trip.title} | TripService`,
        description: `${trip.destination} ${trip.duration_days}日間の旅程プランです`,
        openGraph: { title: ..., description: ..., images: ['/og-default.png'] },
    }
}
```

---

### 🟠 リリース直後に着手すること（効果大・工数中）

#### 3. 旅程一覧・発見ページ /explore（工数: 4〜6時間）
**なぜ必要か**: SEO流入・口コミ流入の受け皿。「沖縄旅行 プラン」で検索した人がトップページでなく実際の旅程例を見られれば、価値が即座に伝わる。

実装方針（DB変更なしで始める）:
- `trips` テーブルに `is_public boolean default true` を追加（初期は全公開）
- `/explore` ページで最新20件を表示（destination・duration_days・title だけ表示）
- カード形式: 🗼 東京 3日間 / 「家族で楽しむ東京観光プラン」
- 将来的にタグ・人気順・検索機能を足す

#### 4. 自動保存（工数: 2〜3時間）
**なぜ必要か**: 現在の手動保存では、編集中にタブを閉じると変更が消える。ユーザーが怖くて積極的に編集できない。

実装方針:
- `saveStatus === 'unsaved'` になってから 3秒後に自動で `saveToDb()` を実行（debounce）
- ツールバーの「保存ボタン」は残す（即時保存の手段として）

#### 5. ランディングページの強化（工数: 3〜4時間）
**なぜ必要か**: 現状のトップページはフォームだけ。初めて来た人が「何ができるのか」を 3秒で理解できない。

実装方針:
- フォームの上に「30秒で旅程が完成する」キャッチコピー + サンプル旅程のスクリーンショット
- /explore の人気プランを 3〜5件 ピックアップして表示
- ステップ説明: ① 目的地・日数を入力 → ② AIが旅程生成 → ③ カレンダーで編集・共有

---

### 🟡 中期的に取り組むこと（効果大・工数大）

#### 6. 認証（メール or LINE ログイン）（工数: 1〜2日）
Supabase Auth を使えばメール magic link 認証が数時間で実装できる。
- ログインすると「自分の旅程一覧」が見られる
- ログインなしでも旅程作成は可能（ゲストモード）
- メールアドレスを取得できればメルマガ配信・再訪促進が可能

#### 7. SEOページ自動生成（工数: 1〜2日）
「沖縄 2泊3日 モデルコース」などのキーワードで月間数千〜数万の検索がある。
- `/plans/[destination]/[duration]` のような静的ページ
- AI生成した旅程をSSGで事前レンダリング
- 内部リンクから旅程生成フォームへ誘導

#### 8. アフィリエイト収益化（工数: 数時間〜）
HotelDetailModal の `booking_url` フィールドを使い、じゃらん・楽天トラベルへのアフィリエイトリンクを誘導。
- ホテル情報入力時に「じゃらんで検索」「楽天トラベルで検索」ボタンを追加（アフィリエイトパラメータ付き）
- ユーザーにとって便利な機能として自然に導線を作れる
- **実装コスト: 数時間、期待収益: ユーザー数に比例して増加**

---

### ❌ 今は絶対にやらないこと

- 決済・サブスクの内製実装（ユーザーが集まってから）
- ネイティブアプリ化（PWA で十分）
- 多言語対応（まず日本人ユーザーを掴む）
- AI精度の完璧化（80点で十分、ユーザー編集で補う）
- 複雑な認証・権限管理（シンプルに保つ）

---

### 優先度マトリクス（要約）

| 施策 | 効果 | 工数 | 優先度 |
|------|------|------|--------|
| 旅程コピー機能 | ◎ バイラル起点 | 小 | 🔴 即着手 |
| OGP設定 | ◎ SNSシェア必須 | 極小 | 🔴 即着手 |
| 自動保存 | ○ UX基礎 | 小 | 🟠 早めに |
| /explore ページ | ◎ 発見・SEO | 中 | 🟠 早めに |
| LPの強化 | ○ CVR改善 | 中 | 🟠 早めに |
| 認証（メール） | ◎ リテンション | 大 | 🟡 中期 |
| SEOページ | ◎ 流入獲得 | 大 | 🟡 中期 |
| アフィリエイト | ○ 収益化 | 小 | 🟡 中期 |

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
│   ├── page.tsx                  # トップページ（PlanForm）
│   ├── layout.tsx                # 共通レイアウト
│   ├── loading.tsx               # スケルトンローディング
│   ├── trips/[id]/page.tsx       # 旅程詳細ページ（OGP設定もここ）
│   └── api/
│       ├── plan/route.ts         # POST: 統合フォーム→並行スクレイプ→AI生成→保存
│       ├── generate/route.ts     # POST: 条件→AI生成（現在トップから未使用）
│       ├── scrape/route.ts       # POST: URL→スクレイプ→AI生成（現在トップから未使用）
│       └── trips/[id]/route.ts   # PATCH: 旅程を手動保存
├── components/trips/
│   ├── PlanForm.tsx              # ★統合フォーム
│   ├── GeneratingOverlay.tsx     # AI生成中フルスクリーンオーバーレイ
│   ├── DatePicker.tsx            # 航空会社スタイル日程ピッカー
│   ├── ItineraryEditor.tsx       # 旅程詳細画面の親コンポーネント
│   ├── CalendarView.tsx          # ★Outlookスタイルカレンダー（最重要）
│   ├── SuggestedSpotsPanel.tsx   # おすすめスポットサイドパネル
│   ├── FreeBlocksPanel.tsx       # フリーブロックパネル
│   ├── SpotDetailModal.tsx       # スポット詳細モーダル
│   ├── HotelDetailModal.tsx      # 宿泊詳細モーダル（CI/CO・料金・予約URL等）
│   └── ShareButton.tsx           # 共有リンクコピーボタン
├── hooks/
│   └── useIsMobile.ts            # window.matchMedia でブレークポイント検知
├── lib/
│   ├── ai/gemini.ts              # Gemini API ラッパー
│   ├── db/trips.ts               # Supabase CRUD
│   └── scraper.ts                # URL→本文テキスト抽出
└── types/index.ts                # 全型定義
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

### Props（現在）
```typescript
interface Props {
    days: ItineraryDay[]
    startDate?: Date
    zoom: number
    onUpdateDays: (updated: ItineraryDay[]) => void
    onDropSuggestedSpot?: (dayIdx, time, spot, spotIdx) => void
    onDropFreeBlock?: (dayIdx, time, type) => void
    onMoveToSidebar?: (spot, dayIdx, spotIdx, mouseX, mouseY) => void
    onDraggingToSidebarChange?: (v) => void
    onSidebarDragMove?: (mouseY) => void
    onDoubleClickSpot?: (spot, dayIdx, spotIdx) => void
    sidebarRef?: React.RefObject<HTMLDivElement | null>
    onDragStart?: (spot) => void
    onDragEnd?: () => void
    onGapClick?: (dayIdx, time, duration) => void
    onDoubleClickHotel?: (hotel, dayIdx) => void  // 宿泊帯クリック（シングルクリック）
}
```

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
- **hotel の格納場所**: `itinerary.days[i].hotel`（JSONB内。DB スキーマ変更不要）
- **CalendarView PPM**: `BASE_PPM = 1.0`。ppm = BASE_PPM * zoom
- **isolation: isolate**: CalendarView 外側ラッパーに必須
- **overscroll-behavior: contain**: カレンダースクロールコンテナに必須
- **useIsMobile**: SSR では `false`、クライアントマウント後に `window.matchMedia` で判定
- **Google Maps 埋め込み**: `maps.google.com/maps?q=...&output=embed`（非公式・無料）
