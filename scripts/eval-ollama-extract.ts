// scripts/eval-ollama-extract.ts
// 用途: 実 Ollama に対して generateTripFromArticle を実行し、品質を確認する
// 実行: USE_OLLAMA=true npx ts-node --compiler-options '{"module":"commonjs"}' scripts/eval-ollama-extract.ts

import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SAMPLE_ARTICLES = [
    {
        name: '京都2泊3日',
        text: `京都2泊3日女子旅レポート

1日目:京都駅着、清水寺、二寧坂、八坂神社、祇園、先斗町で京懐石。
2日目:嵐山(竹林、天龍寺、渡月橋、嵯峨野トロッコ列車)、金閣寺、龍安寺、仁和寺、北野天満宮。
3日目:伏見稲荷大社、東福寺、三十三間堂、京都駅で「中村藤吉本店」のお土産。`,
    },
    {
        name: '沖縄3泊4日',
        text: `沖縄3泊4日 家族旅行

1日目:那覇空港、国際通り、首里城公園、ホテルチェックイン(万座ビーチ)。
2日目:美ら海水族館、岸本食堂のソーキそば、古宇利島、ハートロック、ホテルバイキング。
3日目:青の洞窟シュノーケリング、なかむらそば、琉球村、ステーキハウス88。
4日目:DFSギャラリア、ジャッキーステーキハウス、那覇空港。`,
    },
]

async function main() {
    const env = process.env as Record<string, string | undefined>
    env.USE_OLLAMA = 'true'
    env.NODE_ENV = 'development'

    const { generateTripFromArticle } = await import('../src/lib/ai/gemini')

    console.log('=== generateTripFromArticle 実機テスト(Ollama 経由) ===\n')

    for (const article of SAMPLE_ARTICLES) {
        console.log(`--- ${article.name} ---`)
        const start = Date.now()
        try {
            const result = await generateTripFromArticle(article.text)
            const elapsed = Date.now() - start
            const totalSpots = result.itinerary.days.reduce(
                (acc, d) => acc + d.spots.length,
                0,
            )
            console.log(`  ✅ 成功 (${elapsed}ms)`)
            console.log(`  Title: ${result.title}`)
            console.log(`  Destination: ${result.destination}`)
            console.log(`  Days: ${result.duration_days} / Spots: ${totalSpots}`)
            for (const day of result.itinerary.days) {
                console.log(
                    `    Day ${day.day} (${day.label}): ${day.spots.map(s => s.name).join(', ')}`,
                )
            }
        } catch (err) {
            console.log(`  ❌ 失敗: ${err instanceof Error ? err.message : err}`)
        }
        console.log()
    }
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
