import type { Trip } from '@/types'

const typeColors: Record<string, string> = {
    観光: 'bg-blue-100 text-blue-700',
    グルメ: 'bg-orange-100 text-orange-700',
    移動: 'bg-gray-100 text-gray-600',
    宿泊: 'bg-purple-100 text-purple-700',
    その他: 'bg-green-100 text-green-700',
}

export default function ItineraryView({ trip }: { trip: Trip }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{trip.title}</h1>
                <p className="text-gray-500 mt-1">
                    {trip.destination} · {trip.duration_days}日間
                </p>
                {trip.source_url && (
                    <p className="text-xs text-gray-400 mt-1">
                        参照元:{' '}
                        <a
                            href={trip.source_url}
                            className="underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {trip.source_url}
                        </a>
                    </p>
                )}
            </div>
            {trip.itinerary.days.map((day) => (
                <div key={day.day}>
                    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3">
                        {day.label}
                    </h2>
                    <div className="space-y-3">
                        {day.spots.map((spot, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="text-sm text-gray-400 w-12 shrink-0 pt-0.5 tabular-nums">
                                    {spot.time}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm">{spot.name}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${typeColors[spot.type] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {spot.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{spot.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
