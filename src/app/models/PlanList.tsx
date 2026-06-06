'use client'
import { useEffect, useState } from 'react'
import PlanCard, { type TripBrief } from './PlanCard'

export type SortKey = 'recommended' | 'duration_asc' | 'duration_desc' | 'title'
export type ViewMode = 'grid' | 'list'

type Props = {
    trips: TripBrief[]
    sort: SortKey
    onSortChange: (s: SortKey) => void
    view: ViewMode
    onViewChange: (v: ViewMode) => void
    favoritedIds: Set<string>
    onToggleFavorite: (id: string) => void
    onCardHover?: (key: string | null) => void
    /** 人気バッジを付ける destination のキー集合 */
    popularDests?: Set<string>
}

const SORT_LABEL: Record<SortKey, string> = {
    recommended: 'おすすめ順',
    duration_asc: '日数: 短い順',
    duration_desc: '日数: 長い順',
    title: 'タイトル順',
}

export default function PlanList({
    trips, sort, onSortChange, view, onViewChange,
    favoritedIds, onToggleFavorite, onCardHover, popularDests,
}: Props) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest('[data-sort-menu]')) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    return (
        <div>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 10, flexWrap: 'wrap',
            }}>
                <div style={{ position: 'relative' }} data-sort-menu>
                    <button
                        type="button"
                        onClick={() => setOpen(o => !o)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '7px 12px', borderRadius: 10,
                            border: '1.5px solid #e5e7eb',
                            background: 'white', color: '#0f172a',
                            fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                        aria-haspopup="menu"
                        aria-expanded={open}
                    >
                        <span style={{ color: '#94a3b8', fontWeight: 600 }}>並び替え:</span>
                        {SORT_LABEL[sort]}
                        <span style={{ fontSize: 9, color: '#94a3b8' }}>▼</span>
                    </button>
                    {open && (
                        <div
                            role="menu"
                            style={{
                                position: 'absolute', top: '100%', left: 0, marginTop: 4,
                                background: 'white',
                                border: '1px solid #e5e7eb', borderRadius: 10,
                                boxShadow: '0 8px 20px rgba(15,23,42,0.12)',
                                zIndex: 30, minWidth: 180,
                                overflow: 'hidden',
                            }}
                        >
                            {(Object.keys(SORT_LABEL) as SortKey[]).map(k => (
                                <button
                                    key={k}
                                    role="menuitem"
                                    type="button"
                                    onClick={() => { onSortChange(k); setOpen(false) }}
                                    style={{
                                        display: 'block', width: '100%', textAlign: 'left',
                                        padding: '9px 14px',
                                        background: sort === k ? '#f5f3ff' : 'white',
                                        color: sort === k ? '#6b21a8' : '#0f172a',
                                        border: 'none',
                                        fontSize: 13, fontWeight: sort === k ? 700 : 500,
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => {
                                        if (sort !== k) e.currentTarget.style.background = '#f8fafc'
                                    }}
                                    onMouseLeave={e => {
                                        if (sort !== k) e.currentTarget.style.background = 'white'
                                    }}
                                >{SORT_LABEL[k]}</button>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ flex: 1 }} />
                <div style={{
                    display: 'inline-flex',
                    background: 'rgba(15,23,42,0.04)',
                    borderRadius: 10, padding: 3, gap: 2,
                }}>
                    <ViewBtn active={view === 'grid'} onClick={() => onViewChange('grid')} label="グリッド">
                        <GridIcon />
                    </ViewBtn>
                    <ViewBtn active={view === 'list'} onClick={() => onViewChange('list')} label="リスト">
                        <ListIcon />
                    </ViewBtn>
                </div>
            </div>

            {view === 'grid' ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 14,
                }}>
                    {trips.map(t => (
                        <PlanCard
                            key={t.share_id}
                            trip={t}
                            variant="grid"
                            favorited={favoritedIds.has(t.share_id)}
                            onToggleFavorite={onToggleFavorite}
                            onHover={onCardHover}
                            popular={popularDests?.has(t.destination)}
                        />
                    ))}
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden',
                }}>
                    {trips.map(t => (
                        <PlanCard
                            key={t.share_id}
                            trip={t}
                            variant="list"
                            favorited={favoritedIds.has(t.share_id)}
                            onToggleFavorite={onToggleFavorite}
                            onHover={onCardHover}
                            popular={popularDests?.has(t.destination)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function ViewBtn({ active, onClick, label, children }: {
    active: boolean
    onClick: () => void
    label: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            style={{
                width: 30, height: 28, padding: 0,
                background: active ? 'white' : 'transparent',
                color: active ? '#7c3aed' : '#64748b',
                border: 'none', borderRadius: 7, cursor: 'pointer',
                boxShadow: active ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s',
            }}
        >{children}</button>
    )
}

function GridIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
    )
}

function ListIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    )
}

export function sortTrips(trips: TripBrief[], sort: SortKey, popularity: (dest: string) => number): TripBrief[] {
    const arr = [...trips]
    switch (sort) {
        case 'recommended':
            // 人気（destination 出現件数）の高いもの優先、同点はタイトル
            arr.sort((a, b) => {
                const pa = popularity(a.destination); const pb = popularity(b.destination)
                if (pa !== pb) return pb - pa
                return a.title.localeCompare(b.title, 'ja')
            })
            break
        case 'duration_asc':
            arr.sort((a, b) => a.duration_days - b.duration_days || a.title.localeCompare(b.title, 'ja'))
            break
        case 'duration_desc':
            arr.sort((a, b) => b.duration_days - a.duration_days || a.title.localeCompare(b.title, 'ja'))
            break
        case 'title':
            arr.sort((a, b) => a.title.localeCompare(b.title, 'ja'))
            break
    }
    return arr
}
