'use client'
import { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import type { Trip } from '@/types'
import type { Theme } from './bookletThemes'
import { CoverDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'

type Props = {
    trip: Trip
    theme: Theme
    editable?: boolean
    editToken?: string
}

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土']

function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00')
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
}

function formatDateRange(startStr: string, endStr: string): string {
    const start = new Date(startStr + 'T00:00:00')
    const sy = start.getFullYear()
    const sm = start.getMonth() + 1
    const sd = start.getDate()
    const sw = WEEKDAY_JA[start.getDay()]

    if (!endStr || startStr === endStr) {
        return `${sy}年${sm}月${sd}日（${sw}）`
    }

    const end = new Date(endStr + 'T00:00:00')
    const ey = end.getFullYear()
    const em = end.getMonth() + 1
    const ed = end.getDate()
    const ew = WEEKDAY_JA[end.getDay()]

    if (sy === ey && sm === em) {
        return `${sy}年${sm}月${sd}日（${sw}）〜 ${ed}日（${ew}）`
    }
    if (sy === ey) {
        return `${sy}年${sm}月${sd}日（${sw}）〜 ${em}月${ed}日（${ew}）`
    }
    return `${sy}年${sm}月${sd}日（${sw}）〜 ${ey}年${em}月${ed}日（${ew}）`
}

function computeEndDate(startStr: string, durationDays: number): string {
    return durationDays <= 1 ? startStr : addDays(startStr, durationDays - 1)
}

export default function BookletCover({ trip, theme, editable, editToken }: Props) {
    const [localTitle, setLocalTitle] = useState(trip.title)
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(trip.title)
    const inputRef = useRef<HTMLInputElement>(null)

    const initStart = trip.itinerary.start_date ?? ''
    const initEnd = trip.itinerary.end_date
        ?? (initStart ? computeEndDate(initStart, trip.duration_days) : '')

    const [localStartDate, setLocalStartDate] = useState(initStart)
    const [localEndDate, setLocalEndDate] = useState(initEnd)
    const [editingDate, setEditingDate] = useState(false)
    const [draftStart, setDraftStart] = useState(initStart)
    const [draftEnd, setDraftEnd] = useState(initEnd)
    const dateContainerRef = useRef<HTMLDivElement>(null)
    const startInputRef = useRef<HTMLInputElement>(null)

    const isDark = theme.coverText === 'white' || theme.coverText === '#ffffff'
    const titleFont = getFontFamily(theme.fontStyle)

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [editing])

    async function patch(title: string, startDate: string, endDate: string) {
        await fetch(`/api/trips/${trip.share_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itinerary: {
                    ...trip.itinerary,
                    start_date: startDate || undefined,
                    end_date: endDate || undefined,
                },
                title,
                edit_token: editToken,
            }),
        })
    }

    async function saveTitle() {
        const trimmed = draft.trim() || localTitle
        setDraft(trimmed)
        setEditing(false)
        if (trimmed === localTitle) return
        setLocalTitle(trimmed)
        try { await patch(trimmed, localStartDate, localEndDate) } catch {}
    }

    async function saveDate() {
        setEditingDate(false)
        if (draftStart === localStartDate && draftEnd === localEndDate) return
        setLocalStartDate(draftStart)
        setLocalEndDate(draftEnd)
        try { await patch(localTitle, draftStart, draftEnd) } catch {}
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') { e.preventDefault(); saveTitle() }
        if (e.key === 'Escape') { setDraft(localTitle); setEditing(false) }
    }

    function handleDateKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') { e.preventDefault(); saveDate() }
        if (e.key === 'Escape') {
            setDraftStart(localStartDate)
            setDraftEnd(localEndDate)
            setEditingDate(false)
        }
    }

    function handleDateContainerBlur(e: React.FocusEvent) {
        if (dateContainerRef.current?.contains(e.relatedTarget as Node)) return
        saveDate()
    }

    function openDateEdit() {
        setDraftStart(localStartDate)
        setDraftEnd(localEndDate)
        // flushSync でDOMを即時更新し、rAF でレイアウト確定後に showPicker() を呼ぶ
        // （レイアウト計算前に呼ぶと入力欄座標が (0,0) になりページ左上にポップアップが出る）
        flushSync(() => setEditingDate(true))
        requestAnimationFrame(() => {
            try {
                (startInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null)?.showPicker?.()
            } catch {}
        })
    }

    const titleStyle: React.CSSProperties = {
        fontSize: 'clamp(28px, 5.5vw, 48px)',
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: theme.fontStyle === 'rounded' ? '0' : '-0.02em',
        textShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.25)'
            : '0 1px 2px rgba(255,255,255,0.4)',
    }

    const underlineColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'
    const dateRangeLabel = localStartDate
        ? formatDateRange(localStartDate, localEndDate)
        : null

    const dateInputStyle: React.CSSProperties = {
        background: 'transparent',
        border: 'none',
        color: theme.coverText,
        outline: 'none',
        textAlign: 'center',
        fontFamily: 'inherit',
        fontSize: 22,
        padding: '2px 4px',
        colorScheme: 'light',
        width: 160,
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
                minHeight: 520,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15)',
                fontFamily: titleFont,
                textAlign: 'center',
            }}
        >
            <CoverDecoration kind={theme.decoration} accent={theme.accent} />

            {/* 装飾円 */}
            <div style={{
                position: 'absolute', top: -80, right: -60,
                width: 240, height: 240, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -60, left: -40,
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
            }} />

            {/* タイトル + 日程 */}
            <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 560 }}>
                {/* タイトル */}
                {editing ? (
                    <input
                        ref={inputRef}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={handleKeyDown}
                        style={{
                            ...titleStyle,
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: `2px solid ${underlineColor}`,
                            color: theme.coverText,
                            outline: 'none',
                            textAlign: 'center',
                            fontFamily: 'inherit',
                            padding: '4px 8px',
                            boxSizing: 'border-box',
                        }}
                    />
                ) : (
                    <h1
                        onClick={editable ? () => { setDraft(localTitle); setEditing(true) } : undefined}
                        style={{
                            ...titleStyle,
                            margin: 0,
                            cursor: editable ? 'pointer' : 'default',
                            padding: '4px 8px',
                            borderRadius: 8,
                            transition: 'background 0.15s',
                        }}
                        title={editable ? 'クリックしてタイトルを編集' : undefined}
                    >
                        {localTitle}
                    </h1>
                )}

                {/* 旅行日程 */}
                <div style={{ marginTop: 28 }}>
                    {editingDate ? (
                        <div
                            ref={dateContainerRef}
                            onBlur={handleDateContainerBlur}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <input
                                ref={startInputRef}
                                type="date"
                                value={draftStart}
                                onChange={e => setDraftStart(e.target.value)}
                                onKeyDown={handleDateKeyDown}
                                style={dateInputStyle}
                            />
                            <span style={{ opacity: 0.7, fontSize: 22 }}>〜</span>
                            <input
                                type="date"
                                value={draftEnd}
                                onChange={e => setDraftEnd(e.target.value)}
                                onKeyDown={handleDateKeyDown}
                                style={dateInputStyle}
                            />
                        </div>
                    ) : dateRangeLabel ? (
                        <p
                            onClick={editable ? openDateEdit : undefined}
                            style={{
                                margin: 0,
                                fontSize: 15,
                                letterSpacing: '0.04em',
                                opacity: 0.85,
                                color: theme.coverText,
                                cursor: editable ? 'pointer' : 'default',
                                padding: '4px 8px',
                                borderRadius: 6,
                            }}
                            title={editable ? 'クリックして日程を編集' : undefined}
                        >
                            {dateRangeLabel}
                        </p>
                    ) : editable ? (
                        <p
                            className="no-print"
                            onClick={openDateEdit}
                            style={{
                                margin: 0,
                                fontSize: 22,
                                opacity: 0.7,
                                color: theme.coverText,
                                cursor: 'pointer',
                                padding: '4px 8px',
                            }}
                        >
                            ＋ 日程を追加
                        </p>
                    ) : null}
                </div>

                {editable && !editing && !editingDate && (
                    <p
                        className="no-print"
                        style={{
                            marginTop: 14, fontSize: 11,
                            opacity: 0.5, letterSpacing: '0.06em',
                            color: theme.coverText,
                        }}
                    >
                        クリックして編集
                    </p>
                )}
            </div>
        </article>
    )
}
