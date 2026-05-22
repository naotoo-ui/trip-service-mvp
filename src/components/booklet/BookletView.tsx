'use client'
import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
    DndContext, closestCenter, pointerWithin, PointerSensor, KeyboardSensor,
    useDroppable, useSensor, useSensors,
    type DragEndEvent, type DragMoveEvent, type DragCancelEvent,
    type DragStartEvent, type CollisionDetection,
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
import BookletDayHeader from './BookletDayHeader'
import BookletSettings from './BookletSettings'
import SortablePage from './blocks/SortablePage'
import SortableInnerBlock from './blocks/SortableInnerBlock'
import TextBlock from './blocks/TextBlock'
import PackingBlock from './blocks/PackingBlock'
import DividerBlock from './blocks/DividerBlock'
import SpacerBlock from './blocks/SpacerBlock'
import BlockPalette from './blocks/BlockPalette'
import { PageDecoration } from './BookletDecorations'
import { getTheme, themes, type ThemeName, type Theme } from './bookletThemes'
import { getFontFamily } from './bookletFont'
import {
    loadBookletConfig, saveBookletConfig, isCountedItem, findBlockOrItem,
    generateBlockId, BLOCK_TEMPLATES,
    type BookletConfig, type BookletItem, type PrimitiveBlock, type BlockTemplate,
} from './bookletConfig'

const DAY_ANCHOR_SUFFIX = '__day-anchor'
const isDayAnchorId = (id: string) => id.endsWith(DAY_ANCHOR_SUFFIX)
const dayAnchorOfItem = (itemId: string) => itemId + DAY_ANCHOR_SUFFIX
const itemOfDayAnchor = (anchorId: string) => anchorId.slice(0, -DAY_ANCHOR_SUFFIX.length)

// 「ページ間：新規ページとして追加」用のドロップゾーン id
const NEW_PAGE_GAP_PREFIX = '__new-page-gap-'
const isNewPageGapId = (id: string) => id.startsWith(NEW_PAGE_GAP_PREFIX)
const gapInsertIdx = (id: string) => parseInt(id.slice(NEW_PAGE_GAP_PREFIX.length), 10)

