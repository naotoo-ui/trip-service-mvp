'use client'
import { useState, useCallback } from 'react'
import type { Trip, ItineraryDay } from '@/types'
import CalendarView from './CalendarView'

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

export default function ItineraryEditor({ trip }: { trip: Trip }) {
    const [days, setDays] = useState<ItineraryDay[]>(trip.itinerary.days)
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

    const saveToDb = useCallback(async () => {
        setSaveStatus('saving')
        try {
            const res = await fetch(`/api/trips/${trip.share_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itinerary: { days } }),
            })
            setSaveStatus(res.ok ? 'saved' : 'unsaved')
        } catch {
            setSaveStatus('unsaved')
        }
    }, [trip.share_id, days])

    // カレンダーのドラッグ操作 → ローカル状態のみ更新（DB保存しない）
    function handleUpdateDays(updated: ItineraryDay[]) {
        setDays(updated)
        setSaveStatus('unsaved')
    }

    return (
        <div className="space-y-5">
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

            {/* 保存ステータス + 保存ボタン */}
            <div className="flex items-center justify-end gap-3">
                <span className={`text-xs ${
                    saveStatus === 'saved'   ? 'text-emerald-500'
                    : saveStatus === 'saving' ? 'text-blue-400'
                    : 'text-amber-500'
                }`}>
                    {saveStatus === 'saved'   ? '✓ 保存済み'
                    : saveStatus === 'saving' ? '保存中...'
                    : '未保存の変更あり'}
                </span>
                <button
                    onClick={saveToDb}
                    disabled={saveStatus === 'saved' || saveStatus === 'saving'}
                    className="text-xs px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    保存
                </button>
            </div>

            {/* カレンダービュー */}
            <CalendarView days={days} onUpdateDays={handleUpdateDays} />

            <p className="text-center text-xs text-gray-400 pb-4">
                上端/下端をドラッグで時刻変更（10分刻み）· ブロック本体をドラッグで移動 · 日をまたいで移動も可
            </p>
        </div>
    )
}
