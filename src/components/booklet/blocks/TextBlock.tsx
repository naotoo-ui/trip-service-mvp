'use client'
import { useState, useEffect, useRef } from 'react'
import type { Theme } from '../bookletThemes'
import { PageDecoration } from '../BookletDecorations'
import { getFontFamily } from '../bookletFont'

type Props = {
    title: string
    content: string
    theme: Theme
    editable: boolean
    minHeight?: number
    pageNumber?: number
    onTitleChange?: (title: string) => void
    onContentChange?: (content: string) => void
}

export default function TextBlock({ title, content, theme, editable, minHeight, pageNumber, onTitleChange, onContentChange }: Props) {
    const titleFont = getFontFamily(theme.fontStyle)
    const [titleDraft, setTitleDraft] = useState(title)
    const [contentDraft, setContentDraft] = useState(content)
    const lastTitleRef = useRef(title)
    const lastContentRef = useRef(content)
    const taRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        if (title !== lastTitleRef.current) { setTitleDraft(title); lastTitleRef.current = title }
    }, [title])
    useEffect(() => {
        if (content !== lastContentRef.current) { setContentDraft(content); lastContentRef.current = content }
    }, [content])

    useEffect(() => {
        if (!taRef.current) return
        taRef.current.style.height = 'auto'
        taRef.current.style.height = `${Math.max(minHeight ?? 140, taRef.current.scrollHeight)}px`
    }, [contentDraft, minHeight])

    function commitTitle() {
        if (titleDraft !== lastTitleRef.current) {
            lastTitleRef.current = titleDraft
            onTitleChange?.(titleDraft)
        }
    }
    function commitContent() {
        if (contentDraft !== lastContentRef.current) {
            lastContentRef.current = contentDraft
            onContentChange?.(contentDraft)
        }
    }

    return (
        <article
            className="booklet-page booklet-text"
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
            }}>
                <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: theme.accent, margin: '0 0 6px',
                }}>
                    Page
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
                            outline: 'none', fontFamily: 'inherit',
                            padding: '2px 0',
                        }}
                    />
                ) : (
                    <h2 style={{
                        fontSize: 24, fontWeight: 800, color: theme.text,
                        margin: 0, letterSpacing: '-0.01em',
                    }}>
                        {title}
                    </h2>
                )}
            </header>

            <div style={{ position: 'relative', zIndex: 2 }}>
                {editable ? (
                    <textarea
                        ref={taRef}
                        value={contentDraft}
                        onChange={e => setContentDraft(e.target.value)}
                        onBlur={commitContent}
                        placeholder="自由に入力できます..."
                        style={{
                            width: '100%', minHeight: minHeight ?? 140, padding: 14,
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
                        minHeight: minHeight ?? 140,
                    }}>
                        {content || <span style={{ color: theme.subText, opacity: 0.6 }}>（内容なし）</span>}
                    </pre>
                )}
            </div>

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
