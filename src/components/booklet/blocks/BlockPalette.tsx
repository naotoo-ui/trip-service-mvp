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
                padding: '16px 14px',
                background: 'white',
                border: `1.5px solid ${theme.timelineBar}`,
                borderRadius: 14,
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                maxHeight: 'calc(100vh - 120px)',
                display: 'flex', flexDirection: 'column',
            }}
        >
            <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${theme.timelineBar}` }}>
                <p style={{
                    margin: 0, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: theme.text,
                }}>
                    ＋ ページを追加
                </p>
                <p style={{
                    margin: '4px 0 0', fontSize: 10, color: theme.subText, opacity: 0.85,
                    lineHeight: 1.5,
                }}>
                    クリックで先頭に追加<br />
                    ドラッグで好きな位置へ
                </p>
            </div>

            <div style={{
                display: 'flex', flexDirection: 'column', gap: 5,
                overflowY: 'auto', minHeight: 0,
            }}>
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
        padding: '8px 10px',
        borderRadius: 10,
        border: `1.5px solid ${theme.timelineBar}`,
        background: '#f8fafc',
        color: theme.text,
        fontSize: 13, fontWeight: 600,
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex', alignItems: 'center', gap: 9,
        touchAction: 'none',
        transition: isDragging ? 'none' : 'background 0.12s, border-color 0.12s, transform 0.08s',
        userSelect: 'none',
        textAlign: 'left',
        width: '100%',
    }

    return (
        <button
            ref={setNodeRef}
            type="button"
            onClick={onClick}
            {...attributes}
            {...listeners}
            style={style}
            onMouseEnter={e => {
                if (!isDragging) {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.borderColor = theme.accent
                }
            }}
            onMouseLeave={e => {
                if (!isDragging) {
                    e.currentTarget.style.background = '#f8fafc'
                    e.currentTarget.style.borderColor = theme.timelineBar
                }
            }}
            title={`${template.label} を追加`}
        >
            <span style={{
                fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0,
            }}>{template.icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}>{template.label}</span>
            <span style={{ fontSize: 11, color: theme.subText, opacity: 0.5 }}>⋮⋮</span>
        </button>
    )
}
