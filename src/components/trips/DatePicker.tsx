'use client'

import { useState, useRef, useEffect } from 'react'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function addDays(d: Date, n: number) {
    const r = new Date(d)
    r.setDate(r.getDate() + n)
    return r
}

function formatShort(d: Date) {
    return `${d.getMonth() + 1}/${d.getDate()}(${WEEKDAYS[d.getDay()]})`
}

interface Props {
    value?: Date
    duration: number
    onChange: (date: Date) => void
}

export default function DatePicker({ value, duration, onChange }: Props) {
    const [open, setOpen] = useState(false)
    const [hover, setHover] = useState<Date | null>(null)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const [viewYear, setViewYear] = useState(today.getFullYear())
    const [viewMonth, setViewMonth] = useState(today.getMonth())
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function onDown(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open])

    // 表示するプレビュー起点（ホバー優先 → 選択済み）
    const previewStart = hover ?? value ?? null
    const endDate = value ? addDays(value, duration - 1) : null

    function isStart(d: Date) { return !!previewStart && sameDay(d, previewStart) }
    function isEnd(d: Date) { return !!previewStart && sameDay(d, addDays(previewStart, duration - 1)) }
    function inRange(d: Date) {
        if (!previewStart) return false
        const s = previewStart.getTime()
        const e = addDays(previewStart, duration - 1).getTime()
        const t = d.getTime()
        return t > s && t < e
    }

    function buildGrid(year: number, month: number) {
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        return { firstDay, daysInMonth }
    }

    function renderMonth(year: number, month: number) {
        const { firstDay, daysInMonth } = buildGrid(year, month)
        const cells = []

        // 空セル
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`e-${i}`} />)
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i)
            const past = date < today
            const isToday = sameDay(date, today)
            const start = isStart(date)
            const end = isEnd(date)
            const range = inRange(date)
            const weekday = date.getDay()

            let textColor = weekday === 0 ? '#ef4444' : weekday === 6 ? '#3b82f6' : '#374151'
            if (past) textColor = '#d1d5db'
            if (start || end) textColor = '#ffffff'

            cells.push(
                <button
                    key={i}
                    disabled={past}
                    onClick={() => { onChange(date); setOpen(false) }}
                    onMouseEnter={() => !past && setHover(date)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                        position: 'relative',
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: isToday ? 700 : 400,
                        color: textColor,
                        backgroundColor: start || end ? '#2563eb' : range ? '#dbeafe' : 'transparent',
                        borderRadius: start || end ? '50%' : range ? 0 : 4,
                        cursor: past ? 'not-allowed' : 'pointer',
                        border: 'none',
                        outline: 'none',
                        transition: 'background-color 0.1s',
                    }}
                >
                    {i}
                    {isToday && !start && (
                        <span style={{
                            position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                            width: 4, height: 4, borderRadius: '50%', backgroundColor: '#2563eb',
                        }} />
                    )}
                </button>
            )
        }
        return cells
    }

    // 2ヶ月表示（今月 + 来月）
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
            {/* トリガーボタン（航空券・ホテルスタイル） */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px',
                    background: '#fff',
                    border: open ? '2px solid #2563eb' : '2px solid #e5e7eb',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: 14,
                    color: value ? '#111827' : '#9ca3af',
                    fontWeight: value ? 500 : 400,
                    boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
                    transition: 'all 0.15s',
                    minWidth: 240,
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={open ? '#2563eb' : '#9ca3af'} strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {value ? (
                    <span>
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>{formatShort(value)}</span>
                        <span style={{ color: '#9ca3af', margin: '0 4px' }}>›</span>
                        {endDate && <span style={{ color: '#7c3aed', fontWeight: 600 }}>{formatShort(endDate)}</span>}
                        <span style={{ color: '#6b7280', marginLeft: 6, fontSize: 12 }}>{duration}日間</span>
                    </span>
                ) : (
                    '旅行日程を設定'
                )}
            </button>

            {/* カレンダーポップアップ */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    padding: 20,
                    display: 'flex', gap: 24,
                    userSelect: 'none',
                }}>
                    {/* 月ナビ */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'absolute', top: 20, left: 20, right: 20, justifyContent: 'space-between' }}>
                        <button
                            onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }}
                            style={{ width: 32, height: 32, border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', background: '#f9fafb', fontSize: 16 }}
                        >‹</button>
                        <div style={{ display: 'flex', gap: 120 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                                {viewYear}年{viewMonth + 1}月
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                                {nextYear}年{nextMonth + 1}月
                            </span>
                        </div>
                        <button
                            onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }}
                            style={{ width: 32, height: 32, border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', background: '#f9fafb', fontSize: 16 }}
                        >›</button>
                    </div>

                    {/* 2ヶ月グリッド */}
                    {[{ y: viewYear, m: viewMonth }, { y: nextYear, m: nextMonth }].map(({ y, m }, mi) => (
                        <div key={mi} style={{ width: 224, marginTop: 32 }}>
                            {/* 曜日ヘッダー */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
                                {WEEKDAYS.map((d, i) => (
                                    <div key={d} style={{
                                        textAlign: 'center', fontSize: 11, fontWeight: 600, padding: '4px 0',
                                        color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#9ca3af',
                                    }}>{d}</div>
                                ))}
                            </div>
                            {/* 日付グリッド */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                                {renderMonth(y, m)}
                            </div>
                        </div>
                    ))}

                    <p style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: '#9ca3af' }}>
                        旅行開始日をクリックすると、{duration}日間の日程が設定されます
                    </p>
                </div>
            )}
        </div>
    )
}
