# tripServiceMVP 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AIで旅行プランを生成・保存・共有できるWebサービスのMVPを構築する

**Architecture:** Next.js（App Router）でフロント＋API Routesをフルスタック構成。Supabaseに旅程を保存し、Gemini APIで旅程を生成する。URLスクレイピング機能でブログ記事から旅程を自動抽出する差別化機能も実装する。

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Supabase (PostgreSQL), Google Gemini API (`gemini-1.5-flash`), Cheerio (HTML解析), Jest (テスト)

---

## ファイル構成マップ

| ファイル | 責務 |
|---|---|
| `src/types/index.ts` | Trip・ItineraryDay・Spot の型定義 |
| `src/lib/db/supabase.ts` | Supabaseクライアントの初期化（シングルトン） |
| `src/lib/db/trips.ts` | trips テーブルのCRUD操作（saveTrip, getTripByShareId, generateShareId） |
| `src/lib/db/__tests__/trips.test.ts` | generateShareId のユニットテスト |
| `src/lib/ai/gemini.ts` | Gemini APIの呼び出し・プロンプト生成・JSONパース |
| `src/lib/ai/__tests__/gemini.test.ts` | buildGeneratePrompt, parseTripJson のユニットテスト |
| `src/lib/scraper/index.ts` | URLのHTML取得・テキスト抽出 |
| `src/lib/scraper/__tests__/index.test.ts` | extractTextFromHtml のユニットテスト |
| `src/app/api/generate/route.ts` | POST /api/generate（条件→旅程生成） |
| `src/app/api/trips/[share_id]/route.ts` | GET /api/trips/[share_id]（旅程取得） |
| `src/app/api/scrape/route.ts` | POST /api/scrape（URL→旅程生成） |
| `src/components/trips/GenerateForm.tsx` | 条件入力フォーム（Client Component） |
| `src/components/trips/UrlForm.tsx` | URLペーストフォーム（Client Component） |
| `src/components/trips/ItineraryView.tsx` | 旅程表示コンポーネント（Server Component） |
| `src/components/trips/ShareButton.tsx` | URLコピーボタン（Client Component） |
| `src/app/page.tsx` | トップページ（両フォームを配置） |
| `src/app/trips/[id]/page.tsx` | 旅程詳細ページ（share_idで取得・表示） |
| `.env.local` | APIキー（Git管理外） |
| `.env.example` | 環境変数キー名一覧（Git管理） |

---

## Task 1: プロジェクト基盤の構築

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json` (create-next-appが生成)
- Create: `.env.local`
- Create: `.env.example`

- [ ] **Step 1: Node.jsのバージョン確認**

```bash
node -v
```

Expected: `v20.x.x` 以上。表示されない場合は `brew install node` を実行。

- [ ] **Step 2: Next.jsプロジェクトを現在のディレクトリに作成**

```bash
cd /Users/naotoo/Documents/ClaudeCode/tripServiceMVP
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --yes
```

Expected: 「Success! Created ... at ...」と表示され、`package.json`, `src/`, `public/` などが生成される。

- [ ] **Step 3: 追加パッケージのインストール**

```bash
npm install @supabase/supabase-js @google/generative-ai cheerio
npm install -D jest @types/jest jest-environment-jsdom
```

Expected: `added XXX packages` と表示される。

- [ ] **Step 4: devサーバーの起動確認**

```bash
npm run dev
```

Expected: `▲ Next.js 15.x.x` と表示される。ブラウザで `http://localhost:3000` を開き、Next.jsのデフォルト画面が表示されることを確認。確認後 Ctrl+C で停止。

- [ ] **Step 5: .env.local を作成**

```bash
cat > .env.local << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOF
```

- [ ] **Step 6: .env.example を作成**

```bash
cat > .env.example << 'EOF'
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EOF
```

- [ ] **Step 7: .gitignore に .env.local が含まれていることを確認**

```bash
grep ".env.local" .gitignore
```

Expected: `.env.local` が表示される。表示されない場合は `.gitignore` に `\n.env.local` を追記する。

- [ ] **Step 8: Gitリポジトリを初期化して最初のコミット**

