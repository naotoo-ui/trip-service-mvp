import { NextRequest, NextResponse } from 'next/server'
import { getTripByShareId, updateTripItinerary } from '@/lib/db/trips'
import type { Itinerary } from '@/types'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ share_id: string }> }
) {
    const { share_id } = await params
    const trip = await getTripByShareId(share_id)
    if (!trip) return NextResponse.json({ error: '旅程が見つかりません' }, { status: 404 })
    return NextResponse.json(trip)
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ share_id: string }> }
) {
    try {
        const { share_id } = await params
        const { itinerary, title }: { itinerary: Itinerary; title?: string } = await req.json()
        if (!itinerary) return NextResponse.json({ error: 'itinerary は必須です' }, { status: 400 })
        await updateTripItinerary(share_id, itinerary, title)
        return NextResponse.json({ ok: true })
    } catch (err) {
        return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 })
    }
}
