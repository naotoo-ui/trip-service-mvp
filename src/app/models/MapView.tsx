'use client'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Topology } from 'topojson-specification'

// 簡易マップ：d3-geo + topojson-client で SVG を描画。
// 国内/海外で土台の topojson とプロジェクション設定を切り替える。

type Marker = {
    key: string
    name: string
    coord: [number, number]   // [lng, lat]
    count: number             // この目的地に該当するプラン数
}

type Props = {
    kind: 'domestic' | 'overseas'
    markers: Marker[]
    selectedKey: string | null
    onSelect: (key: string | null) => void
}

const TOPOJSON_URL: Record<'domestic' | 'overseas', string> = {
    // 日本：都道府県別 topojson（jsdelivr の data-of-japan）
    domestic: 'https://cdn.jsdelivr.net/gh/dataofjapan/land@master/japan.topojson',
    // 世界：world-atlas 110m 解像度
    overseas: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
}

const PROJECTION_CONFIG: Record<'domestic' | 'overseas', {
    center: [number, number]
    scale: number
    rotate?: [number, number, number]
}> = {
    // 日本：本州中心、北海道～沖縄まで収まる scale
    domestic: { center: [137.5, 36.5], scale: 1200 },
    // 世界：Mercator で全大陸が見える scale
    overseas: { center: [10, 25], scale: 150 },
}

export default function MapView({ kind, markers, selectedKey, onSelect }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [containerW, setContainerW] = useState(800)
    const containerH = kind === 'domestic' ? 520 : 440

    const [geos, setGeos] = useState<Feature<Geometry>[] | null>(null)
    const [hoverKey, setHoverKey] = useState<string | null>(null)

    // zoom & pan 状態
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState<[number, number]>([0, 0])
    const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

    // コンテナ幅をリサイズで追従
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

    // topojson 取得（クライアントで一度だけ）
    useEffect(() => {
        let cancelled = false
        setGeos(null)
        fetch(TOPOJSON_URL[kind])
            .then(r => r.json())
            .then((topo: Topology) => {
                if (cancelled) return
                // オブジェクト名は地図によって異なる：'japan' / 'countries' を試す
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
            .catch(() => { /* fail silently; will show empty backdrop */ })
        return () => { cancelled = true }
    }, [kind])

    // タブ切替で zoom/pan リセット
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

    // ピンの画面座標
    const placedMarkers = useMemo(() => {
        return markers.map(m => {
            const p = projection(m.coord)
            return { ...m, pixel: p as [number, number] | null }
        }).filter(m => m.pixel !== null) as (Marker & { pixel: [number, number] })[]
    }, [markers, projection])

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
        dragRef.current = { x: e.clientX, y: e.clientY, px: pan[0], py: pan[1] }
    }, [pan])

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragRef.current) return
        const dx = e.clientX - dragRef.current.x
        const dy = e.clientY - dragRef.current.y
        setPan([dragRef.current.px + dx, dragRef.current.py + dy])
    }, [])

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId)
        dragRef.current = null
    }, [])

    const resetView = () => { setZoom(1); setPan([0, 0]) }

    // ピンサイズの基準（件数で動的に変える）
    function pinRadius(count: number): number {
        if (count >= 10) return 11
        if (count >= 5) return 9
        if (count >= 2) return 7
        return 5
    }

    const transformStyle = `translate(${pan[0]}px, ${pan[1]}px) scale(${zoom})`

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                background: kind === 'domestic'
                    ? 'linear-gradient(180deg, #f6f4ed 0%, #ecf4f7 100%)'
                    : 'linear-gradient(180deg, #f3f5fa 0%, #e8eef8 100%)',
                borderRadius: 16,
                border: '1px solid rgba(15,23,42,0.08)',
                overflow: 'hidden',
                touchAction: 'none',
                cursor: dragRef.current ? 'grabbing' : 'grab',
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
                <g style={{ transform: transformStyle, transformOrigin: `${containerW / 2}px ${containerH / 2}px` }}>
                    {/* 地形（陸地） */}
                    {geos && geos.map((f, i) => {
                        const d = pathGen(f) ?? ''
                        if (!d) return null
                        return (
                            <path
                                key={i}
                                d={d}
                                fill="#ffffff"
                                stroke="#cbd5e1"
                                strokeWidth={0.6 / Math.max(1, zoom)}
                                style={{ pointerEvents: 'none' }}
                            />
                        )
                    })}

                    {/* ピン */}
                    {placedMarkers.map(m => {
                        const isSelected = m.key === selectedKey
                        const isHover = m.key === hoverKey
                        const r = pinRadius(m.count) / Math.max(1, Math.pow(zoom, 0.5))
                        const expand = isSelected ? 1.6 : isHover ? 1.3 : 1
                        const stroke = isSelected ? '#1d4ed8' : isHover ? '#2563eb' : '#ffffff'
                        const fill = isSelected ? '#3b82f6' : '#2563eb'
                        return (
                            <g
                                key={m.key}
                                transform={`translate(${m.pixel[0]}, ${m.pixel[1]})`}
                                onPointerDown={e => { e.stopPropagation() }}
                                onClick={e => {
                                    e.stopPropagation()
                                    onSelect(m.key === selectedKey ? null : m.key)
                                }}
                                onMouseEnter={() => setHoverKey(m.key)}
                                onMouseLeave={() => setHoverKey(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                {isSelected && (
                                    <circle
                                        r={r * 2.4}
                                        fill={fill}
                                        opacity={0.18}
                                    />
                                )}
                                <circle
                                    r={r * expand}
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth={1.6 / Math.max(1, Math.pow(zoom, 0.5))}
                                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))', transition: 'r 0.18s' }}
                                />
                                <text
                                    x={0}
                                    y={1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={Math.max(7, r * 0.95)}
                                    fontWeight={800}
                                    fill="#ffffff"
                                    style={{ pointerEvents: 'none' }}
                                >{m.count}</text>
                            </g>
                        )
                    })}

                    {/* ホバー時ラベル */}
                    {placedMarkers.filter(m => m.key === hoverKey || m.key === selectedKey).map(m => (
                        <g key={`label-${m.key}`} transform={`translate(${m.pixel[0]}, ${m.pixel[1] - 18})`}>
                            <text
                                textAnchor="middle"
                                fontSize={11 / Math.max(0.9, Math.pow(zoom, 0.4))}
                                fontWeight={700}
                                fill="#0f172a"
                                stroke="#ffffff"
                                strokeWidth={3.5 / Math.max(1, Math.pow(zoom, 0.5))}
                                paintOrder="stroke"
                                style={{ pointerEvents: 'none' }}
                            >{m.name}</text>
                        </g>
                    ))}
                </g>
            </svg>

            {/* ローディング */}
            {!geos && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', fontSize: 13, pointerEvents: 'none',
                }}>地図を読み込み中…</div>
            )}

            {/* 操作ヒント */}
            <div style={{
                position: 'absolute', bottom: 10, right: 12, zIndex: 5,
                fontSize: 10, color: 'rgba(15,23,42,0.5)',
                background: 'rgba(255,255,255,0.7)',
                padding: '4px 8px', borderRadius: 6,
            }}>ドラッグでパン・ホイールで拡大縮小</div>
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