```bash
git init
git add .gitignore package.json package-lock.json next.config.ts tailwind.config.ts tsconfig.json .env.example src/ public/ CLAUDE.md memo/ docs/
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

Expected: `[main (root-commit) xxxxxxx] feat: initialize Next.js project...` と表示される。

---

## Task 2: TypeScript型定義

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: types/index.ts を作成**

```typescript
// src/types/index.ts
export type SpotType = '観光' | 'グルメ' | '移動' | '宿泊' | 'その他'

export interface Spot {
    time: string
    name: string
    description: string
    duration_minutes: number
    type: SpotType
}

export interface ItineraryDay {
    day: number
    label: string
    spots: Spot[]
}

export interface Itinerary {
    days: ItineraryDay[]
}

export interface Trip {
    id: string
    share_id: string
    title: string
    destination: string
    duration_days: number
    wishes?: string
    source_url?: string
    itinerary: Itinerary
    created_at: string
}

export interface GenerateInput {
    destination: string
    duration_days: number
    wishes?: string
}
```

- [ ] **Step 2: 型チェックが通ることを確認**

```bash
npx tsc --noEmit
```

Expected: エラーなしで終了（何も出力されない）。

- [ ] **Step 3: コミット**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions for Trip and Itinerary"
```

---

## Task 3: Jestのセットアップ

**Files:**
- Create: `jest.config.ts`

- [ ] **Step 1: jest.config.ts を作成**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
}

export default createJestConfig(config)
```

- [ ] **Step 2: package.json に test スクリプトが存在することを確認**

```bash
grep '"test"' package.json
```

Expected: `"test": "jest"` が表示される。存在しない場合は `package.json` の `"scripts"` に `"test": "jest"` を追加する。

- [ ] **Step 3: テストが実行できることをドライランで確認**

```bash
npx jest --passWithNoTests
```

Expected: `Test Suites: 0 skipped, 0 total` のような出力。エラーがないことを確認。

- [ ] **Step 4: コミット**

```bash
git add jest.config.ts package.json
git commit -m "feat: configure Jest for Next.js TypeScript project"
```

---

## Task 4: Supabaseクライアントとデータベーススキーマ

**Files:**
- Create: `src/lib/db/supabase.ts`

- [ ] **Step 1: Supabaseプロジェクトを作成（ブラウザ操作）**

1. https://supabase.com にアクセスしてGoogleログイン
2. 「New project」をクリック
3. Project name: `trip-service-mvp`、Region: `Northeast Asia (Tokyo)` を選択
4. 「Create new project」をクリック（2〜3分待つ）
5. Settings → API から `Project URL` と `anon public` キーをコピー

- [ ] **Step 2: .env.local にSupabaseの値を設定**

`.env.local` を開き、以下の値を実際のものに書き換える：
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] **Step 3: trips テーブルをSupabaseのSQL Editorで作成**

Supabaseダッシュボードの「SQL Editor」を開き、以下を実行：

```sql
create table trips (
    id uuid primary key default gen_random_uuid(),
    share_id text unique not null,
    title text not null,
    destination text not null,
    duration_days integer not null,
    wishes text,
    source_url text,
    itinerary jsonb not null,
    created_at timestamptz default now()
);

alter table trips enable row level security;

create policy "Anyone can read trips"
    on trips for select using (true);

create policy "Anyone can insert trips"
    on trips for insert with check (true);
```

Expected: 「Success. No rows returned」と表示される。

- [ ] **Step 4: src/lib/db/supabase.ts を作成**

```typescript
// src/lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

- [ ] **Step 5: コミット**

```bash
git add src/lib/db/supabase.ts
git commit -m "feat: add Supabase client initialization"
```

---

## Task 5: 旅程のDB操作関数（TDD）

**Files:**
- Create: `src/lib/db/trips.ts`
- Create: `src/lib/db/__tests__/trips.test.ts`

- [ ] **Step 1: テストファイルを作成（失敗するテストを書く）**

```typescript
// src/lib/db/__tests__/trips.test.ts
import { generateShareId } from '../trips'

describe('generateShareId', () => {
    it('8文字の英数字文字列を返す', () => {
        const id = generateShareId()
        expect(id).toHaveLength(8)
        expect(id).toMatch(/^[a-z0-9]{8}$/)
    })

    it('呼び出すたびに異なる値を返す', () => {
        const ids = new Set(Array.from({ length: 20 }, generateShareId))
        expect(ids.size).toBeGreaterThan(15)
    })
})
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
npx jest src/lib/db/__tests__/trips.test.ts
```

