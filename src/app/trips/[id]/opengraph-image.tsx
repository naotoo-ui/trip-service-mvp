import { ImageResponse } from 'next/og'
import { getTripByShareId } from '@/lib/db/trips'

export const runtime = 'nodejs'
export const alt = '旅程プラン'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const trip = await getTripByShareId(id)

    const title       = trip?.title       ?? '旅程プラン'
    const destination = trip?.destination ?? ''
    const days        = trip?.duration_days ?? 0

    return new ImageResponse(
        (
            <div
                style={{
                    width: 1200, height: 630,
                    background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '60px 80px',
                    color: 'white', fontFamily: 'sans-serif',
                }}
            >
                {/* サービス名 */}
                <div style={{ fontSize: 28, color: '#bfdbfe', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                    ✈️ 旅程ジェネレーター
                </div>

                {/* 旅程タイトル */}
                <div
                    style={{
                        fontSize: title.length > 20 ? 52 : 64,
                        fontWeight: 700,
                        lineHeight: 1.25,
                        marginBottom: 40,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                    }}
                >
                    {title}
                </div>

                {/* 目的地・日数 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 32, color: '#bfdbfe' }}>
                    {destination && <span>📍 {destination}</span>}
                    {days > 0     && <span>🗓️ {days}日間</span>}
                </div>

                {/* 下部装飾バー */}
                <div
                    style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: 8,
                        background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                    }}
                />
            </div>
        ),
        { ...size }
    )
}
