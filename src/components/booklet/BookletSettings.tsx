'use client'
import { useEffect } from 'react'
import {
    OPTIONAL_PAGE_KINDS, OPTIONAL_PAGE_LABELS,
    allInsertPositions, positionToLabel,
    type BookletConfig, type OptionalPageKind, type ViewMode, type InsertPosition,
} from './bookletConfig'

type Props = {
    open: boolean
    onClose: () => void
    config: BookletConfig
    daysCount: number
    onUpdate: (next: BookletConfig) => void
}

export default function BookletSettings({ open, onClose, config, daysCount, onUpdate }: Props) {
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

    const mode: ViewMode = config.activeMode
    const modeCfg = config[mode]
    const positions = allInsertPositions(daysCount)

    function setShowPageNumbers(v: boolean) {
        onUpdate({ ...config, showPageNumbers: v })
    }

    function setActiveMode(m: ViewMode) {
        onUpdate({ ...config, activeMode: m })
    }

    function setEnabled(k: OptionalPageKind, enabled: boolean) {
        onUpdate({
            ...config,
            [mode]: {
                ...modeCfg,
                optionalPages: {
                    ...modeCfg.optionalPages,
                    [k]: { ...modeCfg.optionalPages[k], enabled },
                },
            },
        })
    }

    function setPosition(k: OptionalPageKind, position: InsertPosition) {
        onUpdate({
            ...config,
            [mode]: {
                ...modeCfg,
                optionalPages: {
                    ...modeCfg.optionalPages,
                    [k]: { ...modeCfg.optionalPages[k], position },
                },
            },
        })
    }

    function positionKey(p: InsertPosition): string {
        if (p.kind === 'after-day') return `after-day-${p.dayIdx}`
        return p.kind
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
                    width: '100%', maxWidth: 640,
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
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                            しおりの設定
                        </h2>
                        <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
                            ページ構成・追加ページ・印刷モードを調整
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

                <div style={{ overflow: 'auto', padding: '20px 22px 28px' }}>
                    {/* モード切替 */}
                    <Section title="編集対象モード">
                        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                            モードごとに独立した構成を保存できます。「印刷用」で印刷時に余計なページを省くなど。
                        </p>
                        <div style={{
                            display: 'inline-flex',
                            background: '#f1f5f9',
                            padding: 4, borderRadius: 10,
                            gap: 4,
                        }}>
                            {(['screen', 'print'] as const).map(m => {
                                const active = mode === m
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setActiveMode(m)}
                                        style={{
                                            padding: '7px 14px',
                                            borderRadius: 8,
                                            border: 'none',
                                            background: active ? 'white' : 'transparent',
                                            color: active ? '#0f172a' : '#64748b',
                                            fontSize: 13, fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                        }}
                                    >
                                        {m === 'screen' ? '画面表示' : '印刷'}
                                    </button>
                                )
                            })}
                        </div>
                    </Section>

                    {/* ページ番号 */}
                    <Section title="ページ番号">
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px',
                            background: '#f8fafc',
                            borderRadius: 10,
                            border: '1.5px solid #e2e8f0',
                            cursor: 'pointer',
                        }}>
                            <input
                                type="checkbox"
                                checked={config.showPageNumbers}
                                onChange={e => setShowPageNumbers(e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: '#2563eb' }}
                            />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                                ページ番号を表示する
                            </span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>
                                表紙・背表紙を除く各ページに振る
                            </span>
                        </label>
                    </Section>

                    {/* 追加ページ */}
                    <Section title="追加ページ">
                        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                            チェックを入れたページが、選択した位置にしおりに挿入されます。
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {OPTIONAL_PAGE_KINDS.map(k => {
                                const entry = modeCfg.optionalPages[k]
                                return (
                                    <div
                                        key={k}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '10px 12px',
                                            background: entry.enabled ? '#eff6ff' : '#f8fafc',
                                            border: `1.5px solid ${entry.enabled ? '#bfdbfe' : '#e2e8f0'}`,
                                            borderRadius: 10,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <label style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            flex: '1 1 180px', cursor: 'pointer',
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={entry.enabled}
                                                onChange={e => setEnabled(k, e.target.checked)}
                                                style={{ width: 16, height: 16, accentColor: '#2563eb', flexShrink: 0 }}
                                            />
                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                                                {OPTIONAL_PAGE_LABELS[k]}
                                            </span>
                                        </label>
                                        <select
                                            value={positionKey(entry.position)}
                                            onChange={e => {
                                                const found = positions.find(p => positionKey(p.value) === e.target.value)
                                                if (found) setPosition(k, found.value)
                                            }}
                                            disabled={!entry.enabled}
                                            style={{
                                                padding: '6px 8px',
                                                fontSize: 12,
                                                borderRadius: 8,
                                                border: '1px solid #cbd5e1',
                                                background: 'white',
                                                color: entry.enabled ? '#0f172a' : '#94a3b8',
                                                cursor: entry.enabled ? 'pointer' : 'not-allowed',
                                                flex: '1 1 130px',
                                                minWidth: 130,
                                            }}
                                            aria-label={`${OPTIONAL_PAGE_LABELS[k]} の挿入位置`}
                                        >
                                            {positions.map(p => (
                                                <option key={positionKey(p.value)} value={positionKey(p.value)}>
                                                    {p.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            })}
                        </div>
                        {/* 現在の構成サマリー */}
                        <p style={{
                            margin: '14px 0 0', padding: '8px 12px',
                            background: '#fefce8', border: '1px solid #fde68a',
                            borderRadius: 8, fontSize: 11, color: '#a16207',
                        }}>
                            ※ 各追加ページの中身は、しおり本体のページを直接クリックして編集できます。
                        </p>
                    </Section>

                    {/* リセット */}
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '14px 0 0' }}>
                        現在のモード「{mode === 'screen' ? '画面表示' : '印刷'}」の設定を編集中（{
                            Object.values(modeCfg.optionalPages).filter(e => e.enabled).length
                        }ページ有効・位置: {positionToLabel({ kind: 'after-cover' }, daysCount)} など）
                    </p>
                </div>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section style={{ marginBottom: 24 }}>
            <h3 style={{
                fontSize: 12, fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#475569',
                margin: '0 0 10px',
                textTransform: 'uppercase',
            }}>
                {title}
            </h3>
            {children}
        </section>
    )
}
