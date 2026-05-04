# tripServiceMVP 設計仕様書

**作成日:** 2026-05-04
**フェーズ:** Phase 0〜1（方向性定義 + MVP）
**ステータス:** 承認済み

---

## 1. プロジェクト概要

### コンセプト
AIで旅行プランを一瞬で作るWebサービス

### 解決する課題
旅行プランを考えるのが面倒という課題を解消する

### 差別化ポイント
旅行ブログのURLを貼るだけで旅程を自動生成できる

### ターゲットユーザー
旅行プランを自分で考えたくない、または参考にしたいブログ記事から手軽に旅程を作りたいユーザー

---

## 2. 技術スタック

| 分類 | 技術 | 理由 |
|---|---|---|
| フレームワーク | Next.js (App Router) | フロント＋APIを1プロジェクトで完結、Vercel連携が容易 |
| 言語 | TypeScript | 型安全でバグを早期検出できる |
| スタイル | Tailwind CSS | スマホ対応UIを最速で構築できる |
| データベース | Supabase (PostgreSQL) | 無料枠で十分、認証・リアルタイム機能も将来使える |
| AI | Google Gemini API | 無料枠あり（1日1,500リクエスト）、MVPに最適 |
| デプロイ | Vercel | GitHub連携で自動デプロイ、無料 |

### コスト方針
すべて無料枠で運用する。ユーザーが増え収益化できた段階でClaude APIや有料プランに移行する。

---

## 3. アーキテクチャ

```
[ユーザー（スマホ/PC）]
        ↓ URLを貼る or 条件を入力
[Next.js フロント画面]
        ↓
[Next.js API Routes（サーバー処理）]
   ↓           ↓              ↓
[スクレイパー] [Gemini API]  [Supabase]
（URL→テキスト）（旅程を生成） （保存・取得）
    ↓               ↑
    └── テキストを渡す ┘
```

### ページ構成（MVP）

| ページ | URL | 役割 |
|---|---|---|
| トップ | `/` | 旅行条件入力フォーム or URLペースト |
| 旅程詳細 | `/trips/[id]` | 生成旅程の表示・共有URL発行 |

---

## 4. ディレクトリ構造

```
tripServiceMVP/
├── .claude/
│   └── settings.json
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-04-mvp-design.md  # このファイル
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   └── route.ts    # 条件入力→旅程生成API
│   │   │   ├── scrape/
│   │   │   │   └── route.ts    # URL→テキスト抽出API
│   │   │   └── trips/
│   │   │       └── route.ts    # 旅程CRUD API
│   │   ├── trips/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 旅程詳細・共有ページ
│   │   ├── layout.tsx
│   │   ├── page.tsx            # トップページ
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Button, Input, Card など汎用パーツ
│   │   └── trips/              # TripCard, ItineraryDay など旅程専用パーツ
│   ├── lib/
│   │   ├── ai/
│   │   │   └── gemini.ts       # Gemini API呼び出し処理
│   │   ├── db/
│   │   │   └── trips.ts        # Supabaseの旅程操作（保存・取得）
│   │   └── scraper/
│   │       └── index.ts        # URLのHTML取得・テキスト抽出
│   └── types/
│       └── index.ts            # Trip, ItineraryDay, Spot 型定義
├── public/
├── memo/
│   └── design.md               # 開発中のメモ
├── .env.local                  # APIキー（Git管理外）
├── .env.example                # 環境変数のキー名一覧（Git管理）
├── .gitignore
├── CLAUDE.md
├── next.config.ts
├── package.json
└── tailwind.config.ts
```

---

## 5. データ設計

### `trips` テーブル（Supabase）

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | 内部管理用ID |
| `share_id` | text | UNIQUE, NOT NULL | 共有URL用短縮ID（例: `abc123`） |
| `title` | text | NOT NULL | 旅行タイトル |
| `destination` | text | NOT NULL | 行き先 |
| `duration_days` | integer | NOT NULL | 日数 |
| `wishes` | text | | やりたいこと・旅行条件 |
| `source_url` | text | | 元ブログ記事URL（URLから生成時のみ） |
| `itinerary` | jsonb | NOT NULL | 旅程データ本体 |
| `created_at` | timestamptz | DEFAULT now() | 作成日時 |

### `itinerary` JSONスキーマ

```json
{
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "スポット名",
          "description": "簡単な説明",
          "duration_minutes": 90,
          "type": "観光 | グルメ | 移動 | 宿泊 | その他"
        }
      ]
    }
  ]
}
```

### `share_id` 生成ルール
- 英数字8文字のランダム文字列（例: `k7mxp2qn`）
- 衝突時は再生成する

---

## 6. API設計

### POST `/api/generate`
条件入力から旅程を生成して保存する

**リクエスト:**
```json
{
  "destination": "沖縄",
  "duration_days": 3,
  "wishes": "海と食事を楽しみたい"
}
```

**レスポンス:**
```json
{
  "trip_id": "uuid",
  "share_id": "k7mxp2qn"
}
```

### POST `/api/scrape`
URLのブログ記事から旅程を生成して保存する

**リクエスト:**
```json
{
  "url": "https://example-travel-blog.com/okinawa-3days"
}
```

**レスポンス:**
```json
{
  "trip_id": "uuid",
  "share_id": "k7mxp2qn"
}
```

### GET `/api/trips/[share_id]`
share_idを使って旅程データを取得する（UUIDは外部に公開しない）

**レスポンス:**
```json
{
  "id": "uuid",
  "share_id": "k7mxp2qn",
  "title": "沖縄3日間の旅",
  "destination": "沖縄",
  "duration_days": 3,
  "itinerary": { ... }
}
```

---

## 7. 環境変数

```bash
# .env.local（Git管理外）
GEMINI_API_KEY=           # Google AI StudioのAPIキー
NEXT_PUBLIC_SUPABASE_URL= # SupabaseプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase匿名キー
```

---

## 8. MVP実装順序

| ステップ | 内容 | 完了基準 |
|---|---|---|
| 1 | プロジェクト基盤構築 | `npm run dev` で画面が表示される |
| 2 | AI旅程生成（コア） | 条件入力→旅程が画面に出る |
| 3 | 旅程の保存 + 詳細ページ | Supabaseに保存され `/trips/[id]` で見れる |
| 4 | 共有URL発行 | ボタン押下でURLがコピーできる |
| 5 | URL→旅程生成（差別化機能） | ブログURLを貼ると旅程が生成される |
| 6 | UIの仕上げ | スマホで快適に使えるデザイン |

---

## 9. 将来フェーズ（MVP後）

- **フェーズ2:** 旅程編集、地図表示（Google Maps）、公開/非公開設定
- **フェーズ3:** テンプレート化、タグ機能、SEOページ自動生成
- **フェーズ4:** チェックリスト、しおりPDF生成
- **フェーズ5:** 有料機能化、広告導入
- **フェーズ6:** ホテル・航空券アフィリエイト、体験予約送客
