'use client'
import Link from 'next/link'
import Image from 'next/image'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import { getDestinationImage } from '@/lib/destinationImages'
import type { Trip } from '@/types'

export type TripBrief = Pick<Trip, 'share_id' | 'title' | 'destination' | 'duration_days' | 'wishes'>

type Variant = 'list' | 'grid'

type Props = {
    trip: TripBrief
    variant: Variant
    favorited: boolean
    onToggleFavorite: (id: string) => void
    onHover?: (key: string | null) => void
    popular?: boolean
}

export default function PlanCard({ trip, variant, favorited, onToggleFavorite, onHover, popular }: Props) {
    const img = getDestinationImage(trip.destination)
    const emoji = getDestinationEmoji(trip.destination)
    const handleHeart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onToggleFavorite(trip.share_id)
    }

    if (variant === 'grid') {
        return (
            <Link
                href={`/trips/${trip.share_id}`}
                onMouseEnter={() => onHover?.(trip.destination)}
                onMouseLeave={() => onHover?.(null)}
                style={{
                    display: 'flex', flexDirection: 'column',
                    background: 'white', borderRadius: 14,
                    border: '1px solid #f0f0f0', overflow: 'hidden',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    position: 'relative',
                }}
                className="plan-grid-card"
            >
                <div style={{
                    position: 'relative', width: '100%', aspectRatio: '4 / 3',
                    background: img ? '#e5e7eb' : 'linear-gradient(135deg,#fef3c7,#fde68a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {img ? (
                        <Image
                            src={img}
                            alt={trip.destination}
                            fill
                            sizes="(max-width: 600px) 50vw, 280px"
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: 56 }}>{emoji}</span>
                    )}
                    <button
                        type="button"
                        onClick={handleHeart}
                        aria-label={favorited ? 'お気に入り解除' : 'お気に入りに追加'}
                        className="heart-btn"
                        style={{
                            position: 'absolute', top: 8, right: 8,
                            width: 30, height: 30, borderRadius: '50%',
                            border: 'none',
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(6px)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14,
                            color: favorited ? '#e11d48' : '#475569',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                            transition: 'transform 0.12s, color 0.12s',
                            zIndex: 2,
                        }}
                    >{favorited ? '♥' : '♡'}</button>
                    <div style={{
                        position: 'absolute', bottom: 8, left: 8,
                        display: 'flex', gap: 5,
                    }}>
                        <span style={{
                            background: 'rgba(15,23,42,0.78)',
                            color: 'white',
                            padding: '3px 8px', borderRadius: 99,
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.02em',
                            backdropFilter: 'blur(6px)',
                        }}>{trip.duration_days}日間</span>
                        {popular && (
                            <span style={{
                                background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
                                color: 'white',
                                padding: '3px 8px', borderRadius: 99,
                                fontSize: 10, fontWeight: 800,
                                letterSpacing: '0.04em',
                                boxShadow: '0 2px 6px rgba(239,68,68,0.32)',
                            }}>★ 人気</span>
                        )}
                    </div>
                </div>
                <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{
                        fontSize: 13, fontWeight: 700, color: '#0f172a',
                        margin: 0, lineHeight: 1.35,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>{trip.title}</p>
                    <p style={{
                        fontSize: 11, color: '#64748b', margin: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>📍 {trip.destination}</p>
                </div>
                <style jsx>{`
                    .plan-grid-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 16px rgba(15,23,42,0.08);
                    }
                    .heart-btn:hover { transform: scale(1.12); }
                `}</style>
            </Link>
        )
    }

    return (
        <Link
            href={`/trips/${trip.share_id}`}
            onMouseEnter={() => onHover?.(trip.destination)}
            onMouseLeave={() => onHover?.(null)}
            style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                textDecoration: 'none', color: 'inherit',
                transition: 'background 0.15s',
                borderBottom: '1px solid #f3f4f6',
            }}
            className="plan-list-row"
        >
            <div style={{
                width: 58, height: 58, borderRadius: 10,
                overflow: 'hidden', flexShrink: 0,
                background: img ? '#e5e7eb' : '#eef2ff',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {img ? (
                    <Image
                        src={img}
                        alt={trip.destination}
                        fill
                        sizes="58px"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <span style={{ fontSize: 28 }}>{emoji}</span>
                )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: 14, fontWeight: 700, color: '#111827',
                    margin: '0 0 3px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    {popular && (
                        <span style={{
                            background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
                            color: 'white',
                            padding: '1px 7px', borderRadius: 99,
                            fontSize: 9, fontWeight: 800,
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                        }}>★ 人気</span>
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trip.title}
                    </span>
                </p>
                <p style={{
                    fontSize: 12, color: '#6b7280', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    📍 {trip.destination} ・ {trip.duration_days}日間
                    {trip.wishes ? ` ・ ${trip.wishes}` : ''}
                </p>
            </div>
            <button
                type="button"
                onClick={handleHeart}
                aria-label={favorited ? 'お気に入り解除' : 'お気に入りに追加'}
                style={{
                    background: 'transparent', border: 'none',
                    fontSize: 18, cursor: 'pointer',
                    color: favorited ? '#e11d48' : '#cbd5e1',
                    padding: '4px 6px', lineHeight: 1,
                    transition: 'transform 0.12s, color 0.12s',
                }}
                className="heart-list-btn"
            >{favorited ? '♥' : '♡'}</button>
            <span style={{ fontSize: 18, color: '#cbd5e1', flexShrink: 0 }}>›</span>
            <style jsx>{`
                .plan-list-row:hover { background: #fff7ed; }
                .heart-list-btn:hover { transform: scale(1.15); }
            `}</style>
        </Link>
    )
}