Expected: `FAIL` と表示され、`Cannot find module '../trips'` エラーが出る。

- [ ] **Step 3: trips.ts を実装**

```typescript
// src/lib/db/trips.ts
import { supabase } from './supabase'
import type { Trip, Itinerary } from '@/types'

export function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length: 8 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('')
}

export async function saveTrip(params: {
    title: string
    destination: string
    duration_days: number
    wishes?: string
    source_url?: string
    itinerary: Itinerary
}): Promise<Trip> {
    const share_id = generateShareId()
    const { data, error } = await supabase
        .from('trips')
        .insert({ ...params, share_id })
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data as Trip
}

export async function getTripByShareId(share_id: string): Promise<Trip | null> {
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('share_id', share_id)
        .single()
    if (error) return null
    return data as Trip
}
```

- [ ] **Step 4: テストが通ることを確認**

```bash
npx jest src/lib/db/__tests__/trips.test.ts
```

Expected:
```
PASS src/lib/db/__tests__/trips.test.ts
  generateShareId
    ✓ 8文字の英数字文字列を返す
    ✓ 呼び出すたびに異なる値を返す
```

- [ ] **Step 5: コミット**

```bash
git add src/lib/db/trips.ts src/lib/db/__tests__/trips.test.ts
git commit -m "feat: add trip DB operations with TDD for generateShareId"
```

---

## Task 6: Gemini AIモジュール（TDD）

**Files:**
- Create: `src/lib/ai/gemini.ts`
- Create: `src/lib/ai/__tests__/gemini.test.ts`

- [ ] **Step 1: Gemini APIキーを取得（ブラウザ操作）**

1. https://aistudio.google.com にアクセスしてGoogleログイン
2. 「Get API Key」→「Create API key」をクリック
3. 生成されたキーをコピー
4. `.env.local` の `GEMINI_API_KEY=` の後ろに貼り付ける

- [ ] **Step 2: テストファイルを作成（失敗するテストを書く）**

```typescript
// src/lib/ai/__tests__/gemini.test.ts
import { buildGeneratePrompt, parseTripJson } from '../gemini'

describe('buildGeneratePrompt', () => {
    it('行き先・日数・やりたいことをプロンプトに含む', () => {
        const prompt = buildGeneratePrompt({
            destination: '沖縄',
            duration_days: 3,
            wishes: '海を楽しみたい',
        })
        expect(prompt).toContain('沖縄')
        expect(prompt).toContain('3日間')
        expect(prompt).toContain('海を楽しみたい')
    })

    it('wishesが未指定の場合は「なし」を含む', () => {
        const prompt = buildGeneratePrompt({ destination: '東京', duration_days: 2 })
        expect(prompt).toContain('なし')
    })
})

describe('parseTripJson', () => {
    it('正常なJSONからtitleとitineraryを取り出す', () => {
        const raw = JSON.stringify({
            title: '沖縄3日間の旅',
            days: [{ day: 1, label: '1日目', spots: [] }],
        })
        const result = parseTripJson(raw)
        expect(result.title).toBe('沖縄3日間の旅')
        expect(result.itinerary.days).toHaveLength(1)
    })

    it('```json コードフェンスを除去してパースできる', () => {
        const raw = '```json\n{"title":"test","days":[]}\n```'
        const result = parseTripJson(raw)
        expect(result.title).toBe('test')
    })

    it('不正なJSONの場合はエラーを投げる', () => {
        expect(() => parseTripJson('invalid json')).toThrow()
    })
})
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
npx jest src/lib/ai/__tests__/gemini.test.ts
```

Expected: `FAIL` と表示され、`Cannot find module '../gemini'` エラーが出る。

- [ ] **Step 4: gemini.ts を実装**

```typescript
// src/lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateInput, Itinerary } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export function buildGeneratePrompt(input: GenerateInput): string {
    return `あなたは旅行プランニングの専門家です。以下の条件で旅行プランを作成してください。

行き先: ${input.destination}
日数: ${input.duration_days}日間
やりたいこと・希望: ${input.wishes ?? 'なし'}

以下のJSON形式のみで返してください（説明文は不要）：
{
  "title": "旅行タイトル",
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "スポット名",
          "description": "簡単な説明（30文字以内）",
          "duration_minutes": 90,
          "type": "観光"
        }
      ]
    }
  ]
}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれかを使用してください。移動時間も含めたリアルなスケジュールにしてください。`
}

