'use client'
import { useState, useEffect, useRef } from 'react'
import type { Theme } from '../bookletThemes'
import type { TextAlign } from '../bookletConfig'

type Props = {
    title: string
    content: string
    theme: Theme
    editable: boolean
    minHeight?: number
    // 拡張プロパティ（自由ページ仕様）
    align?: TextAlign
    fontSize?: number
    fontWeight?: number
    color?: string
    imageUrl?: string
    showBorder?: boolean
    onTitleChange?: (title: string) => void
    onContentChange?: (content: string) => void
    onAlignChange?: (align: TextAlign) => void
    onFontSizeChange?: (size: number) => void
    onFontWeightChange?: (weight: number) => void
    onColorChange?: (color: string) => void
    onImageChange?: (imageUrl: string | undefined) => void
    onShowBorderChange?: (show: boolean) => void
}

const FONT_SIZE_MIN = 8
const FONT_SIZE_MAX = 64
const FONT_WEIGHT_OPTIONS = [
    { label: '細', value: 300 },
    { label: '標準', value: 400 },
    { label: '中', value: 500 },
    { label: '太', value: 700 },
    { label: '極太', value: 900 },
]

// インラインで描画される（ページコンテナ内の1セクション）。
// 外側 article / 装飾 / ページ番号は BookletView の page コンテナが提供する。
export default function TextBlock({
    title, content, theme, editable, minHeight,
    align, fontSize, fontWeight, color, imageUrl, showBorder,
    onTitleChange, onContentChange,
    onAlignChange, onFontSizeChange, onFontWeightChange, onColorChange, onImageChange, onShowBorderChange,
}: Props) {
    const [titleDraft, setTitleDraft] = useState(title)
    const [contentDraft, setContentDraft] = useState(content)
    const lastTitleRef = useRef(title)
    const lastContentRef = useRef(content)
    const taRef = useRef<HTMLTextAreaElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    }, [contentDraft, minHeight, fontSize])

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

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = ev => {
            const result = ev.target?.result
            if (typeof result === 'string') {
                onImageChange?.(result)
            }
        }
        reader.readAsDataURL(file)
        e.target.value = ''  // 同じファイルを再選択できるようにリセット
    }

    function handleRemoveImage() {
        onImageChange?.(undefined)
    }

    // 適用するスタイル値（既定値を補完）
    const effectiveAlign: TextAlign = align ?? 'left'
    const effectiveFontSize = fontSize ?? 14
    const effectiveFontWeight = fontWeight ?? 400
    const effectiveColor = color ?? theme.text
    const effectiveShowBorder = showBorder ?? true

    const contentBoxStyle: React.CSSProperties = {
        width: '100%', minHeight: minHeight ?? 120, padding: 12,
        border: effectiveShowBorder ? `1.5px dashed ${theme.timelineBar}` : '1.5px solid transparent',
        borderRadius: 10,
        background: theme.pageBg,
        fontSize: effectiveFontSize, color: effectiveColor,
        fontWeight: effectiveFontWeight,
        textAlign: effectiveAlign,
        fontFamily: 'inherit', lineHeight: 1.7,
        boxSizing: 'border-box',
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

            {/* 編集ツールバー（編集モードのみ表示・印刷時は非表示） */}
            {editable && (
                <div
                    className="booklet-text-toolbar"
                    style={{
                        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
                        padding: '8px 10px', marginBottom: 10,
                        background: theme.paperBg ?? '#fafafa',
                        borderRadius: 8,
                        border: `1px solid ${theme.paperBorder ?? '#e5e7eb'}`,
                    }}
                >
                    {/* 寄せ（Canva 風：押下で left → center → right → left を循環） */}
                    <AlignCycleButton align={effectiveAlign} onChange={a => onAlignChange?.(a)} />

                    {/* フォントサイズ（Canva 風: A/A アイコン押下でスライダー＋±ポップオーバー） */}
                    <FontSizeControl
                        value={effectiveFontSize}
                        onChange={v => onFontSizeChange?.(v)}
                    />

                    {/* フォント太さ */}
                    <select
                        value={effectiveFontWeight}
                        onChange={e => onFontWeightChange?.(Number(e.target.value))}
                        style={selectStyle}
                        title="太さ"
                    >
                        {FONT_WEIGHT_OPTIONS.map(w => (
                            <option key={w.value} value={w.value}>{w.label}</option>
                        ))}
                    </select>

                    {/* カラー */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="文字色">
                        <span style={{ fontSize: 11, color: theme.subText ?? '#6b7280' }}>色</span>
                        <input
                            type="color"
                            value={effectiveColor.startsWith('#') ? effectiveColor : '#000000'}
                            onChange={e => onColorChange?.(e.target.value)}
                            style={{
                                width: 28, height: 24, padding: 0, border: '1px solid #d1d5db',
                                borderRadius: 4, cursor: 'pointer',
                            }}
                        />
                    </label>

                    {/* 画像挿入 */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={toolButtonBaseStyle}
                        title="画像を挿入"
                    >
                        🖼 画像
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    {imageUrl && (
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            style={{ ...toolButtonBaseStyle, color: '#dc2626', borderColor: '#fca5a5' }}
                            title="画像を削除"
                        >× 画像削除</button>
                    )}

                    {/* 枠線表示切替 */}
                    <ToolButton
                        active={effectiveShowBorder}
                        onClick={() => onShowBorderChange?.(!effectiveShowBorder)}
                        title="点線枠の表示/非表示"
                    >
                        {effectiveShowBorder ? '⊟ 枠あり' : '☐ 枠なし'}
                    </ToolButton>
                </div>
            )}

            {/* 画像（編集モード・閲覧モード共通で表示） */}
            {imageUrl && (
                <div style={{ marginBottom: 12, textAlign: effectiveAlign }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt=""
                        style={{
                            maxWidth: '100%', maxHeight: 320,
                            borderRadius: 8, display: 'inline-block',
                        }}
                    />
                </div>
            )}

            <div>
                {editable ? (
                    <textarea
                        ref={taRef}
                        value={contentDraft}
                        onChange={e => setContentDraft(e.target.value)}
                        onBlur={commitContent}
                        placeholder="自由に入力できます..."
                        style={{ ...contentBoxStyle, resize: 'none', outline: 'none' }}
                    />
                ) : (
                    <pre style={{
                        ...contentBoxStyle,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        margin: 0,
                    }}>
                        {content || <span style={{ color: theme.subText, opacity: 0.6 }}>（内容なし）</span>}
                    </pre>
                )}
            </div>
        </div>
    )
}

// ──────────── ツールバー部品 ────────────

const toolButtonBaseStyle: React.CSSProperties = {
    padding: '4px 8px', fontSize: 12, fontWeight: 600,
    border: '1px solid #d1d5db', borderRadius: 6,
    background: 'white', color: '#374151',
    cursor: 'pointer', whiteSpace: 'nowrap',
}

const selectStyle: React.CSSProperties = {
    padding: '4px 6px', fontSize: 12,
    border: '1px solid #d1d5db', borderRadius: 6,
    background: 'white', color: '#374151',
    cursor: 'pointer',
    fontFamily: 'inherit',
}

function ToolButton({ active, onClick, title, children }: {
    active: boolean
    onClick: () => void
    title: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            style={{
                padding: '4px 8px', fontSize: 12, fontWeight: 600,
                border: 'none', borderRadius: 4,
                background: active ? '#2563eb' : 'transparent',
                color: active ? 'white' : '#374151',
                cursor: 'pointer', whiteSpace: 'nowrap',
            }}
        >{children}</button>
    )
}

// ──────────── 寄せ循環ボタン（Canva 風） ────────────

const NEXT_ALIGN: Record<TextAlign, TextAlign> = {
    left: 'center',
    center: 'right',
    right: 'left',
}
const ALIGN_NEXT_LABEL: Record<TextAlign, string> = {
    left: '左寄せ（クリックでセンターに）',
    center: 'センター寄せ（クリックで右に）',
    right: '右寄せ（クリックで左に）',
}

function AlignCycleButton({ align, onChange }: {
    align: TextAlign
    onChange: (align: TextAlign) => void
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(NEXT_ALIGN[align])}
            title={ALIGN_NEXT_LABEL[align]}
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 28, padding: 0,
                border: '1px solid #d1d5db', borderRadius: 6,
                background: 'white', color: '#374151',
                cursor: 'pointer',
            }}
        >
            <AlignIcon align={align} />
        </button>
    )
}

