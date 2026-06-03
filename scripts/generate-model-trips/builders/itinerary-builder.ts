import type { Itinerary, ItineraryDay, SidebarSpot, HotelInfo, Spot } from '../../../src/types'
import type {
    DestinationEntry, SpotEntry, ThemeCode, TopTheme, Variant, DraftTrip, Route,
} from '../types'
import { THEME_LABELS } from '../types'
import { computeDayLimits, detectOriginRegion } from '../transport-logic'
import { scheduleSpots } from './time-scheduler'
import { makeOutboundSpot, makeReturnSpot } from '../origin-travel'
import { THEME_SHAPES } from './theme-config'

// テーマで destination がカバーできるか事前チェック
export function destinationSupportsTheme(dest: DestinationEntry, theme: TopTheme): boolean {
    const shape = THEME_SHAPES[theme]
    const matching = dest.spots.filter(s => s.th.includes(theme as ThemeCode))
    return matching.length >= shape.minThemeSpotsInDestination
}

// テーマ＋エリア＋人気度で総合スコア化（テーマを最重要にする）
function scoreSpot(spot: SpotEntry, theme: TopTheme, preferAreas: Set<string>): number {
    const shape = THEME_SHAPES[theme]
    const themeHit = spot.th.includes(theme as ThemeCode)
    return (
        (themeHit ? shape.themeMatchScore : 0) +
        (preferAreas.has(spot.area) ? shape.areaMatchScore : 0) +
        spot.pop * shape.popMultiplier
    )
}

// 1日分のスポットを選定（テーマ・エリア優先で）
function selectSpotsForDay(
    candidates: SpotEntry[],
    targetCount: number,
    theme: TopTheme,
    preferAreas: Set<string>,
    used: Set<string>,
): SpotEntry[] {
    const shape = THEME_SHAPES[theme]
    const available = candidates.filter(s => !used.has(s.n))
    if (available.length === 0) return []

    const themeMatched = available.filter(s => s.th.includes(theme as ThemeCode))
        .sort((a, b) => scoreSpot(b, theme, preferAreas) - scoreSpot(a, theme, preferAreas))
    const themeOthers = available.filter(s => !s.th.includes(theme as ThemeCode))
        .sort((a, b) => scoreSpot(b, theme, preferAreas) - scoreSpot(a, theme, preferAreas))

    const minThemeInDay = Math.min(themeMatched.length, Math.ceil(targetCount * shape.minThemeShareInDay))

    const picked: SpotEntry[] = []
    let gourmetCount = 0

    // Phase 1: テーマ一致スポットを必要数取り込む
    for (const s of themeMatched) {
        if (picked.length >= targetCount) break
        if (s.t === 'グルメ' && gourmetCount >= shape.targetGourmetMax) continue
        picked.push(s)
        if (s.t === 'グルメ') gourmetCount++
    }

    // Phase 2: グルメ最低数を満たすため追加（theme-otherのグルメも OK）
    if (gourmetCount < shape.targetGourmetPerDay) {
        const moreGourmet = available.filter(s =>
            s.t === 'グルメ' && !picked.includes(s)
        ).sort((a, b) => scoreSpot(b, theme, preferAreas) - scoreSpot(a, theme, preferAreas))
        for (const g of moreGourmet) {
            if (picked.length >= targetCount) break
            if (gourmetCount >= shape.targetGourmetPerDay) break
            picked.push(g)
            gourmetCount++
        }
    }

    // Phase 3: 残席を theme-other で補充。テーマ最低数を既に達成していれば自由に補う
    for (const s of themeOthers) {
        if (picked.length >= targetCount) break
        if (picked.includes(s)) continue
        if (s.t === 'グルメ' && gourmetCount >= shape.targetGourmetMax) continue
        // テーマ最低数を満たしていなければ、テーマ一致が残っているなら theme-other は避ける
        const currentThemeCount = countThemeMatches(picked, theme)
        if (currentThemeCount < minThemeInDay) continue
        picked.push(s)
        if (s.t === 'グルメ') gourmetCount++
    }

    return picked
}

function countThemeMatches(spots: SpotEntry[], theme: TopTheme): number {
    return spots.filter(s => s.th.includes(theme as ThemeCode)).length
}

