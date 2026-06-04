'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Theme } from '../bookletThemes'
import type { TextAlign } from '../bookletConfig'

// ──────────── 旧プレーンテキスト ↔ HTML の互換 ────────────
// 既存ブロックの content は \n 区切りのプレーンテキスト。
// 新規編集後は HTML（<span style=...> / <br> / <div> 等）として保存される。
function plainTextToHtml(text: string): string {
    if (!text) return ''
    // 既に HTML タグを含むなら HTML 扱い
    if (/<[a-zA-Z]/.test(text)) return text
    return text
        .split('\n')
        .map(line => line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;'))
        .join('<br>')
}

// rgb(r, g, b) → #RRGGBB（その他の入力はそのまま返す）
function rgbStringToHex(rgb: string): string {
    const m = /^rgba?\(([0-9.]+),\s*([0-9.]+),\s*([0-9.]+)/.exec(rgb)
    if (!m) return rgb
    const [, r, g, b] = m
    const toHex = (n: string) => Math.round(Number(n)).toString(16).padStart(2, '0').toUpperCase()
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// 選択範囲を指定スタイルの <span> で包む（fontSize/fontWeight 等カスタムスタイル用）
function wrapSelectionWith(styleProps: Record<string, string>): boolean {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false
    const range = sel.getRangeAt(0)
    const span = document.createElement('span')
    for (const [k, v] of Object.entries(styleProps)) {
        span.style.setProperty(k, v)
    }
    span.appendChild(range.extractContents())
    range.insertNode(span)
    // 再選択
    sel.removeAllRanges()
    const r = document.createRange()
    r.selectNodeContents(span)
    sel.addRange(r)
    return true
}

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
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    onTitleChange?: (title: string) => void
    onContentChange?: (content: string) => void
    onAlignChange?: (align: TextAlign) => void
    onFontSizeChange?: (size: number) => void
    onFontWeightChange?: (weight: number) => void
    onColorChange?: (color: string) => void
    onImageChange?: (imageUrl: string | undefined) => void
    onShowBorderChange?: (show: boolean) => void
    onBoldChange?: (bold: boolean) => void
    onItalicChange?: (italic: boolean) => void
    onUnderlineChange?: (underline: boolean) => void
    onStrikethroughChange?: (strike: boolean) => void
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
    bold, italic, underline, strikethrough,
    onTitleChange, onContentChange,
    onAlignChange, onFontSizeChange, onFontWeightChange, onColorChange, onImageChange, onShowBorderChange,
    onBoldChange, onItalicChange, onUnderlineChange, onStrikethroughChange,
}: Props) {
    const [titleDraft, setTitleDraft] = useState(title)
    const lastTitleRef = useRef(title)
    const lastContentRef = useRef(content)
    const editorRef = useRef<HTMLDivElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // 選択範囲の状態（B/I/U/S とハイライト色・サイズ・太さ）
    const [selState, setSelState] = useState<{
        bold: boolean; italic: boolean; underline: boolean; strikethrough: boolean;
        color: string | null; fontSize: number | null; fontWeight: number | null;
    }>({
        bold: false, italic: false, underline: false, strikethrough: false,
        color: null, fontSize: null, fontWeight: null,
    })

    useEffect(() => {
        if (title !== lastTitleRef.current) { setTitleDraft(title); lastTitleRef.current = title }
    }, [title])

    // 外部の content 更新で editor の innerHTML を同期（初回マウント時 + props 更新時）
    useEffect(() => {
        if (!editorRef.current) return
        if (content !== lastContentRef.current) {
            editorRef.current.innerHTML = plainTextToHtml(content)
            lastContentRef.current = content
        }
    }, [content])
    // マウント直後に初期化（content が空文字でも実行されるよう別 useEffect）
    useEffect(() => {
        if (!editorRef.current) return
        if (editorRef.current.innerHTML === '') {
            editorRef.current.innerHTML = plainTextToHtml(content)
            lastContentRef.current = content
        }
        // 初期化は1回だけ
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function commitTitle() {
        if (titleDraft !== lastTitleRef.current) {
            lastTitleRef.current = titleDraft
            onTitleChange?.(titleDraft)
        }
    }
    function commitContent() {
        const html = editorRef.current?.innerHTML ?? ''
        if (html !== lastContentRef.current) {
            lastContentRef.current = html
            onContentChange?.(html)
        }
    }

    // 選択範囲のスタイル状態を更新（toolbar の active 表示用）
    const updateSelState = useCallback(() => {
        if (!editorRef.current) return
        // editor の中に選択がないなら何もしない
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return
        const anchor = sel.anchorNode
        if (!anchor || !editorRef.current.contains(anchor)) return

        const node = anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : (anchor as Element)
        let cs: CSSStyleDeclaration | null = null
        if (node && node instanceof Element) {
            cs = window.getComputedStyle(node)
        }
        try {
            setSelState({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikethrough: document.queryCommandState('strikeThrough'),
                color: cs ? rgbStringToHex(cs.color) : null,
                fontSize: cs ? Math.round(parseFloat(cs.fontSize)) : null,
                fontWeight: cs ? Number(cs.fontWeight) || 400 : null,
            })
        } catch { /* execCommand 未対応の環境は無視 */ }
    }, [])

    useEffect(() => {
        document.addEventListener('selectionchange', updateSelState)
        return () => document.removeEventListener('selectionchange', updateSelState)
    }, [updateSelState])

    // execCommand 系のラッパー（styleWithCSS でインラインスタイルに）
    function exec(cmd: string, value?: string) {
        if (!editorRef.current) return
        editorRef.current.focus()
        try {
            document.execCommand('styleWithCSS', false, 'true')
            document.execCommand(cmd, false, value)
        } catch { /* noop */ }
        commitContent()
        updateSelState()
    }
    function applyBold()          { exec('bold') }
    function applyItalic()        { exec('italic') }
    function applyUnderline()     { exec('underline') }
    function applyStrikethrough() { exec('strikeThrough') }
    function applyColor(c: string) { exec('foreColor', c) }
    function applyFontSize(px: number) {
        if (!editorRef.current) return
        editorRef.current.focus()
        wrapSelectionWith({ 'font-size': `${px}px` })
        commitContent()
        updateSelState()
    }
    function applyFontWeight(weight: number) {
        if (!editorRef.current) return
        editorRef.current.focus()
        wrapSelectionWith({ 'font-weight': String(weight) })
        commitContent()
        updateSelState()
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
    const effectiveBold = bold ?? false
    const effectiveItalic = italic ?? false
    const effectiveUnderline = underline ?? false
    const effectiveStrikethrough = strikethrough ?? false

    // bold が ON のときは fontWeight を最低 700 に引き上げる
    const computedFontWeight = effectiveBold
        ? Math.max(700, effectiveFontWeight)
        : effectiveFontWeight

    // 下線・取り消し線の合成
    const decorations: string[] = []
    if (effectiveUnderline) decorations.push('underline')
    if (effectiveStrikethrough) decorations.push('line-through')
    const textDecorationLine = decorations.length > 0 ? decorations.join(' ') : 'none'

    const contentBoxStyle: React.CSSProperties = {
        width: '100%', minHeight: minHeight ?? 120, padding: 12,
        border: effectiveShowBorder ? `1.5px dashed ${theme.timelineBar}` : '1.5px solid transparent',
        borderRadius: 10,
        background: theme.pageBg,
        fontSize: effectiveFontSize, color: effectiveColor,
        fontWeight: computedFontWeight,
        fontStyle: effectiveItalic ? 'italic' : 'normal',
        textDecorationLine,
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

                    {/* フォントサイズ（選択範囲に適用） */}
                    <FontSizeControl
                        value={selState.fontSize ?? effectiveFontSize}
                        onChange={v => applyFontSize(v)}
                    />

                    {/* 文字色（選択範囲に適用） */}
                    <ColorPickerControl
                        value={selState.color ?? effectiveColor}
                        onChange={c => applyColor(c)}
                    />

                    {/* 太字 / 斜体 / 下線 / 取り消し線（選択範囲に適用） */}
                    <StyleToggleButton
                        active={selState.bold}
                        onClick={applyBold}
                        title="太字"
                        style={{ fontWeight: 800 }}
                    >B</StyleToggleButton>
                    <StyleToggleButton
                        active={selState.italic}
                        onClick={applyItalic}
                        title="斜体"
                        style={{ fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}
                    >I</StyleToggleButton>
                    <StyleToggleButton
                        active={selState.underline}
                        onClick={applyUnderline}
                        title="下線"
                        style={{ textDecorationLine: 'underline', fontWeight: 700 }}
                    >U</StyleToggleButton>
                    <StyleToggleButton
                        active={selState.strikethrough}
                        onClick={applyStrikethrough}
                        title="取り消し線"
                        style={{ textDecorationLine: 'line-through', fontWeight: 700 }}
                    >S</StyleToggleButton>

                    {/* フォント太さ（選択範囲に適用） */}
                    <select
                        value={selState.fontWeight ?? effectiveFontWeight}
                        onChange={e => applyFontWeight(Number(e.target.value))}
                        style={selectStyle}
                        title="太さ"
                    >
                        {FONT_WEIGHT_OPTIONS.map(w => (
                            <option key={w.value} value={w.value}>{w.label}</option>
                        ))}
                    </select>

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
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={commitContent}
                        onKeyUp={updateSelState}
                        onMouseUp={updateSelState}
                        data-placeholder="自由に入力できます..."
                        className="booklet-text-editor"
                        style={{
                            ...contentBoxStyle,
                            outline: 'none',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}
                    />
                ) : (
                    <div
                        ref={editorRef}
                        style={{
                            ...contentBoxStyle,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            margin: 0,
                        }}
                        // 閲覧モード：HTML を表示（owner のみが編集する想定。XSS リスクは公開機能実装時に
                        // sanitize で対応する＝公開/非公開分離タスクと同時着手予定）
                        dangerouslySetInnerHTML={{ __html: plainTextToHtml(content) || `<span style="color:${theme.subText};opacity:.6">（内容なし）</span>` }}
                    />
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

// 太字 / 斜体 / 下線 / 取り消し線 のトグルボタン（B I U S スタイル）
function StyleToggleButton({ active, onClick, title, style, children }: {
    active: boolean
    onClick: () => void
    title: string
    style?: React.CSSProperties
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, padding: 0,
                border: '1px solid #d1d5db', borderRadius: 6,
                background: active ? '#2563eb' : 'white',
                color: active ? 'white' : '#374151',
                cursor: 'pointer', fontSize: 14, lineHeight: 1,
                fontFamily: 'inherit',
                ...style,
            }}
        >{children}</button>
    )
}

// ──────────── 寄せ循環ボタン（Canva 風） ────────────

const NEXT_ALIGN: Record<TextAlign, TextAlign> = {
    left: 'center',
    center: 'right',
    right: 'justify',
    justify: 'left',
}
const ALIGN_NEXT_LABEL: Record<TextAlign, string> = {
    left: '左寄せ（クリックでセンターに）',
    center: 'センター寄せ（クリックで右に）',
    right: '右寄せ（クリックで両端揃えに）',
    justify: '両端揃え（クリックで左寄せに）',
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
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

    useEffect(() => {
        if (!open || !buttonRef.current) return
        function recalc() {
            if (!buttonRef.current) return
            const rect = buttonRef.current.getBoundingClientRect()
            const popoverWidth = 240
            const popoverHeightApprox = 160
            const margin = 8

            let left = rect.left
            if (left + popoverWidth > window.innerWidth - margin) {
                left = window.innerWidth - popoverWidth - margin
            }
            if (left < margin) left = margin

            let top = rect.bottom + 6
            if (top + popoverHeightApprox > window.innerHeight - margin) {
                top = Math.max(margin, rect.top - popoverHeightApprox - 6)
            }
            setPos({ top, left })
        }
        recalc()
        window.addEventListener('resize', recalc)
        window.addEventListener('scroll', recalc, true)
        return () => {
            window.removeEventListener('resize', recalc)
            window.removeEventListener('scroll', recalc, true)
        }
    }, [open])

    useEffect(() => {
        if (!open) return
        function onDocClick(e: MouseEvent) {
            const t = e.target as Node
            if (buttonRef.current?.contains(t)) return
            if (popoverRef.current?.contains(t)) return
            setOpen(false)
        }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [open])

    function clamp(v: number): number {
        return Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, Math.round(v)))
    }

    return (
        <>
            <button
                ref={buttonRef}
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

            {open && typeof document !== 'undefined' && createPortal(
                <div
                    ref={popoverRef}
                    style={{
                        position: 'fixed', top: pos.top, left: pos.left,
                        background: 'white', border: '1px solid #d1d5db', borderRadius: 10,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                        padding: 12, zIndex: 9999,
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
                </div>,
                document.body,
            )}
        </>
    )
}

const stepperButtonStyle: React.CSSProperties = {
    width: 30, height: 30, padding: 0,
    border: '1px solid #d1d5db', borderRadius: 6,
    background: 'white', color: '#374151',
    fontSize: 16, fontWeight: 700, lineHeight: 1,
    cursor: 'pointer',
}

// ──────────── カラーピッカー コントロール ────────────

const COLOR_PRESETS: string[] = [
    '#000000', '#5C5C5C', '#9A9A9A', '#D1D1D1', '#FFFFFF',
    '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE',
    '#30B0C7', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55',
    '#8B4513', '#FF7F50', '#FFB6C1', '#A0522D', '#2E8B57',
]

function ColorPickerControl({ value, onChange }: {
    value: string
    onChange: (color: string) => void
}) {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

    // ボタン位置を元にポップオーバーの座標を画面内に収めて計算
    useEffect(() => {
        if (!open || !buttonRef.current) return
        function recalc() {
            if (!buttonRef.current) return
            const rect = buttonRef.current.getBoundingClientRect()
            const popoverWidth = 240
            const popoverHeightApprox = 340
            const margin = 8

            let left = rect.left
            if (left + popoverWidth > window.innerWidth - margin) {
                left = window.innerWidth - popoverWidth - margin
            }
            if (left < margin) left = margin

            let top = rect.bottom + 6
            if (top + popoverHeightApprox > window.innerHeight - margin) {
                // 下側に出ないなら上側に出す
                top = Math.max(margin, rect.top - popoverHeightApprox - 6)
            }
            setPos({ top, left })
        }
        recalc()
        window.addEventListener('resize', recalc)
        window.addEventListener('scroll', recalc, true)
        return () => {
            window.removeEventListener('resize', recalc)
            window.removeEventListener('scroll', recalc, true)
        }
    }, [open])

    // 外側クリックで閉じる（ボタンとポップオーバーは除く）
    useEffect(() => {
        if (!open) return
        function onDocClick(e: MouseEvent) {
            const t = e.target as Node
            if (buttonRef.current?.contains(t)) return
            if (popoverRef.current?.contains(t)) return
            setOpen(false)
        }
        document.addEventListener('mousedown', onDocClick)
        return () => document.removeEventListener('mousedown', onDocClick)
    }, [open])

    const hex = value.startsWith('#') ? value : '#000000'

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen(o => !o)}
                title="文字色"
                style={{
                    display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 2,
                    width: 32, height: 28, padding: '2px 0',
                    border: '1px solid #d1d5db', borderRadius: 6,
                    background: open ? '#eff6ff' : 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                }}
            >
                <span style={{ fontSize: 14, fontWeight: 800, lineHeight: 1 }}>A</span>
                <span style={{
                    display: 'block', width: 18, height: 4,
                    borderRadius: 2, background: hex,
                    border: hex.toLowerCase() === '#ffffff' ? '1px solid #d1d5db' : 'none',
                }} />
            </button>

            {open && typeof document !== 'undefined' && createPortal(
                <div
                    ref={popoverRef}
                    style={{
                        position: 'fixed',
                        top: pos.top, left: pos.left,
                        zIndex: 9999,
                    }}
                >
                    <ColorPickerPopover value={hex} onChange={onChange} />
                </div>,
                document.body,
            )}
        </>
    )
}

function ColorPickerPopover({ value, onChange }: {
    value: string
    onChange: (color: string) => void
}) {
    // 内部状態は HSV（外部は HEX）。外からの更新と区別するため lastEmitted を保持
    const initial = useMemo(() => hexToHsv(value), [])
    const [h, setH] = useState(initial[0])
    const [s, setS] = useState(initial[1])
    const [v, setV] = useState(initial[2])
    const [hexInput, setHexInput] = useState(value.toUpperCase())
    const lastEmittedRef = useRef(value.toUpperCase())

    // 外部から value が変わった時に HSV を同期（プリセット選択時など）
    useEffect(() => {
        const up = value.toUpperCase()
        if (up === lastEmittedRef.current) return
        const [nh, ns, nv] = hexToHsv(value)
        setH(nh); setS(ns); setV(nv)
        setHexInput(up)
    }, [value])

    function emit(nh: number, ns: number, nv: number) {
        const hex = rgbToHex(hsvToRgb(nh, ns, nv))
        lastEmittedRef.current = hex
        setHexInput(hex)
        onChange(hex)
    }

    // ──────── SV ピッカー ────────
    const svRef = useRef<HTMLDivElement | null>(null)
    const svDragging = useRef(false)

    function updateSV(clientX: number, clientY: number) {
        if (!svRef.current) return
        const rect = svRef.current.getBoundingClientRect()
        const ns = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const nv = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height))
        setS(ns); setV(nv)
        emit(h, ns, nv)
    }

    function onSVPointerDown(e: React.PointerEvent) {
        svDragging.current = true
        ;(e.target as Element).setPointerCapture(e.pointerId)
        updateSV(e.clientX, e.clientY)
    }
    function onSVPointerMove(e: React.PointerEvent) {
        if (!svDragging.current) return
        updateSV(e.clientX, e.clientY)
    }
    function onSVPointerUp(e: React.PointerEvent) {
        svDragging.current = false
        ;(e.target as Element).releasePointerCapture(e.pointerId)
    }

    // ──────── HUE スライダー ────────
    const hueRef = useRef<HTMLDivElement | null>(null)
    const hueDragging = useRef(false)

    function updateHue(clientX: number) {
        if (!hueRef.current) return
        const rect = hueRef.current.getBoundingClientRect()
        const nh = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360))
        setH(nh)
        emit(nh, s, v)
    }

    function onHuePointerDown(e: React.PointerEvent) {
        hueDragging.current = true
        ;(e.target as Element).setPointerCapture(e.pointerId)
        updateHue(e.clientX)
    }
    function onHuePointerMove(e: React.PointerEvent) {
        if (!hueDragging.current) return
        updateHue(e.clientX)
    }
    function onHuePointerUp(e: React.PointerEvent) {
        hueDragging.current = false
        ;(e.target as Element).releasePointerCapture(e.pointerId)
    }

    // ──────── 16進入力 ────────
    function commitHex() {
        const cleaned = hexInput.trim().replace(/^#/, '')
        if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
            const hex = `#${cleaned.toUpperCase()}`
            const [nh, ns, nv] = hexToHsv(hex)
            setH(nh); setS(ns); setV(nv)
            lastEmittedRef.current = hex
            setHexInput(hex)
            onChange(hex)
        } else {
            // 不正値は元に戻す
            setHexInput(lastEmittedRef.current)
        }
    }

    const pureHueColor = rgbToHex(hsvToRgb(h, 1, 1))
    const currentHex = rgbToHex(hsvToRgb(h, s, v))

    return (
        <div
            style={{
                background: 'white', border: '1px solid #d1d5db', borderRadius: 12,
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                padding: 12,
                width: 240,
                display: 'flex', flexDirection: 'column', gap: 12,
            }}
        >
            {/* プリセット */}
            <div>
                <div style={{
                    fontSize: 11, fontWeight: 700, color: '#6b7280',
                    letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6,
                }}>プリセット</div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)', gap: 4,
                }}>
                    {COLOR_PRESETS.map(c => {
                        const isSelected = c.toUpperCase() === currentHex.toUpperCase()
                        return (
                            <button
                                key={c}
                                type="button"
                                onClick={() => {
                                    const [nh, ns, nv] = hexToHsv(c)
                                    setH(nh); setS(ns); setV(nv)
                                    emit(nh, ns, nv)
                                }}
                                aria-label={`色 ${c}`}
                                style={{
                                    width: '100%', aspectRatio: '1',
                                    background: c, borderRadius: 4,
                                    border: isSelected
                                        ? '2px solid #2563eb'
                                        : c.toUpperCase() === '#FFFFFF'
                                            ? '1px solid #d1d5db' : 'none',
                                    cursor: 'pointer', padding: 0,
                                }}
                            />
                        )
                    })}
                </div>
            </div>

            {/* SV ピッカー（角を丸める） */}
            <div
                ref={svRef}
                onPointerDown={onSVPointerDown}
                onPointerMove={onSVPointerMove}
                onPointerUp={onSVPointerUp}
                onPointerCancel={onSVPointerUp}
                style={{
                    position: 'relative',
                    width: '100%', height: 140,
                    borderRadius: 10,
                    background: `
                        linear-gradient(to top, #000, transparent),
                        linear-gradient(to right, #fff, ${pureHueColor})
                    `,
                    cursor: 'crosshair',
                    touchAction: 'none',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: `${s * 100}%`, top: `${(1 - v) * 100}%`,
                        width: 14, height: 14,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
                        background: currentHex,
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* 色相スライダー（角を丸める） */}
            <div
                ref={hueRef}
                onPointerDown={onHuePointerDown}
                onPointerMove={onHuePointerMove}
                onPointerUp={onHuePointerUp}
                onPointerCancel={onHuePointerUp}
                style={{
                    position: 'relative',
                    width: '100%', height: 14,
                    borderRadius: 7,
                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                    cursor: 'pointer',
                    touchAction: 'none',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: `${(h / 360) * 100}%`, top: '50%',
                        width: 16, height: 16,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        background: 'white',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* 16進入力 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                    display: 'inline-block', width: 24, height: 24,
                    borderRadius: 6, background: currentHex,
                    border: currentHex.toUpperCase() === '#FFFFFF' ? '1px solid #d1d5db' : 'none',
                }} />
                <input
                    type="text"
                    value={hexInput}
                    onChange={e => setHexInput(e.target.value.toUpperCase())}
                    onBlur={commitHex}
                    onKeyDown={e => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur() }}
                    maxLength={7}
                    style={{
                        flex: 1, height: 28, padding: '0 8px',
                        border: '1px solid #d1d5db', borderRadius: 6,
                        fontSize: 13, fontWeight: 600,
                        color: '#111827',
                        fontFamily: 'monospace', outline: 'none',
                    }}
                />
            </div>
        </div>
    )
}

