'use client'

// チップ式フィルタ：テーマ・日数・出発地

export type ThemeFilter = 'sg' | 'gm' | 'np' | 'on' | 'hs' | 'cp' | 'fm' | 'wh' | 'bc' | 'cherry' | 'autumn'
export type DurationBucket = '1-2' | '3-4' | '5-7' | '8+'
export type OriginFilter = '東京' | '大阪' | '名古屋' | '福岡' | '札幌'

export type FilterState = {
    themes: Set<ThemeFilter>
    durations: Set<DurationBucket>
    origins: Set<OriginFilter>
}

export const EMPTY_FILTER: FilterState = {
    themes: new Set(),
    durations: new Set(),
    origins: new Set(),
}

const THEME_OPTIONS: { key: ThemeFilter; label: string; emoji: string; regex: RegExp }[] = [
    { key: 'sg', label: '王道観光', emoji: '🏛', regex: /観光|王道|名所|定番|ハイライト/ },
    { key: 'gm', label: 'グルメ', emoji: '🍜', regex: /グルメ|食べ歩|名物|料理|郷土|寿司|うどん|ラーメン/ },
    { key: 'np', label: '絶景', emoji: '🌅', regex: /絶景|景観|フォト|映え|展望|大絶景/ },
    { key: 'on', label: '温泉', emoji: '♨️', regex: /温泉|湯|湯けむり|秘湯/ },
    { key: 'hs', label: '歴史', emoji: '🏯', regex: /歴史|寺社|城|遺跡|お城|城下町/ },
    { key: 'wh', label: '世界遺産', emoji: '🌍', regex: /世界遺産|遺産/ },
    { key: 'cp', label: 'カップル', emoji: '💑', regex: /カップル|デート|ロマンチック|記念日|ふたり/ },
    { key: 'fm', label: '家族', emoji: '👨‍👩‍👧', regex: /家族|ファミリー|こども|子供/ },
    { key: 'bc', label: 'ビーチ', emoji: '🏖', regex: /ビーチ|リゾート|海/ },
    { key: 'cherry', label: '桜', emoji: '🌸', regex: /桜|花見/ },
    { key: 'autumn', label: '紅葉', emoji: '🍁', regex: /紅葉/ },
]

const DURATION_OPTIONS: { key: DurationBucket; label: string; days: (n: number) => boolean }[] = [
    { key: '1-2', label: '〜2日', days: n => n <= 2 },
    { key: '3-4', label: '3〜4日', days: n => n >= 3 && n <= 4 },
    { key: '5-7', label: '5〜7日', days: n => n >= 5 && n <= 7 },
    { key: '8+', label: '8日〜', days: n => n >= 8 },
]

const ORIGIN_OPTIONS: { key: OriginFilter; label: string }[] = [
    { key: '東京', label: '東京発' },
    { key: '大阪', label: '大阪発' },
    { key: '名古屋', label: '名古屋発' },
    { key: '福岡', label: '福岡発' },
    { key: '札幌', label: '札幌発' },
]

/** title + wishes から該当するテーマキーを推定 */
export function extractThemesFromTrip(title: string, wishes: string | null | undefined): Set<ThemeFilter> {
    const text = `${title ?? ''} ${wishes ?? ''}`
    const result = new Set<ThemeFilter>()
    for (const t of THEME_OPTIONS) {
        if (t.regex.test(text)) result.add(t.key)
    }
    return result
}

export function extractOriginFromTitle(title: string): OriginFilter | null {
    const m = (title ?? '').match(/(東京|大阪|名古屋|福岡|札幌)発/)
    return (m?.[1] as OriginFilter | undefined) ?? null
}

export function getDurationBucket(days: number): DurationBucket {
    for (const d of DURATION_OPTIONS) if (d.days(days)) return d.key
    return '8+'
}

/** フィルタ判定：選択中のいずれにも該当することを要求（同一グループ内は OR、グループ間は AND） */
export function tripMatchesFilter(args: {
    title: string
    wishes: string | null | undefined
    duration_days: number
    filter: FilterState
}): boolean {
    const { filter } = args
    // テーマ：選択中なら、いずれかに合致する必要
    if (filter.themes.size > 0) {
        const themes = extractThemesFromTrip(args.title, args.wishes)
        const hit = Array.from(filter.themes).some(t => themes.has(t))
        if (!hit) return false
    }
    if (filter.durations.size > 0) {
        const b = getDurationBucket(args.duration_days)
        if (!filter.durations.has(b)) return false
    }
    if (filter.origins.size > 0) {
        const o = extractOriginFromTitle(args.title)
        // 出発地未明記のものは「東京発」を含む選択時のみ通す等の特別処理はしない（厳密に明記分のみ）
        if (!o || !filter.origins.has(o)) return false
    }
    return true
}

// ──────────── UI ────────────
type Props = {
    filter: FilterState
    onChange: (f: FilterState) => void
}

export default function PlanFilters({ filter, onChange }: Props) {
    function toggleTheme(t: ThemeFilter) {
        const next = new Set(filter.themes)
        next.has(t) ? next.delete(t) : next.add(t)
        onChange({ ...filter, themes: next })
    }
    function toggleDuration(d: DurationBucket) {
        const next = new Set(filter.durations)
        next.has(d) ? next.delete(d) : next.add(d)
        onChange({ ...filter, durations: next })
    }
    function toggleOrigin(o: OriginFilter) {
        const next = new Set(filter.origins)
        next.has(o) ? next.delete(o) : next.add(o)
        onChange({ ...filter, origins: next })
    }
    const totalSelected = filter.themes.size + filter.durations.size + filter.origins.size

    return (
        <div style={{
            background: 'white',
            border: '1px solid #f0f0f0',
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: 14,
            height: '100%',
        }}>
            <FilterGroup label="テーマ">
                {THEME_OPTIONS.map(o => (
                    <Chip key={o.key} active={filter.themes.has(o.key)} onClick={() => toggleTheme(o.key)}>
                        <span style={{ marginRight: 4 }}>{o.emoji}</span>{o.label}
                    </Chip>
                ))}
            </FilterGroup>
            <FilterGroup label="日数">
                {DURATION_OPTIONS.map(o => (
                    <Chip key={o.key} active={filter.durations.has(o.key)} onClick={() => toggleDuration(o.key)}>
                        {o.label}
                    </Chip>
                ))}
            </FilterGroup>
            <FilterGroup label="出発地">
                {ORIGIN_OPTIONS.map(o => (
                    <Chip key={o.key} active={filter.origins.has(o.key)} onClick={() => toggleOrigin(o.key)}>
                        {o.label}
                    </Chip>
                ))}
            </FilterGroup>
            {totalSelected > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={() => onChange(EMPTY_FILTER)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#6b7280',
                            fontSize: 12, fontWeight: 600,
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: 6,
                        }}
                    >× フィルタをクリア（{totalSelected}）</button>
                </div>
            )}
        </div>
    )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
                fontSize: 11, fontWeight: 700, color: '#94a3b8',
                letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{label}</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{children}</div>
        </div>
    )
}

function Chip({ active, onClick, children }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '5px 12px',
                borderRadius: 99,
                border: active ? '1.5px solid #7c3aed' : '1.5px solid #e5e7eb',
                background: active ? '#ede9fe' : 'white',
                color: active ? '#6b21a8' : '#475569',
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
            }}
        >{children}</button>
    )
}
