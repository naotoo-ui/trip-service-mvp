'use client'
import { useState, useEffect, useRef } from 'react'
import type { Theme } from '../bookletThemes'
import type { EmergencyRow, EmergencyColWidths } from '../bookletConfig'

type Props = {
    title: string
    rows: EmergencyRow[]
    colWidths?: EmergencyColWidths
    theme: Theme
    editable: boolean
    minHeight?: number
    onTitleChange?: (title: string) => void
    onRowsChange?: (rows: EmergencyRow[]) => void
    onColWidthsChange?: (widths: EmergencyColWidths) => void
}

type CellField = keyof EmergencyRow

const DEFAULT_COL_WIDTHS: EmergencyColWidths = { name: 28, phone: 28, memo: 44 }

export default function EmergencyBlock({
    title, rows, colWidths, theme, editable, minHeight,
    onTitleChange, onRowsChange, onColWidthsChange,
}: Props) {
    const [titleDraft, setTitleDraft] = useState(title)
    const lastTitleRef = useRef(title)
    const rowsRef = useRef<EmergencyRow[]>(rows ?? [])
    const [editRows, setEditRows] = useState<EmergencyRow[]>(rows ?? [])
    const lastRowsRef = useRef<string>(JSON.stringify(rows ?? []))

    const [widths, setWidths] = useState<EmergencyColWidths>(colWidths ?? DEFAULT_COL_WIDTHS)
    const widthsRef = useRef<EmergencyColWidths>(widths)
    const tableRef = useRef<HTMLTableElement>(null)

    const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
    const pendingFocusRef = useRef<{ idx: number; field: CellField } | null>(null)

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

    useEffect(() => {
        const next = colWidths ?? DEFAULT_COL_WIDTHS
        // 値が違う時だけ反映（resize 中の自分自身の更新でループしないように）
        if (next.name !== widthsRef.current.name || next.phone !== widthsRef.current.phone || next.memo !== widthsRef.current.memo) {
            widthsRef.current = next
            setWidths(next)
        }
    }, [colWidths])

    // Enter 押下で挿入した新規行/次セルに focus
    useEffect(() => {
        if (pendingFocusRef.current) {
            const { idx, field } = pendingFocusRef.current
            const el = inputRefs.current.get(`${idx}-${field}`)
            if (el) {
                el.focus()
                const len = el.value.length
                el.setSelectionRange(len, len)
            }
            pendingFocusRef.current = null
        }
    }, [editRows])

    function commitTitle() {
        if (titleDraft !== lastTitleRef.current) {
            lastTitleRef.current = titleDraft
            onTitleChange?.(titleDraft)
        }
    }

    function updateCell(idx: number, field: CellField, value: string) {
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

    function addRowAndFocus(focusIdx?: number) {
        const next = [...rowsRef.current, { name: '', phone: '', memo: '' }]
        rowsRef.current = next
        setEditRows(next)
        const serialized = JSON.stringify(next)
        lastRowsRef.current = serialized
        onRowsChange?.(next)
        if (focusIdx !== undefined) {
            pendingFocusRef.current = { idx: focusIdx, field: 'name' }
        }
    }

    function addRow() { addRowAndFocus() }

    function deleteRow(idx: number) {
        const next = rowsRef.current.filter((_, i) => i !== idx)
        rowsRef.current = next
        setEditRows(next)
        const serialized = JSON.stringify(next)
        lastRowsRef.current = serialized
        onRowsChange?.(next)
    }

    function handleCellKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number, field: CellField) {
        if (e.key !== 'Enter') return
        // 日本語 IME の確定 Enter は無視
        if (e.nativeEvent.isComposing) return
        e.preventDefault()

        if (field === 'name') {
            inputRefs.current.get(`${idx}-phone`)?.focus()
        } else if (field === 'phone') {
            inputRefs.current.get(`${idx}-memo`)?.focus()
        } else {
            // memo で Enter → 次の行を挿入してその name にフォーカス
            addRowAndFocus(rowsRef.current.length)
        }
    }

    // 列幅リサイズ（name|phone の境界 / phone|memo の境界）
    function startResize(boundary: 'name-phone' | 'phone-memo', e: React.PointerEvent) {
        if (!onColWidthsChange) return
        e.preventDefault()
        e.stopPropagation()
        const tableEl = tableRef.current
        if (!tableEl) return
        const startX = e.clientX
        const tableWidth = tableEl.getBoundingClientRect().width
        const start = { ...widthsRef.current }

        function move(ev: PointerEvent) {
            const dx = ev.clientX - startX
            const dPct = (dx / tableWidth) * 100
            const next = { ...start }
            const MIN = 12
            if (boundary === 'name-phone') {
                const newName = Math.max(MIN, Math.min(80, start.name + dPct))
                const delta = newName - start.name
                next.name = newName
                next.phone = Math.max(MIN, start.phone - delta)
                next.memo = Math.max(MIN, 100 - next.name - next.phone)
            } else {
                const newPhone = Math.max(MIN, Math.min(80, start.phone + dPct))
                const delta = newPhone - start.phone
                next.phone = newPhone
                next.memo = Math.max(MIN, start.memo - delta)
                next.name = Math.max(MIN, 100 - next.phone - next.memo)
            }
            widthsRef.current = next
            setWidths(next)
        }

        function up() {
            document.removeEventListener('pointermove', move)
            document.removeEventListener('pointerup', up)
            onColWidthsChange?.(widthsRef.current)
        }

        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', up)
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

            <table
                ref={tableRef}
                style={{
                    width: '100%', borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                    fontSize: 13, color: theme.text, fontFamily: 'inherit',
                }}
            >
                <colgroup>
                    <col style={{ width: `${widths.name}%` }} />
                    <col style={{ width: `${widths.phone}%` }} />
                    <col style={{ width: `${widths.memo}%` }} />
                    {editable && <col style={{ width: 28 }} />}
                </colgroup>
                <thead>
                    <tr style={{
                        background: theme.pageBg,
                        borderBottom: `1.5px solid ${theme.timelineBar}`,
                    }}>
                        <th style={headerCellStyle(theme)}>
                            連絡先
                            {editable && <ResizeHandle onPointerDown={e => startResize('name-phone', e)} />}
                        </th>
                        <th style={headerCellStyle(theme)}>
                            電話
                            {editable && <ResizeHandle onPointerDown={e => startResize('phone-memo', e)} />}
                        </th>
                        <th style={headerCellStyle(theme)}>メモ</th>
                        {editable && <th className="no-print" style={{ padding: 0 }} />}
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
                                        ref={el => {
                                            const key = `${idx}-name`
                                            if (el) inputRefs.current.set(key, el)
                                            else inputRefs.current.delete(key)
                                        }}
                                        type="text"
                                        value={row.name}
                                        onChange={e => updateCell(idx, 'name', e.target.value)}
                                        onBlur={commitRows}
                                        onKeyDown={e => handleCellKeyDown(e, idx, 'name')}
                                        placeholder="例: ◯◯ホテル"
                                        style={cellInputStyle}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{ padding: '5px 8px', display: 'block' }}>{row.name || ' '}</span>
                                )}
                            </td>
                            <td style={cellTdStyle}>
                                {editable ? (
                                    <input
                                        ref={el => {
                                            const key = `${idx}-phone`
                                            if (el) inputRefs.current.set(key, el)
                                            else inputRefs.current.delete(key)
                                        }}
                                        type="text"
                                        inputMode="tel"
                                        value={row.phone}
                                        onChange={e => updateCell(idx, 'phone', e.target.value)}
                                        onBlur={commitRows}
                                        onKeyDown={e => handleCellKeyDown(e, idx, 'phone')}
                                        placeholder="例: 03-1234-5678"
                                        style={{ ...cellInputStyle, fontVariantNumeric: 'tabular-nums' }}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{
                                        padding: '5px 8px', display: 'block',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>{row.phone || ' '}</span>
                                )}
                            </td>
                            <td style={cellTdStyle}>
                                {editable ? (
                                    <input
                                        ref={el => {
                                            const key = `${idx}-memo`
                                            if (el) inputRefs.current.set(key, el)
                                            else inputRefs.current.delete(key)
                                        }}
                                        type="text"
                                        value={row.memo}
                                        onChange={e => updateCell(idx, 'memo', e.target.value)}
                                        onBlur={commitRows}
                                        onKeyDown={e => handleCellKeyDown(e, idx, 'memo')}
                                        placeholder="例: 24時間対応"
                                        style={cellInputStyle}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{ padding: '5px 8px', display: 'block' }}>{row.memo || ' '}</span>
                                )}
                            </td>
                            {editable && (
                                <td className="no-print" style={{ padding: 0, textAlign: 'center' }}>
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

function headerCellStyle(theme: Theme): React.CSSProperties {
    return {
        position: 'relative',
        textAlign: 'left',
        padding: '6px 8px',
        fontSize: 11, fontWeight: 700,
        color: theme.subText,
        letterSpacing: '0.06em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    }
}

const cellTdStyle: React.CSSProperties = {
    padding: 0,
    verticalAlign: 'middle',
    overflow: 'hidden',
}

function ResizeHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
    return (
        <span
            onPointerDown={onPointerDown}
            className="no-print"
            role="separator"
            aria-orientation="vertical"
            style={{
                position: 'absolute',
                top: 0,
                right: -3,
                width: 7,
                height: '100%',
                cursor: 'col-resize',
                userSelect: 'none',
                touchAction: 'none',
                zIndex: 2,
            }}
        />
    )
}
