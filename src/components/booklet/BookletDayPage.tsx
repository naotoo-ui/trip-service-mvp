'use client'
import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { ItineraryDay, Spot } from '@/types'
import type { Theme } from './bookletThemes'

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
    editable: boolean
    showUrlQrCode?: boolean
    onSpotUpdate?: (spotIdx: number, update: Partial<Spot>) => void
}

export default function BookletDayPage({ day, dayIdx, startDate, theme, enableNow, editable, showUrlQrCode, onSpotUpdate }: Props) {
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

    const sortedSpots = day.spots
        .map((spot, origIdx) => ({ spot, origIdx }))
        .sort((a, b) => toMins(a.spot.time) - toMins(b.spot.time))

    // スポットごとのメモ・URL 編集ステート
    const [editingMemoOrigIdx, setEditingMemoOrigIdx] = useState<number | null>(null)
    const [memoDraft, setMemoDraft] = useState('')
    const memoInputRef = useRef<HTMLTextAreaElement>(null)
    const [editingUrlOrigIdx, setEditingUrlOrigIdx] = useState<number | null>(null)
    const [urlDraft, setUrlDraft] = useState('')
    const urlInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editingMemoOrigIdx !== null) memoInputRef.current?.focus()
    }, [editingMemoOrigIdx])
    useEffect(() => {
        if (editingUrlOrigIdx !== null) urlInputRef.current?.focus()
    }, [editingUrlOrigIdx])

    function startEditMemo(origIdx: number, current: string) {
        setEditingUrlOrigIdx(null)
        setMemoDraft(current)
        setEditingMemoOrigIdx(origIdx)
    }
    function saveMemo(origIdx: number) {
        onSpotUpdate?.(origIdx, { memo: memoDraft.trim() || undefined })
        setEditingMemoOrigIdx(null)
    }
    function startAddUrl(origIdx: number) {
        setEditingMemoOrigIdx(null)
        setUrlDraft('')
        setEditingUrlOrigIdx(origIdx)
    }
    function saveUrl(origIdx: number, currentLinks: string[]) {
        const url = urlDraft.trim()
        if (url) {
            onSpotUpdate?.(origIdx, { user_links: [...currentLinks, url].slice(0, 5) })
        }
        setEditingUrlOrigIdx(null)
    }
    function removeUrl(origIdx: number, currentLinks: string[], linkIdx: number) {
        const next = currentLinks.filter((_, i) => i !== linkIdx)
        onSpotUpdate?.(origIdx, { user_links: next.length ? next : undefined })
    }

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
        <div className="booklet-day booklet-inline-block" style={{ position: 'relative', zIndex: 2 }}>
                {/* タイムライン */}
                {sortedSpots.length === 0 ? (
                    <p style={{ textAlign: 'center', color: theme.subText, padding: '20px 0', position: 'relative', zIndex: 2 }}>
                        予定がありません
                    </p>
                ) : (
                    <div style={{ position: 'relative', paddingLeft: 80, zIndex: 2 }}>
                        <div style={{
                            position: 'absolute', left: 64, top: 8, bottom: 8,
                            width: 2, background: theme.timelineBar,
                        }} />

                        {sortedSpots.map(({ spot, origIdx }, i) => {
                            const typeStyle = theme.typeColors[spot.type] ?? theme.typeColors['その他']
                            const isCurrent = i === currentSpotIdx
                            const isNext    = i === nextSpotIdx && currentSpotIdx === -1
                            const highlight = isCurrent || isNext
                            const isEditingMemo = editingMemoOrigIdx === origIdx
                            const isEditingUrl  = editingUrlOrigIdx === origIdx
                            const links = spot.user_links ?? []

                            return (
                                <div key={i} style={{ position: 'relative', marginBottom: 18, paddingBottom: 4 }}>
                                    <div style={{
                                        position: 'absolute', left: -80, top: 0,
                                        width: 56, textAlign: 'right',
                                    }}>
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

                                    <div style={{
                                        position: 'absolute', left: -19, top: 6,
                                        width: 14, height: 14, borderRadius: '50%',
                                        background: highlight ? theme.accent : typeStyle.text,
                                        border: `3px solid ${theme.paperBg}`,
                                        boxShadow: highlight
                                            ? `0 0 0 3px ${theme.accent}33`
                                            : `0 0 0 1px ${theme.timelineBar}`,
                                    }} />

                                    <div style={cardWrapStyle(typeStyle, highlight)}>
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

                                        {/* メインコンテンツ + QRコード の横並び */}
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>

                                            {/* 左: スポット情報 */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                                    <span style={badgeChip(typeStyle)}>{spot.type}</span>
                                                    {spot.needs_booking && (
                                                        <span style={{
                                                            fontSize: 10, fontWeight: 700,
                                                            color: spot.booking_confirmed ? '#10b981' : '#dc2626',
                                                            background: spot.booking_confirmed ? '#ecfdf5' : '#fef2f2',
                                                            padding: '2px 8px', borderRadius: 99,
                                                            border: `1px solid ${spot.booking_confirmed ? '#a7f3d0' : '#fecaca'}`,
                                                        }}>
                                                            {spot.booking_confirmed ? '✓ 予約済' : '⚠ 要予約'}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 style={{
                                                    fontSize: 16, fontWeight: 700, color: theme.text,
                                                    margin: '0 0 4px', lineHeight: 1.4,
                                                }}>
                                                    {spot.name}
                                                </h3>

                                                {spot.address && (
                                                    <p style={{ fontSize: 11, color: theme.subText, margin: '2px 0 0' }}>
                                                        📍 {spot.address}
                                                    </p>
                                                )}

                                                {/* メモ表示 */}
                                                {isEditingMemo ? (
                                                    <div className="no-print" style={{ marginTop: 8 }}>
                                                        <textarea
                                                            ref={memoInputRef}
                                                            value={memoDraft}
                                                            onChange={e => setMemoDraft(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveMemo(origIdx) } if (e.key === 'Escape') setEditingMemoOrigIdx(null) }}
                                                            placeholder="メモを入力..."
                                                            rows={3}
                                                            style={{
                                                                width: '100%', padding: '6px 8px', fontSize: 12,
                                                                border: `1.5px solid ${theme.accent}`,
                                                                borderRadius: 8, resize: 'none', outline: 'none',
                                                                fontFamily: 'inherit', lineHeight: 1.6,
                                                                boxSizing: 'border-box',
                                                                background: theme.pageBg, color: theme.text,
                                                            }}
                                                        />
                                                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                                            <button type="button" onClick={() => saveMemo(origIdx)} style={{ padding: '3px 12px', fontSize: 11, fontWeight: 700, borderRadius: 6, border: 'none', background: theme.accent, color: 'white', cursor: 'pointer' }}>保存</button>
                                                            <button type="button" onClick={() => setEditingMemoOrigIdx(null)} style={{ padding: '3px 10px', fontSize: 11, borderRadius: 6, border: `1px solid ${theme.timelineBar}`, background: 'transparent', color: theme.subText, cursor: 'pointer' }}>キャンセル</button>
                                                        </div>
                                                    </div>
                                                ) : spot.memo && (
                                                    <div style={{ marginTop: 6, padding: '6px 10px', background: theme.pageBg, borderRadius: 8, borderLeft: `3px solid ${theme.accent}`, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                                        <span style={{ fontSize: 11, color: theme.subText, flex: 1, lineHeight: 1.6 }}>📝 {spot.memo}</span>
                                                        {editable && (
                                                            <button type="button" className="no-print" onClick={() => startEditMemo(origIdx, spot.memo!)} style={{ flexShrink: 0, fontSize: 10, padding: '2px 6px', borderRadius: 5, border: `1px solid ${theme.timelineBar}`, background: 'transparent', color: theme.subText, cursor: 'pointer' }}>編集</button>
                                                        )}
                                                    </div>
                                                )}

                                                {/* URL一覧 */}
                                                {links.length > 0 && (
                                                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                        {links.map((link, li) => (
                                                            <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: theme.accent, textDecoration: 'underline', textUnderlineOffset: 2, wordBreak: 'break-all', flex: 1 }}>
                                                                    🔗 {link.length > 40 ? link.slice(0, 40) + '...' : link}
                                                                </a>
                                                                {editable && (
                                                                    <button type="button" className="no-print" onClick={() => removeUrl(origIdx, links, li)} style={{ flexShrink: 0, fontSize: 10, padding: '1px 5px', borderRadius: 4, border: `1px solid #fca5a5`, background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* URL入力フォーム */}
                                                {isEditingUrl && (
                                                    <div className="no-print" style={{ marginTop: 6 }}>
                                                        <input
                                                            ref={urlInputRef}
                                                            type="url"
                                                            value={urlDraft}
                                                            onChange={e => setUrlDraft(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveUrl(origIdx, links) } if (e.key === 'Escape') setEditingUrlOrigIdx(null) }}
                                                            placeholder="https://..."
                                                            style={{
                                                                width: '100%', padding: '5px 8px', fontSize: 12,
                                                                border: `1.5px solid ${theme.accent}`,
                                                                borderRadius: 8, outline: 'none',
                                                                fontFamily: 'inherit',
                                                                boxSizing: 'border-box',
                                                                background: theme.pageBg, color: theme.text,
                                                            }}
                                                        />
                                                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                                            <button type="button" onClick={() => saveUrl(origIdx, links)} style={{ padding: '3px 12px', fontSize: 11, fontWeight: 700, borderRadius: 6, border: 'none', background: theme.accent, color: 'white', cursor: 'pointer' }}>追加</button>
                                                            <button type="button" onClick={() => setEditingUrlOrigIdx(null)} style={{ padding: '3px 10px', fontSize: 11, borderRadius: 6, border: `1px solid ${theme.timelineBar}`, background: 'transparent', color: theme.subText, cursor: 'pointer' }}>キャンセル</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* アクションバー（横並び） */}
                                                {editable && !isEditingMemo && !isEditingUrl && (!spot.memo || links.length < 5) && (
                                                    <div className="no-print" style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                                        {!spot.memo && (
                                                            <button type="button" onClick={() => startEditMemo(origIdx, '')} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, border: `1.5px dashed ${theme.accent}`, background: 'transparent', color: theme.accent, cursor: 'pointer', fontWeight: 600 }}>
                                                                ＋ メモを追加
                                                            </button>
                                                        )}
                                                        {links.length < 5 && (
                                                            <button type="button" onClick={() => startAddUrl(origIdx)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, border: `1.5px dashed ${theme.accent}`, background: 'transparent', color: theme.accent, cursor: 'pointer', fontWeight: 600 }}>
                                                                ＋ URLを追加
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 右: QRコード（印刷用設定がonかつURLあり） */}
                                            {showUrlQrCode && links.length > 0 && (
                                                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                                                    {links.map((link, li) => (
                                                        <div key={li} style={{ textAlign: 'center' }}>
                                                            <QRCodeSVG value={link} size={60} level="M" />
                                                            {links.length > 1 && (
                                                                <p style={{ fontSize: 8, color: theme.subText, margin: '2px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                                                                    URL {li + 1}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* 宿泊先 */}
                {day.hotel && (
                    <div style={{
                        position: 'relative', zIndex: 2,
                        marginTop: 24, padding: '18px 20px',
                        background: theme.typeColors['宿泊'].bg,
                        border: `1.5px solid ${theme.typeColors['宿泊'].border}`,
                        borderRadius: 14,
                        boxShadow: theme.cardStyle === 'soft'
                            ? '0 2px 12px rgba(15,23,42,0.05)'
                            : 'none',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 20 }}>🏨</span>
                            <span style={{
                                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                                color: theme.typeColors['宿泊'].text,
                            }}>STAY</span>
                            {day.hotel.booking_confirmed && (
                                <span style={{
                                    fontSize: 10, fontWeight: 700, color: '#10b981',
                                    background: '#ecfdf5', padding: '2px 8px',
                                    borderRadius: 99, border: '1px solid #a7f3d0',
                                }}>✓ 予約済</span>
                            )}
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: '0 0 4px' }}>
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

        </div>
    )
}