export function buildScrapePrompt(articleText: string): string {
    return `以下のブログ記事から旅行プランを抽出し、旅程を作成してください。

ブログ記事:
${articleText.slice(0, 8000)}

以下のJSON形式のみで返してください（説明文は不要）：
{
  "title": "旅行タイトル",
  "destination": "行き先",
  "duration_days": 3,
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "スポット名",
          "description": "簡単な説明（30文字以内）",
          "duration_minutes": 90,
          "type": "観光"
        }
      ]
    }
  ]
}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれかを使用してください。`
}

export function parseTripJson(raw: string): {
    title: string
    destination?: string
    duration_days?: number
    itinerary: Itinerary
} {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const { title, destination, duration_days, days } = parsed
    return { title, destination, duration_days, itinerary: { days: days ?? [] } }
}

export async function generateTripFromInput(
    input: GenerateInput
): Promise<{ title: string; itinerary: Itinerary }> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(buildGeneratePrompt(input))
    const { title, itinerary } = parseTripJson(result.response.text())
    return { title, itinerary }
}

export async function generateTripFromArticle(articleText: string): Promise<{
    title: string
    destination: string
    duration_days: number
    itinerary: Itinerary
}> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(buildScrapePrompt(articleText))
    const { title, destination, duration_days, itinerary } = parseTripJson(result.response.text())
    return {
        title,
        destination: destination ?? '不明',
        duration_days: duration_days ?? 1,
        itinerary,
    }
}
```

- [ ] **Step 5: テストが通ることを確認**

```bash
npx jest src/lib/ai/__tests__/gemini.test.ts
```

Expected:
```
PASS src/lib/ai/__tests__/gemini.test.ts
  buildGeneratePrompt
    ✓ 行き先・日数・やりたいことをプロンプトに含む
    ✓ wishesが未指定の場合は「なし」を含む
  parseTripJson
    ✓ 正常なJSONからtitleとitineraryを取り出す
    ✓ ```json コードフェンスを除去してパースできる
    ✓ 不正なJSONの場合はエラーを投げる
```

- [ ] **Step 6: コミット**

```bash
git add src/lib/ai/gemini.ts src/lib/ai/__tests__/gemini.test.ts
git commit -m "feat: add Gemini AI module with TDD for prompt building and JSON parsing"
```

---

## Task 7: URLスクレイパーモジュール（TDD）

**Files:**
- Create: `src/lib/scraper/index.ts`
- Create: `src/lib/scraper/__tests__/index.test.ts`

- [ ] **Step 1: テストファイルを作成（失敗するテストを書く）**

```typescript
// src/lib/scraper/__tests__/index.test.ts
import { extractTextFromHtml } from '../index'

describe('extractTextFromHtml', () => {
    it('scriptタグとstyleタグの内容を除去する', () => {
        const html = `
            <html>
                <head>
                    <script>alert('hello')</script>
                    <style>body { color: red }</style>
                </head>
                <body><p>旅行記事の本文です。</p></body>
            </html>
        `
        const result = extractTextFromHtml(html)
        expect(result).toContain('旅行記事の本文です。')
        expect(result).not.toContain("alert('hello')")
        expect(result).not.toContain('color: red')
    })

    it('nav・header・footerの内容を除去する', () => {
        const html = `
            <body>
                <nav>メニュー</nav>
                <main><p>本文テキスト</p></main>
                <footer>フッター</footer>
            </body>
        `
        const result = extractTextFromHtml(html)
        expect(result).toContain('本文テキスト')
        expect(result).not.toContain('メニュー')
        expect(result).not.toContain('フッター')
    })

    it('連続するスペースを1つにまとめる', () => {
        const html = '<body><p>Hello   World</p></body>'
        const result = extractTextFromHtml(html)
        expect(result).toBe('Hello World')
    })
})
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
npx jest src/lib/scraper/__tests__/index.test.ts
```

Expected: `FAIL` と表示され、`Cannot find module '../index'` エラーが出る。

- [ ] **Step 3: scraper/index.ts を実装**

