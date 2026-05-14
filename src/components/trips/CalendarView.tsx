'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { ItineraryDay, Spot, SidebarSpot, SpotType } from '@/types'

// ────────── 定数 ──────────
const GRID_START = 6
const GRID_END   = 24
const SNAP       = 10
const MIN_DUR    = 20
const TIME_COL   = 56
const ACCENT     = 4
const HANDLE     = 8
const BASE_PPM   = 1.0   // pixels per minute at zoom=1.0

// GRID_END も含めて 24:00 ラベルを表示するため +1
const HOURS        = Array.from({ length: GRID_END - GRID_START + 1 }, (_, i) => GRID_START + i)
const WEEKDAYS     = ['日', '月', '火', '水', '木', '金', '土']
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
function getDur(s: Spot)  { return Math.max(MIN_DUR, s.duration_minutes || 60) }

// ────────── コンテンツ時間帯（初期スクロール用）──────────
function calcContentRange(days: ItineraryDay[]): { start: number; end: number } {
    let minH = 9, maxH = 20, found = false
    for (const day of days) {
        for (const spot of day.spots) {
            const sH = Math.floor(toMins(spot.time) / 60)
            const eH = Math.ceil((toMins(spot.time) + getDur(spot)) / 60)
            if (!found) { minH = sH; maxH = eH; found = true }
            else { minH = Math.min(minH, sH); maxH = Math.max(maxH, eH) }
        }
    }
    return {
        start: Math.max(GRID_START, minH - 1) * 60,
        end:   Math.min(GRID_END,   maxH + 1) * 60,
    }
}

// ────────── ドラッグ後の配置ロジック ──────────

// 重なりがなくなるよう時刻の早い順に cascade push
function resolveNoOverlap(spots: Spot[]): Spot[] {
    const result = [...spots].sort((a, b) => toMins(a.time) - toMins(b.time))
    for (let i = 1; i < result.length; i++) {
        const prevEnd = toMins(result[i - 1].time) + getDur(result[i - 1])
        if (toMins(result[i].time) < prevEnd) {
            result[i] = { ...result[i], time: toTime(prevEnd) }
        }
    }
    return result
}

// 【同一日 move】移動したブロックのみ新位置へ。重なりが生じる場合のみ cascade push。
function applyMoveSameDay(spots: Spot[], dragIdx: number, newSpot: Spot): Spot[] {
    const others = spots.filter((_, i) => i !== dragIdx)
    return resolveNoOverlap([...others, newSpot])
}

// 【他日 move - 移動元】A を除去するだけ。他ブロックはその場を保持。
function removeFromDay(spots: Spot[], dragIdx: number): Spot[] {
    return spots
        .filter((_, i) => i !== dragIdx)
        .sort((a, b) => toMins(a.time) - toMins(b.time))
}

// 【他日 move - 移動先】重なるブロックの duration を削減して A を挿入
function insertWithCompress(spots: Spot[], newSpot: Spot): Spot[] {
    const ns = toMins(newSpot.time)
    const nd = getDur(newSpot)
    const ne = ns + nd

    const compressed = spots.map(s => {
        const st  = toMins(s.time)
        const dur = getDur(s)
        const se  = st + dur

        if (se <= ns || st >= ne) return s   // 重なりなし

        if (st < ns) {
            return { ...s, duration_minutes: Math.max(MIN_DUR, ns - st) }
        } else {
            const overlap = ne - st
            return { ...s, time: toTime(ne), duration_minutes: Math.max(MIN_DUR, dur - overlap) }
        }
    })

    return resolveNoOverlap([...compressed, newSpot])
}

