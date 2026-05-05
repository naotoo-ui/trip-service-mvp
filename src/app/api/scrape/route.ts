import { NextRequest, NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper'
import { generateTripFromArticle } from '@/lib/ai/gemini'
import { saveTrip } from '@/lib/db/trips'

export const maxDuration = 60  // Vercel: 最大60秒まで延長

export async function POST(req: NextRequest) {
    try {
        const { url }: { url: string } = await req.json()

        if (!url) {
            return NextResponse.json({ error: 'URLは必須です' }, { status: 400 })
        }

        const articleText = await scrapeUrl(url)
        const { title, destination, duration_days, itinerary } = await generateTripFromArticle(articleText)
        const trip = await saveTrip({ title, destination, duration_days, source_url: url, itinerary })

        return NextResponse.json({ trip_id: trip.id, share_id: trip.share_id })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('scrape error:', message)
        return NextResponse.json(
            { error: `旅程の取得に失敗しました: ${message}` },
            { status: 500 }
        )
    }
}
