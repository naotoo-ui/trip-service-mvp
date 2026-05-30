import type { Itinerary, ItineraryDay, SidebarSpot, HotelInfo } from '../../../src/types'
import type {
    DestinationEntry, SpotEntry, ThemeCode, TopTheme, Variant, DraftTrip,
} from '../types'
import { THEME_LABELS } from '../types'
import { computeDayLimits, detectOriginRegion, originToDestinationMode } from '../transport-logic'
import { scheduleSpots } from './time-scheduler'

// テーマ→そのテーマに「強く合致する」スポットのフィルタ
function scoreForTheme(spot: SpotEntry, theme: TopTheme): number {
    const hit = spot.th.includes(theme as ThemeCode) ? 100 : 0
    return hit + spot.pop * 10
}

// 同日内に同一エリアのスポットを優先したい：エリアごとにグループ化して選ぶ
function selectSpotsForDay(
    candidates: SpotEntry[],
    targetCount: number,
    preferAreas: Set<string>,
    used: Set<string>,
    needGourmet = true,
): SpotEntry[] {
    const available = candidates.filter(s => !used.has(s.n))
    if (available.length === 0) return []

    // エリアスコア：preferAreas に入っていれば+50
    const scored = available.map(s => ({
        s,
        score: (preferAreas.has(s.area) ? 50 : 0) + s.pop * 10,
    })).sort((a, b) => b.score - a.score)

    const picked: SpotEntry[] = []
    const usedAreas = new Set<string>()
    let gourmetCount = 0

    for (const { s } of scored) {
        if (picked.length >= targetCount) break
        // type バランス: グルメは多くて2件
        if (s.t === 'グルメ' && gourmetCount >= 2) continue
        // 1日目で1エリアに絞り込む（中日以降は緩やか）
        picked.push(s)
        usedAreas.add(s.area)
        if (s.t === 'グルメ') gourmetCount++
    }

    // グルメが0件で需要があれば1件足す
    if (needGourmet && gourmetCount === 0) {
        const gourmet = available.find(s => s.t === 'グルメ' && !picked.includes(s))
        if (gourmet && picked.length > 1) {
            picked.splice(1, 0, gourmet)
            if (picked.length > targetCount) picked.pop()
        }
    }

    return picked
}

// テーマ→labelの語彙
const THEME_DAY_LABEL: Record<TopTheme, string[]> = {
    sg: ['市内観光', '名所巡り', '王道スポット', 'ハイライト', 'モデルコース'],
    gm: ['グルメ巡り', '名物グルメ', 'ご当地グルメ', 'カフェ巡り'],
    np: ['絶景巡り', 'フォトスポット', '景観の名所', '映えスポット'],
    on: ['温泉満喫', '湯めぐり', '温泉街散策'],
    hs: ['歴史散策', '寺社巡り', '城下町散策', '世界遺産巡り'],
    cp: ['カップル名所', 'ロマンチック散策', 'デートコース'],
    fm: ['家族で楽しむ', 'こどもと一緒', '体験スポット'],
    sp: ['ショッピング', '街歩き', '繁華街散策'],
    bc: ['ビーチ満喫', '海辺の絶景', 'リゾート時間'],
    wh: ['世界遺産巡り', '歴史遺産散策', '文化遺産巡り'],
    ar: ['アート巡り', 'ミュージアム巡り', '美術館散策'],
    ng: ['夜景スポット', '夜の街歩き', 'イルミネーション'],
    nt: ['自然散策', 'アウトドア体験', '森と海の景観'],
    ex: ['アクティビティ体験', '体験型観光', '冒険コース'],
}

function pickLabel(theme: TopTheme, areaName: string | null, dayIdx: number, totalDays: number): string {
    const arr = THEME_DAY_LABEL[theme] ?? THEME_DAY_LABEL.sg
    const phrase = arr[dayIdx % arr.length]
    if (areaName) return `${areaName}・${phrase}`
    if (dayIdx === 0 && totalDays > 1) return `到着日・${phrase}`
    if (dayIdx === totalDays - 1 && totalDays > 1) return `最終日・${phrase}`
    return phrase
}

