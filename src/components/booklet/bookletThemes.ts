export type ThemeName =
    | 'classic' | 'warm' | 'mono'
    | 'sakura' | 'cream' | 'mint' | 'lavender' | 'sky' | 'polaroid' | 'korean'
    | 'rose' | 'galaxy' | 'wa' | 'y2k'

export type ThemeCategory =
    | 'girly' | 'natural' | 'mint' | 'fantasy'
    | 'vintage' | 'korean' | 'wa' | 'chic'

export type DecorationKind =
    | 'none' | 'dots' | 'washi' | 'lines' | 'grid' | 'wave'

export type CardStyle = 'flat' | 'soft' | 'sticker' | 'polaroid'
export type BadgeStyle = 'classic' | 'soft' | 'sticker'
export type FontStyle = 'rounded' | 'serif' | 'classic'

export type Theme = {
    name: ThemeName
    label: string
    description: string
    category: ThemeCategory
    isPremium: boolean

    // 配色
    pageBg: string
    paperBg: string
    paperBorder: string
    coverBg: string
    coverText: string
    accent: string
    subAccent: string
    text: string
    subText: string
    timelineBar: string
    typeColors: Record<string, { bg: string; border: string; text: string }>

    // 装飾（CSSパターンのみ・絵文字なし）
    decoration: DecorationKind
    cardStyle: CardStyle
    badgeStyle: BadgeStyle
    fontStyle: FontStyle
}

// ──────────── 無料テーマ ────────────

