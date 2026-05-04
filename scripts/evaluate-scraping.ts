/**
 * スクレイピング評価スクリプト
 * 旅行ブログURLに対してスクレイピング→Gemini生成を実行し品質を評価する
 */
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { scrapeUrl } from '../src/lib/scraper/index.js'
import { generateTripFromArticle } from '../src/lib/ai/gemini.js'

// テスト対象URL（カテゴリ別に代表を選択）
const TEST_URLS = [
    // じゃらん旅行記（構造明確）
    { url: 'https://www.jalan.net/travel-journal/000026149/', category: 'じゃらん', desc: '北海道3泊4日' },
    // るるぶ（観光地名が整理されている）
    { url: 'https://plus.rurubu.jp/article/lw2q65yu6', category: 'るるぶ', desc: '沖縄2泊3日モデルコース' },
    // はてなブログ（時刻付きが多い）
    { url: 'https://hitorijikan-nico2.hatenablog.com/entry/trip/kyoto-nara-matome-202304', category: 'はてな', desc: '京都・奈良2泊3日' },
    // フォートラベル（日程構造明確）
    { url: 'https://4travel.jp/travelogue/11916960', category: 'フォートラベル', desc: '沖縄旅行記' },
    // note（自由記述・非構造化）
    { url: 'https://note.com/ymstekc/n/n12bdf8be63a6', category: 'note', desc: '東京ノープラン旅' },
    // アメブロ国内
    { url: 'https://ameblo.jp/tabiakari/entry-12961531031.html', category: 'アメブロ国内', desc: '沖縄2泊3日' },
    // アメブロ海外
    { url: 'https://ameblo.jp/riona0777/entry-12913602540.html', category: 'アメブロ海外', desc: '韓国2泊3日' },
    // はてな九州
    { url: 'https://nt-kaokatsu.hatenablog.com/entry/2024/03/24/181815', category: 'はてな', desc: '九州一周5泊6日' },
]

interface EvalResult {
    url: string
    category: string
    desc: string
    status: 'success' | 'scrape_failed' | 'ai_failed' | 'parse_failed'
    scrapeTextLength?: number
    title?: string
    destination?: string
    duration_days?: number
    dayCount?: number
    totalSpots?: number
    hasTimeInfo?: boolean
    issues: string[]
    durationMs: number
}

function evaluateQuality(result: EvalResult): void {
    if (result.status !== 'success') return

    if (!result.title || result.title === '') {
        result.issues.push('タイトルが空')
    }
    if (!result.destination || result.destination === '不明') {
        result.issues.push('行き先が「不明」')
    }
    if (!result.duration_days || result.duration_days < 1) {
        result.issues.push('日数が不正')
    }
    if (!result.dayCount || result.dayCount === 0) {
        result.issues.push('日程データなし')
    } else if (result.duration_days && result.dayCount !== result.duration_days) {
        result.issues.push(`日数不一致: ${result.duration_days}日間なのに${result.dayCount}日分のデータ`)
    }
    if (!result.totalSpots || result.totalSpots < 3) {
        result.issues.push(`スポット数が少ない(${result.totalSpots ?? 0}件)`)
    }
    if (!result.hasTimeInfo) {
        result.issues.push('時間情報なし')
    }
}

async function testUrl(entry: typeof TEST_URLS[0]): Promise<EvalResult> {
    const start = Date.now()
    const result: EvalResult = {
        url: entry.url,
        category: entry.category,
        desc: entry.desc,
        status: 'success',
        issues: [],
        durationMs: 0,
    }

    try {
        console.log(`  スクレイピング中...`)
        const text = await scrapeUrl(entry.url)
        result.scrapeTextLength = text.length

        if (text.length < 200) {
            result.status = 'scrape_failed'
            result.issues.push(`テキストが短すぎる(${text.length}文字)`)
            result.durationMs = Date.now() - start
            return result
        }

        console.log(`  Gemini生成中... (テキスト${text.length}文字)`)
        const trip = await generateTripFromArticle(text)

        result.title = trip.title
        result.destination = trip.destination
        result.duration_days = trip.duration_days
        result.dayCount = trip.itinerary.days.length
        result.totalSpots = trip.itinerary.days.reduce((sum, d) => sum + d.spots.length, 0)
        result.hasTimeInfo = trip.itinerary.days.some(d =>
            d.spots.some(s => s.time && s.time !== '')
        )

        evaluateQuality(result)

    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('scrape') || msg.includes('fetch') || msg.includes('ECONNREFUSED')) {
            result.status = 'scrape_failed'
        } else if (msg.includes('JSON') || msg.includes('parse')) {
            result.status = 'parse_failed'
        } else {
            result.status = 'ai_failed'
        }
        result.issues.push(msg.slice(0, 120))
    }

    result.durationMs = Date.now() - start
    return result
}