// タイトル生成
function buildTitle(dest: DestinationEntry, variant: Variant): string {
    const days = variant.duration_days
    const nights = days - 1
    const dayLabel = days === 1 ? '日帰り' : (nights >= 1 ? `${nights}泊${days}日` : `${days}日間`)
    const themeLabel = THEME_LABELS[variant.theme]
    const origin = variant.origin ? `${variant.origin}発・` : ''
    const customHints = dest.titleHints?.[variant.theme]
    const themeName = customHints && customHints.length > 0
        ? customHints[Math.floor(Math.random() * customHints.length)]
        : `${themeLabel}を楽しむ`
    return `${origin}${dest.titleAlias ?? dest.name}${dayLabel} ${themeName}モデルコース`
}

// 希望（wishes）生成
function buildWishes(variant: Variant): string {
    const parts: string[] = []
    if (variant.origin) parts.push(`${variant.origin}出発`)
    parts.push(`${THEME_LABELS[variant.theme]}メイン`)
    return parts.join(' / ')
}

// 1日程の組み立て
function buildOneDay(
    dest: DestinationEntry,
    dayIdx: number,
    totalDays: number,
    variant: Variant,
    used: Set<string>,
): ItineraryDay | null {
    const isFirst = dayIdx === 0
    const isLast = dayIdx === totalDays - 1 && totalDays > 1

    const originRegion = variant.origin ? detectOriginRegion(variant.origin) : null
    const limits = computeDayLimits(originRegion, dest.region, dest.country)

    let targetCount: number
    let startHour: number
    if (isFirst && totalDays > 1) {
        targetCount = limits.day1MaxSpots
        startHour = limits.day1StartHour
    } else if (isLast) {
        targetCount = limits.lastMaxSpots
        startHour = 9
    } else {
        targetCount = limits.middleMaxSpots
        startHour = limits.middleStartHour
    }

    // テーマフィルタ + フォールバック
    const themeFiltered = dest.spots.filter(s => s.th.includes(variant.theme as ThemeCode))
    const candidates = themeFiltered.length >= targetCount * 2
        ? themeFiltered.concat(dest.spots.filter(s => !themeFiltered.includes(s)))
        : dest.spots.slice()

    // 同日内のエリアクラスタ：好み順は dayIdx で回す
    const areaIds = dest.areas.map(a => a.id)
    const preferArea = areaIds[dayIdx % Math.max(1, areaIds.length)]
    const preferAreas = new Set<string>(preferArea ? [preferArea] : [])

    // 評価でソート（テーマ適合 + 人気度）
    const sorted = candidates.slice().sort((a, b) =>
        scoreForTheme(b, variant.theme) - scoreForTheme(a, variant.theme))

    const picked = selectSpotsForDay(sorted, targetCount, preferAreas, used, !isLast || targetCount >= 2)
    picked.forEach(s => used.add(s.n))

    if (picked.length === 0) return null

    const spots = scheduleSpots(picked, startHour, dest.intra_gap_min)

    // ホテル選定（最終日は無し）
    let hotel: HotelInfo | undefined = undefined
    if (!isLast && dest.hotels.length > 0 && totalDays > 1) {
        const h = dest.hotels[dayIdx % dest.hotels.length]
        hotel = {
            name: h.n,
            address: h.addr,
            check_in: '15:00',
            check_out: '11:00',
            ...(h.price ? { price_per_night: h.price } : {}),
        }
    }

    // ラベル
    const areaName = dest.areas.find(a => a.id === preferArea)?.name ?? null
    const label = pickLabel(variant.theme, areaName, dayIdx, totalDays)

    return {
        day: dayIdx + 1,
        label,
        spots,
        ...(hotel ? { hotel } : {}),
    }
}

// sidebar_spots: 配置されなかったスポットの上位
function buildSidebarSpots(dest: DestinationEntry, used: Set<string>): SidebarSpot[] {
    const remaining = dest.spots
        .filter(s => !used.has(s.n))
        .sort((a, b) => b.pop - a.pop)
        .slice(0, 8)
    return remaining.map(s => ({
        name: s.n,
        description: s.d,
        type: s.t,
        duration_minutes: s.dur,
        popularity: s.pop,
    }))
}

// メイン: 1旅程生成
export function buildItinerary(dest: DestinationEntry, variant: Variant): DraftTrip {
    const used = new Set<string>()
    const days: ItineraryDay[] = []
    for (let i = 0; i < variant.duration_days; i++) {
        const day = buildOneDay(dest, i, variant.duration_days, variant, used)
        if (day) days.push(day)
    }

    const itinerary: Itinerary = {
        days,
        trip_style: dest.trip_style,
        trip_style_reason: tripStyleReason(dest),
        sidebar_spots: buildSidebarSpots(dest, used),
    }

    return {
        title: buildTitle(dest, variant),
        destination: dest.titleAlias ?? dest.name,
        duration_days: variant.duration_days,
        wishes: buildWishes(variant),
        is_official: true,
        itinerary,
    }
}

