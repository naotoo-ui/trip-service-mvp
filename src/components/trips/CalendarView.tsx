'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { ItineraryDay, Spot } from '@/types'

const PX_PER_MIN = 2        // 2px/分 → 1時間=120px
const GRID_START = 6        // 6時開始
const GRID_END = 24         // 24時まで
const SNAP = 10             // 10分スナップ
const MIN_DUR = 20          // ブロック最小高さ（分）
const TIME_COL = 64         // 時刻ラベル列幅（px）
const ACCENT = 4            // 左アクセントバー幅（px）
const HANDLE = 8            // リサイズハンドル高さ（px）

const HOURS = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i)
const GRID_H = (GRID_END - GRID_START) * 60 * PX_PER_MIN   // 2160px

function toMins(time: string): number {
    const [h, m] = time.split(':').map(Number)
    if (isNaN(h)) return GRID_START * 60
    return h * 60 + (m || 0)
}

function toTime(mins: number): string {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function snap(v: number) { return Math.round(v / SNAP) * SNAP }

const STYLES: Record<string, { accent: string; bg: string; border: string; text: string; light?: boolean }> = {
    観光:   { accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    グルメ: { accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
    移動:   { accent: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', text: '#94a3b8', light: true },
    宿泊:   { accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
    その他: { accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
}

interface Drag {
    mode: 'move' | 'resize-top' | 'resize-bottom'
    srcDay: number
    srcSpot: number
    initStart: number
    initDur: number
    mouseY0: number
}
interface Temp { dayIdx: number; start: number; dur: number }

interface Props {
    days: ItineraryDay[]
    onUpdateDays: (updated: ItineraryDay[]) => void
}

export default function CalendarView({ days, onUpdateDays }: Props) {
    const outerRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [colW, setColW] = useState(160)
    const [drag, setDrag] = useState<Drag | null>(null)
    const [temp, setTemp] = useState<Temp | null>(null)
    const [nowMins, setNowMins] = useState(() => {
        const n = new Date()
        return n.getHours() * 60 + n.getMinutes()
    })

    // 現在時刻を毎分更新
    useEffect(() => {
        const t = setInterval(() => {
            const n = new Date()
            setNowMins(n.getHours() * 60 + n.getMinutes())
        }, 60000)
        return () => clearInterval(t)
    }, [])

    // 列幅を動的計算
    useEffect(() => {
        const calc = () => {
            if (outerRef.current) {
                const avail = outerRef.current.clientWidth - TIME_COL
                setColW(Math.max(120, avail / days.length))
            }
        }
        calc()
        window.addEventListener('resize', calc)
        return () => window.removeEventListener('resize', calc)
    }, [days.length])

    // 8時にスクロール
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = (8 - GRID_START) * 60 * PX_PER_MIN
        }
    }, [])

    const xToDayIdx = useCallback((clientX: number) => {
        if (!outerRef.current) return 0
        const rect = outerRef.current.getBoundingClientRect()
        const relX = clientX - rect.left - TIME_COL
        return Math.max(0, Math.min(days.length - 1, Math.floor(relX / colW)))
    }, [days.length, colW])

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!drag) return
        const deltaY = e.clientY - drag.mouseY0
        const dMins = deltaY / PX_PER_MIN

        if (drag.mode === 'move') {
            const s = snap(drag.initStart + dMins)
            const clamped = Math.max(GRID_START * 60, Math.min(GRID_END * 60 - drag.initDur, s))
            setTemp({ dayIdx: xToDayIdx(e.clientX), start: clamped, dur: drag.initDur })
        } else if (drag.mode === 'resize-bottom') {
            setTemp({ dayIdx: drag.srcDay, start: drag.initStart, dur: Math.max(MIN_DUR, snap(drag.initDur + dMins)) })
        } else {
            const newStart = snap(Math.max(GRID_START * 60, drag.initStart + dMins))
            const newDur = Math.max(MIN_DUR, drag.initDur - (newStart - drag.initStart))
            setTemp({ dayIdx: drag.srcDay, start: newStart, dur: newDur })
        }
    }, [drag, xToDayIdx])

    const onMouseUp = useCallback(() => {
        if (!drag || !temp) { setDrag(null); setTemp(null); return }
        const srcSpot = days[drag.srcDay]?.spots[drag.srcSpot]
        if (!srcSpot) { setDrag(null); setTemp(null); return }

        const updated: Spot = { ...srcSpot, time: toTime(temp.start), duration_minutes: temp.dur }
        let newDays: ItineraryDay[]

        if (temp.dayIdx === drag.srcDay) {
            newDays = days.map((d, i) =>
                i === drag.srcDay ? { ...d, spots: d.spots.map((s, j) => j === drag.srcSpot ? updated : s) } : d
            )
        } else {
            const srcSpots = days[drag.srcDay].spots.filter((_, j) => j !== drag.srcSpot)
            const destSpots = [...days[temp.dayIdx].spots, updated].sort((a, b) => toMins(a.time) - toMins(b.time))
            newDays = days.map((d, i) => {
                if (i === drag.srcDay) return { ...d, spots: srcSpots }
                if (i === temp.dayIdx) return { ...d, spots: destSpots }
                return d
            })
        }
        onUpdateDays(newDays)
        setDrag(null)
        setTemp(null)
    }, [drag, temp, days, onUpdateDays])

    useEffect(() => {
        if (!drag) return
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        document.body.style.userSelect = 'none'
        document.body.style.cursor = drag.mode === 'move' ? 'grabbing' : 'ns-resize'
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
            document.body.style.userSelect = ''
            document.body.style.cursor = ''
        }
    }, [drag, onMouseMove, onMouseUp])

    function startDrag(e: React.MouseEvent, mode: Drag['mode'], srcDay: number, srcSpot: number, initStart: number, initDur: number) {
        e.preventDefault()
        e.stopPropagation()
        setDrag({ mode, srcDay, srcSpot, initStart, initDur, mouseY0: e.clientY })
        setTemp({ dayIdx: srcDay, start: initStart, dur: initDur })
    }

    const nowTop = (nowMins - GRID_START * 60) * PX_PER_MIN
    const showNow = nowMins >= GRID_START * 60 && nowMins <= GRID_END * 60
    const minW = TIME_COL + colW * days.length

    return (
        <div
            ref={outerRef}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden select-none"
        >
            <div style={{ minWidth: minW }}>
                {/* ── ヘッダー（スティッキー） ── */}
                <div className="flex border-b-2 border-gray-200 bg-white sticky top-0 z-30">
                    <div style={{ width: TIME_COL, flexShrink: 0 }} className="border-r border-gray-200" />
                    {days.map((d, i) => (
                        <div
                            key={i}
                            style={{ width: colW, flexShrink: 0 }}
                            className="py-3 text-center border-r border-gray-100 last:border-r-0"
                        >
                            <p className="text-sm font-bold text-gray-800">{d.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── スクロール可能なグリッド ── */}
                <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: '72vh' }}>
                    <div style={{ position: 'relative', height: GRID_H }}>

                        {/* 時刻ラベル + 水平グリッド線 */}
                        {HOURS.map(h => {
                            const top = (h - GRID_START) * 60 * PX_PER_MIN
                            return (
                                <div key={h}>
                                    {/* 時刻ラベル */}
                                    <div style={{ position: 'absolute', top: top - 9, left: 0, width: TIME_COL }}
                                        className="flex items-center justify-end pr-3">
                                        <span className="text-xs font-medium text-gray-400 tabular-nums">
                                            {String(h).padStart(2, '0')}:00
                                        </span>
                                    </div>
                                    {/* 正時の線（グレー濃いめ） */}
                                    <div style={{ position: 'absolute', top, left: 0, right: 0, height: 1, backgroundColor: '#e2e8f0' }} />
                                    {/* 30分の線（グレー薄め） */}
                                    <div style={{ position: 'absolute', top: top + 30 * PX_PER_MIN, left: TIME_COL, right: 0, height: 1, backgroundColor: '#f1f5f9' }} />
                                </div>
                            )
                        })}

                        {/* 時刻列の右ボーダー */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL, width: 1, backgroundColor: '#e2e8f0' }} />

                        {/* 列区切り線 */}
                        {days.slice(0, -1).map((_, i) => (
                            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL + (i + 1) * colW, width: 1, backgroundColor: '#e5e7eb' }} />
                        ))}

                        {/* 現在時刻ライン（赤） */}
                        {showNow && (
                            <div style={{ position: 'absolute', top: nowTop, left: 0, right: 0, zIndex: 25, pointerEvents: 'none' }}>
                                <div className="flex items-center">
                                    <div style={{ width: TIME_COL }} className="flex justify-end pr-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 -mr-1.5" />
                                    </div>
                                    <div className="flex-1 h-0.5 bg-red-400" />
                                </div>
                            </div>
                        )}

                        {/* ── スポットブロック ── */}
                        {days.map((day, dayIdx) =>
                            day.spots.map((spot, spotIdx) => {
                                const isDragging = drag?.srcDay === dayIdx && drag?.srcSpot === spotIdx
                                const vDay  = (isDragging && temp) ? temp.dayIdx : dayIdx
                                const vStart = (isDragging && temp) ? temp.start : toMins(spot.time)
                                const vDur  = (isDragging && temp) ? temp.dur : Math.max(MIN_DUR, spot.duration_minutes || 60)

                                const top    = (vStart - GRID_START * 60) * PX_PER_MIN
                                const height = Math.max(MIN_DUR * PX_PER_MIN, vDur * PX_PER_MIN)
                                const left   = TIME_COL + vDay * colW + 2
                                const width  = colW - 4

                                const st = STYLES[spot.type] ?? STYLES['その他']

                                return (
                                    <div
                                        key={`${dayIdx}-${spotIdx}`}
                                        style={{
                                            position: 'absolute',
                                            top,
                                            left,
                                            width,
                                            height,
                                            zIndex: isDragging ? 200 : st.light ? 5 : 10,
                                            opacity: st.light ? 0.7 : 1,
                                            borderRadius: 6,
                                            overflow: 'hidden',
                                            backgroundColor: st.bg,
                                            border: `1px solid ${st.border}`,
                                            boxShadow: isDragging
                                                ? `0 8px 24px rgba(0,0,0,0.22), 0 0 0 2px ${st.accent}`
                                                : '0 1px 3px rgba(0,0,0,0.08)',
                                            transition: isDragging ? 'none' : 'box-shadow 0.15s',
                                        }}
                                    >
                                        {/* 左アクセントバー */}
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0,
                                            width: ACCENT, height: '100%',
                                            backgroundColor: st.accent,
                                        }} />

                                        {/* 上端リサイズハンドル */}
                                        <div
                                            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HANDLE, cursor: 'n-resize', zIndex: 3 }}
                                            className="hover:bg-black/10"
                                            onMouseDown={e => startDrag(e, 'resize-top', dayIdx, spotIdx, toMins(spot.time), Math.max(MIN_DUR, spot.duration_minutes || 60))}
                                        />

                                        {/* コンテンツ（ドラッグ可能） */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: HANDLE, bottom: HANDLE,
                                                left: ACCENT + 6, right: 4,
                                                cursor: 'grab',
                                                overflow: 'hidden',
                                            }}
                                            onMouseDown={e => startDrag(e, 'move', dayIdx, spotIdx, toMins(spot.time), Math.max(MIN_DUR, spot.duration_minutes || 60))}
                                        >
                                            <p style={{
                                                fontSize: 12,
                                                fontWeight: st.light ? 400 : 600,
                                                color: st.text,
                                                lineHeight: 1.35,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: height < 52 ? 1 : 2,
                                                WebkitBoxOrient: 'vertical' as const,
                                                margin: 0,
                                            }}>
                                                {spot.name}
                                            </p>
                                            {height > 48 && (
                                                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                                                    {toTime(vStart)} › {toTime(Math.min(vStart + vDur, GRID_END * 60))}
                                                </p>
                                            )}
                                        </div>

                                        {/* 下端リサイズハンドル */}
                                        <div
                                            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: HANDLE, cursor: 's-resize', zIndex: 3 }}
                                            className="hover:bg-black/10"
                                            onMouseDown={e => startDrag(e, 'resize-bottom', dayIdx, spotIdx, toMins(spot.time), Math.max(MIN_DUR, spot.duration_minutes || 60))}
                                        />
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
