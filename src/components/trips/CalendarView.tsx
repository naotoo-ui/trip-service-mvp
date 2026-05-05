'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { ItineraryDay, Spot } from '@/types'

const PX_PER_MIN = 1.5
const GRID_START = 6    // 6時スタート
const GRID_END = 24     // 24時まで
const SNAP = 10         // 10分スナップ
const MIN_DUR = 20      // ブロック最小高さ(分)
const TIME_COL = 52     // 時刻ラベル列の幅(px)
const HANDLE_H = 8      // リサイズハンドルの高さ(px)

const HOURS = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i)
const TOTAL_MINS = (GRID_END - GRID_START) * 60
const GRID_H = TOTAL_MINS * PX_PER_MIN

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

function snapTo(v: number): number {
    return Math.round(v / SNAP) * SNAP
}

const BLOCK_STYLE: Record<string, { bg: string; border: string; text: string; isLight?: boolean }> = {
    観光:   { bg: 'bg-sky-100',      border: 'border-sky-300',    text: 'text-sky-800'     },
    グルメ: { bg: 'bg-orange-100',   border: 'border-orange-300', text: 'text-orange-800'  },
    移動:   { bg: 'bg-gray-50',      border: 'border-gray-200',   text: 'text-gray-400', isLight: true },
    宿泊:   { bg: 'bg-purple-100',   border: 'border-purple-300', text: 'text-purple-800'  },
    その他: { bg: 'bg-emerald-100',  border: 'border-emerald-300', text: 'text-emerald-800' },
}

interface DragState {
    mode: 'move' | 'resize-top' | 'resize-bottom'
    srcDay: number
    srcSpot: number
    initStart: number
    initDur: number
    mouseY0: number
}

interface TempPos {
    dayIdx: number
    start: number
    dur: number
}

interface Props {
    days: ItineraryDay[]
    onUpdateDays: (updated: ItineraryDay[]) => void
}

