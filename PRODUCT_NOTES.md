# tripServiceMVP プロダクトノート

Claude Code が毎回このファイルを読み込みます。
気づいたこと・やりたいことを自由に書いてください。

---

## プロジェクト概要

**旅行プランAIジェネレーター** — URLを入力すると旅程を生成 or 条件から旅程をAI生成するWebサービス。

- **URL**: Vercel にデプロイ済み（GitHub push で自動デプロイ）
- **スタック**: Next.js 15 App Router / TypeScript / Tailwind CSS v4 / Supabase(PostgreSQL) / Google Gemini API
- **AI モデル**: `gemini-2.5-flash-lite`（maxOutputTokens: 4096）
- **DB**: Supabase、RLS 有効、`trips` テーブル（id, share_id, title, destination, duration_days, source_url, itinerary(JSONB), created_at）
- **認証**: なし（share_id による URL 共有のみ）

---

## ファイル構成と役割

```
src/
├── app/
│   ├── page.tsx                  # トップページ（タブ切り替え: 条件生成 / URL生成）
│   ├── trips/[id]/page.tsx       # 旅程詳細ページ（async params: Promise<{id}>）
│   └── api/
│       ├── generate/route.ts     # POST: 条件→AI生成→Supabase保存（maxDuration=60）
│       ├── scrape/route.ts       # POST: URL→スクレイプ→AI生成→保存（maxDuration=60）
│       └── trips/[id]/route.ts   # PATCH: 旅程を手動保存
├── components/trips/
│   ├── GenerateForm.tsx          # 条件入力フォーム（行き先/日数/日程/希望）
│   │                             # ※ button は type="button" onClick のみ（Enter無効）
│   ├── UrlForm.tsx               # URL入力フォーム
│   │                             # ※ 同上、Enter無効
│   ├── DatePicker.tsx            # 航空会社スタイル日程ピッカー（2ヶ月カレンダー）
│   ├── ItineraryEditor.tsx       # 旅程詳細画面（しおり表紙 + 保存ボタン + CalendarView）
│   ├── CalendarView.tsx          # Outlookスタイルのカレンダー（★最重要コンポーネント）
│   └── ShareButton.tsx           # 共有リンクコピーボタン
├── lib/
│   ├── ai/gemini.ts              # Gemini API ラッパー（プロンプト生成・JSON解析）
│   ├── db/trips.ts               # Supabase CRUD
│   └── scraper.ts                # URL→本文テキスト抽出
└── types/index.ts                # 型定義（Trip, Itinerary, Spot, TransportOption等）
```

---

## CalendarView の設計（重要）

**ファイル**: `src/components/trips/CalendarView.tsx`

### 表示
- グリッドは常に **6〜24時** を描画（`GRID_START=6`, `GRID_END=24`）
- コンテナ高さ: `calc(100dvh - 60px)`（ズームバーを除いた画面全高）
- デフォルト zoom=1.0 時、**スポットの実時間帯 ±1h** がコンテナにピッタリ収まるよう `fitPpm` を動的計算
- 初期スクロール位置: コンテンツ開始時刻（例: スポット9-20時なら8時頭に自動スクロール）
- ズームイン（+）するとグリッドが伸び、内部スクロールで24時まで到達可能

### ドラッグ操作
- **同一日 move**: 移動したブロックのみ動く。重なりが出る場合のみ後続を cascade push。sweep（後続が詰めてくる）は**なし**
- **他日 move**: 移動元は削除のみ（他ブロックは不動）。移動先は重なるブロックの **duration を削減** して収容
- **リサイズ**: 上端/下端ドラッグで時刻変更（sweep/compress なし）

### ズームコントロール
- `zoom * fitPpm = ppm`（pixels/minute）
- zoom=1.0: 最小（コンテンツフィット、−ボタン無効）
- zoom 最大: 3.0、ステップ: 0.2
- リセットボタンでコンテンツ開始位置へ戻る

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
- 両 API ルートに `export const maxDuration = 60`
- プロンプトを短くすることで Gemini の応答を高速化（現在 ~4.5 秒）

---

## 実装済み機能一覧

- [x] URL入力→スクレイプ→AI旅程生成
- [x] 条件入力（行き先/日数/希望）→AI旅程生成
- [x] 日程ピッカー（生成画面で設定）→カレンダーに日付表示
- [x] Outlookスタイルのカレンダービュー（ドラッグ移動/リサイズ）
- [x] スポットの色分け（観光=青/グルメ=オレンジ/移動=グレー/宿泊=紫）
- [x] 移動スポットに交通手段表示（推奨・代替）
- [x] 交通スタイル自動判定（沖縄→レンタカー、東京→電車 等）
- [x] 旅程の手動保存（Supabase PATCH）
- [x] share_id による URL 共有
- [x] Vercel タイムアウト対策（maxDuration=60 + プロンプト短縮）
- [x] Enter キーによる意図しない生成を防止（type=button）
- [x] カレンダーのコンテンツ時間帯自動フィット（±1h バッファー）
- [x] ドラッグ時の重なり防止（cascade push / duration compress）

---

## 未実装・今後のアイデア

### 優先度高
- [ ] スクレイピング精度の評価・改善（じゃらん/るるぶ/アメブロ対応）
- [ ] スポット追加・削除のUI（カレンダー上でのダブルクリック等）

### 優先度中
- [ ] 印刷・PDF出力
- [ ] 旅程のコピー（1日目を複製等）

### 優先度低
- [ ] 共同編集機能
- [ ] お気に入り保存

---

## 技術メモ（Claude 向け）

- **Next.js params**: `params: Promise<{ id: string }>` → `const { id } = await params`
- **Tailwind**: v4 系（設定ファイル不要、CSS import 方式）
- **Supabase型**: `src/types/index.ts` の `Trip` が DB の行に対応
- **itinerary の型**: `Itinerary { days, trip_style?, trip_style_reason?, start_date? }`
- **start_date**: DB の別カラムではなく itinerary JSONB 内に格納
- **TransportMode / TripStyle**: `src/types/index.ts` に定義済み
