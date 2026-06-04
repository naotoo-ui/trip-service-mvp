'use client'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Topology } from 'topojson-specification'

// 簡易マップ：d3-geo + topojson-client で SVG を描画。
// 近接ピンは自動でクラスタリングし、ズームすると個別ピンに分かれる。

type Marker = {
    key: string
    name: string
    coord: [number, number]   // [lng, lat]
    count: number
}

type Props = {
    kind: 'domestic' | 'overseas'
    markers: Marker[]
    selectedKey: string | null
    onSelect: (key: string | null) => void
}

const TOPOJSON_URL: Record<'domestic' | 'overseas', string> = {
    domestic: 'https://cdn.jsdelivr.net/gh/dataofjapan/land@master/japan.topojson',
    overseas: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
}

const PROJECTION_CONFIG: Record<'domestic' | 'overseas', { center: [number, number] }> = {
    domestic: { center: [137.5, 36.5] },
    overseas: { center: [10, 25] },
}

// クラスタリングの基準（screen px ベース、zoom が高いほど閾値が小さくなる）
const CLUSTER_BASE_THRESHOLD = 70  // unzoomed px at zoom=1

export default function MapView({ kind, markers, selectedKey, onSelect }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [containerW, setContainerW] = useState(800)
    const containerH = kind === 'domestic' ? 520 : 440

    const [geos, setGeos] = useState<Feature<Geometry>[] | null>(null)
    const [hoverKey, setHoverKey] = useState<string | null>(null)

    // zoom & pan 状態
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState<[number, number]>([0, 0])
    const dragRef = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null)

    // 配色（kind 別）
    const palette = kind === 'domestic' ? DOMESTIC_PALETTE : OVERSEAS_PALETTE

    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver(entries => {
            for (const e of entries) {
                setContainerW(Math.max(320, Math.round(e.contentRect.width)))
            }
        })
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        let cancelled = false
        setGeos(null)
        fetch(TOPOJSON_URL[kind])
            .then(r => r.json())
            .then((topo: Topology) => {
                if (cancelled) return
                const objects = topo.objects as Record<string, unknown>
                const objKey = objects['japan']
                    ? 'japan'
                    : objects['countries']
                        ? 'countries'
                        : Object.keys(objects)[0]
                const fc = feature(topo, topo.objects[objKey]) as
                    | Feature<Geometry>
                    | FeatureCollection<Geometry>
                const features = 'features' in fc ? fc.features : [fc]
                setGeos(features)
            })
            .catch(() => { /* ignore */ })
        return () => { cancelled = true }
    }, [kind])

    useEffect(() => { setZoom(1); setPan([0, 0]); setHoverKey(null) }, [kind])

    const projection = useMemo<GeoProjection>(() => {
        const cfg = PROJECTION_CONFIG[kind]
        const baseScale = kind === 'domestic'
            ? Math.min(containerW * 1.5, 1400)
            : Math.min(containerW * 0.30, 180)
        return geoMercator()
            .center(cfg.center)
            .scale(baseScale)
            .translate([containerW / 2, containerH / 2])
    }, [kind, containerW, containerH])

    const pathGen = useMemo(() => geoPath(projection), [projection])

    // ピン位置（unzoomed px）
    const placedMarkers = useMemo(() => {
        return markers.map(m => {
            const p = projection(m.coord)
            return p ? { ...m, pixel: p as [number, number] } : null
        }).filter((x): x is Marker & { pixel: [number, number] } => x !== null)
    }, [markers, projection])

    // クラスタリング：zoom に応じて閾値が変動
    // zoom=1: 70px、zoom=4: 35px、zoom=8: 25px 相当（screen）
    const clusters = useMemo(() => {
        // threshold(unzoomed) = base_screen / zoom ÷ √zoom  => screen距離は √zoom に反比例
        const thresholdUnzoomed = CLUSTER_BASE_THRESHOLD / Math.pow(Math.max(0.6, zoom), 1.5)

        const visited = new Set<string>()
        const result: {
            key: string
            members: typeof placedMarkers
            pixel: [number, number]
            count: number
            isMulti: boolean
            displayName: string
        }[] = []

        for (const m of placedMarkers) {
            if (visited.has(m.key)) continue
            visited.add(m.key)
            const group: typeof placedMarkers = [m]

            for (const other of placedMarkers) {
                if (visited.has(other.key)) continue
                const dx = other.pixel[0] - m.pixel[0]
                const dy = other.pixel[1] - m.pixel[1]
                if (Math.sqrt(dx * dx + dy * dy) < thresholdUnzoomed) {
                    group.push(other)
                    visited.add(other.key)
                }
            }

            const cx = group.reduce((s, x) => s + x.pixel[0], 0) / group.length
            const cy = group.reduce((s, x) => s + x.pixel[1], 0) / group.length
            const count = group.reduce((s, x) => s + x.count, 0)
            const isMulti = group.length > 1
            const displayName = !isMulti
                ? group[0].name
                : group.length <= 3
                    ? group.map(g => g.name).join(' ・ ')
                    : `${group.length}エリア（${count}プラン）`

            result.push({
                key: group.map(g => g.key).sort().join('|'),
                members: group,
                pixel: [cx, cy],
                count,
                isMulti,
                displayName,
            })
        }
        return result
    }, [placedMarkers, zoom])

    // ホイールズーム
    const onWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault()
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
        setZoom(z => Math.max(0.6, Math.min(8, z * factor)))
    }, [])

    // ドラッグでパン
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const target = e.currentTarget
        target.setPointerCapture(e.pointerId)
        dragRef.current = { x: e.clientX, y: e.clientY, px: pan[0], py: pan[1], moved: false }
    }, [pan])

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragRef.current) return
        const dx = e.clientX - dragRef.current.x
        const dy = e.clientY - dragRef.current.y
        if (Math.abs(dx) + Math.abs(dy) > 3) dragRef.current.moved = true
        setPan([dragRef.current.px + dx, dragRef.current.py + dy])
    }, [])

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId)
        dragRef.current = null
    }, [])

    const resetView = () => { setZoom(1); setPan([0, 0]) }

    function pinRadius(count: number): number {
        if (count >= 30) return 14
        if (count >= 15) return 12
        if (count >= 8) return 10
        if (count >= 3) return 8
        return 6
    }

    function handleClusterClick(c: (typeof clusters)[number]) {
        // ドラッグ中だったクリックは無視
        if (dragRef.current?.moved) return
        if (!c.isMulti) {
            const single = c.members[0]
            onSelect(single.key === selectedKey ? null : single.key)
        } else {
            // ズームインして cluster 中心にパン
            const newZoom = Math.min(8, zoom * 1.8)
            setZoom(newZoom)
            setPan([
                -(c.pixel[0] - containerW / 2) * newZoom,
                -(c.pixel[1] - containerH / 2) * newZoom,
            ])
        }
    }

    const transformStyle = `translate(${pan[0]}px, ${pan[1]}px) scale(${zoom})`

    // 各 cluster が selectedKey を含むか
    function clusterContainsSelected(c: (typeof clusters)[number]): boolean {
        if (!selectedKey) return false
        return c.members.some(m => m.key === selectedKey)
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                background: palette.containerBg,
                borderRadius: 16,
                border: `1px solid ${palette.containerBorder}`,
                overflow: 'hidden',
                touchAction: 'none',
                cursor: dragRef.current ? 'grabbing' : 'grab',
                boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
            }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* ズームコントロール */}
            <div style={{
                position: 'absolute', top: 12, right: 12, zIndex: 5,
                display: 'flex', flexDirection: 'column', gap: 4,
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                borderRadius: 10, padding: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
                <button
                    type="button"
                    onClick={() => setZoom(z => Math.min(8, z * 1.4))}
                    title="拡大"
                    style={ctrlButtonStyle}
                >＋</button>
                <button
                    type="button"
                    onClick={() => setZoom(z => Math.max(0.6, z / 1.4))}
                    title="縮小"
                    style={ctrlButtonStyle}
                >−</button>
                <button
                    type="button"
                    onClick={resetView}
                    title="表示をリセット"
                    style={{ ...ctrlButtonStyle, fontSize: 11 }}
                >⌂</button>
            </div>

            {/* ヘッダー情報 */}
            <div style={{
                position: 'absolute', top: 12, left: 12, zIndex: 5,
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                borderRadius: 10, padding: '8px 12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontSize: 11, fontWeight: 600, color: '#475569',
                letterSpacing: '0.04em',
            }}>
                {kind === 'domestic' ? '🇯🇵 JAPAN' : '🌏 WORLD'} ・ {markers.length} エリア
            </div>

            <svg
                viewBox={`0 0 ${containerW} ${containerH}`}
                width={containerW}
                height={containerH}
                style={{ display: 'block', userSelect: 'none' }}
            >
                <defs>
                    {/* 海/背景のグラデーション */}
                    <linearGradient id={`ocean-${kind}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={palette.oceanTop} />
                        <stop offset="100%" stopColor={palette.oceanBottom} />
                    </linearGradient>
                    {/* 陸地のグラデーション */}
                    <linearGradient id={`land-${kind}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={palette.landTop} />
                        <stop offset="100%" stopColor={palette.landBottom} />
                    </linearGradient>
                    {/* ピンのグラデーション */}
                    <radialGradient id={`pin-single`} cx="0.35" cy="0.35" r="0.7">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                    </radialGradient>
                    <radialGradient id={`pin-multi`} cx="0.35" cy="0.35" r="0.7">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </radialGradient>
                    <radialGradient id={`pin-selected`} cx="0.35" cy="0.35" r="0.7">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#ea580c" />
                    </radialGradient>
                </defs>

                {/* 海/背景 */}
                <rect width="100%" height="100%" fill={`url(#ocean-${kind})`} />

                <g
                    style={{
                        transform: transformStyle,
                        transformOrigin: `${containerW / 2}px ${containerH / 2}px`,
                    }}
                >
                    {/* 陸地 */}
                    {geos && geos.map((f, i) => {
                        const d = pathGen(f) ?? ''
                        if (!d) return null
                        return (
                            <path
                                key={i}
                                d={d}
                                fill={`url(#land-${kind})`}
                                stroke={palette.landStroke}
                                strokeWidth={0.8 / Math.max(1, zoom)}
                                strokeLinejoin="round"
                                style={{ pointerEvents: 'none' }}
                            />
                        )
                    })}

                    {/* ピン（クラスタ） */}
                    {clusters.map(c => {
                        const isSelected = clusterContainsSelected(c)
                        const isHover = c.key === hoverKey
                        const baseR = pinRadius(c.count)
                        const zoomScale = Math.max(1, Math.pow(zoom, 0.4))
                        const r = baseR / zoomScale
                        const expand = isSelected ? 1.55 : isHover ? 1.25 : 1
                        const gradId = isSelected ? 'pin-selected' : c.isMulti ? 'pin-multi' : 'pin-single'
                        const ringColor = isSelected ? '#ea580c' : c.isMulti ? '#7c3aed' : '#2563eb'

                        return (
                            <g
                                key={c.key}
                                transform={`translate(${c.pixel[0]}, ${c.pixel[1]})`}
                                onPointerDown={e => { e.stopPropagation() }}
                                onClick={e => {
                                    e.stopPropagation()
                                    handleClusterClick(c)
                                }}
                                onMouseEnter={() => setHoverKey(c.key)}
                                onMouseLeave={() => setHoverKey(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                {(isSelected || isHover) && (
                                    <circle
                                        r={r * 2.2}
                                        fill={ringColor}
                                        opacity={0.16}
                                    />
                                )}
                                {/* 外側リング（multi クラスタは二重） */}
                                {c.isMulti && (
                                    <circle
                                        r={r * expand + 2 / zoomScale}
                                        fill="none"
                                        stroke={ringColor}
                                        strokeWidth={1.5 / zoomScale}
                                        opacity={0.55}
                                    />
                                )}
                                <circle
                                    r={r * expand}
                                    fill={`url(#${gradId})`}
                                    stroke="#ffffff"
                                    strokeWidth={1.8 / zoomScale}
                                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.28))', transition: 'r 0.18s' }}
                                />
                                <text
                                    x={0}
                                    y={1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={Math.max(7, r * expand * 0.95)}
                                    fontWeight={800}
                                    fill="#ffffff"
                                    style={{ pointerEvents: 'none' }}
                                >{c.count}</text>
                            </g>
                        )
                    })}

                    {/* ホバー/選択時ラベル */}
                    {clusters.filter(c => c.key === hoverKey || clusterContainsSelected(c)).map(c => (
                        <g key={`label-${c.key}`} transform={`translate(${c.pixel[0]}, ${c.pixel[1] - pinRadius(c.count) - 6})`}>
                            <text
                                textAnchor="middle"
                                fontSize={Math.max(10, 12 / Math.pow(zoom, 0.35))}
                                fontWeight={700}
                                fill="#0f172a"
                                stroke="#ffffff"
                                strokeWidth={4 / Math.max(1, Math.pow(zoom, 0.5))}
                                paintOrder="stroke"
                                style={{ pointerEvents: 'none' }}
                            >{c.displayName}</text>
                        </g>
                    ))}
                </g>
            </svg>

            {!geos && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', fontSize: 13, pointerEvents: 'none',
                }}>地図を読み込み中…</div>
            )}

            <div style={{
                position: 'absolute', bottom: 10, right: 12, zIndex: 5,
                fontSize: 10, color: 'rgba(15,23,42,0.5)',
                background: 'rgba(255,255,255,0.7)',
                padding: '4px 8px', borderRadius: 6,
            }}>ドラッグ・ホイールで操作 / クラスタクリックでズーム</div>
        </div>
    )
}