```typescript
// src/lib/scraper/index.ts
import * as cheerio from 'cheerio'

export function extractTextFromHtml(html: string): string {
    const $ = cheerio.load(html)
    $('script, style, nav, header, footer, aside, [class*="ad"], [class*="banner"]').remove()
    return $('body').text().replace(/\s+/g, ' ').trim()
}

export async function scrapeUrl(url: string): Promise<string> {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TripServiceBot/1.0)' },
    })
    if (!response.ok) throw new Error(`URLの取得に失敗しました: ${response.status}`)
    const html = await response.text()
    return extractTextFromHtml(html)
}
```

- [ ] **Step 4: テストが通ることを確認**

```bash
npx jest src/lib/scraper/__tests__/index.test.ts
```

Expected:
```
PASS src/lib/scraper/__tests__/index.test.ts
  extractTextFromHtml
    ✓ scriptタグとstyleタグの内容を除去する
    ✓ nav・header・footerの内容を除去する
    ✓ 連続するスペースを1つにまとめる
```

- [ ] **Step 5: 全テストが通ることを確認**

```bash
npx jest
```

Expected: `Test Suites: 3 passed, 3 total` / `Tests: 10 passed, 10 total`

- [ ] **Step 6: コミット**

```bash
git add src/lib/scraper/index.ts src/lib/scraper/__tests__/index.test.ts
git commit -m "feat: add URL scraper module with TDD for HTML text extraction"
```

---

## Task 8: API Route - POST /api/generate

**Files:**
- Create: `src/app/api/generate/route.ts`

- [ ] **Step 1: route.ts を作成**

```typescript
// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateTripFromInput } from '@/lib/ai/gemini'
import { saveTrip } from '@/lib/db/trips'
import type { GenerateInput } from '@/types'

export async function POST(req: NextRequest) {
    try {
        const body: GenerateInput = await req.json()
        const { destination, duration_days, wishes } = body

        if (!destination || !duration_days) {
            return NextResponse.json(
                { error: '行き先と日数は必須です' },
                { status: 400 }
            )
        }

        const { title, itinerary } = await generateTripFromInput({
            destination,
            duration_days,
            wishes,
        })
        const trip = await saveTrip({ title, destination, duration_days, wishes, itinerary })

        return NextResponse.json({ trip_id: trip.id, share_id: trip.share_id })
    } catch (error) {
        console.error('generate error:', error)
        return NextResponse.json(
            { error: '旅程の生成に失敗しました' },
            { status: 500 }
        )
    }
}
```

- [ ] **Step 2: devサーバーを起動してAPIを手動テスト**

```bash
npm run dev
```

別ターミナルで：

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"destination":"京都","duration_days":2,"wishes":"寺と抹茶を楽しみたい"}'
```

Expected: `{"trip_id":"...","share_id":"xxxxxxxx"}` が返る。Supabaseのダッシュボードで trips テーブルにレコードが追加されていることを確認。

- [ ] **Step 3: コミット**

```bash
git add src/app/api/generate/route.ts
git commit -m "feat: add POST /api/generate endpoint for AI trip generation"
```

---

## Task 9: API Route - GET /api/trips/[share_id]

**Files:**
- Create: `src/app/api/trips/[share_id]/route.ts`

- [ ] **Step 1: route.ts を作成**

```typescript
// src/app/api/trips/[share_id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getTripByShareId } from '@/lib/db/trips'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ share_id: string }> }
) {
    const { share_id } = await params
    const trip = await getTripByShareId(share_id)

    if (!trip) {
        return NextResponse.json({ error: '旅程が見つかりません' }, { status: 404 })
    }
    return NextResponse.json(trip)
}
```

- [ ] **Step 2: APIを手動テスト（Task 8で取得した share_id を使用）**

```bash
# Task 8 のレスポンスで得た share_id を使う（例: abc12345）
curl http://localhost:3000/api/trips/abc12345
```

Expected: 旅程のJSONデータが返る。

- [ ] **Step 3: 存在しないIDのテスト**

```bash
curl http://localhost:3000/api/trips/nonexistent
```

Expected: `{"error":"旅程が見つかりません"}` とステータス 404 が返る。

- [ ] **Step 4: コミット**

```bash
git add src/app/api/trips/
git commit -m "feat: add GET /api/trips/[share_id] endpoint"
```

---

## Task 10: API Route - POST /api/scrape

**Files:**
- Create: `src/app/api/scrape/route.ts`

- [ ] **Step 1: route.ts を作成**

```typescript
// src/app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper'
import { generateTripFromArticle } from '@/lib/ai/gemini'
import { saveTrip } from '@/lib/db/trips'

