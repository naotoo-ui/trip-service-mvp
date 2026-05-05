'use client'
import { useState, useCallback } from 'react'
import type { Trip, ItineraryDay } from '@/types'
import CalendarView from './CalendarView'
import ShareButton from './ShareButton'

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

export default function ItineraryEditor({ trip }: { trip: Trip }) {
    const [days, setDays]             = useState<ItineraryDay[]>(trip.itinerary.days)
    const [history, setHistory]       = useState<ItineraryDay[][]>([])
    const [startDate]                 = useState<Date | undefined>(parseStartDate(trip.itinerary.start_date))
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
    const [zoom, setZoom]             = useState(1.0)

    const saveToDb = useCallback(async () => {
        setSaveStatus('saving')
        try {
            const itinerary = {
                days,
                trip_style: trip.itinerary.trip_style,
                trip_style_reason: trip.itinerary.trip_style_reason,
                start_date: trip.itinerary.start_date,
            }
            const res = await fetch(`/api/trips/${trip.share_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itinerary }),
            })
            setSaveStatus(res.ok ? 'saved' : 'unsaved')
        } catch {
            setSaveStatus('unsaved')
        }
    }, [trip.share_id, trip.itinerary, days])

    function handleUpdateDays(updated: ItineraryDay[]) {
        setHistory(h => [...h, days])
        setDays(updated)
        setSaveStatus('unsaved')
    }

    function undo() {
        if (history.length === 0) return
        const prev = history[history.length - 1]
        setDays(prev)
        setHistory(h => h.slice(0, -1))
        setSaveStatus('unsaved')
    }

    const saveColor = saveStatus === 'saved' ? '#10b981' : saveStatus === 'saving' ? '#60a5fa' : '#f59e0b'
    const saveText  = saveStatus === 'saved' ? '✓ 保存済み' : saveStatus === 'saving' ? '保存中...' : '● 未保存'
    const zoomPct   = Math.min(100, ((zoom - 1.0) / (ZOOM_MAX - 1.0)) * 100)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* ── しおり表紙 ── */}
            <div style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                color: 'white',
                borderRadius: 20,
                padding: '20px 24px',
                boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 10, color: '#bfdbfe', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                            Travel Itinerary
                        </p>
                        <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3, margin: '0 0 10px' }}>
                            {trip.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 13, color: '#bfdbfe' }}>
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
                    <div style={{ fontSize: 44, marginLeft: 16, lineHeight: 1 }}>{getEmoji(trip.destination)}</div>
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

            {/* ── 統合ツールバー（inline style で確実に横一列）── */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                flexWrap: 'nowrap',
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

                {/* 区切り線 */}
                <div style={{ width: 1, height: 18, backgroundColor: '#d1d5db', flexShrink: 0 }} />

                {/* ズームコントロール */}
                <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>縦軸</span>

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

                {/* ズームバー */}
                <div style={{ width: 48, height: 4, backgroundColor: '#e5e7eb', borderRadius: 99, flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: `${zoomPct}%`, height: 4, backgroundColor: '#93c5fd', borderRadius: 99, transition: 'width 0.15s' }} />
                </div>

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
            </div>

            {/* ── カレンダービュー（固定高・内部スクロール）── */}
            <CalendarView
                days={days}
                startDate={startDate}
                zoom={zoom}
                onUpdateDays={handleUpdateDays}
            />

            {/* ── シェアボタン ── */}
            <ShareButton shareId={trip.share_id} />

        </div>
    )
}