export default function BookletView({ trip, editToken }: { trip: Trip; editToken?: string }) {
    const editable = !!editToken
    const isMobile = useIsMobile(960)
    const [config, setConfig] = useState<BookletConfig | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [localDays, setLocalDays] = useState<ItineraryDay[]>(trip.itinerary.days)
    const [dragHint, setDragHint] = useState<{ overId: string; side: 'above' | 'below' } | null>(null)
    const [paletteDragActive, setPaletteDragActive] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    )

    // カーソルが実際に重なっている要素を優先。重なりが複数ある場合は
    // 最も小さい（＝最も内側 / 具体的な）droppable を選ぶことで、ページ本体ではなく
    // その中のブロックが優先される。
    // pointerWithin はキーボード操作時に無効なので、その場合は closestCenter にフォールバック。
    const collisionDetection: CollisionDetection = (args) => {
        if (args.pointerCoordinates) {
            const ptr = pointerWithin(args)
            if (ptr.length > 0) {
                return [...ptr].sort((a, b) => {
                    const aRect = args.droppableRects.get(a.id)
                    const bRect = args.droppableRects.get(b.id)
                    if (!aRect || !bRect) return 0
                    return (aRect.width * aRect.height) - (bRect.width * bRect.height)
                })
            }
        }
        return closestCenter(args)
    }

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

    function mapItems(mutator: (items: BookletItem[]) => BookletItem[]) {
        if (!config) return
        updateConfig({ ...config, items: mutator(config.items) })
    }

    // ─── プリミティブブロック更新 ───
    function updatePrimitive(id: string, updater: (b: PrimitiveBlock) => PrimitiveBlock) {
        if (!config) return
        const items = config.items.map(item => {
            if (item.kind === 'composite') {
                return { ...item, blocks: item.blocks.map(b => b.id === id ? updater(b) : b) }
            }
            if (item.kind === 'day') {
                return {
                    ...item,
                    blocksAbove: item.blocksAbove.map(b => b.id === id ? updater(b) : b),
                    blocksBelow: item.blocksBelow.map(b => b.id === id ? updater(b) : b),
                }
            }
            return item
        })
        updateConfig({ ...config, items })
    }

    // ─── プリミティブブロック削除（composite が空になったらページごと削除） ───
    function deletePrimitive(id: string) {
        if (!config) return
        const result: BookletItem[] = []
        for (const item of config.items) {
            if (item.kind === 'composite') {
                const next = item.blocks.filter(b => b.id !== id)
                if (next.length > 0) result.push({ ...item, blocks: next })
                // 空になった composite は消滅
                continue
            }
            if (item.kind === 'day') {
                result.push({
                    ...item,
                    blocksAbove: item.blocksAbove.filter(b => b.id !== id),
                    blocksBelow: item.blocksBelow.filter(b => b.id !== id),
                })
                continue
            }
            result.push(item)
        }
        updateConfig({ ...config, items: result })
    }

    // ─── ページアイテム削除 ───
    function deleteItem(itemId: string) {
        mapItems(items => items.filter(i => i.id !== itemId))
    }

    // ─── パレットから「ページ間 gap」へのドロップ：新規 composite ページとして挿入 ───
    function insertNewPageAt(template: BlockTemplate, insertIdx: number) {
        if (!config) return
        const newBlock = template.factory()
        const newItem: BookletItem = { id: generateBlockId(), kind: 'composite', blocks: [newBlock] }
        const items = [...config.items]
        const safeIdx = Math.max(0, Math.min(insertIdx, items.length))
        items.splice(safeIdx, 0, newItem)
        updateConfig({ ...config, items })
    }

    // ─── パレットから挿入：target の上下に応じて適切な場所へ ───
    function insertFromPalette(template: BlockTemplate, overId: string, side: 'above' | 'below') {
        if (!config) return

        // ページ間 gap → 新規ページ作成
        if (isNewPageGapId(overId)) {
            insertNewPageAt(template, gapInsertIdx(overId))
            return
        }

        const newBlock = template.factory()

        // day anchor へのドロップ → 該当日の above/below に追加
        if (isDayAnchorId(overId)) {
            const itemId = itemOfDayAnchor(overId)
            const items = config.items.map(it => {
                if (it.id !== itemId || it.kind !== 'day') return it
                if (side === 'above') return { ...it, blocksAbove: [...it.blocksAbove, newBlock] }
                return { ...it, blocksBelow: [newBlock, ...it.blocksBelow] }
            })
            updateConfig({ ...config, items })
            return
        }

        const found = findBlockOrItem(config.items, overId)
        if (!found) return

        // case A: target は item 自体（cover/back-cover/day/composite）
        if (found.array === null) {
            const item = found.item
            if (item.kind === 'cover' || item.kind === 'back-cover') {
                // 表紙/背表紙の前後は新規 composite ページとして追加
                const newItem: BookletItem = { id: generateBlockId(), kind: 'composite', blocks: [newBlock] }
                const items = [...config.items]
                items.splice(side === 'above' ? found.itemIdx : found.itemIdx + 1, 0, newItem)
                updateConfig({ ...config, items })
                return
            }
            if (item.kind === 'composite') {
                const items = config.items.map((it, i) => {
                    if (i !== found.itemIdx || it.kind !== 'composite') return it
                    if (side === 'above') return { ...it, blocks: [newBlock, ...it.blocks] }
                    return { ...it, blocks: [...it.blocks, newBlock] }
                })
                updateConfig({ ...config, items })
                return
            }
            if (item.kind === 'day') {
                const items = config.items.map((it, i) => {
                    if (i !== found.itemIdx || it.kind !== 'day') return it
                    if (side === 'above') return { ...it, blocksAbove: [...it.blocksAbove, newBlock] }
                    return { ...it, blocksBelow: [newBlock, ...it.blocksBelow] }
                })
                updateConfig({ ...config, items })
                return
            }
            return
        }

        // case B: target は item 内のプリミティブブロック
        const parentItem = found.item
        if (parentItem.kind === 'composite') {
            const newArr = [...parentItem.blocks]
            newArr.splice(side === 'above' ? found.blockIdx : found.blockIdx + 1, 0, newBlock)
            const items = config.items.map((it, i) =>
                i === found.itemIdx && it.kind === 'composite' ? { ...it, blocks: newArr } : it
            )
            updateConfig({ ...config, items })
            return
        }
        if (parentItem.kind === 'day') {
            const arrName = found.array
            const targetArr = arrName === 'above' ? parentItem.blocksAbove : parentItem.blocksBelow
            const newArr = [...targetArr]
            newArr.splice(side === 'above' ? found.blockIdx : found.blockIdx + 1, 0, newBlock)
            const items = config.items.map((it, i) => {
                if (i !== found.itemIdx || it.kind !== 'day') return it
                return arrName === 'above'
                    ? { ...it, blocksAbove: newArr }
                    : { ...it, blocksBelow: newArr }
            })
            updateConfig({ ...config, items })
            return
        }
    }

    // ─── パレットからクリック挿入：表紙の直後に新規 composite ページとして追加 ───
    function addBlockFromPalette(template: BlockTemplate) {
        if (!config) return
        const newBlock = template.factory()
        const newItem: BookletItem = { id: generateBlockId(), kind: 'composite', blocks: [newBlock] }
        const coverIdx = config.items.findIndex(it => it.kind === 'cover')
        const insertAt = coverIdx >= 0 ? coverIdx + 1 : 0
        const items = [...config.items]
        items.splice(insertAt, 0, newItem)
        updateConfig({ ...config, items })
    }

    // ─── inner block 並び替え（同じ parent 配列内のみ） ───
    function reorderInnerBlock(activeId: string, overId: string) {
        if (!config) return
        // どちらも同じ親の同じ配列に属する必要がある
        const a = findBlockOrItem(config.items, activeId)
        const b = findBlockOrItem(config.items, overId)
        if (!a || !b || a.itemIdx !== b.itemIdx || a.array !== b.array) return
        if (a.blockIdx === b.blockIdx) return

        const items = config.items.map((it, i) => {
            if (i !== a.itemIdx) return it
            if (it.kind === 'composite' && a.array === 'blocks') {
                return { ...it, blocks: arrayMove(it.blocks, a.blockIdx, b.blockIdx) }
            }
            if (it.kind === 'day' && a.array === 'above') {
                return { ...it, blocksAbove: arrayMove(it.blocksAbove, a.blockIdx, b.blockIdx) }
            }
            if (it.kind === 'day' && a.array === 'below') {
                return { ...it, blocksBelow: arrayMove(it.blocksBelow, a.blockIdx, b.blockIdx) }
            }
            return it
        })
        updateConfig({ ...config, items })
    }

    function computeDropSide(activeRectTop: number, activeHeight: number, overTop: number, overHeight: number): 'above' | 'below' {
        const activeCenter = activeRectTop + activeHeight / 2
        const overCenter = overTop + overHeight / 2
        return activeCenter > overCenter ? 'below' : 'above'
    }

    function handleDragStart(e: DragStartEvent) {
        if (e.active.data.current?.palette) {
            setPaletteDragActive(true)
        }
    }

    function handleDragMove(e: DragMoveEvent) {
        const { active, over } = e
        if (!over || !active.data.current?.palette) {
            if (dragHint !== null) setDragHint(null)
            return
        }
        const overIdStr = String(over.id)
        // ページ間ギャップへのドロップは side 不要（ヒントだけ overId を更新）
        if (isNewPageGapId(overIdStr)) {
            if (dragHint?.overId !== overIdStr) setDragHint({ overId: overIdStr, side: 'above' })
            return
        }
        const aRect = active.rect.current.translated
        const oRect = over.rect
        if (!aRect || !oRect) return
        const side = computeDropSide(aRect.top, aRect.height, oRect.top, oRect.height)
        const next = { overId: overIdStr, side }
        if (dragHint?.overId !== next.overId || dragHint?.side !== next.side) {
            setDragHint(next)
        }
    }

    function handleDragCancel(_e: DragCancelEvent) {
        setDragHint(null)
        setPaletteDragActive(false)
    }

    function handleDragEnd(e: DragEndEvent) {
        setDragHint(null)
        setPaletteDragActive(false)
        const { active, over } = e
        if (!over || !config) return

        // パレット由来 → 挿入
        if (active.data.current?.palette) {
            const tIdx = active.data.current.templateIdx as number
            const template = BLOCK_TEMPLATES[tIdx]
            if (!template) return
            const aRect = active.rect.current.translated
            const oRect = over.rect
            const side = aRect && oRect
                ? computeDropSide(aRect.top, aRect.height, oRect.top, oRect.height)
                : 'below'
            insertFromPalette(template, String(over.id), side)
            return
        }

        if (active.id === over.id) return
        const activeId = String(active.id)
        const overId = String(over.id)

        // 同じ contextに属する：上位アイテム間（page reorder）
        const isPageActive = config.items.some(it => it.id === activeId)
        const isPageOver = config.items.some(it => it.id === overId)
        if (isPageActive && isPageOver) {
            const oldIdx = config.items.findIndex(it => it.id === activeId)
            const newIdx = config.items.findIndex(it => it.id === overId)
            if (oldIdx < 0 || newIdx < 0) return
            updateConfig({ ...config, items: arrayMove(config.items, oldIdx, newIdx) })
            return
        }

        // inner block reorder（同じ親の同じ配列内）
        if (!isPageActive && !isDayAnchorId(activeId) && !isDayAnchorId(overId)) {
            reorderInnerBlock(activeId, overId)
        }
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

    // ─── ページ番号事前計算 ───
    const pageNumMap = new Map<string, number>()
    let pCounter = 0
    config.items.forEach(it => {
        if (!isCountedItem(it)) return
        pCounter += 1
        pageNumMap.set(it.id, pCounter)
    })
    function pageNum(id: string): number | undefined {
        return config!.showPageNumbers ? pageNumMap.get(id) : undefined
    }

    function resizePropsFor(block: PrimitiveBlock): { resizable: boolean; currentHeight?: number; onResize?: (h: number) => void } {
        if (block.kind === 'text' || block.kind === 'packing') {
            return {
                resizable: true,
                currentHeight: block.minHeight,
                onResize: (h: number) => updatePrimitive(block.id, b => {
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
                onResize: (h: number) => updatePrimitive(block.id, b => b.kind === 'spacer' ? { ...b, height: h } : b),
            }
        }
        return { resizable: false }
    }

    function renderPrimitiveBlock(block: PrimitiveBlock): React.ReactNode {
        switch (block.kind) {
            case 'text':
                return (
                    <TextBlock
                        title={block.title}
                        content={block.content}
                        theme={theme}
                        editable={editable}
                        minHeight={block.minHeight}
                        onTitleChange={editable ? (title => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, title } : b)) : undefined}
                        onContentChange={editable ? (content => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, content } : b)) : undefined}
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
                        onTitleChange={editable ? (title => updatePrimitive(block.id, b => b.kind === 'packing' ? { ...b, title } : b)) : undefined}
                        onContentChange={editable ? (content => updatePrimitive(block.id, b => b.kind === 'packing' ? { ...b, content } : b)) : undefined}
                        onColumnsChange={editable ? (columns => updatePrimitive(block.id, b => b.kind === 'packing' ? { ...b, columns } : b)) : undefined}
                    />
                )
            case 'divider':
                return <DividerBlock style={block.style} theme={theme} />
            case 'spacer':
                return <SpacerBlock height={block.height} editable={editable} />
        }
    }

    function renderInnerBlock(block: PrimitiveBlock, dropHint: 'above' | 'below' | null): React.ReactNode {
        const rProps = resizePropsFor(block)
        return (
            <SortableInnerBlock
                key={block.id}
                id={block.id}
                editable={editable}
                canDelete={true}
                onDelete={() => deletePrimitive(block.id)}
                resizable={rProps.resizable}
                currentHeight={rProps.currentHeight}
                onResize={rProps.onResize}
                dropHint={dropHint}
            >
                {renderPrimitiveBlock(block)}
            </SortableInnerBlock>
        )
    }

    function pageCardStyle(): React.CSSProperties {
        return {
            background: theme.paperBg,
            border: theme.paperBorder,
            borderRadius: theme.cardStyle === 'polaroid' ? 8 : 20,
            padding: '28px 26px',
            boxShadow: theme.cardStyle === 'soft'
                ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                : '0 2px 12px rgba(15, 23, 42, 0.04)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: getFontFamily(theme.fontStyle),
        }
    }

    function renderPageContent(item: BookletItem): React.ReactNode {
        if (item.kind === 'cover') {
            return <BookletCover trip={trip} theme={theme} editable={editable} editToken={editToken} />
        }
        if (item.kind === 'back-cover') {
            return <BookletBackCover trip={trip} theme={theme} />
        }

        const pn = pageNum(item.id)

        if (item.kind === 'day') {
            const innerIds = [
                ...item.blocksAbove.map(b => b.id),
                dayAnchorOfItem(item.id),
                ...item.blocksBelow.map(b => b.id),
            ]
            const dayAnchorHint = dragHint?.overId === dayAnchorOfItem(item.id) ? dragHint.side : null
            const day = localDays[item.dayIdx]
            return (
                <article className="booklet-page booklet-page-day" style={pageCardStyle()}>
                    <PageDecoration kind={theme.decoration} accent={theme.accent} />
                    {/* ページタイトル（Day N + 日付）— ソータブル外で常に最上部 */}
                    {day && (
                        <BookletDayHeader
                            day={day}
                            dayIdx={item.dayIdx}
                            startDate={trip.itinerary.start_date}
                            theme={theme}
                            enableToday={mounted}
                        />
                    )}
                    <SortableContext items={innerIds} strategy={verticalListSortingStrategy}>
                        {item.blocksAbove.map(b => renderInnerBlock(b, dragHint?.overId === b.id ? dragHint.side : null))}
                        <SortableInnerBlock
                            id={dayAnchorOfItem(item.id)}
                            editable={editable}
                            canDelete={false}
                            draggable={false}
                            dropHint={dayAnchorHint}
                        >
                            <BookletDayPage
                                day={day}
                                dayIdx={item.dayIdx}
                                startDate={trip.itinerary.start_date}
                                theme={theme}
                                enableNow={mounted}
                                editable={editable}
                                showUrlQrCode={config!.showUrlQrCode}
                                onSpotUpdate={(spotIdx, update) => handleSpotUpdate(item.dayIdx, spotIdx, update)}
                            />
                        </SortableInnerBlock>
                        {item.blocksBelow.map(b => renderInnerBlock(b, dragHint?.overId === b.id ? dragHint.side : null))}
                    </SortableContext>
                    {pn !== undefined && (
                        <p style={pageNumberStyle(theme)}>— {pn} —</p>
                    )}
                </article>
            )
        }

        // composite
        const innerIds = item.blocks.map(b => b.id)
        return (
            <article className="booklet-page booklet-page-composite" style={pageCardStyle()}>
                <PageDecoration kind={theme.decoration} accent={theme.accent} />
                <SortableContext items={innerIds} strategy={verticalListSortingStrategy}>
                    {item.blocks.map(b => renderInnerBlock(b, dragHint?.overId === b.id ? dragHint.side : null))}
                </SortableContext>
                {pn !== undefined && (
                    <p style={pageNumberStyle(theme)}>— {pn} —</p>
                )}
            </article>
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

            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={handleDragStart}
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
                    <main
                        style={{
                            flex: 1, minWidth: 0,
                            maxWidth: 800,
                            paddingLeft: editable ? 44 : 0,
                        }}
                    >
                        <SortableContext items={config.items.map(it => it.id)} strategy={verticalListSortingStrategy}>
                            {/* 先頭ギャップ（表紙より前ではないので、表紙の後に表示するために先頭は省略） */}
                            {config.items.map((item, idx) => {
                                const pageHint = dragHint?.overId === item.id ? dragHint.side : null
                                const canDeletePage = item.kind === 'composite'
                                return (
                                    <div key={item.id}>
                                        {/* ページの前のギャップ（idx === 0 は不要：表紙の前） */}
                                        {idx > 0 && editable && (
                                            <NewPageGap
                                                insertIdx={idx}
                                                visible={paletteDragActive}
                                                highlighted={dragHint?.overId === `${NEW_PAGE_GAP_PREFIX}${idx}`}
                                            />
                                        )}
                                        <SortablePage
                                            id={item.id}
                                            kind={item.kind}
                                            editable={editable}
                                            canDelete={canDeletePage}
                                            onDelete={() => deleteItem(item.id)}
                                            dropHint={pageHint}
                                        >
                                            {renderPageContent(item)}
                                        </SortablePage>
                                    </div>
                                )
                            })}
                            {/* 末尾ギャップ（背表紙の後ろにはページが入らないので、配列末尾＝背表紙の前に挿入） */}
                            {/* 配列末尾は通常 back-cover なので、その直前へ挿入する用のギャップは不要（直前のループの idx で対応済み） */}
                        </SortableContext>

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

function pageNumberStyle(theme: Theme): React.CSSProperties {
    return {
        textAlign: 'center', fontSize: 11, letterSpacing: '0.1em',
        fontVariantNumeric: 'tabular-nums', color: theme.subText,
        margin: '16px 0 -4px', position: 'relative', zIndex: 2,
    }
}

// ページ間に表示される「新規ページとして追加」用のドロップゾーン
function NewPageGap({ insertIdx, visible, highlighted }: { insertIdx: number; visible: boolean; highlighted: boolean }) {
    const id = `${NEW_PAGE_GAP_PREFIX}${insertIdx}`
    const { setNodeRef, isOver } = useDroppable({ id })
    const active = isOver || highlighted
    return (
        <div
            ref={setNodeRef}
            className="no-print booklet-new-page-gap"
            style={{
                height: visible ? (active ? 46 : 24) : 0,
                margin: visible ? '8px 0' : 0,
                borderRadius: 12,
                background: active ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                border: visible
                    ? `2px ${active ? 'solid' : 'dashed'} ${active ? '#2563eb' : '#cbd5e1'}`
                    : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2563eb',
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.05em',
                transition: 'height 0.18s, background 0.18s, border-color 0.18s',
                overflow: 'hidden',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            {visible && active && '＋ 新規ページとして追加'}
        </div>
    )
}
