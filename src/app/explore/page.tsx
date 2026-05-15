import Link from 'next/link'
import type { Metadata } from 'next'
import { getRecentTrips } from '@/lib/db/trips'
import TripCard from '@/components/trips/TripCard'

export const revalidate = 60

export const metadata: Metadata = {
    title: '旅程を探す | 旅程ジェネレーター',
    description: 'みんながAIで作った旅行プランを覗いてみよう。沖縄・京都・東京から海外旅行まで、実例から旅のインスピレーションを得られます。',
    openGraph: {
        title: '旅程を探す | 旅程ジェネレーター',
        description: 'みんながAIで作った旅行プランを覗いてみよう',
    },
}

export default async function ExplorePage() {
    const trips = await getRecentTrips(30)

    // タイトル・目的地が空のものはノイズなので除外
    const validTrips = trips.filter(t => t.title?.trim() && t.destination?.trim())

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 80px' }}>
            {/* ── ヘッダー ── */}
            <div style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                borderRadius: 20,
                padding: '36px 28px',
                color: 'white',
                marginBottom: 28,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* 装飾 */}
                <div style={{
                    position: 'absolute', top: -60, right: -40,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: '#bfdbfe', margin: '0 0 10px',
                    }}>
                        Explore Itineraries
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800,
                        lineHeight: 1.2, margin: '0 0 8px',
                    }}>
                        旅程を探す
                    </h1>
                    <p style={{ fontSize: 14, color: '#dbeafe', margin: 0, maxWidth: 600 }}>
                        みんながAIで作った旅行プランを覗いてみよう。<br />
                        気に入ったプランは「コピーして使う」で自分用にカスタマイズできます。
                    </p>
                </div>
            </div>

            {/* ── 件数表示 + 新規作成 ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 16, flexWrap: 'wrap', gap: 8,
            }}>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                    最新の{validTrips.length}件
                </p>
                <Link
                    href="/"
                    style={{
                        fontSize: 13, fontWeight: 600,
                        color: '#2563eb', textDecoration: 'none',
                        padding: '7px 14px', borderRadius: 10,
                        border: '1.5px solid #bfdbfe', background: '#eff6ff',
                        whiteSpace: 'nowrap',
                    }}
                >
                    ＋ 新しく作成する
                </Link>
            </div>

            {/* ── カードグリッド ── */}
            {validTrips.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 20px',
                    background: 'white', borderRadius: 16,
                    border: '1px dashed #e5e7eb', color: '#9ca3af',
                }}>
                    <p style={{ fontSize: 48, margin: '0 0 12px' }}>✈️</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#6b7280', margin: '0 0 6px' }}>まだ旅程がありません</p>
                    <p style={{ fontSize: 13, margin: '0 0 16px' }}>最初の旅程をAIで作ってみませんか？</p>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px', borderRadius: 10,
                            background: 'linear-gradient(135deg, #2563eb, #4338ca)',
                            color: 'white', fontSize: 13, fontWeight: 700,
                            textDecoration: 'none',
                        }}
                    >
                        旅程を作成する →
                    </Link>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gap: 16,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    }}
                >
                    {validTrips.map(trip => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            )}

            {/* ── 最終CTA ── */}
            {validTrips.length > 0 && (
                <div style={{
                    marginTop: 60,
                    background: 'white', borderRadius: 20,
                    border: '1px solid #f0f0f0',
                    padding: '40px 24px', textAlign: 'center',
                }}>
                    <p style={{ fontSize: 32, margin: '0 0 12px' }}>✈️</p>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>
                        あなたの旅もAIに任せてみませんか
                    </h2>
                    <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 22px', maxWidth: 440, marginInline: 'auto' }}>
                        行き先と日数を入力するだけで、30秒で実用的な旅程ができあがります。
                    </p>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-block',
                            padding: '13px 32px', borderRadius: 12,
                            background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                            color: 'white', fontSize: 15, fontWeight: 700,
                            textDecoration: 'none',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                        }}
                    >
                        旅程を作成する →
                    </Link>
                </div>
            )}
        </div>
    )
}