// ──────────── フォントサイズ コントロール ────────────

function FontSizeControl({ value, onChange }: {
    value: number
    onChange: (v: number) => void
}) {
    const [open, setOpen] = useState(false)
    const wrapRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!open) return
        function onDocClick(e: MouseEvent) {
            if (!wrapRef.current) return
            if (wrapRef.current.contains(e.target as Node)) return
            setOpen(false)
        }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [open])

    function clamp(v: number): number {
        return Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, Math.round(v)))
    }

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                title="フォントサイズ"
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    gap: 2, height: 28, padding: '0 8px',
                    border: '1px solid #d1d5db', borderRadius: 6,
                    background: open ? '#eff6ff' : 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                }}
            >
                <span style={{ fontSize: 10, fontWeight: 700, lineHeight: 1 }}>A</span>
                <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>A</span>
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                        background: 'white', border: '1px solid #d1d5db', borderRadius: 10,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                        padding: 12, zIndex: 100,
                        minWidth: 220,
                        display: 'flex', flexDirection: 'column', gap: 10,
                    }}
                >
                    <div style={{
                        fontSize: 11, fontWeight: 700, color: '#6b7280',
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>フォントサイズ</div>

                    {/* スライダー */}
                    <input
                        type="range"
                        min={FONT_SIZE_MIN}
                        max={FONT_SIZE_MAX}
                        step={1}
                        value={value}
                        onChange={e => onChange(clamp(Number(e.target.value)))}
                        style={{ width: '100%' }}
                    />

                    {/* ± + 数値表示 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                            type="button"
                            onClick={() => onChange(clamp(value - 1))}
                            aria-label="サイズを小さく"
                            style={stepperButtonStyle}
                        >−</button>
                        <input
                            type="number"
                            min={FONT_SIZE_MIN}
                            max={FONT_SIZE_MAX}
                            value={value}
                            onChange={e => onChange(clamp(Number(e.target.value) || value))}
                            style={{
                                width: 56, height: 30, textAlign: 'center',
                                border: '1px solid #d1d5db', borderRadius: 6,
                                fontSize: 13, fontWeight: 600, color: '#111827',
                                fontFamily: 'inherit', outline: 'none',
                                MozAppearance: 'textfield',
                            }}
                        />
                        <span style={{ fontSize: 12, color: '#6b7280' }}>px</span>
                        <button
                            type="button"
                            onClick={() => onChange(clamp(value + 1))}
                            aria-label="サイズを大きく"
                            style={stepperButtonStyle}
                        >＋</button>
                    </div>
                </div>
            )}
        </div>
    )
}

const stepperButtonStyle: React.CSSProperties = {
    width: 30, height: 30, padding: 0,
    border: '1px solid #d1d5db', borderRadius: 6,
    background: 'white', color: '#374151',
    fontSize: 16, fontWeight: 700, lineHeight: 1,
    cursor: 'pointer',
}

function AlignIcon({ align }: { align: TextAlign }) {
    // 4本の横線で寄せを表現するアイコン。SVG 16x16
    // 各行の長さと x 起点を寄せに合わせて調整
    const lineY = [3, 6.5, 10, 13.5]
    const lengths = [12, 8, 11, 6]

    function xFor(len: number): number {
        if (align === 'left') return 2
        if (align === 'right') return 14 - len
        return (16 - len) / 2  // center
    }

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            {lineY.map((y, i) => (
                <rect key={i} x={xFor(lengths[i])} y={y} width={lengths[i]} height={1.4} rx={0.5} />
            ))}
        </svg>
    )
}
