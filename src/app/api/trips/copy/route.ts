import { NextRequest, NextResponse } from 'next/server'
import { copyTrip } from '@/lib/db/trips'

export const maxDuration = 30

export async function POST(req: NextRequest) {
    try {
        const { share_id }: { share_id: string } = await req.json()
        if (!share_id) return NextResponse.json({ error: 'share_id は必須です' }, { status: 400 })
        const newTrip = await copyTrip(share_id)
        return NextResponse.json({ share_id: newTrip.share_id })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'コピーに失敗しました'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