const ctrlButtonStyle: React.CSSProperties = {
    width: 32, height: 32, padding: 0,
    border: 'none', background: 'transparent',
    color: '#0f172a',
    fontSize: 18, fontWeight: 700,
    cursor: 'pointer', borderRadius: 6,
}

// ──────────── 配色パレット ────────────
type Palette = {
    containerBg: string
    containerBorder: string
    oceanTop: string
    oceanBottom: string
    landTop: string
    landBottom: string
    landStroke: string
}

const DOMESTIC_PALETTE: Palette = {
    containerBg: 'linear-gradient(180deg, #f5ecd2 0%, #d7e6e9 100%)',
    containerBorder: 'rgba(170,140,90,0.18)',
    oceanTop: '#dbe7ee',
    oceanBottom: '#bcd0db',
    landTop: '#fff8e7',
    landBottom: '#f3e3b7',
    landStroke: '#b89762',
}

const OVERSEAS_PALETTE: Palette = {
    containerBg: 'linear-gradient(180deg, #d5e6f0 0%, #aac1d4 100%)',
    containerBorder: 'rgba(80,110,140,0.20)',
    oceanTop: '#c5dae8',
    oceanBottom: '#94b3ca',
    landTop: '#fbf2d4',
    landBottom: '#e8d49a',
    landStroke: '#a07d3a',
}
