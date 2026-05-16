'use client'
import { useState, useEffect } from 'react'
import type { Trip } from '@/types'
import BookletNav from './BookletNav'
import BookletCover from './BookletCover'
import BookletDayPage from './BookletDayPage'
import { getTheme, type ThemeName } from './bookletThemes'

const THEME_KEY = 'tripgen.bookletTheme.v1'

export default function BookletView({ trip, editToken }: { trip: Trip; editToken?: string }) {
    const [themeName, setThemeName] = useState<ThemeName>('classic')
    const [mounted, setMounted]     = useState(false)

    // localStorage からテーマ読込
    useEffect(() => {
        setMounted(true)
        try {
            const saved = window.localStorage.getItem(THEME_KEY) as ThemeName | null
            if (saved === 'classic' || saved === 'warm' || saved === 'mono') setThemeName(saved)
        } catch {}
    }, [])

    function handleThemeChange(t: ThemeName) {
        setThemeName(t)
        try { window.localStorage.setItem(THEME_KEY, t) } catch {}
    }

    const theme = getTheme(themeName)

    return (
        <div
            className="booklet-root"
            style={{
                minHeight: '100vh',
                background: theme.pageBg,
                paddingBottom: 60,
            }}
        >
            <BookletNav
                shareId={trip.share_id}
                editToken={editToken}
                themeName={themeName}
                onThemeChange={handleThemeChange}
            />

            <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
                {/* 表紙 */}
                <BookletCover trip={trip} theme={theme} />

                {/* 日別ページ */}
                {trip.itinerary.days.map((day, i) => (
                    <BookletDayPage
                        key={i}
                        day={day}
                        dayIdx={i}
                        startDate={trip.itinerary.start_date}
                        theme={theme}
                        // 旅行当日だけ NOW ハイライトを有効化
                        enableNow={mounted}
                    />
                ))}

                {/* フッター */}
                <footer
                    className="booklet-footer no-print"
                    style={{
                        marginTop: 36,
                        padding: '20px 16px',
                        textAlign: 'center',
                        fontSize: 11,
                        color: '#94a3b8',
                    }}
                >
                    <p style={{ margin: 0 }}>
                        🗺️ AIが生成した旅程をしおりに変換 ・ 旅程ジェネレーター
                    </p>
                </footer>
            </main>
        </div>
    )
}
