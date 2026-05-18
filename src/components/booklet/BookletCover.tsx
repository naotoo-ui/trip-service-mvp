import type { Trip } from '@/types'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import type { Theme } from './bookletThemes'
import { CoverDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'

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

    // テーマ装飾用の判定
    const isDark = theme.coverText === 'white' || theme.coverText === '#ffffff'
    const titleFont = getFontFamily(theme.fontStyle)

    // バッジスタイル（タイトル上のラベル）
    const labelBgColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'
    const labelBorderColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'

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
                minHeight: 520,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15)',
                fontFamily: titleFont,
            }}
        >
            {/* ─── 装飾レイヤー ─── */}
            <CoverDecoration kind={theme.decoration} accent={theme.accent} />

            {/* 装飾円（既存・薄く維持） */}
            <div style={{
                position: 'absolute', top: -80, right: -60,
                width: 240, height: 240, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -60, left: -40,
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                pointerEvents: 'none',
            }} />

            {/* ─── ヘッド ─── */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{
                    display: 'inline-block',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    background: labelBgColor,
                    border: `1px solid ${labelBorderColor}`,
                    padding: '5px 12px',
                    borderRadius: 99,
                    marginBottom: 14,
                }}>
                    ✈ Travel Booklet
                </span>
                <p style={{
                    fontSize: 80, lineHeight: 1, margin: 0,
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
                }}>
                    {theme.coverEmoji || emoji}
                </p>
            </div>

            {/* ─── タイトル ─── */}
            <div style={{ position: 'relative', zIndex: 2, margin: '24px 0' }}>
                <h1 style={{
                    fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800,
                    lineHeight: 1.25, margin: '0 0 20px',
                    letterSpacing: theme.fontStyle === 'rounded' ? '0' : '-0.02em',
                    textShadow: isDark
                        ? '0 2px 8px rgba(0,0,0,0.25)'
                        : '0 1px 2px rgba(255,255,255,0.4)',
                }}>
                    {trip.title}
                </h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15,
                        background: labelBgColor,
                        border: `1px solid ${labelBorderColor}`,
                        padding: '8px 14px',
                        borderRadius: 12,
                        width: 'fit-content',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <span>📍</span>
                        <span style={{ fontWeight: 700 }}>{trip.destination}</span>
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14,
                        background: labelBgColor,
                        border: `1px solid ${labelBorderColor}`,
                        padding: '7px 14px',
                        borderRadius: 12,
                        width: 'fit-content',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <span>🗓️</span>
                        {startObj && endObj ? (
                            <span>{fmtDate(startObj)} 〜 {fmtShort(endObj)}（{trip.duration_days}日間）</span>
                        ) : (
                            <span>{trip.duration_days}日間</span>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── フッター ─── */}
            <div style={{
                position: 'relative', zIndex: 2,
                paddingTop: 20, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
                fontSize: 11, opacity: 0.85, letterSpacing: '0.05em',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span>🎀 旅程ジェネレーターで作成</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>— よい旅を —</span>
            </div>
        </article>
    )
}
