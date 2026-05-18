'use client'
import { useEffect } from 'react'
import { themes, themeOrder, categoryLabels, type ThemeName, type ThemeCategory } from './bookletThemes'

type Props = {
    open: boolean
    onClose: () => void
    selected: ThemeName
    onSelect: (name: ThemeName) => void
}

export default function BookletThemePicker({ open, onClose, selected, onSelect }: Props) {
    // Escape で閉じる
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose])

    // body スクロールロック
    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev }
    }, [open])

    if (!open) return null

    // カテゴリ別にグループ化
    const grouped = new Map<ThemeCategory, ThemeName[]>()
    themeOrder.forEach(n => {
        const cat = themes[n].category
        if (!grouped.has(cat)) grouped.set(cat, [])
        grouped.get(cat)!.push(n)
    })

    function handleSelect(name: ThemeName) {
        const theme = themes[name]
        if (theme.isPremium) {
            // 暫定：プレミアム解放モーダル（未実装）
            alert('このテーマは有料です。プレミアム解放は近日対応予定です。')
            return
        }
        onSelect(name)
        onClose()
    }

    return (
        <div
            className="no-print"
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 16,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: 20,
                    width: '100%', maxWidth: 720,
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                }}
            >
                {/* ヘッダー */}
                <header style={{
                    padding: '18px 22px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #fdf2f8 0%, #fef3c7 100%)',
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                            🎨 しおりテーマを選ぶ
                        </h2>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
                            気分に合わせて選んでね（🔒 マークは有料・準備中）
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="閉じる"
                        style={{
                            width: 34, height: 34, borderRadius: 10,
                            border: 'none', background: 'rgba(15,23,42,0.06)',
                            cursor: 'pointer', fontSize: 18, color: '#475569',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >×</button>
                </header>

                {/* グリッド本体 */}
                <div style={{
                    overflow: 'auto',
                    padding: '20px 22px 28px',
                }}>
                    {Array.from(grouped.entries()).map(([category, names]) => (
                        <section key={category} style={{ marginBottom: 22 }}>
                            <h3 style={{
                                fontSize: 12, fontWeight: 700,
                                letterSpacing: '0.08em',
                                color: '#64748b',
                                margin: '0 0 10px',
                            }}>
                                {categoryLabels[category]}
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: 12,
                            }}>
                                {names.map(name => {
                                    const t = themes[name]
                                    const isSelected = name === selected
                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => handleSelect(name)}
                                            style={{
                                                position: 'relative',
                                                background: 'white',
                                                border: isSelected
                                                    ? `2.5px solid ${t.accent}`
                                                    : '2px solid #e2e8f0',
                                                borderRadius: 14,
                                                padding: 0,
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                transition: 'transform 0.15s, box-shadow 0.15s',
                                                boxShadow: isSelected
                                                    ? `0 6px 20px ${t.accent}33`
                                                    : '0 1px 4px rgba(15,23,42,0.06)',
                                                textAlign: 'left',
                                            }}
                                            onMouseEnter={e => {
                                                if (!isSelected) e.currentTarget.style.transform = 'translateY(-2px)'
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'translateY(0)'
                                            }}
                                        >
                                            {/* プレビュー（カバー風） */}
                                            <div style={{
                                                height: 96,
                                                background: t.coverBg,
                                                position: 'relative',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span style={{
                                                    fontSize: 36,
                                                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                                                }}>
                                                    {t.coverEmoji || t.previewEmoji}
                                                </span>
                                                {/* 装飾エミュレーション（小さく散らす） */}
                                                {t.decoration === 'sakura' && (
                                                    <>
                                                        <span style={{ position: 'absolute', top: 6, left: 8, fontSize: 14, opacity: 0.7 }}>🌸</span>
                                                        <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 12, opacity: 0.6 }}>🌸</span>
                                                    </>
                                                )}
                                                {t.decoration === 'stars' && (
                                                    <>
                                                        <span style={{ position: 'absolute', top: 6, left: 8, fontSize: 12, opacity: 0.8 }}>✨</span>
                                                        <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 12, opacity: 0.7 }}>⭐</span>
                                                    </>
                                                )}
                                                {t.decoration === 'hearts' && (
                                                    <>
                                                        <span style={{ position: 'absolute', top: 6, left: 8, fontSize: 12, opacity: 0.7 }}>💕</span>
                                                        <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 12, opacity: 0.7 }}>💗</span>
                                                    </>
                                                )}
                                                {t.decoration === 'clouds' && (
                                                    <>
                                                        <span style={{ position: 'absolute', top: 4, left: 6, fontSize: 16, opacity: 0.6 }}>☁️</span>
                                                        <span style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 14, opacity: 0.5 }}>☁️</span>
                                                    </>
                                                )}

                                                {/* 有料バッジ */}
                                                {t.isPremium && (
                                                    <span style={{
                                                        position: 'absolute', top: 6, right: 6,
                                                        background: 'rgba(0,0,0,0.65)', color: 'white',
                                                        fontSize: 9, fontWeight: 800,
                                                        padding: '2px 7px', borderRadius: 99,
                                                        letterSpacing: '0.06em',
                                                    }}>
                                                        🔒 PREMIUM
                                                    </span>
                                                )}

                                                {/* 選択中バッジ */}
                                                {isSelected && (
                                                    <span style={{
                                                        position: 'absolute', top: 6, left: 6,
                                                        background: 'white', color: t.accent,
                                                        fontSize: 10, fontWeight: 800,
                                                        padding: '2px 8px', borderRadius: 99,
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                                                    }}>
                                                        ✓ 選択中
                                                    </span>
                                                )}
                                            </div>
                                            {/* テキスト */}
                                            <div style={{ padding: '10px 12px 12px', background: t.pageBg }}>
                                                <p style={{
                                                    margin: 0, fontSize: 13, fontWeight: 700,
                                                    color: t.text,
                                                }}>
                                                    {t.label}
                                                </p>
                                                <p style={{
                                                    margin: '3px 0 0', fontSize: 10.5,
                                                    color: t.subText, lineHeight: 1.4,
                                                }}>
                                                    {t.description}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
