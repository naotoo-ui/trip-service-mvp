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
