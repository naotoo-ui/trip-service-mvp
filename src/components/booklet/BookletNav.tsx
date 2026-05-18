'use client'
import Link from 'next/link'
import { useState } from 'react'
import { themes, type ThemeName } from './bookletThemes'
import BookletThemePicker from './BookletThemePicker'

type Props = {
    shareId: string
    editToken?: string
    themeName: ThemeName
    onThemeChange: (t: ThemeName) => void
}

export default function BookletNav({ shareId, editToken, themeName, onThemeChange }: Props) {
    const [copied, setCopied] = useState(false)
    const [pickerOpen, setPickerOpen] = useState(false)
    const currentTheme = themes[themeName]

    function handlePrint() {
        if (typeof window !== 'undefined') window.print()
    }

    async function handleCopyShareUrl() {
        const url = `${window.location.origin}/trips/${shareId}/booklet`
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const calendarUrl = editToken
        ? `/trips/${shareId}?edit=${editToken}`
        : `/trips/${shareId}`

    return (
        <>
            <nav
                className="no-print"
                style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                }}
            >
                <div
                    style={{
                        maxWidth: 800, margin: '0 auto',
                        padding: '12px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 8, flexWrap: 'wrap',
                    }}
                >
                    {/* 左：カレンダーに戻る */}
                    <Link
                        href={calendarUrl}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '7px 12px', borderRadius: 10,
                            background: '#f1f5f9', color: '#475569',
                            textDecoration: 'none', fontSize: 13, fontWeight: 600,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        ← カレンダーに戻る
                    </Link>

                    {/* 右：アクション群 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {/* テーマ切替ボタン */}
                        <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '7px 12px', borderRadius: 10,
                                background: 'white',
                                color: '#475569',
                                border: '1.5px solid #e2e8f0',
                                fontSize: 13, fontWeight: 600,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                            }}
                            title={`現在のテーマ: ${currentTheme.label}`}
                        >
                            <span style={{
                                display: 'inline-block', width: 16, height: 16,
                                borderRadius: 5, background: currentTheme.coverBg,
                                border: '1px solid rgba(0,0,0,0.12)',
                            }} />
                            🎨 {currentTheme.label}
                        </button>

                        {/* 共有リンクコピー */}
                        <button
                            type="button"
                            onClick={handleCopyShareUrl}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '7px 12px', borderRadius: 10,
                                background: copied ? '#10b981' : 'white',
                                color: copied ? 'white' : '#475569',
                                border: copied ? 'none' : '1.5px solid #e2e8f0',
                                fontSize: 13, fontWeight: 600,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                transition: 'background-color 0.15s, color 0.15s',
                            }}
                        >
                            {copied ? '✓ コピー済み' : '🔗 シェア'}
                        </button>

                        {/* 印刷 */}
                        <button
                            type="button"
                            onClick={handlePrint}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '7px 14px', borderRadius: 10,
                                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                                color: 'white', border: 'none',
                                fontSize: 13, fontWeight: 700,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                                boxShadow: '0 2px 10px rgba(236, 72, 153, 0.35)',
                            }}
                        >
                            🖨️ 印刷 / PDF
                        </button>
                    </div>
                </div>
            </nav>

            <BookletThemePicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                selected={themeName}
                onSelect={onThemeChange}
            />
        </>
    )
}
