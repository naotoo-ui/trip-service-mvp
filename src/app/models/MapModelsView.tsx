'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import { getCoordsForDestination } from '@/lib/destinationCoords'
import MapView from './MapView'
import type { Trip } from '@/types'

type TripBrief = Pick<Trip, 'share_id' | 'title' | 'destination' | 'duration_days' | 'wishes'>

type Props = { trips: TripBrief[] }
type TabKind = 'domestic' | 'overseas'

const EMPTY_SET: Set<string> = new Set()

export default function MapModelsView({ trips }: Props) {
    const [tab, setTab] = useState<TabKind>('domestic')
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(EMPTY_SET)
    const [keyword, setKeyword] = useState('')
    const [visibleCount, setVisibleCount] = useState(50)

    const { domesticMarkers, overseasMarkers, tripsByKey } = useMemo(() => {
        const groups = new Map<string, { name: string; coord: [number, number]; isOverseas: boolean; trips: TripBrief[] }>()
        for (const t of trips) {
            if (!t.destination) continue
            const r = getCoordsForDestination(t.destination)
            if (!r) continue
            const key = t.destination
            const g = groups.get(key)
            if (g) g.trips.push(t)
            else groups.set(key, { name: t.destination, coord: r.coord, isOverseas: r.isOverseas, trips: [t] })
        }

        const domesticMarkers: { key: string; name: string; coord: [number, number]; count: number }[] = []
        const overseasMarkers: { key: string; name: string; coord: [number, number]; count: number }[] = []
        const tripsByKey = new Map<string, TripBrief[]>()
        for (const [key, g] of groups.entries()) {
            tripsByKey.set(key, g.trips)
            const m = { key, name: g.name, coord: g.coord, count: g.trips.length }
            if (g.isOverseas) overseasMarkers.push(m); else domesticMarkers.push(m)
        }
        return { domesticMarkers, overseasMarkers, tripsByKey }
    }, [trips])

    const currentMarkers = tab === 'domestic' ? domesticMarkers : overseasMarkers

    const filteredTrips = useMemo(() => {
        let pool: TripBrief[]
        if (selectedKeys.size > 0) {
            pool = []
            for (const k of selectedKeys) {
                pool.push(...(tripsByKey.get(k) ?? []))
            }
        } else {
            const keySet = new Set(currentMarkers.map(m => m.key))
            pool = trips.filter(t => keySet.has(t.destination))
        }
        if (keyword.trim()) {
            const k = keyword.trim().toLowerCase()
            pool = pool.filter(t =>
                t.title?.toLowerCase().includes(k) ||
                t.wishes?.toLowerCase().includes(k) ||
                t.destination?.toLowerCase().includes(k)
            )
        }
        return pool
    }, [selectedKeys, tripsByKey, currentMarkers, trips, keyword])

    const visibleTrips = filteredTrips.slice(0, visibleCount)

    function changeTab(t: TabKind) {
        setTab(t)
        setSelectedKeys(EMPTY_SET)
        setVisibleCount(50)
    }

    function handleSelectKeys(keys: Set<string>) {
        setSelectedKeys(keys)
        setVisibleCount(50)
        // 選択時に一覧へスムーススクロール（少しだけ）
        if (keys.size > 0) {
            requestAnimationFrame(() => {
                const el = document.getElementById('plans-section')
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (rect.top < 0 || rect.top > window.innerHeight - 100) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                }
            })
        }
    }

    const selectedArr = Array.from(selectedKeys)

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 80px' }}>
            <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                borderRadius: 20, padding: '32px 28px', color: 'white',
                marginBottom: 20, position: 'relative', overflow: 'hidden',
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
                    }}>Curated Model Plans</p>
                    <h1 style={{
                        fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800,
                        lineHeight: 1.2, margin: '0 0 6px',
                    }}>モデルプラン一覧</h1>
                    <p style={{ fontSize: 13, color: '#fce7f3', margin: 0, maxWidth: 600 }}>
                        地図上のピンをクリックすると、その目的地のプランが下に表示されます。
                    </p>
                </div>
            </div>

            <div style={{
                display: 'flex', gap: 4, marginBottom: 14,
                background: 'rgba(15,23,42,0.04)', borderRadius: 12, padding: 4,
                width: 'fit-content',
            }}>
                <TabButton active={tab === 'domestic'} onClick={() => changeTab('domestic')}>
                    🇯🇵 国内 <span style={{ opacity: 0.6, marginLeft: 4 }}>{domesticMarkers.length}</span>
                </TabButton>
                <TabButton active={tab === 'overseas'} onClick={() => changeTab('overseas')}>
                    🌏 海外 <span style={{ opacity: 0.6, marginLeft: 4 }}>{overseasMarkers.length}</span>
                </TabButton>
            </div>

            <MapView
                kind={tab}
                markers={currentMarkers}
                selectedKeys={selectedKeys}
                onSelectKeys={handleSelectKeys}
            />

            <div id="plans-section" style={{
                marginTop: 16, marginBottom: 14,
                display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
            }}>
                {selectedKeys.size > 0 ? (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #fff7ed, #ffe4e6)',
                        color: '#9a3412',
                        border: '1px solid #fed7aa',
                        padding: '8px 14px',
                        borderRadius: 999,
                        fontSize: 14, fontWeight: 700,
                        maxWidth: '100%',
                    }}>
                        {selectedKeys.size === 1 ? (
                            <>
                                <span>{getDestinationEmoji(selectedArr[0])}</span>
                                <span>{selectedArr[0]}</span>
                            </>
                        ) : selectedKeys.size <= 3 ? (
                            <>
                                <span>📍</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>
                                    {selectedArr.join(' / ')}
                                </span>
                            </>
                        ) : (
                            <>
                                <span>📍</span>
                                <span>{selectedKeys.size} エリアを選択中</span>
                            </>
                        )}
                        <span style={{
                            fontSize: 11, fontWeight: 700,
                            background: 'rgba(234,88,12,0.16)',
                            padding: '2px 7px', borderRadius: 99,
                        }}>{filteredTrips.length}件</span>
                        <button
                            type="button"
                            onClick={() => setSelectedKeys(EMPTY_SET)}
                            style={{
                                marginLeft: 4,
                                background: 'transparent', border: 'none',
                                color: '#9a3412', fontSize: 16, fontWeight: 700,
                                cursor: 'pointer', padding: 0, lineHeight: 1,
                            }}
                            aria-label="選択を解除"
                        >×</button>
                    </div>
                ) : (
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                        全 <strong style={{ color: '#0f172a' }}>{filteredTrips.length}</strong> プラン表示中
                        <span style={{ marginLeft: 8, color: '#9ca3af' }}>（ピンを選んで絞り込み）</span>
                    </div>
                )}
                <div style={{ flex: 1 }} />
                <input
                    type="search"
                    value={keyword}
                    onChange={e => { setKeyword(e.target.value); setVisibleCount(50) }}
                    placeholder="キーワード検索（例：グルメ・絶景・家族）"
                    style={{
                        minWidth: 220, flex: '1 0 220px', maxWidth: 320,
                        padding: '9px 14px', borderRadius: 10,
                        border: '1.5px solid #e5e7eb', fontSize: 13,
                        outline: 'none', background: 'white',
                    }}
                />
            </div>

            {filteredTrips.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '50px 20px',
                    background: 'white', borderRadius: 16,
                    border: '1px dashed #e5e7eb', color: '#9ca3af',
                }}>
                    <p style={{ fontSize: 28, margin: '0 0 8px' }}>🗺️</p>
                    <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
                        条件に一致するプランがありません
                    </p>
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden',
                }}>
                    {visibleTrips.map((trip, idx) => (
                        <Link
                            key={trip.share_id}
                            href={`/trips/${trip.share_id}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '14px 18px',
                                borderBottom: idx < visibleTrips.length - 1 ? '1px solid #f3f4f6' : 'none',
                                textDecoration: 'none', color: 'inherit',
                                transition: 'background 0.15s',
                            }}
                            className="model-row"
                        >
                            <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>
                                {getDestinationEmoji(trip.destination)}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: 14, fontWeight: 700, color: '#111827',
                                    margin: '0 0 3px',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>{trip.title}</p>
                                <p style={{
                                    fontSize: 12, color: '#6b7280', margin: 0,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    📍 {trip.destination} ・ {trip.duration_days}日間
                                    {trip.wishes ? ` ・ ${trip.wishes}` : ''}
                                </p>
                            </div>
                            <span style={{ fontSize: 18, color: '#cbd5e1', flexShrink: 0 }}>›</span>
                        </Link>
                    ))}
                </div>
            )}

            {visibleCount < filteredTrips.length && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button
                        type="button"
                        onClick={() => setVisibleCount(c => c + 50)}
                        style={{
                            padding: '11px 22px',
                            background: 'white',
                            border: '1.5px solid #e5e7eb',
                            borderRadius: 10,
                            fontSize: 13, fontWeight: 600,
                            color: '#374151',
                            cursor: 'pointer',
                        }}
                    >もっと見る（あと {filteredTrips.length - visibleCount} 件）</button>
                </div>
            )}

            <style jsx>{`
                .model-row:hover {
                    background: #fff7ed;
                }
            `}</style>
        </div>
    )
}

function TabButton({ active, onClick, children }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding: '9px 18px',
                fontSize: 14, fontWeight: 700,
                color: active ? '#7c3aed' : '#64748b',
                background: active ? 'white' : 'transparent',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                boxShadow: active ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s',
            }}
        >{children}</button>
    )
}