// 1日のラベル生成（テーマ別パターンから選択）
function pickLabel(theme: TopTheme, areaName: string | null, dayIdx: number, totalDays: number, _ranNumber: number): string {
    const shape = THEME_SHAPES[theme]
    const pattern = shape.dayLabelPatterns[dayIdx % shape.dayLabelPatterns.length]
    const area = areaName ?? '主要エリア'
    let label = pattern.replace('{area}', area)
    if (dayIdx === 0 && totalDays > 1) label = `到着日・${label}`
    else if (dayIdx === totalDays - 1 && totalDays > 1) label = `最終日・${label}`
    return label
}

// タイトル生成（テーマ＋出発地＋目的地＋日数＋signature spot）
function buildTitle(
    dest: DestinationEntry,
    variant: Variant,
    signatureSpot: SpotEntry | null,
): string {
    const days = variant.duration_days
    const nights = days - 1
    const dayLabel = days === 1 ? '日帰り' : (nights >= 1 ? `${nights}泊${days}日` : `${days}日間`)
    const shape = THEME_SHAPES[variant.theme]
    const origin = variant.origin ? `${variant.origin}発・` : ''
    const destName = dest.titleAlias ?? dest.name
    const suffix = shape.titleSuffixes[stableHash(`${dest.id}${variant.theme}${variant.duration_days}${variant.origin ?? ''}`) % shape.titleSuffixes.length]

    // signature spot を含めるパターン（30%確率で）
    if (signatureSpot && stableHash(`title-sig-${dest.id}${variant.theme}${variant.origin ?? ''}${variant.duration_days}`) % 10 < 3) {
        return `${origin}${destName}${dayLabel} ${signatureSpot.n}を巡る${shape.label}プラン`
    }
    return `${origin}${destName}${dayLabel} ${suffix}`
}

function buildWishes(variant: Variant): string {
    const shape = THEME_SHAPES[variant.theme]
    const idx = stableHash(`wishes-${variant.destinationId}${variant.theme}${variant.duration_days}${variant.origin ?? ''}`) % shape.wishesPhrases.length
    const themed = shape.wishesPhrases[idx]
    const originPart = variant.origin ? `${variant.origin}出発・` : ''
    return `${originPart}${themed}`
}

// 安定なハッシュ（seed の代わり）
function stableHash(s: string): number {
    let h = 5381
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h) ^ s.charCodeAt(i)
    }
    return Math.abs(h)
}

