'use client'
import {
    OPTIONAL_PAGE_KINDS, OPTIONAL_PAGE_LABELS,
    type OptionalPageKind, type InsertPosition, type BookletConfig,
} from './bookletConfig'

type Props = {
    position: InsertPosition
    label: string
    config: BookletConfig
    onToggle: (kind: OptionalPageKind, position: InsertPosition, enabled: boolean) => void
}

function positionMatches(a: InsertPosition, b: InsertPosition): boolean {
    if (a.kind !== b.kind) return false
    if (a.kind === 'after-day' && b.kind === 'after-day') return a.dayIdx === b.dayIdx
    return true
}

export default function BookletGapControl({ position, label, config, onToggle }: Props) {
    return (
        <div
            className="no-print"
            style={{
                margin: '4px 0 4px',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px dashed #e2e8f0',
                background: 'rgba(248, 250, 252, 0.8)',
            }}
        >
            {/* ラベル */}
            <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                color: '#94a3b8', margin: '0 0 8px',
                textTransform: 'uppercase',
            }}>
                {label} に追加
            </p>

            {/* オプションページのチップ一覧 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {OPTIONAL_PAGE_KINDS.map(kind => {
                    const entry = config.optionalPages[kind]
                    const isHere = entry.enabled && positionMatches(entry.position, position)
                    const isElsewhere = entry.enabled && !isHere

                    return (
                        <button
                            key={kind}
                            type="button"
                            onClick={() => onToggle(kind, position, !isHere)}
                            disabled={isElsewhere}
                            title={isElsewhere ? `別の位置（${positionOf(entry.position)}）に追加済みです` : undefined}
                            style={{
                                padding: '4px 11px',
                                borderRadius: 20,
                                border: `1.5px solid ${isHere ? '#2563eb' : '#e2e8f0'}`,
                                background: isHere ? '#eff6ff' : 'white',
                                color: isHere ? '#2563eb' : isElsewhere ? '#cbd5e1' : '#64748b',
                                fontSize: 12, fontWeight: 600,
                                cursor: isElsewhere ? 'not-allowed' : 'pointer',
                                transition: 'background 0.12s, border-color 0.12s, color 0.12s',
                                display: 'flex', alignItems: 'center', gap: 4,
                            }}
                        >
                            {isHere && (
                                <span style={{ fontSize: 10 }}>✓</span>
                            )}
                            {OPTIONAL_PAGE_LABELS[kind]}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function positionOf(pos: InsertPosition): string {
    if (pos.kind === 'after-cover') return '表紙の後'
    if (pos.kind === 'before-back-cover') return '背表紙の前'
    if (pos.kind === 'after-day') return `${pos.dayIdx + 1}日目の後`
    return ''
}