function tripStyleReason(dest: DestinationEntry): string {
    switch (dest.trip_style) {
        case 'rental_car':
            return `${dest.name}は観光地が点在しているためレンタカーが効率的`
        case 'public_transit':
            return `${dest.name}は電車・地下鉄が発達しており公共交通が最も効率的`
        case 'walking':
            return `${dest.name}は徒歩圏内に主要スポットが集中`
        case 'mixed':
            return `${dest.name}は都市間移動は鉄道、市内は地下鉄・徒歩を組み合わせるのが現実的`
        case 'overseas_transit':
            return `${dest.name}は地下鉄・タクシー・ライドシェアを使い分けるのが快適`
        default:
            return ''
    }
}

// 複数目的地周遊用：複数の DestinationEntry を連結した旅程
export function buildMultiCountryItinerary(
    legs: { dest: DestinationEntry; days: number }[],
    variant: Variant,
    routeTitle: string,
): DraftTrip {
    const used = new Set<string>()
    const days: ItineraryDay[] = []
    let dayCursor = 0
    const totalDays = legs.reduce((s, l) => s + l.days, 0)
    const firstDest = legs[0].dest

    for (let legIdx = 0; legIdx < legs.length; legIdx++) {
        const { dest, days: legDays } = legs[legIdx]
        for (let i = 0; i < legDays; i++) {
            const isOverallFirst = dayCursor === 0
            const isOverallLast = dayCursor === totalDays - 1
            const isLegFirst = i === 0 && !isOverallFirst
            const isLegLast = i === legDays - 1 && !isOverallLast

            const day = buildOneDay(
                dest,
                isOverallFirst ? 0 : isOverallLast ? totalDays - 1 : 1,
                totalDays,
                variant,
                used,
            )
            if (day) {
                day.day = dayCursor + 1
                if (isLegFirst) day.label = `${dest.name}入り・${day.label}`
                if (isLegLast && legIdx < legs.length - 1) day.label = `${dest.name}最終日`
                days.push(day)
            }
            dayCursor++
        }
    }

    // 周遊ルートでは sidebar_spots は最後の目的地ベース
    const lastDest = legs[legs.length - 1].dest
    const itinerary: Itinerary = {
        days,
        trip_style: firstDest.trip_style,
        trip_style_reason: `複数都市を鉄道・市内交通で巡る周遊ルート`,
        sidebar_spots: buildSidebarSpots(lastDest, used).slice(0, 6),
    }

    const themeLabel = THEME_LABELS[variant.theme]
    const origin = variant.origin ? `${variant.origin}発・` : ''
    return {
        title: `${origin}${routeTitle} ${totalDays}日間 ${themeLabel}周遊コース`,
        destination: routeTitle,
        duration_days: totalDays,
        wishes: `${variant.origin ? variant.origin + '出発 / ' : ''}${themeLabel}メイン / 周遊`,
        is_official: true,
        itinerary,
    }
}

// 時刻逆転防止：既存 sanitizeItinerary 相当
export function sanitizeDraft(draft: DraftTrip): DraftTrip {
    const seenNames = new Set<string>()
    const days = draft.itinerary.days.map(day => {
        const uniqueSpots = day.spots.filter(spot => {
            const key = spot.name.trim().toLowerCase()
            if (seenNames.has(key)) return false
            seenNames.add(key)
            return true
        })
        let lastEnd = -1
        const fixed = uniqueSpots.map(spot => {
            const [h, m] = spot.time.split(':').map(Number)
            const start = h * 60 + (m || 0)
            const dur = Math.max(20, spot.duration_minutes || 60)
            let adj = start
            if (adj < lastEnd) adj = lastEnd + 15
            lastEnd = adj + dur
            const nh = Math.floor(adj / 60)
            const nm = adj % 60
            return {
                ...spot,
                time: `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`,
                duration_minutes: dur,
            }
        })
        return { ...day, spots: fixed }
    })
    return { ...draft, itinerary: { ...draft.itinerary, days } }
}