export async function POST(req: NextRequest) {
    try {
        const { url }: { url: string } = await req.json()

        if (!url) {
            return NextResponse.json({ error: 'URLは必須です' }, { status: 400 })
        }

        const articleText = await scrapeUrl(url)
        const { title, destination, duration_days, itinerary } =
            await generateTripFromArticle(articleText)
        const trip = await saveTrip({
            title,
            destination,
            duration_days,
            source_url: url,
            itinerary,
        })

        return NextResponse.json({ trip_id: trip.id, share_id: trip.share_id })
    } catch (error) {
        console.error('scrape error:', error)
        return NextResponse.json(
            { error: '旅程の取得に失敗しました。URLを確認してください。' },
            { status: 500 }
        )
    }
}
```

- [ ] **Step 2: コミット**

```bash
git add src/app/api/scrape/route.ts
git commit -m "feat: add POST /api/scrape endpoint for URL-based trip generation"
```

---

## Task 11: トップページのUI（条件入力フォーム）

**Files:**
- Create: `src/components/trips/GenerateForm.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: GenerateForm.tsx を作成**

```typescript
// src/components/trips/GenerateForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GenerateForm() {
    const router = useRouter()
    const [destination, setDestination] = useState('')
    const [durationDays, setDurationDays] = useState(2)
    const [wishes, setWishes] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination,
                    duration_days: durationDays,
                    wishes,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            router.push(`/trips/${data.share_id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : '旅程の生成に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">行き先</label>
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="例：沖縄"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">日数</label>
                <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option key={n} value={n}>{n}日間</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">
                    やりたいこと <span className="text-gray-400 text-xs">（任意）</span>
                </label>
                <textarea
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    placeholder="例：海と食事を楽しみたい、温泉に入りたい"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
                {loading ? '生成中...' : '旅程を生成する'}
            </button>
        </form>
    )
}
```

- [ ] **Step 2: page.tsx を更新**

```typescript
// src/app/page.tsx
import GenerateForm from '@/components/trips/GenerateForm'

export default function Home() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-2">旅程ジェネレーター</h1>
            <p className="text-center text-gray-500 mb-8">
                AIが旅行プランを自動で作成します
            </p>
            <section>
                <h2 className="text-lg font-semibold mb-4">条件から作成</h2>
                <GenerateForm />
            </section>
        </main>
    )
}
```

- [ ] **Step 3: ブラウザで動作確認**

`http://localhost:3000` を開き：
1. 行き先・日数・やりたいことを入力
2. 「旅程を生成する」をクリック
3. 「生成中...」と表示されること（20〜30秒）
4. `/trips/[share_id]` に遷移すること（まだページが存在しないので404でOK）

- [ ] **Step 4: コミット**

```bash
git add src/components/trips/GenerateForm.tsx src/app/page.tsx
git commit -m "feat: add top page with trip condition input form"
```

---

## Task 12: 旅程詳細ページ

**Files:**
- Create: `src/components/trips/ItineraryView.tsx`
- Create: `src/app/trips/[id]/page.tsx`

- [ ] **Step 1: ItineraryView.tsx を作成**

```typescript
// src/components/trips/ItineraryView.tsx
import type { Trip } from '@/types'

const typeColors: Record<string, string> = {
    観光: 'bg-blue-100 text-blue-700',
    グルメ: 'bg-orange-100 text-orange-700',
    移動: 'bg-gray-100 text-gray-600',
    宿泊: 'bg-purple-100 text-purple-700',
    その他: 'bg-green-100 text-green-700',
}

export default function ItineraryView({ trip }: { trip: Trip }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{trip.title}</h1>
                <p className="text-gray-500 mt-1">
                    {trip.destination} · {trip.duration_days}日間
                </p>
                {trip.source_url && (
                    <p className="text-xs text-gray-400 mt-1">
                        参照元:{' '}
                        <a href={trip.source_url} className="underline" target="_blank" rel="noopener noreferrer">
                            {trip.source_url}
                        </a>
                    </p>
                )}
            </div>
            {trip.itinerary.days.map((day) => (
                <div key={day.day}>
                    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3">
                        {day.label}
                    </h2>
                    <div className="space-y-3">
                        {day.spots.map((spot, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="text-sm text-gray-400 w-12 shrink-0 pt-0.5 tabular-nums">
                                    {spot.time}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{spot.name}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${typeColors[spot.type] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {spot.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{spot.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
```

