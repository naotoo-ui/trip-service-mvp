import { notFound } from 'next/navigation'
import { getTripByShareId } from '@/lib/db/trips'
import ItineraryEditor from '@/components/trips/ItineraryEditor'
import ShareButton from '@/components/trips/ShareButton'

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const trip = await getTripByShareId(id)

    if (!trip) {
        notFound()
    }

    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <ItineraryEditor trip={trip} />
            <div className="mt-8">
                <ShareButton shareId={trip.share_id} />
            </div>
        </main>
    )
}
