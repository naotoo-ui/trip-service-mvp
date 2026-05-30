import type { Metadata } from 'next'
import Link from 'next/link'
import { getModelTrips, getModelDestinations } from '@/lib/db/trips'
import ModelTripsList from './ModelTripsList'

export const revalidate = 300  // 5分キャッシュ

export const metadata: Metadata = {
    title: 'モデルプラン一覧 | 旅程ジェネレーター',
    description: '国内外の人気旅先をAIで生成した3000件以上のモデル旅程を、目的地・日数・テーマで検索できます。気に入ったプランはコピーして自分用にカスタマイズ可能。',
    openGraph: {
        title: 'モデルプラン一覧 | 旅程ジェネレーター',
        description: '国内外の人気旅先のモデル旅程3000件以上から自分にぴったりのプランを探せます。',
    },
}

type SearchParams = Record<string, string | string[] | undefined>

function pickString(v: string | string[] | undefined): string | undefined {
    if (Array.isArray(v)) return v[0]
    return v
}

export default async function ModelsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const sp = await searchParams
    const destination = pickString(sp.destination)
    const durationRaw = pickString(sp.duration)
    const duration = durationRaw ? Number(durationRaw) : undefined
    const keyword = pickString(sp.q)
    const pageRaw = pickString(sp.page)
    const page = pageRaw ? Math.max(1, Number(pageRaw)) : 1
    const PAGE_SIZE = 100

    const [{ items, total }, allDestinations] = await Promise.all([
        getModelTrips({
            destination,
            duration: duration && !isNaN(duration) ? duration : undefined,
            keyword,
            limit: PAGE_SIZE,
            offset: (page - 1) * PAGE_SIZE,
        }),
        getModelDestinations(),
    ])

    const totalPages = Math.ceil(total / PAGE_SIZE)

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 80px' }}>
            {/* ── ヘッダー ── */}
            <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                borderRadius: 20,
                padding: '36px 28px',
                color: 'white',
                marginBottom: 28,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -60, right: -40,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: '#fce7f3', margin: '0 0 10px',
                    }}>
                        Curated Model Plans
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800,
                        lineHeight: 1.2, margin: '0 0 8px',
                    }}>
                        モデルプラン一覧
                    </h1>
                    <p style={{ fontSize: 14, color: '#fce7f3', margin: 0, maxWidth: 600 }}>
                        国内35エリア・海外30都市・欧州周遊ルートをカバーした {total.toLocaleString()} 件のモデル旅程。<br />
                        気に入ったプランは「コピーして使う」で自分用にカスタマイズできます。
                    </p>
                </div>
            </div>

            {/* ── 案内 ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 16, flexWrap: 'wrap', gap: 8,
            }}>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    {total.toLocaleString()}件 中 {((page - 1) * PAGE_SIZE + 1).toLocaleString()}〜{Math.min(page * PAGE_SIZE, total).toLocaleString()}件を表示
                </p>
                <Link
                    href="/explore"
                    style={{
                        fontSize: 13, fontWeight: 600,
                        color: '#7c3aed', textDecoration: 'none',
                        padding: '7px 14px', borderRadius: 10,
                        border: '1.5px solid #ddd6fe', background: '#faf5ff',
                        whiteSpace: 'nowrap',
                    }}
                >
                    みんなのプランも見る →
                </Link>
            </div>

            {/* リスト + フィルタ */}
            <ModelTripsList
                items={items}
                allDestinations={allDestinations}
                currentDestination={destination}
                currentDuration={duration}
                currentKeyword={keyword}
                page={page}
                totalPages={totalPages}
                total={total}
            />
        </div>
    )
}