export default function CalendarView({ days, onUpdateDays }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [colW, setColW] = useState(140)
    const [drag, setDrag] = useState<DragState | null>(null)
    const [temp, setTemp] = useState<TempPos | null>(null)

    useEffect(() => {
        const calc = () => {
            if (containerRef.current) {
                const available = containerRef.current.clientWidth - TIME_COL
                setColW(Math.max(100, available / days.length))
            }
        }
        calc()
        window.addEventListener('resize', calc)
        return () => window.removeEventListener('resize', calc)
    }, [days.length])

    const xToDayIdx = useCallback((clientX: number): number => {
        if (!containerRef.current) return 0
        const rect = containerRef.current.getBoundingClientRect()
        const relX = clientX - rect.left - TIME_COL
        return Math.max(0, Math.min(days.length - 1, Math.floor(relX / colW)))
    }, [days.length, colW])

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!drag) return
        const deltaY = e.clientY - drag.mouseY0
        const deltaMins = deltaY / PX_PER_MIN

        if (drag.mode === 'move') {
            const newStart = snapTo(drag.initStart + deltaMins)
            const clamped = Math.max(GRID_START * 60, Math.min(GRID_END * 60 - drag.initDur, newStart))
            const newDay = xToDayIdx(e.clientX)
            setTemp({ dayIdx: newDay, start: clamped, dur: drag.initDur })
        } else if (drag.mode === 'resize-bottom') {
            const newDur = Math.max(MIN_DUR, snapTo(drag.initDur + deltaMins))
            setTemp({ dayIdx: drag.srcDay, start: drag.initStart, dur: newDur })
        } else {
            const rawStart = drag.initStart + deltaMins
            const newStart = snapTo(Math.max(GRID_START * 60, rawStart))
            const newDur = Math.max(MIN_DUR, drag.initDur - (newStart - drag.initStart))
            setTemp({ dayIdx: drag.srcDay, start: newStart, dur: newDur })
        }
    }, [drag, xToDayIdx])

    const onMouseUp = useCallback(() => {
        if (!drag || !temp) {
            setDrag(null)
            setTemp(null)
            return
        }
        const srcSpot = days[drag.srcDay]?.spots[drag.srcSpot]
        if (!srcSpot) {
            setDrag(null)
            setTemp(null)
            return
        }

        const updated: Spot = { ...srcSpot, time: toTime(temp.start), duration_minutes: temp.dur }
        let newDays: ItineraryDay[]

        if (temp.dayIdx === drag.srcDay) {
            newDays = days.map((d, i) =>
                i === drag.srcDay
                    ? { ...d, spots: d.spots.map((s, j) => j === drag.srcSpot ? updated : s) }
                    : d
            )
        } else {
            // 日をまたぐ移動
            const srcSpots = days[drag.srcDay].spots.filter((_, j) => j !== drag.srcSpot)
            const destSpots = [...days[temp.dayIdx].spots, updated]
                .sort((a, b) => toMins(a.time) - toMins(b.time))
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

    function startDrag(
        e: React.MouseEvent,
        mode: DragState['mode'],
        srcDay: number,
        srcSpot: number,
        initStart: number,
        initDur: number
    ) {
        e.preventDefault()
        e.stopPropagation()
        setDrag({ mode, srcDay, srcSpot, initStart, initDur, mouseY0: e.clientY })
        setTemp({ dayIdx: srcDay, start: initStart, dur: initDur })
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white select-none">
            <div ref={containerRef} style={{ minWidth: TIME_COL + colW * days.length }}>

                {/* ヘッダー: 日付ラベル */}
                <div className="flex border-b border-gray-100 bg-gray-50 sticky top-0 z-20">
                    <div style={{ width: TIME_COL, flexShrink: 0 }} />
                    {days.map((d, i) => (
                        <div
                            key={i}
                            style={{ width: colW, flexShrink: 0 }}
                            className="text-center text-xs font-semibold text-gray-600 py-2.5 border-l border-gray-100"
                        >
                            {d.label}
                        </div>
                    ))}
                </div>

                {/* グリッド本体 */}
                <div style={{ position: 'relative', height: GRID_H }}>

                    {/* 時刻ラベル + 水平線 */}
                    {HOURS.map(h => {
                        const topPx = (h - GRID_START) * 60 * PX_PER_MIN
                        return (
                            <div key={h}>
                                <div
                                    style={{ position: 'absolute', top: topPx - 8, left: 0, width: TIME_COL }}
                                    className="flex items-center justify-end pr-2"
                                >
                                    <span className="text-xs text-gray-300 tabular-nums">
                                        {String(h).padStart(2, '0')}:00
                                    </span>
                                </div>
                                <div
                                    style={{ position: 'absolute', top: topPx, left: TIME_COL, right: 0, height: 1 }}
                                    className="bg-gray-100"
                                />
                                {/* 30分線 */}
                                <div
                                    style={{ position: 'absolute', top: topPx + 30 * PX_PER_MIN, left: TIME_COL, right: 0, height: 1 }}
                                    className="bg-gray-50"
                                />
                            </div>
                        )
                    })}

                    {/* 縦の列区切り線 */}
                    {days.map((_, i) => (
                        <div
                            key={i}
                            style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL + i * colW, width: 1 }}
                            className="bg-gray-100"
                        />
                    ))}

                    {/* スポットブロック */}
                    {days.map((day, dayIdx) =>
                        day.spots.map((spot, spotIdx) => {
                            const isDragging = drag?.srcDay === dayIdx && drag?.srcSpot === spotIdx

                            const vDayIdx = (isDragging && temp) ? temp.dayIdx : dayIdx
                            const vStart  = (isDragging && temp) ? temp.start  : toMins(spot.time)
                            const vDur    = (isDragging && temp) ? temp.dur    : Math.max(MIN_DUR, spot.duration_minutes || 60)

                            const top    = (vStart - GRID_START * 60) * PX_PER_MIN
                            const height = Math.max(MIN_DUR * PX_PER_MIN, vDur * PX_PER_MIN)
                            const left   = TIME_COL + vDayIdx * colW + 2
                            const width  = colW - 4

                            const st = BLOCK_STYLE[spot.type] ?? BLOCK_STYLE['その他']

                            return (
                                <div
                                    key={`${dayIdx}-${spotIdx}`}
                                    style={{
                                        position: 'absolute',
                                        top,
                                        left,
                                        width,
                                        height,
                                        zIndex: isDragging ? 100 : st.isLight ? 5 : 10,
                                        opacity: isDragging ? 0.9 : st.isLight ? 0.65 : 1,
                                    }}
                                    className={`rounded-lg border ${st.bg} ${st.border} overflow-hidden ${
                                        isDragging ? 'shadow-2xl ring-2 ring-blue-400 ring-offset-1' : 'shadow-sm'
                                    }`}
                                >
                                    {/* 上端リサイズハンドル */}
                                    <div
                                        style={{ height: HANDLE_H, cursor: 'n-resize', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}
                                        className="hover:bg-black/10"
                                        onMouseDown={e => startDrag(e, 'resize-top', dayIdx, spotIdx, toMins(spot.time), Math.max(MIN_DUR, spot.duration_minutes || 60))}
                                    />

                                    {/* ドラッグ可能な本体 */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: HANDLE_H,
                                            bottom: HANDLE_H,
                                            left: 0,
                                            right: 0,
                                            cursor: 'grab',
                                            overflow: 'hidden',
                                            padding: '2px 6px',
                                        }}
                                        onMouseDown={e => startDrag(e, 'move', dayIdx, spotIdx, toMins(spot.time), Math.max(MIN_DUR, spot.duration_minutes || 60))}
                                    >
                                        <p className={`text-xs font-semibold leading-tight truncate ${st.text}`}>
                                            {spot.name}
                                        </p>
                                        {height > 44 && (
                                            <p className="text-xs text-gray-400 leading-none mt-0.5 tabular-nums">
                                                {toTime(vStart)}
                                                {!st.isLight && ` › ${toTime(vStart + vDur)}`}
                                            </p>
                                        )}
                                    </div>

                                    {/* 下端リサイズハンドル */}
                                    <div
                                        style={{ height: HANDLE_H, cursor: 's-resize', position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 }}
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
    )
}
