import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTripByShareId } from '@/lib/db/trips'
import ItineraryEditor from '@/components/trips/ItineraryEditor'
import TripViewTracker from '@/components/trips/TripViewTracker'

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

export default async function TripPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ edit?: string }>
}) {
    const { id }           = await params
    const { edit }         = await searchParams
    const trip             = await getTripByShareId(id)
    if (!trip) notFound()

    // edit_token がDBにあるなら一致しないと編集不可
    // 旧旅程（edit_token NULL）は誰でも編集可（後方互換）
    const editable = trip.edit_token
        ? edit === trip.edit_token
        : true

    return (
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <TripViewTracker
                shareId={trip.share_id}
                title={trip.title}
                destination={trip.destination}
                durationDays={trip.duration_days}
                editToken={editable ? trip.edit_token : undefined}
            />
            <ItineraryEditor
                trip={trip}
                editable={editable}
                editToken={editable ? trip.edit_token : undefined}
            />
        </div>
    )
}
