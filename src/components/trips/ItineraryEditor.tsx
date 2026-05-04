'use client'
import { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import type { Trip, ItineraryDay, Spot } from '@/types'
import DayTabs from './DayTabs'
import SpotCard from './SpotCard'

function findNextSpotIndex(spots: Spot[], today: boolean): number {
    if (!today) return -1
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (let i = 0; i < spots.length; i++) {
        const [h, m] = spots[i].time.split(':').map(Number)
        if (!isNaN(h) && h * 60 + m >= currentMinutes) return i
    }
    return -1
}

function isTodayDay(day: ItineraryDay, tripCreatedAt: string, dayIndex: number): boolean {
    const created = new Date(tripCreatedAt)
    const tripDay = new Date(created)
    tripDay.setDate(tripDay.getDate() + dayIndex)
    const today = new Date()
    return (
        tripDay.getFullYear() === today.getFullYear() &&
        tripDay.getMonth() === today.getMonth() &&
        tripDay.getDate() === today.getDate()
    )
}

interface Props {
    trip: Trip
}

export default function ItineraryEditor({ trip }: Props) {
    const [activeDay, setActiveDay] = useState(1)
    const [days, setDays] = useState<ItineraryDay[]>(trip.itinerary.days)
    const [now, setNow] = useState(new Date())

    // 1分ごとに現在時刻を更新
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const currentDayData = days.find((d) => d.day === activeDay)
    const currentDayIndex = days.findIndex((d) => d.day === activeDay)
    const isToday = isTodayDay(currentDayData!, trip.created_at, currentDayIndex)
    const nextSpotIndex = currentDayData ? findNextSpotIndex(currentDayData.spots, isToday) : -1

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id || !currentDayData) return

        const oldIndex = currentDayData.spots.findIndex((_, i) => `spot-${i}` === active.id)
        const newIndex = currentDayData.spots.findIndex((_, i) => `spot-${i}` === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const newSpots = arrayMove(currentDayData.spots, oldIndex, newIndex)
        setDays((prev) =>
            prev.map((d) => (d.day === activeDay ? { ...d, spots: newSpots } : d))
        )
    }

    return (
        <div className="space-y-4">
            {/* タイトル */}
            <div>
                <h1 className="text-2xl font-bold">{trip.title}</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    {trip.destination} · {trip.duration_days}日間
                </p>
                {trip.source_url && (
                    <p className="text-xs text-gray-400 mt-1">
                        参照元:{' '}
                        <a href={trip.source_url} className="underline" target="_blank" rel="noopener noreferrer">
                            {trip.source_url}
                        </a>
                    </p>
                )}
            </div>

            {/* DAY タブ */}
            <DayTabs
                days={days.map((d) => ({ day: d.day, label: d.label }))}
                activeDay={activeDay}
                onSelect={setActiveDay}
            />

            {/* 現在時刻・次の予定インジケーター */}
            {isToday && nextSpotIndex >= 0 && (
                <div className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 flex items-center gap-2">
                    <span>🕐</span>
                    <span>
                        現在 {now.getHours()}:{String(now.getMinutes()).padStart(2, '0')} ·
                        次の予定: {currentDayData!.spots[nextSpotIndex].name}
                    </span>
                </div>
            )}

            {/* スポットリスト（D&D） */}
            {currentDayData && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={currentDayData.spots.map((_, i) => `spot-${i}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {currentDayData.spots.map((spot, i) => (
                                <SpotCard
                                    key={`spot-${i}`}
                                    id={`spot-${i}`}
                                    spot={spot}
                                    isNext={isToday && i === nextSpotIndex}
                                    isPast={isToday && nextSpotIndex >= 0 && i < nextSpotIndex}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <p className="text-xs text-gray-400 text-center pt-2">
                ↕ ドラッグして予定を並び替えられます
            </p>
        </div>
    )
}