// 1日程の組み立て
// 海外＋出発地ありの初日は「移動のみ」想定で targetCount=0 にする
function buildOneDay(
    dest: DestinationEntry,
    dayIdx: number,
    totalDays: number,
    variant: Variant,
    used: Set<string>,
): ItineraryDay {
    const isFirst = dayIdx === 0
    const isLast = dayIdx === totalDays - 1 && totalDays > 1
    const isOverseasWithOrigin = dest.country !== '日本' && !!variant.origin

    const shape = THEME_SHAPES[variant.theme]
    const originRegion = variant.origin ? detectOriginRegion(variant.origin) : null
    const limits = computeDayLimits(originRegion, dest.region, dest.country)

    let targetCount: number
    let startHour: number
    if (isFirst && totalDays > 1) {
        // 海外で出発地あり → Day1 は移動のみ
        if (isOverseasWithOrigin) {
            targetCount = 0
            startHour = 8
        } else {
            targetCount = Math.max(1, limits.day1MaxSpots + shape.middleSpotsDelta)
            startHour = limits.day1StartHour
        }
    } else if (isLast) {
        targetCount = Math.max(1, limits.lastMaxSpots + shape.middleSpotsDelta)
        startHour = 9
    } else {
        targetCount = Math.max(2, limits.middleMaxSpots + shape.middleSpotsDelta)
        startHour = limits.middleStartHour
    }

    // 同日内のエリアクラスタ：dayIdx で回しつつ、テーマ別にずらしてバラエティ
    const areaIds = dest.areas.map(a => a.id)
    const themeOffset = stableHash(`area-${dest.id}${variant.theme}`) % Math.max(1, areaIds.length)
    const preferArea = areaIds[(dayIdx + themeOffset) % Math.max(1, areaIds.length)]
    const preferAreas = new Set<string>(preferArea ? [preferArea] : [])

    const picked = targetCount > 0
        ? selectSpotsForDay(dest.spots.slice(), targetCount, variant.theme, preferAreas, used)
        : []
    picked.forEach(s => used.add(s.n))

    // 移動時間（gap）をテーマで補正
    const gap = Math.round(dest.intra_gap_min * shape.gapMultiplier)
    const spots = picked.length > 0 ? scheduleSpots(picked, startHour, gap) : []

    // ホテル選定
    let hotel: HotelInfo | undefined
    if (!isLast && dest.hotels.length > 0 && totalDays > 1) {
        const h = dest.hotels[(dayIdx + stableHash(`hotel-${dest.id}${variant.theme}`)) % dest.hotels.length]
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
    let label: string
    if (isFirst && isOverseasWithOrigin) {
        label = `出発・${dest.titleAlias ?? dest.name}入り`
    } else {
        label = pickLabel(variant.theme, areaName, dayIdx, totalDays, 0)
    }

    return {
        day: dayIdx + 1,
        label,
        spots,
        ...(hotel ? { hotel } : {}),
    }
}

function buildSidebarSpots(dest: DestinationEntry, used: Set<string>, theme: TopTheme): SidebarSpot[] {
    const remaining = dest.spots
        .filter(s => !used.has(s.n))
        .sort((a, b) => scoreSpot(b, theme, new Set()) - scoreSpot(a, theme, new Set()))
        .slice(0, 8)
    return remaining.map(s => ({
        name: s.n,
        description: s.d,
        type: s.t,
        duration_minutes: s.dur,
        popularity: s.pop,
    }))
}

// 出発地→目的地の移動 Spot を Day 1 の先頭に挿入し、続くスポットの時刻を後ろにずらす
function prependOutboundTravel(day: ItineraryDay, outbound: Spot): ItineraryDay {
    const [oh, om] = outbound.time.split(':').map(Number)
    let cursor = oh * 60 + (om || 0) + outbound.duration_minutes + 15  // 15分のクッション
    const shifted: Spot[] = day.spots.map(s => {
        const time = formatHHMM(cursor)
        cursor += s.duration_minutes + 30
        return { ...s, time }
    })
    return { ...day, spots: [outbound, ...shifted] }
}

// 最終日に帰路 Spot を末尾追加
function appendReturnTravel(day: ItineraryDay, returnSpot: Spot, lastEndHour: number): ItineraryDay {
    // 既存スポット末尾以降に配置
    let cursor: number
    if (day.spots.length > 0) {
        const last = day.spots[day.spots.length - 1]
        const [lh, lm] = last.time.split(':').map(Number)
        cursor = lh * 60 + (lm || 0) + last.duration_minutes + 30
    } else {
        cursor = lastEndHour * 60
    }
    const finalReturn: Spot = { ...returnSpot, time: formatHHMM(cursor) }
    return { ...day, spots: [...day.spots, finalReturn] }
}

function formatHHMM(minutes: number): string {
    const h = Math.floor(minutes / 60) % 24
    const m = minutes % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function buildItinerary(dest: DestinationEntry, variant: Variant): DraftTrip | null {
    // テーマがサポートされていないなら variant 自体を捨てる
    if (!destinationSupportsTheme(dest, variant.theme)) {
        if (process.env.DEBUG_GEN) console.log(`[skip] ${dest.id}/${variant.theme}: theme not supported`)
        return null
    }

    // duration_days が destination のスポット数で回せるか緩めにチェック
    const minSpotsNeeded = Math.max(3, variant.duration_days * 2)
    if (dest.spots.length < minSpotsNeeded) {
        if (process.env.DEBUG_GEN) console.log(`[skip] ${dest.id}/${variant.theme}/${variant.duration_days}d: ${dest.spots.length} spots < ${minSpotsNeeded}`)
        return null
    }

    const used = new Set<string>()
    const days: ItineraryDay[] = []
    for (let i = 0; i < variant.duration_days; i++) {
        const day = buildOneDay(dest, i, variant.duration_days, variant, used)
        days.push(day)
    }

    // 中身が空（移動以外）の day が連続するなら variant 自体を破棄
    // 海外+出発地ありは Day1 が空でOKだから許容範囲を1つ広げる
    const isOverseasWithOrigin = dest.country !== '日本' && !!variant.origin
    const allowedEmpty = isOverseasWithOrigin ? 2 : 1   // Day1 移動 + 最終日 帰路
    const daysWithContent = days.filter(d => d.spots.length > 0).length
    if (daysWithContent < variant.duration_days - allowedEmpty) {
        if (process.env.DEBUG_GEN) console.log(`[skip] ${dest.id}/${variant.theme}/${variant.duration_days}d: only ${daysWithContent} days have content`)
        return null
    }

    // 出発地→目的地の移動を 1日目先頭に挿入
    if (variant.origin) {
        const outbound = makeOutboundSpot(
            variant.origin,
            dest.id,
            dest.titleAlias ?? dest.name,
            dest.region,
            dest.country,
            getOutboundStartHour(variant.origin, dest.country, dest.region),
        )
        if (outbound) {
            days[0] = prependOutboundTravel(days[0], outbound.spot)
        }
        // 最終日に帰路を追加
        if (days.length > 1) {
            const lastEndHour = computeDayLimits(
                detectOriginRegion(variant.origin),
                dest.region,
                dest.country,
            ).lastEndHour
            const ret = makeReturnSpot(
                variant.origin,
                dest.id,
                dest.titleAlias ?? dest.name,
                dest.region,
                dest.country,
                lastEndHour,
            )
            if (ret) {
                days[days.length - 1] = appendReturnTravel(days[days.length - 1], ret, lastEndHour)
            }
        }
    }

    // signature spot：このプランの目玉として最もスコアの高いスポット
    const sigSpot = days[0]?.spots
        .filter(s => s.type !== 'その他')
        .map(s => dest.spots.find(sp => sp.n === s.name))
        .find(Boolean) ?? null

    const itinerary: Itinerary = {
        days,
        trip_style: dest.trip_style,
        trip_style_reason: tripStyleReason(dest),
        sidebar_spots: buildSidebarSpots(dest, used, variant.theme),
    }

    return {
        title: buildTitle(dest, variant, sigSpot ?? null),
        destination: dest.titleAlias ?? dest.name,
        duration_days: variant.duration_days,
        wishes: buildWishes(variant),
        is_official: true,
        itinerary,
    }
}

function getOutboundStartHour(origin: string, destCountry: string, destRegion: string): number {
    // 海外: 朝早く出発（実際は前泊もありえるが、ここはモデルなので朝出発）
    if (destCountry !== '日本') return 8
    // 沖縄離島・北海道・九州への飛行機: 朝出発
    if (destRegion === 'okinawa_main' || destRegion === 'okinawa_remote') return 9
    if (destRegion === 'hokkaido' || destRegion === 'kyushu_island') return 9
    if (destRegion === 'kyushu' && origin !== '福岡') return 9
    // 新幹線・在来線: 8時台
    return 8
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

// 複数目的地周遊
export function buildMultiCountryItinerary(
    legs: { dest: DestinationEntry; days: number }[],
    variant: Variant,
    routeTitle: string,
): DraftTrip | null {
    // 全 leg が変な variant でないことだけチェック（1つでもテーマ未対応なら skip）
    if (!legs.every(l => destinationSupportsTheme(l.dest, variant.theme))) return null

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
            const day = buildOneDay(
                dest,
                isOverallFirst ? 0 : isOverallLast ? totalDays - 1 : 1,
                totalDays,
                variant,
                used,
            )
            day.day = dayCursor + 1
            if (i === 0 && legIdx > 0) day.label = `${dest.name}入り・${day.label}`
            if (i === legDays - 1 && legIdx < legs.length - 1) day.label = `${dest.name}最終日`
            days.push(day)
            dayCursor++
        }
    }

    // 出発地→最初の都市の移動
    if (variant.origin && days.length > 0) {
        const outbound = makeOutboundSpot(
            variant.origin,
            firstDest.id,
            firstDest.titleAlias ?? firstDest.name,
            firstDest.region,
            firstDest.country,
            getOutboundStartHour(variant.origin, firstDest.country, firstDest.region),
        )
        if (outbound) {
            days[0] = prependOutboundTravel(days[0], outbound.spot)
        }
        // 最終目的地→出発地の帰路
        const lastDest = legs[legs.length - 1].dest
        const ret = makeReturnSpot(
            variant.origin,
            lastDest.id,
            lastDest.titleAlias ?? lastDest.name,
            lastDest.region,
            lastDest.country,
            12,
        )
        if (ret && days.length > 1) {
            days[days.length - 1] = appendReturnTravel(days[days.length - 1], ret, 12)
        }
    }

    const lastDest = legs[legs.length - 1].dest
    const itinerary: Itinerary = {
        days,
        trip_style: firstDest.trip_style,
        trip_style_reason: `複数都市を鉄道・市内交通で巡る周遊ルート`,
        sidebar_spots: buildSidebarSpots(lastDest, used, variant.theme).slice(0, 6),
    }

    const themeLabel = THEME_LABELS[variant.theme]
    const origin = variant.origin ? `${variant.origin}発・` : ''
    return {
        title: `${origin}${routeTitle} ${totalDays}日間 ${themeLabel}周遊コース`,
        destination: routeTitle,
        duration_days: totalDays,
        wishes: `${variant.origin ? variant.origin + '出発 / ' : ''}${themeLabel}メイン / 複数都市周遊`,
        is_official: true,
        itinerary,
    }
}

// ──────────── Route ベースのビルダー（新方針） ────────────
// Route は単一/複数 leg を持つ「現実的な旅行パターン」。
// テーマ・出発地・日数の variant でタイトルや wishes を差別化しつつ、
// 中身は leg 単位で各 destination のスポットを配置する。
export function buildRouteItinerary(
    legs: { dest: DestinationEntry; days: number }[],
    route: Route,
    theme: TopTheme,
    origin: string | undefined,
    requestedDays: number,
): DraftTrip | null {
    // 全 leg がテーマをサポートできなくても、最低 1 つは合致させる
    // （周遊なら都市ごとにテーマ適合度が違うのは普通なので緩めに）
    const themeOk = legs.some(l => destinationSupportsTheme(l.dest, theme))
    if (!themeOk) return null

    // 日数に応じて legs の days を調整（requestedDays が定義 days と異なる場合）
    const definedTotal = legs.reduce((s, l) => s + l.days, 0)
    const adjustedLegs = adjustLegDays(legs, requestedDays, definedTotal)
    const totalDays = adjustedLegs.reduce((s, l) => s + l.days, 0)
    if (totalDays === 0) return null

    const variant: Variant = {
        destinationId: route.id,
        duration_days: totalDays,
        theme, origin,
        routeId: route.id,
    }

    const used = new Set<string>()
    const days: ItineraryDay[] = []
    let dayCursor = 0
    const firstDest = adjustedLegs[0].dest
    const isMulti = adjustedLegs.length > 1

    for (let legIdx = 0; legIdx < adjustedLegs.length; legIdx++) {
        const { dest, days: legDays } = adjustedLegs[legIdx]
        // 各 leg のテーマ：適合しなければ最も近い適合テーマにフォールバック
        const usableTheme = destinationSupportsTheme(dest, theme)
            ? theme
            : pickFallbackTheme(dest, theme)
        for (let i = 0; i < legDays; i++) {
            const isOverallFirst = dayCursor === 0
            const isOverallLast = dayCursor === totalDays - 1
            const day = buildOneDay(
                dest,
                isOverallFirst ? 0 : isOverallLast ? totalDays - 1 : 1,
                totalDays,
                { ...variant, theme: usableTheme },
                used,
            )
            day.day = dayCursor + 1
            // 複数都市の場合、入り日と最終日にラベル工夫
            if (isMulti) {
                if (i === 0 && legIdx > 0) {
                    day.label = `${dest.titleAlias ?? dest.name}入り・${day.label}`
                }
                if (i === legDays - 1 && legIdx < adjustedLegs.length - 1) {
                    day.label = `${dest.titleAlias ?? dest.name}最終日`
                }
            }
            days.push(day)
            dayCursor++
        }
    }

    // 出発地の移動 spot を Day 1 先頭に挿入
    if (origin) {
        const outbound = makeOutboundSpot(
            origin,
            firstDest.id,
            firstDest.titleAlias ?? firstDest.name,
            firstDest.region,
            firstDest.country,
            getOutboundStartHour(origin, firstDest.country, firstDest.region),
        )
        if (outbound) {
            days[0] = prependOutboundTravel(days[0], outbound.spot)
        }
        // 帰路
        if (days.length > 1) {
            const lastDest = adjustedLegs[adjustedLegs.length - 1].dest
            const ret = makeReturnSpot(
                origin, lastDest.id, lastDest.titleAlias ?? lastDest.name,
                lastDest.region, lastDest.country, 14,
            )
            if (ret) {
                days[days.length - 1] = appendReturnTravel(days[days.length - 1], ret, 14)
            }
        }
    }

    // 中身チェック
    const isOverseasWithOrigin = firstDest.country !== '日本' && !!origin
    const allowedEmpty = isOverseasWithOrigin ? 2 : 1
    const daysWithContent = days.filter(d => d.spots.length > 0).length
    if (daysWithContent < totalDays - allowedEmpty) return null

    // タイトル・希望生成
    const title = buildRouteTitle(route, theme, origin, totalDays)
    const wishes = buildRouteWishes(route, theme, origin)
    const destLabel = isMulti
        ? route.name
        : (firstDest.titleAlias ?? firstDest.name)

    const itinerary: Itinerary = {
        days,
        trip_style: firstDest.trip_style,
        trip_style_reason: isMulti
            ? `${adjustedLegs.length}都市を巡る周遊。都市間は鉄道・飛行機・市内は地下鉄等`
            : tripStyleReason(firstDest),
        sidebar_spots: buildRouteSidebarSpots(adjustedLegs, used, theme),
    }

    return {
        title,
        destination: destLabel,
        duration_days: totalDays,
        wishes,
        is_official: true,
        itinerary,
    }
}

// 各 leg の日数を、リクエスト日数に合わせて再調整
function adjustLegDays(
    legs: { dest: DestinationEntry; days: number }[],
    requested: number,
    defined: number,
): { dest: DestinationEntry; days: number }[] {
    if (requested === defined) return legs
    const diff = requested - defined
    if (diff > 0) {
        // 日数追加：最初の leg を中心に増やす
        const adjusted = legs.map(l => ({ ...l }))
        let remaining = diff
        // 主要 leg（最初）に +
        for (let i = 0; i < adjusted.length && remaining > 0; i++) {
            adjusted[i].days += 1
            remaining--
            if (remaining > 0 && i === adjusted.length - 1) i = -1  // 一周
        }
        return adjusted
    } else {
        // 日数削減：最後の leg から減らす
        const adjusted = legs.map(l => ({ ...l }))
        let remaining = -diff
        for (let i = adjusted.length - 1; i >= 0 && remaining > 0; i--) {
            const reduce = Math.min(adjusted[i].days - 1, remaining)
            if (reduce > 0) {
                adjusted[i].days -= reduce
                remaining -= reduce
            }
        }
        return adjusted.filter(l => l.days > 0)
    }
}

function pickFallbackTheme(dest: DestinationEntry, _wantTheme: TopTheme): TopTheme {
    // dest がサポートするテーマの中から最も spot 数が多いものを採用
    let best: TopTheme = 'sg'
    let bestCount = 0
    for (const t of dest.themes) {
        const cnt = dest.spots.filter(s => s.th.includes(t as ThemeCode)).length
        if (cnt > bestCount) { best = t; bestCount = cnt }
    }
    return best
}

function buildRouteSidebarSpots(
    legs: { dest: DestinationEntry; days: number }[],
    used: Set<string>,
    theme: TopTheme,
): SidebarSpot[] {
    // 全 leg の dest から、使われていない上位スポットを混ぜる
    const result: SidebarSpot[] = []
    for (const { dest } of legs) {
        result.push(...buildSidebarSpots(dest, used, theme).slice(0, 3))
    }
    return result.slice(0, 8)
}

// ルートタイトル生成：複数候補のうち、ハッシュで安定的に1つ選択
function buildRouteTitle(
    route: Route,
    theme: TopTheme,
    origin: string | undefined,
    totalDays: number,
): string {
    const nights = totalDays - 1
    const dayLabel = totalDays === 1 ? '日帰り' : `${nights}泊${totalDays}日`
    const originPart = origin ? `${origin}発・` : ''
    const seasonal = route.titlePrefix ?? ''
    const suffixes = route.titleSuffixes ?? defaultSuffixesFor(theme)
    const sufIdx = stableHash(`${route.id}-${theme}-${origin ?? ''}-${totalDays}`) % suffixes.length
    return `${originPart}${seasonal}${route.name} ${dayLabel} ${suffixes[sufIdx]}`
}

function defaultSuffixesFor(theme: TopTheme): string[] {
    return THEME_SHAPES[theme].titleSuffixes.length > 0
        ? THEME_SHAPES[theme].titleSuffixes
        : ['モデルコース']
}

function buildRouteWishes(
    route: Route,
    theme: TopTheme,
    origin: string | undefined,
): string {
    const phrases = route.wishesPhrases ?? THEME_SHAPES[theme].wishesPhrases
    const idx = stableHash(`${route.id}-${theme}-${origin ?? ''}`) % phrases.length
    const themed = phrases[idx]
    const originPart = origin ? `${origin}出発・` : ''
    return `${originPart}${themed}`
}

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
