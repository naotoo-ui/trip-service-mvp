export type ThemeName = 'classic' | 'warm' | 'mono'

export type Theme = {
    name: ThemeName
    label: string
    pageBg: string             // ページ全体の背景
    paperBg: string            // 紙（カード）の背景
    paperBorder: string
    coverBg: string            // 表紙のグラデor単色
    coverText: string
    accent: string             // タイトル・アクセント色
    subAccent: string          // 補助アクセント
    text: string               // 本文
    subText: string            // 補助テキスト
    timelineBar: string        // 縦タイムラインバー
    typeColors: Record<string, { bg: string; border: string; text: string }>
}

export const themes: Record<ThemeName, Theme> = {
    classic: {
        name: 'classic',
        label: 'Classic（青・白）',
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
    },
    warm: {
        name: 'warm',
        label: 'Warm（温・柔らか）',
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
    },
    mono: {
        name: 'mono',
        label: 'Mono（モノクロ・印刷向き）',
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
    },
}

export function getTheme(name: ThemeName): Theme {
    return themes[name] ?? themes.classic
}
