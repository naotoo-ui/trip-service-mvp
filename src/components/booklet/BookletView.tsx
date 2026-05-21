'use client'
import { useState, useEffect } from 'react'
import {
    DndContext, closestCenter, PointerSensor, KeyboardSensor,
    useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext, arrayMove,
    sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Trip, ItineraryDay, Spot } from '@/types'
import BookletNav from './BookletNav'
import BookletCover from './BookletCover'
import BookletBackCover from './BookletBackCover'
import BookletDayPage from './BookletDayPage'
import BookletSettings from './BookletSettings'
import SortableBlock from './blocks/SortableBlock'
import TextBlock from './blocks/TextBlock'
import PackingBlock from './blocks/PackingBlock'
import DividerBlock from './blocks/DividerBlock'
import SpacerBlock from './blocks/SpacerBlock'
import { getTheme, themes, type ThemeName } from './bookletThemes'
import {
    loadBookletConfig, saveBookletConfig, isCountedBlock,
    type BookletConfig, type BookletBlock,
} from './bookletConfig'

export default function BookletView({ trip, editToken }: { trip: Trip; editToken?: string }) {
    const editable = !!editToken
    const [config, setConfig] = useState<BookletConfig | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [localDays, setLocalDays] = useState<ItineraryDay[]>(trip.itinerary.days)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    )

    async function handleSpotUpdate(dayIdx: number, spotIdx: number, update: Partial<Spot>) {
        const newDays = localDays.map((d, di) =>
            di !== dayIdx ? d : {
                ...d,
                spots: d.spots.map((s, si) => si !== spotIdx ? s : { ...s, ...update }),
            }
        )
        setLocalDays(newDays)
        try {
            await fetch(`/api/trips/${trip.share_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itinerary: { ...trip.itinerary, days: newDays },
                    title: trip.title,
                    edit_token: editToken,
                }),
            })
        } catch {}
    }

    useEffect(() => {
        setMounted(true)
        setConfig(loadBookletConfig(trip.share_id, trip.itinerary.days.length))
    }, [trip.share_id, trip.itinerary.days.length])

    function updateConfig(next: BookletConfig) {
        setConfig(next)
        saveBookletConfig(trip.share_id, next)
    }

    function updateBlock(id: string, updater: (b: BookletBlock) => BookletBlock) {
        if (!config) return
        updateConfig({
            ...config,
            blocks: config.blocks.map(b => b.id === id ? updater(b) : b),
        })
    }

    function deleteBlock(id: string) {
        if (!config) return
        updateConfig({
            ...config,
            blocks: config.blocks.filter(b => b.id !== id),
        })
    }

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e
        if (!over || !config || active.id === over.id) return
        const oldIdx = config.blocks.findIndex(b => b.id === active.id)
        const newIdx = config.blocks.findIndex(b => b.id === over.id)
        if (oldIdx < 0 || newIdx < 0) return
        updateConfig({ ...config, blocks: arrayMove(config.blocks, oldIdx, newIdx) })
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

    function handleThemeChange(t: ThemeName) {
        updateConfig({ ...config!, themeName: t })
    }

    // ページ番号事前計算
    const pageNumMap = new Map<string, number>()
    let pCounter = 0
    config.blocks.forEach(b => {
        if (!isCountedBlock(b)) return
        pCounter += 1
        pageNumMap.set(b.id, pCounter)
    })
    function pageNum(id: string): number | undefined {
        return config!.showPageNumbers ? pageNumMap.get(id) : undefined
    }

    function renderBlockContent(block: BookletBlock): React.ReactNode {
        switch (block.kind) {
            case 'cover':
                return <BookletCover trip={trip} theme={theme} editable={editable} editToken={editToken} />
            case 'back-cover':
                return <BookletBackCover trip={trip} theme={theme} />
            case 'day': {
                const day = localDays[block.dayIdx]
                if (!day) return null
                return (
                    <BookletDayPage
                        day={day}
                        dayIdx={block.dayIdx}
                        startDate={trip.itinerary.start_date}
                        theme={theme}
                        enableNow={mounted}
                        editable={editable}
                        showUrlQrCode={config!.showUrlQrCode}
                        onSpotUpdate={(spotIdx, update) => handleSpotUpdate(block.dayIdx, spotIdx, update)}
                        pageNumber={pageNum(block.id)}
                    />
                )
            }
            case 'text':
                return (
                    <TextBlock
                        title={block.title}
                        content={block.content}
                        theme={theme}
                        editable={editable}
                        minHeight={block.minHeight}
                        pageNumber={pageNum(block.id)}
                        onTitleChange={editable ? (title => updateBlock(block.id, b => b.kind === 'text' ? { ...b, title } : b)) : undefined}
                        onContentChange={editable ? (content => updateBlock(block.id, b => b.kind === 'text' ? { ...b, content } : b)) : undefined}
                    />
                )
            case 'packing':
                return (
                    <PackingBlock
                        title={block.title}
                        content={block.content}
                        columns={block.columns}
                        theme={theme}
                        editable={editable}
                        minHeight={block.minHeight}
                        pageNumber={pageNum(block.id)}
                        onTitleChange={editable ? (title => updateBlock(block.id, b => b.kind === 'packing' ? { ...b, title } : b)) : undefined}
                        onContentChange={editable ? (content => updateBlock(block.id, b => b.kind === 'packing' ? { ...b, content } : b)) : undefined}
                        onColumnsChange={editable ? (columns => updateBlock(block.id, b => b.kind === 'packing' ? { ...b, columns } : b)) : undefined}
                    />
                )
            case 'divider':
                return <DividerBlock style={block.style} theme={theme} />
            case 'spacer':
                return <SpacerBlock height={block.height} editable={editable} />
        }
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

            <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 24px 56px' }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={config.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {config.blocks.map(block => (
                            <SortableBlock
                                key={block.id}
                                id={block.id}
                                kind={block.kind}
                                editable={editable}
                                canDelete={editable && block.kind !== 'cover' && block.kind !== 'back-cover' && block.kind !== 'day'}
                                onDelete={() => deleteBlock(block.id)}
                            >
                                {renderBlockContent(block)}
                            </SortableBlock>
                        ))}
                    </SortableContext>
                </DndContext>

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
