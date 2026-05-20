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

// 各オプションページの挿入位置
export type InsertPosition =
    | { kind: 'after-cover' }
    | { kind: 'after-day'; dayIdx: number }
    | { kind: 'before-back-cover' }

export type OptionalPageEntry = {
    enabled: boolean
    position: InsertPosition
    content: string
    columns?: 1 | 2 | 3   // 持ち物リスト用の列数（他ページでは無視）
}

export type ModeConfig = {
    optionalPages: Record<OptionalPageKind, OptionalPageEntry>
    dayMemos: Record<number, string[]>   // dayIdx -> メモ配列
}

export type ViewMode = 'screen' | 'print'

export type BookletConfig = {
    screen: ModeConfig
    print: ModeConfig
    showPageNumbers: boolean
    activeMode: ViewMode      // 現在のビュー（編集中のモード）
    themeName: string
}

const DEFAULT_POSITION_BY_KIND: Record<OptionalPageKind, InsertPosition> = {
    members:   { kind: 'after-cover' },
    meeting:   { kind: 'after-cover' },
    packing:   { kind: 'after-cover' },
    emergency: { kind: 'before-back-cover' },
    notes:     { kind: 'before-back-cover' },
    budget:    { kind: 'before-back-cover' },
    free:      { kind: 'before-back-cover' },
}

function buildDefaultModeConfig(): ModeConfig {
    const optionalPages: Partial<Record<OptionalPageKind, OptionalPageEntry>> = {}
    OPTIONAL_PAGE_KINDS.forEach(k => {
        optionalPages[k] = {
            enabled: false,
            position: DEFAULT_POSITION_BY_KIND[k],
            content: '',
        }
    })
    return {
        optionalPages: optionalPages as Record<OptionalPageKind, OptionalPageEntry>,
        dayMemos: {},
    }
}

export function buildDefaultConfig(themeName: string = 'sakura'): BookletConfig {
    return {
        screen: buildDefaultModeConfig(),
        print: buildDefaultModeConfig(),
        showPageNumbers: true,
        activeMode: 'screen',
        themeName,
    }
}

// ──────────── localStorage ────────────

function keyFor(shareId: string): string {
    return `tripgen.booklet.config.${shareId}`
}

export function loadBookletConfig(shareId: string): BookletConfig {
    if (typeof window === 'undefined') return buildDefaultConfig()
    try {
        const raw = window.localStorage.getItem(keyFor(shareId))
        if (!raw) return buildDefaultConfig()
        const parsed = JSON.parse(raw) as Partial<BookletConfig>
        // マイグレーション安全化：欠損プロパティをデフォルトで補完
        const def = buildDefaultConfig(parsed.themeName ?? 'sakura')
        return {
            screen: mergeModeConfig(def.screen, parsed.screen),
            print:  mergeModeConfig(def.print, parsed.print),
            showPageNumbers: parsed.showPageNumbers ?? def.showPageNumbers,
            activeMode: parsed.activeMode === 'print' ? 'print' : 'screen',
            themeName: parsed.themeName ?? def.themeName,
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

function mergeModeConfig(def: ModeConfig, partial?: Partial<ModeConfig>): ModeConfig {
    if (!partial) return def
    const optionalPages: Partial<Record<OptionalPageKind, OptionalPageEntry>> = {}
    OPTIONAL_PAGE_KINDS.forEach(k => {
        const incoming = partial.optionalPages?.[k]
        optionalPages[k] = {
            enabled: incoming?.enabled ?? def.optionalPages[k].enabled,
            position: incoming?.position ?? def.optionalPages[k].position,
            content: incoming?.content ?? def.optionalPages[k].content,
            columns: incoming?.columns ?? def.optionalPages[k].columns,
        }
    })
    return {
        optionalPages: optionalPages as Record<OptionalPageKind, OptionalPageEntry>,
        dayMemos: partial.dayMemos ?? def.dayMemos,
    }
}

// ──────────── ページ並び順を計算 ────────────

export function computePageOrder(
    config: BookletConfig,
    daysCount: number,
    mode: ViewMode,
): PageKey[] {
    const modeCfg = config[mode]
    const result: PageKey[] = ['cover']

    // 表紙の直後に入るオプションページ
    const afterCover: OptionalPageKind[] = []
    // 各日の後ろに入るオプションページ
    const afterDay = new Map<number, OptionalPageKind[]>()
    // 背表紙の直前に入るオプションページ
    const beforeBackCover: OptionalPageKind[] = []

    OPTIONAL_PAGE_KINDS.forEach(k => {
        const e = modeCfg.optionalPages[k]
        if (!e.enabled) return
        const pos = e.position
        if (pos.kind === 'after-cover') afterCover.push(k)
        else if (pos.kind === 'after-day') {
            const arr = afterDay.get(pos.dayIdx) ?? []
            arr.push(k)
            afterDay.set(pos.dayIdx, arr)
        }
        else if (pos.kind === 'before-back-cover') beforeBackCover.push(k)
    })

    afterCover.forEach(k => result.push({ kind: 'optional', pageKind: k }))

    for (let i = 0; i < daysCount; i++) {
        result.push({ kind: 'day', idx: i })
        const list = afterDay.get(i) ?? []
        list.forEach(k => result.push({ kind: 'optional', pageKind: k }))
    }

    beforeBackCover.forEach(k => result.push({ kind: 'optional', pageKind: k }))
    result.push('back-cover')

    return result
}

// ──────────── ヘルパー ────────────

export function isSamePageKey(a: PageKey, b: PageKey): boolean {
    if (typeof a === 'string' || typeof b === 'string') return a === b
    if (a.kind !== b.kind) return false
    if (a.kind === 'day' && b.kind === 'day') return a.idx === b.idx
    if (a.kind === 'optional' && b.kind === 'optional') return a.pageKind === b.pageKind
    return false
}

export function positionToLabel(pos: InsertPosition, daysCount: number): string {
    if (pos.kind === 'after-cover') return '表紙の直後'
    if (pos.kind === 'before-back-cover') return '背表紙の直前'
    if (pos.kind === 'after-day') {
        if (pos.dayIdx < 0 || pos.dayIdx >= daysCount) return `${pos.dayIdx + 1}日目の後`
        return `${pos.dayIdx + 1}日目の後`
    }
    return '不明'
}

export function allInsertPositions(daysCount: number): { value: InsertPosition; label: string }[] {
    const out: { value: InsertPosition; label: string }[] = [
        { value: { kind: 'after-cover' }, label: '表紙の直後' },
    ]
    for (let i = 0; i < daysCount; i++) {
        out.push({ value: { kind: 'after-day', dayIdx: i }, label: `${i + 1}日目の後` })
    }
    out.push({ value: { kind: 'before-back-cover' }, label: '背表紙の直前' })
    return out
}
