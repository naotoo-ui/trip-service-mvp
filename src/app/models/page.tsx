import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getModelTrips } from '@/lib/db/trips'
import MapModelsView from './MapModelsView'

export const revalidate = 300

export const metadata: Metadata = {
    title: 'モデルプラン一覧 | 旅程ジェネレーター',
    description: '国内外の人気旅先を地図から選べるモデル旅程一覧。気に入ったプランはコピーして自分用にカスタマイズ可能。',
    openGraph: {
        title: 'モデルプラン一覧 | 旅程ジェネレーター',
        description: '国内外の人気旅先を地図から選べるモデル旅程一覧。',
    },
}

export default async function ModelsPage() {
    // モデルプランは多くて 600 件程度なので全件取得して、クライアント側で地図と検索を回す
    const { items } = await getModelTrips({ limit: 5000 })
    const trips = items.map(t => ({
        share_id: t.share_id,
        title: t.title,
        destination: t.destination,
        duration_days: t.duration_days,
        wishes: t.wishes,
    }))

    return (
        <Suspense fallback={null}>
            <MapModelsView trips={trips} />
        </Suspense>
    )
}
