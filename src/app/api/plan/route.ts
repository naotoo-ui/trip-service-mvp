import { NextRequest, NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper'
import { generateTripFromPlan } from '@/lib/ai/gemini'
import { saveTrip } from '@/lib/db/trips'
import type { PlanInput } from '@/types'

export const maxDuration = 60

export async function POST(req: NextRequest) {
    try {
        const body: PlanInput = await req.json()
        const { destinations, duration_days, start_date, urls, wishes } = body

        if (!destinations?.length || !duration_days) {
            return NextResponse.json({ error: '目的地と日数は必須です' }, { status: 400 })
        }

        // 複数 URL を並行スクレイプ（失敗した URL は無視）
        let articleTexts: string[] = []
        if (urls?.length) {
            const results = await Promise.allSettled(
                urls.slice(0, 5).map(url => scrapeUrl(url))
            )
            articleTexts = results
                .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
                .map(r => r.value)
        }

        const { title, itinerary } = await generateTripFromPlan(body, articleTexts)
        const itineraryWithDate = start_date ? { ...itinerary, start_date } : itinerary
        const destination = destinations.join(' / ')

        const trip = await saveTrip({
            title,
            destination,
            duration_days,
            wishes,
            source_url: urls?.[0],
            itinerary: itineraryWithDate,
        })

        return NextResponse.json({
            trip_id: trip.id,
            share_id: trip.share_id,
            edit_token: trip.edit_token,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('plan error:', message)
        return NextResponse.json(
            { error: `旅程の生成に失敗しました: ${message}` },
            { status: 500 }
        )
    }
}
