// しおりの構成情報（テーマ以外）を localStorage で trip 単位に保存
// ブロックベースの構成データ：ユーザーが自由にブロックを並べ替え・追加・削除できる

// ──────────── ブロック型定義 ────────────

export type BookletBlockKind =
    | 'cover'        // 表紙（必ず1個）
    | 'back-cover'   // 背表紙（必ず1個）
    | 'day'          // 旅程の日（dayIdx 指定）
    | 'text'         // 汎用テキストブロック（title + content）
    | 'packing'      // 持ち物リスト（チェックボックス＋列数）
    | 'divider'      // 区切り線
    | 'spacer'       // スペーサー（高さ指定）

export type BookletBlock =
    | { id: string; kind: 'cover' }
    | { id: string; kind: 'back-cover' }
    | { id: string; kind: 'day'; dayIdx: number }
    | { id: string; kind: 'text'; title: string; content: string; minHeight?: number }
    | { id: string; kind: 'packing'; title: string; content: string; columns: 1 | 2 | 3; minHeight?: number }
    | { id: string; kind: 'divider'; style?: 'solid' | 'dashed' | 'dotted' }
    | { id: string; kind: 'spacer'; height: number }

export type BookletConfig = {
    blocks: BookletBlock[]
    showPageNumbers: boolean
    showUrlQrCode: boolean
    themeName: string
}

// ──────────── ブロック種別ラベル・プレースホルダー ────────────

export const TEXT_PRESETS: { key: string; title: string; placeholder: string }[] = [
    { key: 'members',   title: '編集メンバー',     placeholder: '田中太郎（リーダー）\n佐藤花子\n山田次郎' },
    { key: 'meeting',   title: '集合時間・場所',   placeholder: '日時: ◯月◯日 09:00\n場所: 東京駅 八重洲北口 集合\n備考: 遅刻は連絡を' },
    { key: 'emergency', title: '緊急連絡先',       placeholder: '◯◯ホテル: 03-1234-5678\n保険会社: 0120-000-000\n家族: 090-XXXX-XXXX' },
    { key: 'notes',     title: 'メモ',             placeholder: '自由にメモを書いてください' },
    { key: 'budget',    title: '金額メモ',         placeholder: '交通費: 25,000円\n宿泊費: 30,000円\n食費: 15,000円\n合計予算: 70,000円' },
    { key: 'free',      title: '自由ページ',       placeholder: '自由にお使いください' },
]

export const PACKING_PLACEHOLDER = '・パスポート\n・充電器\n・常備薬\n・着替え3日分'

// ──────────── ID 生成 ────────────

export function generateBlockId(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

// ──────────── デフォルト設定 ────────────

export function buildDefaultConfig(daysCount: number, themeName = 'sakura'): BookletConfig {
    const blocks: BookletBlock[] = [
        { id: generateBlockId(), kind: 'cover' },
    ]
    for (let i = 0; i < daysCount; i++) {
        blocks.push({ id: generateBlockId(), kind: 'day', dayIdx: i })
    }
    blocks.push({ id: generateBlockId(), kind: 'back-cover' })
    return {
        blocks,
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
function legacyEntryToBlock(kind: LegacyKind, entry: any): BookletBlock {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateLegacyConfig(parsed: Record<string, any>, daysCount: number): BookletBlock[] {
    const blocks: BookletBlock[] = []
    blocks.push({ id: generateBlockId(), kind: 'cover' })

    const src = parsed.screen ?? parsed
    const optionalPages = (src?.optionalPages ?? {}) as Record<string, { enabled?: boolean; position?: { kind: string; dayIdx?: number }; content?: string; columns?: 1 | 2 | 3 }>
    const dayMemos = (src?.dayMemos ?? {}) as Record<number, string[]>

    // 表紙の直後の optional ページ
    LEGACY_OPTIONAL_KINDS.forEach(k => {
        const e = optionalPages[k]
        if (!e?.enabled) return
        const posKind = e.position?.kind === 'before-back-cover' ? 'after-cover' : e.position?.kind
        if (posKind === 'after-cover') {
            blocks.push(legacyEntryToBlock(k, e))
        }
    })

    // 各日 + 各日後の optional + 各日のメモ
    for (let i = 0; i < daysCount; i++) {
        blocks.push({ id: generateBlockId(), kind: 'day', dayIdx: i })

        // 旧 dayMemos をテキストブロック化
        const memos = (dayMemos[i] ?? []).filter(m => m && m.trim())
        if (memos.length > 0) {
            blocks.push({
                id: generateBlockId(),
                kind: 'text',
                title: `${i + 1}日目のメモ`,
                content: memos.join('\n'),
            })
        }

        // この日の後の optional
        LEGACY_OPTIONAL_KINDS.forEach(k => {
            const e = optionalPages[k]
            if (!e?.enabled) return
            if (e.position?.kind === 'after-day' && e.position.dayIdx === i) {
                blocks.push(legacyEntryToBlock(k, e))
            }
        })
    }

    blocks.push({ id: generateBlockId(), kind: 'back-cover' })
    return blocks
}

// 既存 blocks 配列に day ブロックの過不足があれば調整（旅程の日数変更に追従）
function reconcileDayBlocks(blocks: BookletBlock[], daysCount: number): BookletBlock[] {
    const existing = new Set<number>()
    blocks.forEach(b => { if (b.kind === 'day') existing.add(b.dayIdx) })

    // 不足分を背表紙の直前に追加
    const missing: number[] = []
    for (let i = 0; i < daysCount; i++) {
        if (!existing.has(i)) missing.push(i)
    }
    if (missing.length === 0) {
        // 余分（範囲外の dayIdx）の day ブロックは除去
        return blocks.filter(b => b.kind !== 'day' || b.dayIdx < daysCount)
    }
    const result = [...blocks]
    const backCoverIdx = result.findIndex(b => b.kind === 'back-cover')
    const insertAt = backCoverIdx === -1 ? result.length : backCoverIdx
    const newDayBlocks: BookletBlock[] = missing.map(idx => ({ id: generateBlockId(), kind: 'day' as const, dayIdx: idx }))
    result.splice(insertAt, 0, ...newDayBlocks)
    return result.filter(b => b.kind !== 'day' || b.dayIdx < daysCount)
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

        // 新フォーマット（blocks 配列あり）
        if (Array.isArray(parsed.blocks)) {
            const blocks = reconcileDayBlocks(parsed.blocks as BookletBlock[], daysCount)
            return { blocks, showPageNumbers, showUrlQrCode, themeName }
        }

        // 旧フォーマットからマイグレーション
        const blocks = migrateLegacyConfig(parsed, daysCount)
        return { blocks, showPageNumbers, showUrlQrCode, themeName }
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

// 印刷時にページ番号を振る対象（表紙・背表紙・divider/spacer は除外）
export function isCountedBlock(b: BookletBlock): boolean {
    return b.kind === 'day' || b.kind === 'text' || b.kind === 'packing'
}
