import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTripByShareId } from '@/lib/db/trips'
import BookletView from '@/components/booklet/BookletView'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const trip = await getTripByShareId(id)
    if (!trip) return {}
    const description = `${trip.destination} ${trip.duration_days}日間のしおり。スマホ表示・印刷にも対応。`
    return {
        title: `${trip.title} のしおり | 旅程ジェネレーター`,
        description,
    }
}

export default async function BookletPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ edit?: string }>
}) {
    const { id }   = await params
    const { edit } = await searchParams
    const trip     = await getTripByShareId(id)
    if (!trip) notFound()

    // 編集モードの引き継ぎ（カレンダー戻るリンク用）
    const editToken = trip.edit_token && edit === trip.edit_token ? trip.edit_token : undefined

    return <BookletView trip={trip} editToken={editToken} />
}
