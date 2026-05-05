import Link from 'next/link'
import { getRecentTrips } from '@/lib/db/trips'

export const revalidate = 0

export default async function TripsPage() {
    const trips = await getRecentTrips(30)

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">最近の旅程</h1>
                <Link
                    href="/"
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                >
                    新しく作成 →
                </Link>
            </div>

            {trips.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-4xl mb-4">✈️</p>
                    <p>まだ旅程がありません</p>
                    <Link href="/" className="text-blue-500 underline text-sm mt-2 inline-block">
                        最初の旅程を作成する
                    </Link>
                </div>
            ) : (
                <div className="grid gap-3">
                    {trips.map(trip => (
                        <Link
                            key={trip.id}
                            href={`/trips/${trip.share_id}`}
                            className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                                ✈️
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{trip.title}</p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {trip.destination} · {trip.duration_days}日間
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 shrink-0">
                                {new Date(trip.created_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