- [ ] **Step 2: app/trips/[id]/page.tsx を作成**

```typescript
// src/app/trips/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getTripByShareId } from '@/lib/db/trips'
import ItineraryView from '@/components/trips/ItineraryView'

export default async function TripPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const trip = await getTripByShareId(id)
    if (!trip) notFound()

    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <ItineraryView trip={trip} />
        </main>
    )
}
```

- [ ] **Step 3: 動作確認**

1. `http://localhost:3000` でフォームから旅程を生成
2. `/trips/[share_id]` に遷移して旅程が表示されることを確認
3. スポットのタイムライン・タグが正しく表示されることを確認

- [ ] **Step 4: コミット**

```bash
git add src/components/trips/ItineraryView.tsx src/app/trips/
git commit -m "feat: add trip detail page with itinerary timeline view"
```

---

## Task 13: 共有URLボタン

**Files:**
- Create: `src/components/trips/ShareButton.tsx`
- Modify: `src/app/trips/[id]/page.tsx`

- [ ] **Step 1: ShareButton.tsx を作成**

```typescript
// src/components/trips/ShareButton.tsx
'use client'
import { useState } from 'react'

export default function ShareButton({ shareId }: { shareId: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        const url = `${window.location.origin}/trips/${shareId}`
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="w-full border border-blue-600 text-blue-600 rounded-lg py-3 font-medium hover:bg-blue-50 transition-colors"
        >
            {copied ? '✓ コピーしました！' : 'このURLをシェアする'}
        </button>
    )
}
```

- [ ] **Step 2: trips/[id]/page.tsx に ShareButton を追加**

```typescript
// src/app/trips/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getTripByShareId } from '@/lib/db/trips'
import ItineraryView from '@/components/trips/ItineraryView'
import ShareButton from '@/components/trips/ShareButton'

export default async function TripPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const trip = await getTripByShareId(id)
    if (!trip) notFound()

    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <ItineraryView trip={trip} />
            <div className="mt-8 space-y-3">
                <ShareButton shareId={trip.share_id} />
                <a
                    href="/"
                    className="block w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                    新しい旅程を作成する
                </a>
            </div>
        </main>
    )
}
```

- [ ] **Step 3: 動作確認**

1. 旅程詳細ページで「このURLをシェアする」をクリック
2. 「✓ コピーしました！」に変わることを確認
3. 新しいタブでコピーしたURLを開き、同じ旅程が表示されることを確認

- [ ] **Step 4: コミット**

```bash
git add src/components/trips/ShareButton.tsx src/app/trips/
git commit -m "feat: add share URL copy button to trip detail page"
```

---

## Task 14: トップページにURLタブを追加

