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
    type SortingStrategy,
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
import EmergencyBlock from './blocks/EmergencyBlock'
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

// パレット/インナーブロック/composite ドラッグ中に外側ページを視覚的にシャッフルしない
// （= NewPageGap や dropHint をはっきり見せるため）
const noShuffleStrategy: SortingStrategy = () => null

// 「ページ間：新規ページとして追加」用のドロップゾーン id
const NEW_PAGE_GAP_PREFIX = '__new-page-gap-'
const isNewPageGapId = (id: string) => id.startsWith(NEW_PAGE_GAP_PREFIX)
const gapInsertIdx = (id: string) => parseInt(id.slice(NEW_PAGE_GAP_PREFIX.length), 10)

// ──────────── データ操作の pure ヘルパー（モジュールレベル） ────────────

// 任意の primitive block を items の指定位置へ挿入。新規 composite ページ生成や、
// composite/day item 本体・既存 block 近接・day-anchor・new-page-gap の全ケースをカバー。
function insertBlockIntoItems(
    items: BookletItem[],
    block: PrimitiveBlock,
    overId: string,
    side: 'above' | 'below',
): BookletItem[] {
    // ページ間 gap → 新規 composite ページとして挿入
    if (isNewPageGapId(overId)) {
        const idx = Math.max(0, Math.min(gapInsertIdx(overId), items.length))
        const newItem: BookletItem = { id: generateBlockId(), kind: 'composite', blocks: [block] }
        const next = [...items]
        next.splice(idx, 0, newItem)
        return next
    }

    // day anchor → 該当日の blocksAbove / blocksBelow に追加
    if (isDayAnchorId(overId)) {
        const itemId = itemOfDayAnchor(overId)
        return items.map(it => {
            if (it.id !== itemId || it.kind !== 'day') return it
            return side === 'above'
                ? { ...it, blocksAbove: [...it.blocksAbove, block] }
                : { ...it, blocksBelow: [block, ...it.blocksBelow] }
        })
    }

    const found = findBlockOrItem(items, overId)
    if (!found) return items

    // ターゲットが item 本体
    if (found.array === null) {
        const item = found.item
        if (item.kind === 'cover' || item.kind === 'back-cover') {
            const newItem: BookletItem = { id: generateBlockId(), kind: 'composite', blocks: [block] }
            const next = [...items]
            next.splice(side === 'above' ? found.itemIdx : found.itemIdx + 1, 0, newItem)
            return next
        }
        if (item.kind === 'composite') {
            return items.map((it, i) => {
                if (i !== found.itemIdx || it.kind !== 'composite') return it
                return side === 'above'
                    ? { ...it, blocks: [block, ...it.blocks] }
                    : { ...it, blocks: [...it.blocks, block] }
            })
        }
        if (item.kind === 'day') {
            return items.map((it, i) => {
                if (i !== found.itemIdx || it.kind !== 'day') return it
                return side === 'above'
                    ? { ...it, blocksAbove: [...it.blocksAbove, block] }
                    : { ...it, blocksBelow: [block, ...it.blocksBelow] }
            })
        }
        return items
    }

    // ターゲットが item 内の primitive block
    const parentItem = found.item
    if (parentItem.kind === 'composite') {
        const newArr = [...parentItem.blocks]
        newArr.splice(side === 'above' ? found.blockIdx : found.blockIdx + 1, 0, block)
        return items.map((it, i) =>
            i === found.itemIdx && it.kind === 'composite' ? { ...it, blocks: newArr } : it
        )
    }
    if (parentItem.kind === 'day') {
        const arrName = found.array
        const targetArr = arrName === 'above' ? parentItem.blocksAbove : parentItem.blocksBelow
        const newArr = [...targetArr]
        newArr.splice(side === 'above' ? found.blockIdx : found.blockIdx + 1, 0, block)
        return items.map((it, i) => {
            if (i !== found.itemIdx || it.kind !== 'day') return it
            return arrName === 'above' ? { ...it, blocksAbove: newArr } : { ...it, blocksBelow: newArr }
        })
    }
    return items
}

