import { NextRequest, NextResponse } from 'next/server'
import { generateTripFromInput } from '@/lib/ai/gemini'
import { saveTrip } from '@/lib/db/trips'
import type { GenerateInput } from '@/types'

export const maxDuration = 60  // Vercel: 最大60秒まで延長

export async function POST(req: NextRequest) {
    try {
        const body: GenerateInput & { start_date?: string } = await req.json()
        const { destination, duration_days, wishes, start_date } = body

        if (!destination || !duration_days) {
            return NextResponse.json({ error: '行き先と日数は必須です' }, { status: 400 })
        }

        const { title, itinerary } = await generateTripFromInput({ destination, duration_days, wishes })

        const itineraryWithDate = start_date ? { ...itinerary, start_date } : itinerary

        const trip = await saveTrip({ title, destination, duration_days, wishes, itinerary: itineraryWithDate })

        return NextResponse.json({ trip_id: trip.id, share_id: trip.share_id })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('generate error:', message)
        return NextResponse.json(
            { error: `旅程の生成に失敗しました: ${message}` },
            { status: 500 }
        )
    }
}
