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

function formatSingleDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAY_JA[d.getDay()]}）`
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

function formatDateNoYear(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAY_JA[d.getDay()]}）`
}

function computeEndDate(startStr: string, durationDays: number): string {
    return durationDays <= 1 ? startStr : addDays(startStr, durationDays - 1)
}

// コンポーネント外で定義することで毎レンダリングの unmount/remount を防ぐ
//
// 構造: input をノーマルフローに置いて幅の基準にし、span を absolute でオーバーレイ。
// input は固定幅(em)で opacity:0 のため「最初の日付選択時に幅が変わってギャップが出る」
// 問題が起きない。span は pointer-events:none なのでクリックは input に届く。
type OverlayProps = {
    inputRef: React.RefObject<HTMLInputElement | null>
    value: string
    color: string
    label: string
    onChange: (v: string) => void
    onKeyDown: (e: React.KeyboardEvent) => void
    onClickPicker: () => void
}
function DatePickerOverlay({ inputRef, value, color, label, onChange, onKeyDown, onClickPicker }: OverlayProps) {
    return (
        // ラッパーに幅を固定 — span のテキスト長や input の再描画で幅が変わらないようにする
        <div style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '9.5em',   // em base = fontSize(22px) → 9.5 × 22 = 209px 固定
            fontSize: 22,
            padding: '4px 2px',
            boxSizing: 'content-box',
            flexShrink: 0,
        }}>
            {/* 可視テキスト — ノーマルフローで中央揃え */}
            <span style={{
                fontSize: 'inherit',
                color,
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                lineHeight: 1.3,
                userSelect: 'none',
                pointerEvents: 'none',
            }}>
                {value ? formatSingleDate(value) : label}
            </span>
            {/* input を absolute でオーバーレイ — ラッパー幅が固定なのでレイアウト変動しない */}
            <input
                ref={inputRef}
                type="date"
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onClick={onClickPicker}
                tabIndex={0}
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    fontSize: 'inherit',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    cursor: 'pointer',
                    colorScheme: 'light',
                    boxSizing: 'border-box',
                }}
            />
        </div>
    )
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
    const endInputRef = useRef<HTMLInputElement>(null)

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

    function callShowPicker(ref: React.RefObject<HTMLInputElement | null>) {
        try {
            (ref.current as (HTMLInputElement & { showPicker?: () => void }) | null)?.showPicker?.()
        } catch {}
    }

    function openDateEdit(target: 'start' | 'end' = 'start') {
        setDraftStart(localStartDate)
        setDraftEnd(localEndDate)
        const ref = target === 'end' ? endInputRef : startInputRef
        flushSync(() => setEditingDate(true))
        requestAnimationFrame(() => callShowPicker(ref))
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
    // 編集中はドラフト値、表示中は保存値でそれぞれ判定し、修正するまで警告を表示し続ける
    const isDateOrderInvalid = editingDate
        ? (!!draftStart && !!draftEnd && draftEnd < draftStart)
        : (!!localStartDate && !!localEndDate && localEndDate < localStartDate)

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

            {/* タイトル + 日程 — 高さを固定してレイアウトシフトを防ぐ */}
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
                        }}
                        title={editable ? 'クリックしてタイトルを編集' : undefined}
                    >
                        {localTitle}
                    </h1>
                )}

                {/* 旅行日程 — height 固定でどの状態でも同じ高さを確保 */}
                <div style={{
                    marginTop: 28,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'visible',
                }}>
                    {editingDate ? (
                        <div
                            ref={dateContainerRef}
                            onBlur={handleDateContainerBlur}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                        >
                            <DatePickerOverlay
                                inputRef={startInputRef}
                                value={draftStart}
                                color={theme.coverText}
                                label="FROM"
                                onChange={setDraftStart}
                                onKeyDown={handleDateKeyDown}
                                onClickPicker={() => callShowPicker(startInputRef)}
                            />
                            <span style={{ opacity: 0.7, fontSize: 22, color: theme.coverText, userSelect: 'none' }}>〜</span>
                            <DatePickerOverlay
                                inputRef={endInputRef}
                                value={draftEnd}
                                color={theme.coverText}
                                label="TO"
                                onChange={setDraftEnd}
                                onKeyDown={handleDateKeyDown}
                                onClickPicker={() => callShowPicker(endInputRef)}
                            />
                        </div>
                    ) : dateRangeLabel ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span
                                onClick={editable ? () => openDateEdit('start') : undefined}
                                style={{
                                    fontSize: 22,
                                    letterSpacing: '0.02em',
                                    opacity: 0.85,
                                    color: theme.coverText,
                                    cursor: editable ? 'pointer' : 'default',
                                    padding: '4px 6px',
                                    borderRadius: 6,
                                    whiteSpace: 'nowrap',
                                }}
                                title={editable ? 'クリックして開始日を編集' : undefined}
                            >
                                {formatSingleDate(localStartDate)}
                            </span>
                            {localEndDate && localEndDate !== localStartDate && (
                                <>
                                    <span style={{ opacity: 0.7, fontSize: 22, color: theme.coverText, userSelect: 'none' }}>〜</span>
                                    <span
                                        onClick={editable ? () => openDateEdit('end') : undefined}
                                        style={{
                                            fontSize: 22,
                                            letterSpacing: '0.02em',
                                            opacity: 0.85,
                                            color: theme.coverText,
                                            cursor: editable ? 'pointer' : 'default',
                                            padding: '4px 6px',
                                            borderRadius: 6,
                                            whiteSpace: 'nowrap',
                                        }}
                                        title={editable ? 'クリックして終了日を編集' : undefined}
                                    >
                                        {localStartDate.slice(0, 4) === localEndDate.slice(0, 4)
                                            ? formatDateNoYear(localEndDate)
                                            : formatSingleDate(localEndDate)}
                                    </span>
                                </>
                            )}
                        </div>
                    ) : editable ? (
                        <p
                            className="no-print"
                            onClick={() => openDateEdit('start')}
                            style={{
                                margin: 0,
                                fontSize: 22,
                                opacity: 0.7,
                                color: theme.coverText,
                                cursor: 'pointer',
                                padding: '4px 8px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            ＋ 日程を追加
                        </p>
                    ) : null}
                </div>

                {/* ヒント / 警告 — opacity のみ切替してレイアウトを固定 */}
                <p
                    className="no-print"
                    style={{
                        margin: '14px 0 0',
                        fontSize: isDateOrderInvalid ? 20 : 11,
                        letterSpacing: '0.06em',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        opacity: isDateOrderInvalid ? 1 : (editable && !editing && !editingDate ? 0.5 : 0),
                        color: isDateOrderInvalid ? '#ef4444' : theme.coverText,
                        background: isDateOrderInvalid ? 'rgba(255,255,255,0.15)' : 'transparent',
                        borderRadius: isDateOrderInvalid ? 6 : 0,
                        padding: isDateOrderInvalid ? '3px 10px' : '0',
                        display: 'inline-block',
                    }}
                >
                    {isDateOrderInvalid ? '旅行終了日が旅行開始日より前になっています' : 'クリックして編集'}
                </p>
            </div>
        </article>
    )
}
