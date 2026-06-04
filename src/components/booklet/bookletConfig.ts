// しおりの構成情報（テーマ以外）を localStorage で trip 単位に保存
// ページ単位の構造：各ページ（item）が複数の primitive ブロックを保持する。
// 表紙・背表紙は単独ページ、旅程ページは day ブロック上下に primitive ブロックを並べる。

// ──────────── プリミティブブロック（ページ内のサブブロック） ────────────

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export type PrimitiveBlock =
    | {
        id: string; kind: 'text'; title: string; content: string; minHeight?: number
        // 自由ページ拡張: スタイル
        align?: TextAlign           // 既定 'left'
        fontSize?: number           // 既定 14 (px)
        fontWeight?: number         // 既定 400
        color?: string              // 既定 テーマの text 色
        imageUrl?: string           // base64 or URL（差し込み画像）
        showBorder?: boolean        // 既定 true（青の点線枠）
        // テキスト装飾トグル（既定 false）
        bold?: boolean              // true で fontWeight を最低 700 として扱う
        italic?: boolean            // font-style: italic
        underline?: boolean         // text-decoration-line: underline
        strikethrough?: boolean     // text-decoration-line: line-through
    }
    | { id: string; kind: 'packing'; title: string; content: string; columns: 1 | 2 | 3; minHeight?: number }
    | { id: string; kind: 'divider'; style?: 'solid' | 'dashed' | 'dotted' }
    | { id: string; kind: 'spacer'; height: number }

export type PrimitiveBlockKind = PrimitiveBlock['kind']

// ──────────── ページアイテム（しおりの最上位ユニット） ────────────

export type BookletItem =
    | { id: string; kind: 'cover' }
    | { id: string; kind: 'back-cover' }
    | { id: string; kind: 'day'; dayIdx: number; blocksAbove: PrimitiveBlock[]; blocksBelow: PrimitiveBlock[] }
    | { id: string; kind: 'composite'; blocks: PrimitiveBlock[] }

export type BookletItemKind = BookletItem['kind']

export type BookletConfig = {
    items: BookletItem[]
    showPageNumbers: boolean
    showUrlQrCode: boolean
    themeName: string
}

// ──────────── プリセット ────────────

export const TEXT_PRESETS: { key: string; title: string; placeholder: string }[] = [
    { key: 'members',   title: '編集メンバー',     placeholder: '田中太郎（リーダー）\n佐藤花子\n山田次郎' },
    { key: 'meeting',   title: '集合時間・場所',   placeholder: '日時: ◯月◯日 09:00\n場所: 東京駅 八重洲北口 集合\n備考: 遅刻は連絡を' },
    { key: 'emergency', title: '緊急連絡先',       placeholder: '◯◯ホテル: 03-1234-5678\n保険会社: 0120-000-000\n家族: 090-XXXX-XXXX' },
    { key: 'notes',     title: 'メモ',             placeholder: '自由にメモを書いてください' },
    { key: 'budget',    title: '金額メモ',         placeholder: '交通費: 25,000円\n宿泊費: 30,000円\n食費: 15,000円\n合計予算: 70,000円' },
    { key: 'free',      title: '自由ページ',       placeholder: '自由にお使いください' },
]

export const PACKING_PLACEHOLDER = '・パスポート\n・充電器\n・常備薬\n・着替え3日分'

// ──────────── ブロックパレット用テンプレート（primitive ブロックのみ） ────────────

export type BlockTemplate = {
    label: string
    icon: string
    factory: () => PrimitiveBlock
}

export const BLOCK_TEMPLATES: BlockTemplate[] = [
    {
        label: '持ち物リスト', icon: '✓',
        factory: () => ({ id: generateBlockId(), kind: 'packing', title: '持ち物リスト', content: '', columns: 1 }),
    },
    {
        label: '編集メンバー', icon: '👥',
        factory: () => ({ id: generateBlockId(), kind: 'text', title: '編集メンバー', content: '' }),
    },
    {
        label: '集合時間・場所', icon: '📍',
        factory: () => ({ id: generateBlockId(), kind: 'text', title: '集合時間・場所', content: '' }),
    },
    {
        label: '緊急連絡先', icon: '🚨',
        factory: () => ({ id: generateBlockId(), kind: 'text', title: '緊急連絡先', content: '' }),
    },
    {
        label: 'メモ', icon: '📝',
        factory: () => ({ id: generateBlockId(), kind: 'text', title: 'メモ', content: '' }),
    },
    {
        label: '金額メモ', icon: '💰',
        factory: () => ({ id: generateBlockId(), kind: 'text', title: '金額メモ', content: '' }),
    },
    {
        label: '自由ページ', icon: '✏️',
        factory: () => ({ id: generateBlockId(), kind: 'text', title: '自由ページ', content: '' }),
    },
    {
        label: '区切り線', icon: '─',
        factory: () => ({ id: generateBlockId(), kind: 'divider', style: 'dashed' }),
    },
]

