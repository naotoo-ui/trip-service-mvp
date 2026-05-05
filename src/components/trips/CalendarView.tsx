'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { ItineraryDay, Spot } from '@/types'

// ────────── 定数 ──────────
const GRID_START = 6
const GRID_END   = 24
const SNAP       = 10
const MIN_DUR    = 20
const TIME_COL   = 56    // 時刻ラベル列幅(px)
const ACCENT     = 4     // 左アクセントバー幅(px)
const HANDLE     = 8     // リサイズハンドル高さ(px)
const ZOOM_MIN   = 0.7
const ZOOM_MAX   = 2.5
const ZOOM_DEF   = 1.2   // デフォルト: 72px/時

const HOURS      = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i)
const WEEKDAYS   = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_COLORS = ['#ef4444', '#374151', '#374151', '#374151', '#374151', '#374151', '#3b82f6']

// ────────── ユーティリティ ──────────
function toMins(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return isNaN(h) ? GRID_START * 60 : h * 60 + (m || 0)
}
function toTime(mins: number): string {
    const h = Math.floor(mins / 60), m = mins % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
function snap(v: number) { return Math.round(v / SNAP) * SNAP }

// ────────── ブロックスタイル ──────────
const STYLES: Record<string, { accent: string; bg: string; border: string; text: string; light?: boolean }> = {
    観光:   { accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    グルメ: { accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
    移動:   { accent: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', text: '#94a3b8', light: true },
    宿泊:   { accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
    その他: { accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
}

// ────────── 型 ──────────
interface Drag {
    mode: 'move' | 'resize-top' | 'resize-bottom'
    srcDay: number; srcSpot: number
    initStart: number; initDur: number; mouseY0: number
}
interface Temp { dayIdx: number; start: number; dur: number }

interface Props {
    days: ItineraryDay[]
    startDate?: Date        // 設定されていれば各列に実際の日付を表示
    onUpdateDays: (updated: ItineraryDay[]) => void
}

// ────────── コンポーネント ──────────
export default function CalendarView({ days, startDate, onUpdateDays }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [colW, setColW]       = useState(160)
    const [ppm, setPpm]         = useState(ZOOM_DEF)    // pixels per minute
    const [drag, setDrag]       = useState<Drag | null>(null)
    const [temp, setTemp]       = useState<Temp | null>(null)
    const [nowMins, setNowMins] = useState(() => { const n = new Date(); return n.getHours() * 60 + n.getMinutes() })

    const GRID_H = (GRID_END - GRID_START) * 60 * ppm

    // 現在時刻を毎分更新
    useEffect(() => {
        const t = setInterval(() => { const n = new Date(); setNowMins(n.getHours() * 60 + n.getMinutes()) }, 60000)
        return () => clearInterval(t)
    }, [])

    // 列幅を動的計算
    useEffect(() => {
        const calc = () => {
            if (containerRef.current) {
                const avail = containerRef.current.clientWidth - TIME_COL
                setColW(Math.max(110, avail / days.length))
            }
        }
        calc()
        window.addEventListener('resize', calc)
        return () => window.removeEventListener('resize', calc)
    }, [days.length])

    // 8時へ初期スクロール
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = (8 - GRID_START) * 60 * ppm
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const xToDayIdx = useCallback((clientX: number) => {
        if (!containerRef.current) return 0
        const rect = containerRef.current.getBoundingClientRect()
        const relX = clientX - rect.left + containerRef.current.scrollLeft - TIME_COL
        return Math.max(0, Math.min(days.length - 1, Math.floor(relX / colW)))
    }, [days.length, colW])

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!drag) return
        const dMins = (e.clientY - drag.mouseY0) / ppm
        if (drag.mode === 'move') {
            const s = snap(drag.initStart + dMins)
            setTemp({ dayIdx: xToDayIdx(e.clientX), start: Math.max(GRID_START * 60, Math.min(GRID_END * 60 - drag.initDur, s)), dur: drag.initDur })
        } else if (drag.mode === 'resize-bottom') {
            setTemp({ dayIdx: drag.srcDay, start: drag.initStart, dur: Math.max(MIN_DUR, snap(drag.initDur + dMins)) })
        } else {
            const ns = snap(Math.max(GRID_START * 60, drag.initStart + dMins))
            setTemp({ dayIdx: drag.srcDay, start: ns, dur: Math.max(MIN_DUR, drag.initDur - (ns - drag.initStart)) })
        }
    }, [drag, ppm, xToDayIdx])

    const onMouseUp = useCallback(() => {
        if (!drag || !temp) { setDrag(null); setTemp(null); return }
        const srcSpot = days[drag.srcDay]?.spots[drag.srcSpot]
        if (!srcSpot) { setDrag(null); setTemp(null); return }

        const updated: Spot = { ...srcSpot, time: toTime(temp.start), duration_minutes: temp.dur }
        let newDays: ItineraryDay[]
        if (temp.dayIdx === drag.srcDay) {
            newDays = days.map((d, i) => i === drag.srcDay ? { ...d, spots: d.spots.map((s, j) => j === drag.srcSpot ? updated : s) } : d)
        } else {
            const srcSpots  = days[drag.srcDay].spots.filter((_, j) => j !== drag.srcSpot)
            const destSpots = [...days[temp.dayIdx].spots, updated].sort((a, b) => toMins(a.time) - toMins(b.time))
            newDays = days.map((d, i) => i === drag.srcDay ? { ...d, spots: srcSpots } : i === temp.dayIdx ? { ...d, spots: destSpots } : d)
        }
        onUpdateDays(newDays)
        setDrag(null); setTemp(null)
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
        e.preventDefault(); e.stopPropagation()
        setDrag({ mode, srcDay, srcSpot, initStart, initDur, mouseY0: e.clientY })
        setTemp({ dayIdx: srcDay, start: initStart, dur: initDur })
    }

    const minW       = TIME_COL + colW * days.length
    const nowTop     = (nowMins - GRID_START * 60) * ppm
    const showNow    = nowMins >= GRID_START * 60 && nowMins <= GRID_END * 60
    const todayIdx   = startDate
        ? days.findIndex((_, i) => {
            const d = new Date(startDate); d.setDate(d.getDate() + i)
            return d.toDateString() === new Date().toDateString()
          })
        : -1

    // 列ヘッダーの日付情報を計算
    function colHeader(i: number) {
        if (!startDate) return { top: days[i]?.label ?? `${i + 1}日目`, bottom: null, isToday: false, weekday: -1 }
        const d = new Date(startDate)
        d.setDate(d.getDate() + i)
        const wd = d.getDay()
        return {
            top:     `${d.getMonth() + 1}/${d.getDate()}`,
            bottom:  WEEKDAYS[wd],
            sub:     days[i]?.label ?? `${i + 1}日目`,
            isToday: d.toDateString() === new Date().toDateString(),
            weekday: wd,
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm" style={{ overflow: 'hidden' }}>

            {/* ── ズームコントロール ── */}
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-400">表示サイズ</span>
                <button
                    onClick={() => setPpm(p => Math.max(ZOOM_MIN, +(p - 0.2).toFixed(1)))}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 text-sm font-bold flex items-center justify-center"
                >−</button>
                <div className="w-20 h-1.5 bg-gray-200 rounded-full relative">
                    <div
                        className="h-1.5 bg-blue-400 rounded-full transition-all"
                        style={{ width: `${((ppm - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100}%` }}
                    />
                </div>
                <button
                    onClick={() => setPpm(p => Math.min(ZOOM_MAX, +(p + 0.2).toFixed(1)))}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 text-sm font-bold flex items-center justify-center"
                >＋</button>
            </div>

            {/* ── カレンダー本体（単一スクロールコンテナ）── */}
            <div
                ref={containerRef}
                className="overflow-auto select-none"
                style={{ maxHeight: '62vh' }}
            >
                <div style={{ minWidth: minW }}>

                    {/* ── 列ヘッダー（sticky）── */}
                    <div
                        className="sticky top-0 z-30 bg-white border-b-2 border-gray-200"
                        style={{ display: 'flex', minWidth: minW }}
                    >
                        {/* 時刻列の上部スペース */}
                        <div style={{ width: TIME_COL, flexShrink: 0, borderRight: '1px solid #e2e8f0' }} />

                        {/* 各日の列ヘッダー */}
                        {days.map((_, i) => {
                            const h = colHeader(i)
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: colW, flexShrink: 0,
                                        borderRight: i < days.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        backgroundColor: h.isToday ? '#eff6ff' : 'transparent',
                                        padding: '8px 4px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {startDate ? (
                                        <>
                                            <p style={{ fontSize: 11, color: WEEKDAY_COLORS[h.weekday] ?? '#374151', fontWeight: 600, margin: 0 }}>
                                                {h.bottom}
                                            </p>
                                            <p style={{ fontSize: 18, fontWeight: 700, color: h.isToday ? '#2563eb' : '#111827', lineHeight: 1.2, margin: '2px 0' }}>
                                                {h.top}
                                            </p>
                                            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>
                                                {'sub' in h ? h.sub : ''}
                                            </p>
                                        </>
                                    ) : (
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: 0, lineHeight: '40px' }}>
                                            {h.top}
                                        </p>
                                    )}
                                    {h.isToday && (
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2563eb', margin: '0 auto' }} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* ── グリッド本体 ── */}
                    <div style={{ position: 'relative', height: GRID_H }}>

                        {/* 時刻ラベル + 水平線 */}
                        {HOURS.map(h => {
                            const top = (h - GRID_START) * 60 * ppm
                            return (
                                <div key={h}>
                                    <div style={{ position: 'absolute', top: top - 9, left: 4, width: TIME_COL - 8, textAlign: 'right' }}>
                                        <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                                            {String(h).padStart(2, '0')}:00
                                        </span>
                                    </div>
                                    {/* 正時ライン */}
                                    <div style={{ position: 'absolute', top, left: 0, right: 0, height: 1, backgroundColor: '#e2e8f0' }} />
                                    {/* 30分ライン */}
                                    <div style={{ position: 'absolute', top: top + 30 * ppm, left: TIME_COL, right: 0, height: 1, backgroundColor: '#f1f5f9' }} />
                                </div>
                            )
                        })}

                        {/* 時刻列の右ボーダー */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL, width: 1, backgroundColor: '#e2e8f0' }} />

                        {/* 列区切り */}
                        {days.slice(0, -1).map((_, i) => (
                            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL + (i + 1) * colW, width: 1, backgroundColor: '#f1f5f9' }} />
                        ))}

                        {/* 今日の列ハイライト */}
                        {todayIdx >= 0 && (
                            <div style={{
                                position: 'absolute', top: 0, bottom: 0,
                                left: TIME_COL + todayIdx * colW,
                                width: colW,
                                backgroundColor: 'rgba(37, 99, 235, 0.02)',
                                pointerEvents: 'none',
                            }} />
                        )}

                        {/* 現在時刻ライン（赤） */}
                        {showNow && (
                            <div style={{ position: 'absolute', top: nowTop, left: 0, right: 0, zIndex: 25, pointerEvents: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: TIME_COL, display: 'flex', justifyContent: 'flex-end', paddingRight: 4 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', marginRight: -5 }} />
                                    </div>
                                    <div style={{ flex: 1, height: 2, backgroundColor: '#ef4444', opacity: 0.8 }} />
                                </div>
                            </div>
                        )}

                        {/* ── イベントブロック ── */}
                        {days.map((day, dayIdx) =>
                            day.spots.map((spot, spotIdx) => {
                                const isDragging = drag?.srcDay === dayIdx && drag?.srcSpot === spotIdx
                                const vDay   = (isDragging && temp) ? temp.dayIdx : dayIdx
                                const vStart = (isDragging && temp) ? temp.start  : toMins(spot.time)
                                const vDur   = (isDragging && temp) ? temp.dur    : Math.max(MIN_DUR, spot.duration_minutes || 60)

                                const top    = (vStart - GRID_START * 60) * ppm
                                const height = Math.max(MIN_DUR * ppm, vDur * ppm)
                                const left   = TIME_COL + vDay * colW + 2
                                const width  = colW - 4
                                const st     = STYLES[spot.type] ?? STYLES['その他']

                                return (
                                    <div
                                        key={`${dayIdx}-${spotIdx}`}
                                        style={{
                                            position: 'absolute', top, left, width, height,
                                            zIndex: isDragging ? 200 : st.light ? 5 : 10,
                                            opacity: st.light ? 0.72 : 1,
                                            borderRadius: 6,
                                            overflow: 'hidden',
                                            backgroundColor: st.bg,
                                            border: `1px solid ${st.border}`,
                                            boxShadow: isDragging
                                                ? `0 8px 28px rgba(0,0,0,0.22), 0 0 0 2px ${st.accent}`
                                                : '0 1px 4px rgba(0,0,0,0.07)',
                                            transition: isDragging ? 'none' : 'box-shadow 0.15s',
                                        }}
                                    >
                                        {/* 左アクセントバー */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: ACCENT, height: '100%', backgroundColor: st.accent }} />

                                        {/* 上端リサイズハンドル */}
                                        <div
                                            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HANDLE, cursor: 'n-resize', zIndex: 3 }}
                                            className="hover:bg-black/10"
                                            onMouseDown={e => startDrag(e, 'resize-top', dayIdx, spotIdx, toMins(spot.time), Math.max(MIN_DUR, spot.duration_minutes || 60))}
                                        />

                                        {/* コンテンツ */}
                                        <div
                                            style={{ position: 'absolute', top: HANDLE, bottom: HANDLE, left: ACCENT + 6, right: 4, cursor: 'grab', overflow: 'hidden' }}
                                            onMouseDown={e => startDrag(e, 'move', dayIdx, spotIdx, toMins(spot.time), Math.max(MIN_DUR, spot.duration_minutes || 60))}
                                        >
                                            <p style={{
                                                fontSize: 12, fontWeight: st.light ? 400 : 600,
                                                color: st.text, lineHeight: 1.35, margin: 0,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: height < 52 ? 1 : 2,
                                                WebkitBoxOrient: 'vertical' as const,
                                            }}>
                                                {spot.name}
                                            </p>
                                            {height > 46 && (
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