// 【リサイズ】上端拡張→前ブロックを後ろに押し出し、下端拡張→後ブロックを前に押し出し、縮小→cascade なし
function applyResize(spots: Spot[], resizedIdx: number, newSpot: Spot): Spot[] {
    const orig    = spots[resizedIdx]
    const origStart = toMins(orig.time)
    const origEnd   = origStart + getDur(orig)
    const newStart  = toMins(newSpot.time)
    const newEnd    = newStart + getDur(newSpot)

    const updated = spots.map((s, i) => i === resizedIdx ? newSpot : s)
    const sorted  = [...updated].sort((a, b) => toMins(a.time) - toMins(b.time))
    const idx     = sorted.findIndex(s => s === newSpot)

    if (newStart < origStart) {
        // 上端を拡張: 前のブロックを上方向へ押し出し
        let boundary = newStart
        for (let i = idx - 1; i >= 0; i--) {
            const end = toMins(sorted[i].time) + getDur(sorted[i])
            if (end > boundary) {
                const dur = getDur(sorted[i])
                sorted[i] = { ...sorted[i], time: toTime(boundary - dur) }
                boundary -= dur
            } else break
        }
    } else if (newEnd > origEnd) {
        // 下端を拡張: 後ろのブロックを下方向へ押し出し
        let boundary = newEnd
        for (let i = idx + 1; i < sorted.length; i++) {
            const start = toMins(sorted[i].time)
            if (start < boundary) {
                sorted[i] = { ...sorted[i], time: toTime(boundary) }
                boundary += getDur(sorted[i])
            } else break
        }
    }
    // 縮小時: cascade なし（gap のみ）

    return sorted.sort((a, b) => toMins(a.time) - toMins(b.time))
}

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
    startDate?: Date
    zoom: number
    onUpdateDays: (updated: ItineraryDay[]) => void
    onDropSuggestedSpot?: (dayIdx: number, time: string, spot: SidebarSpot) => void
    onDropFreeBlock?: (dayIdx: number, time: string, type: SpotType) => void
    onMoveToSidebar?: (spot: Spot, dayIdx: number, spotIdx: number) => void
    onDraggingToSidebarChange?: (v: boolean) => void
    onDoubleClickSpot?: (spot: Spot, dayIdx: number, spotIdx: number) => void
}

