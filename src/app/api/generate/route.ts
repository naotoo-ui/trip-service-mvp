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
