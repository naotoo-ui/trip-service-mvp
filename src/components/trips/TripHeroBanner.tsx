import Image from 'next/image'
import { getDestinationImage } from '@/lib/destinationImages'
import { getDestinationEmoji } from '@/lib/destinationEmoji'

type Props = {
    title: string
    destination: string
    durationDays: number
    spotCount?: number
}

// トリップ詳細ページの上部に表示する画像バナー。
// 画像がない場合は控えめなグラデーション。
export default function TripHeroBanner({ title, destination, durationDays, spotCount }: Props) {
    const image = getDestinationImage(destination)
    const emoji = getDestinationEmoji(destination)
    const nights = Math.max(0, durationDays - 1)
    const dayLabel = durationDays === 1 ? '日帰り' : `${nights}泊${durationDays}日`

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: 220,
                borderRadius: 16,
                overflow: 'hidden',
                background: image ? '#e5e7eb' : 'linear-gradient(135deg, #2563eb, #4338ca)',
                marginBottom: 18,
                boxShadow: '0 4px 14px rgba(15,23,42,0.10)',
            }}
            aria-hidden={false}
        >
            {image && (
                <>
                    <Image
                        src={image}
                        alt={destination}
                        fill
                        sizes="(max-width: 768px) 100vw, 900px"
                        priority
                        style={{ objectFit: 'cover' }}
                    />
                    {/* 下から濃く・タイトル可読性 */}
                    <div
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)',
                        }}
                    />
                </>
            )}
            {!image && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 80, opacity: 0.45,
                }}>{emoji}</div>
            )}

            {/* 上部右：日数バッジ */}
            <div style={{
                position: 'absolute', top: 14, right: 14, zIndex: 2,
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.96)',
                color: '#2563eb',
                fontSize: 12, fontWeight: 800,
                padding: '5px 12px', borderRadius: 99,
                boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                letterSpacing: '0.02em',
            }}>
                <span>📅</span>
                <span>{dayLabel}</span>
            </div>

            {/* 下部：タイトル＋目的地ピル */}
            <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                padding: '16px 20px',
                zIndex: 2,
                color: 'white',
            }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 99,
                    marginBottom: 6,
                    letterSpacing: '0.02em',
                }}>
                    <span>{emoji}</span>
                    <span>{destination}</span>
                    {typeof spotCount === 'number' && spotCount > 0 && (
                        <>
                            <span style={{ opacity: 0.5 }}>・</span>
                            <span>{spotCount} スポット</span>
                        </>
                    )}
                </div>
                <h1 style={{
                    fontSize: 'clamp(18px, 3vw, 26px)',
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1.25,
                    textShadow: '0 2px 8px rgba(0,0,0,0.35)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>{title}</h1>
            </div>
        </div>
    )
}