function printReport(results: EvalResult[]): void {
    console.log('\n' + '='.repeat(70))
    console.log('スクレイピング評価レポート')
    console.log('='.repeat(70))

    const success = results.filter(r => r.status === 'success')
    const successClean = success.filter(r => r.issues.length === 0)

    console.log(`\n総合スコア: ${successClean.length}/${results.length} (問題なし/${results.length}件)`)
    console.log(`成功: ${success.length}件 | 失敗: ${results.length - success.length}件`)

    console.log('\n--- 詳細結果 ---')
    for (const r of results) {
        const icon = r.status === 'success' && r.issues.length === 0 ? '✅' :
            r.status === 'success' ? '⚠️' : '❌'
        console.log(`\n${icon} [${r.category}] ${r.desc}`)
        console.log(`   URL: ${r.url}`)
        console.log(`   ステータス: ${r.status} (${(r.durationMs / 1000).toFixed(1)}秒)`)
        if (r.scrapeTextLength) console.log(`   テキスト長: ${r.scrapeTextLength}文字`)
        if (r.title) console.log(`   タイトル: ${r.title}`)
        if (r.destination) console.log(`   行き先: ${r.destination} / ${r.duration_days}日間`)
        if (r.dayCount !== undefined) console.log(`   日程: ${r.dayCount}日分, スポット計${r.totalSpots}件, 時間情報:${r.hasTimeInfo ? 'あり' : 'なし'}`)
        if (r.issues.length > 0) console.log(`   課題: ${r.issues.join(' / ')}`)
    }

    // カテゴリ別成功率
    console.log('\n--- カテゴリ別成功率 ---')
    const categories = [...new Set(results.map(r => r.category))]
    for (const cat of categories) {
        const catResults = results.filter(r => r.category === cat)
        const catSuccess = catResults.filter(r => r.status === 'success').length
        console.log(`  ${cat}: ${catSuccess}/${catResults.length}`)
    }

    // 主な失敗パターン
    const allIssues = results.flatMap(r => r.issues)
    if (allIssues.length > 0) {
        console.log('\n--- 主な課題 ---')
        const issueMap = new Map<string, number>()
        for (const issue of allIssues) {
            const key = issue.slice(0, 50)
            issueMap.set(key, (issueMap.get(key) ?? 0) + 1)
        }
        for (const [issue, count] of [...issueMap.entries()].sort((a, b) => b[1] - a[1])) {
            console.log(`  (${count}件) ${issue}`)
        }
    }
}

async function main() {
    console.log(`評価開始: ${TEST_URLS.length}件のURLをテスト`)
    console.log('(レート制限対策で各リクエスト間に3秒待機)\n')

    const results: EvalResult[] = []

    for (let i = 0; i < TEST_URLS.length; i++) {
        const entry = TEST_URLS[i]
        console.log(`[${i + 1}/${TEST_URLS.length}] ${entry.category}: ${entry.desc}`)
        console.log(`  ${entry.url}`)

        const result = await testUrl(entry)
        results.push(result)

        // レート制限対策
        if (i < TEST_URLS.length - 1) {
            console.log(`  次まで5秒待機...`)
            await new Promise(r => setTimeout(r, 5000))
        }
    }

    printReport(results)

    // JSON保存
    const outputPath = path.join(__dirname, '../docs/superpowers/analysis/scraping-eval-results.json')
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
    console.log(`\n結果をJSONで保存: ${outputPath}`)
}

main().catch(console.error)
