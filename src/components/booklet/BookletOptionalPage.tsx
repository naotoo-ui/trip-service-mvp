'use client'
import { useState, useRef, useEffect } from 'react'
import type { Theme } from './bookletThemes'
import { PageDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'
import { OPTIONAL_PAGE_LABELS, OPTIONAL_PAGE_PLACEHOLDERS, type OptionalPageKind } from './bookletConfig'

type Props = {
    pageKind: OptionalPageKind
    theme: Theme
    content: string
    editable: boolean
    onChange: (content: string) => void
}

export default function BookletOptionalPage({ pageKind, theme, content, editable, onChange }: Props) {
    const titleFont = getFontFamily(theme.fontStyle)
    const label = OPTIONAL_PAGE_LABELS[pageKind]

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

            {/* ヘッダー */}
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
                {pageKind === 'packing' ? (
                    <PackingContent
                        theme={theme}
                        content={content}
                        editable={editable}
                        onChange={onChange}
                    />
                ) : (
                    <TextContent
                        theme={theme}
                        content={content}
                        editable={editable}
                        pageKind={pageKind}
                        onChange={onChange}
                    />
                )}
            </div>
        </article>
    )
}

// ──────────── 持ち物リスト（チェックボックス） ────────────

function PackingContent({ theme, content, editable, onChange }: {
    theme: Theme
    content: string
    editable: boolean
    onChange: (content: string) => void
}) {
    const [draft, setDraft] = useState(content)
    const [editMode, setEditMode] = useState(false)
    const [checked, setChecked] = useState<Set<number>>(new Set())
    const lastSavedRef = useRef(content)
    const taRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        if (content !== lastSavedRef.current) {
            setDraft(content)
            lastSavedRef.current = content
            setChecked(new Set())
        }
    }, [content])

    useEffect(() => {
        if (!taRef.current) return
        taRef.current.style.height = 'auto'
        taRef.current.style.height = `${Math.max(160, taRef.current.scrollHeight)}px`
    }, [draft])

    function commit() {
        if (draft !== lastSavedRef.current) {
            lastSavedRef.current = draft
            onChange(draft)
        }
        setEditMode(false)
    }

    const items = draft
        .split('\n')
        .map(l => l.replace(/^[・\-\*]\s*/, '').trim())
        .filter(l => l.length > 0)

    function toggleCheck(idx: number) {
        setChecked(prev => {
            const next = new Set(prev)
            if (next.has(idx)) next.delete(idx)
            else next.add(idx)
            return next
        })
    }

    // リスト編集中
    if (editMode) {
        return (
            <div>
                <p style={{ fontSize: 12, color: theme.subText, margin: '0 0 8px' }}>
                    1行に1アイテムを入力してください
                </p>
                <textarea
                    ref={taRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder={OPTIONAL_PAGE_PLACEHOLDERS.packing}
                    style={{
                        width: '100%', minHeight: 160,
                        padding: 14,
                        border: `1.5px dashed ${theme.timelineBar}`,
                        borderRadius: 12,
                        background: theme.pageBg,
                        fontSize: 14, color: theme.text,
                        fontFamily: 'inherit', lineHeight: 1.7,
                        resize: 'none', outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button
                        type="button"
                        onClick={commit}
                        style={{
                            padding: '7px 18px', borderRadius: 8, border: 'none',
                            background: theme.accent, color: 'white',
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        保存
                    </button>
                    <button
                        type="button"
                        onClick={() => { setDraft(lastSavedRef.current); setEditMode(false) }}
                        style={{
                            padding: '7px 14px', borderRadius: 8,
                            border: `1px solid ${theme.timelineBar}`,
                            background: 'transparent', color: theme.subText,
                            fontSize: 13, cursor: 'pointer',
                        }}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        )
    }

    // チェックボックス表示
    return (
        <div>
            {items.length === 0 ? (
                <p style={{ color: theme.subText, opacity: 0.6, fontSize: 14, padding: '10px 0' }}>
                    {editable ? '右下の「リストを編集」から持ち物を追加できます' : OPTIONAL_PAGE_PLACEHOLDERS.packing}
                </p>
            ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map((item, idx) => {
                        const done = checked.has(idx)
                        return (
                            <li key={idx}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 12px',
                                    background: done ? 'rgba(34,197,94,0.08)' : theme.pageBg,
                                    border: `1.5px solid ${done ? '#86efac' : theme.timelineBar}`,
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    transition: 'background 0.15s, border-color 0.15s',
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={done}
                                        onChange={() => toggleCheck(idx)}
                                        style={{ width: 18, height: 18, accentColor: theme.accent, flexShrink: 0, cursor: 'pointer' }}
                                    />
                                    <span style={{
                                        fontSize: 14, color: theme.text,
                                        textDecoration: done ? 'line-through' : 'none',
                                        opacity: done ? 0.5 : 1,
                                        transition: 'opacity 0.15s',
                                    }}>
                                        {item}
                                    </span>
                                </label>
                            </li>
                        )
                    })}
                </ul>
            )}

            {editable && (
                <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    style={{
                        marginTop: 14,
                        padding: '6px 14px', borderRadius: 8,
                        border: `1.5px dashed ${theme.timelineBar}`,
                        background: 'transparent', color: theme.subText,
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    リストを編集
                </button>
            )}
        </div>
    )
}

// ──────────── 通常テキストコンテンツ ────────────

function TextContent({ theme, content, editable, pageKind, onChange }: {
    theme: Theme
    content: string
    editable: boolean
    pageKind: OptionalPageKind
    onChange: (content: string) => void
}) {
    const [draft, setDraft] = useState(content)
    const lastSavedRef = useRef(content)
    const taRef = useRef<HTMLTextAreaElement | null>(null)
    const placeholder = OPTIONAL_PAGE_PLACEHOLDERS[pageKind]

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

    return editable ? (
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
            background: theme.pageBg,
            borderRadius: 12,
            fontSize: 14, color: theme.text,
            fontFamily: 'inherit', lineHeight: 1.7,
            minHeight: 180,
        }}>
            {content || <span style={{ color: theme.subText, opacity: 0.6 }}>{placeholder}</span>}
        </pre>
    )
}
