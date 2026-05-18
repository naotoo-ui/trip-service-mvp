import type { DecorationKind } from './bookletThemes'

// ページ全体に散りばめる装飾（背景レイヤー、絶対配置）
export function PageDecoration({ kind }: { kind: DecorationKind }) {
    if (kind === 'sakura') {
        return (
            <>
                <span style={floatEmoji(-10, 8, 36, -15, 0.45)}>🌸</span>
                <span style={floatEmoji(95, 12, 22, 20, 0.35)}>🌸</span>
                <span style={floatEmoji(2, 70, 28, 12, 0.4)}>🌸</span>
                <span style={floatEmoji(92, 85, 18, -10, 0.3)}>🌸</span>
                <span style={floatEmoji(48, 95, 20, 25, 0.25)}>🌸</span>
            </>
        )
    }
    if (kind === 'stars') {
        return (
            <>
                <span style={floatEmoji(-3, 10, 20, 0, 0.5)}>✨</span>
                <span style={floatEmoji(96, 18, 16, 15, 0.4)}>⭐</span>
                <span style={floatEmoji(8, 75, 14, 0, 0.45)}>✨</span>
                <span style={floatEmoji(90, 60, 22, -10, 0.4)}>⭐</span>
                <span style={floatEmoji(50, 90, 16, 10, 0.35)}>✨</span>
            </>
        )
    }
    if (kind === 'hearts') {
        return (
            <>
                <span style={floatEmoji(-3, 8, 22, -10, 0.4)}>💕</span>
                <span style={floatEmoji(94, 14, 18, 12, 0.35)}>💗</span>
                <span style={floatEmoji(5, 80, 20, 8, 0.4)}>💖</span>
                <span style={floatEmoji(90, 75, 16, -8, 0.3)}>💕</span>
            </>
        )
    }
    if (kind === 'clouds') {
        return (
            <>
                <span style={floatEmoji(-5, 8, 32, 0, 0.5)}>☁️</span>
                <span style={floatEmoji(85, 25, 28, 0, 0.4)}>☁️</span>
                <span style={floatEmoji(10, 70, 24, 0, 0.45)}>☁️</span>
                <span style={floatEmoji(80, 85, 30, 0, 0.35)}>☁️</span>
            </>
        )
    }
    if (kind === 'dots') {
        return (
            <div
                style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                    pointerEvents: 'none', zIndex: 0,
                }}
            />
        )
    }
    if (kind === 'washi') {
        return (
            <>
                <div style={washiTape(-6, 14, -18, 'linear-gradient(45deg, #fbcfe8, #f9a8d4, #fbcfe8)')} />
                <div style={washiTape(88, 70, 12, 'linear-gradient(45deg, #fde68a, #fcd34d, #fde68a)')} />
            </>
        )
    }
    return null
}

// カバーの装飾（より華やか）
export function CoverDecoration({ kind, accent }: { kind: DecorationKind; accent: string }) {
    if (kind === 'sakura') {
        return (
            <>
                <span style={absEmoji(-2, -2, 80, -15)}>🌸</span>
                <span style={absEmoji(85, 5, 50, 10)}>🌸</span>
                <span style={absEmoji(2, 85, 60, -10)}>🌸</span>
                <span style={absEmoji(90, 88, 70, 20)}>🌸</span>
                <span style={absEmoji(45, -3, 35, 0)}>🌸</span>
            </>
        )
    }
    if (kind === 'stars') {
        return (
            <>
                <span style={absEmoji(8, 8, 32, 0)}>✨</span>
                <span style={absEmoji(85, 12, 24, 10)}>⭐</span>
                <span style={absEmoji(15, 78, 28, -10)}>✨</span>
                <span style={absEmoji(88, 82, 32, 15)}>⭐</span>
                <span style={absEmoji(50, 30, 18, 0)}>✨</span>
            </>
        )
    }
    if (kind === 'hearts') {
        return (
            <>
                <span style={absEmoji(-2, 5, 50, -15)}>💕</span>
                <span style={absEmoji(88, 8, 40, 10)}>💗</span>
                <span style={absEmoji(5, 85, 45, 5)}>💖</span>
                <span style={absEmoji(85, 85, 55, -10)}>💕</span>
            </>
        )
    }
    if (kind === 'clouds') {
        return (
            <>
                <span style={absEmoji(-5, 5, 80, 0)}>☁️</span>
                <span style={absEmoji(85, 15, 60, 0)}>☁️</span>
                <span style={absEmoji(8, 78, 50, 0)}>☁️</span>
            </>
        )
    }
    if (kind === 'polaroid') {
        return (
            <>
                {/* マスキングテープ風アクセント */}
                <div style={washiTape(-5, 12, -10, 'rgba(255,255,255,0.18)')} />
                <div style={washiTape(82, 80, 8, 'rgba(255,255,255,0.15)')} />
            </>
        )
    }
    if (kind === 'washi') {
        return (
            <>
                <div style={washiTape(-8, 18, -12, `linear-gradient(45deg, ${accent}88, ${accent}cc)`)} />
                <div style={washiTape(80, 75, 10, `linear-gradient(45deg, ${accent}99, ${accent}dd)`)} />
            </>
        )
    }
    return null
}

// ──────────── helpers ────────────

function floatEmoji(leftPct: number, topPct: number, size: number, rotate: number, opacity: number): React.CSSProperties {
    return {
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        fontSize: size,
        transform: `rotate(${rotate}deg)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
    }
}

function absEmoji(leftPct: number, topPct: number, size: number, rotate: number): React.CSSProperties {
    return {
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        fontSize: size,
        transform: `rotate(${rotate}deg)`,
        opacity: 0.85,
        pointerEvents: 'none',
        zIndex: 1,
        userSelect: 'none',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
    }
}

function washiTape(leftPct: number, topPct: number, rotate: number, bg: string): React.CSSProperties {
    return {
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: 110,
        height: 22,
        background: bg,
        opacity: 0.85,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        pointerEvents: 'none',
        zIndex: 1,
    }
}
