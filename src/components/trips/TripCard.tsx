import Link from 'next/link'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import type { Trip } from '@/types'

type Props = {
    trip: Pick<Trip, 'share_id' | 'title' | 'destination' | 'duration_days' | 'created_at'>
}

export default function TripCard({ trip }: Props) {
    const emoji = getDestinationEmoji(trip.destination)
    const createdDate = new Date(trip.created_at).toLocaleDateString('ja-JP', {
        month: 'short', day: 'numeric',
    })

    return (
        <Link
            href={`/trips/${trip.share_id}`}
            style={{
                display: 'flex', flexDirection: 'column',
                background: 'white',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                textDecoration: 'none',
                color: 'inherit',
                height: '100%',
            }}
            className="hover:!shadow-md hover:!border-blue-200 hover:!-translate-y-0.5"
        >
            {/* カバー */}
            <div style={{
                height: 120,
                background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* 装飾円 */}
                <div style={{
                    position: 'absolute', top: -30, right: -30,
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -20, left: -20,
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />

                {/* 絵文字 */}
                <span style={{ fontSize: 56, lineHeight: 1, zIndex: 1 }}>{emoji}</span>

                {/* 日数バッジ */}
                <span style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(255,255,255,0.95)',
                    color: '#2563eb', fontSize: 11, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 99,
                    letterSpacing: '0.02em',
                }}>
                    {trip.duration_days === 1 ? '日帰り' : `${trip.duration_days}日間`}
                </span>
            </div>

            {/* 本文 */}
            <div style={{
                padding: '14px 16px 16px',
                display: 'flex', flexDirection: 'column', gap: 6,
                flex: 1,
            }}>
                <h3 style={{
                    fontSize: 14, fontWeight: 700, color: '#111827',
                    margin: 0, lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.8em',
                }}>{trip.title}</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                    📍 {trip.destination}
                </p>
                <p style={{
                    fontSize: 11, color: '#9ca3af', margin: 0,
                    marginTop: 'auto',
                }}>
                    {createdDate}に作成
                </p>
            </div>
        </Link>
    )
}
