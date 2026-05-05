'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Spot, SpotType } from '@/types'

const typeConfig: Record<string, { bg: string; text: string; icon: string }> = {
    観光: { bg: 'bg-sky-50', text: 'text-sky-600', icon: '🏛️' },
    グルメ: { bg: 'bg-orange-50', text: 'text-orange-600', icon: '🍽️' },
    移動: { bg: 'bg-gray-50', text: 'text-gray-500', icon: '🚗' },
    宿泊: { bg: 'bg-purple-50', text: 'text-purple-600', icon: '🏨' },
    その他: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '📌' },
}

const SPOT_TYPES: SpotType[] = ['観光', 'グルメ', '移動', '宿泊', 'その他']

interface Props {
    id: string
    spot: Spot
    isNext?: boolean
    isPast?: boolean
    onUpdate: (updated: Spot) => void
    onDelete: () => void
}

export default function SpotCard({ id, spot, isNext, isPast, onUpdate, onDelete }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
    const cfg = typeConfig[spot.type] ?? typeConfig['その他']

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
            className={`relative flex gap-3 p-4 rounded-2xl border transition-all ${
                isNext ? 'border-blue-300 bg-blue-50 shadow-sm'
                : isPast ? 'border-gray-100 bg-white opacity-50'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
            } ${isDragging ? 'shadow-xl z-50 rotate-1' : ''}`}
        >
            {/* アイコン */}
            <div className={`shrink-0 w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center text-lg`}>
                {cfg.icon}
            </div>

            {/* 編集可能なコンテンツ */}
            <div className="flex-1 min-w-0 space-y-1">
                {/* 1行目: 時間 + 名前 */}
                <div className="flex items-center gap-2 flex-wrap">
                    <input
                        type="text"
                        value={spot.time}
                        onChange={e => onUpdate({ ...spot, time: e.target.value })}
                        className="text-xs text-gray-400 font-mono w-14 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none"
                        placeholder="09:00"
                    />
                    <input
                        type="text"
                        value={spot.name}
                        onChange={e => onUpdate({ ...spot, name: e.target.value })}
                        className={`font-semibold text-sm flex-1 min-w-0 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none ${isPast ? 'line-through text-gray-400' : 'text-gray-900'}`}
                        placeholder="スポット名"
                    />
                    {isNext && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold shrink-0">NEXT</span>
                    )}
                </div>

                {/* 2行目: 説明 */}
                <input
                    type="text"
                    value={spot.description}
                    onChange={e => onUpdate({ ...spot, description: e.target.value })}
                    className="text-xs text-gray-500 w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none"
                    placeholder="一言メモ"
                />

                {/* 3行目: タイプ + 所要時間 */}
                <div className="flex items-center gap-2">
                    <select
                        value={spot.type}
                        onChange={e => onUpdate({ ...spot, type: e.target.value as SpotType })}
                        className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} font-medium border-none focus:outline-none cursor-pointer`}
                    >
                        {SPOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="text-xs text-gray-400">
                        <input
                            type="number"
                            value={spot.duration_minutes}
                            onChange={e => onUpdate({ ...spot, duration_minutes: Number(e.target.value) })}
                            className="w-10 bg-transparent text-right focus:outline-none"
                            min={0}
                            max={999}
                        />
                        分
                    </span>
                </div>
            </div>

            {/* 右側ボタン群 */}
            <div className="flex flex-col items-center gap-1 shrink-0">
                {/* ドラッグハンドル */}
                <button
                    {...attributes}
                    {...listeners}
                    className="text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none px-1 py-1"
                    aria-label="ドラッグして並び替え"
                >
                    ⠿
                </button>
                {/* 削除ボタン */}
                <button
                    onClick={onDelete}
                    className="text-gray-200 hover:text-red-400 transition-colors px-1 py-1 text-xs"
                    aria-label="スポットを削除"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}
