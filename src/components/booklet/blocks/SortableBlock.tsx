'use client'
import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BookletBlockKind } from '../bookletConfig'

type Props = {
    id: string
    kind: BookletBlockKind
    editable: boolean
    canDelete: boolean
    onDelete?: () => void
    resizable?: boolean
    currentHeight?: number       // ハンドルがスタートする高さ（current minHeight or height）
    onResize?: (newHeight: number) => void
    dropHint?: 'above' | 'below' | null  // パレットからD&D中の挿入位置プレビュー
    children: React.ReactNode
}

const NON_DRAGGABLE_KINDS: BookletBlockKind[] = ['cover', 'back-cover']

export default function SortableBlock({
    id, kind, editable, canDelete, onDelete,
    resizable, currentHeight, onResize, dropHint, children,
}: Props) {
    const isDraggable = editable && !NON_DRAGGABLE_KINDS.includes(kind)
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !isDraggable })
    const [resizing, setResizing] = useState(false)
    const blockRef = useRef<HTMLDivElement | null>(null)

    function combineRefs(el: HTMLDivElement | null) {
        setNodeRef(el)
        blockRef.current = el
    }

    function onResizeStart(e: React.PointerEvent) {
        if (!onResize) return
        e.preventDefault()
        e.stopPropagation()
        const startY = e.clientY
        // 現在表示されている高さを使用（指定がなければ実描画高さ）
        const startH = currentHeight ?? blockRef.current?.getBoundingClientRect().height ?? 140
        setResizing(true)
        document.body.style.cursor = 'ns-resize'

        function onMove(ev: PointerEvent) {
            const next = Math.max(40, Math.round(startH + (ev.clientY - startY)))
            onResize!(next)
        }
        function onUp() {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            document.body.style.cursor = ''
            setResizing(false)
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: resizing ? 'none' : transition,
        position: 'relative',
        marginBottom: 24,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 50 : 'auto',
    }

    return (
        <div ref={combineRefs} style={style} className="booklet-block-wrap">
            {/* パレットD&D中の挿入位置インジケーター（上） */}
            {dropHint === 'above' && (
                <div
                    className="no-print"
                    aria-hidden="true"
                    style={{
                        position: 'absolute', left: 0, right: 0, top: -14,
                        height: 4, borderRadius: 99,
                        background: '#2563eb',
                        boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.15)',
                        zIndex: 20, pointerEvents: 'none',
                    }}
                />
            )}
            {/* パレットD&D中の挿入位置インジケーター（下） */}
            {dropHint === 'below' && (
                <div
                    className="no-print"
                    aria-hidden="true"
                    style={{
                        position: 'absolute', left: 0, right: 0, bottom: -14,
                        height: 4, borderRadius: 99,
                        background: '#2563eb',
                        boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.15)',
                        zIndex: 20, pointerEvents: 'none',
                    }}
                />
            )}

            {/* 編集UI：ドラッグハンドル + 削除ボタン */}
            {editable && (
                <div
                    className="no-print booklet-block-controls"
                    style={{
                        position: 'absolute', top: 8, left: -36, zIndex: 10,
                        display: 'flex', flexDirection: 'column', gap: 4,
                    }}
                >
                    {isDraggable && (
                        <button
                            type="button"
                            aria-label="ブロックをドラッグ"
                            {...attributes}
                            {...listeners}
                            style={{
                                width: 28, height: 28, borderRadius: 8,
                                border: '1.5px solid #e2e8f0',
                                background: 'white',
                                color: '#64748b',
                                cursor: 'grab',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, fontWeight: 700,
                                touchAction: 'none',
                                boxShadow: '0 2px 6px rgba(15,23,42,0.06)',
                            }}
                        >
                            ⋮⋮
                        </button>
                    )}
                    {canDelete && onDelete && (
                        <button
                            type="button"
                            aria-label="ブロックを削除"
                            onClick={onDelete}
                            style={{
                                width: 28, height: 28, borderRadius: 8,
                                border: '1.5px solid #fecaca',
                                background: '#fef2f2',
                                color: '#dc2626',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14,
                                boxShadow: '0 2px 6px rgba(220,38,38,0.06)',
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}

            {children}

            {/* 高さリサイズハンドル（編集モードかつresizable時のみ） */}
            {editable && resizable && onResize && (
                <div
                    className="no-print"
                    onPointerDown={onResizeStart}
                    title="ドラッグして高さを調整"
                    style={{
                        position: 'absolute', left: 0, right: 0, bottom: -10, zIndex: 6,
                        height: 16, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'ns-resize',
                        opacity: resizing ? 1 : 0.55,
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={e => { if (!resizing) e.currentTarget.style.opacity = '0.55' }}
                >
                    <div style={{
                        width: 56, height: 6, borderRadius: 99,
                        background: resizing ? '#2563eb' : '#cbd5e1',
                        boxShadow: '0 2px 6px rgba(15,23,42,0.12)',
                    }} />
                </div>
            )}
        </div>
    )
}
