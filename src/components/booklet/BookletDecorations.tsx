import type { DecorationKind } from './bookletThemes'

// ページ全体に重ねる装飾レイヤー（CSSパターンのみ・絵文字なし）
export function PageDecoration({ kind, accent }: { kind: DecorationKind; accent?: string }) {
    if (kind === 'none') return null

    const styleByKind: Record<Exclude<DecorationKind, 'none'>, React.CSSProperties> = {
        dots: {
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1.5px)',
            backgroundSize: '18px 18px',
        },
        lines: {
            backgroundImage: `repeating-linear-gradient(135deg, ${withAlpha(accent, 0.05)} 0, ${withAlpha(accent, 0.05)} 1px, transparent 1px, transparent 14px)`,
        },
        grid: {
            backgroundImage:
                'linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
        },
        wave: {
            backgroundImage: `radial-gradient(ellipse 60px 30px at 50% 100%, ${withAlpha(accent, 0.08)} 0%, transparent 70%)`,
            backgroundSize: '120px 60px',
            backgroundRepeat: 'repeat',
        },
        washi: {
            // ページ装飾としては薄い斜めストライプ
            backgroundImage: `repeating-linear-gradient(45deg, ${withAlpha(accent, 0.04)} 0, ${withAlpha(accent, 0.04)} 6px, transparent 6px, transparent 14px)`,
        },
    }

    const bg = styleByKind[kind as Exclude<DecorationKind, 'none'>]

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute', inset: 0,
                pointerEvents: 'none', zIndex: 0,
                ...bg,
            }}
        />
    )
}

// カバー専用の装飾（やや強め）
export function CoverDecoration({ kind, accent }: { kind: DecorationKind; accent?: string }) {
    if (kind === 'none') return null

    if (kind === 'washi') {
        return (
            <>
                <div style={washiTape(-6, 12, -14, `linear-gradient(45deg, ${withAlpha('white', 0.25)}, ${withAlpha('white', 0.4)})`)} />
                <div style={washiTape(82, 78, 10, `linear-gradient(45deg, ${withAlpha('white', 0.2)}, ${withAlpha('white', 0.35)})`)} />
            </>
        )
    }

    const layer: React.CSSProperties = (() => {
        switch (kind) {
            case 'dots':
                return {
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 1.5px, transparent 2px)',
                    backgroundSize: '22px 22px',
                }
            case 'lines':
                return {
                    backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 18px)`,
                }
            case 'grid':
                return {
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }
            case 'wave':
                return {
                    backgroundImage: `radial-gradient(ellipse 80px 40px at 50% 100%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
                    backgroundSize: '160px 80px',
                    backgroundRepeat: 'repeat',
                }
            default:
                return {}
        }
    })()

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute', inset: 0,
                pointerEvents: 'none', zIndex: 1,
                ...layer,
            }}
        />
    )
}

// ──────────── helpers ────────────

function withAlpha(color: string | undefined, alpha: number): string {
    if (!color) return `rgba(0,0,0,${alpha})`
    if (color === 'white') return `rgba(255,255,255,${alpha})`
    // #rrggbb → rgba
    const m = color.match(/^#([0-9a-f]{6})$/i)
    if (m) {
        const r = parseInt(m[1].slice(0, 2), 16)
        const g = parseInt(m[1].slice(2, 4), 16)
        const b = parseInt(m[1].slice(4, 6), 16)
        return `rgba(${r},${g},${b},${alpha})`
    }
    return color
}

function washiTape(leftPct: number, topPct: number, rotate: number, bg: string): React.CSSProperties {
    return {
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: 130,
        height: 24,
        background: bg,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        pointerEvents: 'none',
        zIndex: 1,
    }
}
