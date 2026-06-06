'use client'
import Image from 'next/image'
import { getDestinationImage } from '@/lib/destinationImages'
import { getDestinationEmoji } from '@/lib/destinationEmoji'

type Item = { key: string; name: string; count: number }

type Props = {
    title: string
    items: Item[]
    selectedKey: string | null
    onPick: (key: string) => void
}

// 横スクロール可能な「人気目的地」サムネリスト
export default function PopularDestinations({ title, items, selectedKey, onPick }: Props) {
    if (items.length === 0) return null
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{
                display: 'flex', alignItems: 'baseline', gap: 8,
                marginBottom: 8,
            }}>
                <h3 style={{
                    fontSize: 13, fontWeight: 800, color: '#0f172a',
                    margin: 0, letterSpacing: '0.02em',
                }}>{title}</h3>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>人気エリアからジャンプ</span>
            </div>
            <div className="popular-row">
                {items.map(it => {
                    const img = getDestinationImage(it.name)
                    const selected = selectedKey === it.key
                    return (
                        <button
                            key={it.key}
                            type="button"
                            onClick={() => onPick(it.key)}
                            className="popular-item"
                            aria-pressed={selected}
                            style={{
                                borderColor: selected ? '#7c3aed' : 'transparent',
                                boxShadow: selected
                                    ? '0 4px 12px rgba(124,58,237,0.18)'
                                    : '0 1px 3px rgba(15,23,42,0.06)',
                            }}
                        >
                            <div className="popular-thumb">
                                {img ? (
                                    <Image src={img} alt={it.name} fill sizes="120px" style={{ objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: 28 }}>{getDestinationEmoji(it.name)}</span>
                                )}
                                <span className="popular-count">{it.count}</span>
                            </div>
                            <span className="popular-name">{it.name}</span>
                        </button>
                    )
                })}
            </div>
            <style jsx>{`
                .popular-row {
                    display: flex; gap: 10px;
                    overflow-x: auto;
                    padding: 2px 2px 10px;
                    scrollbar-width: thin;
                }
                .popular-row::-webkit-scrollbar { height: 6px; }
                .popular-row::-webkit-scrollbar-thumb {
                    background: rgba(15,23,42,0.12); border-radius: 99px;
                }
                .popular-item {
                    flex: 0 0 auto;
                    width: 116px;
                    display: flex; flex-direction: column; gap: 6px;
                    padding: 0;
                    border-radius: 12px;
                    border: 1.5px solid transparent;
                    background: transparent;
                    cursor: pointer;
                    transition: transform 0.14s, box-shadow 0.14s, border-color 0.14s;
                }
                .popular-item:hover { transform: translateY(-1px); }
                .popular-thumb {
                    position: relative;
                    width: 100%; height: 86px;
                    border-radius: 10px;
                    overflow: hidden;
                    background: linear-gradient(135deg,#fef3c7,#fde68a);
                    display: flex; align-items: center; justify-content: center;
                }
                .popular-count {
                    position: absolute;
                    bottom: 5px; right: 5px;
                    padding: 2px 7px;
                    border-radius: 99px;
                    background: rgba(15,23,42,0.78);
                    color: white;
                    font-size: 10px; font-weight: 800;
                    letter-spacing: 0.02em;
                }
                .popular-name {
                    padding: 0 4px;
                    font-size: 11px; font-weight: 700;
                    color: #0f172a;
                    text-align: center;
                    overflow: hidden; text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: 1.25;
                }
            `}</style>
        </div>
    )
}
