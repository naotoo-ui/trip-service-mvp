'use client'
import Link from 'next/link'
import { useState } from 'react'
import { themes, type ThemeName } from './bookletThemes'

type Props = {
    shareId: string
    editToken?: string
    themeName: ThemeName
    onThemeChange: (t: ThemeName) => void
}

export default function BookletNav({ shareId, editToken, themeName, onThemeChange }: Props) {
    const [copied, setCopied] = useState(false)

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
                    {/* テーマ切替 */}
                    <div
                        style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '4px 6px', borderRadius: 10,
                            background: '#f1f5f9',
                        }}
                    >
                        <span style={{ fontSize: 11, color: '#64748b', padding: '0 4px' }}>テーマ</span>
                        {(Object.keys(themes) as ThemeName[]).map(t => {
                            const isActive = themeName === t
                            const swatch =
                                t === 'classic' ? '#2563eb' :
                                t === 'warm'    ? '#ea580c' :
                                                  '#111827'
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => onThemeChange(t)}
                                    aria-label={themes[t].label}
                                    title={themes[t].label}
                                    style={{
                                        width: 22, height: 22, borderRadius: 7,
                                        border: isActive ? '2px solid #0f172a' : '2px solid transparent',
                                        background: swatch,
                                        cursor: 'pointer',
                                        padding: 0,
                                        boxShadow: isActive ? '0 0 0 2px white inset' : 'none',
                                        flexShrink: 0,
                                    }}
                                />
                            )
                        })}
                    </div>

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
                            background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                            color: 'white', border: 'none',
                            fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                        }}
                    >
                        🖨️ 印刷 / PDF
                    </button>
                </div>
            </div>
        </nav>
    )
}
