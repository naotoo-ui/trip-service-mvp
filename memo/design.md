# tripServiceMVP 設計メモ

## セクション1：全体アーキテクチャ

画面から処理の流れ：

```
[ユーザー（スマホ/PC）]
        ↓ URLを貼る or 条件を入力
[Next.js フロント画面]
        ↓
[Next.js API Routes（サーバー処理）]
        ↓                    ↓
[Gemini API]          [Supabase（DB）]
（旅程を生成）         （旅程を保存・取得）
        ↓
[スクレイパー（URL→テキスト変換）]
（ブログ記事の内容を読み込む）
```

MVPで作るページは3つ：

| ページ | URL | 内容 |
|---|---|---|
| トップ | `/` | 旅行条件入力 or URLペースト |
| 旅程詳細 | `/trips/[id]` | 生成された旅程の表示・共有 |
| （生成中） | 同上 | ローディング表示 |

---

## セクション2：ディレクトリ構造

```
tripServiceMVP/
├── .claude/
│   └── settings.json          # Claude Code設定
├── docs/
│   └── superpowers/
│       └── specs/             # 設計ドキュメント置き場
├── src/
│   ├── app/                   # 画面・APIを置く場所（Next.js）
│   │   ├── api/
│   │   │   ├── generate/      # 旅程生成API（条件入力→旅程）
│   │   │   ├── scrape/        # URL解析API（ブログ→旅程）
│   │   │   └── trips/         # 旅程の保存・取得API
│   │   ├── trips/
│   │   │   └── [id]/          # 旅程詳細・共有ページ
│   │   ├── layout.tsx         # 全体レイアウト
│   │   ├── page.tsx           # トップページ
│   │   └── globals.css
│   ├── components/            # 画面のパーツ（ボタン・カードなど）
│   │   ├── ui/                # 汎用パーツ
│   │   └── trips/             # 旅程専用パーツ
│   ├── lib/                   # ロジック（処理の核心部分）
│   │   ├── ai/                # Gemini API呼び出し処理
│   │   ├── db/                # Supabaseのデータ操作
│   │   └── scraper/           # URLのHTML取得・テキスト抽出
│   └── types/
│       └── index.ts           # 型定義（旅程データの形など）
├── public/                    # 画像・アイコンなど
├── .env.local                 # APIキーなど秘密情報（Git管理外）
├── .env.example               # .env.localのサンプル（Git管理）
├── memo/                      # 設計メモ（このファイル）
├── CLAUDE.md                  # このプロジェクト用Claude Code設定
├── next.config.ts
├── package.json
└── tailwind.config.ts
```

---

## セクション3：データ設計（Supabase）

### `trips` テーブル

| カラム名 | 型 | 説明 |
|---|---|---|
| `id` | UUID | 自動生成される一意のID（内部用） |
| `share_id` | text (unique) | 共有URL用の短いID（例: `abc123`） |
| `title` | text | 旅行タイトル（例: 「沖縄3日間の旅」） |
| `destination` | text | 行き先（例: 「沖縄」） |
| `duration_days` | integer | 日数（例: `3`） |
| `wishes` | text | やりたいこと・条件（例: 「海と食事を楽しみたい」） |
| `source_url` | text (nullable) | 元ブログ記事のURL（URLから生成した場合のみ） |
| `itinerary` | jsonb | 旅程データ本体（下記参照） |
| `created_at` | timestamp | 作成日時 |

### `itinerary` の中身（JSON形式）

```json
{
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "首里城",
          "description": "世界遺産の琉球王国の城跡",
          "duration_minutes": 90,
          "type": "観光"
        },
        {
          "time": "11:00",
          "name": "国際通り",
          "description": "お土産・昼食",
          "duration_minutes": 60,
          "type": "グルメ"
        }
      ]
    }
  ]
}
```

---

## セクション4：環境構築・開発フロー

### 必要なツール（1回だけセットアップ）

| ツール | 用途 | 確認コマンド |
|---|---|---|
| **Node.js** (v20以上) | Next.jsを動かすランタイム | `node -v` |
| **npm** | パッケージ管理（Node.jsに付属） | `npm -v` |
| **Git** | コード管理 | `git -v` |

### 開発のルーティン

```
1. Claude Codeに「〇〇を作って」と指示
        ↓
2. Claude Codeがコードを生成・編集
        ↓
3. ローカルで `npm run dev` して動作確認
   → ブラウザで http://localhost:3000 を開く
        ↓
4. 問題なければ GitHubにpush
        ↓
5. Vercelが自動でサイトを更新（デプロイ）
```

### 環境変数の管理

```bash
# .env.local（このファイルはGitに上げない）
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# .env.example（中身は空、キー名だけ書く・Git管理）
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### デプロイの流れ

```
ローカルのコード
    ↓ git push
GitHub (naotoo-ui)
    ↓ 自動連携（初回1回設定するだけ）
Vercel
    ↓ 自動ビルド・公開
https://your-app.vercel.app（無料）
```

---

## セクション5：MVP実装順序

```
ステップ1: 基盤          → 画面が出るだけ
ステップ2: AI生成        → ★コア体験が動く
ステップ3: 保存          → データが残る
ステップ4: 共有URL       → 他人に見せられる
ステップ5: URL→旅程生成  → ★差別化機能
ステップ6: UIの仕上げ    → 見た目が整う
```

### ステップ1：プロジェクト基盤の構築
- Next.js プロジェクト作成
- Tailwind CSS セットアップ
- Supabase接続設定、Gemini API接続設定
- GitHubリポジトリ作成 → Vercel連携

### ステップ2：コア機能（AI旅程生成）
- トップページに入力フォーム（行き先・日数・やりたいこと）
- Gemini APIに送って旅程JSONを受け取るAPI Route
- 生成結果を画面に表示
- ※保存・共有はまだ不要。「旅程が出る」を最速で確認する

### ステップ3：旅程の保存 + 詳細ページ
- Supabaseに `trips` テーブル作成
- 生成後に自動保存する処理
- `/trips/[id]` ページで旅程を表示

### ステップ4：共有URL
- `share_id` の生成ロジック（短いランダム文字列）
- 旅程詳細ページに「このURLをコピー」ボタン
- 未ログインでも `/trips/[share_id]` で閲覧可能に設定

### ステップ5：URL→旅程生成（差別化機能）★
- URLのHTMLを取得するAPI Route
- テキスト抽出してGemini APIに渡す処理
- トップページにURLペーストの入力欄を追加
- ※技術難易度が最も高いため、コア機能安定後に着手

### ステップ6：UIの仕上げ
- ローディング表示（生成中のスピナー）
- エラーハンドリング（API失敗時のメッセージ）
- スマホ対応の微調整
