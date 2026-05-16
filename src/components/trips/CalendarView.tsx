'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { HotelInfo, ItineraryDay, Spot, SidebarSpot, SpotType } from '@/types'
import { useIsMobile } from '@/hooks/useIsMobile'

// ────────── 定数 ──────────
const GRID_START = 6
const GRID_END   = 24
const SNAP       = 10
const MIN_DUR    = 20
const TIME_COL   = 56
const ACCENT     = 4
const HANDLE     = 8
const BASE_PPM        = 1.0   // pixels per minute at zoom=1.0
const DRAG_THRESHOLD  = 5     // px: この距離以上動いて初めてドラッグと判定

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

function applyMoveSameDay(spots: Spot[], dragIdx: number, newSpot: Spot): Spot[] {
    const others = spots.filter((_, i) => i !== dragIdx)
    return resolveNoOverlap([...others, newSpot])
}

function removeFromDay(spots: Spot[], dragIdx: number): Spot[] {
    return spots
        .filter((_, i) => i !== dragIdx)
        .sort((a, b) => toMins(a.time) - toMins(b.time))
}

function insertWithCompress(spots: Spot[], newSpot: Spot): Spot[] {
    const ns = toMins(newSpot.time)
    const nd = getDur(newSpot)
    const ne = ns + nd

    const compressed = spots.map(s => {
        const st  = toMins(s.time)
        const dur = getDur(s)
        const se  = st + dur

        if (se <= ns || st >= ne) return s

        if (st < ns) {
            return { ...s, duration_minutes: Math.max(MIN_DUR, ns - st) }
        } else {
            const overlap = ne - st
            return { ...s, time: toTime(ne), duration_minutes: Math.max(MIN_DUR, dur - overlap) }
        }
    })

    return resolveNoOverlap([...compressed, newSpot])
}

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
        let boundary = newEnd
        for (let i = idx + 1; i < sorted.length; i++) {
            const start = toMins(sorted[i].time)
            if (start < boundary) {
                sorted[i] = { ...sorted[i], time: toTime(boundary) }
                boundary += getDur(sorted[i])
            } else break
        }
    }

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
    initStart: number; initDur: number; mouseY0: number; mouseX0: number
}
interface Temp { dayIdx: number; start: number; dur: number }

interface Props {
    days: ItineraryDay[]
    startDate?: Date
    zoom: number
    onUpdateDays: (updated: ItineraryDay[]) => void
    onDropSuggestedSpot?: (dayIdx: number, time: string, spot: SidebarSpot, spotIdx: number) => void
    onDropFreeBlock?: (dayIdx: number, time: string, type: SpotType) => void
    onMoveToSidebar?: (spot: Spot, dayIdx: number, spotIdx: number, mouseX: number, mouseY: number) => void
    onDraggingToSidebarChange?: (v: boolean) => void
    onSidebarDragMove?: (mouseY: number) => void
    onDoubleClickSpot?: (spot: Spot, dayIdx: number, spotIdx: number) => void
    sidebarRef?: React.RefObject<HTMLDivElement | null>
    onDragStart?: (spot: Spot) => void
    onDragEnd?: () => void
    onGapClick?: (dayIdx: number, time: string, duration: number) => void
    onDoubleClickHotel?: (hotel: HotelInfo | undefined, dayIdx: number) => void
    editable?: boolean
}

