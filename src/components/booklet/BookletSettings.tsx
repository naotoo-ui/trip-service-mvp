'use client'
import { useEffect, useState, useRef } from 'react'
import { type BookletConfig } from './bookletConfig'
import type { FontStyle } from './bookletThemes'
import { getFontFamily } from './bookletFont'

type FontOption = { value: FontStyle | undefined; label: string; description: string }

const FONT_OPTIONS: FontOption[] = [
    { value: undefined,   label: 'テーマ標準',       description: '選択中のテーマが指定したフォント' },
    { value: 'classic',   label: 'Hiragino Sans',    description: 'システム標準のサンセリフ体' },
    { value: 'rounded',   label: 'Kosugi Maru',      description: '丸みのあるやさしい印象' },
    { value: 'serif',     label: 'Shippori Mincho',  description: '上品で読みやすい明朝体' },
]

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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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

                            <MembersManager
                                members={config.members ?? []}
                                onChange={members => onUpdate({ ...config, members })}
                            />

                            <ForeignCurrencySettings config={config} onUpdate={onUpdate} />

                            <div style={{
                                padding: '14px',
                                background: '#f8fafc',
                                borderRadius: 12,
                                border: '1.5px solid #e2e8f0',
                            }}>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                                    しおりのフォント
                                </p>
                                <p style={{ margin: '2px 0 10px', fontSize: 11, color: '#64748b' }}>
                                    しおり全体の本文フォントを指定します
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {FONT_OPTIONS.map(opt => {
                                        const selected = config.fontStyle === opt.value
                                        const preview = opt.value ? getFontFamily(opt.value) : 'inherit'
                                        return (
                                            <button
                                                key={opt.label}
                                                type="button"
                                                onClick={() => onUpdate({ ...config, fontStyle: opt.value })}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px 12px',
                                                    borderRadius: 10,
                                                    border: selected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                                                    background: selected ? '#eff6ff' : 'white',
                                                    cursor: 'pointer',
                                                    fontFamily: preview,
                                                }}
                                            >
                                                <p style={{
                                                    margin: 0, fontSize: 14, fontWeight: 700,
                                                    color: selected ? '#1d4ed8' : '#0f172a',
                                                }}>
                                                    {opt.label}
                                                </p>
                                                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
                                                    {opt.description}
                                                </p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
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

// ──────────── 編集メンバー管理 ────────────

function MembersManager({ members, onChange }: { members: string[]; onChange: (next: string[]) => void }) {
    // 編集中ドラフト（onChange は blur / Enter / 追加・削除 のタイミングでまとめて反映）
    const [drafts, setDrafts] = useState<string[]>(members)
    const lastSavedRef = useRef<string>(JSON.stringify(members))
    const pendingFocusRef = useRef<number | null>(null)
    const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map())

    useEffect(() => {
        const incoming = JSON.stringify(members)
        if (incoming !== lastSavedRef.current) {
            lastSavedRef.current = incoming
            setDrafts(members)
        }
    }, [members])

    useEffect(() => {
        if (pendingFocusRef.current !== null) {
            const el = inputRefs.current.get(pendingFocusRef.current)
            if (el) el.focus()
            pendingFocusRef.current = null
        }
    }, [drafts])

    function commit(next: string[]) {
        const cleaned = next.map(s => s.trim()).filter(s => s.length > 0)
        const serialized = JSON.stringify(cleaned)
        if (serialized !== lastSavedRef.current) {
            lastSavedRef.current = serialized
            onChange(cleaned)
        }
    }

    function updateAt(idx: number, value: string) {
        setDrafts(prev => prev.map((m, i) => i === idx ? value : m))
    }

    function deleteAt(idx: number) {
        const next = drafts.filter((_, i) => i !== idx)
        setDrafts(next)
        commit(next)
    }

    function addMember() {
        const next = [...drafts, '']
        setDrafts(next)
        pendingFocusRef.current = next.length - 1
    }

    return (
        <div style={{
            padding: '14px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1.5px solid #e2e8f0',
        }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                編集メンバー
            </p>
            <p style={{ margin: '2px 0 10px', fontSize: 11, color: '#64748b' }}>
                金額メモのメンバー列で選択できる名前を登録します
            </p>

            {drafts.length === 0 && (
                <p style={{ margin: '0 0 10px', fontSize: 12, color: '#94a3b8' }}>
                    まだメンバーが登録されていません
                </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {drafts.map((name, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                            ref={el => {
                                if (el) inputRefs.current.set(idx, el)
                                else inputRefs.current.delete(idx)
                            }}
                            type="text"
                            value={name}
                            onChange={e => updateAt(idx, e.target.value)}
                            onBlur={() => commit(drafts)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                    e.preventDefault()
                                    ;(e.currentTarget as HTMLInputElement).blur()
                                }
                            }}
                            placeholder="例: 田中太郎"
                            style={{
                                flex: 1, padding: '6px 10px',
                                fontSize: 13, color: '#0f172a',
                                border: '1.5px solid #e2e8f0', borderRadius: 8,
                                background: 'white', outline: 'none',
                                fontFamily: 'inherit',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => deleteAt(idx)}
                            aria-label="メンバーを削除"
                            title="メンバーを削除"
                            style={{
                                width: 28, height: 28, borderRadius: 8,
                                border: 'none', background: 'rgba(15,23,42,0.06)',
                                cursor: 'pointer', color: '#64748b',
                                fontSize: 14, lineHeight: 1,
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >×</button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addMember}
                style={{
                    marginTop: 10,
                    padding: '6px 14px', borderRadius: 8,
                    border: '1.5px dashed #2563eb',
                    background: 'transparent', color: '#2563eb',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
            >
                ＋ メンバーを追加
            </button>
        </div>
    )
}

// ──────────── 外貨モード設定 ────────────

function ForeignCurrencySettings({ config, onUpdate }: { config: BookletConfig; onUpdate: (next: BookletConfig) => void }) {
    const enabled = !!config.foreignCurrencyMode
    const rateMode = config.foreignRateMode ?? 'manual'
    const [rateDraft, setRateDraft] = useState<string>(config.foreignGlobalRate ?? '')
    const lastSavedRateRef = useRef<string>(config.foreignGlobalRate ?? '')

    useEffect(() => {
        const incoming = config.foreignGlobalRate ?? ''
        if (incoming !== lastSavedRateRef.current) {
            lastSavedRateRef.current = incoming
            setRateDraft(incoming)
        }
    }, [config.foreignGlobalRate])

    function commitRate() {
        if (rateDraft !== lastSavedRateRef.current) {
            lastSavedRateRef.current = rateDraft
            onUpdate({ ...config, foreignGlobalRate: rateDraft })
        }
    }

    return (
        <div style={{
            padding: '14px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1.5px solid #e2e8f0',
        }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={e => onUpdate({ ...config, foreignCurrencyMode: e.target.checked })}
                    style={{ width: 16, height: 16, marginTop: 2, accentColor: '#2563eb', flexShrink: 0 }}
                />
                <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                        外貨モード
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
                        金額メモの金額列の前に外貨/レート列を追加します
                    </p>
                </div>
            </label>

            {enabled && (
                <div style={{ marginTop: 12, paddingLeft: 26, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <RateModeOption
                        label="レートを自動設定"
                        description="全ての行に共通のレートを適用"
                        checked={rateMode === 'auto'}
                        onSelect={() => onUpdate({ ...config, foreignRateMode: 'auto' })}
                    />
                    {rateMode === 'auto' && (
                        <div style={{
                            marginLeft: 26, marginTop: -2, marginBottom: 4,
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <label style={{ fontSize: 12, color: '#475569' }}>共通レート</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={rateDraft}
                                onChange={e => setRateDraft(e.target.value)}
                                onBlur={commitRate}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                        e.preventDefault()
                                        ;(e.currentTarget as HTMLInputElement).blur()
                                    }
                                }}
                                placeholder="例: 150"
                                style={{
                                    width: 90, padding: '4px 8px',
                                    fontSize: 13, color: '#0f172a',
                                    border: '1.5px solid #e2e8f0', borderRadius: 6,
                                    background: 'white', outline: 'none',
                                    fontVariantNumeric: 'tabular-nums', textAlign: 'right',
                                }}
                            />
                        </div>
                    )}
                    <RateModeOption
                        label="レートを手動設定"
                        description="行ごとにレートを入力"
                        checked={rateMode === 'manual'}
                        onSelect={() => onUpdate({ ...config, foreignRateMode: 'manual' })}
                    />
                </div>
            )}
        </div>
    )
}

function RateModeOption({ label, description, checked, onSelect }: {
    label: string; description: string; checked: boolean; onSelect: () => void
}) {
    return (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <input
                type="radio"
                checked={checked}
                onChange={onSelect}
                style={{ width: 14, height: 14, marginTop: 3, accentColor: '#2563eb', flexShrink: 0 }}
            />
            <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{label}</p>
                <p style={{ margin: '1px 0 0', fontSize: 11, color: '#64748b' }}>{description}</p>
            </div>
        </label>
    )
}