const classic: Theme = {
    name: 'classic',
    label: 'Classic',
    description: '青と白の定番。落ち着いた印象でビジネス旅行にも',
    category: 'chic',
    isPremium: false,
    pageBg: '#f1f5f9',
    paperBg: 'white',
    paperBorder: '1px solid #e2e8f0',
    coverBg: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #4338ca 100%)',
    coverText: 'white',
    accent: '#2563eb',
    subAccent: '#4338ca',
    text: '#0f172a',
    subText: '#64748b',
    timelineBar: '#dbeafe',
    typeColors: {
        観光:   { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
        グルメ: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
        移動:   { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' },
        宿泊:   { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
        その他: { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
    },
    decoration: 'none',
    cardStyle: 'flat',
    badgeStyle: 'classic',
    fontStyle: 'classic',
}

const sakura: Theme = {
    name: 'sakura',
    label: 'Sakura',
    description: '春爛漫のピンクパステル。柔らかな印象',
    category: 'girly',
    isPremium: false,
    pageBg: '#fef5f7',
    paperBg: '#fffafa',
    paperBorder: '1.5px solid #fbcfe8',
    coverBg: 'linear-gradient(135deg, #fbcfe8 0%, #fde2e2 50%, #fff5f7 100%)',
    coverText: '#9d174d',
    accent: '#ec4899',
    subAccent: '#f472b6',
    text: '#831843',
    subText: '#b48aa3',
    timelineBar: '#fce7f3',
    typeColors: {
        観光:   { bg: '#fce7f3', border: '#fbcfe8', text: '#be185d' },
        グルメ: { bg: '#fff0e5', border: '#fed7aa', text: '#ea580c' },
        移動:   { bg: '#fdf4ff', border: '#f5d0fe', text: '#a21caf' },
        宿泊:   { bg: '#f5f3ff', border: '#ddd6fe', text: '#7c3aed' },
        その他: { bg: '#ecfeff', border: '#a5f3fc', text: '#0891b2' },
    },
    decoration: 'dots',
    cardStyle: 'soft',
    badgeStyle: 'soft',
    fontStyle: 'rounded',
}

const cream: Theme = {
    name: 'cream',
    label: 'Cream Latte',
    description: '温かみのあるベージュ。カフェ巡りの旅に最適',
    category: 'natural',
    isPremium: false,
    pageBg: '#faf3eb',
    paperBg: '#fffaf0',
    paperBorder: '1.5px solid #e8d5b7',
    coverBg: 'linear-gradient(135deg, #d4a574 0%, #c89669 50%, #b8855a 100%)',
    coverText: '#ffffff',
    accent: '#8b6f47',
    subAccent: '#a47e5a',
    text: '#3e2f1c',
    subText: '#8c7355',
    timelineBar: '#e8d5b7',
    typeColors: {
        観光:   { bg: '#fef3e2', border: '#e8d5b7', text: '#8b6f47' },
        グルメ: { bg: '#fef2f2', border: '#fecaca', text: '#b85544' },
        移動:   { bg: '#fafaf9', border: '#e7e5e4', text: '#78716c' },
        宿泊:   { bg: '#fdf4ff', border: '#e9d5ff', text: '#7c3aed' },
        その他: { bg: '#f7fee7', border: '#d9f99d', text: '#65a30d' },
    },
    decoration: 'lines',
    cardStyle: 'soft',
    badgeStyle: 'soft',
    fontStyle: 'rounded',
}

const mint: Theme = {
    name: 'mint',
    label: 'Mint Soda',
    description: '爽やかなミントグリーン。夏の旅行にぴったり',
    category: 'mint',
    isPremium: false,
    pageBg: '#effaf5',
    paperBg: '#ffffff',
    paperBorder: '1.5px solid #a8e6cf',
    coverBg: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 50%, #6ec0a0 100%)',
    coverText: '#ffffff',
    accent: '#059669',
    subAccent: '#34d399',
    text: '#064e3b',
    subText: '#65a397',
    timelineBar: '#a7f3d0',
    typeColors: {
        観光:   { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
        グルメ: { bg: '#fef3c7', border: '#fde68a', text: '#92400e' },
        移動:   { bg: '#f0fdfa', border: '#99f6e4', text: '#0d9488' },
        宿泊:   { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
        その他: { bg: '#fef3c7', border: '#fde68a', text: '#a16207' },
    },
    decoration: 'dots',
    cardStyle: 'soft',
    badgeStyle: 'soft',
    fontStyle: 'rounded',
}

const lavender: Theme = {
    name: 'lavender',
    label: 'Lavender Dream',
    description: '夢見るような紫パステル。ロマンチック',
    category: 'fantasy',
    isPremium: false,
    pageBg: '#faf6ff',
    paperBg: '#ffffff',
    paperBorder: '1.5px solid #ddd6fe',
    coverBg: 'linear-gradient(135deg, #c9b5dd 0%, #b39bc8 50%, #9d80b3 100%)',
    coverText: '#ffffff',
    accent: '#8b5cf6',
    subAccent: '#a78bfa',
    text: '#4c1d95',
    subText: '#8c7ec0',
    timelineBar: '#ddd6fe',
    typeColors: {
        観光:   { bg: '#f5f3ff', border: '#ddd6fe', text: '#7c3aed' },
        グルメ: { bg: '#fdf2f8', border: '#fbcfe8', text: '#be185d' },
        移動:   { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' },
        宿泊:   { bg: '#fef3c7', border: '#fde68a', text: '#a16207' },
        その他: { bg: '#ecfdf5', border: '#a7f3d0', text: '#059669' },
    },
    decoration: 'dots',
    cardStyle: 'soft',
    badgeStyle: 'soft',
    fontStyle: 'rounded',
}

const sky: Theme = {
    name: 'sky',
    label: 'Sky Journal',
    description: 'どこまでも青い空。さっぱりとした清涼感',
    category: 'mint',
    isPremium: false,
    pageBg: '#f0f9ff',
    paperBg: '#ffffff',
    paperBorder: '1.5px solid #bae6fd',
    coverBg: 'linear-gradient(135deg, #a8d8ea 0%, #7fbedc 50%, #5b9bd5 100%)',
    coverText: '#ffffff',
    accent: '#0284c7',
    subAccent: '#38bdf8',
    text: '#0c4a6e',
    subText: '#6b8eaa',
    timelineBar: '#bae6fd',
    typeColors: {
        観光:   { bg: '#e0f2fe', border: '#bae6fd', text: '#0369a1' },
        グルメ: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
        移動:   { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' },
        宿泊:   { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
        その他: { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
    },
    decoration: 'wave',
    cardStyle: 'soft',
    badgeStyle: 'soft',
    fontStyle: 'rounded',
}

const polaroid: Theme = {
    name: 'polaroid',
    label: 'Polaroid',
    description: 'スクラップブック風。写真を貼ったような味わい',
    category: 'vintage',
    isPremium: false,
    pageBg: '#f5f3eb',
    paperBg: '#ffffff',
    paperBorder: '1.5px solid #d6d3d1',
    coverBg: 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)',
    coverText: '#ffffff',
    accent: '#dc2626',
    subAccent: '#f59e0b',
    text: '#27272a',
    subText: '#71717a',
    timelineBar: '#d6d3d1',
    typeColors: {
        観光:   { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
        グルメ: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
        移動:   { bg: '#fafaf9', border: '#e7e5e4', text: '#57534e' },
        宿泊:   { bg: '#fefce8', border: '#fde68a', text: '#a16207' },
        その他: { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
    },
    decoration: 'washi',
    cardStyle: 'polaroid',
    badgeStyle: 'sticker',
    fontStyle: 'classic',
}

const korean: Theme = {
    name: 'korean',
    label: 'Korean Beige',
    description: '韓国カフェ風ミニマル。落ち着いた大人の旅に',
    category: 'korean',
    isPremium: false,
    pageBg: '#f7f3ec',
    paperBg: '#fffdf9',
    paperBorder: '1.5px solid #e8d5b7',
    coverBg: 'linear-gradient(135deg, #f3ecd9 0%, #e8d5b7 50%, #d4b896 100%)',
    coverText: '#5d4825',
    accent: '#95775c',
    subAccent: '#a48a6e',
    text: '#3d2e1a',
    subText: '#8a7659',
    timelineBar: '#e8d5b7',
    typeColors: {
        観光:   { bg: '#fef3e2', border: '#e8d5b7', text: '#95775c' },
        グルメ: { bg: '#fef2f2', border: '#fecaca', text: '#b85544' },
        移動:   { bg: '#fafaf9', border: '#e7e5e4', text: '#78716c' },
        宿泊:   { bg: '#faf5ff', border: '#e9d5ff', text: '#7e22ce' },
        その他: { bg: '#f7fee7', border: '#d9f99d', text: '#65a30d' },
    },
    decoration: 'none',
    cardStyle: 'flat',
    badgeStyle: 'soft',
    fontStyle: 'serif',
}

const warm: Theme = {
    name: 'warm',
    label: 'Warm',
    description: 'オレンジの温かい雰囲気。家族旅行にも',
    category: 'natural',
    isPremium: false,
    pageBg: '#fef9f3',
    paperBg: '#fffdf9',
    paperBorder: '1px solid #fde7c8',
    coverBg: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #f97316 100%)',
    coverText: 'white',
    accent: '#ea580c',
    subAccent: '#dc2626',
    text: '#3b2410',
    subText: '#92702a',
    timelineBar: '#fed7aa',
    typeColors: {
        観光:   { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
        グルメ: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
        移動:   { bg: '#fefce8', border: '#fde68a', text: '#92400e' },
        宿泊:   { bg: '#fdf4ff', border: '#f5d0fe', text: '#a21caf' },
        その他: { bg: '#f7fee7', border: '#d9f99d', text: '#65a30d' },
    },
    decoration: 'none',
    cardStyle: 'flat',
    badgeStyle: 'classic',
    fontStyle: 'classic',
}

const mono: Theme = {
    name: 'mono',
    label: 'Mono',
    description: 'モノクロ。コピー機での印刷にも最適',
    category: 'chic',
    isPremium: false,
    pageBg: '#ffffff',
    paperBg: 'white',
    paperBorder: '1px solid #d1d5db',
    coverBg: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    coverText: 'white',
    accent: '#111827',
    subAccent: '#374151',
    text: '#0f172a',
    subText: '#6b7280',
    timelineBar: '#e5e7eb',
    typeColors: {
        観光:   { bg: '#f3f4f6', border: '#9ca3af', text: '#111827' },
        グルメ: { bg: '#f9fafb', border: '#9ca3af', text: '#111827' },
        移動:   { bg: '#f9fafb', border: '#d1d5db', text: '#6b7280' },
        宿泊:   { bg: '#f3f4f6', border: '#9ca3af', text: '#374151' },
        その他: { bg: '#f9fafb', border: '#d1d5db', text: '#374151' },
    },
    decoration: 'none',
    cardStyle: 'flat',
    badgeStyle: 'classic',
    fontStyle: 'classic',
}

// ──────────── 有料テーマ ────────────

const rose: Theme = {
    name: 'rose',
    label: 'Romantic Rose',
    description: 'ピンク × ゴールドの華やか系。記念日の旅に',
    category: 'girly',
    isPremium: true,
    pageBg: '#fff5f8',
    paperBg: '#fffafc',
    paperBorder: '1.5px solid #f5b8c8',
    coverBg: 'linear-gradient(135deg, #be185d 0%, #ec4899 50%, #d4a574 100%)',
    coverText: 'white',
    accent: '#be185d',
    subAccent: '#d4a574',
    text: '#831843',
    subText: '#a16282',
    timelineBar: '#fbcfe8',
    typeColors: {
        観光:   { bg: '#fce7f3', border: '#fbcfe8', text: '#be185d' },
        グルメ: { bg: '#fef3c7', border: '#fde68a', text: '#a16207' },
        移動:   { bg: '#fdf4ff', border: '#f5d0fe', text: '#a21caf' },
        宿泊:   { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
        その他: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
    },
    decoration: 'dots',
    cardStyle: 'soft',
    badgeStyle: 'sticker',
    fontStyle: 'serif',
}

const galaxy: Theme = {
    name: 'galaxy',
    label: 'Galaxy Night',
    description: '宇宙のような深い紺と紫。神秘的な旅に',
    category: 'fantasy',
    isPremium: true,
    pageBg: '#0f0e1c',
    paperBg: '#1a1830',
    paperBorder: '1.5px solid #3730a3',
    coverBg: 'linear-gradient(135deg, #0c0a20 0%, #312e81 40%, #6366f1 80%, #a78bfa 100%)',
    coverText: 'white',
    accent: '#a78bfa',
    subAccent: '#fbbf24',
    text: '#f3f4f6',
    subText: '#a5a3b8',
    timelineBar: '#312e81',
    typeColors: {
        観光:   { bg: '#1e1b4b', border: '#4338ca', text: '#c7d2fe' },
        グルメ: { bg: '#3b1414', border: '#dc2626', text: '#fca5a5' },
        移動:   { bg: '#1f2937', border: '#374151', text: '#9ca3af' },
        宿泊:   { bg: '#2e1065', border: '#7c3aed', text: '#ddd6fe' },
        その他: { bg: '#064e3b', border: '#059669', text: '#a7f3d0' },
    },
    decoration: 'dots',
    cardStyle: 'soft',
    badgeStyle: 'sticker',
    fontStyle: 'classic',
}

const wa: Theme = {
    name: 'wa',
    label: '和柄 -Wagara-',
    description: '紅色と桜色の和風。海外旅行のお土産にも',
    category: 'wa',
    isPremium: true,
    pageBg: '#fef7f0',
    paperBg: '#fffaf3',
    paperBorder: '1.5px solid #d4a574',
    coverBg: 'linear-gradient(135deg, #9f1239 0%, #c81d4c 40%, #e85284 75%, #fbcfe8 100%)',
    coverText: 'white',
    accent: '#c81d4c',
    subAccent: '#d4a574',
    text: '#3d1a2a',
    subText: '#8c6478',
    timelineBar: '#fbcfe8',
    typeColors: {
        観光:   { bg: '#fce7f3', border: '#fbcfe8', text: '#9f1239' },
        グルメ: { bg: '#fef3c7', border: '#fde68a', text: '#a16207' },
        移動:   { bg: '#f5f5f4', border: '#d6d3d1', text: '#57534e' },
        宿泊:   { bg: '#fdf4ff', border: '#f5d0fe', text: '#86198f' },
        その他: { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
    },
    decoration: 'lines',
    cardStyle: 'soft',
    badgeStyle: 'soft',
    fontStyle: 'serif',
}

const y2k: Theme = {
    name: 'y2k',
    label: 'Y2K Holographic',
    description: '2000年代のキラキラ。ホログラム風で流行り',
    category: 'vintage',
    isPremium: true,
    pageBg: '#fde6f5',
    paperBg: '#ffffff',
    paperBorder: '1.5px solid #c4b5fd',
    coverBg: 'linear-gradient(135deg, #ff70b5 0%, #c084fc 40%, #67e8f9 80%, #fde68a 100%)',
    coverText: 'white',
    accent: '#d946ef',
    subAccent: '#22d3ee',
    text: '#581c87',
    subText: '#9d6cb8',
    timelineBar: '#f5d0fe',
    typeColors: {
        観光:   { bg: '#fae8ff', border: '#f5d0fe', text: '#a21caf' },
        グルメ: { bg: '#fef3c7', border: '#fde68a', text: '#a16207' },
        移動:   { bg: '#ecfeff', border: '#a5f3fc', text: '#0891b2' },
        宿泊:   { bg: '#ede9fe', border: '#c4b5fd', text: '#6d28d9' },
        その他: { bg: '#fce7f3', border: '#fbcfe8', text: '#be185d' },
    },
    decoration: 'grid',
    cardStyle: 'sticker',
    badgeStyle: 'sticker',
    fontStyle: 'rounded',
}

// ──────────── エクスポート ────────────

export const themes: Record<ThemeName, Theme> = {
    classic, sakura, cream, mint, lavender, sky, polaroid, korean, warm, mono,
    rose, galaxy, wa, y2k,
}

export const themeOrder: ThemeName[] = [
    'sakura', 'rose',
    'cream', 'warm',
    'mint', 'sky',
    'lavender', 'galaxy',
    'polaroid', 'y2k',
    'korean', 'wa',
    'classic', 'mono',
]

export function getTheme(name: ThemeName): Theme {
    return themes[name] ?? themes.classic
}

export function getFreeThemes(): Theme[] {
    return themeOrder.map(n => themes[n]).filter(t => !t.isPremium)
}

export function getPremiumThemes(): Theme[] {
    return themeOrder.map(n => themes[n]).filter(t => t.isPremium)
}

export const categoryLabels: Record<ThemeCategory, string> = {
    girly:   'ガーリー',
    natural: 'ナチュラル',
    mint:    'ミント',
    fantasy: 'ファンタジー',
    vintage: 'ヴィンテージ',
    korean:  '韓国風',
    wa:      '和風',
    chic:    'シック',
}
