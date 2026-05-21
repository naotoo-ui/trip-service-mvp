'use client'
import { useEffect } from 'react'
import { type BookletConfig } from './bookletConfig'

type Props = {
    open: boolean
    onClose: () => void
    config: BookletConfig
    onUpdate: (next: BookletConfig) => void
}

const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#94a3b8',
    margin: '0 0 10px',
}

const checkboxRow: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px',
    background: '#f8fafc',
    borderRadius: 12,
    border: '1.5px solid #e2e8f0',
    cursor: 'pointer',
}

export default function BookletSettings({ open, onClose, config, onUpdate }: Props) {
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, onClose])

    useEffect(() => {
        if (!open) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev }
    }, [open])

    if (!open) return null

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
                    width: '100%', maxWidth: 480,
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                    maxHeight: '90vh',
                }}
            >
                {/* ヘッダー */}
                <header style={{
                    padding: '18px 22px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    flexShrink: 0,
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                            しおりの設定
                        </h2>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
                            表示オプションを調整
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
                        }}
                    >×</button>
                </header>

                {/* コンテンツ */}
                <div style={{ padding: '24px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

                    {/* ── 全体設定 ── */}
                    <section>
                        <p style={sectionLabel}>全体設定</p>
                        <label style={checkboxRow}>
                            <input
                                type="checkbox"
                                checked={config.showPageNumbers}
                                onChange={e => onUpdate({ ...config, showPageNumbers: e.target.checked })}
                                style={{ width: 16, height: 16, accentColor: '#2563eb', flexShrink: 0 }}
                            />
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                                    ページ番号を表示する
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
                                    表紙・背表紙を除く各ページに番号を振ります
                                </p>
                            </div>
                        </label>
                    </section>

                    {/* ── スマホ/PC 表示用設定 ── */}
                    <section>
                        <p style={sectionLabel}>スマホ / PC 表示用設定</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', padding: '10px 14px', background: '#f8fafc', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                            設定項目はありません
                        </p>
                    </section>

                    {/* ── 印刷用設定 ── */}
                    <section>
                        <p style={sectionLabel}>印刷用設定</p>
                        <label style={checkboxRow}>
                            <input
                                type="checkbox"
                                checked={config.showUrlQrCode}
                                onChange={e => onUpdate({ ...config, showUrlQrCode: e.target.checked })}
                                style={{ width: 16, height: 16, accentColor: '#2563eb', flexShrink: 0 }}
                            />
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                                    URL を QR コードで表示
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
                                    スポットに追加した URL を右側にQRコードで印字します
                                </p>
                            </div>
                        </label>
                    </section>

                </div>
            </div>
        </div>
    )
}
