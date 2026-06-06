'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getDestinationEmoji } from '@/lib/destinationEmoji'
import { getCoordsForDestination } from '@/lib/destinationCoords'
import MapView from './MapView'
import PlanFilters, { EMPTY_FILTER, tripMatchesFilter, type FilterState, type ThemeFilter } from './PlanFilters'
import PlanList, { sortTrips, type SortKey, type ViewMode } from './PlanList'
import QuickThemes from './QuickThemes'
import PopularDestinations from './PopularDestinations'
import { useFavorites } from './useFavorites'
import type { TripBrief } from './PlanCard'

type Props = { trips: TripBrief[] }
type TabKind = 'domestic' | 'overseas'

const EMPTY_SET: Set<string> = new Set()

export default function MapModelsView({ trips }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // 初期状態を URL から復元
    const initialTab: TabKind = searchParams.get('tab') === 'overseas' ? 'overseas' : 'domestic'
    const initialTheme = searchParams.get('theme')
    const initialView: ViewMode = searchParams.get('view') === 'list' ? 'list' : 'grid'
    const initialSort: SortKey = (() => {
        const s = searchParams.get('sort')
        if (s === 'duration_asc' || s === 'duration_desc' || s === 'title' || s === 'recommended') return s
        return 'recommended'
    })()
    const initialQ = searchParams.get('q') ?? ''
    const initialDest = searchParams.get('dest')

    const [tab, setTab] = useState<TabKind>(initialTab)
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
        initialDest ? new Set([initialDest]) : EMPTY_SET
    )
    const [keyword, setKeyword] = useState(initialQ)
    const [visibleCount, setVisibleCount] = useState(60)
    const [filter, setFilter] = useState<FilterState>(() => {
        if (initialTheme && /^(sg|gm|np|on|hs|cp|fm|wh|bc|cherry|autumn)$/.test(initialTheme)) {
            return { ...EMPTY_FILTER, themes: new Set([initialTheme as ThemeFilter]) }
        }
        return EMPTY_FILTER
    })
    const [sort, setSort] = useState<SortKey>(initialSort)
    const [view, setView] = useState<ViewMode>(initialView)
    const [hoverKey, setHoverKey] = useState<string | null>(null)
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [shareToast, setShareToast] = useState<string | null>(null)

    const { has: isFavorited, toggle: toggleFavorite, favorites } = useFavorites()

    async function handleShare() {
        if (typeof window === 'undefined') return
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            setShareToast('現在の条件のリンクをコピーしました')
        } catch {
            setShareToast('リンクのコピーに失敗しました')
        }
        setTimeout(() => setShareToast(null), 2400)
    }

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 600)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // キーボードショートカット: / で検索フォーカス、g/l でビュー切替、Esc で解除
    useEffect(() => {
        function isTyping(): boolean {
            const a = document.activeElement
            if (!a) return false
            const tag = a.tagName
            return tag === 'INPUT' || tag === 'TEXTAREA' || (a as HTMLElement).isContentEditable
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === '/' && !isTyping()) {
                e.preventDefault()
                const el = document.querySelector<HTMLInputElement>('input[type="search"]')
                el?.focus()
                return
            }
            if (isTyping()) return
            if (e.key === 'g') setView('grid')
            else if (e.key === 'l') setView('list')
            else if (e.key === 'Escape') {
                setSelectedKeys(EMPTY_SET)
                setMobileFilterOpen(false)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    // localStorage から view 設定を復元（URL 優先・URL なしの場合のみ localStorage）
    useEffect(() => {
        if (searchParams.get('view')) return
        const v = typeof window !== 'undefined' ? window.localStorage.getItem('tripservice.models.view') : null
        if (v === 'grid' || v === 'list') setView(v)
    }, [searchParams])
    useEffect(() => {
        if (typeof window !== 'undefined') window.localStorage.setItem('tripservice.models.view', view)
    }, [view])

    // URL クエリへ書き戻し（共有可能リンク）
    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const params = new URLSearchParams()
        if (tab !== 'domestic') params.set('tab', tab)
        if (filter.themes.size === 1) params.set('theme', Array.from(filter.themes)[0])
        if (view !== 'grid') params.set('view', view)
        if (sort !== 'recommended') params.set('sort', sort)
        if (keyword.trim()) params.set('q', keyword.trim())
        if (selectedKeys.size === 1) params.set('dest', Array.from(selectedKeys)[0])
        const qs = params.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, [tab, filter.themes, view, sort, keyword, selectedKeys, router, pathname])

    const { tripsByKey, destMetaByKey, popularityByDest } = useMemo(() => {
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
        const tripsByKey = new Map<string, TripBrief[]>()
        const destMetaByKey = new Map<string, { name: string; coord: [number, number]; isOverseas: boolean }>()
        const popularityByDest = new Map<string, number>()
        for (const [key, g] of groups.entries()) {
            tripsByKey.set(key, g.trips)
            destMetaByKey.set(key, { name: g.name, coord: g.coord, isOverseas: g.isOverseas })
            popularityByDest.set(key, g.trips.length)
        }
        return { tripsByKey, destMetaByKey, popularityByDest }
    }, [trips])

    // チップフィルタ（テーマ・日数・出発地）はマップにも一覧にも反映する。
    // selectedKeys と keyword は一覧側のみに影響。
    const hasChipFilter = filter.themes.size + filter.durations.size + filter.origins.size > 0
    const { domesticMarkers, overseasMarkers } = useMemo(() => {
        const domesticMarkers: { key: string; name: string; coord: [number, number]; count: number }[] = []
        const overseasMarkers: { key: string; name: string; coord: [number, number]; count: number }[] = []
        for (const [key, list] of tripsByKey.entries()) {
            const meta = destMetaByKey.get(key)
            if (!meta) continue
            let matched = hasChipFilter
                ? list.filter(t => tripMatchesFilter({
                    title: t.title, wishes: t.wishes,
                    duration_days: t.duration_days, filter,
                }))
                : list
            if (showFavoritesOnly) matched = matched.filter(t => isFavorited(t.share_id))
            if (matched.length === 0) continue
            const m = { key, name: meta.name, coord: meta.coord, count: matched.length }
            if (meta.isOverseas) overseasMarkers.push(m); else domesticMarkers.push(m)
        }
        return { domesticMarkers, overseasMarkers }
    }, [tripsByKey, destMetaByKey, filter, hasChipFilter, showFavoritesOnly, isFavorited])

    const currentMarkers = tab === 'domestic' ? domesticMarkers : overseasMarkers

    // 人気目的地（現在のタブ・フィルター適用後のマーカーからトップ8）
    const popularItems = useMemo(() => {
        return [...currentMarkers]
            .sort((a, b) => b.count - a.count)
            .slice(0, 8)
            .map(m => ({ key: m.key, name: m.name, count: m.count }))
    }, [currentMarkers])

    // 人気バッジ対象（全 trips のうち、出現件数トップ6 の destination）
    const popularDests = useMemo(() => {
        const sorted = Array.from(popularityByDest.entries()).sort((a, b) => b[1] - a[1])
        return new Set(sorted.slice(0, 6).map(x => x[0]))
    }, [popularityByDest])

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
        if (hasChipFilter) {
            pool = pool.filter(t => tripMatchesFilter({
                title: t.title, wishes: t.wishes,
                duration_days: t.duration_days, filter,
            }))
        }
        if (showFavoritesOnly) {
            pool = pool.filter(t => isFavorited(t.share_id))
        }
        if (keyword.trim()) {
            const k = keyword.trim().toLowerCase()
            pool = pool.filter(t =>
                t.title?.toLowerCase().includes(k) ||
                t.wishes?.toLowerCase().includes(k) ||
                t.destination?.toLowerCase().includes(k)
            )
        }
        return sortTrips(pool, sort, dest => popularityByDest.get(dest) ?? 0)
    }, [
        selectedKeys, tripsByKey, currentMarkers, trips, keyword, filter, hasChipFilter,
        sort, popularityByDest, showFavoritesOnly, isFavorited,
    ])

    const visibleTrips = filteredTrips.slice(0, visibleCount)

    function changeTab(t: TabKind) {
        setTab(t)
        setSelectedKeys(EMPTY_SET)
        setVisibleCount(60)
        setFilter(EMPTY_FILTER)
        setHoverKey(null)
    }

    function handleSelectKeys(keys: Set<string>) {
        setSelectedKeys(keys)
        setVisibleCount(60)
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

    // クイックテーマ：シングル選択（既存の filter.themes は同期）
    const quickActiveTheme: ThemeFilter | null = filter.themes.size === 1
        ? (Array.from(filter.themes)[0] as ThemeFilter)
        : null
    function pickQuickTheme(t: ThemeFilter | null) {
        if (t === null) {
            setFilter({ ...filter, themes: new Set() })
        } else {
            setFilter({ ...filter, themes: new Set([t]) })
        }
        setVisibleCount(60)
    }

    const selectedArr = Array.from(selectedKeys)

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 80px' }}>
            {/* ヒーロー */}
            <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                borderRadius: 20, padding: '28px 26px 24px', color: 'white',
                marginBottom: 14, position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -60, right: -40,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                            textTransform: 'uppercase', color: '#fce7f3', margin: '0 0 8px',
                        }}>Curated Model Plans</p>
                        <h1 style={{
                            fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800,
                            lineHeight: 1.2, margin: '0 0 6px',
                        }}>あなたの次の旅、ここから始めよう</h1>
                        <p style={{ fontSize: 13, color: '#fce7f3', margin: 0, maxWidth: 600 }}>
                            {trips.length} の厳選プランから、地図・テーマ・日数で理想の旅を見つける。
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleShare}
                        aria-label="現在の条件のリンクを共有"
                        style={{
                            flexShrink: 0,
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.18)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '7px 13px',
                            borderRadius: 99,
                            fontSize: 12, fontWeight: 700,
                            cursor: 'pointer',
                            backdropFilter: 'blur(8px)',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        シェア
                    </button>
                </div>
            </div>

            {/* クイックテーマ */}
            <QuickThemes
                activeTheme={quickActiveTheme}
                favCount={favorites.size}
                showFavoritesOnly={showFavoritesOnly}
                onPickTheme={pickQuickTheme}
                onToggleFavorites={() => { setShowFavoritesOnly(v => !v); setVisibleCount(60) }}
            />

            {/* タブ */}
            <div style={{
                display: 'flex', gap: 4, marginTop: 8, marginBottom: 14,
                background: 'rgba(15,23,42,0.04)', borderRadius: 12, padding: 4,
                width: 'fit-content',
            }}>
                <TabButton active={tab === 'domestic'} onClick={() => changeTab('domestic')}>
                    🇯🇵 国内
                    <TabCountBadge active={tab === 'domestic'}>{domesticMarkers.length}</TabCountBadge>
                </TabButton>
                <TabButton active={tab === 'overseas'} onClick={() => changeTab('overseas')}>
                    🌏 海外
                    <TabCountBadge active={tab === 'overseas'}>{overseasMarkers.length}</TabCountBadge>
                </TabButton>
            </div>

            {/* 人気目的地ショートカット */}
            <PopularDestinations
                title={tab === 'domestic' ? '人気の国内エリア' : '人気の海外エリア'}
                items={popularItems}
                selectedKey={selectedKeys.size === 1 ? Array.from(selectedKeys)[0] : null}
                onPick={key => handleSelectKeys(new Set([key]))}
                onHover={setHoverKey}
            />

            {/* 地図（左）＋フィルタ（右）の2カラム。狭幅では縦積み */}
            <div className="map-row">
                <div style={{ minWidth: 0, flex: 1 }}>
                    <MapView
                        kind={tab}
                        markers={currentMarkers}
                        selectedKeys={selectedKeys}
                        onSelectKeys={handleSelectKeys}
                        externalHoverKey={hoverKey}
                        onMarkerHover={setHoverKey}
                    />
                </div>
                <aside className="filter-side">
                    <PlanFilters filter={filter} onChange={f => { setFilter(f); setVisibleCount(60) }} />
                </aside>
            </div>

            {/* モバイル用フィルタトリガー（地図と一覧の間） */}
            <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="mobile-filter-trigger"
                aria-label="絞り込みを開く"
            >
                <FilterIcon /> 詳細フィルタ
                {hasChipFilter && (
                    <span style={{
                        background: '#7c3aed', color: 'white',
                        padding: '1px 7px', borderRadius: 99,
                        fontSize: 10, fontWeight: 800, marginLeft: 6,
                    }}>{filter.themes.size + filter.durations.size + filter.origins.size}</span>
                )}
            </button>

            <div id="plans-section" className="plans-status" style={{
                marginTop: 16, marginBottom: 12,
                display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
                position: 'sticky', top: 8, zIndex: 30,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(10px)',
                padding: '10px 12px',
                borderRadius: 14,
                border: '1px solid rgba(15,23,42,0.06)',
                boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
            }}>
                {(hasChipFilter || keyword || showFavoritesOnly || selectedKeys.size > 0) && (
                    <button
                        type="button"
                        onClick={() => {
                            setFilter(EMPTY_FILTER)
                            setKeyword('')
                            setSelectedKeys(EMPTY_SET)
                            setShowFavoritesOnly(false)
                        }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            background: 'transparent',
                            color: '#6b7280',
                            border: '1px dashed #cbd5e1',
                            padding: '5px 11px',
                            borderRadius: 99,
                            fontSize: 11, fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >× 全条件解除</button>
                )}
                {selectedKeys.size > 0 ? (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #fff7ed, #ffe4e6)',
                        color: '#9a3412',
                        border: '1px solid #fed7aa',
                        padding: '7px 14px',
                        borderRadius: 999,
                        fontSize: 13, fontWeight: 700,
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
                <div style={{ position: 'relative', minWidth: 220, flex: '1 0 220px', maxWidth: 320 }}>
                    <input
                        type="search"
                        value={keyword}
                        onChange={e => { setKeyword(e.target.value); setVisibleCount(60) }}
                        placeholder="🔎 キーワード検索  (/ でフォーカス)"
                        style={{
                            width: '100%',
                            padding: '9px 36px 9px 14px', borderRadius: 10,
                            border: '1.5px solid #e5e7eb', fontSize: 13,
                            outline: 'none', background: 'white',
                            boxSizing: 'border-box',
                        }}
                    />
                    {keyword && (
                        <button
                            type="button"
                            onClick={() => setKeyword('')}
                            aria-label="検索クリア"
                            style={{
                                position: 'absolute', right: 8, top: '50%',
                                transform: 'translateY(-50%)',
                                width: 22, height: 22, borderRadius: 99,
                                background: '#e5e7eb', color: '#475569',
                                border: 'none', cursor: 'pointer',
                                fontSize: 13, lineHeight: 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >×</button>
                    )}
                </div>
            </div>

            {filteredTrips.length === 0 ? (
                <EmptyState
                    onReset={() => {
                        setFilter(EMPTY_FILTER)
                        setKeyword('')
                        setSelectedKeys(EMPTY_SET)
                        setShowFavoritesOnly(false)
                    }}
                    showFavoritesOnly={showFavoritesOnly}
                />
            ) : (
                <PlanList
                    trips={visibleTrips}
                    sort={sort}
                    onSortChange={s => { setSort(s); setVisibleCount(60) }}
                    view={view}
                    onViewChange={setView}
                    favoritedIds={favorites}
                    onToggleFavorite={toggleFavorite}
                    onCardHover={setHoverKey}
                    popularDests={popularDests}
                />
            )}

            {visibleCount < filteredTrips.length && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <button
                        type="button"
                        onClick={() => setVisibleCount(c => c + 60)}
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

            {/* シェア完了トースト */}
            {shareToast && (
                <div className="share-toast" role="status">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {shareToast}
                </div>
            )}

            {/* スクロールトップ */}
            {showScrollTop && (
                <button
                    type="button"
                    aria-label="ページ上部へ"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="scroll-top-btn"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
            )}

            {/* モバイル: フィルタ Drawer */}
            {mobileFilterOpen && (
                <div className="mobile-drawer-backdrop" onClick={() => setMobileFilterOpen(false)}>
                    <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 16px 8px',
                        }}>
                            <strong style={{ fontSize: 15 }}>絞り込み</strong>
                            <button
                                type="button"
                                onClick={() => setMobileFilterOpen(false)}
                                aria-label="閉じる"
                                style={{
                                    width: 28, height: 28,
                                    border: 'none', background: 'transparent',
                                    cursor: 'pointer', fontSize: 20, color: '#475569',
                                }}
                            >×</button>
                        </div>
                        <div style={{ padding: '0 12px 16px', maxHeight: '70vh', overflowY: 'auto' }}>
                            <PlanFilters filter={filter} onChange={f => { setFilter(f); setVisibleCount(60) }} />
                            <button
                                type="button"
                                onClick={() => setMobileFilterOpen(false)}
                                style={{
                                    marginTop: 8, width: '100%',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                                    color: 'white', border: 'none',
                                    borderRadius: 10, fontSize: 14, fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >この条件で表示（{filteredTrips.length}件）</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .map-row {
                    display: flex;
                    gap: 14px;
                    align-items: stretch;
                }
                .filter-side {
                    width: 260px;
                    flex-shrink: 0;
                }
                .mobile-filter-trigger {
                    display: none;
                    align-items: center; gap: 6px;
                    padding: 9px 16px;
                    background: white;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 13px; font-weight: 700;
                    color: #0f172a;
                    cursor: pointer;
                    margin-top: 12px;
                }
                @media (max-width: 900px) {
                    .map-row { flex-direction: column; }
                    .filter-side { display: none; }
                    .mobile-filter-trigger { display: inline-flex; }
                }
                .mobile-drawer-backdrop {
                    position: fixed; inset: 0; z-index: 200;
                    background: rgba(15,23,42,0.45);
                    display: flex; align-items: flex-end; justify-content: center;
                    animation: fade-in 0.18s ease-out;
                }
                .mobile-drawer {
                    width: 100%; max-width: 520px;
                    background: white;
                    border-radius: 18px 18px 0 0;
                    animation: slide-up 0.22s ease-out;
                    max-height: 84vh; overflow: hidden;
                    display: flex; flex-direction: column;
                }
                .share-toast {
                    position: fixed;
                    left: 50%; bottom: 24px;
                    transform: translateX(-50%);
                    background: #0f172a;
                    color: white;
                    padding: 10px 18px;
                    border-radius: 99px;
                    font-size: 13px; font-weight: 700;
                    box-shadow: 0 10px 24px rgba(15,23,42,0.32);
                    display: inline-flex; align-items: center; gap: 8px;
                    z-index: 60;
                    animation: toast-pop 0.22s ease-out;
                }
                @keyframes toast-pop {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .scroll-top-btn {
                    position: fixed;
                    right: 20px; bottom: 24px;
                    width: 44px; height: 44px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                    color: white;
                    box-shadow: 0 6px 20px rgba(124,58,237,0.32);
                    cursor: pointer;
                    z-index: 50;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.18s, box-shadow 0.18s;
                    animation: pop-in 0.22s ease-out;
                }
                .scroll-top-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 26px rgba(124,58,237,0.38);
                }
                @keyframes pop-in {
                    from { opacity: 0; transform: scale(0.7); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slide-up { from { transform: translateY(100%) } to { transform: translateY(0) } }
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
                display: 'inline-flex', alignItems: 'center', gap: 6,
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

function TabCountBadge({ active, children }: { active: boolean; children: React.ReactNode }) {
    return (
        <span style={{
            padding: '1px 7px',
            borderRadius: 99,
            background: active ? '#ede9fe' : 'rgba(15,23,42,0.06)',
            color: active ? '#6b21a8' : '#64748b',
            fontSize: 11, fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
        }}>{children}</span>
    )
}

function EmptyState({ onReset, showFavoritesOnly }: { onReset: () => void; showFavoritesOnly: boolean }) {
    return (
        <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'white', borderRadius: 16,
            border: '1px dashed #e5e7eb', color: '#9ca3af',
        }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>{showFavoritesOnly ? '♥' : '🗺️'}</p>
            <p style={{ fontSize: 14, color: '#0f172a', margin: '0 0 6px', fontWeight: 700 }}>
                {showFavoritesOnly ? 'お気に入りプランがまだありません' : '条件に一致するプランがありません'}
            </p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px' }}>
                {showFavoritesOnly
                    ? 'カードのハートマークを押すと、ここに保存されます。'
                    : 'フィルタを少し緩めるか、別のテーマを試してみてください。'}
            </p>
            <button
                type="button"
                onClick={onReset}
                style={{
                    padding: '8px 18px',
                    background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                    color: 'white', border: 'none',
                    borderRadius: 10, fontSize: 13, fontWeight: 700,
                    cursor: 'pointer',
                }}
            >条件をリセット</button>
        </div>
    )
}

function FilterIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}