// 複数の primitive block を一括で挿入する（composite ページマージ用）。
// 元の順序を保ったまま target の上下に挿入される。
function insertBlocksIntoItems(
    items: BookletItem[],
    blocks: PrimitiveBlock[],
    overId: string,
    side: 'above' | 'below',
): BookletItem[] {
    if (blocks.length === 0) return items

    if (isNewPageGapId(overId)) {
        const idx = Math.max(0, Math.min(gapInsertIdx(overId), items.length))
        const newItem: BookletItem = { id: generateBlockId(), kind: 'composite', blocks: [...blocks] }
        const next = [...items]
        next.splice(idx, 0, newItem)
        return next
    }

    if (isDayAnchorId(overId)) {
        const itemId = itemOfDayAnchor(overId)
        return items.map(it => {
            if (it.id !== itemId || it.kind !== 'day') return it
            return side === 'above'
                ? { ...it, blocksAbove: [...it.blocksAbove, ...blocks] }
                : { ...it, blocksBelow: [...blocks, ...it.blocksBelow] }
        })
    }

    const found = findBlockOrItem(items, overId)
    if (!found) return items

    if (found.array === null) {
        const item = found.item
        if (item.kind === 'cover' || item.kind === 'back-cover') {
            const newItem: BookletItem = { id: generateBlockId(), kind: 'composite', blocks: [...blocks] }
            const next = [...items]
            next.splice(side === 'above' ? found.itemIdx : found.itemIdx + 1, 0, newItem)
            return next
        }
        if (item.kind === 'composite') {
            return items.map((it, i) => {
                if (i !== found.itemIdx || it.kind !== 'composite') return it
                return side === 'above'
                    ? { ...it, blocks: [...blocks, ...it.blocks] }
                    : { ...it, blocks: [...it.blocks, ...blocks] }
            })
        }
        if (item.kind === 'day') {
            return items.map((it, i) => {
                if (i !== found.itemIdx || it.kind !== 'day') return it
                return side === 'above'
                    ? { ...it, blocksAbove: [...it.blocksAbove, ...blocks] }
                    : { ...it, blocksBelow: [...blocks, ...it.blocksBelow] }
            })
        }
        return items
    }

    const parentItem = found.item
    if (parentItem.kind === 'composite') {
        const newArr = [...parentItem.blocks]
        newArr.splice(side === 'above' ? found.blockIdx : found.blockIdx + 1, 0, ...blocks)
        return items.map((it, i) =>
            i === found.itemIdx && it.kind === 'composite' ? { ...it, blocks: newArr } : it
        )
    }
    if (parentItem.kind === 'day') {
        const arrName = found.array
        const targetArr = arrName === 'above' ? parentItem.blocksAbove : parentItem.blocksBelow
        const newArr = [...targetArr]
        newArr.splice(side === 'above' ? found.blockIdx : found.blockIdx + 1, 0, ...blocks)
        return items.map((it, i) => {
            if (i !== found.itemIdx || it.kind !== 'day') return it
            return arrName === 'above' ? { ...it, blocksAbove: newArr } : { ...it, blocksBelow: newArr }
        })
    }
    return items
}

// id で primitive block を取り除き、{ items, block } を返す。
function removeBlockById(items: BookletItem[], blockId: string): { items: BookletItem[]; block: PrimitiveBlock | null } {
    let removed: PrimitiveBlock | null = null
    const newItems = items.map(it => {
        if (removed) return it
        if (it.kind === 'composite') {
            const idx = it.blocks.findIndex(b => b.id === blockId)
            if (idx >= 0) {
                removed = it.blocks[idx]
                return { ...it, blocks: it.blocks.filter((_, i) => i !== idx) }
            }
            return it
        }
        if (it.kind === 'day') {
            const ai = it.blocksAbove.findIndex(b => b.id === blockId)
            if (ai >= 0) {
                removed = it.blocksAbove[ai]
                return { ...it, blocksAbove: it.blocksAbove.filter((_, i) => i !== ai) }
            }
            const bi = it.blocksBelow.findIndex(b => b.id === blockId)
            if (bi >= 0) {
                removed = it.blocksBelow[bi]
                return { ...it, blocksBelow: it.blocksBelow.filter((_, i) => i !== bi) }
            }
            return it
        }
        return it
    })
    return { items: newItems, block: removed }
}

