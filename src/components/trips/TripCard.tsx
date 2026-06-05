import Link from 'next/link'
import Image from 'next/image'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import { getDestinationImage } from '@/lib/destinationImages'
import type { Trip } from '@/types'

type Props = {
    trip: Pick<Trip, 'share_id' | 'title' | 'destination' | 'duration_days' | 'created_at'>
}

export default function TripCard({ trip }: Props) {
    const emoji = getDestinationEmoji(trip.destination)
    const image = getDestinationImage(trip.destination)
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
            className="hover:!shadow-md hover:!border-blue-200 hover:!-translate-y-0.5 group"
        >
            {/* カバー */}
            <div style={{
                height: 140,
                position: 'relative',
                overflow: 'hidden',
                background: image
                    ? '#e5e7eb'
                    : 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
            }}>
                {image && (
                    <>
                        <Image
                            src={image}
                            alt={trip.destination}
                            fill
                            sizes="(max-width: 600px) 50vw, 280px"
                            style={{
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                            }}
                            className="group-hover:!scale-110"
                        />
                        {/* 下から上へ濃淡（テキスト読みやすく） */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
                        }} />
                    </>
                )}

                {/* 装飾円（画像が無い時のみ） */}
                {!image && (
                    <>
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
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 56, lineHeight: 1, zIndex: 1 }}>{emoji}</span>
                        </div>
                    </>
                )}

                {/* 日数バッジ */}
                <span style={{
                    position: 'absolute', top: 12, right: 12, zIndex: 2,
                    background: 'rgba(255,255,255,0.96)',
                    color: '#2563eb', fontSize: 11, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 99,
                    letterSpacing: '0.02em',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                }}>
                    {trip.duration_days === 1 ? '日帰り' : `${trip.duration_days}日間`}
                </span>

                {/* 画像ありの時：カバー下に絵文字＋目的地ピル */}
                {image && (
                    <div style={{
                        position: 'absolute', left: 12, bottom: 10, zIndex: 2,
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'rgba(255,255,255,0.92)',
                        color: '#0f172a',
                        fontSize: 11, fontWeight: 700,
                        padding: '3px 9px', borderRadius: 99,
                        backdropFilter: 'blur(4px)',
                    }}>
                        <span>{emoji}</span>
                        <span style={{
                            maxWidth: 160, overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{trip.destination}</span>
                    </div>
                )}
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
                {!image && (
                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                        📍 {trip.destination}
                    </p>
                )}
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
