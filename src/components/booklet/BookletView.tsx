'use client'
import { useState, useEffect } from 'react'
import type { Trip } from '@/types'
import BookletNav from './BookletNav'
import BookletCover from './BookletCover'
import BookletBackCover from './BookletBackCover'
import BookletDayPage from './BookletDayPage'
import BookletOptionalPage from './BookletOptionalPage'
import BookletSettings from './BookletSettings'
import { getTheme, themes, type ThemeName } from './bookletThemes'
import {
    loadBookletConfig, saveBookletConfig, computePageOrder,
    type BookletConfig, type OptionalPageKind, type ViewMode, type PageKey,
} from './bookletConfig'

export default function BookletView({ trip, editToken }: { trip: Trip; editToken?: string }) {
    const editable = !!editToken
    const [config, setConfig] = useState<BookletConfig | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // 初回マウント：localStorage 読込
    useEffect(() => {
        setMounted(true)
        setConfig(loadBookletConfig(trip.share_id))
    }, [trip.share_id])

    function updateConfig(next: BookletConfig) {
        setConfig(next)
        saveBookletConfig(trip.share_id, next)
    }

    // 初期状態（SSR / 読込前）
    if (!config) {
        const fallbackTheme = getTheme('sakura')
        return (
            <div style={{ minHeight: '100vh', background: fallbackTheme.pageBg }}>
                <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
                    <BookletCover trip={trip} theme={fallbackTheme} />
                </main>
            </div>
        )
    }

    const themeName = (config.themeName in themes ? config.themeName : 'sakura') as ThemeName
    const theme = getTheme(themeName)
    const daysCount = trip.itinerary.days.length
    const pageOrder = computePageOrder(config, daysCount, config.activeMode)
    const modeCfg = config[config.activeMode]

    function handleThemeChange(t: ThemeName) {
        updateConfig({ ...config!, themeName: t })
    }

    function handleModeChange(m: ViewMode) {
        updateConfig({ ...config!, activeMode: m })
    }

    function handleMemosChange(dayIdx: number, memos: string[]) {
        const c = config!
        updateConfig({
            ...c,
            [c.activeMode]: {
                ...c[c.activeMode],
                dayMemos: { ...c[c.activeMode].dayMemos, [dayIdx]: memos },
            },
        })
    }

    function handleOptionalContentChange(kind: OptionalPageKind, content: string) {
        const c = config!
        const entry = c[c.activeMode].optionalPages[kind]
        updateConfig({
            ...c,
            [c.activeMode]: {
                ...c[c.activeMode],
                optionalPages: {
                    ...c[c.activeMode].optionalPages,
                    [kind]: { ...entry, content },
                },
            },
        })
    }

    // ページ番号計算：表紙・背表紙以外に通し番号を振る
    const pageNumbers = new Map<string, number>()
    let pageNo = 0
    pageOrder.forEach(p => {
        if (p === 'cover' || p === 'back-cover') return
        pageNo += 1
        pageNumbers.set(pageKeyToString(p), pageNo)
    })

    return (
        <div
            className={`booklet-root booklet-mode-${config.activeMode}`}
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
                mode={config.activeMode}
                onModeChange={handleModeChange}
                onOpenSettings={() => setSettingsOpen(true)}
            />

            <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
                {pageOrder.map((page, i) => {
                    const pageNum = pageNumbers.get(pageKeyToString(page))
                    const showNumber = config.showPageNumbers && pageNum !== undefined
                    return (
                        <div key={pageKeyToString(page) + '@' + i} style={{ position: 'relative' }}>
                            {renderPage(page)}
                            {showNumber && (
                                <p
                                    className="booklet-page-number"
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 11,
                                        color: theme.subText,
                                        margin: '-8px 0 16px',
                                        letterSpacing: '0.1em',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    — {pageNum} —
                                </p>
                            )}
                        </div>
                    )
                })}

                <footer
                    className="no-print"
                    style={{
                        marginTop: 36,
                        padding: '20px 16px',
                        textAlign: 'center',
                        fontSize: 11,
                        color: theme.subText,
                    }}
                >
                    <p style={{ margin: 0 }}>
                        AIが生成した旅程をしおりに変換 ・ 旅程ジェネレーター
                    </p>
                </footer>
            </main>

            <BookletSettings
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                config={config}
                daysCount={daysCount}
                onUpdate={updateConfig}
            />
        </div>
    )

    function renderPage(page: PageKey) {
        if (page === 'cover') return <BookletCover trip={trip} theme={theme} />
        if (page === 'back-cover') return <BookletBackCover trip={trip} theme={theme} />
        if (page.kind === 'day') {
            const day = trip.itinerary.days[page.idx]
            const memos = modeCfg.dayMemos[page.idx] ?? []
            return (
                <BookletDayPage
                    day={day}
                    dayIdx={page.idx}
                    startDate={trip.itinerary.start_date}
                    theme={theme}
                    enableNow={mounted}
                    memos={memos}
                    editable={editable}
                    onMemosChange={ms => handleMemosChange(page.idx, ms)}
                />
            )
        }
        if (page.kind === 'optional') {
            const entry = modeCfg.optionalPages[page.pageKind]
            return (
                <BookletOptionalPage
                    pageKind={page.pageKind}
                    theme={theme}
                    content={entry.content}
                    editable={editable}
                    onChange={content => handleOptionalContentChange(page.pageKind, content)}
                />
            )
        }
        return null
    }
}

function pageKeyToString(p: PageKey): string {
    if (typeof p === 'string') return p
    if (p.kind === 'day') return `day-${p.idx}`
    return `opt-${p.pageKind}`
}
