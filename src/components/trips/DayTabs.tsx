'use client'

interface Props {
    days: { day: number; label: string }[]
    activeDay: number
    onSelect: (day: number) => void
}

export default function DayTabs({ days, activeDay, onSelect }: Props) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {days.map((d) => (
                <button
                    key={d.day}
                    onClick={() => onSelect(d.day)}
                    className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeDay === d.day
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                            : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                >
                    {d.label}
                </button>
            ))}
        </div>
    )
}
