'use client'
import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
    id: string
    editable: boolean
    canDelete: boolean
    onDelete?: () => void
    draggable?: boolean         // false の場合 useSortable は disabled（day 本体など）
    resizable?: boolean
    currentHeight?: number
    onResize?: (newHeight: number) => void
    dropHint?: 'above' | 'below' | null
    children: React.ReactNode
}

export default function SortableInnerBlock({
    id, editable, canDelete, onDelete,
    draggable = true,
    resizable, currentHeight, onResize, dropHint, children,
}: Props) {
    const sortableEnabled = editable && draggable
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id, disabled: !sortableEnabled,
    })
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
        const startH = currentHeight ?? blockRef.current?.getBoundingClientRect().height ?? 120
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
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 50 : 'auto',
        padding: '8px 0',
    }

    return (
        <div ref={combineRefs} style={style} className="booklet-inner-wrap">
            {dropHint === 'above' && <InnerDropIndicator side="above" />}
            {dropHint === 'below' && <InnerDropIndicator side="below" />}

            {editable && (sortableEnabled || canDelete) && (
                <div
                    className="no-print booklet-inner-controls"
                    style={{
                        position: 'absolute', top: 6, right: 0, zIndex: 10,
                        display: 'flex', gap: 4,
                    }}
                >
                    {sortableEnabled && (
                        <button
                            type="button"
                            aria-label="ブロックをドラッグ"
                            {...attributes}
                            {...listeners}
                            title="このページ内で並び替え"
                            style={{
                                width: 22, height: 22, borderRadius: 6,
                                border: '1px solid #e2e8f0',
                                background: 'white',
                                color: '#94a3b8',
                                cursor: 'grab',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 10, fontWeight: 700,
                                touchAction: 'none',
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
                            title="ブロックを削除"
                            style={{
                                width: 22, height: 22, borderRadius: 6,
                                border: '1px solid #fecaca',
                                background: '#fef2f2',
                                color: '#dc2626',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11,
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}

            {/* コントロールボタン分の右余白を確保（編集モード時のみ・印刷時は globals.css で解除） */}
            <div
                className="booklet-inner-content"
                style={{ paddingRight: editable && (sortableEnabled || canDelete) ? 60 : 0 }}
            >
                {children}
            </div>

            {editable && resizable && onResize && (
                <div
                    className="no-print"
                    onPointerDown={onResizeStart}
                    title="ドラッグして高さを調整"
                    style={{
                        position: 'absolute', left: 0, right: 0, bottom: -2, zIndex: 6,
                        height: 14, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'ns-resize',
                        opacity: resizing ? 1 : 0.4,
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={e => { if (!resizing) e.currentTarget.style.opacity = '0.4' }}
                >
                    <div style={{
                        width: 48, height: 5, borderRadius: 99,
                        background: resizing ? '#2563eb' : '#cbd5e1',
                    }} />
                </div>
            )}
        </div>
    )
}

function InnerDropIndicator({ side }: { side: 'above' | 'below' }) {
    return (
        <div
            className="no-print"
            aria-hidden="true"
            style={{
                position: 'absolute', left: 0, right: 0,
                [side === 'above' ? 'top' : 'bottom']: 0,
                height: 3, borderRadius: 99,
                background: '#2563eb',
                boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
                zIndex: 20, pointerEvents: 'none',
            }}
        />
    )
}
