'use client'
import { useState, useRef, useEffect } from 'react'
import type { Trip } from '@/types'
import type { Theme } from './bookletThemes'
import { CoverDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'

type Props = {
    trip: Trip
    theme: Theme
    editable?: boolean
    editToken?: string
}

export default function BookletCover({ trip, theme, editable, editToken }: Props) {
    const [localTitle, setLocalTitle] = useState(trip.title)
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(trip.title)
    const inputRef = useRef<HTMLInputElement>(null)

    const isDark = theme.coverText === 'white' || theme.coverText === '#ffffff'
    const titleFont = getFontFamily(theme.fontStyle)

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
            inputRef.current?.select()
        }
    }, [editing])

    async function saveTitle() {
        const trimmed = draft.trim() || localTitle
        setDraft(trimmed)
        setEditing(false)
        if (trimmed === localTitle) return
        setLocalTitle(trimmed)
        try {
            await fetch(`/api/trips/${trip.share_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itinerary: trip.itinerary,
                    title: trimmed,
                    edit_token: editToken,
                }),
            })
        } catch {}
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') { e.preventDefault(); saveTitle() }
        if (e.key === 'Escape') { setDraft(localTitle); setEditing(false) }
    }

    const titleStyle: React.CSSProperties = {
        fontSize: 'clamp(28px, 5.5vw, 48px)',
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: theme.fontStyle === 'rounded' ? '0' : '-0.02em',
        textShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.25)'
            : '0 1px 2px rgba(255,255,255,0.4)',
    }

    return (
        <article
            className="booklet-page booklet-cover"
            style={{
                background: theme.coverBg,
                color: theme.coverText,
                borderRadius: 24,
                padding: '56px 36px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 28,
                minHeight: 520,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15)',
                fontFamily: titleFont,
                textAlign: 'center',
            }}
        >
            <CoverDecoration kind={theme.decoration} accent={theme.accent} />

            {/* 装飾円 */}
            <div style={{
                position: 'absolute', top: -80, right: -60,
                width: 240, height: 240, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -60, left: -40,
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
            }} />

            {/* タイトル */}
            <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 560 }}>
                {editing ? (
                    <input
                        ref={inputRef}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={handleKeyDown}
                        style={{
                            ...titleStyle,
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'}`,
                            color: theme.coverText,
                            outline: 'none',
                            textAlign: 'center',
                            fontFamily: 'inherit',
                            padding: '4px 8px',
                            boxSizing: 'border-box',
                        }}
                    />
                ) : (
                    <h1
                        onClick={editable ? () => { setDraft(localTitle); setEditing(true) } : undefined}
                        style={{
                            ...titleStyle,
                            margin: 0,
                            cursor: editable ? 'pointer' : 'default',
                            padding: '4px 8px',
                            borderRadius: 8,
                            transition: 'background 0.15s',
                        }}
                        title={editable ? 'クリックしてタイトルを編集' : undefined}
                    >
                        {localTitle}
                    </h1>
                )}

                {editable && !editing && (
                    <p
                        className="no-print"
                        style={{
                            marginTop: 14, fontSize: 11,
                            opacity: 0.5, letterSpacing: '0.06em',
                            color: theme.coverText,
                        }}
                    >
                        クリックして編集
                    </p>
                )}
            </div>
        </article>
    )
}
