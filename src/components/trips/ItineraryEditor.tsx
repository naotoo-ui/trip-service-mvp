'use client'
import { useState, useCallback, useRef } from 'react'
import type { Trip, ItineraryDay, Spot, SidebarSpot, SpotType, HotelInfo } from '@/types'
import CalendarView from './CalendarView'
import SuggestedSpotsPanel from './SuggestedSpotsPanel'
import FreeBlocksPanel from './FreeBlocksPanel'
import SpotDetailModal from './SpotDetailModal'
import HotelDetailModal from './HotelDetailModal'
import ShareButton from './ShareButton'
import CopyButton from './CopyButton'
import { useIsMobile } from '@/hooks/useIsMobile'

function toMins(time: string) { const [h, m] = time.split(':').map(Number); return h * 60 + (m || 0) }
function toTime(mins: number) { return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}` }

function buildMapsUrl(day: ItineraryDay, destination: string): string {
    const spots = day.spots.filter(s => s.type !== '移動')
    if (spots.length === 0) return ''
    // address があればスポット名＋住所、なければスポット名＋目的地で検索精度を確保
    const q = (s: Spot) => encodeURIComponent(
        s.address ? `${s.name} ${s.address}` : `${s.name} ${destination}`
    )
    if (spots.length === 1) {
        return `https://www.google.com/maps/search/?api=1&query=${q(spots[0])}`
    }
    const origin    = q(spots[0])
    const dest      = q(spots[spots.length - 1])
    // 中間地点は | で区切る（| 自体はエンコードしない）
    const waypoints = spots.slice(1, -1).map(q).join('|')
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypoints ? `&waypoints=${waypoints}` : ''}`
}

function insertSpot(daySpots: Spot[], newSpot: Spot): Spot[] {
    const all = [...daySpots, newSpot].sort((a, b) => toMins(a.time) - toMins(b.time))
    for (let i = 1; i < all.length; i++) {
        const prevEnd = toMins(all[i - 1].time) + (all[i - 1].duration_minutes || 60)
        if (toMins(all[i].time) < prevEnd) {
            all[i] = { ...all[i], time: toTime(prevEnd) }
        }
    }
    return all
}

const ZOOM_MAX  = 3.0
const ZOOM_STEP = 0.2

const destinationEmoji: Record<string, string> = {
    沖縄: '🌺', 京都: '⛩️', 北海道: '🐻', 東京: '🗼', 大阪: '🍜',
    韓国: '🇰🇷', ハワイ: '🌺', 台湾: '🇹🇼', パリ: '🗼', ニューヨーク: '🗽',
}
function getEmoji(dest: string) {
    for (const [k, v] of Object.entries(destinationEmoji)) {
        if (dest.includes(k)) return v
    }
    return '✈️'
}

function parseStartDate(raw?: string): Date | undefined {
    if (!raw) return undefined
    const d = new Date(raw)
    return isNaN(d.getTime()) ? undefined : d
}

type Snapshot = { days: ItineraryDay[]; sidebarSpots: SidebarSpot[] }

export default function ItineraryEditor({ trip }: { trip: Trip }) {
    const [days, setDays]             = useState<ItineraryDay[]>(trip.itinerary.days)
    const [history, setHistory]       = useState<Snapshot[]>([])
    const [redoStack, setRedoStack]   = useState<Snapshot[]>([])
    const [startDate]                 = useState<Date | undefined>(parseStartDate(trip.itinerary.start_date))
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
    const [zoom, setZoom]             = useState(1.0)
    const [sidebarSpots, setSidebarSpots] = useState<SidebarSpot[]>(trip.itinerary.sidebar_spots ?? [])
    const [receivingSidebar, setReceivingSidebar] = useState(false)
    const [sidebarInsertHint, setSidebarInsertHint] = useState<number | null>(null)
    const [editingSpot, setEditingSpot]   = useState<{ spot: Spot; dayIdx: number; spotIdx: number } | null>(null)
    const [editingHotel, setEditingHotel] = useState<{ hotel: HotelInfo | undefined; dayIdx: number } | null>(null)
    const [draggingCalendarSpot, setDraggingCalendarSpot] = useState<{ name: string; type: SpotType; duration_minutes: number } | null>(null)
    const [title, setTitle]               = useState(trip.title)
    const [editingTitle, setEditingTitle] = useState(false)
    const sidebarPanelRef = useRef<HTMLDivElement>(null)

    function commitTitle(value: string) {
        const trimmed = value.trim() || trip.title
        setTitle(trimmed)
        setEditingTitle(false)
        setSaveStatus('unsaved')
    }

    const saveToDb = useCallback(async () => {
        setSaveStatus('saving')
        try {
            const itinerary = {
                days,
                trip_style: trip.itinerary.trip_style,
                trip_style_reason: trip.itinerary.trip_style_reason,
                start_date: trip.itinerary.start_date,
                sidebar_spots: sidebarSpots,
            }
            const res = await fetch(`/api/trips/${trip.share_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itinerary, title }),
            })
            setSaveStatus(res.ok ? 'saved' : 'unsaved')
        } catch {
            setSaveStatus('unsaved')
        }
    }, [trip.share_id, trip.itinerary, days, sidebarSpots, title])

    // days のみ変更（サイドバーに影響しない操作用）
    function handleUpdateDays(updated: ItineraryDay[]) {
        setHistory(h => [...h, { days, sidebarSpots }])
        setRedoStack([])
        setDays(updated)
        setSaveStatus('unsaved')
    }

    // days + sidebarSpots を同時に変更（両方を undo/redo 対象にする）
    function handleUpdateBoth(updatedDays: ItineraryDay[], updatedSidebar: SidebarSpot[]) {
        setHistory(h => [...h, { days, sidebarSpots }])
        setRedoStack([])
        setDays(updatedDays)
        setSidebarSpots(updatedSidebar)
        setSaveStatus('unsaved')
    }

    function undo() {
        if (history.length === 0) return
        const prev = history[history.length - 1]
        setRedoStack(r => [...r, { days, sidebarSpots }])
        setDays(prev.days)
        setSidebarSpots(prev.sidebarSpots)
        setHistory(h => h.slice(0, -1))
        setSaveStatus('unsaved')
    }

    function redo() {
        if (redoStack.length === 0) return
        const next = redoStack[redoStack.length - 1]
        setHistory(h => [...h, { days, sidebarSpots }])
        setDays(next.days)
        setSidebarSpots(next.sidebarSpots)
        setRedoStack(r => r.slice(0, -1))
        setSaveStatus('unsaved')
    }

    function handleDoubleClickSpot(spot: Spot, dayIdx: number, spotIdx: number) {
        setEditingSpot({ spot, dayIdx, spotIdx })
    }

    function handleSpotDetailSave(updated: Spot) {
        if (!editingSpot) return
        let newDays: ItineraryDay[]
        if (editingSpot.spotIdx === -1) {
            // フリーブロックのドロップで新規追加
            newDays = days.map((d, i) =>
                i === editingSpot.dayIdx ? { ...d, spots: insertSpot(d.spots, updated) } : d
            )
        } else {
            // 既存スポットの編集
            newDays = days.map((d, di) =>
                di === editingSpot.dayIdx
                    ? { ...d, spots: d.spots.map((s, si) => si === editingSpot.spotIdx ? updated : s) }
                    : d
            )
        }
        handleUpdateDays(newDays)
        setEditingSpot(null)
    }

    // sidebarPanelRef 内の [data-spot-idx] 要素のY中点を使ってドロップ位置を計算
    function getInsertIndex(mouseY: number): number {
        if (!sidebarPanelRef.current) return sidebarSpots.length
        const items = Array.from(sidebarPanelRef.current.querySelectorAll<HTMLElement>('[data-spot-idx]'))
        for (const item of items) {
            const rect = item.getBoundingClientRect()
            if (mouseY < rect.top + rect.height / 2) {
                return parseInt(item.dataset.spotIdx ?? String(sidebarSpots.length))
            }
        }
        return sidebarSpots.length
    }

    function handleMoveToSidebar(spot: Spot, dayIdx: number, spotIdx: number, _mouseX: number, mouseY: number) {
        const sidebarSpot: SidebarSpot = {
            name: spot.name,
            description: spot.description,
            type: spot.type,
            duration_minutes: spot.duration_minutes,
        }
        const newDays = days.map((d, i) =>
            i === dayIdx ? { ...d, spots: d.spots.filter((_, si) => si !== spotIdx) } : d
        )
        const insertIdx = getInsertIndex(mouseY)
        const newSidebar = [
            ...sidebarSpots.slice(0, insertIdx),
            sidebarSpot,
            ...sidebarSpots.slice(insertIdx),
        ]
        handleUpdateBoth(newDays, newSidebar)
    }

    function handleDropSuggestedSpot(dayIdx: number, time: string, spot: SidebarSpot, spotIdx: number) {
        const newSpot: Spot = { time, name: spot.name, description: spot.description, type: spot.type, duration_minutes: spot.duration_minutes }
        const newDays = days.map((d, i) => i === dayIdx ? { ...d, spots: insertSpot(d.spots, newSpot) } : d)
        const newSidebar = sidebarSpots.filter((_, i) => i !== spotIdx)
        handleUpdateBoth(newDays, newSidebar)
    }

    function handleHotelSave(hotel: HotelInfo) {
        if (!editingHotel) return
        const newDays = days.map((d, i) => i === editingHotel.dayIdx ? { ...d, hotel } : d)
        handleUpdateDays(newDays)
        setEditingHotel(null)
    }

    function handleHotelDelete() {
        if (!editingHotel) return
        const newDays = days.map((d, i) => i === editingHotel.dayIdx ? { ...d, hotel: undefined } : d)
        handleUpdateDays(newDays)
        setEditingHotel(null)
    }

    function handleDropFreeBlock(dayIdx: number, time: string, type: SpotType) {
        const placeholder: Spot = { time, name: '', description: '', type, duration_minutes: 60 }
        setEditingSpot({ spot: placeholder, dayIdx, spotIdx: -1 })
    }

    const isMobile  = useIsMobile()
    const saveColor = saveStatus === 'saved' ? '#10b981' : saveStatus === 'saving' ? '#60a5fa' : '#f59e0b'
    const saveText  = saveStatus === 'saved' ? '✓ 保存済み' : saveStatus === 'saving' ? '保存中...' : '● 未保存'
    const zoomPct   = Math.min(100, ((zoom - 1.0) / (ZOOM_MAX - 1.0)) * 100)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* ── しおり表紙 ── */}
            <div style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                color: 'white',
                borderRadius: 16,
                padding: isMobile ? '16px 16px' : '20px 24px',
                boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 10, color: '#bfdbfe', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                            Travel Itinerary
                        </p>
                        {editingTitle ? (
                            <input
                                autoFocus
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                onBlur={e => commitTitle(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') commitTitle(e.currentTarget.value)
                                    if (e.key === 'Escape') { setTitle(title); setEditingTitle(false) }
                                }}
                                style={{
                                    fontSize: isMobile ? 18 : 22, fontWeight: 700, lineHeight: 1.3,
                                    margin: '0 0 8px', width: '100%', background: 'rgba(255,255,255,0.15)',
                                    border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 8,
                                    color: 'white', padding: '2px 8px', outline: 'none',
                                    fontFamily: 'inherit', boxSizing: 'border-box',
                                }}
                            />
                        ) : (
                            <h1
                                onDoubleClick={() => setEditingTitle(true)}
                                title="ダブルクリックで編集"
                                style={{
                                    fontSize: isMobile ? 18 : 22, fontWeight: 700, lineHeight: 1.3,
                                    margin: '0 0 8px', cursor: 'text',
                                }}
                            >
                                {title}
                            </h1>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#bfdbfe' }}>
                            <span>📍 {trip.destination}</span>
                            <span style={{ opacity: 0.5 }}>·</span>
                            <span>🗓️ {trip.duration_days}日間</span>
                            {startDate && (
                                <>
                                    <span style={{ opacity: 0.5 }}>·</span>
                                    <span>{startDate.getMonth() + 1}/{startDate.getDate()}〜</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{ fontSize: isMobile ? 32 : 44, marginLeft: 12, lineHeight: 1 }}>{getEmoji(trip.destination)}</div>
                </div>
                {trip.source_url && (
                    <a
                        href={trip.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 11, color: '#bfdbfe', textDecoration: 'underline', textUnderlineOffset: 2 }}
                    >
                        📰 参照元記事を見る
                    </a>
                )}
            </div>

            {/* ── 統合ツールバー ── */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: isMobile ? 6 : 8,
                padding: isMobile ? '8px 10px' : '8px 12px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}>
                {/* 戻るボタン */}
                <button
                    type="button"
                    onClick={undo}
                    disabled={history.length === 0}
                    title="一つ前の状態に戻す"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '5px 10px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#4b5563',
                        cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: history.length === 0 ? 0.35 : 1,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    ↩ 戻す
                </button>

                {/* 進むボタン */}
                <button
                    type="button"
                    onClick={redo}
                    disabled={redoStack.length === 0}
                    title="一つ先の状態に進む"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '5px 10px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#4b5563',
                        cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: redoStack.length === 0 ? 0.35 : 1,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                >
                    ↪ 進む
                </button>

                {/* 区切り線（モバイルでは非表示）*/}
                {!isMobile && <div style={{ width: 1, height: 18, backgroundColor: '#d1d5db', flexShrink: 0 }} />}

                {/* ズームコントロール（モバイルでは非表示）*/}
                {!isMobile && <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>縦軸</span>}

                {!isMobile && (
                    <button
                        type="button"
                        onClick={() => setZoom(z => Math.max(1.0, +(z - ZOOM_STEP).toFixed(1)))}
                        disabled={zoom <= 1.0}
                        style={{
                            width: 26, height: 26,
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            borderRadius: 7,
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#6b7280',
                            cursor: zoom <= 1.0 ? 'not-allowed' : 'pointer',
                            opacity: zoom <= 1.0 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >−</button>
                )}

                {/* ズームバー（デスクトップのみ）*/}
                {!isMobile && (
                    <div style={{ width: 48, height: 4, backgroundColor: '#e5e7eb', borderRadius: 99, flexShrink: 0, position: 'relative' }}>
                        <div style={{ width: `${zoomPct}%`, height: 4, backgroundColor: '#93c5fd', borderRadius: 99, transition: 'width 0.15s' }} />
                    </div>
                )}

                {!isMobile && (
                    <button
                        type="button"
                        onClick={() => setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(1)))}
                        style={{
                            width: 26, height: 26,
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            borderRadius: 7,
                            fontSize: 14,
                            fontWeight: 700,
                            color: '#6b7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >＋</button>
                )}

                {/* スペーサー */}
                <div style={{ flex: 1 }} />

                {/* 保存ステータス */}
                <span style={{ fontSize: 12, color: saveColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {saveText}
                </span>

                {/* 保存ボタン */}
                <button
                    type="button"
                    onClick={saveToDb}
                    disabled={saveStatus === 'saved' || saveStatus === 'saving'}
                    style={{
                        padding: '5px 12px',
                        backgroundColor: saveStatus === 'saved' || saveStatus === 'saving' ? '#d1d5db' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: saveStatus === 'saved' || saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        transition: 'background-color 0.15s',
                    }}
                >
                    保存
                </button>

                {/* 区切り線 */}
                <div style={{ width: 1, height: 18, backgroundColor: '#d1d5db', flexShrink: 0 }} />

                <CopyButton shareId={trip.share_id} />
                <ShareButton shareId={trip.share_id} />
            </div>

            {/* ── Google Maps リンク ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                overflowX: 'auto',
            }}>
                <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>🗺️ Google Maps</span>
                <div style={{ width: 1, height: 16, backgroundColor: '#e5e7eb', flexShrink: 0 }} />
                {days.map((day, i) => {
                    const url = buildMapsUrl(day, trip.destination)
                    if (!url) return null
                    return (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '4px 10px',
                                borderRadius: 7,
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                fontSize: 12,
                                fontWeight: 500,
                                color: '#1a73e8',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                        >
                            {day.label}
                        </a>
                    )
                })}
            </div>

            {/* ── カレンダービュー + サイドパネル ── */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 8,
                alignItems: isMobile ? 'stretch' : 'flex-start',
            }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <CalendarView
                        days={days}
                        startDate={startDate}
                        zoom={zoom}
                        onUpdateDays={handleUpdateDays}
                        onDropSuggestedSpot={handleDropSuggestedSpot}
                        onDropFreeBlock={handleDropFreeBlock}
                        onMoveToSidebar={handleMoveToSidebar}
                        onDraggingToSidebarChange={v => {
                            setReceivingSidebar(v)
                            if (!v) setSidebarInsertHint(null)
                        }}
                        onSidebarDragMove={mouseY => setSidebarInsertHint(getInsertIndex(mouseY))}
                        onDoubleClickSpot={handleDoubleClickSpot}
                        sidebarRef={sidebarPanelRef}
                        onDragStart={spot => setDraggingCalendarSpot({ name: spot.name, type: spot.type, duration_minutes: spot.duration_minutes })}
                        onDragEnd={() => setDraggingCalendarSpot(null)}
                        onGapClick={(dayIdx, time, duration) => {
                            const placeholder: Spot = { time, name: '', description: '', type: '移動', duration_minutes: duration }
                            setEditingSpot({ spot: placeholder, dayIdx, spotIdx: -1 })
                        }}
                        onDoubleClickHotel={(hotel, dayIdx) => setEditingHotel({ hotel, dayIdx })}
                    />
                </div>
                {/* モバイル: カレンダー下にパネルを縦並び表示 */}
                <div ref={sidebarPanelRef}>
                    <SuggestedSpotsPanel
                        spots={sidebarSpots}
                        isReceiving={receivingSidebar}
                        insertHint={sidebarInsertHint}
                        onDelete={idx => handleUpdateBoth(days, sidebarSpots.filter((_, i) => i !== idx))}
                        previewSpot={receivingSidebar ? draggingCalendarSpot : null}
                    />
                </div>
                {!isMobile && <FreeBlocksPanel />}
            </div>

            {/* ── スポット詳細モーダル（ダブルクリックで表示）── */}
            {editingSpot && (
                <SpotDetailModal
                    spot={editingSpot.spot}
                    onSave={handleSpotDetailSave}
                    onCancel={() => setEditingSpot(null)}
                />
            )}

            {/* ── 宿泊詳細モーダル ── */}
            {editingHotel && (
                <HotelDetailModal
                    hotel={editingHotel.hotel}
                    dayLabel={days[editingHotel.dayIdx]?.label ?? ''}
                    onSave={handleHotelSave}
                    onDelete={handleHotelDelete}
                    onCancel={() => setEditingHotel(null)}
                />
            )}

        </div>
    )
}
