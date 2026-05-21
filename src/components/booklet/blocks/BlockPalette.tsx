'use client'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Theme } from '../bookletThemes'
import { BLOCK_TEMPLATES, type BlockTemplate } from '../bookletConfig'

type Props = {
    theme: Theme
    onAdd: (template: BlockTemplate) => void
}

export default function BlockPalette({ theme, onAdd }: Props) {
    return (
        <div
            className="no-print"
            style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.85)',
                border: `1.5px dashed ${theme.timelineBar}`,
                borderRadius: 14,
                backdropFilter: 'blur(4px)',
            }}
        >
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 10, gap: 12,
            }}>
                <p style={{
                    margin: 0, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: theme.subText,
                }}>
                    ＋ ページを追加
                </p>
                <p style={{
                    margin: 0, fontSize: 10, color: theme.subText, opacity: 0.7,
                }}>
                    クリックで追加 / ドラッグで好きな位置へ
                </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {BLOCK_TEMPLATES.map((tpl, i) => (
                    <PaletteItem
                        key={i}
                        idx={i}
                        template={tpl}
                        theme={theme}
                        onClick={() => onAdd(tpl)}
                    />
                ))}
            </div>
        </div>
    )
}

function PaletteItem({ idx, template, theme, onClick }: {
    idx: number
    template: BlockTemplate
    theme: Theme
    onClick: () => void
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `palette-${idx}`,
        data: { palette: true, templateIdx: idx },
    })

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
        padding: '6px 12px',
        borderRadius: 18,
        border: `1.5px solid ${theme.timelineBar}`,
        background: 'white',
        color: theme.text,
        fontSize: 12, fontWeight: 600,
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        touchAction: 'none',
        transition: isDragging ? 'none' : 'background 0.12s, border-color 0.12s',
        userSelect: 'none',
    }

    return (
        <button
            ref={setNodeRef}
            type="button"
            onClick={onClick}
            {...attributes}
            {...listeners}
            style={style}
            title={`${template.label} を追加（クリック or ドラッグ）`}
        >
            <span style={{ fontSize: 13 }}>{template.icon}</span>
            <span>{template.label}</span>
        </button>
    )
}
