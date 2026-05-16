import type { Trip } from '@/types'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import type { Theme } from './bookletThemes'

export default function BookletCover({ trip, theme }: { trip: Trip; theme: Theme }) {
    const emoji = getDestinationEmoji(trip.destination)
    const startDate = trip.itinerary.start_date
    const startObj  = startDate ? new Date(startDate) : null
    const endObj    = startObj
        ? (() => { const d = new Date(startObj); d.setDate(d.getDate() + trip.duration_days - 1); return d })()
        : null

    function fmtDate(d: Date) {
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    function fmtShort(d: Date) {
        const wd = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
        return `${d.getMonth() + 1}/${d.getDate()}(${wd})`
    }

    return (
        <article
            className="booklet-page booklet-cover"
            style={{
                background: theme.coverBg,
                color: theme.coverText,
                borderRadius: 24,
                padding: '56px 36px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 28,
                minHeight: 460,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)',
            }}
        >
            {/* 装飾円 */}
            <div style={{
                position: 'absolute', top: -80, right: -60,
                width: 240, height: 240, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
            }} />
            <div style={{
                position: 'absolute', bottom: -60, left: -40,
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
            }} />

            {/* ヘッド */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                    textTransform: 'uppercase', opacity: 0.75, margin: '0 0 12px',
                }}>
                    Travel Booklet
                </p>
                <p style={{ fontSize: 64, lineHeight: 1, margin: 0 }}>{emoji}</p>
            </div>

            {/* タイトル */}
            <div style={{ position: 'relative', zIndex: 1, margin: '24px 0' }}>
                <h1 style={{
                    fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800,
                    lineHeight: 1.2, margin: '0 0 20px',
                    letterSpacing: '-0.02em',
                }}>
                    {trip.title}
                </h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16 }}>
                        <span style={{ opacity: 0.7 }}>📍</span>
                        <span style={{ fontWeight: 600 }}>{trip.destination}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, opacity: 0.85 }}>
                        <span style={{ opacity: 0.7 }}>🗓️</span>
                        {startObj && endObj ? (
                            <span>{fmtDate(startObj)} 〜 {fmtShort(endObj)}（{trip.duration_days}日間）</span>
                        ) : (
                            <span>{trip.duration_days}日間</span>
                        )}
                    </div>
                </div>
            </div>

            {/* フッター */}
            <div style={{
                position: 'relative', zIndex: 1,
                paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.18)',
                fontSize: 11, opacity: 0.7, letterSpacing: '0.05em',
            }}>
                ✈️ 旅程ジェネレーター で作成 — このしおりを持って、よい旅を
            </div>
        </article>
    )
}
