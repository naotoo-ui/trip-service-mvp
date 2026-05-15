'use client'
import type { SpotType } from '@/types'

const BLOCK_TYPES: { type: SpotType; label: string; accent: string; bg: string; border: string }[] = [
    { type: '移動' as SpotType, label: '移動 🚌', accent: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0' },
    { type: '観光',   label: '観光',   accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { type: 'グルメ', label: 'グルメ', accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    { type: '宿泊',   label: '宿泊',   accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { type: 'その他', label: 'その他', accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
]

export default function FreeBlocksPanel() {
    return (
        <div style={{
            width: 112,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
        }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, whiteSpace: 'nowrap' }}>
                フリーブロック
            </p>
            <p style={{ fontSize: 9, color: '#d1d5db', margin: '0 0 2px' }}>↙ カレンダーへドラッグ</p>
            {BLOCK_TYPES.map(b => (
                <div
                    key={b.type}
                    draggable
                    onDragStart={e => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ source: 'free', type: b.type }))
                        e.dataTransfer.effectAllowed = 'copy'
                    }}
                    style={{
                        padding: '9px 8px',
                        borderRadius: 8,
                        border: `1px solid ${b.border}`,
                        backgroundColor: b.bg,
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        userSelect: 'none',
                    }}
                >
                    <div style={{ width: 3, height: 22, borderRadius: 2, backgroundColor: b.accent, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: b.accent }}>{b.label}</span>
                </div>
            ))}
        </div>
    )
}
