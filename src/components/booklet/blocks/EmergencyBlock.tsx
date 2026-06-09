'use client'
import { useState, useEffect, useRef } from 'react'
import type { Theme } from '../bookletThemes'
import type { EmergencyRow } from '../bookletConfig'

type Props = {
    title: string
    rows: EmergencyRow[]
    theme: Theme
    editable: boolean
    minHeight?: number
    onTitleChange?: (title: string) => void
    onRowsChange?: (rows: EmergencyRow[]) => void
}

export default function EmergencyBlock({ title, rows, theme, editable, minHeight, onTitleChange, onRowsChange }: Props) {
    const [titleDraft, setTitleDraft] = useState(title)
    const lastTitleRef = useRef(title)
    const rowsRef = useRef<EmergencyRow[]>(rows ?? [])
    const [editRows, setEditRows] = useState<EmergencyRow[]>(rows ?? [])
    const lastRowsRef = useRef<string>(JSON.stringify(rows ?? []))

    useEffect(() => {
        if (title !== lastTitleRef.current) { setTitleDraft(title); lastTitleRef.current = title }
    }, [title])

    useEffect(() => {
        const incoming = JSON.stringify(rows ?? [])
        if (incoming !== lastRowsRef.current) {
            lastRowsRef.current = incoming
            setEditRows(rows ?? [])
            rowsRef.current = rows ?? []
        }
    }, [rows])

    function commitTitle() {
        if (titleDraft !== lastTitleRef.current) {
            lastTitleRef.current = titleDraft
            onTitleChange?.(titleDraft)
        }
    }

    function updateCell(idx: number, field: keyof EmergencyRow, value: string) {
        const next = rowsRef.current.map((r, i) => i === idx ? { ...r, [field]: value } : r)
        rowsRef.current = next
        setEditRows(next)
    }

    function commitRows() {
        const serialized = JSON.stringify(rowsRef.current)
        if (serialized !== lastRowsRef.current) {
            lastRowsRef.current = serialized
            onRowsChange?.(rowsRef.current)
        }
    }

    function addRow() {
        const next = [...rowsRef.current, { name: '', phone: '', memo: '' }]
        rowsRef.current = next
        setEditRows(next)
        // 追加直後にも保存（空行でも残るように）
        const serialized = JSON.stringify(next)
        lastRowsRef.current = serialized
        onRowsChange?.(next)
    }

    function deleteRow(idx: number) {
        const next = rowsRef.current.filter((_, i) => i !== idx)
        rowsRef.current = next
        setEditRows(next)
        const serialized = JSON.stringify(next)
        lastRowsRef.current = serialized
        onRowsChange?.(next)
    }

    const cellInputStyle: React.CSSProperties = {
        width: '100%', padding: '5px 8px', fontSize: 13,
        border: '1px solid transparent', borderRadius: 4,
        background: 'transparent', color: theme.text,
        fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box',
    }
    const cellFocusStyle = `1px solid ${theme.accent}`

    return (
        <div className="booklet-emergency booklet-inline-block" style={{ position: 'relative', zIndex: 2, minHeight: minHeight ?? undefined }}>
            <header style={{
                paddingBottom: 10, marginBottom: 12,
                borderBottom: `1.5px solid ${theme.accent}`,
            }}>
                {editable ? (
                    <input
                        type="text"
                        value={titleDraft}
                        onChange={e => setTitleDraft(e.target.value)}
                        onBlur={commitTitle}
                        onKeyDown={e => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur() }}
                        placeholder="タイトル"
                        style={{
                            fontSize: 18, fontWeight: 800, color: theme.text,
                            margin: 0, letterSpacing: '-0.01em',
                            width: '100%', border: 'none', background: 'transparent',
                            outline: 'none', fontFamily: 'inherit', padding: 0,
                        }}
                    />
                ) : (
                    <h3 style={{
                        fontSize: 18, fontWeight: 800, color: theme.text,
                        margin: 0, letterSpacing: '-0.01em',
                    }}>{title}</h3>
                )}
            </header>

            <table style={{
                width: '100%', borderCollapse: 'collapse',
                fontSize: 13, color: theme.text, fontFamily: 'inherit',
            }}>
                <thead>
                    <tr style={{
                        background: theme.pageBg,
                        borderBottom: `1.5px solid ${theme.timelineBar}`,
                    }}>
                        <th style={headerCellStyle(theme, '28%')}>連絡先</th>
                        <th style={headerCellStyle(theme, '28%')}>電話</th>
                        <th style={headerCellStyle(theme, 'auto')}>メモ</th>
                        {editable && <th className="no-print" style={{ width: 28, padding: 0 }} />}
                    </tr>
                </thead>
                <tbody>
                    {editRows.length === 0 && (
                        <tr>
                            <td colSpan={editable ? 4 : 3} style={{
                                padding: '10px 8px', color: theme.subText,
                                fontSize: 12, textAlign: 'center',
                            }}>
                                {editable ? '下の「＋ 行を追加」から連絡先を入力してください' : '（連絡先なし）'}
                            </td>
                        </tr>
                    )}
                    {editRows.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${theme.timelineBar}` }}>
                            <td style={cellTdStyle}>
                                {editable ? (
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={e => updateCell(idx, 'name', e.target.value)}
                                        onBlur={commitRows}
                                        placeholder="例: ◯◯ホテル"
                                        style={cellInputStyle}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{ padding: '5px 8px', display: 'block' }}>{row.name || ' '}</span>
                                )}
                            </td>
                            <td style={cellTdStyle}>
                                {editable ? (
                                    <input
                                        type="text"
                                        inputMode="tel"
                                        value={row.phone}
                                        onChange={e => updateCell(idx, 'phone', e.target.value)}
                                        onBlur={commitRows}
                                        placeholder="例: 03-1234-5678"
                                        style={{ ...cellInputStyle, fontVariantNumeric: 'tabular-nums' }}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{
                                        padding: '5px 8px', display: 'block',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>{row.phone || ' '}</span>
                                )}
                            </td>
                            <td style={cellTdStyle}>
                                {editable ? (
                                    <input
                                        type="text"
                                        value={row.memo}
                                        onChange={e => updateCell(idx, 'memo', e.target.value)}
                                        onBlur={commitRows}
                                        placeholder="例: 24時間対応"
                                        style={cellInputStyle}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{ padding: '5px 8px', display: 'block' }}>{row.memo || ' '}</span>
                                )}
                            </td>
                            {editable && (
                                <td className="no-print" style={{ width: 28, padding: 0, textAlign: 'center' }}>
                                    <button
                                        type="button"
                                        onClick={() => deleteRow(idx)}
                                        aria-label="行を削除"
                                        title="行を削除"
                                        style={{
                                            width: 22, height: 22, padding: 0,
                                            border: 'none', background: 'transparent',
                                            color: '#94a3b8', cursor: 'pointer',
                                            fontSize: 14, lineHeight: 1,
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >×</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {editable && (
                <button
                    type="button"
                    onClick={addRow}
                    className="no-print"
                    style={{
                        marginTop: 10,
                        padding: '5px 12px', borderRadius: 7,
                        border: `1.5px dashed ${theme.accent}`,
                        background: 'transparent', color: theme.accent,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    ＋ 行を追加
                </button>
            )}
        </div>
    )
}

function headerCellStyle(theme: Theme, width: string): React.CSSProperties {
    return {
        width,
        textAlign: 'left',
        padding: '6px 8px',
        fontSize: 11, fontWeight: 700,
        color: theme.subText,
        letterSpacing: '0.06em',
    }
}

const cellTdStyle: React.CSSProperties = {
    padding: 0,
    verticalAlign: 'middle',
}
