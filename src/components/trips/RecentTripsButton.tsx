'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRecentTrips } from '@/hooks/useRecentTrips'
import { getDestinationEmoji } from '@/lib/destinationEmoji'

export default function RecentTripsButton() {
    const { trips, remove, clear } = useRecentTrips()
    const [open, setOpen]           = useState(false)
    const wrapperRef                = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const onClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onEsc)
        }
    }, [open])

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-label="最近の旅程"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                style={{ position: 'relative' }}
            >
                <span className="text-base leading-none">🕘</span>
                <span className="hidden sm:inline">最近</span>
                {trips.length > 0 && (
                    <span style={{
                        position: 'absolute', top: 4, right: 4,
                        background: '#2563eb', color: 'white',
                        fontSize: 10, fontWeight: 700,
                        padding: '1px 5px', borderRadius: 99,
                        lineHeight: 1.2, minWidth: 16, textAlign: 'center',
                    }}>{trips.length > 9 ? '9+' : trips.length}</span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    width: 320, maxHeight: 480, overflowY: 'auto',
                    background: 'white', borderRadius: 12,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #e5e7eb',
                    zIndex: 100,
                }}>
                    <div style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>
                            🕘 最近の旅程
                        </p>
                        {trips.length > 0 && (
                            <button
                                type="button"
                                onClick={() => { if (confirm('履歴をすべて削除しますか？')) clear() }}
                                style={{
                                    fontSize: 11, color: '#9ca3af',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                }}
                            >
                                すべて削除
                            </button>
                        )}
                    </div>

                    {trips.length === 0 ? (
                        <div style={{ padding: '28px 20px', textAlign: 'center', color: '#9ca3af' }}>
                            <p style={{ fontSize: 28, margin: '0 0 8px' }}>🗂️</p>
                            <p style={{ fontSize: 12, margin: 0 }}>履歴はまだありません</p>
                            <p style={{ fontSize: 11, margin: '4px 0 0' }}>旅程を作成・閲覧するとここに表示されます</p>
                        </div>
                    ) : (
                        <div>
                            {trips.map(t => {
                                const url = t.role === 'owner' && t.edit_token
                                    ? `/trips/${t.share_id}?edit=${t.edit_token}`
                                    : `/trips/${t.share_id}`
                                return (
                                    <div
                                        key={t.share_id}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '10px 14px',
                                            borderBottom: '1px solid #f3f4f6',
                                        }}
                                    >
                                        <Link
                                            href={url}
                                            onClick={() => setOpen(false)}
                                            style={{
                                                flex: 1, minWidth: 0,
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                textDecoration: 'none', color: 'inherit',
                                            }}
                                        >
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10,
                                                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 18, flexShrink: 0,
                                            }}>{getDestinationEmoji(t.destination)}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{
                                                    fontSize: 13, fontWeight: 600, color: '#111827',
                                                    margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }}>
                                                    {t.title}
                                                </p>
                                                <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>
                                                    {t.destination} · {t.duration_days}日間
                                                    {' · '}
                                                    {t.role === 'owner'
                                                        ? <span style={{ color: '#10b981', fontWeight: 600 }}>✏️ 編集可</span>
                                                        : <span style={{ color: '#9ca3af' }}>👁 閲覧のみ</span>}
                                                </p>
                                            </div>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => remove(t.share_id)}
                                            aria-label="履歴から削除"
                                            style={{
                                                width: 24, height: 24, borderRadius: 6,
                                                border: 'none', background: 'transparent',
                                                color: '#d1d5db', cursor: 'pointer', fontSize: 16,
                                                flexShrink: 0,
                                            }}
                                        >×</button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
