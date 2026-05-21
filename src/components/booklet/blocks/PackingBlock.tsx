'use client'
import { useState, useEffect, useRef } from 'react'
import type { Theme } from '../bookletThemes'
import { PageDecoration } from '../BookletDecorations'
import { getFontFamily } from '../bookletFont'

type Props = {
    title: string
    content: string
    columns: 1 | 2 | 3
    theme: Theme
    editable: boolean
    minHeight?: number
    pageNumber?: number
    onTitleChange?: (title: string) => void
    onContentChange?: (content: string) => void
    onColumnsChange?: (cols: 1 | 2 | 3) => void
}

function parseItems(text: string): string[] {
    return text.split('\n')
        .map(l => l.replace(/^[・\-\*]\s*/, '').trim())
        .filter(Boolean)
}

export default function PackingBlock({ title, content, columns, theme, editable, minHeight, pageNumber, onTitleChange, onContentChange, onColumnsChange }: Props) {
    const titleFont = getFontFamily(theme.fontStyle)
    const [titleDraft, setTitleDraft] = useState(title)
    const [editItems, setEditItems] = useState<string[]>(() => parseItems(content))
    const [checked, setChecked] = useState<Set<number>>(new Set())
    const itemsRef = useRef<string[]>(parseItems(content))
    const lastContentRef = useRef(content)
    const lastTitleRef = useRef(title)

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
        const cleaned = itemsRef.current.filter(i => i.trim())
        const joined = cleaned.join('\n')
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
    }

    function deleteItem(idx: number) {
        const next = itemsRef.current.filter((_, i) => i !== idx)
        setEditItems(next)
        itemsRef.current = next
        const joined = next.filter(i => i.trim()).join('\n')
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

    return (
        <article
            className="booklet-page booklet-packing"
            style={{
                background: theme.paperBg,
                border: theme.paperBorder,
                borderRadius: 20,
                padding: '28px 26px',
                boxShadow: theme.cardStyle === 'soft'
                    ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                    : '0 2px 12px rgba(15, 23, 42, 0.04)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: titleFont,
                minHeight: minHeight ?? undefined,
            }}
        >
            <PageDecoration kind={theme.decoration} accent={theme.accent} />

            <header style={{
                position: 'relative', zIndex: 2,
                paddingBottom: 14, marginBottom: 16,
                borderBottom: `2px solid ${theme.accent}`,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 12,
            }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: theme.accent, margin: '0 0 6px',
                    }}>
                        Checklist
                    </p>
                    {editable ? (
                        <input
                            type="text"
                            value={titleDraft}
                            onChange={e => setTitleDraft(e.target.value)}
                            onBlur={commitTitle}
                            onKeyDown={e => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur() }}
                            placeholder="タイトル"
                            style={{
                                fontSize: 24, fontWeight: 800, color: theme.text,
                                margin: 0, letterSpacing: '-0.01em',
                                width: '100%', border: 'none', background: 'transparent',
                                outline: 'none', fontFamily: 'inherit', padding: '2px 0',
                            }}
                        />
                    ) : (
                        <h2 style={{
                            fontSize: 24, fontWeight: 800, color: theme.text,
                            margin: 0, letterSpacing: '-0.01em',
                        }}>{title}</h2>
                    )}
                </div>
                {/* 列数トグル */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: theme.subText, marginRight: 2 }}>列</span>
                    {([1, 2, 3] as const).map(n => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onColumnsChange?.(n)}
                            disabled={!onColumnsChange}
                            style={{
                                width: 28, height: 26, borderRadius: 6,
                                border: columns === n
                                    ? `2px solid ${theme.accent}`
                                    : '1.5px solid #e2e8f0',
                                background: columns === n ? theme.accent : 'transparent',
                                color: columns === n ? 'white' : theme.subText,
                                fontSize: 12, fontWeight: 700,
                                cursor: onColumnsChange ? 'pointer' : 'default',
                            }}
                        >{n}</button>
                    ))}
                </div>
            </header>

            <div style={{
                position: 'relative', zIndex: 2,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '5px 10px',
            }}>
                {editItems.length === 0 && editable && (
                    <p style={{
                        gridColumn: `span ${columns}`,
                        color: theme.subText, fontSize: 13,
                        margin: '8px 0',
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
                                display: 'flex', alignItems: 'center', gap: 7,
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
                                    width: 15, height: 15,
                                    accentColor: theme.accent,
                                    flexShrink: 0, cursor: 'pointer',
                                }}
                            />
                            {editable ? (
                                <input
                                    type="text"
                                    value={item}
                                    onChange={e => updateItem(idx, e.target.value)}
                                    onBlur={commitItems}
                                    placeholder="アイテム名"
                                    style={{
                                        flex: 1, minWidth: 0,
                                        border: 'none', background: 'transparent',
                                        fontSize: 13,
                                        color: done ? theme.subText : theme.text,
                                        textDecoration: done ? 'line-through' : 'none',
                                        outline: 'none', fontFamily: 'inherit',
                                    }}
                                />
                            ) : (
                                <span style={{
                                    flex: 1, minWidth: 0,
                                    fontSize: 13,
                                    color: done ? theme.subText : theme.text,
                                    textDecoration: done ? 'line-through' : 'none',
                                    opacity: done ? 0.6 : 1,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>{item}</span>
                            )}
                            {editable && (
                                <button
                                    type="button"
                                    onClick={() => deleteItem(idx)}
                                    style={{
                                        flexShrink: 0, width: 16, height: 16,
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
                        position: 'relative', zIndex: 2,
                    }}
                >
                    ＋ アイテムを追加
                </button>
            )}

            {pageNumber !== undefined && (
                <p style={{
                    textAlign: 'center', fontSize: 11, letterSpacing: '0.1em',
                    fontVariantNumeric: 'tabular-nums', color: theme.subText,
                    margin: '16px 0 -4px', position: 'relative', zIndex: 2,
                }}>— {pageNumber} —</p>
            )}
        </article>
    )
}
