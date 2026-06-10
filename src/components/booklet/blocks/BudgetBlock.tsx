'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import type { Theme } from '../bookletThemes'
import type { BudgetRow, BudgetColWidths, BudgetSort } from '../bookletConfig'

type Props = {
    title: string
    rows: BudgetRow[]
    colWidths?: BudgetColWidths
    sort?: BudgetSort
    members: string[]              // しおりの編集メンバー
    theme: Theme
    editable: boolean
    minHeight?: number
    onTitleChange?: (title: string) => void
    onRowsChange?: (rows: BudgetRow[]) => void
    onColWidthsChange?: (widths: BudgetColWidths) => void
    onSortChange?: (sort: BudgetSort | undefined) => void
}

type CellField = keyof BudgetRow

const DEFAULT_COL_WIDTHS: BudgetColWidths = { date: 22, member: 22, amount: 20, memo: 36 }

// 金額文字列から数値を抽出（'￥5,000' → 5000, '' → 0, 'abc' → NaN→ソート時は末尾扱い）
function parseAmount(s: string): number {
    if (!s) return NaN
    const cleaned = s.replace(/[^\d.-]/g, '')
    if (!cleaned) return NaN
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : NaN
}

// 行配列にソートを適用（sort 未指定 = 入力順そのまま）
function applySort(rows: BudgetRow[], sort: BudgetSort | undefined): { row: BudgetRow; origIdx: number }[] {
    const indexed = rows.map((row, origIdx) => ({ row, origIdx }))
    if (!sort) return indexed
    const sign = sort.dir === 'asc' ? 1 : -1
    return [...indexed].sort((a, b) => {
        if (sort.key === 'amount') {
            const av = parseAmount(a.row.amount)
            const bv = parseAmount(b.row.amount)
            const aNan = Number.isNaN(av), bNan = Number.isNaN(bv)
            if (aNan && bNan) return 0
            if (aNan) return 1   // 空/不正は常に末尾
            if (bNan) return -1
            return (av - bv) * sign
        }
        // date / member: 空は末尾。それ以外は localeCompare（date は YYYY-MM-DD なので辞書順で OK）
        const av = a.row[sort.key]
        const bv = b.row[sort.key]
        const aEmpty = !av, bEmpty = !bv
        if (aEmpty && bEmpty) return 0
        if (aEmpty) return 1
        if (bEmpty) return -1
        return av.localeCompare(bv, 'ja') * sign
    })
}

