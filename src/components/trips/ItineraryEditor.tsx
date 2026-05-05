'use client'
import { useState, useCallback } from 'react'
import type { Trip, ItineraryDay } from '@/types'
import CalendarView from './CalendarView'

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

    return (
        <div className="space-y-4">
            {/* しおり表紙 */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-blue-200 text-xs font-medium tracking-widest uppercase mb-2">Travel Itinerary</p>
                        <h1 className="text-2xl font-bold leading-snug">{trip.title}</h1>
                        <div className="flex items-center gap-3 mt-3 text-blue-100 text-sm">
                            <span>📍 {trip.destination}</span>
                            <span>·</span>
                            <span>🗓️ {trip.duration_days}日間</span>
                            {startDate && (
                                <>
                                    <span>·</span>
                                    <span>{startDate.getMonth() + 1}/{startDate.getDate()}〜</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="text-5xl ml-4">{getEmoji(trip.destination)}</div>
                </div>
                {trip.source_url && (
                    <a href={trip.source_url} className="mt-4 inline-flex items-center gap-1 text-xs text-blue-200 hover:text-white underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                        📰 参照元記事を見る
                    </a>
                )}
            </div>

            {/* 統合ツールバー */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl">
                {/* 戻るボタン */}
                <button
                    type="button"
                    onClick={undo}
                    disabled={history.length === 0}
                    title="一つ前に戻す"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                    ↩ 戻す
                </button>

                <div className="w-px h-5 bg-gray-300 flex-shrink-0" />

                {/* ズームコントロール */}
                <span className="text-xs text-gray-400 whitespace-nowrap">縦軸</span>
                <button
                    type="button"
                    onClick={() => setZoom(z => Math.max(1.0, +(z - ZOOM_STEP).toFixed(1)))}
                    disabled={zoom <= 1.0}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold flex items-center justify-center flex-shrink-0"
                >−</button>
                <div className="w-14 h-1.5 bg-gray-200 rounded-full relative flex-shrink-0">
                    <div
                        className="h-1.5 bg-blue-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((zoom - 1.0) / (ZOOM_MAX - 1.0)) * 100)}%` }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setZoom(z => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(1)))}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 text-sm font-bold flex items-center justify-center flex-shrink-0"
                >＋</button>

                {/* スペーサー */}
                <div className="flex-1" />

                {/* 保存ステータス */}
                <span className={`text-xs whitespace-nowrap ${
                    saveStatus === 'saved'   ? 'text-emerald-500'
                    : saveStatus === 'saving' ? 'text-blue-400'
                    : 'text-amber-500'
                }`}>
                    {saveStatus === 'saved'   ? '✓ 保存済み'
                    : saveStatus === 'saving' ? '保存中...'
                    : '● 未保存'}
                </span>

                {/* 保存ボタン */}
                <button
                    type="button"
                    onClick={saveToDb}
                    disabled={saveStatus === 'saved' || saveStatus === 'saving'}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                >
                    保存
                </button>
            </div>

            {/* カレンダービュー */}
            <CalendarView
                days={days}
                startDate={startDate}
                zoom={zoom}
                onUpdateDays={handleUpdateDays}
            />
        </div>
    )
}
