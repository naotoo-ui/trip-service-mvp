'use client'
import { useState, useEffect } from 'react'
import type { ItineraryDay, Spot } from '@/types'
import type { Theme } from './bookletThemes'
import { PageDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'

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
    memos: string[]
    editable: boolean
    onMemosChange: (memos: string[]) => void
}

export default function BookletDayPage({ day, dayIdx, startDate, theme, enableNow, memos, editable, onMemosChange }: Props) {
    const [now, setNow] = useState<Date | null>(null)

    useEffect(() => {
        if (!enableNow) return
        const tick = () => setNow(new Date())
        tick()
        const id = setInterval(tick, 60_000)
        return () => clearInterval(id)
    }, [enableNow])

    const dateObj = startDate ? (() => {
        const d = new Date(startDate)
        d.setDate(d.getDate() + dayIdx)
        return d
    })() : null
    const isToday = !!dateObj && now && dateObj.toDateString() === now.toDateString()

    const nextSpotIdx = (() => {
        if (!isToday || !now) return -1
        const nowMin = now.getHours() * 60 + now.getMinutes()
        for (let i = 0; i < day.spots.length; i++) {
            const start = toMins(day.spots[i].time)
            if (start >= nowMin) return i
        }
        return -1
    })()

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
    const sortedSpots = [...day.spots].sort((a, b) => toMins(a.time) - toMins(b.time))
    const titleFont = getFontFamily(theme.fontStyle)

    // カードスタイル → 共通スタイル
    const cardWrapStyle = (typeStyle: { bg: string; border: string; text: string }, highlight: boolean): React.CSSProperties => {
        const base: React.CSSProperties = {
            background: highlight ? theme.accent + '14' : typeStyle.bg,
            border: highlight
                ? `2px solid ${theme.accent}`
                : `1.5px solid ${typeStyle.border}`,
            borderRadius: theme.cardStyle === 'polaroid' ? 4 : theme.cardStyle === 'soft' ? 16 : 12,
            padding: '12px 14px',
            position: 'relative',
        }
        if (theme.cardStyle === 'soft') {
            base.boxShadow = highlight
                ? `0 4px 18px ${theme.accent}22`
                : '0 2px 8px rgba(15, 23, 42, 0.06)'
        }
        if (theme.cardStyle === 'sticker') {
            base.boxShadow = '0 3px 0 rgba(0,0,0,0.08)'
            base.transform = 'rotate(-0.3deg)'
        }
        if (theme.cardStyle === 'polaroid') {
            base.background = 'white'
            base.boxShadow = '0 6px 18px rgba(0,0,0,0.12)'
            base.padding = '14px 14px 18px'
        }
        return base
    }

    // バッジスタイル
    const badgeChip = (typeStyle: { bg: string; border: string; text: string }): React.CSSProperties => {
        const base: React.CSSProperties = {
            fontSize: 10, fontWeight: 700,
            color: typeStyle.text,
            background: theme.paperBg,
            padding: '2px 8px',
            border: `1px solid ${typeStyle.border}`,
        }
        if (theme.badgeStyle === 'sticker') {
            base.borderRadius = 6
            base.boxShadow = '0 2px 0 rgba(0,0,0,0.08)'
            base.transform = 'rotate(-2deg)'
            base.display = 'inline-block'
        } else if (theme.badgeStyle === 'soft') {
            base.borderRadius = 99
            base.padding = '2px 10px'
        } else {
            base.borderRadius = 99
        }
        return base
    }

    return (
        <article
            className="booklet-page booklet-day"
            style={{
                background: theme.paperBg,
                border: theme.paperBorder,
                borderRadius: theme.cardStyle === 'polaroid' ? 8 : 20,
                padding: '32px 28px',
                marginBottom: 24,
                boxShadow: theme.cardStyle === 'soft'
                    ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                    : '0 2px 12px rgba(15, 23, 42, 0.04)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: titleFont,
            }}
        >
            {/* ─── 装飾レイヤー ─── */}
            <PageDecoration kind={theme.decoration} />

            {/* 日付ヘッダー */}
            <header
                style={{
                    position: 'relative', zIndex: 2,
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
                        fontSize: 24, fontWeight: 800, color: theme.text,
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
                            padding: '2px 10px', borderRadius: 99,
                            background: theme.accent, color: 'white',
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                            boxShadow: `0 2px 8px ${theme.accent}55`,
                        }}>TODAY</span>
                    )}
                </div>
            </header>

            {/* タイムライン */}
            {sortedSpots.length === 0 ? (
                <p style={{ textAlign: 'center', color: theme.subText, padding: '20px 0', position: 'relative', zIndex: 2 }}>
                    予定がありません
                </p>
            ) : (
                <div style={{ position: 'relative', paddingLeft: 80, zIndex: 2 }}>
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
                                    marginBottom: 18,
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
                                        fontSize: 17, fontWeight: 800, color: theme.text,
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
                                        width: 14, height: 14, borderRadius: '50%',
                                        background: highlight ? theme.accent : typeStyle.text,
                                        border: `3px solid ${theme.paperBg}`,
                                        boxShadow: highlight
                                            ? `0 0 0 3px ${theme.accent}33`
                                            : `0 0 0 1px ${theme.timelineBar}`,
                                    }}
                                />

                                {/* スポットカード */}
                                <div style={cardWrapStyle(typeStyle, highlight)}>
                                    {/* NOW / NEXT バッジ */}
                                    {(isCurrent || isNext) && (
                                        <span
                                            className="now-badge"
                                            style={{
                                                position: 'absolute', top: -10, right: 14,
                                                background: theme.accent, color: 'white',
                                                fontSize: 10, fontWeight: 800,
                                                padding: '3px 10px', borderRadius: 99,
                                                letterSpacing: '0.08em',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                                            }}
                                        >
                                            {isCurrent ? '🔵 NOW' : '⏭ NEXT'}
                                        </span>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                        <span style={badgeChip(typeStyle)}>
                                            {spot.type}
                                        </span>
                                        {spot.needs_booking && (
                                            <span style={{
                                                fontSize: 10, fontWeight: 700,
                                                color: spot.booking_confirmed ? '#10b981' : '#dc2626',
                                                background: spot.booking_confirmed ? '#ecfdf5' : '#fef2f2',
                                                padding: '2px 8px',
                                                borderRadius: 99,
                                                border: `1px solid ${spot.booking_confirmed ? '#a7f3d0' : '#fecaca'}`,
                                            }}>
                                                {spot.booking_confirmed ? '✓ 予約済' : '⚠ 要予約'}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{
                                        fontSize: 16, fontWeight: 700, color: theme.text,
                                        margin: '0 0 6px', lineHeight: 1.4,
                                    }}>
                                        {spot.name}
                                    </h3>

                                    {spot.description && (
                                        <p style={{
                                            fontSize: 12, color: theme.subText,
                                            margin: '0 0 4px', lineHeight: 1.6,
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
                                            margin: '6px 0 0', padding: '7px 10px',
                                            background: theme.pageBg, borderRadius: 8,
                                            borderLeft: `3px solid ${theme.accent}`,
                                        }}>
                                            📝 {spot.memo}
                                        </p>
                                    )}

                                    {spot.user_links && spot.user_links.length > 0 && (
                                        <div className="no-print" style={{
                                            marginTop: 8,
                                            display: 'flex', flexDirection: 'column', gap: 3,
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
                        position: 'relative', zIndex: 2,
                        marginTop: 24, padding: '18px 20px',
                        background: theme.typeColors['宿泊'].bg,
                        border: `1.5px solid ${theme.typeColors['宿泊'].border}`,
                        borderRadius: 14,
                        boxShadow: theme.cardStyle === 'soft'
                            ? '0 2px 12px rgba(15,23,42,0.05)'
                            : 'none',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>🏨</span>
                        <span style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                            color: theme.typeColors['宿泊'].text,
                        }}>
                            STAY
                        </span>
                        {day.hotel.booking_confirmed && (
                            <span style={{
                                fontSize: 10, fontWeight: 700, color: '#10b981',
                                background: '#ecfdf5', padding: '2px 8px',
                                borderRadius: 99, border: '1px solid #a7f3d0',
                            }}>✓ 予約済</span>
                        )}
                    </div>
                    <h3 style={{
                        fontSize: 16, fontWeight: 700, color: theme.text,
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
                            fontSize: 12, color: theme.text, margin: '6px 0 0',
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

            {/* メモ一覧 + 追加ボタン */}
            <DayMemoSection
                memos={memos}
                editable={editable}
                theme={theme}
                onMemosChange={onMemosChange}
            />
        </article>
    )
}

// ──────────── DayMemoSection ────────────

function DayMemoSection({
    memos, editable, theme, onMemosChange,
}: {
    memos: string[]
    editable: boolean
    theme: Theme
    onMemosChange: (memos: string[]) => void
}) {
    const hasMemos = memos.length > 0
    if (!hasMemos && !editable) return null

    function addMemo() {
        onMemosChange([...memos, ''])
    }

    function updateMemo(idx: number, value: string) {
        const next = memos.map((m, i) => i === idx ? value : m)
        onMemosChange(next)
    }

    function removeMemo(idx: number) {
        onMemosChange(memos.filter((_, i) => i !== idx))
    }

    return (
        <section
            style={{
                position: 'relative', zIndex: 2,
                marginTop: 20,
                padding: '14px 16px',
                background: theme.pageBg,
                borderRadius: 12,
                border: `1.5px dashed ${theme.timelineBar}`,
            }}
        >
            <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                color: theme.accent, margin: '0 0 10px',
            }}>
                MEMO
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {memos.map((memo, i) => (
                    <DayMemoItem
                        key={i}
                        initial={memo}
                        editable={editable}
                        theme={theme}
                        onCommit={value => updateMemo(i, value)}
                        onRemove={() => removeMemo(i)}
                    />
                ))}
            </div>
            {editable && (
                <button
                    type="button"
                    onClick={addMemo}
                    className="no-print"
                    style={{
                        marginTop: memos.length > 0 ? 10 : 0,
                        width: '100%',
                        padding: '9px 12px',
                        background: 'white',
                        border: `1.5px dashed ${theme.accent}`,
                        borderRadius: 10,
                        color: theme.accent,
                        fontSize: 13, fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    ＋ メモを追加
                </button>
            )}
        </section>
    )
}

function DayMemoItem({
    initial, editable, theme, onCommit, onRemove,
}: {
    initial: string
    editable: boolean
    theme: Theme
    onCommit: (value: string) => void
    onRemove: () => void
}) {
    const [draft, setDraft] = useState(initial)

    useEffect(() => { setDraft(initial) }, [initial])

    if (!editable) {
        if (!initial.trim()) return null
        return (
            <p style={{
                margin: 0, padding: '8px 10px',
                background: 'white', borderRadius: 8,
                fontSize: 13, color: theme.text, lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                borderLeft: `3px solid ${theme.accent}`,
            }}>
                {initial}
            </p>
        )
    }

    return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={() => { if (draft !== initial) onCommit(draft) }}
                placeholder="自由にメモを書く..."
                rows={2}
                style={{
                    flex: 1,
                    padding: '8px 10px',
                    background: 'white',
                    border: `1px solid ${theme.timelineBar}`,
                    borderRadius: 8,
                    fontSize: 13,
                    color: theme.text,
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    outline: 'none',
                    minHeight: 40,
                    boxSizing: 'border-box',
                }}
            />
            <button
                type="button"
                onClick={onRemove}
                aria-label="メモを削除"
                className="no-print"
                style={{
                    width: 28, height: 28,
                    border: 'none', background: 'transparent',
                    color: theme.subText, fontSize: 18,
                    cursor: 'pointer', flexShrink: 0,
                    borderRadius: 6,
                }}
            >
                ×
            </button>
        </div>
    )
}