// 空になった composite item を items から取り除く
function cleanupEmptyComposites(items: BookletItem[]): BookletItem[] {
    return items.filter(it => it.kind !== 'composite' || it.blocks.length > 0)
}

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
    // 同じイベント内で連続呼び出し（例：resetSpacing が content/letterSpacing/lineHeight を
    // 3回連続で更新するケース）でも race しないよう、必ず最新 state 起点で更新する
    // functional setState 形式にする。
    function updatePrimitive(id: string, updater: (b: PrimitiveBlock) => PrimitiveBlock) {
        setConfig(prev => {
            if (!prev) return prev
            const items = prev.items.map(item => {
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
            const next = { ...prev, items }
            saveBookletConfig(trip.share_id, next)
            return next
        })
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

    // ─── パレットから挿入：pure ヘルパー `insertBlockIntoItems` に委譲 ───
    function insertFromPalette(template: BlockTemplate, overId: string, side: 'above' | 'below') {
        if (!config) return
        const newBlock = template.factory()
        const next = insertBlockIntoItems(config.items, newBlock, overId, side)
        updateConfig({ ...config, items: next })
    }

    // ─── ページ内ブロックを別の位置に移動（同じページ内 reorder / クロスページ移動 /
    //      composite 取り出し→新規ページ化 すべて統一） ───
    function moveInnerBlock(activeId: string, overId: string, side: 'above' | 'below') {
        if (!config) return
        if (activeId === overId) return
        const { items: removed, block } = removeBlockById(config.items, activeId)
        if (!block) return
        const inserted = insertBlockIntoItems(removed, block, overId, side)
        const cleaned = cleanupEmptyComposites(inserted)
        updateConfig({ ...config, items: cleaned })
    }

    // ─── composite ページ全体を別の場所にマージする（外側ハンドルで composite を
    //      別の composite/day ページや block 近接にドロップしたケース） ───
    function mergeCompositeIntoTarget(activeCompositeId: string, overId: string, side: 'above' | 'below') {
        if (!config) return
        const source = config.items.find(it => it.id === activeCompositeId)
        if (!source || source.kind !== 'composite') return
        if (source.blocks.length === 0) return

        // 自分自身の中（同一 composite 内の block / 自分自身の item.id）にドロップ → 何もしない
        const overInSelf = source.blocks.some(b => b.id === overId) || overId === activeCompositeId
        if (overInSelf) return

        const itemsWithoutSource = config.items.filter(it => it.id !== activeCompositeId)
        const inserted = insertBlocksIntoItems(itemsWithoutSource, source.blocks, overId, side)
        updateConfig({ ...config, items: cleanupEmptyComposites(inserted) })
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

    // ターゲット rect とカーソル Y 位置から「上半分 / 下半分」を判定。
    // 縦長の active（例: composite ページ全体）でも、カーソル位置で正しく判定するため。
    function computeDropSideByPointer(pointerY: number | null, overTop: number, overHeight: number,
        fallbackActiveTop: number, fallbackActiveHeight: number): 'above' | 'below' {
        const overCenter = overTop + overHeight / 2
        if (pointerY !== null) return pointerY > overCenter ? 'below' : 'above'
        // フォールバック：active rect の中心比較
        const activeCenter = fallbackActiveTop + fallbackActiveHeight / 2
        return activeCenter > overCenter ? 'below' : 'above'
    }

    // @dnd-kit の active.activatorEvent（押下時のイベント）の clientY と delta.y から
    // 現在のカーソル Y を算出する。
    function currentPointerY(activatorEvent: Event | null, deltaY: number): number | null {
        if (!activatorEvent) return null
        if ('clientY' in activatorEvent && typeof (activatorEvent as MouseEvent).clientY === 'number') {
            return (activatorEvent as MouseEvent).clientY + deltaY
        }
        if ('touches' in activatorEvent) {
            const t = (activatorEvent as TouchEvent).touches[0]
            if (t) return t.clientY + deltaY
        }
        return null
    }

    // パレット / インナーブロック / composite ページの drag は「挿入/移動」が可能なので
    // NewPageGap や dropHint の対象になる。cover/back-cover/day の reorder は外側 sortable に任せる。
    function isInsertableDrag(activeId: string, fromPalette: boolean): boolean {
        if (fromPalette) return true
        if (isDayAnchorId(activeId)) return false
        const item = config?.items.find(it => it.id === activeId)
        if (!item) return true                            // primitive block
        if (item.kind === 'composite') return true        // composite はマージ可能
        return false                                       // cover / back-cover / day
    }

    function handleDragStart(e: DragStartEvent) {
        const aId = String(e.active.id)
        const fromPalette = !!e.active.data.current?.palette
        if (isInsertableDrag(aId, fromPalette)) {
            setPaletteDragActive(true)
        }
    }

    function handleDragMove(e: DragMoveEvent) {
        const { active, over } = e
        if (!over) {
            if (dragHint !== null) setDragHint(null)
            return
        }
        const aId = String(active.id)
        const fromPalette = !!active.data.current?.palette
        if (!isInsertableDrag(aId, fromPalette)) {
            // ページ並び替えなどは sortable の標準演出で行うので hint は出さない
            if (dragHint !== null) setDragHint(null)
            return
        }
        const overIdStr = String(over.id)

        // 自分の上にホバーしている場合はヒント不要
        if (overIdStr === aId) {
            if (dragHint !== null) setDragHint(null)
            return
        }

        // ページ間ギャップへのドロップは side 不要（ヒントだけ overId を更新）
        if (isNewPageGapId(overIdStr)) {
            if (dragHint?.overId !== overIdStr) setDragHint({ overId: overIdStr, side: 'above' })
            return
        }
        const aRect = active.rect.current.translated
        const oRect = over.rect
        if (!oRect) return
        const pointerY = currentPointerY(e.activatorEvent, e.delta.y)
        const side = computeDropSideByPointer(
            pointerY,
            oRect.top, oRect.height,
            aRect?.top ?? 0, aRect?.height ?? 0,
        )
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

        const pointerY = currentPointerY(e.activatorEvent, e.delta.y)
        const aRect = active.rect.current.translated
        const oRect = over.rect
        const side: 'above' | 'below' = oRect
            ? computeDropSideByPointer(pointerY, oRect.top, oRect.height, aRect?.top ?? 0, aRect?.height ?? 0)
            : 'below'

        // パレット由来 → 挿入
        if (active.data.current?.palette) {
            const tIdx = active.data.current.templateIdx as number
            const template = BLOCK_TEMPLATES[tIdx]
            if (!template) return
            insertFromPalette(template, String(over.id), side)
            return
        }

        if (active.id === over.id) return
        const activeId = String(active.id)
        const overId = String(over.id)

        const activeItem = config.items.find(it => it.id === activeId)
        const isPageActive = !!activeItem

        // composite ページ全体のドラッグ
        if (isPageActive && activeItem.kind === 'composite') {
            // ページ間ギャップ → そのギャップ位置へ移動（並び替え）
            if (isNewPageGapId(overId)) {
                const oldIdx = config.items.findIndex(it => it.id === activeId)
                const gIdx = gapInsertIdx(overId)
                const toIdx = oldIdx < gIdx ? gIdx - 1 : gIdx
                if (oldIdx >= 0 && toIdx !== oldIdx) {
                    updateConfig({ ...config, items: arrayMove(config.items, oldIdx, toIdx) })
                }
                return
            }
            const overItem = config.items.find(it => it.id === overId)
            // cover / back-cover に対しては並び替えのみ（マージ不可）
            if (overItem?.kind === 'cover' || overItem?.kind === 'back-cover') {
                const oldIdx = config.items.findIndex(it => it.id === activeId)
                const newIdx = config.items.findIndex(it => it.id === overId)
                if (oldIdx >= 0 && newIdx >= 0) {
                    updateConfig({ ...config, items: arrayMove(config.items, oldIdx, newIdx) })
                }
                return
            }
            // それ以外（composite/day item 自体、day-anchor、別ページの inner block）→ マージ
            mergeCompositeIntoTarget(activeId, overId, side)
            return
        }

        // 日別ページのドラッグ → 並び替えのみ
        if (isPageActive && activeItem.kind === 'day') {
            const isPageOver = config.items.some(it => it.id === overId)
            if (isPageOver) {
                const oldIdx = config.items.findIndex(it => it.id === activeId)
                const newIdx = config.items.findIndex(it => it.id === overId)
                if (oldIdx >= 0 && newIdx >= 0) {
                    updateConfig({ ...config, items: arrayMove(config.items, oldIdx, newIdx) })
                }
            }
            return
        }

        // cover / back-cover はドラッグ不可なのでここには来ない
        if (isPageActive) return

        // inner block の移動：同ページ並び替え・クロスページ移動・新規ページ抽出を統一処理
        if (!isDayAnchorId(activeId)) {
            moveInnerBlock(activeId, overId, side)
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
    const baseTheme = getTheme(themeName)
    const theme: Theme = config.fontStyle ? { ...baseTheme, fontStyle: config.fontStyle } : baseTheme

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
        if (block.kind === 'text' || block.kind === 'packing' || block.kind === 'emergency') {
            return {
                resizable: true,
                currentHeight: block.minHeight,
                onResize: (h: number) => updatePrimitive(block.id, b => {
                    if (b.kind === 'text') return { ...b, minHeight: h }
                    if (b.kind === 'packing') return { ...b, minHeight: h }
                    if (b.kind === 'emergency') return { ...b, minHeight: h }
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
                        align={block.align}
                        fontSize={block.fontSize}
                        fontWeight={block.fontWeight}
                        color={block.color}
                        imageUrl={block.imageUrl}
                        showBorder={block.showBorder}
                        backgroundColor={block.backgroundColor}
                        bold={block.bold}
                        italic={block.italic}
                        underline={block.underline}
                        strikethrough={block.strikethrough}
                        lineHeight={block.lineHeight}
                        letterSpacingEm={block.letterSpacingEm}
                        hideToolbar={block.hideToolbar}
                        onTitleChange={editable ? (title => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, title } : b)) : undefined}
                        onContentChange={editable ? (content => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, content } : b)) : undefined}
                        onAlignChange={editable ? (align => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, align } : b)) : undefined}
                        onFontSizeChange={editable ? (fontSize => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, fontSize } : b)) : undefined}
                        onFontWeightChange={editable ? (fontWeight => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, fontWeight } : b)) : undefined}
                        onColorChange={editable ? (color => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, color } : b)) : undefined}
                        onImageChange={editable ? (imageUrl => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, imageUrl } : b)) : undefined}
                        onShowBorderChange={editable ? (showBorder => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, showBorder } : b)) : undefined}
                        onBackgroundColorChange={editable ? (bg => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, backgroundColor: bg } : b)) : undefined}
                        onBoldChange={editable ? (bold => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, bold } : b)) : undefined}
                        onItalicChange={editable ? (italic => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, italic } : b)) : undefined}
                        onUnderlineChange={editable ? (underline => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, underline } : b)) : undefined}
                        onStrikethroughChange={editable ? (strikethrough => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, strikethrough } : b)) : undefined}
                        onLineHeightChange={editable ? (lh => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, lineHeight: lh } : b)) : undefined}
                        onLetterSpacingChange={editable ? (em => updatePrimitive(block.id, b => b.kind === 'text' ? { ...b, letterSpacingEm: em } : b)) : undefined}
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
            case 'emergency':
                return (
                    <EmergencyBlock
                        title={block.title}
                        rows={block.rows}
                        colWidths={block.colWidths}
                        theme={theme}
                        editable={editable}
                        minHeight={block.minHeight}
                        onTitleChange={editable ? (title => updatePrimitive(block.id, b => b.kind === 'emergency' ? { ...b, title } : b)) : undefined}
                        onRowsChange={editable ? (rows => updatePrimitive(block.id, b => b.kind === 'emergency' ? { ...b, rows } : b)) : undefined}
                        onColWidthsChange={editable ? (colWidths => updatePrimitive(block.id, b => b.kind === 'emergency' ? { ...b, colWidths } : b)) : undefined}
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
                        <SortableContext
                            items={config.items.map(it => it.id)}
                            strategy={paletteDragActive ? noShuffleStrategy : verticalListSortingStrategy}
                        >
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
// パレット/インナーブロック/composite どのドラッグでも見えるよう、visible=true の時点で
// ラベルを常時表示し、ホバー時はさらに強調する。
function NewPageGap({ insertIdx, visible, highlighted }: { insertIdx: number; visible: boolean; highlighted: boolean }) {
    const id = `${NEW_PAGE_GAP_PREFIX}${insertIdx}`
    const { setNodeRef, isOver } = useDroppable({ id })
    const active = isOver || highlighted
    return (
        <div
            ref={setNodeRef}
            className="no-print booklet-new-page-gap"
            style={{
                height: visible ? (active ? 54 : 36) : 0,
                margin: visible ? '10px 0' : 0,
                borderRadius: 12,
                background: active ? 'rgba(37, 99, 235, 0.12)' : visible ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
                border: visible
                    ? `2px ${active ? 'solid' : 'dashed'} ${active ? '#2563eb' : '#93c5fd'}`
                    : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2563eb',
                fontSize: active ? 13 : 12, fontWeight: 700,
                letterSpacing: '0.05em',
                transition: 'height 0.18s, background 0.18s, border-color 0.18s, font-size 0.18s',
                overflow: 'hidden',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            {active && '＋ ここに配置'}
        </div>
    )
}
