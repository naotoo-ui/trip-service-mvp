'use client'
import { useState, useEffect, useRef } from 'react'
import type { Theme } from './bookletThemes'
import { PageDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'
import {
    OPTIONAL_PAGE_LABELS, OPTIONAL_PAGE_PLACEHOLDERS,
    type OptionalPageKind,
} from './bookletConfig'

type Props = {
    pageKind: OptionalPageKind
    theme: Theme
    content: string
    editable: boolean
    columns: 1 | 2 | 3
    onColumnsChange: (cols: 1 | 2 | 3) => void
    onChange: (content: string) => void
}

// A5冊子モード基準：ヘッダーを除いた1列あたりの最大行数
const ITEMS_PER_COL = 14

function parseItems(text: string): string[] {
    return text.split('\n')
        .map(l => l.replace(/^[・\-\*]\s*/, '').trim())
        .filter(Boolean)
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    if (arr.length === 0) return [[]]
    const chunks: T[][] = []
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
    return chunks
}

export default function BookletOptionalPage(props: Props) {
    if (props.pageKind === 'packing') return <PackingPage {...props} />
    return <SinglePage {...props} />
}

// ──────────── 持ち物リスト（チェックボックス・複数ページ対応） ────────────

function PackingPage({ theme, content, editable, columns, onColumnsChange, onChange }: Props) {
    const titleFont = getFontFamily(theme.fontStyle)
    const [editItems, setEditItems] = useState<string[]>(() => parseItems(content))
    const [checked, setChecked] = useState<Set<number>>(new Set())
    const itemsRef = useRef<string[]>(parseItems(content))
    const lastContentRef = useRef(content)

    useEffect(() => {
        if (content !== lastContentRef.current) {
            lastContentRef.current = content
            const parsed = parseItems(content)
            setEditItems(parsed)
            itemsRef.current = parsed
            setChecked(new Set())
        }
    }, [content])

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
            onChange(joined)
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
        onChange(joined)
    }

    function toggleCheck(idx: number) {
        setChecked(prev => {
            const next = new Set(prev)
            if (next.has(idx)) next.delete(idx)
            else next.add(idx)
            return next
        })
    }

    const itemsPerPage = ITEMS_PER_COL * columns
    const chunks = chunkArray(editItems, itemsPerPage)

    const articleBase: React.CSSProperties = {
        background: theme.paperBg,
        border: theme.paperBorder,
        borderRadius: 20,
        padding: '32px 28px',
        marginBottom: 24,
        boxShadow: theme.cardStyle === 'soft'
            ? '0 4px 20px rgba(15, 23, 42, 0.06)'
            : '0 2px 12px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: titleFont,
    }

    return (
        <>
            {chunks.map((pageItems, pageIdx) => {
                const isFirst = pageIdx === 0
                const isLast = pageIdx === chunks.length - 1
                const offset = pageIdx * itemsPerPage

                return (
                    <article
                        key={pageIdx}
                        className="booklet-page booklet-optional"
                        data-page-kind="packing"
                        style={articleBase}
                    >
                        <PageDecoration kind={theme.decoration} accent={theme.accent} />

                        {/* ヘッダー */}
                        <header style={{
                            position: 'relative', zIndex: 2,
                            paddingBottom: 14, marginBottom: 16,
                            borderBottom: `2px solid ${theme.accent}`,
                        }}>
                            {isFirst ? (
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{
                                            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                                            textTransform: 'uppercase', color: theme.accent, margin: '0 0 6px',
                                        }}>
                                            Optional Page
                                        </p>
                                        <h2 style={{
                                            fontSize: 24, fontWeight: 800, color: theme.text,
                                            margin: 0, letterSpacing: '-0.01em',
                                        }}>
                                            持ち物リスト
                                        </h2>
                                    </div>
                                    {/* 列数トグル（全ユーザー操作可能） */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                                        <span style={{ fontSize: 11, color: theme.subText, marginRight: 2 }}>列</span>
                                        {([1, 2, 3] as const).map(n => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => onColumnsChange(n)}
                                                style={{
                                                    width: 28, height: 26, borderRadius: 6,
                                                    border: columns === n
                                                        ? `2px solid ${theme.accent}`
                                                        : '1.5px solid #e2e8f0',
                                                    background: columns === n ? theme.accent : 'transparent',
                                                    color: columns === n ? 'white' : theme.subText,
                                                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                                }}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p style={{ fontSize: 13, fontWeight: 700, color: theme.subText, margin: 0 }}>
                                    持ち物リスト（続き）
                                </p>
                            )}
                        </header>

                        {/* アイテムグリッド */}
                        <div style={{
                            position: 'relative', zIndex: 2,
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columns}, 1fr)`,
                            gap: '5px 10px',
                        }}>
                            {pageItems.length === 0 && editable && (
                                <p style={{
                                    gridColumn: `span ${columns}`,
                                    color: theme.subText, fontSize: 13,
                                    margin: '8px 0',
                                }}>
                                    下の「＋ アイテムを追加」から持ち物を追加してください
                                </p>
                            )}
                            {pageItems.map((item, localIdx) => {
                                const globalIdx = offset + localIdx
                                const done = checked.has(globalIdx)
                                return (
                                    <label
                                        key={globalIdx}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 7,
                                            padding: '6px 8px',
                                            background: done ? 'rgba(34,197,94,0.07)' : 'transparent',
                                            border: `1px solid ${done ? '#86efac' : theme.timelineBar}`,
                                            borderRadius: 7,
                                            cursor: editable ? 'default' : 'pointer',
                                            transition: 'background 0.15s, border-color 0.15s',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={done}
                                            onChange={() => toggleCheck(globalIdx)}
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
                                                onChange={e => updateItem(globalIdx, e.target.value)}
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
                                            }}>
                                                {item}
                                            </span>
                                        )}
                                        {editable && (
                                            <button
                                                type="button"
                                                onClick={() => deleteItem(globalIdx)}
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

                        {/* 追加ボタン（最終ページのみ・編集者のみ） */}
                        {isLast && editable && (
                            <button
                                type="button"
                                onClick={addItem}
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
                    </article>
                )
            })}
        </>
    )
}

// ──────────── 通常のオプションページ（テキストエリア） ────────────

function SinglePage({ pageKind, theme, content, editable, onChange }: Props) {
    const titleFont = getFontFamily(theme.fontStyle)
    const label = OPTIONAL_PAGE_LABELS[pageKind]
    const placeholder = OPTIONAL_PAGE_PLACEHOLDERS[pageKind]
    const [draft, setDraft] = useState(content)
    const lastSavedRef = useRef(content)
    const taRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        if (content !== lastSavedRef.current) {
            setDraft(content)
            lastSavedRef.current = content
        }
    }, [content])

    function commit() {
        if (draft !== lastSavedRef.current) {
            lastSavedRef.current = draft
            onChange(draft)
        }
    }

    useEffect(() => {
        if (!taRef.current) return
        taRef.current.style.height = 'auto'
        taRef.current.style.height = `${Math.max(180, taRef.current.scrollHeight)}px`
    }, [draft])

    return (
        <article
            className="booklet-page booklet-optional"
            data-page-kind={pageKind}
            style={{
                background: theme.paperBg,
                border: theme.paperBorder,
                borderRadius: 20,
                padding: '32px 28px',
                marginBottom: 24,
                boxShadow: theme.cardStyle === 'soft'
                    ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                    : '0 2px 12px rgba(15, 23, 42, 0.04)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: titleFont,
            }}
        >
            <PageDecoration kind={theme.decoration} accent={theme.accent} />

            <header style={{
                position: 'relative', zIndex: 2,
                paddingBottom: 16, marginBottom: 20,
                borderBottom: `2px solid ${theme.accent}`,
            }}>
                <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: theme.accent, margin: '0 0 6px',
                }}>
                    Optional Page
                </p>
                <h2 style={{
                    fontSize: 24, fontWeight: 800, color: theme.text,
                    margin: 0, letterSpacing: '-0.01em',
                }}>
                    {label}
                </h2>
            </header>

            <div style={{ position: 'relative', zIndex: 2 }}>
                {editable ? (
                    <textarea
                        ref={taRef}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onBlur={commit}
                        placeholder={placeholder}
                        style={{
                            width: '100%', minHeight: 180, padding: 14,
                            border: `1.5px dashed ${theme.timelineBar}`,
                            borderRadius: 12,
                            background: theme.pageBg,
                            fontSize: 14, color: theme.text,
                            fontFamily: 'inherit', lineHeight: 1.7,
                            resize: 'none', outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                ) : (
                    <pre style={{
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        margin: 0, padding: 14,
                        background: theme.pageBg, borderRadius: 12,
                        fontSize: 14, color: theme.text,
                        fontFamily: 'inherit', lineHeight: 1.7,
                        minHeight: 180,
                    }}>
                        {content || <span style={{ color: theme.subText, opacity: 0.6 }}>{placeholder}</span>}
                    </pre>
                )}
            </div>
        </article>
    )
}
