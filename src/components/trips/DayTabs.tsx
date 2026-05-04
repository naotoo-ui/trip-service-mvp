'use client'

interface Props {
    days: { day: number; label: string }[]
    activeDay: number
    onSelect: (day: number) => void
}

export default function DayTabs({ days, activeDay, onSelect }: Props) {
    return (
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {days.map((d) => (
                <button
                    key={d.day}
                    onClick={() => onSelect(d.day)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeDay === d.day
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {d.label}
                </button>
            ))}
        </div>
    )
}
