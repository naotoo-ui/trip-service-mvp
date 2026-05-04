'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Spot } from '@/types'

const typeConfig: Record<string, { color: string; icon: string }> = {
    観光: { color: 'bg-blue-100 text-blue-700', icon: '🏛️' },
    グルメ: { color: 'bg-orange-100 text-orange-700', icon: '🍽️' },
    移動: { color: 'bg-gray-100 text-gray-600', icon: '🚗' },
    宿泊: { color: 'bg-purple-100 text-purple-700', icon: '🏨' },
    その他: { color: 'bg-green-100 text-green-700', icon: '📌' },
}

interface Props {
    id: string
    spot: Spot
    isNext?: boolean
    isPast?: boolean
}

export default function SpotCard({ id, spot, isNext, isPast }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const config = typeConfig[spot.type] ?? typeConfig['その他']

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex gap-3 p-3 rounded-xl border transition-all ${
                isNext
                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                    : isPast
                    ? 'border-gray-100 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white'
            } ${isDragging ? 'shadow-lg z-50' : ''}`}
        >
            {/* ドラッグハンドル */}
            <button
                {...attributes}
                {...listeners}
                className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
                aria-label="ドラッグして並び替え"
            >
                ⠿
            </button>

            {/* 時間 */}
            <div className="text-sm text-gray-400 w-12 shrink-0 pt-0.5 tabular-nums font-mono">
                {spot.time}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">{config.icon}</span>
                    <span className={`font-medium text-sm ${isNext ? 'text-blue-700' : ''}`}>
                        {spot.name}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${config.color}`}>
                        {spot.type}
                    </span>
                    {isNext && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                            NEXT
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{spot.description}</p>
                {spot.duration_minutes > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">約{spot.duration_minutes}分</p>
                )}
            </div>
        </div>
    )
}
