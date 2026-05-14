'use client'
import type { SidebarSpot, SpotType } from '@/types'

const SPOT_STYLES: Record<SpotType, { accent: string; bg: string; border: string; text: string }> = {
    観光:   { accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    グルメ: { accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
    移動:   { accent: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' },
    宿泊:   { accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
    その他: { accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
}

function Stars({ n }: { n?: number }) {
    if (!n) return null
    return (
        <span style={{ fontSize: 9, color: '#f59e0b', letterSpacing: -1 }}>
            {'★'.repeat(n)}{'☆'.repeat(5 - n)}
        </span>
    )
}

interface Props {
    spots: SidebarSpot[]
    height: string
    isReceiving?: boolean
    onDelete?: (index: number) => void
}

export default function SuggestedSpotsPanel({ spots, height, isReceiving, onDelete }: Props) {
    return (
        <div style={{
            width: 168,
            flexShrink: 0,
            height,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            paddingRight: 2,
            borderRadius: 12,
            border: isReceiving ? '2px dashed #2563eb' : '2px solid transparent',
            transition: 'border-color 0.15s',
            padding: isReceiving ? '6px' : '0 2px 0 0',
        }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, whiteSpace: 'nowrap' }}>
                おすすめスポット
            </p>

            {spots.length === 0 ? (
                <p style={{ fontSize: 10, color: '#d1d5db', margin: 0, lineHeight: 1.5 }}>
                    旅程生成時または<br />カレンダーから<br />ドラッグで追加
                </p>
            ) : (
                <>
                    <p style={{ fontSize: 9, color: '#d1d5db', margin: '0 0 2px' }}>↙ カレンダーへドラッグ</p>
                    {spots.map((spot, i) => {
                        const st = SPOT_STYLES[spot.type] ?? SPOT_STYLES['その他']
                        return (
                            <div
                                key={i}
                                draggable
                                onDragStart={e => {
                                    e.dataTransfer.setData('application/json', JSON.stringify({ source: 'suggested', spot, idx: i }))
                                    e.dataTransfer.effectAllowed = 'copy'
                                }}
                                style={{
                                    padding: '7px 8px',
                                    borderRadius: 8,
                                    border: `1px solid ${st.border}`,
                                    backgroundColor: st.bg,
                                    cursor: 'grab',
                                    userSelect: 'none',
                                    display: 'flex',
                                    gap: 5,
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                }}
                            >
                                <div style={{ width: 3, minHeight: 28, borderRadius: 2, backgroundColor: st.accent, flexShrink: 0, marginTop: 1 }} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: st.text, margin: 0, lineHeight: 1.3, wordBreak: 'break-all', paddingRight: 14 }}>{spot.name}</p>
                                    <Stars n={spot.popularity} />
                                    <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0' }}>{spot.duration_minutes}分</p>
                                </div>
                                {onDelete && (
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); onDelete(i) }}
                                        style={{
                                            position: 'absolute', top: 4, right: 4,
                                            width: 14, height: 14,
                                            border: 'none', borderRadius: 3,
                                            background: 'rgba(0,0,0,0.15)',
                                            color: '#6b7280', fontSize: 10,
                                            cursor: 'pointer', lineHeight: 1,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: 0,
                                        }}
                                    >×</button>
                                )}
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}