// ──────────── ID 生成 ────────────

export function generateBlockId(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

// ──────────── デフォルト設定 ────────────

export function buildDefaultConfig(daysCount: number, themeName = 'sakura'): BookletConfig {
    const items: BookletItem[] = [
        { id: generateBlockId(), kind: 'cover' },
    ]
    for (let i = 0; i < daysCount; i++) {
        items.push({ id: generateBlockId(), kind: 'day', dayIdx: i, blocksAbove: [], blocksBelow: [] })
    }
    items.push({ id: generateBlockId(), kind: 'back-cover' })
    return {
        items,
        showPageNumbers: true,
        showUrlQrCode: false,
        themeName,
    }
}

// ──────────── 旧フォーマットからのマイグレーション ────────────

const LEGACY_OPTIONAL_KINDS = ['members', 'meeting', 'packing', 'emergency', 'notes', 'budget', 'free'] as const
type LegacyKind = typeof LEGACY_OPTIONAL_KINDS[number]

const LEGACY_LABELS: Record<LegacyKind, string> = {
    members:   '編集メンバー',
    meeting:   '集合時間・場所',
    packing:   '持ち物リスト',
    emergency: '緊急連絡先',
    notes:     'メモ',
    budget:    '金額メモ',
    free:      '自由ページ',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyEntryToBlock(kind: LegacyKind, entry: any): PrimitiveBlock {
    const title = LEGACY_LABELS[kind]
    const content = (entry?.content as string | undefined) ?? ''
    if (kind === 'packing') {
        return {
            id: generateBlockId(),
            kind: 'packing',
            title,
            content,
            columns: ((entry?.columns ?? 1) as 1 | 2 | 3),
        }
    }
    return {
        id: generateBlockId(),
        kind: 'text',
        title,
        content,
    }
}

// 完全旧フォーマット（optionalPages + dayMemos）から items 配列を作る
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateLegacyToItems(parsed: Record<string, any>, daysCount: number): BookletItem[] {
    const items: BookletItem[] = []
    items.push({ id: generateBlockId(), kind: 'cover' })

    const src = parsed.screen ?? parsed
    const optionalPages = (src?.optionalPages ?? {}) as Record<string, { enabled?: boolean; position?: { kind: string; dayIdx?: number }; content?: string; columns?: 1 | 2 | 3 }>
    const dayMemos = (src?.dayMemos ?? {}) as Record<number, string[]>

    // 表紙の直後の optional ページ
    LEGACY_OPTIONAL_KINDS.forEach(k => {
        const e = optionalPages[k]
        if (!e?.enabled) return
        const posKind = e.position?.kind === 'before-back-cover' ? 'after-cover' : e.position?.kind
        if (posKind === 'after-cover') {
            items.push({ id: generateBlockId(), kind: 'composite', blocks: [legacyEntryToBlock(k, e)] })
        }
    })

    for (let i = 0; i < daysCount; i++) {
        items.push({ id: generateBlockId(), kind: 'day', dayIdx: i, blocksAbove: [], blocksBelow: [] })

        const memos = (dayMemos[i] ?? []).filter(m => m && m.trim())
        if (memos.length > 0) {
            items.push({
                id: generateBlockId(), kind: 'composite',
                blocks: [{
                    id: generateBlockId(), kind: 'text',
                    title: `${i + 1}日目のメモ`, content: memos.join('\n'),
                }],
            })
        }

        LEGACY_OPTIONAL_KINDS.forEach(k => {
            const e = optionalPages[k]
            if (!e?.enabled) return
            if (e.position?.kind === 'after-day' && e.position.dayIdx === i) {
                items.push({ id: generateBlockId(), kind: 'composite', blocks: [legacyEntryToBlock(k, e)] })
            }
        })
    }

    items.push({ id: generateBlockId(), kind: 'back-cover' })
    return items
}

// 前バージョンの blocks: BookletBlock[] フラット構造を items 配列に変換
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateFlatBlocksToItems(blocks: any[]): BookletItem[] {
    const items: BookletItem[] = []
    for (const b of blocks) {
        if (!b || typeof b !== 'object') continue
        if (b.kind === 'cover') {
            items.push({ id: b.id ?? generateBlockId(), kind: 'cover' })
        } else if (b.kind === 'back-cover') {
            items.push({ id: b.id ?? generateBlockId(), kind: 'back-cover' })
        } else if (b.kind === 'day') {
            items.push({ id: b.id ?? generateBlockId(), kind: 'day', dayIdx: b.dayIdx, blocksAbove: [], blocksBelow: [] })
        } else if (b.kind === 'text' || b.kind === 'packing' || b.kind === 'divider' || b.kind === 'spacer') {
            items.push({
                id: generateBlockId(), kind: 'composite',
                blocks: [{ ...b, id: b.id ?? generateBlockId() } as PrimitiveBlock],
            })
        }
    }
    return items
}

// 旅程の日数変更に追従：足りない day item を背表紙の直前に追加・余分は除去
function reconcileDayItems(items: BookletItem[], daysCount: number): BookletItem[] {
    const existing = new Set<number>()
    items.forEach(i => { if (i.kind === 'day') existing.add(i.dayIdx) })

    const missing: number[] = []
    for (let i = 0; i < daysCount; i++) {
        if (!existing.has(i)) missing.push(i)
    }

    let result = items.filter(i => i.kind !== 'day' || i.dayIdx < daysCount)

    if (missing.length > 0) {
        const backCoverIdx = result.findIndex(i => i.kind === 'back-cover')
        const insertAt = backCoverIdx === -1 ? result.length : backCoverIdx
        const newItems: BookletItem[] = missing.map(idx => ({
            id: generateBlockId(), kind: 'day' as const, dayIdx: idx,
            blocksAbove: [], blocksBelow: [],
        }))
        result = [...result.slice(0, insertAt), ...newItems, ...result.slice(insertAt)]
    }
    return result
}

// ──────────── localStorage ────────────

function keyFor(shareId: string): string {
    return `tripgen.booklet.config.${shareId}`
}

export function loadBookletConfig(shareId: string, daysCount: number): BookletConfig {
    if (typeof window === 'undefined') return buildDefaultConfig(daysCount)
    try {
        const raw = window.localStorage.getItem(keyFor(shareId))
        if (!raw) return buildDefaultConfig(daysCount)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed = JSON.parse(raw) as Record<string, any>
        const themeName = (parsed.themeName as string | undefined) ?? 'sakura'
        const showPageNumbers = (parsed.showPageNumbers as boolean | undefined) ?? true
        const showUrlQrCode = (parsed.showUrlQrCode as boolean | undefined) ?? false

        // 最新フォーマット（items 配列あり）
        if (Array.isArray(parsed.items)) {
            const items = reconcileDayItems(parsed.items as BookletItem[], daysCount)
            return { items, showPageNumbers, showUrlQrCode, themeName }
        }

        // 前バージョン（blocks フラット配列）→ items に変換
        if (Array.isArray(parsed.blocks)) {
            const items = reconcileDayItems(migrateFlatBlocksToItems(parsed.blocks), daysCount)
            return { items, showPageNumbers, showUrlQrCode, themeName }
        }

        // 旧フォーマット（optionalPages + dayMemos）→ items に変換
        const items = migrateLegacyToItems(parsed, daysCount)
        return { items, showPageNumbers, showUrlQrCode, themeName }
    } catch {
        return buildDefaultConfig(daysCount)
    }
}

export function saveBookletConfig(shareId: string, config: BookletConfig): void {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(keyFor(shareId), JSON.stringify(config))
    } catch {}
}

// ──────────── ヘルパー ────────────

// 1ページとしてカウントする item か（divider/spacer/cover/back-cover は除外）
export function isCountedItem(item: BookletItem): boolean {
    return item.kind === 'day' || item.kind === 'composite'
}

// item.id または block.id を含む item と、その中の primitive block の位置を見つける
export type FoundBlock = {
    itemIdx: number
    item: BookletItem
    // primitive block の位置
    array: 'above' | 'below' | 'blocks' | null   // null は item.id 自身を指している（day の本体 or cover 等）
    blockIdx: number  // -1 if array is null
    block: PrimitiveBlock | null
}

export function findBlockOrItem(items: BookletItem[], id: string): FoundBlock | null {
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.id === id) {
            return { itemIdx: i, item, array: null, blockIdx: -1, block: null }
        }
        if (item.kind === 'day') {
            const aIdx = item.blocksAbove.findIndex(b => b.id === id)
            if (aIdx >= 0) return { itemIdx: i, item, array: 'above', blockIdx: aIdx, block: item.blocksAbove[aIdx] }
            const bIdx = item.blocksBelow.findIndex(b => b.id === id)
            if (bIdx >= 0) return { itemIdx: i, item, array: 'below', blockIdx: bIdx, block: item.blocksBelow[bIdx] }
        }
        if (item.kind === 'composite') {
            const idx = item.blocks.findIndex(b => b.id === id)
            if (idx >= 0) return { itemIdx: i, item, array: 'blocks', blockIdx: idx, block: item.blocks[idx] }
        }
    }
    return null
}
