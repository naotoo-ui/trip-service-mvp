'use client'
import type { ThemeFilter } from './PlanFilters'

// ヒーロー直下のクイックテーマショートカット。
// クリックでテーマフィルタを切替（単一テーマ専用：他のテーマは消える）。

type Props = {
    activeTheme: ThemeFilter | null
    favCount: number
    showFavoritesOnly: boolean
    onPickTheme: (t: ThemeFilter | null) => void
    onToggleFavorites: () => void
}

const QUICK_THEMES: { key: ThemeFilter; label: string; emoji: string }[] = [
    { key: 'sg', label: '王道', emoji: '🏛' },
    { key: 'gm', label: 'グルメ', emoji: '🍜' },
    { key: 'np', label: '絶景', emoji: '🌅' },
    { key: 'on', label: '温泉', emoji: '♨️' },
    { key: 'hs', label: '歴史', emoji: '🏯' },
    { key: 'wh', label: '世界遺産', emoji: '🌍' },
    { key: 'cp', label: 'カップル', emoji: '💑' },
    { key: 'fm', label: '家族', emoji: '👨‍👩‍👧' },
    { key: 'bc', label: 'ビーチ', emoji: '🏖' },
    { key: 'cherry', label: '桜', emoji: '🌸' },
    { key: 'autumn', label: '紅葉', emoji: '🍁' },
]

export default function QuickThemes({
    activeTheme, favCount, showFavoritesOnly,
    onPickTheme, onToggleFavorites,
}: Props) {
    return (
        <div style={{ position: 'relative' }}>
            <div className="quick-row">
                <button
                    type="button"
                    onClick={onToggleFavorites}
                    style={chipStyle(showFavoritesOnly, true)}
                    aria-pressed={showFavoritesOnly}
                >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>♥</span>
                    お気に入り
                    {favCount > 0 && (
                        <span style={{
                            marginLeft: 4, fontSize: 10, fontWeight: 700,
                            background: showFavoritesOnly ? 'rgba(255,255,255,0.25)' : '#fee2e2',
                            color: showFavoritesOnly ? 'white' : '#b91c1c',
                            padding: '1px 6px', borderRadius: 99,
                        }}>{favCount}</span>
                    )}
                </button>
                <span style={{ width: 1, height: 22, background: '#e5e7eb', margin: '0 2px' }} />
                {QUICK_THEMES.map(t => {
                    const active = activeTheme === t.key
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => onPickTheme(active ? null : t.key)}
                            style={chipStyle(active, false)}
                            aria-pressed={active}
                        >
                            <span style={{ fontSize: 15, lineHeight: 1 }}>{t.emoji}</span>
                            {t.label}
                        </button>
                    )
                })}
            </div>
            <style jsx>{`
                .quick-row {
                    display: flex; gap: 8px;
                    overflow-x: auto;
                    padding: 4px 2px 8px;
                    scrollbar-width: thin;
                }
                .quick-row::-webkit-scrollbar { height: 6px; }
                .quick-row::-webkit-scrollbar-thumb {
                    background: rgba(15,23,42,0.12); border-radius: 99px;
                }
            `}</style>
        </div>
    )
}

function chipStyle(active: boolean, fav: boolean): React.CSSProperties {
    const activeBg = fav
        ? 'linear-gradient(135deg, #ef4444, #db2777)'
        : 'linear-gradient(135deg, #7c3aed, #ec4899)'
    return {
        flex: '0 0 auto',
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '8px 14px',
        borderRadius: 99,
        border: active ? 'none' : '1.5px solid #e5e7eb',
        background: active ? activeBg : 'white',
        color: active ? 'white' : '#334155',
        fontSize: 13, fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: active ? '0 4px 10px rgba(124,58,237,0.22)' : '0 1px 2px rgba(15,23,42,0.04)',
        transition: 'all 0.15s',
    }
}
