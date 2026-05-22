'use client'
import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
    DndContext, closestCenter, PointerSensor, KeyboardSensor,
    useSensor, useSensors,
    type DragEndEvent, type DragMoveEvent, type DragCancelEvent,
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
import BlockPalette from './blocks/BlockPalette'
import { getTheme, themes, type ThemeName } from './bookletThemes'
import {
    loadBookletConfig, saveBookletConfig, isCountedBlock,
    BLOCK_TEMPLATES,
    type BookletConfig, type BookletBlock, type BlockTemplate,
} from './bookletConfig'

export default function BookletView({ trip, editToken }: { trip: Trip; editToken?: string }) {
    const editable = !!editToken
    const isMobile = useIsMobile(960)
    const [config, setConfig] = useState<BookletConfig | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [localDays, setLocalDays] = useState<ItineraryDay[]>(trip.itinerary.days)
    // パレットから D&D 中の挿入位置ヒント（どのブロックの上/下に入るか）
    const [dragHint, setDragHint] = useState<{ overId: string; side: 'above' | 'below' } | null>(null)

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

    // パレットからクリック追加：表紙直後（先頭）に挿入
    function addBlockFromPalette(template: BlockTemplate) {
        if (!config) return
        const newBlock = template.factory()
        const coverIdx = config.blocks.findIndex(b => b.kind === 'cover')
        const insertAt = coverIdx >= 0 ? coverIdx + 1 : 0
        const next = [...config.blocks]
        next.splice(insertAt, 0, newBlock)
        updateConfig({ ...config, blocks: next })
    }

    // パレットからD&D：指定の over.id の前 or 後に挿入
    function insertBlockAt(templateIdx: number, overId: string, side: 'above' | 'below') {
        if (!config) return
        const template = BLOCK_TEMPLATES[templateIdx]
        if (!template) return
        const newBlock = template.factory()
        const targetIdx = config.blocks.findIndex(b => b.id === overId)
        const insertAt = targetIdx < 0
            ? config.blocks.length
            : (side === 'below' ? targetIdx + 1 : targetIdx)
        const next = [...config.blocks]
        next.splice(insertAt, 0, newBlock)
        updateConfig({ ...config, blocks: next })
    }

    // ドラッグ中の active と over から「上半分/下半分」を判定
    function computeDropSide(activeRectTop: number, activeHeight: number, overTop: number, overHeight: number): 'above' | 'below' {
        const activeCenter = activeRectTop + activeHeight / 2
        const overCenter = overTop + overHeight / 2
        return activeCenter > overCenter ? 'below' : 'above'
    }

    function handleDragMove(e: DragMoveEvent) {
        const { active, over } = e
        if (!over || !active.data.current?.palette) {
            if (dragHint !== null) setDragHint(null)
            return
        }
        const aRect = active.rect.current.translated
        const oRect = over.rect
        if (!aRect || !oRect) return
        const side = computeDropSide(aRect.top, aRect.height, oRect.top, oRect.height)
        const nextHint = { overId: String(over.id), side }
        if (dragHint?.overId !== nextHint.overId || dragHint?.side !== nextHint.side) {
            setDragHint(nextHint)
        }
    }

    function handleDragCancel(_e: DragCancelEvent) {
        setDragHint(null)
    }

    function handleDragEnd(e: DragEndEvent) {
        setDragHint(null)
        const { active, over } = e
        if (!over || !config) return

        // パレット由来のドラッグ → 上半分なら前に、下半分なら後に挿入
        if (active.data.current?.palette) {
            const tIdx = active.data.current.templateIdx as number
            const aRect = active.rect.current.translated
            const oRect = over.rect
            const side = aRect && oRect
                ? computeDropSide(aRect.top, aRect.height, oRect.top, oRect.height)
                : 'below'
            insertBlockAt(tIdx, String(over.id), side)
            return
        }

        if (active.id === over.id) return
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

    // リサイズ対応ブロックの設定
    function resizeProps(block: BookletBlock): { resizable: boolean; currentHeight?: number; onResize?: (h: number) => void } {
        if (block.kind === 'text' || block.kind === 'packing') {
            return {
                resizable: true,
                currentHeight: block.minHeight,
                onResize: (h: number) => updateBlock(block.id, b => {
                    if (b.kind === 'text') return { ...b, minHeight: h }
                    if (b.kind === 'packing') return { ...b, minHeight: h }
                    return b
                }),
            }
        }
        if (block.kind === 'spacer') {
            return {
                resizable: true,
                currentHeight: block.height,
                onResize: (h: number) => updateBlock(block.id, b => b.kind === 'spacer' ? { ...b, height: h } : b),
            }
        }
        return { resizable: false }
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

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div
                    className="booklet-layout"
                    style={{
                        display: 'flex',
                        maxWidth: editable && !isMobile ? 1120 : 832,
                        margin: '0 auto',
                        gap: 24,
                        alignItems: 'flex-start',
                        padding: '24px 16px',
                    }}
                >
                    {/* 中央：しおり本体 */}
                    <main
                        style={{
                            flex: 1, minWidth: 0,
                            maxWidth: 800,
                            paddingLeft: editable ? 40 : 0,
                        }}
                    >
                        <SortableContext items={config.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                            {config.blocks.map(block => {
                                const rProps = resizeProps(block)
                                const dropHint = dragHint?.overId === block.id ? dragHint.side : null
                                return (
                                    <SortableBlock
                                        key={block.id}
                                        id={block.id}
                                        kind={block.kind}
                                        editable={editable}
                                        canDelete={editable && block.kind !== 'cover' && block.kind !== 'back-cover' && block.kind !== 'day'}
                                        onDelete={() => deleteBlock(block.id)}
                                        resizable={rProps.resizable}
                                        currentHeight={rProps.currentHeight}
                                        onResize={rProps.onResize}
                                        dropHint={dropHint}
                                    >
                                        {renderBlockContent(block)}
                                    </SortableBlock>
                                )
                            })}
                        </SortableContext>

                        {/* モバイル時のパレット（サイドバー非表示の代わり） */}
                        {editable && isMobile && (
                            <div className="no-print" style={{ marginTop: 24 }}>
                                <BlockPalette theme={theme} onAdd={addBlockFromPalette} />
                            </div>
                        )}

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

                    {/* 右サイドバー：ブロックパレット（PCのみ・スクロール時も画面内に固定） */}
                    {editable && !isMobile && (
                        <aside
                            className="no-print booklet-palette-sidebar"
                            style={{
                                width: 240,
                                flexShrink: 0,
                                position: 'sticky',
                                top: 80,
                                alignSelf: 'flex-start',
                            }}
                        >
                            <BlockPalette theme={theme} onAdd={addBlockFromPalette} />
                        </aside>
                    )}
                </div>
            </DndContext>

            <BookletSettings
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                config={config}
                onUpdate={updateConfig}
            />
        </div>
    )
}
