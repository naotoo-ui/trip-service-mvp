'use client'
import { useState, useEffect, useRef } from 'react'
import type { Theme } from '../bookletThemes'

type Props = {
    title: string
    content: string
    theme: Theme
    editable: boolean
    minHeight?: number
    onTitleChange?: (title: string) => void
    onContentChange?: (content: string) => void
}

// インラインで描画される（ページコンテナ内の1セクション）。
// 外側 article / 装飾 / ページ番号は BookletView の page コンテナが提供する。
export default function TextBlock({ title, content, theme, editable, minHeight, onTitleChange, onContentChange }: Props) {
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
        taRef.current.style.height = `${Math.max(minHeight ?? 120, taRef.current.scrollHeight)}px`
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
        <div className="booklet-text booklet-inline-block" style={{ position: 'relative', zIndex: 2 }}>
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

            <div>
                {editable ? (
                    <textarea
                        ref={taRef}
                        value={contentDraft}
                        onChange={e => setContentDraft(e.target.value)}
                        onBlur={commitContent}
                        placeholder="自由に入力できます..."
                        style={{
                            width: '100%', minHeight: minHeight ?? 120, padding: 12,
                            border: `1.5px dashed ${theme.timelineBar}`,
                            borderRadius: 10,
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
                        margin: 0, padding: 12,
                        background: theme.pageBg, borderRadius: 10,
                        fontSize: 14, color: theme.text,
                        fontFamily: 'inherit', lineHeight: 1.7,
                        minHeight: minHeight ?? 120,
                    }}>
                        {content || <span style={{ color: theme.subText, opacity: 0.6 }}>（内容なし）</span>}
                    </pre>
                )}
            </div>
        </div>
    )
}
