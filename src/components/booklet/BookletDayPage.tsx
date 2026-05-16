'use client'
import { useState, useEffect } from 'react'
import type { ItineraryDay, Spot } from '@/types'
import type { Theme } from './bookletThemes'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_COLORS = ['#dc2626', '#475569', '#475569', '#475569', '#475569', '#475569', '#2563eb']

function toMins(time: string) {
    const [h, m] = time.split(':').map(Number)
    return isNaN(h) ? 0 : h * 60 + (m || 0)
}
function getDur(s: Spot) { return Math.max(20, s.duration_minutes || 60) }
function fmtTime(time: string) { return time.slice(0, 5) }

type Props = {
    day: ItineraryDay
    dayIdx: number
    startDate?: string
    theme: Theme
    enableNow: boolean
}

export default function BookletDayPage({ day, dayIdx, startDate, theme, enableNow }: Props) {
    const [now, setNow] = useState<Date | null>(null)

    // クライアントマウント後のみ NOW 計算（SSR ハイドレーション差異を避ける）
    useEffect(() => {
        if (!enableNow) return
        const tick = () => setNow(new Date())
        tick()
        const id = setInterval(tick, 60_000)
        return () => clearInterval(id)
    }, [enableNow])

    // 日付計算
    const dateObj = startDate ? (() => {
        const d = new Date(startDate)
        d.setDate(d.getDate() + dayIdx)
        return d
    })() : null
    const isToday = !!dateObj && now && dateObj.toDateString() === now.toDateString()

    // この日の中で「次の予定」を特定（今日のみ）
    const nextSpotIdx = (() => {
        if (!isToday || !now) return -1
        const nowMin = now.getHours() * 60 + now.getMinutes()
        for (let i = 0; i < day.spots.length; i++) {
            const start = toMins(day.spots[i].time)
            if (start >= nowMin) return i
        }
        return -1
    })()

    // 「いま進行中」の予定
    const currentSpotIdx = (() => {
        if (!isToday || !now) return -1
        const nowMin = now.getHours() * 60 + now.getMinutes()
        for (let i = 0; i < day.spots.length; i++) {
            const start = toMins(day.spots[i].time)
            const end   = start + getDur(day.spots[i])
            if (start <= nowMin && nowMin < end) return i
        }
        return -1
    })()

    const labelText = day.label || `${dayIdx + 1}日目`

    // 時系列順にソート
    const sortedSpots = [...day.spots].sort((a, b) => toMins(a.time) - toMins(b.time))

    return (
        <article
            className="booklet-page booklet-day"
            style={{
                background: theme.paperBg,
                border: theme.paperBorder,
                borderRadius: 20,
                padding: '32px 28px',
                marginBottom: 24,
                boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
                position: 'relative',
            }}
        >
            {/* 日付ヘッダー */}
            <header
                style={{
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                    gap: 16, paddingBottom: 16, marginBottom: 20,
                    borderBottom: `2px solid ${theme.accent}`,
                }}
            >
                <div>
                    <p style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: theme.accent, margin: '0 0 6px',
                    }}>
                        Day {dayIdx + 1}
                    </p>
                    <h2 style={{
                        fontSize: 22, fontWeight: 800, color: theme.text,
                        margin: 0, letterSpacing: '-0.01em',
                    }}>
                        {labelText}
                    </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {dateObj && (
                        <>
                            <p style={{
                                fontSize: 24, fontWeight: 800, color: theme.text,
                                margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                            }}>
                                {dateObj.getMonth() + 1}/{dateObj.getDate()}
                            </p>
                            <p style={{
                                fontSize: 11, fontWeight: 700,
                                color: WEEKDAY_COLORS[dateObj.getDay()],
                                margin: '4px 0 0',
                            }}>
                                {WEEKDAYS[dateObj.getDay()]}曜日
                            </p>
                        </>
                    )}
                    {isToday && (
                        <span style={{
                            display: 'inline-block', marginTop: 6,
                            padding: '2px 8px', borderRadius: 99,
                            background: theme.accent, color: 'white',
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                        }}>TODAY</span>
                    )}
                </div>
            </header>

            {/* タイムライン */}
            {sortedSpots.length === 0 ? (
                <p style={{ textAlign: 'center', color: theme.subText, padding: '20px 0' }}>
                    予定がありません
                </p>
            ) : (
                <div style={{ position: 'relative', paddingLeft: 80 }}>
                    {/* 縦タイムラインバー */}
                    <div
                        style={{
                            position: 'absolute', left: 64, top: 8, bottom: 8,
                            width: 2, background: theme.timelineBar,
                        }}
                    />

                    {sortedSpots.map((spot, i) => {
                        const typeStyle = theme.typeColors[spot.type] ?? theme.typeColors['その他']
                        const isCurrent = i === currentSpotIdx
                        const isNext    = i === nextSpotIdx && currentSpotIdx === -1
                        const highlight = isCurrent || isNext

                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'relative',
                                    marginBottom: 16,
                                    paddingBottom: 4,
                                }}
                            >
                                {/* 時刻 */}
                                <div
                                    style={{
                                        position: 'absolute', left: -80, top: 0,
                                        width: 56, textAlign: 'right',
                                    }}
                                >
                                    <p style={{
                                        fontSize: 16, fontWeight: 700, color: theme.text,
                                        margin: 0, lineHeight: 1.1,
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>
                                        {fmtTime(spot.time)}
                                    </p>
                                    <p style={{
                                        fontSize: 10, color: theme.subText,
                                        margin: '2px 0 0', fontVariantNumeric: 'tabular-nums',
                                    }}>
                                        {spot.duration_minutes}分
                                    </p>
                                </div>

                                {/* 丸印 */}
                                <div
                                    style={{
                                        position: 'absolute', left: -19, top: 6,
                                        width: 12, height: 12, borderRadius: '50%',
                                        background: highlight ? theme.accent : typeStyle.text,
                                        border: `3px solid ${theme.paperBg}`,
                                        boxShadow: highlight ? `0 0 0 3px ${theme.accent}33` : 'none',
                                    }}
                                />

                                {/* スポットカード */}
                                <div
                                    style={{
                                        background: highlight ? theme.accent + '0d' : typeStyle.bg,
                                        border: highlight
                                            ? `2px solid ${theme.accent}`
                                            : `1.5px solid ${typeStyle.border}`,
                                        borderRadius: 12,
                                        padding: '10px 14px',
                                        position: 'relative',
                                    }}
                                >
                                    {/* NOW / NEXT バッジ */}
                                    {(isCurrent || isNext) && (
                                        <span
                                            className="now-badge"
                                            style={{
                                                position: 'absolute', top: -8, right: 12,
                                                background: theme.accent, color: 'white',
                                                fontSize: 10, fontWeight: 800,
                                                padding: '2px 8px', borderRadius: 99,
                                                letterSpacing: '0.08em',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                            }}
                                        >
                                            {isCurrent ? '🔵 NOW' : '⏭ NEXT'}
                                        </span>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <span
                                            style={{
                                                fontSize: 10, fontWeight: 700,
                                                color: typeStyle.text,
                                                background: theme.paperBg,
                                                padding: '1px 7px', borderRadius: 99,
                                                border: `1px solid ${typeStyle.border}`,
                                            }}
                                        >
                                            {spot.type}
                                        </span>
                                        {spot.needs_booking && (
                                            <span style={{
                                                fontSize: 10, fontWeight: 700,
                                                color: spot.booking_confirmed ? '#10b981' : '#dc2626',
                                            }}>
                                                {spot.booking_confirmed ? '✓ 予約済' : '⚠ 要予約'}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{
                                        fontSize: 15, fontWeight: 700, color: theme.text,
                                        margin: '0 0 4px', lineHeight: 1.4,
                                    }}>
                                        {spot.name}
                                    </h3>

                                    {spot.description && (
                                        <p style={{
                                            fontSize: 12, color: theme.subText,
                                            margin: '0 0 4px', lineHeight: 1.55,
                                        }}>
                                            {spot.description}
                                        </p>
                                    )}

                                    {spot.address && (
                                        <p style={{
                                            fontSize: 11, color: theme.subText,
                                            margin: '4px 0 0',
                                        }}>
                                            📍 {spot.address}
                                        </p>
                                    )}

                                    {spot.memo && (
                                        <p style={{
                                            fontSize: 11, color: theme.subText,
                                            margin: '4px 0 0', padding: '6px 8px',
                                            background: theme.pageBg, borderRadius: 6,
                                        }}>
                                            📝 {spot.memo}
                                        </p>
                                    )}

                                    {spot.user_links && spot.user_links.length > 0 && (
                                        <div className="no-print" style={{
                                            marginTop: 6,
                                            display: 'flex', flexDirection: 'column', gap: 2,
                                        }}>
                                            {spot.user_links.map((link, li) => (
                                                <a
                                                    key={li}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        fontSize: 11, color: theme.accent,
                                                        textDecoration: 'underline',
                                                        textUnderlineOffset: 2,
                                                        wordBreak: 'break-all',
                                                    }}
                                                >
                                                    🔗 {link.length > 50 ? link.slice(0, 50) + '...' : link}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* 宿泊先 */}
            {day.hotel && (
                <div
                    style={{
                        marginTop: 24, padding: '16px 18px',
                        background: theme.typeColors['宿泊'].bg,
                        border: `1.5px solid ${theme.typeColors['宿泊'].border}`,
                        borderRadius: 12,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 18 }}>🏨</span>
                        <span style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                            color: theme.typeColors['宿泊'].text,
                        }}>
                            STAY
                        </span>
                        {day.hotel.booking_confirmed && (
                            <span style={{
                                fontSize: 10, fontWeight: 700, color: '#10b981',
                            }}>✓ 予約済</span>
                        )}
                    </div>
                    <h3 style={{
                        fontSize: 15, fontWeight: 700, color: theme.text,
                        margin: '0 0 4px',
                    }}>
                        {day.hotel.name}
                    </h3>
                    {day.hotel.address && (
                        <p style={{ fontSize: 11, color: theme.subText, margin: '0 0 4px' }}>
                            📍 {day.hotel.address}
                        </p>
                    )}
                    {(day.hotel.check_in || day.hotel.check_out) && (
                        <p style={{
                            fontSize: 12, color: theme.text, margin: '4px 0 0',
                            fontVariantNumeric: 'tabular-nums',
                        }}>
                            {day.hotel.check_in && <>IN <strong>{day.hotel.check_in}</strong></>}
                            {day.hotel.check_in && day.hotel.check_out && ' / '}
                            {day.hotel.check_out && <>OUT <strong>{day.hotel.check_out}</strong></>}
                        </p>
                    )}
                    {day.hotel.memo && (
                        <p style={{ fontSize: 11, color: theme.subText, margin: '6px 0 0' }}>
                            📝 {day.hotel.memo}
                        </p>
                    )}
                </div>
            )}
        </article>
    )
}
