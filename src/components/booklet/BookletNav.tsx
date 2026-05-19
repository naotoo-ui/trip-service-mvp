'use client'
import Link from 'next/link'
import { useState } from 'react'
import { themes, type ThemeName } from './bookletThemes'
import BookletThemePicker from './BookletThemePicker'
import type { ViewMode } from './bookletConfig'

type Props = {
    shareId: string
    editToken?: string
    themeName: ThemeName
    onThemeChange: (t: ThemeName) => void
    mode: ViewMode
    onModeChange: (m: ViewMode) => void
    onOpenSettings: () => void
}

export default function BookletNav({
    shareId, editToken, themeName, onThemeChange,
    mode, onModeChange, onOpenSettings,
}: Props) {
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
                        padding: '10px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 8, flexWrap: 'wrap',
                    }}
                >
                    {/* 左：戻る + モード切替 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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
                            ← 戻る
                        </Link>

                        {/* 画面/印刷 トグル */}
                        <div
                            style={{
                                display: 'inline-flex',
                                background: '#f1f5f9',
                                padding: 3, borderRadius: 9,
                                gap: 3,
                            }}
                            role="tablist"
                            aria-label="表示モード"
                        >
                            {(['screen', 'print'] as const).map(m => {
                                const active = mode === m
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => onModeChange(m)}
                                        style={{
                                            padding: '5px 10px',
                                            borderRadius: 7,
                                            border: 'none',
                                            background: active ? 'white' : 'transparent',
                                            color: active ? '#0f172a' : '#64748b',
                                            fontSize: 12, fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {m === 'screen' ? '画面用' : '印刷用'}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 右：アクション群 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {/* テーマ切替 */}
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
                            {currentTheme.label}
                        </button>

                        {/* 設定 */}
                        <button
                            type="button"
                            onClick={onOpenSettings}
                            aria-label="しおりの設定を開く"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '7px 12px', borderRadius: 10,
                                background: 'white',
                                color: '#475569',
                                border: '1.5px solid #e2e8f0',
                                fontSize: 13, fontWeight: 600,
                                cursor: 'pointer', whiteSpace: 'nowrap',
                            }}
                        >
                            設定
                        </button>

                        {/* シェア */}
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
                            {copied ? '✓ コピー済' : 'シェア'}
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
                            印刷 / PDF
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