**Files:**
- Create: `src/components/trips/UrlForm.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: UrlForm.tsx を作成**

```typescript
// src/components/trips/UrlForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UrlForm() {
    const router = useRouter()
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            router.push(`/trips/${data.share_id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : '旅程の取得に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">ブログ記事のURL</label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://travel-blog.example.com/okinawa"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                    旅行ブログのURLを貼り付けると、記事の内容から旅程を自動生成します
                </p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white rounded-lg py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
                {loading ? '記事を読み込み中...' : 'URLから旅程を作成する'}
            </button>
        </form>
    )
}
```

- [ ] **Step 2: page.tsx を更新して両フォームを配置**

```typescript
// src/app/page.tsx
import GenerateForm from '@/components/trips/GenerateForm'
import UrlForm from '@/components/trips/UrlForm'

export default function Home() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-2">旅程ジェネレーター</h1>
            <p className="text-center text-gray-500 mb-8">
                AIが旅行プランを自動で作成します
            </p>

            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">条件から作成</h2>
                <GenerateForm />
            </section>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-400">または</span>
                </div>
            </div>

            <section>
                <h2 className="text-lg font-semibold mb-4">ブログ記事URLから作成</h2>
                <UrlForm />
            </section>
        </main>
    )
}
```

- [ ] **Step 3: 動作確認**

1. `http://localhost:3000` で両フォームが表示されることを確認
2. URLフォームに旅行ブログのURLを入力して実行
3. 旅程詳細ページに遷移することを確認

- [ ] **Step 4: コミット**

```bash
git add src/components/trips/UrlForm.tsx src/app/page.tsx
git commit -m "feat: add URL-based trip generation form to top page"
```

---

## Task 15: UIの仕上げ（ローディング・エラー・スマホ対応）

**Files:**
- Create: `src/app/loading.tsx`
- Create: `src/app/trips/[id]/loading.tsx`
- Create: `src/app/not-found.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: グローバルローディング画面を作成**

```typescript
// src/app/loading.tsx
export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">読み込み中...</p>
            </div>
        </div>
    )
}
```

- [ ] **Step 2: 旅程詳細ページのローディングを作成**

```typescript
// src/app/trips/[id]/loading.tsx
export default function TripLoading() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-px bg-gray-200 my-6" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                ))}
            </div>
        </main>
    )
}
```

- [ ] **Step 3: 404ページを作成**

```typescript
// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
            <p className="text-6xl mb-4">🗺️</p>
            <h1 className="text-xl font-bold mb-2">旅程が見つかりません</h1>
            <p className="text-gray-500 text-sm mb-8">
                URLが正しいか確認してください
            </p>
            <Link
                href="/"
                className="inline-block bg-blue-600 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                トップに戻る
            </Link>
        </main>
    )
}
```

- [ ] **Step 4: layout.tsx のメタデータを更新**

`src/app/layout.tsx` を開き、`metadata` を以下に更新：

```typescript
export const metadata: Metadata = {
    title: '旅程ジェネレーター',
    description: 'AIで旅行プランを自動生成。ブログ記事URLからも旅程を作れます。',
}
```

- [ ] **Step 5: スマホで全ページを確認**

ブラウザのデベロッパーツール（F12）でモバイルビュー（iPhone SE: 375px）に切り替え：
1. トップページ：フォームが縦に並んで操作しやすいことを確認
2. 旅程詳細ページ：タイムラインが読みやすいことを確認
3. 共有ボタンが押しやすいサイズであることを確認

- [ ] **Step 6: コミット**

```bash
git add src/app/loading.tsx src/app/trips/[id]/loading.tsx src/app/not-found.tsx src/app/layout.tsx
git commit -m "feat: add loading states, 404 page, and update metadata"
```

---

## Task 16: GitHubへのpushとVercelデプロイ

- [ ] **Step 1: GitHubにリポジトリを作成（ブラウザ操作）**

1. https://github.com/naotoo-ui にアクセス
2. 「+」→「New repository」をクリック
3. Repository name: `trip-service-mvp`
4. Visibility: Private（最初は非公開でOK）
5. 「Create repository」をクリック

- [ ] **Step 2: リモートを追加してpush**

```bash
git remote add origin https://github.com/naotoo-ui/trip-service-mvp.git
git branch -M main
git push -u origin main
```

Expected: `Branch 'main' set up to track remote branch 'main' from 'origin'`

- [ ] **Step 3: Vercelにデプロイ（ブラウザ操作）**

1. https://vercel.com にアクセスしてGitHubアカウントでログイン
2. 「Add New...」→「Project」をクリック
3. `trip-service-mvp` を選択して「Import」
4. 「Environment Variables」を展開し、以下を追加：
   - `GEMINI_API_KEY` = Gemini APIキーの値
   - `NEXT_PUBLIC_SUPABASE_URL` = SupabaseのURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabaseのanon key
5. 「Deploy」をクリック（2〜3分待つ）

- [ ] **Step 4: 本番URLで動作確認**

Vercelが発行した `https://trip-service-mvp-xxxx.vercel.app` にアクセスし：
1. トップページが表示されること
2. 旅程が生成されること
3. 共有URLが機能すること

- [ ] **Step 5: カスタムドメイン設定（任意）**

Vercelダッシュボードの「Settings」→「Domains」から独自ドメインを設定できる（後回しでOK）。

---

## 完了基準チェックリスト

- [ ] `npx jest` が全テスト PASS する
- [ ] `http://localhost:3000` で条件入力から旅程が生成できる
- [ ] ブログURLから旅程が生成できる
- [ ] 生成した旅程がSupabaseに保存される
- [ ] `/trips/[share_id]` で旅程詳細が表示される
- [ ] 共有URLがコピーできる
- [ ] コピーしたURLで別ブラウザから同じ旅程が見える
- [ ] Vercelの本番URLで全機能が動作する
- [ ] スマホで快適に使える