// ────────── コンポーネント ──────────
export default function CalendarView({ days, startDate, zoom, onUpdateDays, onDropSuggestedSpot, onDropFreeBlock, onMoveToSidebar, onDraggingToSidebarChange, onDoubleClickSpot }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const gridBodyRef  = useRef<HTMLDivElement>(null)

    // コールバック ref（useCallback の deps に含めずに最新値を参照するため）
    const onMoveToSidebarRef            = useRef(onMoveToSidebar)
    const onDraggingToSidebarChangeRef  = useRef(onDraggingToSidebarChange)
    onMoveToSidebarRef.current           = onMoveToSidebar
    onDraggingToSidebarChangeRef.current = onDraggingToSidebarChange

    const [colW, setColW] = useState(160)
    const ppm             = BASE_PPM * zoom

    const [drag, setDrag]                   = useState<Drag | null>(null)
    const [temp, setTemp]                   = useState<Temp | null>(null)
    const tempRef                           = useRef<Temp | null>(null)
    tempRef.current                         = temp
    const [dragOver, setDragOver]           = useState<{ dayIdx: number; start: number } | null>(null)
    const [isDraggingToSidebar, setIsDraggingToSidebar] = useState(false)
    const isDraggingToSidebarRef            = useRef(false)
    const [nowMins, setNowMins] = useState(() => { const n = new Date(); return n.getHours() * 60 + n.getMinutes() })

    const GRID_H = (GRID_END - GRID_START) * 60 * ppm + 48

    useEffect(() => {
        const t = setInterval(() => { const n = new Date(); setNowMins(n.getHours() * 60 + n.getMinutes()) }, 60000)
        return () => clearInterval(t)
    }, [])

    // コンテンツ開始時刻へ初期スクロール（マウント時のみ）
    useEffect(() => {
        if (!containerRef.current) return
        const range = calcContentRange(days)
        containerRef.current.scrollTop = (range.start - GRID_START * 60) * BASE_PPM
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // 列幅計算
    useEffect(() => {
        const doCalc = () => {
            if (!containerRef.current) return
            setColW(Math.max(110, (containerRef.current.clientWidth - TIME_COL) / days.length))
        }
        const id = requestAnimationFrame(doCalc)
        window.addEventListener('resize', doCalc)
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', doCalc) }
    }, [days.length])

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
            // カレンダー右端を越えたらサイドバーへのドラッグとして扱う
            const rect = containerRef.current?.getBoundingClientRect()
            const toSidebar = !!rect && e.clientX > rect.right + 4
            if (toSidebar !== isDraggingToSidebarRef.current) {
                isDraggingToSidebarRef.current = toSidebar
                setIsDraggingToSidebar(toSidebar)
                onDraggingToSidebarChangeRef.current?.(toSidebar)
            }
            const s = snap(drag.initStart + dMins)
            setTemp({ dayIdx: xToDayIdx(e.clientX), start: Math.max(GRID_START * 60, Math.min(GRID_END * 60 - drag.initDur, s)), dur: drag.initDur })
        } else if (drag.mode === 'resize-bottom') {
            setTemp({ dayIdx: drag.srcDay, start: drag.initStart, dur: Math.max(MIN_DUR, snap(drag.initDur + dMins)) })
        } else {
            const ns = snap(Math.max(GRID_START * 60, drag.initStart + dMins))
            setTemp({ dayIdx: drag.srcDay, start: ns, dur: Math.max(MIN_DUR, drag.initDur - (ns - drag.initStart)) })
        }
    }, [drag, ppm, xToDayIdx])

    function resetSidebarDrag() {
        if (isDraggingToSidebarRef.current) {
            isDraggingToSidebarRef.current = false
            setIsDraggingToSidebar(false)
            onDraggingToSidebarChangeRef.current?.(false)
        }
    }

    const onMouseUp = useCallback(() => {
        // temp は ref 経由で参照（temp を deps に入れると onMouseUp が毎フレーム再生成され
        // useEffect クリーンアップが走り resetSidebarDrag() がリセットされ続けるバグを防ぐ）
        const t = tempRef.current
        if (!drag || !t) { setDrag(null); setTemp(null); return }

        // サイドバーへのドラッグ完了
        if (isDraggingToSidebarRef.current && drag.mode === 'move') {
            const srcSpot = days[drag.srcDay]?.spots[drag.srcSpot]
            if (srcSpot) {
                onMoveToSidebarRef.current?.(srcSpot, drag.srcDay, drag.srcSpot)
            }
            isDraggingToSidebarRef.current = false
            setIsDraggingToSidebar(false)
            onDraggingToSidebarChangeRef.current?.(false)
            setDrag(null); setTemp(null)
            return
        }
        isDraggingToSidebarRef.current = false
        setIsDraggingToSidebar(false)

        const srcSpot = days[drag.srcDay]?.spots[drag.srcSpot]
        if (!srcSpot) { setDrag(null); setTemp(null); return }

        const newSpot: Spot = { ...srcSpot, time: toTime(t.start), duration_minutes: t.dur }
        let newDays: ItineraryDay[]

        if (drag.mode !== 'move') {
            const newSpots = applyResize(days[drag.srcDay].spots, drag.srcSpot, newSpot)
            newDays = days.map((d, i) => i === drag.srcDay ? { ...d, spots: newSpots } : d)
        } else if (t.dayIdx === drag.srcDay) {
            const newSpots = applyMoveSameDay(days[drag.srcDay].spots, drag.srcSpot, newSpot)
            newDays = days.map((d, i) => i === drag.srcDay ? { ...d, spots: newSpots } : d)
        } else {
            const srcSpots  = removeFromDay(days[drag.srcDay].spots, drag.srcSpot)
            const destSpots = insertWithCompress(days[t.dayIdx].spots, newSpot)
            newDays = days.map((d, i) =>
                i === drag.srcDay ? { ...d, spots: srcSpots  } :
                i === t.dayIdx   ? { ...d, spots: destSpots } : d
            )
        }

        onUpdateDays(newDays)
        setDrag(null); setTemp(null)
    }, [drag, days, onUpdateDays])

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
            resetSidebarDrag()
        }
    }, [drag, onMouseMove, onMouseUp]) // eslint-disable-line react-hooks/exhaustive-deps

    function startDrag(e: React.MouseEvent, mode: Drag['mode'], srcDay: number, srcSpot: number, initStart: number, initDur: number) {
        e.preventDefault(); e.stopPropagation()
        setDrag({ mode, srcDay, srcSpot, initStart, initDur, mouseY0: e.clientY })
        setTemp({ dayIdx: srcDay, start: initStart, dur: initDur })
    }

    function calcDropPos(e: React.DragEvent): { dayIdx: number; time: string } | null {
        if (!containerRef.current || !gridBodyRef.current) return null
        const cr = containerRef.current.getBoundingClientRect()
        const gridOffsetTop = gridBodyRef.current.offsetTop
        const relY = e.clientY - cr.top + containerRef.current.scrollTop - gridOffsetTop
        const relX = e.clientX - cr.left - TIME_COL
        const timeMins = snap(Math.max(GRID_START * 60, Math.min(GRID_END * 60 - MIN_DUR, GRID_START * 60 + relY / ppm)))
        const dayIdx = Math.max(0, Math.min(days.length - 1, Math.floor(relX / colW)))
        return { dayIdx, time: toTime(timeMins) }
    }

    const minW     = TIME_COL + colW * days.length
    const nowTop   = (nowMins - GRID_START * 60) * ppm
    const showNow  = nowMins >= GRID_START * 60 && nowMins <= GRID_END * 60
    const todayIdx = startDate
        ? days.findIndex((_, i) => {
            const d = new Date(startDate); d.setDate(d.getDate() + i)
            return d.toDateString() === new Date().toDateString()
          })
        : -1

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
        <div
            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            style={{ isolation: 'isolate', position: 'relative' }}
        >
            {/* サイドバーへドラッグ中インジケーター */}
            {isDraggingToSidebar && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 300, pointerEvents: 'none',
                    border: '2px dashed #2563eb', borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    paddingRight: 16,
                }}>
                    <span style={{ background: '#2563eb', color: 'white', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>→ 保管</span>
                </div>
            )}
            {/* カレンダー本体（内部スクロールコンテナ・固定高）
                overscrollBehavior: contain → スクロールがカレンダー外に伝播しない（内部スクロール分離） */}
            <div
                ref={containerRef}
                className="overflow-auto select-none"
                style={{
                    height: 'clamp(320px, calc(100vh - 540px), 440px)',
                    overscrollBehavior: 'contain',
                }}
            >
                <div style={{ minWidth: minW }}>

                    {/* 列ヘッダー（sticky） */}
                    <div
                        className="sticky top-0 z-30 bg-white border-b-2 border-gray-200"
                        style={{ display: 'flex', minWidth: minW }}
                    >
                        <div style={{ width: TIME_COL, flexShrink: 0, borderRight: '1px solid #e2e8f0' }} />
                        {days.map((_, i) => {
                            const h = colHeader(i)
                            return (
                                <div key={i} style={{
                                    width: colW, flexShrink: 0,
                                    borderRight: i < days.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    backgroundColor: h.isToday ? '#eff6ff' : 'transparent',
                                    padding: '8px 4px', textAlign: 'center',
                                }}>
                                    {startDate ? (
                                        <>
                                            <p style={{ fontSize: 11, color: WEEKDAY_COLORS[h.weekday] ?? '#374151', fontWeight: 600, margin: 0 }}>{h.bottom}</p>
                                            <p style={{ fontSize: 18, fontWeight: 700, color: h.isToday ? '#2563eb' : '#111827', lineHeight: 1.2, margin: '2px 0' }}>{h.top}</p>
                                            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{'sub' in h ? h.sub : ''}</p>
                                        </>
                                    ) : (
                                        <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: 0, lineHeight: '40px' }}>{h.top}</p>
                                    )}
                                    {h.isToday && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2563eb', margin: '0 auto' }} />}
                                </div>
                            )
                        })}
                    </div>

                    {/* グリッド本体（6〜24 時の全域） */}
                    <div
                        ref={gridBodyRef}
                        style={{ position: 'relative', height: GRID_H }}
                        onDragOver={e => {
                            e.preventDefault()
                            const pos = calcDropPos(e)
                            if (pos) setDragOver({ dayIdx: pos.dayIdx, start: toMins(pos.time) })
                        }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={e => {
                            e.preventDefault()
                            setDragOver(null)
                            const pos = calcDropPos(e)
                            if (!pos) return
                            try {
                                const data = JSON.parse(e.dataTransfer.getData('application/json'))
                                if (data.source === 'suggested') {
                                    onDropSuggestedSpot?.(pos.dayIdx, pos.time, data.spot as SidebarSpot)
                                } else if (data.source === 'free') {
                                    onDropFreeBlock?.(pos.dayIdx, pos.time, data.type as SpotType)
                                }
                            } catch { /* 無視 */ }
                        }}
                    >

                        {HOURS.map(h => {
                            const top = (h - GRID_START) * 60 * ppm
                            return (
                                <div key={h}>
                                    <div style={{ position: 'absolute', top: top - 9, left: 4, width: TIME_COL - 8, textAlign: 'right' }}>
                                        <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                                            {String(h).padStart(2, '0')}:00
                                        </span>
                                    </div>
                                    <div style={{ position: 'absolute', top, left: 0, right: 0, height: 1, backgroundColor: '#e2e8f0' }} />
                                    <div style={{ position: 'absolute', top: top + 30 * ppm, left: TIME_COL, right: 0, height: 1, backgroundColor: '#f1f5f9' }} />
                                </div>
                            )
                        })}

                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL, width: 1, backgroundColor: '#e2e8f0' }} />
                        {days.slice(0, -1).map((_, i) => (
                            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL + (i + 1) * colW, width: 1, backgroundColor: '#f1f5f9' }} />
                        ))}

                        {todayIdx >= 0 && (
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL + todayIdx * colW, width: colW, backgroundColor: 'rgba(37,99,235,0.02)', pointerEvents: 'none' }} />
                        )}

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

                        {/* ドロップ位置インジケーター */}
                        {dragOver && (
                            <div style={{
                                position: 'absolute',
                                top: (dragOver.start - GRID_START * 60) * ppm - 1,
                                left: TIME_COL + dragOver.dayIdx * colW + 2,
                                width: colW - 4,
                                height: 3,
                                backgroundColor: '#2563eb',
                                borderRadius: 2,
                                opacity: 0.7,
                                pointerEvents: 'none',
                                zIndex: 50,
                            }} />
                        )}

                        {/* イベントブロック */}
                        {days.map((day, dayIdx) =>
                            day.spots.map((spot, spotIdx) => {
                                const isDragging = drag?.srcDay === dayIdx && drag?.srcSpot === spotIdx
                                const vDay   = (isDragging && temp) ? temp.dayIdx : dayIdx
                                const vStart = (isDragging && temp) ? temp.start  : toMins(spot.time)
                                const vDur   = (isDragging && temp) ? temp.dur    : getDur(spot)

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
                                            borderRadius: 6, overflow: 'hidden',
                                            backgroundColor: st.bg,
                                            border: `1px solid ${st.border}`,
                                            boxShadow: isDragging
                                                ? `0 8px 28px rgba(0,0,0,0.22), 0 0 0 2px ${st.accent}`
                                                : '0 1px 4px rgba(0,0,0,0.07)',
                                            transition: isDragging ? 'none' : 'box-shadow 0.15s',
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: ACCENT, height: '100%', backgroundColor: st.accent }} />

                                        <div
                                            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HANDLE, cursor: 'n-resize', zIndex: 3 }}
                                            className="hover:bg-black/10"
                                            onMouseDown={e => startDrag(e, 'resize-top', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
                                        />
                                        {/* 削除ボタン */}
                                        <button
                                            type="button"
                                            onMouseDown={e => e.stopPropagation()}
                                            onClick={e => {
                                                e.stopPropagation()
                                                const newSpots = day.spots.filter((_, si) => si !== spotIdx)
                                                onUpdateDays(days.map((d, di) => di === dayIdx ? { ...d, spots: newSpots } : d))
                                            }}
                                            style={{
                                                position: 'absolute', top: 2, right: 2,
                                                width: 14, height: 14, zIndex: 5,
                                                border: 'none', borderRadius: 3,
                                                background: 'rgba(0,0,0,0.18)',
                                                color: 'white', fontSize: 10,
                                                cursor: 'pointer', lineHeight: 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                padding: 0,
                                            }}
                                        >×</button>

                                        <div
                                            style={{ position: 'absolute', top: HANDLE, bottom: HANDLE, left: ACCENT + 6, right: 4, cursor: 'grab', overflow: 'hidden' }}
                                            onMouseDown={e => startDrag(e, 'move', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
                                            onDoubleClick={e => {
                                                e.stopPropagation()
                                                setDrag(null); setTemp(null)
                                                onDoubleClickSpot?.(spot, dayIdx, spotIdx)
                                            }}
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

                                        {/* 予約状態ドット */}
                                        {spot.needs_booking && (
                                            <div style={{
                                                position: 'absolute', bottom: HANDLE + 3, right: 4,
                                                width: 7, height: 7, borderRadius: '50%', zIndex: 4,
                                                backgroundColor: spot.booking_confirmed ? '#10b981' : '#f59e0b',
                                            }} />
                                        )}

                                        <div
                                            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: HANDLE, cursor: 's-resize', zIndex: 3 }}
                                            className="hover:bg-black/10"
                                            onMouseDown={e => startDrag(e, 'resize-bottom', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
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
