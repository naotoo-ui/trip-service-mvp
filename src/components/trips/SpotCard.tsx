'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Spot } from '@/types'

const typeConfig: Record<string, { bg: string; text: string; icon: string }> = {
    観光: { bg: 'bg-sky-50', text: 'text-sky-600', icon: '🏛️' },
    グルメ: { bg: 'bg-orange-50', text: 'text-orange-600', icon: '🍽️' },
    移動: { bg: 'bg-gray-50', text: 'text-gray-500', icon: '🚗' },
    宿泊: { bg: 'bg-purple-50', text: 'text-purple-600', icon: '🏨' },
    その他: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '📌' },
}

interface Props {
    id: string
    spot: Spot
    isNext?: boolean
    isPast?: boolean
}

export default function SpotCard({ id, spot, isNext, isPast }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
    const cfg = typeConfig[spot.type] ?? typeConfig['その他']

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
            className={`relative flex gap-3 p-4 rounded-2xl border transition-all ${
                isNext
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : isPast
                    ? 'border-gray-100 bg-white opacity-50'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
            } ${isDragging ? 'shadow-xl z-50 rotate-1' : ''}`}
        >
            {/* タイムライン縦線 */}
            <div className="absolute left-[2.15rem] top-full w-px h-2 bg-gray-200" aria-hidden />

            {/* アイコン */}
            <div className={`shrink-0 w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center text-lg`}>
                {cfg.icon}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-mono tabular-nums">{spot.time}</span>
                    <span className={`font-semibold text-sm text-gray-900 ${isPast ? 'line-through' : ''}`}>
                        {spot.name}
                    </span>
                    {isNext && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">NEXT</span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{spot.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} font-medium`}>
                        {spot.type}
                    </span>
                    {spot.duration_minutes > 0 && (
                        <span className="text-xs text-gray-400">約{spot.duration_minutes}分</span>
                    )}
                </div>
            </div>

            {/* ドラッグハンドル */}
            <button
                {...attributes}
                {...listeners}
                className="shrink-0 text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none self-center px-1"
                aria-label="ドラッグして並び替え"
            >
                ⠿
            </button>
        </div>
    )
}
