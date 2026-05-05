'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import type { Trip, ItineraryDay, Spot } from '@/types'
import DayTabs from './DayTabs'
import SpotCard from './SpotCard'
import CalendarView from './CalendarView'

function findNextSpotIndex(spots: Spot[], isToday: boolean): number {
    if (!isToday) return -1
    const now = new Date()
    const cur = now.getHours() * 60 + now.getMinutes()
    for (let i = 0; i < spots.length; i++) {
        const [h, m] = spots[i].time.split(':').map(Number)
        if (!isNaN(h) && h * 60 + m >= cur) return i
    }
    return -1
}

function isTodayDay(dayIndex: number, createdAt: string): boolean {
    const base = new Date(createdAt)
    base.setDate(base.getDate() + dayIndex)
    return base.toDateString() === new Date().toDateString()
}

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

const DEFAULT_SPOT: Spot = {
    time: '09:00', name: '', description: '', duration_minutes: 60, type: '観光'
}

export default function ItineraryEditor({ trip }: { trip: Trip }) {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [activeDay, setActiveDay] = useState(1)
    const [days, setDays] = useState<ItineraryDay[]>(trip.itinerary.days)
    const [now, setNow] = useState(new Date())
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(t)
    }, [])

    // 変更を検知して自動保存（1.5秒デバウンス）
    const saveToDb = useCallback(async (updatedDays: ItineraryDay[]) => {
        setSaveStatus('saving')
        try {
            const res = await fetch(`/api/trips/${trip.share_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itinerary: { days: updatedDays } }),
            })
            if (res.ok) setSaveStatus('saved')
            else setSaveStatus('unsaved')
        } catch {
            setSaveStatus('unsaved')
        }
    }, [trip.share_id])

    function triggerSave(updatedDays: ItineraryDay[]) {
        setSaveStatus('unsaved')
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => saveToDb(updatedDays), 1500)
    }

    function updateDays(updatedDays: ItineraryDay[]) {
        setDays(updatedDays)
        triggerSave(updatedDays)
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const dayIndex = days.findIndex(d => d.day === activeDay)
    const currentDay = days[dayIndex]
    const isToday = dayIndex >= 0 && isTodayDay(dayIndex, trip.created_at)
    const nextIdx = currentDay ? findNextSpotIndex(currentDay.spots, isToday) : -1

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id || !currentDay) return
        const oldIdx = currentDay.spots.findIndex((_, i) => `spot-${i}` === active.id)
        const newIdx = currentDay.spots.findIndex((_, i) => `spot-${i}` === over.id)
        if (oldIdx < 0 || newIdx < 0) return
        const newDays = days.map(d =>
            d.day === activeDay ? { ...d, spots: arrayMove(d.spots, oldIdx, newIdx) } : d
        )
        updateDays(newDays)
    }

    function handleSpotUpdate(spotIndex: number, updated: Spot) {
        const newDays = days.map(d =>
            d.day === activeDay
                ? { ...d, spots: d.spots.map((s, i) => i === spotIndex ? updated : s) }
                : d
        )
        updateDays(newDays)
    }

    function handleSpotDelete(spotIndex: number) {
        const newDays = days.map(d =>
            d.day === activeDay
                ? { ...d, spots: d.spots.filter((_, i) => i !== spotIndex) }
                : d
        )
        updateDays(newDays)
    }

    function handleSpotAdd() {
        const newDays = days.map(d =>
            d.day === activeDay
                ? { ...d, spots: [...d.spots, { ...DEFAULT_SPOT }] }
                : d
        )
        updateDays(newDays)
    }

    return (
        <div className="space-y-6">
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

            {/* ビュー切り替え + 保存状態 */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            viewMode === 'list'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        📋 リスト
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            viewMode === 'calendar'
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        📅 カレンダー
                    </button>
                </div>
                <span className={`text-xs shrink-0 ${
                    saveStatus === 'saved' ? 'text-emerald-500'
                    : saveStatus === 'saving' ? 'text-blue-400'
                    : 'text-gray-400'
                }`}>
                    {saveStatus === 'saved' ? '✓ 保存済み'
                    : saveStatus === 'saving' ? '保存中...'
                    : '未保存'}
                </span>
            </div>

            {/* リストビュー時のみ DAY タブを表示 */}
            {viewMode === 'list' && (
                <DayTabs
                    days={days.map(d => ({ day: d.day, label: d.label }))}
                    activeDay={activeDay}
                    onSelect={setActiveDay}
                />
            )}

            {/* 現在地インジケーター */}
            {isToday && nextIdx >= 0 && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-sm">
                        <span className="text-blue-500 font-medium">
                            現在 {now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}
                        </span>
                        <span className="text-gray-500 ml-2">
                            次の予定: <strong className="text-gray-800">{currentDay!.spots[nextIdx].name}</strong>
                        </span>
                    </p>
                </div>
            )}

            {/* カレンダービュー */}
            {viewMode === 'calendar' && (
                <>
                    <CalendarView days={days} onUpdateDays={updateDays} />
                    <p className="text-center text-xs text-gray-400">
                        ブロック上端/下端をドラッグで時刻変更 · 本体ドラッグで日をまたいで移動 · 変更は自動保存
                    </p>
                </>
            )}

            {/* リストビュー */}
            {viewMode === 'list' && (
                <>
                    {currentDay && (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext
                                items={currentDay.spots.map((_, i) => `spot-${i}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {currentDay.spots.map((spot, i) => (
                                        <SpotCard
                                            key={`spot-${i}`}
                                            id={`spot-${i}`}
                                            spot={spot}
                                            isNext={isToday && i === nextIdx}
                                            isPast={isToday && nextIdx >= 0 && i < nextIdx}
                                            onUpdate={updated => handleSpotUpdate(i, updated)}
                                            onDelete={() => handleSpotDelete(i)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    <button
                        onClick={handleSpotAdd}
                        className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
                    >
                        + スポットを追加
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        ↕ ドラッグして並び替え · クリックして編集 · 変更は自動保存されます
                    </p>
                </>
            )}
        </div>
    )
}
