'use client'
import { useState, useEffect } from 'react'
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
    const now = new Date()
    return base.toDateString() === now.toDateString()
}

const destinationEmoji: Record<string, string> = {
    沖縄: '🌺', 京都: '⛩️', 北海道: '🐻', 東京: '🗼', 大阪: '🍜',
    韓国: '🇰🇷', ハワイ: '🌺', 台湾: '🇹🇼', パリ: '🗼', ニューヨーク: '🗽',
}

function getDestinationEmoji(destination: string): string {
    for (const [key, emoji] of Object.entries(destinationEmoji)) {
        if (destination.includes(key)) return emoji
    }
    return '✈️'
}

export default function ItineraryEditor({ trip }: { trip: Trip }) {
    const [activeDay, setActiveDay] = useState(1)
    const [days, setDays] = useState<ItineraryDay[]>(trip.itinerary.days)
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(t)
    }, [])

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
        setDays(prev => prev.map(d =>
            d.day === activeDay ? { ...d, spots: arrayMove(d.spots, oldIdx, newIdx) } : d
        ))
    }

    const emoji = getDestinationEmoji(trip.destination)

    return (
        <div className="space-y-6">
            {/* しおり表紙風ヘッダー */}
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
                    <div className="text-5xl ml-4">{emoji}</div>
                </div>
                {trip.source_url && (
                    <a
                        href={trip.source_url}
                        className="mt-4 inline-flex items-center gap-1 text-xs text-blue-200 hover:text-white underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📰 参照元記事を見る
                    </a>
                )}
            </div>

            {/* DAY タブ */}
            <DayTabs
                days={days.map(d => ({ day: d.day, label: d.label }))}
                activeDay={activeDay}
                onSelect={setActiveDay}
            />

            {/* 現在地インジケーター */}
            {isToday && nextIdx >= 0 && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <div className="text-sm">
                        <span className="text-blue-500 font-medium">
                            現在 {now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}
                        </span>
                        <span className="text-gray-500 ml-2">
                            次の予定: <strong className="text-gray-800">{currentDay!.spots[nextIdx].name}</strong>
                        </span>
                    </div>
                </div>
            )}

            {/* スポットリスト */}
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
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <p className="text-center text-xs text-gray-400 pb-2">
                ↕ スポットをドラッグして並び替えられます
            </p>
        </div>
    )
}