// ──────────── 色変換ユーティリティ ────────────

type RGB = [number, number, number]

function hexToRgb(hex: string): RGB {
    const clean = hex.replace('#', '').padEnd(6, '0').slice(0, 6)
    return [
        parseInt(clean.slice(0, 2), 16) || 0,
        parseInt(clean.slice(2, 4), 16) || 0,
        parseInt(clean.slice(4, 6), 16) || 0,
    ]
}

function rgbToHex([r, g, b]: RGB): string {
    return '#' + [r, g, b].map(c =>
        Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0').toUpperCase()
    ).join('')
}

// h: 0-360, s: 0-1, v: 0-1
function hsvToRgb(h: number, s: number, v: number): RGB {
    const c = v * s
    const hp = (h % 360) / 60
    const x = c * (1 - Math.abs((hp % 2) - 1))
    let r = 0, g = 0, b = 0
    if (0 <= hp && hp < 1) { r = c; g = x; b = 0 }
    else if (hp < 2)        { r = x; g = c; b = 0 }
    else if (hp < 3)        { r = 0; g = c; b = x }
    else if (hp < 4)        { r = 0; g = x; b = c }
    else if (hp < 5)        { r = x; g = 0; b = c }
    else                    { r = c; g = 0; b = x }
    const m = v - c
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
}

function hexToHsv(hex: string): [number, number, number] {
    const [r, g, b] = hexToRgb(hex).map(c => c / 255) as [number, number, number]
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    const d = max - min
    let h = 0
    const s = max === 0 ? 0 : d / max
    const v = max
    if (d !== 0) {
        if (max === r)      h = ((g - b) / d) % 6
        else if (max === g) h = (b - r) / d + 2
        else                h = (r - g) / d + 4
        h *= 60
        if (h < 0) h += 360
    }
    return [h, s, v]
}

function AlignIcon({ align }: { align: TextAlign }) {
    // 4本の横線で寄せを表現するアイコン。SVG 16x16
    // 各行の長さと x 起点を寄せに合わせて調整
    const lineY = [3, 6.5, 10, 13.5]
    // 両端揃えは全て同じ最大幅で描画（左右端が揃って見える）
    const lengths = align === 'justify' ? [12, 12, 12, 12] : [12, 8, 11, 6]

    function xFor(len: number): number {
        if (align === 'left' || align === 'justify') return 2
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
