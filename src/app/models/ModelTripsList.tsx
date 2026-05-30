'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import Link from 'next/link'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import type { Trip } from '@/types'

type Props = {
    items: Pick<Trip, 'share_id' | 'title' | 'destination' | 'duration_days' | 'wishes'>[]
    allDestinations: string[]
    currentDestination?: string
    currentDuration?: number
    currentKeyword?: string
    page: number
    totalPages: number
    total: number
}

const DURATION_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function ModelTripsList({
    items, allDestinations, currentDestination, currentDuration, currentKeyword, page, totalPages, total,
}: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()
    const [keyword, setKeyword] = useState(currentKeyword ?? '')

    useEffect(() => {
        setKeyword(currentKeyword ?? '')
    }, [currentKeyword])

    function updateParams(updates: Record<string, string | undefined>) {
        const params = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(updates)) {
            if (value === undefined || value === '') params.delete(key)
            else params.set(key, value)
        }
        // フィルタ変更時はページを1に戻す
        if (!('page' in updates)) params.delete('page')
        const qs = params.toString()
        startTransition(() => {
            router.push(`/models${qs ? `?${qs}` : ''}`)
        })
    }

    function applyKeyword(e: React.FormEvent) {
        e.preventDefault()
        updateParams({ q: keyword || undefined })
    }

    function clearFilters() {
        startTransition(() => {
            router.push('/models')
        })
    }

    return (
        <div>
            {/* フィルタ */}
            <div style={{
                background: 'white', borderRadius: 16,
                border: '1px solid #f0f0f0',
                padding: '16px 18px',
                marginBottom: 16,
                display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
            }}>
                <select
                    value={currentDestination ?? ''}
                    onChange={e => updateParams({ destination: e.target.value || undefined })}
                    style={selectStyle}
                >
                    <option value="">📍 全ての目的地</option>
                    {allDestinations.map(d => (
                        <option key={d} value={d}>{getDestinationEmoji(d)} {d}</option>
                    ))}
                </select>

                <select
                    value={currentDuration?.toString() ?? ''}
                    onChange={e => updateParams({ duration: e.target.value || undefined })}
                    style={selectStyle}
                >
                    <option value="">📅 全ての日数</option>
                    {DURATION_OPTIONS.map(d => (
                        <option key={d} value={d}>{d}日間</option>
                    ))}
                </select>

                <form onSubmit={applyKeyword} style={{ display: 'flex', gap: 6, flex: 1, minWidth: 200 }}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder="キーワード（例: グルメ、絶景、家族）"
                        style={{
                            flex: 1, minWidth: 0,
                            padding: '8px 12px',
                            border: '1.5px solid #e5e7eb',
                            borderRadius: 10,
                            fontSize: 13,
                            outline: 'none',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '8px 14px',
                            background: '#7c3aed',
                            color: 'white',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: 13, fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >検索</button>
                </form>

                {(currentDestination || currentDuration || currentKeyword) && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        style={{
                            padding: '7px 12px',
                            background: '#f3f4f6',
                            color: '#374151',
                            border: '1.5px solid #e5e7eb',
                            borderRadius: 10,
                            fontSize: 12, fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >× フィルタ解除</button>
                )}
            </div>

            {/* リスト */}
            {items.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 20px',
                    background: 'white', borderRadius: 16,
                    border: '1px dashed #e5e7eb', color: '#9ca3af',
                }}>
                    <p style={{ fontSize: 32, margin: '0 0 8px' }}>🔍</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#6b7280', margin: '0 0 6px' }}>条件に合うプランが見つかりません</p>
                    <p style={{ fontSize: 13, margin: '0 0 16px' }}>フィルタを調整してみてください</p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        style={{
                            padding: '10px 20px', borderRadius: 10,
                            background: '#7c3aed', color: 'white',
                            fontSize: 13, fontWeight: 700,
                            border: 'none', cursor: 'pointer',
                        }}
                    >フィルタ解除</button>
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden',
                }}>
                    {items.map((trip, idx) => (
                        <Link
                            key={trip.share_id}
                            href={`/trips/${trip.share_id}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '14px 18px',
                                borderBottom: idx < items.length - 1 ? '1px solid #f3f4f6' : 'none',
                                textDecoration: 'none', color: 'inherit',
                                transition: 'background 0.15s',
                            }}
                            className="model-row"
                        >
                            <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>
                                {getDestinationEmoji(trip.destination)}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: 14, fontWeight: 700, color: '#111827',
                                    margin: '0 0 3px',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {trip.title}
                                </p>
                                <p style={{
                                    fontSize: 12, color: '#6b7280', margin: 0,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    📍 {trip.destination} ・ {trip.duration_days}日間
                                    {trip.wishes ? ` ・ ${trip.wishes}` : ''}
                                </p>
                            </div>
                            <span style={{
                                fontSize: 18, color: '#cbd5e1', flexShrink: 0,
                            }}>›</span>
                        </Link>
                    ))}
                </div>
            )}

            {/* ページング */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: 6, marginTop: 24, flexWrap: 'wrap',
                }}>
                    {page > 1 && (
                        <button
                            type="button"
                            onClick={() => updateParams({ page: String(page - 1) })}
                            style={pageButtonStyle}
                        >‹ 前へ</button>
                    )}
                    <span style={{ fontSize: 13, color: '#6b7280', margin: '0 8px' }}>
                        {page} / {totalPages}
                    </span>
                    {page < totalPages && (
                        <button
                            type="button"
                            onClick={() => updateParams({ page: String(page + 1) })}
                            style={pageButtonStyle}
                        >次へ ›</button>
                    )}
                </div>
            )}

            <style jsx>{`
                .model-row:hover {
                    background: #faf5ff;
                }
            `}</style>
        </div>
    )
}

const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    fontSize: 13,
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
}

const pageButtonStyle: React.CSSProperties = {
    padding: '8px 14px',
    background: 'white',
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    fontSize: 13, fontWeight: 600,
    color: '#374151',
    cursor: 'pointer',
}
