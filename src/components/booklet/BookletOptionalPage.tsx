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
    const [draft, setDraft] = useState(content)
    const lastSavedRef = useRef(content)
    const taRef = useRef<HTMLTextAreaElement | null>(null)
    const titleFont = getFontFamily(theme.fontStyle)
    const label = OPTIONAL_PAGE_LABELS[pageKind]
    const placeholder = OPTIONAL_PAGE_PLACEHOLDERS[pageKind]

    // 外部からの content 変更を取り込む
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

    // テキストエリアの高さ自動調整
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

            {/* 編集可：テキストエリア / 編集不可：固定表示 */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                {editable ? (
                    <textarea
                        ref={taRef}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onBlur={commit}
                        placeholder={placeholder}
                        className="no-print-empty"
                        style={{
                            width: '100%',
                            minHeight: 180,
                            padding: 14,
                            border: `1.5px dashed ${theme.timelineBar}`,
                            borderRadius: 12,
                            background: theme.pageBg,
                            fontSize: 14,
                            color: theme.text,
                            fontFamily: 'inherit',
                            lineHeight: 1.7,
                            resize: 'none',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                ) : (
                    <pre style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        margin: 0,
                        padding: 14,
                        background: theme.pageBg,
                        borderRadius: 12,
                        fontSize: 14,
                        color: theme.text,
                        fontFamily: 'inherit',
                        lineHeight: 1.7,
                        minHeight: 180,
                    }}>
                        {content || <span style={{ color: theme.subText, opacity: 0.6 }}>{placeholder}</span>}
                    </pre>
                )}
            </div>
        </article>
    )
}