export default function BudgetBlock({
    title, rows, colWidths, sort, members, theme, editable, minHeight,
    onTitleChange, onRowsChange, onColWidthsChange, onSortChange,
}: Props) {
    const [titleDraft, setTitleDraft] = useState(title)
    const lastTitleRef = useRef(title)
    const rowsRef = useRef<BudgetRow[]>(rows ?? [])
    const [editRows, setEditRows] = useState<BudgetRow[]>(rows ?? [])
    const lastRowsRef = useRef<string>(JSON.stringify(rows ?? []))

    const [widths, setWidths] = useState<BudgetColWidths>(colWidths ?? DEFAULT_COL_WIDTHS)
    const widthsRef = useRef<BudgetColWidths>(widths)
    const tableRef = useRef<HTMLTableElement>(null)

    // 元配列の index ベースで input を保持（ソート後の表示順とは無関係に追跡できる）
    const inputRefs = useRef<Map<string, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>(new Map())
    const pendingFocusRef = useRef<{ origIdx: number; field: CellField } | null>(null)

    function autoResize(el: HTMLTextAreaElement) {
        el.style.height = 'auto'
        el.style.height = `${Math.max(el.scrollHeight, 22)}px`
    }

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
        if (next.date !== widthsRef.current.date || next.member !== widthsRef.current.member ||
            next.amount !== widthsRef.current.amount || next.memo !== widthsRef.current.memo) {
            widthsRef.current = next
            setWidths(next)
        }
    }, [colWidths])

    useEffect(() => {
        inputRefs.current.forEach(el => {
            if (el instanceof HTMLTextAreaElement) autoResize(el)
        })
        if (pendingFocusRef.current) {
            const { origIdx, field } = pendingFocusRef.current
            const el = inputRefs.current.get(`${origIdx}-${field}`)
            if (el) {
                el.focus()
                if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                    const len = el.value.length
                    try { el.setSelectionRange(len, len) } catch {}
                }
            }
            pendingFocusRef.current = null
        }
    }, [editRows])

    const sortedRows = useMemo(() => applySort(editRows, sort), [editRows, sort])

    function commitTitle() {
        if (titleDraft !== lastTitleRef.current) {
            lastTitleRef.current = titleDraft
            onTitleChange?.(titleDraft)
        }
    }

    function updateCell(origIdx: number, field: CellField, value: string) {
        const next = rowsRef.current.map((r, i) => i === origIdx ? { ...r, [field]: value } : r)
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

    function addRowAndFocus(focusOrigIdx?: number) {
        const next = [...rowsRef.current, { date: '', member: '', amount: '', memo: '' }]
        rowsRef.current = next
        setEditRows(next)
        const serialized = JSON.stringify(next)
        lastRowsRef.current = serialized
        onRowsChange?.(next)
        if (focusOrigIdx !== undefined) {
            pendingFocusRef.current = { origIdx: focusOrigIdx, field: 'date' }
        }
    }

    function addRow() { addRowAndFocus() }

    function deleteRow(origIdx: number) {
        const next = rowsRef.current.filter((_, i) => i !== origIdx)
        rowsRef.current = next
        setEditRows(next)
        const serialized = JSON.stringify(next)
        lastRowsRef.current = serialized
        onRowsChange?.(next)
    }

    function handleCellKeyDown(
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        origIdx: number, field: CellField,
    ) {
        if (e.key !== 'Enter') return
        if ('isComposing' in e.nativeEvent && (e.nativeEvent as KeyboardEvent).isComposing) return
        // メモは Shift+Enter でセル内改行
        if (field === 'memo' && e.shiftKey) return
        e.preventDefault()
        if (field === 'date') inputRefs.current.get(`${origIdx}-member`)?.focus()
        else if (field === 'member') inputRefs.current.get(`${origIdx}-amount`)?.focus()
        else if (field === 'amount') inputRefs.current.get(`${origIdx}-memo`)?.focus()
        else addRowAndFocus(rowsRef.current.length)
    }

    function toggleSort(key: BudgetSort['key']) {
        if (!onSortChange) return
        if (!sort || sort.key !== key) onSortChange({ key, dir: 'asc' })
        else if (sort.dir === 'asc') onSortChange({ key, dir: 'desc' })
        else onSortChange(undefined)   // 3 回目で解除（入力順に戻る）
    }

    function startResize(boundary: 'date-member' | 'member-amount' | 'amount-memo', e: React.PointerEvent) {
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
            const MIN = 10
            // 左側を増減 → 右隣りの 1 列だけで吸収（他列は不変）。最後の列は memo で吸収。
            if (boundary === 'date-member') {
                const newDate = Math.max(MIN, Math.min(80, start.date + dPct))
                const delta = newDate - start.date
                next.date = newDate
                next.member = Math.max(MIN, start.member - delta)
                next.memo = Math.max(MIN, 100 - next.date - next.member - next.amount)
            } else if (boundary === 'member-amount') {
                const newMember = Math.max(MIN, Math.min(80, start.member + dPct))
                const delta = newMember - start.member
                next.member = newMember
                next.amount = Math.max(MIN, start.amount - delta)
                next.memo = Math.max(MIN, 100 - next.date - next.member - next.amount)
            } else {
                const newAmount = Math.max(MIN, Math.min(80, start.amount + dPct))
                const delta = newAmount - start.amount
                next.amount = newAmount
                next.memo = Math.max(MIN, start.memo - delta)
                next.date = Math.max(MIN, 100 - next.member - next.amount - next.memo)
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
    const cellTextareaStyle: React.CSSProperties = {
        ...cellInputStyle,
        resize: 'none', overflow: 'hidden', lineHeight: 1.5, minHeight: 22,
    }
    const cellFocusStyle = `1px solid ${theme.accent}`
    const colBorder = `1px solid ${theme.timelineBar}`

    return (
        <div className="booklet-budget booklet-inline-block" style={{ position: 'relative', zIndex: 2, minHeight: minHeight ?? undefined }}>
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

            {editable && members.length === 0 && (
                <p style={{
                    margin: '0 0 10px', padding: '8px 10px',
                    background: '#fef3c7', color: '#92400e',
                    border: '1px solid #fde68a', borderRadius: 8,
                    fontSize: 12,
                }}>
                    メンバーを選択するには、しおりの設定 → 全体設定 で編集メンバーを追加してください。
                </p>
            )}

            <table
                ref={tableRef}
                style={{
                    width: '100%', borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                    fontSize: 13, color: theme.text, fontFamily: 'inherit',
                }}
            >
                <colgroup>
                    <col style={{ width: `${widths.date}%` }} />
                    <col style={{ width: `${widths.member}%` }} />
                    <col style={{ width: `${widths.amount}%` }} />
                    <col style={{ width: `${widths.memo}%` }} />
                    {editable && <col style={{ width: 28 }} />}
                </colgroup>
                <thead>
                    <tr style={{
                        background: theme.pageBg,
                        borderBottom: `1.5px solid ${theme.timelineBar}`,
                    }}>
                        <SortableTh label="日付"    field="date"    sort={sort} onToggle={toggleSort} theme={theme} borderRight={colBorder}
                            resizer={editable ? <ResizeHandle onPointerDown={e => startResize('date-member', e)} /> : null} />
                        <SortableTh label="メンバー" field="member" sort={sort} onToggle={toggleSort} theme={theme} borderRight={colBorder}
                            resizer={editable ? <ResizeHandle onPointerDown={e => startResize('member-amount', e)} /> : null} />
                        <SortableTh label="金額"    field="amount" sort={sort} onToggle={toggleSort} theme={theme} borderRight={colBorder}
                            resizer={editable ? <ResizeHandle onPointerDown={e => startResize('amount-memo', e)} /> : null} />
                        <th style={headerCellStyle(theme)}>メモ</th>
                        {editable && <th className="no-print" style={{ padding: 0 }} />}
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.length === 0 && (
                        <tr>
                            <td colSpan={editable ? 5 : 4} style={{
                                padding: '10px 8px', color: theme.subText,
                                fontSize: 12, textAlign: 'center',
                            }}>
                                {editable ? '下の「＋ 行を追加」から金額を入力してください' : '（金額メモなし）'}
                            </td>
                        </tr>
                    )}
                    {sortedRows.map(({ row, origIdx }) => (
                        <tr key={origIdx} style={{ borderBottom: `1px solid ${theme.timelineBar}` }}>
                            <td style={{ ...cellTdStyle, borderRight: colBorder }}>
                                {editable ? (
                                    <input
                                        ref={el => {
                                            const key = `${origIdx}-date`
                                            if (el) inputRefs.current.set(key, el)
                                            else inputRefs.current.delete(key)
                                        }}
                                        type="date"
                                        value={row.date}
                                        onChange={e => updateCell(origIdx, 'date', e.target.value)}
                                        onBlur={commitRows}
                                        onKeyDown={e => handleCellKeyDown(e, origIdx, 'date')}
                                        style={{ ...cellInputStyle, fontVariantNumeric: 'tabular-nums' }}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{
                                        padding: '5px 8px', display: 'block',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}>{row.date || ' '}</span>
                                )}
                            </td>
                            <td style={{ ...cellTdStyle, borderRight: colBorder }}>
                                {editable ? (
                                    <select
                                        ref={el => {
                                            const key = `${origIdx}-member`
                                            if (el) inputRefs.current.set(key, el)
                                            else inputRefs.current.delete(key)
                                        }}
                                        value={row.member}
                                        onChange={e => { updateCell(origIdx, 'member', e.target.value); commitRows() }}
                                        onKeyDown={e => handleCellKeyDown(e, origIdx, 'member')}
                                        style={{
                                            ...cellInputStyle,
                                            appearance: 'none',
                                            paddingRight: 20,
                                            backgroundImage: 'linear-gradient(45deg, transparent 50%, #94a3b8 50%), linear-gradient(135deg, #94a3b8 50%, transparent 50%)',
                                            backgroundPosition: 'right 8px center, right 4px center',
                                            backgroundSize: '4px 4px, 4px 4px',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlur={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    >
                                        <option value="">（未指定）</option>
                                        {members.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                        {/* 既存値がメンバーリストにない場合も保持して表示 */}
                                        {row.member && !members.includes(row.member) && (
                                            <option value={row.member}>{row.member}（リスト外）</option>
                                        )}
                                    </select>
                                ) : (
                                    <span style={{ padding: '5px 8px', display: 'block' }}>{row.member || ' '}</span>
                                )}
                            </td>
                            <td style={{ ...cellTdStyle, borderRight: colBorder }}>
                                {editable ? (
                                    <input
                                        ref={el => {
                                            const key = `${origIdx}-amount`
                                            if (el) inputRefs.current.set(key, el)
                                            else inputRefs.current.delete(key)
                                        }}
                                        type="text"
                                        inputMode="decimal"
                                        value={row.amount}
                                        onChange={e => updateCell(origIdx, 'amount', e.target.value)}
                                        onBlur={commitRows}
                                        onKeyDown={e => handleCellKeyDown(e, origIdx, 'amount')}
                                        placeholder="例: 5000"
                                        style={{ ...cellInputStyle, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{
                                        padding: '5px 8px', display: 'block',
                                        fontVariantNumeric: 'tabular-nums', textAlign: 'right',
                                    }}>{row.amount || ' '}</span>
                                )}
                            </td>
                            <td style={cellTdStyle}>
                                {editable ? (
                                    <textarea
                                        ref={el => {
                                            const key = `${origIdx}-memo`
                                            if (el) { inputRefs.current.set(key, el); autoResize(el) }
                                            else inputRefs.current.delete(key)
                                        }}
                                        rows={1}
                                        value={row.memo}
                                        onChange={e => { updateCell(origIdx, 'memo', e.target.value); autoResize(e.currentTarget) }}
                                        onBlur={commitRows}
                                        onKeyDown={e => handleCellKeyDown(e, origIdx, 'memo')}
                                        placeholder="メモ（Shift+Enter で改行）"
                                        style={cellTextareaStyle}
                                        onFocus={e => { e.currentTarget.style.border = cellFocusStyle }}
                                        onBlurCapture={e => { e.currentTarget.style.border = '1px solid transparent' }}
                                    />
                                ) : (
                                    <span style={{
                                        padding: '5px 8px', display: 'block',
                                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                    }}>{row.memo || ' '}</span>
                                )}
                            </td>
                            {editable && (
                                <td className="no-print" style={{ padding: 0, textAlign: 'center' }}>
                                    <button
                                        type="button"
                                        onClick={() => deleteRow(origIdx)}
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
                top: 0, right: -3,
                width: 7, height: '100%',
                cursor: 'col-resize',
                userSelect: 'none',
                touchAction: 'none',
                zIndex: 3,
            }}
        />
    )
}

function SortableTh({
    label, field, sort, onToggle, theme, borderRight, resizer,
}: {
    label: string
    field: BudgetSort['key']
    sort: BudgetSort | undefined
    onToggle: (key: BudgetSort['key']) => void
    theme: Theme
    borderRight: string
    resizer: React.ReactNode
}) {
    const active = sort?.key === field
    const arrow = active ? (sort!.dir === 'asc' ? '▲' : '▼') : ''
    return (
        <th style={{ ...headerCellStyle(theme), borderRight }}>
            <button
                type="button"
                onClick={() => onToggle(field)}
                title="クリックで昇順／降順／解除を切替"
                style={{
                    background: 'transparent', border: 'none', padding: 0,
                    color: active ? theme.accent : theme.subText,
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
            >
                {label}
                <span style={{ fontSize: 9, lineHeight: 1, opacity: active ? 1 : 0.3 }}>
                    {arrow || '⇅'}
                </span>
            </button>
            {resizer}
        </th>
    )
}
