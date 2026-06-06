'use client'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Topology } from 'topojson-specification'

// d3-geo + topojson-client で SVG 地図を描画。
// 近接ピンは自動でクラスタリング。ピンをクリックすると下のプラン一覧をフィルタ。

type Marker = {
    key: string
    name: string
    coord: [number, number]
    count: number
}

type Props = {
    kind: 'domestic' | 'overseas'
    markers: Marker[]
    selectedKeys: Set<string>
    onSelectKeys: (keys: Set<string>) => void
    // 外部からホバーされた destination キー（カード ↔ 地図 連動）
    externalHoverKey?: string | null
    onMarkerHover?: (key: string | null) => void
}

const TOPOJSON_URL: Record<'domestic' | 'overseas', string> = {
    domestic: 'https://cdn.jsdelivr.net/gh/dataofjapan/land@master/japan.topojson',
    overseas: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
}

const PROJECTION_CONFIG: Record<'domestic' | 'overseas', { center: [number, number] }> = {
    domestic: { center: [137.5, 37.5] },
    overseas: { center: [10, 25] },
}

// クラスタリング基準（unzoomed px ベース）。値が小さいほど細かい区分。
const CLUSTER_BASE_THRESHOLD = 45

export default function MapView({ kind, markers, selectedKeys, onSelectKeys, externalHoverKey, onMarkerHover }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [containerW, setContainerW] = useState(800)
    const containerH = kind === 'domestic' ? 580 : 480

    const [geos, setGeos] = useState<Feature<Geometry>[] | null>(null)
    const [hoverKey, setHoverKey] = useState<string | null>(null)

    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState<[number, number]>([0, 0])
    const dragRef = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null)

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
        // 国内: ゆとりを持たせて全島が収まる scale
        const baseScale = kind === 'domestic'
            ? Math.min(containerW * 1.35, 1100)
            : Math.min(containerW * 0.38, 220)
        return geoMercator()
            .center(cfg.center)
            .scale(baseScale)
            .translate([containerW / 2, containerH / 2])
    }, [kind, containerW, containerH])

    const pathGen = useMemo(() => geoPath(projection), [projection])

    const placedMarkers = useMemo(() => {
        return markers.map(m => {
            const p = projection(m.coord)
            return p ? { ...m, pixel: p as [number, number] } : null
        }).filter((x): x is Marker & { pixel: [number, number] } => x !== null)
    }, [markers, projection])

    // クラスタリング
    const clusters = useMemo(() => {
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
                    ? group.map(g => g.name).join('・')
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

    // wheel イベントは passive にできるよう useEffect で手動 addEventListener する。
    // - Cmd/Ctrl 押下時、または trackpad pinch（ブラウザが ctrlKey を立てる）時のみズーム
    // - 通常のスクロールはページに任せる（preventDefault しない）
    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        function onWheelNative(e: WheelEvent) {
            const wantZoom = e.metaKey || e.ctrlKey
            if (!wantZoom) return  // 通常スクロールは妨げない
            e.preventDefault()
            if (Math.abs(e.deltaY) < 0.5) return
            const normalized = Math.sign(e.deltaY) * Math.min(1, Math.abs(e.deltaY) / 100)
            const factor = Math.exp(-normalized * 0.25)
            setZoom(z => Math.max(0.6, Math.min(8, z * factor)))
        }
        // passive: false を明示しないと preventDefault できない
        el.addEventListener('wheel', onWheelNative, { passive: false })
        return () => el.removeEventListener('wheel', onWheelNative)
    }, [])

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

    // ピン半径：強弱を抑えた範囲（7-10）
    function pinRadius(count: number): number {
        if (count >= 50) return 10
        if (count >= 20) return 9
        if (count >= 5) return 8
        return 7
    }

    function clusterContainsSelected(c: (typeof clusters)[number]): boolean {
        if (selectedKeys.size === 0) return false
        return c.members.some(m => selectedKeys.has(m.key))
    }

    function clusterContainsExternalHover(c: (typeof clusters)[number]): boolean {
        if (!externalHoverKey) return false
        return c.members.some(m => m.key === externalHoverKey)
    }

    function handleClusterClick(c: (typeof clusters)[number]) {
        if (dragRef.current?.moved) return
        const memberKeys = c.members.map(m => m.key)
        const allSelected = memberKeys.length === selectedKeys.size
            && memberKeys.every(k => selectedKeys.has(k))
        if (allSelected) {
            onSelectKeys(new Set())  // 同じクラスタを再クリックで解除
            return
        }
        onSelectKeys(new Set(memberKeys))  // クラスタ内全部を選択（青も紫も同じ）

        // 多数エリアクラスタなら、そのエリアにスムーズズーム
        // 単一ピンでは pan/zoom は変更しない（リスト側の反応で十分）
        if (c.members.length >= 3) {
            const targetZoom = c.members.length > 8 ? 2.4 : 2.0
            // クラスタ中心を中央に持っていくための pan を計算
            // 画面中央: (containerW/2, containerH/2)
            // クラスタの unzoomed 座標: c.pixel
            // 描画は外側 <g> で translate(pan) → scale(zoom)（origin=中央）
            // 中央に来る条件: (cx - cW/2) * z + cW/2 + panX = cW/2  →  panX = -(cx-cW/2)*z
            const px = -(c.pixel[0] - containerW / 2) * targetZoom
            const py = -(c.pixel[1] - containerH / 2) * targetZoom
            // 簡易アニメーション（rAF・8 frame）
            const startZoom = zoom
            const startPan = pan
            const dz = targetZoom - startZoom
            const dx = px - startPan[0]
            const dy = py - startPan[1]
            const TOTAL = 14
            let frame = 0
            const step = () => {
                frame++
                const t = Math.min(1, frame / TOTAL)
                // easeOutCubic
                const e = 1 - Math.pow(1 - t, 3)
                setZoom(startZoom + dz * e)
                setPan([startPan[0] + dx * e, startPan[1] + dy * e])
                if (frame < TOTAL) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
        }
    }

    const transformStyle = `translate(${pan[0]}px, ${pan[1]}px) scale(${zoom})`

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
                <button type="button" onClick={() => setZoom(z => Math.min(8, z * 1.3))} title="拡大" style={ctrlButtonStyle}>＋</button>
                <button type="button" onClick={() => setZoom(z => Math.max(0.6, z / 1.3))} title="縮小" style={ctrlButtonStyle}>−</button>
                <button type="button" onClick={resetView} title="表示をリセット" style={{ ...ctrlButtonStyle, fontSize: 11 }}>⌂</button>
            </div>

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
                    <linearGradient id={`ocean-${kind}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={palette.oceanTop} />
                        <stop offset="100%" stopColor={palette.oceanBottom} />
                    </linearGradient>
                    <linearGradient id={`land-${kind}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={palette.landTop} />
                        <stop offset="100%" stopColor={palette.landBottom} />
                    </linearGradient>
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
                        const isExternalHover = clusterContainsExternalHover(c)
                        const isHover = c.key === hoverKey || isExternalHover
                        const baseR = pinRadius(c.count)
                        // ズーム時にピンが大きくなりすぎないよう抑える（screen size はほぼ一定）
                        const sizeScale = Math.pow(Math.max(0.6, zoom), 0.85)
                        const r = baseR / sizeScale
                        const expand = isSelected ? 1.35 : isHover ? 1.18 : 1
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
                                onMouseEnter={() => {
                                    setHoverKey(c.key)
                                    onMarkerHover?.(c.members[0]?.key ?? null)
                                }}
                                onMouseLeave={() => {
                                    setHoverKey(null)
                                    onMarkerHover?.(null)
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                {(isSelected || isHover) && (
                                    <circle r={r * 2.0} fill={ringColor} opacity={0.14} />
                                )}
                                {isExternalHover && (
                                    <circle r={r * 1.6} fill="none" stroke={ringColor} strokeWidth={1.6 / sizeScale} opacity={0.55}>
                                        <animate attributeName="r" values={`${r * 1.6};${r * 3.2};${r * 1.6}`} dur="1.4s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.4s" repeatCount="indefinite" />
                                    </circle>
                                )}
                                {c.isMulti && (
                                    <circle
                                        r={r * expand + 1.6 / sizeScale}
                                        fill="none"
                                        stroke={ringColor}
                                        strokeWidth={1.4 / sizeScale}
                                        opacity={0.5}
                                    />
                                )}
                                <circle
                                    r={r * expand}
                                    fill={`url(#${gradId})`}
                                    stroke="#ffffff"
                                    strokeWidth={1.6 / sizeScale}
                                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.28))' }}
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

                    {/* SVGラベル（エリア名が直接見える時のみ：≤3エリア） */}
                    {clusters
                        .filter(c => c.key === hoverKey || clusterContainsSelected(c))
                        .filter(c => !(c.isMulti && c.members.length > 3))  // 多数エリアは下の吹き出しで表示
                        .map(c => {
                            const baseR = pinRadius(c.count)
                            const sizeScale = Math.pow(Math.max(0.6, zoom), 0.85)
                            const rVisible = (baseR / sizeScale) * Math.max(1, zoom)
                            const labelOffset = -(rVisible + 8)
                            return (
                                <g key={`label-${c.key}`} transform={`translate(${c.pixel[0]}, ${c.pixel[1]})`}>
                                    <g transform={`scale(${1 / zoom})`}>
                                        <text
                                            y={labelOffset}
                                            textAnchor="middle"
                                            fontSize={12}
                                            fontWeight={700}
                                            fill="#0f172a"
                                            stroke="#ffffff"
                                            strokeWidth={3.5}
                                            paintOrder="stroke"
                                            style={{ pointerEvents: 'none' }}
                                        >{c.displayName}</text>
                                    </g>
                                </g>
                            )
                        })}
                </g>
            </svg>

            {/* 多数エリアクラスタ用の吹き出し（HTMLレイヤー・ホバー時のみ） */}
            {(() => {
                const c = clusters.find(c => c.key === hoverKey)
                if (!c || !c.isMulti || c.members.length <= 3) return null
                // screen px に変換（外側 <g> の transform を逆算）
                const screenX = (c.pixel[0] - containerW / 2) * zoom + containerW / 2 + pan[0]
                const screenY = (c.pixel[1] - containerH / 2) * zoom + containerH / 2 + pan[1]
                const pinScreenR = (pinRadius(c.count) / Math.pow(Math.max(0.6, zoom), 0.85)) * Math.max(1, zoom)
                // 上に出すと見切れる場合は下に
                const topMargin = 14
                const showBelow = screenY - pinScreenR - 100 < topMargin
                const offsetY = showBelow
                    ? screenY + pinScreenR + 12
                    : screenY - pinScreenR - 12
                const translateY = showBelow ? '0%' : '-100%'
                // 横方向のはみ出し補正
                const tooltipWidth = 240
                let leftClamped = screenX
                const halfW = tooltipWidth / 2
                if (screenX - halfW < 8) leftClamped = halfW + 8
                if (screenX + halfW > containerW - 8) leftClamped = containerW - halfW - 8
                const arrowOffsetFromCenter = screenX - leftClamped

                // 表示上限：先頭から最大 12 件、残りは「+X件」
                const MAX_LIST = 12
                const visibleMembers = c.members.slice(0, MAX_LIST)
                const hiddenCount = c.members.length - visibleMembers.length

                return (
                    <div style={{
                        position: 'absolute',
                        left: leftClamped,
                        top: offsetY,
                        transform: `translate(-50%, ${translateY})`,
                        zIndex: 20,
                        pointerEvents: 'none',
                    }}>
                        <div style={{
                            width: tooltipWidth,
                            background: 'white',
                            border: '1px solid rgba(15,23,42,0.08)',
                            borderRadius: 10,
                            padding: '10px 12px',
                            boxShadow: '0 8px 20px rgba(15,23,42,0.12)',
                            fontSize: 12,
                            color: '#0f172a',
                        }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: 6, paddingBottom: 6,
                                borderBottom: '1px dashed #e5e7eb',
                            }}>
                                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, letterSpacing: '0.04em' }}>
                                    {c.members.length} エリア
                                </span>
                                <span style={{
                                    fontSize: 11, fontWeight: 700,
                                    background: '#ede9fe', color: '#6b21a8',
                                    padding: '1px 7px', borderRadius: 99,
                                }}>{c.count} プラン</span>
                            </div>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                {visibleMembers.map(m => (
                                    <li key={m.key} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        padding: '3px 0', gap: 12,
                                    }}>
                                        <span style={{
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{m.name}</span>
                                        <span style={{ color: '#94a3b8', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{m.count}</span>
                                    </li>
                                ))}
                                {hiddenCount > 0 && (
                                    <li style={{
                                        padding: '4px 0 0', fontSize: 11, color: '#94a3b8',
                                        borderTop: '1px dashed #f1f5f9', marginTop: 4,
                                    }}>＋他 {hiddenCount} エリア</li>
                                )}
                            </ul>
                            <div style={{
                                marginTop: 6, paddingTop: 6,
                                borderTop: '1px dashed #e5e7eb',
                                fontSize: 10, color: '#9ca3af', textAlign: 'center',
                            }}>クリックで全プラン表示</div>
                        </div>
                        {/* 三角の吹き出し矢印 */}
                        <div style={{
                            position: 'absolute',
                            left: `calc(50% + ${arrowOffsetFromCenter}px)`,
                            ...(showBelow
                                ? { top: -7, transform: 'translateX(-50%) rotate(45deg)', borderTop: '1px solid rgba(15,23,42,0.08)', borderLeft: '1px solid rgba(15,23,42,0.08)' }
                                : { bottom: -7, transform: 'translateX(-50%) rotate(45deg)', borderBottom: '1px solid rgba(15,23,42,0.08)', borderRight: '1px solid rgba(15,23,42,0.08)' }
                            ),
                            width: 12, height: 12,
                            background: 'white',
                        }} />
                    </div>
                )
            })()}

            {!geos && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', fontSize: 13, pointerEvents: 'none',
                    gap: 12,
                }}>
                    <div className="map-spinner" />
                    <span style={{ fontSize: 12, letterSpacing: '0.04em', fontWeight: 600 }}>
                        地図を読み込み中…
                    </span>
                    <style jsx>{`
                        .map-spinner {
                            width: 32px; height: 32px;
                            border: 3px solid rgba(124,58,237,0.18);
                            border-top-color: #7c3aed;
                            border-radius: 50%;
                            animation: spin 0.9s linear infinite;
                        }
                        @keyframes spin { to { transform: rotate(360deg) } }
                    `}</style>
                </div>
            )}

            <div style={{
                position: 'absolute', bottom: 10, right: 12, zIndex: 5,
                fontSize: 10, color: 'rgba(15,23,42,0.5)',
                background: 'rgba(255,255,255,0.7)',
                padding: '4px 8px', borderRadius: 6,
            }}>ドラッグでパン ・ <kbd style={kbdStyle}>⌘</kbd>/<kbd style={kbdStyle}>Ctrl</kbd> + ホイールでズーム</div>
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

const kbdStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '1px 5px',
    borderRadius: 4,
    background: 'rgba(15,23,42,0.06)',
    border: '1px solid rgba(15,23,42,0.12)',
    fontSize: 10, fontWeight: 700,
    fontFamily: 'inherit',
    color: '#0f172a',
    lineHeight: 1.2,
}

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
