'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { Theme } from '../bookletThemes'

type Props = {
    title: string
    content: string
    columns: 1 | 2 | 3
    theme: Theme
    editable: boolean
    minHeight?: number
    onTitleChange?: (title: string) => void
    onContentChange?: (content: string) => void
    onColumnsChange?: (cols: 1 | 2 | 3) => void
}

// 項目区切りは新フォーマットでは "\n\n"（項目内改行を許容するため）。
// 旧フォーマット（"\n" 区切り）は \n\n を含まないので自動判別して互換読み込み。
function parseItems(text: string): string[] {
    if (!text) return []
    if (text.includes('\n\n')) {
        return text.split('\n\n').map(s => s.replace(/^[・\-\*]\s*/, '')).filter(s => s.length > 0)
    }
    // 旧フォーマット: 1行=1項目
    return text.split('\n').map(l => l.replace(/^[・\-\*]\s*/, '')).filter(s => s.length > 0)
}

function joinItems(items: string[]): string {
    return items.filter(s => s.length > 0).join('\n\n')
}

export default function PackingBlock({ title, content, columns, theme, editable, minHeight, onTitleChange, onContentChange, onColumnsChange }: Props) {
    const [titleDraft, setTitleDraft] = useState(title)
    const [editItems, setEditItems] = useState<string[]>(() => parseItems(content))
    const [checked, setChecked] = useState<Set<number>>(new Set())
    const itemsRef = useRef<string[]>(parseItems(content))
    const lastContentRef = useRef(content)
    const lastTitleRef = useRef(title)
    const taRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map())
    const pendingFocusRef = useRef<number | null>(null)

    useEffect(() => {
        if (title !== lastTitleRef.current) { setTitleDraft(title); lastTitleRef.current = title }
    }, [title])

    useEffect(() => {
        if (content !== lastContentRef.current) {
            lastContentRef.current = content
            const parsed = parseItems(content)
            setEditItems(parsed)
            itemsRef.current = parsed
            setChecked(new Set())
        }
    }, [content])

    // テキストエリアの高さを内容に合わせる
    const autoResize = useCallback((el: HTMLTextAreaElement) => {
        el.style.height = 'auto'
        el.style.height = `${Math.max(el.scrollHeight, 22)}px`
    }, [])

    // 全項目に対する初期/再レンダリング時のリサイズ＋ pending フォーカス
    useEffect(() => {
        taRefs.current.forEach(el => autoResize(el))
        if (pendingFocusRef.current !== null) {
            const el = taRefs.current.get(pendingFocusRef.current)
            if (el) {
                el.focus()
                // カーソルを末尾へ
                const len = el.value.length
                el.setSelectionRange(len, len)
            }
            pendingFocusRef.current = null
        }
    }, [editItems, autoResize])

    function commitTitle() {
        if (titleDraft !== lastTitleRef.current) {
            lastTitleRef.current = titleDraft
            onTitleChange?.(titleDraft)
        }
    }

    function updateItem(idx: number, text: string) {
        const next = [...itemsRef.current]
        next[idx] = text
        setEditItems(next)
        itemsRef.current = next
    }

    function commitItems() {
        const cleaned = itemsRef.current.filter(i => i.length > 0)
        const joined = joinItems(cleaned)
        if (joined !== lastContentRef.current) {
            lastContentRef.current = joined
            onContentChange?.(joined)
        }
        setEditItems(cleaned)
        itemsRef.current = cleaned
    }

    function addItem() {
        const next = [...itemsRef.current, '']
        setEditItems(next)
        itemsRef.current = next
        pendingFocusRef.current = next.length - 1
    }

    function deleteItem(idx: number) {
        const next = itemsRef.current.filter((_, i) => i !== idx)
        setEditItems(next)
        itemsRef.current = next
        const joined = joinItems(next)
        lastContentRef.current = joined
        onContentChange?.(joined)
    }

    function toggleCheck(idx: number) {
        setChecked(prev => {
            const next = new Set(prev)
            if (next.has(idx)) next.delete(idx)
            else next.add(idx)
            return next
        })
    }

    function handleItemKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>, idx: number) {
        // Shift+Enter / Alt+Enter / Ctrl+Enter / Cmd+Enter は通常の改行（textarea default）
        if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            // 新しい空項目を idx+1 に挿入してフォーカス
            const next = [...itemsRef.current]
            next.splice(idx + 1, 0, '')
            setEditItems(next)
            itemsRef.current = next
            pendingFocusRef.current = idx + 1
            return
        }
        // 空項目で Backspace → 削除して前の項目末尾にフォーカス
        if (e.key === 'Backspace' && itemsRef.current[idx] === '' && itemsRef.current.length > 1) {
            e.preventDefault()
            const next = itemsRef.current.filter((_, i) => i !== idx)
            setEditItems(next)
            itemsRef.current = next
            const joined = joinItems(next)
            lastContentRef.current = joined
            onContentChange?.(joined)
            pendingFocusRef.current = Math.max(0, idx - 1)
            return
        }
    }

    return (
        <div className="booklet-packing booklet-inline-block" style={{ position: 'relative', zIndex: 2, minHeight: minHeight ?? undefined }}>
            <header style={{
                paddingBottom: 10, marginBottom: 12,
                borderBottom: `1.5px solid ${theme.accent}`,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 12,
            }}>
                <div style={{ flex: 1, minWidth: 0 }}>
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
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: theme.subText, marginRight: 2 }}>列</span>
                    {([1, 2, 3] as const).map(n => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onColumnsChange?.(n)}
                            disabled={!onColumnsChange}
                            style={{
                                width: 26, height: 24, borderRadius: 6,
                                border: columns === n
                                    ? `2px solid ${theme.accent}`
                                    : '1.5px solid #e2e8f0',
                                background: columns === n ? theme.accent : 'transparent',
                                color: columns === n ? 'white' : theme.subText,
                                fontSize: 11, fontWeight: 700,
                                cursor: onColumnsChange ? 'pointer' : 'default',
                            }}
                        >{n}</button>
                    ))}
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '5px 10px',
            }}>
                {editItems.length === 0 && editable && (
                    <p style={{
                        gridColumn: `span ${columns}`,
                        color: theme.subText, fontSize: 13,
                        margin: '4px 0',
                    }}>
                        下の「＋ アイテムを追加」から持ち物を追加してください
                    </p>
                )}
                {editItems.map((item, idx) => {
                    const done = checked.has(idx)
                    return (
                        <label
                            key={idx}
                            style={{
                                display: 'flex', alignItems: 'flex-start', gap: 7,
                                padding: '6px 8px',
                                background: done ? 'rgba(34,197,94,0.07)' : 'transparent',
                                border: `1px solid ${done ? '#86efac' : theme.timelineBar}`,
                                borderRadius: 7,
                                cursor: editable ? 'default' : 'pointer',
                                breakInside: 'avoid',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={done}
                                onChange={() => toggleCheck(idx)}
                                style={{
                                    width: 15, height: 15, marginTop: 3,
                                    accentColor: theme.accent,
                                    flexShrink: 0, cursor: 'pointer',
                                }}
                            />
                            {editable ? (
                                <textarea
                                    ref={el => {
                                        if (el) {
                                            taRefs.current.set(idx, el)
                                            // 直後のレンダで autoResize されるが、初期表示の chip にも追従させる
                                            autoResize(el)
                                        } else {
                                            taRefs.current.delete(idx)
                                        }
                                    }}
                                    value={item}
                                    onChange={e => {
                                        updateItem(idx, e.target.value)
                                        autoResize(e.currentTarget)
                                    }}
                                    onKeyDown={e => handleItemKeyDown(e, idx)}
                                    onBlur={commitItems}
                                    placeholder="アイテム名（Enter で次の項目・Shift+Enter で改行）"
                                    rows={1}
                                    style={{
                                        flex: 1, minWidth: 0,
                                        border: 'none', background: 'transparent',
                                        fontSize: 13,
                                        color: done ? theme.subText : theme.text,
                                        textDecoration: done ? 'line-through' : 'none',
                                        outline: 'none', fontFamily: 'inherit',
                                        resize: 'none', overflow: 'hidden',
                                        lineHeight: 1.5,
                                        padding: 0,
                                    }}
                                />
                            ) : (
                                <span style={{
                                    flex: 1, minWidth: 0,
                                    fontSize: 13,
                                    color: done ? theme.subText : theme.text,
                                    textDecoration: done ? 'line-through' : 'none',
                                    opacity: done ? 0.6 : 1,
                                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                    lineHeight: 1.5,
                                }}>{item}</span>
                            )}
                            {editable && (
                                <button
                                    type="button"
                                    onClick={() => deleteItem(idx)}
                                    style={{
                                        flexShrink: 0, width: 16, height: 16, marginTop: 3,
                                        border: 'none', background: 'transparent',
                                        color: '#94a3b8', cursor: 'pointer',
                                        fontSize: 13, lineHeight: 1, padding: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >×</button>
                            )}
                        </label>
                    )
                })}
            </div>

            {editable && (
                <button
                    type="button"
                    onClick={addItem}
                    className="no-print"
                    style={{
                        marginTop: 10,
                        padding: '5px 12px', borderRadius: 7,
                        border: `1.5px dashed ${theme.accent}`,
                        background: 'transparent', color: theme.accent,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                >
                    ＋ アイテムを追加
                </button>
            )}
        </div>
    )
}
