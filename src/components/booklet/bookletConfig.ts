// しおりの構成情報（テーマ以外）を localStorage で trip 単位に保存

export type OptionalPageKind =
    | 'members'    // 編集メンバー
    | 'meeting'    // 集合時間・場所
    | 'packing'    // 持ち物リスト
    | 'emergency'  // 緊急連絡先
    | 'notes'      // メモ
    | 'budget'     // 金額メモ
    | 'free'       // 自由ページ

export const OPTIONAL_PAGE_KINDS: OptionalPageKind[] = [
    'members', 'meeting', 'packing', 'emergency', 'notes', 'budget', 'free',
]

export const OPTIONAL_PAGE_LABELS: Record<OptionalPageKind, string> = {
    members:   '編集メンバー',
    meeting:   '集合時間・場所',
    packing:   '持ち物リスト',
    emergency: '緊急連絡先',
    notes:     'メモ',
    budget:    '金額メモ',
    free:      '自由ページ',
}

export const OPTIONAL_PAGE_PLACEHOLDERS: Record<OptionalPageKind, string> = {
    members:   '田中太郎（リーダー）\n佐藤花子\n山田次郎',
    meeting:   '日時: ◯月◯日 09:00\n場所: 東京駅 八重洲北口 集合\n備考: 遅刻は連絡を',
    packing:   '・パスポート\n・充電器\n・常備薬\n・着替え3日分',
    emergency: '◯◯ホテル: 03-1234-5678\n保険会社: 0120-000-000\n家族: 090-XXXX-XXXX',
    notes:     '自由にメモを書いてください',
    budget:    '交通費: 25,000円\n宿泊費: 30,000円\n食費: 15,000円\n合計予算: 70,000円',
    free:      '自由にお使いください',
}

// しおりの「ページ」を一意に識別するキー
export type PageKey =
    | 'cover'
    | 'back-cover'
    | { kind: 'day'; idx: number }
    | { kind: 'optional'; pageKind: OptionalPageKind }

// 各オプションページの挿入位置（表紙の後 or 各日の後のみ）
export type InsertPosition =
    | { kind: 'after-cover' }
    | { kind: 'after-day'; dayIdx: number }

export type OptionalPageEntry = {
    enabled: boolean
    position: InsertPosition
    content: string
    columns?: 1 | 2 | 3   // 持ち物リスト用の列数（他ページでは無視）
}

export type BookletConfig = {
    optionalPages: Record<OptionalPageKind, OptionalPageEntry>
    dayMemos: Record<number, string[]>
    showPageNumbers: boolean
    themeName: string
}

const DEFAULT_POSITION_BY_KIND: Record<OptionalPageKind, InsertPosition> = {
    members:   { kind: 'after-cover' },
    meeting:   { kind: 'after-cover' },
    packing:   { kind: 'after-cover' },
    emergency: { kind: 'after-cover' },
    notes:     { kind: 'after-cover' },
    budget:    { kind: 'after-cover' },
    free:      { kind: 'after-cover' },
}

function buildDefaultOptionalPages(): Record<OptionalPageKind, OptionalPageEntry> {
    const pages: Partial<Record<OptionalPageKind, OptionalPageEntry>> = {}
    OPTIONAL_PAGE_KINDS.forEach(k => {
        pages[k] = { enabled: false, position: DEFAULT_POSITION_BY_KIND[k], content: '' }
    })
    return pages as Record<OptionalPageKind, OptionalPageEntry>
}

export function buildDefaultConfig(themeName = 'sakura'): BookletConfig {
    return {
        optionalPages: buildDefaultOptionalPages(),
        dayMemos: {},
        showPageNumbers: true,
        themeName,
    }
}

// ──────────── localStorage ────────────

function keyFor(shareId: string): string {
    return `tripgen.booklet.config.${shareId}`
}

function migratePosition(pos: InsertPosition | { kind: 'before-back-cover' }): InsertPosition {
    // 旧 before-back-cover 位置を after-cover に変換
    if ((pos as { kind: string }).kind === 'before-back-cover') return { kind: 'after-cover' }
    return pos as InsertPosition
}

