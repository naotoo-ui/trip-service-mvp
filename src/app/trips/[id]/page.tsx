import { notFound } from 'next/navigation'
import { getTripByShareId } from '@/lib/db/trips'
import ItineraryEditor from '@/components/trips/ItineraryEditor'

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const trip = await getTripByShareId(id)
    if (!trip) notFound()

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <ItineraryEditor trip={trip} />
        </div>
    )
}
