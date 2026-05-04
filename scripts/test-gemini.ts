import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { generateTripFromArticle } from '../src/lib/ai/gemini.js'

async function main() {
    try {
        const result = await generateTripFromArticle(
            '沖縄旅行1日目。那覇空港に到着後、国際通りでランチ。午後は首里城を観光。夜は牧志市場で夕食。2日目は美ら海水族館へ。'
        )
        console.log('成功')
        console.log('タイトル:', result.title)
        console.log('行き先:', result.destination)
        console.log('日数:', result.duration_days)
        console.log('日程数:', result.itinerary.days.length)
    } catch (e) {
        console.error('エラー全文:', e instanceof Error ? e.message : String(e))
    }
}

main()