function mergeOptionalPages(
    def: Record<OptionalPageKind, OptionalPageEntry>,
    raw: Record<string, Partial<OptionalPageEntry>> | undefined,
): Record<OptionalPageKind, OptionalPageEntry> {
    const result: Partial<Record<OptionalPageKind, OptionalPageEntry>> = {}
    OPTIONAL_PAGE_KINDS.forEach(k => {
        const incoming = raw?.[k]
        const rawPos = incoming?.position as (InsertPosition | { kind: 'before-back-cover' }) | undefined
        result[k] = {
            enabled:  incoming?.enabled  ?? def[k].enabled,
            position: rawPos ? migratePosition(rawPos) : def[k].position,
            content:  incoming?.content  ?? def[k].content,
            columns:  incoming?.columns  ?? def[k].columns,
        }
    })
    return result as Record<OptionalPageKind, OptionalPageEntry>
}

export function loadBookletConfig(shareId: string): BookletConfig {
    if (typeof window === 'undefined') return buildDefaultConfig()
    try {
        const raw = window.localStorage.getItem(keyFor(shareId))
        if (!raw) return buildDefaultConfig()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed = JSON.parse(raw) as Record<string, any>
        const themeName = (parsed.themeName as string | undefined) ?? 'sakura'
        const def = buildDefaultConfig(themeName)

        // 旧フォーマット（screen/print 分離）からのマイグレーション
        const src = ('screen' in parsed ? parsed.screen : parsed) as Record<string, unknown>
        return {
            optionalPages: mergeOptionalPages(
                def.optionalPages,
                src.optionalPages as Record<string, Partial<OptionalPageEntry>> | undefined,
            ),
            dayMemos: (src.dayMemos as Record<number, string[]> | undefined) ?? def.dayMemos,
            showPageNumbers: (parsed.showPageNumbers as boolean | undefined) ?? def.showPageNumbers,
            themeName,
        }
    } catch {
        return buildDefaultConfig()
    }
}

export function saveBookletConfig(shareId: string, config: BookletConfig): void {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(keyFor(shareId), JSON.stringify(config))
    } catch {}
}

// ──────────── ページ並び順を計算 ────────────

export function computePageOrder(config: BookletConfig, daysCount: number): PageKey[] {
    const result: PageKey[] = ['cover']
    const afterCover: OptionalPageKind[] = []
    const afterDay = new Map<number, OptionalPageKind[]>()

    OPTIONAL_PAGE_KINDS.forEach(k => {
        const e = config.optionalPages[k]
        if (!e.enabled) return
        const pos = e.position
        if (pos.kind === 'after-cover') afterCover.push(k)
        else if (pos.kind === 'after-day') {
            const arr = afterDay.get(pos.dayIdx) ?? []
            arr.push(k)
            afterDay.set(pos.dayIdx, arr)
        }
    })

    afterCover.forEach(k => result.push({ kind: 'optional', pageKind: k }))
    for (let i = 0; i < daysCount; i++) {
        result.push({ kind: 'day', idx: i })
        const list = afterDay.get(i) ?? []
        list.forEach(k => result.push({ kind: 'optional', pageKind: k }))
    }
    result.push('back-cover')
    return result
}

// ──────────── ヘルパー ────────────

export function enabledPagesAt(
    config: BookletConfig,
    pos: InsertPosition,
): OptionalPageKind[] {
    return OPTIONAL_PAGE_KINDS.filter(k => {
        const e = config.optionalPages[k]
        if (!e.enabled) return false
        const p = e.position
        if (pos.kind === 'after-cover' && p.kind === 'after-cover') return true
        if (pos.kind === 'after-day' && p.kind === 'after-day' && p.dayIdx === pos.dayIdx) return true
        return false
    })
}

export function positionLabel(pos: InsertPosition, daysCount: number): string {
    if (pos.kind === 'after-cover') return '表紙の後'
    if (pos.kind === 'after-day') {
        const n = pos.dayIdx + 1
        return n <= daysCount ? `${n}日目の後` : `${n}日目の後`
    }
    return ''
}
