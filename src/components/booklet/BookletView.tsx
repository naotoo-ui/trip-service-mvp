'use client'
import { useState, useEffect } from 'react'
import type { Trip } from '@/types'
import BookletNav from './BookletNav'
import BookletCover from './BookletCover'
import BookletBackCover from './BookletBackCover'
import BookletDayPage from './BookletDayPage'
import BookletOptionalPage from './BookletOptionalPage'
import BookletGapControl from './BookletGapControl'
import BookletSettings from './BookletSettings'
import { getTheme, themes, type ThemeName } from './bookletThemes'
import {
    loadBookletConfig, saveBookletConfig, computePageOrder,
    enabledPagesAt, positionLabel,
    type BookletConfig, type OptionalPageKind, type InsertPosition,
} from './bookletConfig'

export default function BookletView({ trip, editToken }: { trip: Trip; editToken?: string }) {
    const editable = !!editToken
    const [config, setConfig] = useState<BookletConfig | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setConfig(loadBookletConfig(trip.share_id))
    }, [trip.share_id])

    function updateConfig(next: BookletConfig) {
        setConfig(next)
        saveBookletConfig(trip.share_id, next)
    }

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
    const days = trip.itinerary.days

    function handleThemeChange(t: ThemeName) {
        updateConfig({ ...config!, themeName: t })
    }

    function handleToggleOptionalPage(kind: OptionalPageKind, position: InsertPosition, enabled: boolean) {
        const c = config!
        updateConfig({
            ...c,
            optionalPages: {
                ...c.optionalPages,
                [kind]: { ...c.optionalPages[kind], enabled, position },
            },
        })
    }

    function handleOptionalContentChange(kind: OptionalPageKind, content: string) {
        const c = config!
        updateConfig({
            ...c,
            optionalPages: {
                ...c.optionalPages,
                [kind]: { ...c.optionalPages[kind], content },
            },
        })
    }

    function handleOptionalColumnsChange(kind: OptionalPageKind, columns: 1 | 2 | 3) {
        const c = config!
        updateConfig({
            ...c,
            optionalPages: {
                ...c.optionalPages,
                [kind]: { ...c.optionalPages[kind], columns },
            },
        })
    }

    function handleMemosChange(dayIdx: number, memos: string[]) {
        updateConfig({
            ...config!,
            dayMemos: { ...config!.dayMemos, [dayIdx]: memos },
        })
    }

    // ページ番号の事前計算
    const pageOrder = computePageOrder(config, days.length)
    const pageNumMap = new Map<string, number>()
    let pCounter = 0
    pageOrder.forEach(p => {
        if (p === 'cover' || p === 'back-cover') return
        const key = typeof p === 'string' ? p
            : p.kind === 'day' ? `day-${p.idx}`
            : `opt-${p.pageKind}`
        pageNumMap.set(key, ++pCounter)
    })

    function pageNum(key: string): number | undefined {
        return config!.showPageNumbers ? pageNumMap.get(key) : undefined
    }

    const pageNumberStyle = {
        textAlign: 'center' as const,
        fontSize: 11,
        color: theme.subText,
        margin: '-8px 0 16px',
        letterSpacing: '0.1em',
        fontVariantNumeric: 'tabular-nums' as const,
    }

    function renderOptionalPages(pos: InsertPosition) {
        return enabledPagesAt(config!, pos).map(kind => {
            const entry = config!.optionalPages[kind]
            const n = pageNum(`opt-${kind}`)
            return (
                <div key={kind} style={{ position: 'relative' }}>
                    <BookletOptionalPage
                        pageKind={kind}
                        theme={theme}
                        content={entry.content}
                        editable={editable}
                        columns={(entry.columns ?? 1) as 1 | 2 | 3}
                        onColumnsChange={cols => handleOptionalColumnsChange(kind, cols)}
                        onChange={content => handleOptionalContentChange(kind, content)}
                    />
                    {n !== undefined && (
                        <p className="booklet-page-number" style={pageNumberStyle}>— {n} —</p>
                    )}
                </div>
            )
        })
    }

    function renderGap(pos: InsertPosition) {
        if (!editable) return null
        return (
            <BookletGapControl
                position={pos}
                label={positionLabel(pos, days.length)}
                config={config!}
                onToggle={handleToggleOptionalPage}
            />
        )
    }

    return (
        <div
            className="booklet-root"
            style={{ minHeight: '100vh', background: theme.pageBg, paddingBottom: 60 }}
        >
            <BookletNav
                shareId={trip.share_id}
                editToken={editToken}
                themeName={themeName}
                onThemeChange={handleThemeChange}
                onOpenSettings={() => setSettingsOpen(true)}
            />

            <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
                {/* 表紙 */}
                <BookletCover trip={trip} theme={theme} editable={editable} editToken={editToken} />

                {/* 表紙の後 */}
                {renderGap({ kind: 'after-cover' })}
                {renderOptionalPages({ kind: 'after-cover' })}

                {/* 各日のページ */}
                {days.map((day, idx) => {
                    const memos = config.dayMemos[idx] ?? []
                    const n = pageNum(`day-${idx}`)
                    return (
                        <div key={idx}>
                            <div style={{ position: 'relative' }}>
                                <BookletDayPage
                                    day={day}
                                    dayIdx={idx}
                                    startDate={trip.itinerary.start_date}
                                    theme={theme}
                                    enableNow={mounted}
                                    memos={memos}
                                    editable={editable}
                                    onMemosChange={ms => handleMemosChange(idx, ms)}
                                />
                                {n !== undefined && (
                                    <p className="booklet-page-number" style={pageNumberStyle}>— {n} —</p>
                                )}
                            </div>
                            {renderGap({ kind: 'after-day', dayIdx: idx })}
                            {renderOptionalPages({ kind: 'after-day', dayIdx: idx })}
                        </div>
                    )
                })}

                {/* 背表紙の前 */}
                {renderGap({ kind: 'before-back-cover' })}
                {renderOptionalPages({ kind: 'before-back-cover' })}

                {/* 背表紙 */}
                <BookletBackCover trip={trip} theme={theme} />

                <footer
                    className="no-print"
                    style={{
                        marginTop: 36, padding: '20px 16px',
                        textAlign: 'center', fontSize: 11, color: theme.subText,
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
                onUpdate={updateConfig}
            />
        </div>
    )
}
