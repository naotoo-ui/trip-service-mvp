import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTripByShareId } from '@/lib/db/trips'
import ItineraryEditor from '@/components/trips/ItineraryEditor'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const trip = await getTripByShareId(id)
    if (!trip) return {}
    const description = `${trip.destination} ${trip.duration_days}日間の旅程プランです。AIが生成した旅程を確認・カレンダーで編集できます。`
    return {
        title: `${trip.title} | 旅程ジェネレーター`,
        description,
        openGraph: {
            title: trip.title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: trip.title,
            description,
        },
    }
}

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const trip = await getTripByShareId(id)
    if (!trip) notFound()

    return (
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <ItineraryEditor trip={trip} />
        </div>
    )
}
