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
    // edit_token はGETレスポンスに含めない（漏洩防止）
    const { edit_token: _, ...safe } = trip
    return NextResponse.json(safe)
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ share_id: string }> }
) {
    try {
        const { share_id } = await params
        const {
            itinerary, title, edit_token,
        }: { itinerary: Itinerary; title?: string; edit_token?: string } = await req.json()
        if (!itinerary) return NextResponse.json({ error: 'itinerary は必須です' }, { status: 400 })

        const result = await updateTripItinerary(share_id, itinerary, title, edit_token)
        if (!result.ok) {
            if (result.error === 'forbidden') {
                return NextResponse.json({ error: '編集権限がありません' }, { status: 403 })
            }
            if (result.error === 'not_found') {
                return NextResponse.json({ error: '旅程が見つかりません' }, { status: 404 })
            }
            return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 })
        }
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 })
    }
}