// ────────── コンポーネント ──────────
export default function CalendarView({ days, startDate, zoom, onUpdateDays, onDropSuggestedSpot, onDropFreeBlock, onMoveToSidebar, onDraggingToSidebarChange, onSidebarDragMove, onDoubleClickSpot, sidebarRef, onDragStart, onDragEnd, onGapClick, onDoubleClickHotel, editable = true }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const gridBodyRef  = useRef<HTMLDivElement>(null)
    const isMobile     = useIsMobile()

    // コールバック ref（useCallback の deps に含めずに最新値を参照するため）
    const onMoveToSidebarRef            = useRef(onMoveToSidebar)
    const onDraggingToSidebarChangeRef  = useRef(onDraggingToSidebarChange)
    const onSidebarDragMoveRef          = useRef(onSidebarDragMove)
    onMoveToSidebarRef.current           = onMoveToSidebar
    onDraggingToSidebarChangeRef.current = onDraggingToSidebarChange
    onSidebarDragMoveRef.current         = onSidebarDragMove
    const sidebarRefRef = useRef(sidebarRef)
    sidebarRefRef.current = sidebarRef
    const onDragStartRef = useRef(onDragStart)
    onDragStartRef.current = onDragStart
    const onDragEndRef = useRef(onDragEnd)
    onDragEndRef.current = onDragEnd

    const [colW, setColW] = useState(160)
    const [mobileDayIdx, setMobileDayIdx] = useState(0)
    const [editingLabelIdx, setEditingLabelIdx] = useState<number | null>(null)
    const [labelDraft, setLabelDraft] = useState('')
    const lastTapRef = useRef<{ time: number; key: string }>({ time: 0, key: '' })
    const ppm        = BASE_PPM * zoom

    function commitLabel(dayIdx: number) {
        const trimmed = labelDraft.trim() || days[dayIdx]?.label || `${dayIdx + 1}日目`
        setEditingLabelIdx(null)
        if (onUpdateDays) {
            const next = days.map((d, i) => i === dayIdx ? { ...d, label: trimmed } : d)
            onUpdateDays(next)
        }
    }

    const [drag, setDrag]                   = useState<Drag | null>(null)
    const [temp, setTemp]                   = useState<Temp | null>(null)
    const tempRef                           = useRef<Temp | null>(null)
    tempRef.current                         = temp
    const [dragOver, setDragOver]           = useState<{ dayIdx: number; start: number } | null>(null)
    const [isDraggingToSidebar, setIsDraggingToSidebar] = useState(false)
    const isDraggingToSidebarRef            = useRef(false)
    const [ghostPos, setGhostPos]           = useState<{ x: number; y: number } | null>(null)
    const dragOffsetRef                     = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const dragMovedRef                      = useRef(false)
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

    // 列幅計算（モバイルは1列全幅、デスクトップは days.length 分割）
    // 横スクロールは想定しないため、可視領域に収まる幅のみ採用
    useEffect(() => {
        const doCalc = () => {
            if (!containerRef.current) return
            const available = containerRef.current.clientWidth - TIME_COL
            setColW(isMobile ? available : Math.max(40, available / days.length))
        }
        const id = requestAnimationFrame(doCalc)
        window.addEventListener('resize', doCalc)
        // ResizeObserver で親幅変化にも追従
        const ro = new ResizeObserver(doCalc)
        if (containerRef.current) ro.observe(containerRef.current)
        return () => {
            cancelAnimationFrame(id)
            window.removeEventListener('resize', doCalc)
            ro.disconnect()
        }
    }, [days.length, isMobile])

    // モバイルでは常に mobileDayIdx、デスクトップは X 座標から日付を計算
    const xToDayIdx = useCallback((clientX: number) => {
        if (isMobile) return mobileDayIdx
        if (!containerRef.current) return 0
        const rect = containerRef.current.getBoundingClientRect()
        const relX = clientX - rect.left + containerRef.current.scrollLeft - TIME_COL
        return Math.max(0, Math.min(days.length - 1, Math.floor(relX / colW)))
    }, [days.length, colW, isMobile, mobileDayIdx])

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!drag) return
        if (!dragMovedRef.current) {
            if (Math.abs(e.clientX - drag.mouseX0) < DRAG_THRESHOLD && Math.abs(e.clientY - drag.mouseY0) < DRAG_THRESHOLD) return
            dragMovedRef.current = true
        }
        const dMins = (e.clientY - drag.mouseY0) / ppm
        if (drag.mode === 'move') {
            let toSidebar = false
            const sidebarEl = sidebarRefRef.current?.current
            if (sidebarEl) {
                const sr = sidebarEl.getBoundingClientRect()
                toSidebar = e.clientX >= sr.left && e.clientX <= sr.right
                         && e.clientY >= sr.top  && e.clientY <= sr.bottom
            }
            if (toSidebar !== isDraggingToSidebarRef.current) {
                isDraggingToSidebarRef.current = toSidebar
                setIsDraggingToSidebar(toSidebar)
                onDraggingToSidebarChangeRef.current?.(toSidebar)
            }
            if (toSidebar) {
                onSidebarDragMoveRef.current?.(e.clientY)
            }
            setGhostPos({ x: e.clientX, y: e.clientY })
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

    const onMouseUp = useCallback((e: MouseEvent) => {
        const t = tempRef.current
        if (!drag || !t) { setDrag(null); setTemp(null); setGhostPos(null); return }
        if (!dragMovedRef.current) { setDrag(null); setTemp(null); setGhostPos(null); return }

        let releaseInSidebar = isDraggingToSidebarRef.current
        if (!releaseInSidebar && drag.mode === 'move') {
            const sidebarEl = sidebarRefRef.current?.current
            if (sidebarEl) {
                const sr = sidebarEl.getBoundingClientRect()
                releaseInSidebar = e.clientX >= sr.left && e.clientX <= sr.right
                                && e.clientY >= sr.top  && e.clientY <= sr.bottom
            }
        }

        if (releaseInSidebar && drag.mode === 'move') {
            const srcSpot = days[drag.srcDay]?.spots[drag.srcSpot]
            if (srcSpot) {
                onMoveToSidebarRef.current?.(srcSpot, drag.srcDay, drag.srcSpot, e.clientX, e.clientY)
            }
            isDraggingToSidebarRef.current = false
            setIsDraggingToSidebar(false)
            onDraggingToSidebarChangeRef.current?.(false)
            onDragEndRef.current?.()
            setDrag(null); setTemp(null); setGhostPos(null)
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
        onDragEndRef.current?.()
        setDrag(null); setTemp(null); setGhostPos(null)
    }, [drag, days, onUpdateDays])

    // マウス＋タッチイベントの両方を登録
    useEffect(() => {
        if (!drag) return

        function touchMoveHandler(e: TouchEvent) {
            if (!e.touches.length) return
            e.preventDefault() // スクロールを止めてドラッグを優先
            onMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY } as MouseEvent)
        }
        function touchEndHandler(e: TouchEvent) {
            if (!e.changedTouches.length) return
            onMouseUp({ clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY } as MouseEvent)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('touchmove', touchMoveHandler, { passive: false })
        window.addEventListener('touchend', touchEndHandler)
        document.body.style.userSelect = 'none'
        document.body.style.cursor = drag.mode === 'move' ? 'grabbing' : 'ns-resize'
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
            window.removeEventListener('touchmove', touchMoveHandler)
            window.removeEventListener('touchend', touchEndHandler)
            document.body.style.userSelect = ''
            document.body.style.cursor = ''
            resetSidebarDrag()
            setGhostPos(null)
        }
    }, [drag, onMouseMove, onMouseUp]) // eslint-disable-line react-hooks/exhaustive-deps

    // マウスドラッグ開始
    function startDrag(e: React.MouseEvent, mode: Drag['mode'], srcDay: number, srcSpot: number, initStart: number, initDur: number) {
        if (e.detail > 1) return
        e.preventDefault(); e.stopPropagation()
        dragMovedRef.current = false
        setDrag({ mode, srcDay, srcSpot, initStart, initDur, mouseY0: e.clientY, mouseX0: e.clientX })
        setTemp({ dayIdx: srcDay, start: initStart, dur: initDur })
        if (mode === 'move') {
            if (containerRef.current && gridBodyRef.current) {
                const cr = containerRef.current.getBoundingClientRect()
                const gridBodyTop = gridBodyRef.current.offsetTop
                const blockScreenTop = cr.top + gridBodyTop + (initStart - GRID_START * 60) * ppm - containerRef.current.scrollTop
                const blockScreenLeft = cr.left + TIME_COL + (isMobile ? 0 : srcDay * colW) + 2
                dragOffsetRef.current = {
                    x: e.clientX - blockScreenLeft,
                    y: e.clientY - blockScreenTop,
                }
            } else {
                dragOffsetRef.current = { x: 20, y: 20 }
            }
            setGhostPos({ x: e.clientX, y: e.clientY })
            const spot = days[srcDay]?.spots[srcSpot]
            if (spot) onDragStartRef.current?.(spot)
        }
    }

    // タッチドラッグ開始（モバイル用）
    function startDragFromTouch(e: React.TouchEvent, mode: Drag['mode'], srcDay: number, srcSpot: number, initStart: number, initDur: number) {
        if (e.touches.length === 0) return
        const t = e.touches[0]
        dragMovedRef.current = false
        setDrag({ mode, srcDay, srcSpot, initStart, initDur, mouseY0: t.clientY, mouseX0: t.clientX })
        setTemp({ dayIdx: srcDay, start: initStart, dur: initDur })
        if (mode === 'move') {
            if (containerRef.current && gridBodyRef.current) {
                const cr = containerRef.current.getBoundingClientRect()
                const gridBodyTop = gridBodyRef.current.offsetTop
                const blockScreenTop = cr.top + gridBodyTop + (initStart - GRID_START * 60) * ppm - containerRef.current.scrollTop
                const blockScreenLeft = cr.left + TIME_COL + (isMobile ? 0 : srcDay * colW) + 2
                dragOffsetRef.current = {
                    x: t.clientX - blockScreenLeft,
                    y: t.clientY - blockScreenTop,
                }
            } else {
                dragOffsetRef.current = { x: 20, y: 20 }
            }
            setGhostPos({ x: t.clientX, y: t.clientY })
            const spot = days[srcDay]?.spots[srcSpot]
            if (spot) onDragStartRef.current?.(spot)
        }
    }

    // ダブルタップ検出（モバイル用）
    function handleTouchStartBlock(e: React.TouchEvent, mode: Drag['mode'], dayIdx: number, spotIdx: number, initStart: number, initDur: number) {
        if (e.touches.length === 0) return
        const key = `${dayIdx}-${spotIdx}`
        const now = Date.now()
        if (now - lastTapRef.current.time < 300 && lastTapRef.current.key === key) {
            lastTapRef.current = { time: 0, key: '' }
            setDrag(null); setTemp(null); setGhostPos(null)
            const spot = days[dayIdx]?.spots[spotIdx]
            if (spot) onDoubleClickSpot?.(spot, dayIdx, spotIdx)
            return
        }
        lastTapRef.current = { time: now, key }
        startDragFromTouch(e, mode, dayIdx, spotIdx, initStart, initDur)
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

    const numCols = isMobile ? 1 : days.length
    const nowTop  = (nowMins - GRID_START * 60) * ppm
    const showNow = nowMins >= GRID_START * 60 && nowMins <= GRID_END * 60
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
            style={{
                borderRadius: 16,
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                overflow: 'hidden',
                isolation: 'isolate',
                position: 'relative',
            }}
        >
            {/* ドラッグゴースト */}
            {drag?.mode === 'move' && ghostPos && (() => {
                const srcSpot = days[drag.srcDay]?.spots[drag.srcSpot]
                if (!srcSpot) return null
                const st = STYLES[srcSpot.type] ?? STYLES['その他']
                const ghostW = colW - 4
                const ghostH = Math.max(MIN_DUR * ppm, drag.initDur * ppm)
                return (
                    <div style={{
                        position: 'fixed',
                        top: ghostPos.y - dragOffsetRef.current.y,
                        left: ghostPos.x - dragOffsetRef.current.x,
                        width: ghostW,
                        height: ghostH,
                        zIndex: 9999,
                        pointerEvents: 'none',
                        borderRadius: 6,
                        overflow: 'hidden',
                        backgroundColor: st.bg,
                        border: `1px solid ${st.border}`,
                        boxShadow: `0 12px 32px rgba(0,0,0,0.28), 0 0 0 2px ${st.accent}`,
                        transform: 'scale(0.93)',
                        transformOrigin: 'top left',
                        opacity: 0.95,
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: ACCENT, height: '100%', backgroundColor: st.accent }} />
                        <div style={{ position: 'absolute', top: HANDLE, bottom: HANDLE, left: ACCENT + 6, right: 4, overflow: 'hidden' }}>
                            <p style={{ fontSize: 12, fontWeight: st.light ? 400 : 600, color: st.text, lineHeight: 1.35, margin: 0,
                                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: ghostH < 52 ? 1 : 2, WebkitBoxOrient: 'vertical' as const,
                            }}>
                                {srcSpot.name}
                            </p>
                        </div>
                    </div>
                )
            })()}

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

            {/* モバイル: 日付ナビゲーション */}
            {isMobile && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderBottom: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                }}>
                    <button
                        type="button"
                        onClick={() => setMobileDayIdx(d => Math.max(0, d - 1))}
                        disabled={mobileDayIdx === 0}
                        style={{
                            padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: 8,
                            background: 'white', cursor: mobileDayIdx === 0 ? 'not-allowed' : 'pointer',
                            opacity: mobileDayIdx === 0 ? 0.35 : 1, fontSize: 14, fontWeight: 500,
                        }}
                    >‹ 前日</button>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                        {(() => {
                            const h = colHeader(mobileDayIdx)
                            return startDate ? `${h.top} (${h.bottom})` : h.top
                        })()}
                    </span>
                    <button
                        type="button"
                        onClick={() => setMobileDayIdx(d => Math.min(days.length - 1, d + 1))}
                        disabled={mobileDayIdx === days.length - 1}
                        style={{
                            padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: 8,
                            background: 'white', cursor: mobileDayIdx === days.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: mobileDayIdx === days.length - 1 ? 0.35 : 1, fontSize: 14, fontWeight: 500,
                        }}
                    >翌日 ›</button>
                </div>
            )}

            {/* カレンダー本体（内部スクロールコンテナ・縦スクロール専用）*/}
            <div
                ref={containerRef}
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    userSelect: 'none',
                    height: 'min(720px, calc(100vh - 220px))',
                    minHeight: 480,
                    overscrollBehavior: 'contain',
                    width: '100%',
                }}
            >
                <div style={{ width: '100%' }}>

                    {/* 列ヘッダー + 宿泊帯（両方を一括 sticky で固定） */}
                    <div
                        style={{
                            position: 'sticky', top: 0, zIndex: 30,
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                        }}
                    >
                    <div
                        style={{ display: 'flex', width: '100%', borderBottom: '2px solid #e5e7eb' }}
                    >
                        <div style={{ width: TIME_COL, flexShrink: 0, borderRight: '1px solid #e2e8f0' }} />
                        {days.map((_, i) => {
                            if (isMobile && i !== mobileDayIdx) return null
                            const h = colHeader(i)
                            const labelText = days[i]?.label ?? `${i + 1}日目`
                            const isEditing = editingLabelIdx === i
                            const canEdit   = editable
                            return (
                                <div key={i} style={{
                                    width: colW, flexShrink: 0, minWidth: 0,
                                    borderRight: !isMobile && i < days.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    backgroundColor: h.isToday ? '#eff6ff' : 'transparent',
                                    padding: '8px 6px 10px', textAlign: 'center',
                                }}>
                                    {startDate ? (
                                        <>
                                            <p style={{ fontSize: 11, color: WEEKDAY_COLORS[h.weekday] ?? '#374151', fontWeight: 600, margin: 0 }}>{h.bottom}</p>
                                            <p style={{ fontSize: 18, fontWeight: 700, color: h.isToday ? '#2563eb' : '#111827', lineHeight: 1.2, margin: '2px 0' }}>{h.top}</p>
                                        </>
                                    ) : (
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', margin: 0, lineHeight: 1.2 }}>{`${i + 1}日目`}</p>
                                    )}
                                    {h.isToday && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2563eb', margin: '0 auto 4px' }} />}

                                    {/* 日まとめ（label）— ダブルクリックで編集 */}
                                    {isEditing ? (
                                        <input
                                            autoFocus
                                            value={labelDraft}
                                            onChange={e => setLabelDraft(e.target.value)}
                                            onBlur={() => commitLabel(i)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') { e.preventDefault(); commitLabel(i) }
                                                if (e.key === 'Escape') { setEditingLabelIdx(null) }
                                            }}
                                            placeholder="この日のテーマ"
                                            style={{
                                                marginTop: 4,
                                                width: '100%', boxSizing: 'border-box',
                                                fontSize: 12, fontWeight: 600,
                                                color: '#1d4ed8',
                                                background: 'white',
                                                border: '1.5px solid #93c5fd',
                                                borderRadius: 6,
                                                padding: '3px 6px',
                                                outline: 'none',
                                                textAlign: 'center',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                    ) : (
                                        <p
                                            onDoubleClick={() => {
                                                if (!canEdit) return
                                                setLabelDraft(labelText)
                                                setEditingLabelIdx(i)
                                            }}
                                            title={canEdit ? 'ダブルクリックで編集' : undefined}
                                            style={{
                                                marginTop: 4,
                                                fontSize: 12, fontWeight: 600,
                                                color: h.isToday ? '#1d4ed8' : '#475569',
                                                background: h.isToday ? '#dbeafe' : '#f1f5f9',
                                                borderRadius: 6,
                                                padding: '3px 6px',
                                                lineHeight: 1.3,
                                                margin: '4px 0 0',
                                                cursor: canEdit ? 'text' : 'default',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {labelText}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* 宿泊帯（列ヘッダー直下）*/}
                    <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                        <div style={{
                            width: TIME_COL, flexShrink: 0, borderRight: '1px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 9, color: '#c4b5fd', fontWeight: 600, letterSpacing: '0.05em', writingMode: 'horizontal-tb' }}>宿泊</span>
                        </div>
                        {days.map((day, i) => {
                            if (isMobile && i !== mobileDayIdx) return null
                            const hotel = day.hotel
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: colW, flexShrink: 0,
                                        borderRight: !isMobile && i < days.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        padding: '5px 6px',
                                        backgroundColor: hotel ? '#faf5ff' : 'white',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => onDoubleClickHotel?.(hotel, i)}
                                >
                                    {hotel ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 30 }}>
                                            <span style={{ fontSize: 14, flexShrink: 0 }}>🏨</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 11, fontWeight: 600, color: '#6d28d9', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                    {hotel.name}
                                                </p>
                                                {(hotel.check_in || hotel.check_out) && (
                                                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                                                        {hotel.check_in && `IN ${hotel.check_in}`}
                                                        {hotel.check_in && hotel.check_out && ' · '}
                                                        {hotel.check_out && `OUT ${hotel.check_out}`}
                                                    </p>
                                                )}
                                            </div>
                                            {hotel.booking_confirmed && (
                                                <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, flexShrink: 0 }}>✓予約済</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{
                                            minHeight: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '1.5px dashed #e9d5ff', borderRadius: 6,
                                        }}>
                                            <span style={{ fontSize: 10, color: '#c4b5fd' }}>＋ 宿泊地を追加</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    </div>{/* ← 列ヘッダー＋宿泊帯 sticky ラッパー終了 */}

                    {/* グリッド本体 */}
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
                                    onDropSuggestedSpot?.(pos.dayIdx, pos.time, data.spot as SidebarSpot, (data.idx as number) ?? 0)
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
                        {!isMobile && days.slice(0, -1).map((_, i) => (
                            <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL + (i + 1) * colW, width: 1, backgroundColor: '#f1f5f9' }} />
                        ))}

                        {/* 今日のハイライト */}
                        {todayIdx >= 0 && (!isMobile || todayIdx === mobileDayIdx) && (
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: TIME_COL, width: colW, backgroundColor: 'rgba(37,99,235,0.02)', pointerEvents: 'none' }} />
                        )}

                        {showNow && (!isMobile || todayIdx === mobileDayIdx) && (
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
                                left: TIME_COL + (isMobile ? 0 : dragOver.dayIdx * colW) + 2,
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
                        {days.map((day, dayIdx) => {
                            if (isMobile && dayIdx !== mobileDayIdx) return null
                            return day.spots.map((spot, spotIdx) => {
                                const isDragging = drag?.srcDay === dayIdx && drag?.srcSpot === spotIdx
                                const isMoveDrag = isDragging && drag?.mode === 'move'
                                const goingToSidebar = isDragging && isDraggingToSidebar
                                const vDay   = (isDragging && temp) ? temp.dayIdx : dayIdx
                                const vStart = (isDragging && temp) ? temp.start  : toMins(spot.time)
                                const vDur   = (isDragging && temp) ? temp.dur    : getDur(spot)

                                const top    = (vStart - GRID_START * 60) * ppm
                                const height = Math.max(MIN_DUR * ppm, vDur * ppm)
                                const left   = TIME_COL + (isMobile ? 0 : vDay * colW) + 2
                                const width  = colW - 4
                                const st     = STYLES[spot.type] ?? STYLES['その他']

                                return (
                                    <div
                                        key={`${dayIdx}-${spotIdx}`}
                                        style={{
                                            position: 'absolute', top, left, width, height,
                                            zIndex: isDragging ? 200 : st.light ? 5 : 10,
                                            opacity: goingToSidebar ? 0 : isMoveDrag ? 0.25 : (st.light ? 0.72 : 1),
                                            pointerEvents: (goingToSidebar || isMoveDrag) ? 'none' : 'auto',
                                            borderRadius: 6, overflow: 'hidden',
                                            backgroundColor: st.bg,
                                            border: isMoveDrag ? `1px dashed ${st.border}` : `1px solid ${st.border}`,
                                            boxShadow: isDragging && !isMoveDrag
                                                ? `0 8px 28px rgba(0,0,0,0.22), 0 0 0 2px ${st.accent}`
                                                : 'none',
                                            transition: isDragging ? 'none' : 'box-shadow 0.15s',
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: ACCENT, height: '100%', backgroundColor: st.accent }} />

                                        {/* リサイズハンドル（上）*/}
                                        <div
                                            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HANDLE, cursor: 'n-resize', zIndex: 3 }}
                                            className="hover:bg-black/10"
                                            onMouseDown={e => startDrag(e, 'resize-top', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
                                            onTouchStart={e => startDragFromTouch(e, 'resize-top', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
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

                                        {/* ドラッグ本体（ダブルクリック/ダブルタップで詳細）*/}
                                        <div
                                            style={{ position: 'absolute', top: HANDLE, bottom: HANDLE, left: ACCENT + 6, right: 4, cursor: 'grab', overflow: 'hidden' }}
                                            onMouseDown={e => startDrag(e, 'move', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
                                            onTouchStart={e => handleTouchStartBlock(e, 'move', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
                                            onDoubleClick={e => {
                                                e.stopPropagation()
                                                setDrag(null); setTemp(null); setGhostPos(null)
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
                                                {spot.name || (spot.type === '移動' ? '移動' : '')}
                                            </p>
                                            {/* 移動ブロックは height>28 で常に発着時刻、他は height>46 */}
                                            {(spot.type === '移動' ? height > 28 : height > 46) && (
                                                <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>
                                                    {toTime(vStart)} → {toTime(Math.min(vStart + vDur, GRID_END * 60))}
                                                </p>
                                            )}
                                            {/* 移動ブロック: ルートメモをブロック内に表示 */}
                                            {spot.type === '移動' && height > 52 && spot.memo && (
                                                <p style={{
                                                    fontSize: 9, color: '#b0b9c4', marginTop: 2,
                                                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                                }}>
                                                    {spot.memo}
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

                                        {/* リサイズハンドル（下）*/}
                                        <div
                                            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: HANDLE, cursor: 's-resize', zIndex: 3 }}
                                            className="hover:bg-black/10"
                                            onMouseDown={e => startDrag(e, 'resize-bottom', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
                                            onTouchStart={e => startDragFromTouch(e, 'resize-bottom', dayIdx, spotIdx, toMins(spot.time), getDur(spot))}
                                        />
                                    </div>
                                )
                            })
                        })}

                        {/* ギャップ注釈（ドラッグ中は非表示）*/}
                        {!drag && days.map((day, dayIdx) => {
                            if (isMobile && dayIdx !== mobileDayIdx) return null
                            const sorted = [...day.spots].sort((a, b) => {
                                const [ah, am] = a.time.split(':').map(Number)
                                const [bh, bm] = b.time.split(':').map(Number)
                                return (ah * 60 + (am || 0)) - (bh * 60 + (bm || 0))
                            })
                            return sorted.slice(0, -1).map((spot, i) => {
                                const next = sorted[i + 1]
                                const gapStart = toMins(spot.time) + getDur(spot)
                                const gapEnd   = toMins(next.time)
                                const gapMins  = gapEnd - gapStart
                                if (gapMins < 5) return null

                                const top    = (gapStart - GRID_START * 60) * ppm
                                const height = gapMins * ppm
                                const left   = TIME_COL + (isMobile ? 0 : dayIdx * colW) + 2
                                const width  = colW - 4
                                const isWarning = gapMins < 15
                                const lineColor = isWarning ? '#fde68a' : '#eaecee'
                                const textColor = isWarning ? '#d97706' : '#adb5bd'

                                return (
                                    <div
                                        key={`gap-${dayIdx}-${i}`}
                                        style={{
                                            position: 'absolute', top, left, width, height,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            pointerEvents: 'none', zIndex: 3,
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', top: '50%', left: 4, right: 4,
                                            height: 0, borderTop: `1px dashed ${lineColor}`,
                                            transform: 'translateY(-50%)',
                                        }} />
                                        {/* ラベル部分だけ pointerEvents: auto でクリック可能にする */}
                                        {height >= 16 && (
                                            <button
                                                type="button"
                                                onClick={() => onGapClick?.(dayIdx, toTime(gapStart), gapMins)}
                                                title={onGapClick ? '移動ブロックを挿入' : undefined}
                                                style={{
                                                    fontSize: 9, color: textColor,
                                                    backgroundColor: 'rgba(255,255,255,0.92)',
                                                    padding: '2px 5px', borderRadius: 3,
                                                    fontVariantNumeric: 'tabular-nums',
                                                    fontWeight: isWarning ? 600 : 400,
                                                    position: 'relative', zIndex: 4,
                                                    border: `1px dashed ${lineColor}`,
                                                    cursor: onGapClick ? 'pointer' : 'default',
                                                    pointerEvents: 'auto',
                                                    lineHeight: 1.4,
                                                    transition: 'background-color 0.1s',
                                                }}
                                            >
                                                {onGapClick ? `＋ ${gapMins}分` : `${gapMins}分`}
                                            </button>
                                        )}
                                    </div>
                                )
                            })
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
