'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BookletItemKind } from '../bookletConfig'

type Props = {
    id: string
    kind: BookletItemKind
    editable: boolean
    canDelete: boolean
    onDelete?: () => void
    dropHint?: 'above' | 'below' | null  // パレットD&D中の挿入位置（ページ全体に対して）
    children: React.ReactNode
}

const NON_DRAGGABLE_KINDS: BookletItemKind[] = ['cover', 'back-cover']

export default function SortablePage({ id, kind, editable, canDelete, onDelete, dropHint, children }: Props) {
    const isDraggable = editable && !NON_DRAGGABLE_KINDS.includes(kind)
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !isDraggable })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        marginBottom: 28,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 50 : 'auto',
    }

    return (
        <div ref={setNodeRef} style={style} className="booklet-page-wrap">
            {dropHint === 'above' && <DropIndicator side="above" />}
            {dropHint === 'below' && <DropIndicator side="below" />}

            {editable && (
                <div
                    className="no-print booklet-page-controls"
                    style={{
                        position: 'absolute', top: 8, left: -40, zIndex: 10,
                        display: 'flex', flexDirection: 'column', gap: 5,
                    }}
                >
                    {isDraggable && (
                        <button
                            type="button"
                            aria-label="ページをドラッグ"
                            {...attributes}
                            {...listeners}
                            title="ページを並び替え"
                            style={{
                                width: 30, height: 30, borderRadius: 8,
                                border: '1.5px solid #cbd5e1',
                                background: 'white',
                                color: '#475569',
                                cursor: 'grab',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, fontWeight: 700,
                                touchAction: 'none',
                                boxShadow: '0 2px 8px rgba(15,23,42,0.10)',
                            }}
                        >
                            ⋮⋮
                        </button>
                    )}
                    {canDelete && onDelete && (
                        <button
                            type="button"
                            aria-label="ページを削除"
                            onClick={onDelete}
                            title="ページを削除"
                            style={{
                                width: 30, height: 30, borderRadius: 8,
                                border: '1.5px solid #fecaca',
                                background: '#fef2f2',
                                color: '#dc2626',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14,
                                boxShadow: '0 2px 8px rgba(220,38,38,0.10)',
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}

            {children}
        </div>
    )
}

function DropIndicator({ side }: { side: 'above' | 'below' }) {
    return (
        <div
            className="no-print"
            aria-hidden="true"
            style={{
                position: 'absolute', left: 0, right: 0,
                [side === 'above' ? 'top' : 'bottom']: -16,
                height: 5, borderRadius: 99,
                background: '#2563eb',
                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.15)',
                zIndex: 20, pointerEvents: 'none',
            }}
        />
    )
}
