'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BookletBlockKind } from '../bookletConfig'

type Props = {
    id: string
    kind: BookletBlockKind
    editable: boolean
    canDelete: boolean
    onDelete?: () => void
    children: React.ReactNode
}

const NON_DRAGGABLE_KINDS: BookletBlockKind[] = ['cover', 'back-cover']

export default function SortableBlock({ id, kind, editable, canDelete, onDelete, children }: Props) {
    const isDraggable = editable && !NON_DRAGGABLE_KINDS.includes(kind)
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !isDraggable })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        marginBottom: 24,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 50 : 'auto',
    }

    return (
        <div ref={setNodeRef} style={style} className="booklet-block-wrap">
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
        </div>
    )
}
