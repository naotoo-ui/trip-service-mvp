'use client'
import { useState, useEffect } from 'react'
import type { ItineraryDay } from '@/types'
import type { Theme } from './bookletThemes'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_COLORS = ['#dc2626', '#475569', '#475569', '#475569', '#475569', '#475569', '#2563eb']

type Props = {
    day: ItineraryDay
    dayIdx: number
    startDate?: string
    theme: Theme
    enableToday: boolean
}

export default function BookletDayHeader({ day, dayIdx, startDate, theme, enableToday }: Props) {
    const [today, setToday] = useState<Date | null>(null)

    useEffect(() => {
        if (!enableToday) return
        const tick = () => setToday(new Date())
        tick()
        // 日付の判定だけなので5分間隔で十分
        const id = setInterval(tick, 5 * 60_000)
        return () => clearInterval(id)
    }, [enableToday])

    const dateObj = startDate ? (() => {
        const d = new Date(startDate)
        d.setDate(d.getDate() + dayIdx)
        return d
    })() : null
    const isToday = !!dateObj && today && dateObj.toDateString() === today.toDateString()

    const labelText = day.label || `${dayIdx + 1}日目`

    return (
        <header
            className="booklet-day-header"
            style={{
                position: 'relative', zIndex: 2,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                gap: 16, paddingBottom: 16, marginBottom: 16,
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
    )
}
