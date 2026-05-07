'use client'
import { useState, useEffect } from 'react'
import type { SpotType } from '@/types'

const BLOCK_TYPES: { type: SpotType; label: string; accent: string; bg: string; border: string }[] = [
    { type: '観光',   label: '観光',   accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { type: 'グルメ', label: 'グルメ', accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    { type: '宿泊',   label: '宿泊',   accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { type: 'その他', label: 'その他', accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
]

interface PendingDrop {
    dayIdx: number
    time: string
    type: SpotType
}

interface Props {
    pending: PendingDrop | null
    onConfirm: (name: string, type: SpotType, duration: number) => void
    onCancel: () => void
    height: string
}

export default function FreeBlocksPanel({ pending, onConfirm, onCancel, height }: Props) {
    const [name, setName]       = useState('')
    const [selType, setSelType] = useState<SpotType>('観光')
    const [duration, setDuration] = useState(60)

    useEffect(() => {
        if (pending) {
            setSelType(pending.type)
            setName('')
            setDuration(60)
        }
    }, [pending])

    return (
        <div style={{
            width: 112,
            flexShrink: 0,
            height,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
        }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, whiteSpace: 'nowrap' }}>
                フリーブロック
            </p>

            {pending ? (
                /* ── ドロップ後の入力フォーム ── */
                <div style={{
                    border: '1.5px solid #2563eb',
                    borderRadius: 10,
                    padding: '10px 8px',
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', margin: 0 }}>ブロックを追加</p>
                    <p style={{ fontSize: 10, color: '#6b7280', margin: 0 }}>{pending.time} 〜</p>

                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onConfirm(name.trim(), selType, duration) }}
                        placeholder="スポット名"
                        style={{
                            width: '100%',
                            padding: '5px 7px',
                            border: '1px solid #bfdbfe',
                            borderRadius: 6,
                            fontSize: 12,
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit',
                        }}
                    />

                    <div>
                        <p style={{ fontSize: 10, color: '#6b7280', margin: '0 0 4px' }}>種別</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {BLOCK_TYPES.map(b => (
                                <button
                                    key={b.type}
                                    type="button"
                                    onClick={() => setSelType(b.type)}
                                    style={{
                                        padding: '2px 5px',
                                        borderRadius: 4,
                                        border: `1px solid ${selType === b.type ? b.accent : '#e5e7eb'}`,
                                        backgroundColor: selType === b.type ? b.bg : 'white',
                                        color: selType === b.type ? b.accent : '#6b7280',
                                        fontSize: 10,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >{b.label}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p style={{ fontSize: 10, color: '#6b7280', margin: '0 0 4px' }}>時間（分）</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <button
                                type="button"
                                onClick={() => setDuration(d => Math.max(20, d - 20))}
                                style={{ width: 20, height: 20, border: '1px solid #e5e7eb', borderRadius: 4, background: 'white', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >−</button>
                            <span style={{ fontSize: 12, fontWeight: 600, minWidth: 28, textAlign: 'center' }}>{duration}</span>
                            <button
                                type="button"
                                onClick={() => setDuration(d => Math.min(480, d + 20))}
                                style={{ width: 20, height: 20, border: '1px solid #e5e7eb', borderRadius: 4, background: 'white', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >＋</button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => { if (name.trim()) onConfirm(name.trim(), selType, duration) }}
                        disabled={!name.trim()}
                        style={{
                            padding: '6px 0',
                            backgroundColor: name.trim() ? '#2563eb' : '#d1d5db',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: name.trim() ? 'pointer' : 'not-allowed',
                        }}
                    >追加</button>

                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '3px 0',
                            backgroundColor: 'transparent',
                            color: '#9ca3af',
                            border: 'none',
                            fontSize: 11,
                            cursor: 'pointer',
                        }}
                    >キャンセル</button>
                </div>
            ) : (
                /* ── ドラッグ可能なテンプレートブロック ── */
                <>
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
                </>
            )}
        </div>
    )
}
