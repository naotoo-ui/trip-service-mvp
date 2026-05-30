/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { DOMESTIC_DESTINATIONS } from './catalog/domestic'
import { OVERSEAS_DESTINATIONS } from './catalog/overseas'
import { EUROPE_ROUTES } from './catalog/europe-tour'
import { buildItinerary, buildMultiCountryItinerary, sanitizeDraft } from './builders/itinerary-builder'
import type { DestinationEntry, MultiCountryRoute, Variant, DraftTrip, TopTheme } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と (SUPABASE_SERVICE_ROLE_KEY または NEXT_PUBLIC_SUPABASE_ANON_KEY) が必要です')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 出発地リスト
const DOMESTIC_ORIGINS = ['東京', '大阪', '名古屋', '福岡', '札幌']
const OVERSEAS_ORIGINS = ['東京', '大阪']

// 8文字 share_id
function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length: 8 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('')
}

// 国内の variant 展開
function expandDomesticVariants(): { dest: DestinationEntry; variant: Variant }[] {
    const result: { dest: DestinationEntry; variant: Variant }[] = []
    for (const dest of DOMESTIC_DESTINATIONS) {
        const themes = dest.themes
        const durations = pickDurations(dest)
        for (const days of durations) {
            for (const theme of themes) {
                for (const origin of DOMESTIC_ORIGINS) {
                    // 同地方の出発地 → 日帰り可・距離考慮済み
                    result.push({
                        dest,
                        variant: { destinationId: dest.id, duration_days: days, theme, origin },
                    })
                }
                // 出発地なしバージョン（汎用）
                result.push({
                    dest,
                    variant: { destinationId: dest.id, duration_days: days, theme },
                })
            }
        }
    }
    return result
}

function pickDurations(dest: DestinationEntry): number[] {
    // 離島・北海道は最低2泊3日推奨
    if (dest.region === 'okinawa_remote' || dest.region === 'hokkaido') return [3, 4, 5]
    if (dest.region === 'okinawa_main') return [2, 3, 4, 5]
    return [2, 3, 4]
}

// 海外の variant 展開
function expandOverseasVariants(): { dest: DestinationEntry; variant: Variant }[] {
    const result: { dest: DestinationEntry; variant: Variant }[] = []
    for (const dest of OVERSEAS_DESTINATIONS) {
        const themes = dest.themes
        const durations = overseasDurations(dest)
        for (const days of durations) {
            for (const theme of themes) {
                for (const origin of OVERSEAS_ORIGINS) {
                    result.push({
                        dest,
                        variant: { destinationId: dest.id, duration_days: days, theme, origin },
                    })
                }
                result.push({
                    dest,
                    variant: { destinationId: dest.id, duration_days: days, theme },
                })
            }
        }
    }
    return result
}

function overseasDurations(dest: DestinationEntry): number[] {
    // 距離別の典型日数
    if (dest.region === 'overseas_asia_near') return [3, 4, 5]
    if (dest.region === 'overseas_asia_far') return [4, 5, 6]
    if (dest.region === 'overseas_oceania') return [5, 6, 7]
    if (dest.region === 'overseas_europe') return [5, 6, 7]
    if (dest.region === 'overseas_america') return [5, 6, 7]
    if (dest.region === 'overseas_middleeast') return [4, 5, 6]
    return [4, 5]
}

// 欧州周遊の variant 展開
function expandRouteVariants(): { route: MultiCountryRoute; variant: Variant }[] {
    const result: { route: MultiCountryRoute; variant: Variant }[] = []
    for (const route of EUROPE_ROUTES) {
        const totalDays = route.legs.reduce((s, l) => s + l.days, 0)
        // 周遊の長さは固定（route 定義時に決定）
        for (const theme of route.themes) {
            for (const origin of OVERSEAS_ORIGINS) {
                result.push({
                    route,
                    variant: { destinationId: route.id, duration_days: totalDays, theme, origin, routeId: route.id },
                })
            }
            result.push({
                route,
                variant: { destinationId: route.id, duration_days: totalDays, theme, routeId: route.id },
            })
        }
    }
    return result
}

// メイン
async function main() {
    const arg = process.argv[2]
    const targetCount = arg ? Number(arg) : 3000

    console.log('==== モデル旅程ジェネレータ ====')
    console.log(`目標件数: ${targetCount}`)

    // 既存の is_official を全削除（冪等性のため）
    if (!process.argv.includes('--keep')) {
        console.log('既存の is_official=true レコードを削除中...')
        const { error: delErr, count } = await supabase
            .from('trips')
            .delete({ count: 'exact' })
            .eq('is_official', true)
        if (delErr) {
            console.error('削除エラー:', delErr.message)
        } else {
            console.log(`削除: ${count ?? 0}件`)
        }
    }

    // variant 展開
    const domestic = expandDomesticVariants()
    const overseas = expandOverseasVariants()
    const routes = expandRouteVariants()

    console.log(`展開: 国内 ${domestic.length} / 海外 ${overseas.length} / 周遊 ${routes.length}`)

    // ビルド
    const drafts: DraftTrip[] = []
    for (const { dest, variant } of domestic) {
        try {
            drafts.push(sanitizeDraft(buildItinerary(dest, variant)))
        } catch (e) {
            console.warn(`国内ビルド失敗: ${dest.id}/${variant.theme}/${variant.duration_days}日`, e)
        }
    }
    for (const { dest, variant } of overseas) {
        try {
            drafts.push(sanitizeDraft(buildItinerary(dest, variant)))
        } catch (e) {
            console.warn(`海外ビルド失敗: ${dest.id}/${variant.theme}/${variant.duration_days}日`, e)
        }
    }
    for (const { route, variant } of routes) {
        try {
            const legs = route.legs.map(leg => {
                const dest = OVERSEAS_DESTINATIONS.find(d => d.id === leg.destinationId)
                if (!dest) throw new Error(`leg destination not found: ${leg.destinationId}`)
                return { dest, days: leg.days }
            })
            drafts.push(sanitizeDraft(buildMultiCountryItinerary(legs, variant, route.name)))
        } catch (e) {
            console.warn(`周遊ビルド失敗: ${route.id}/${variant.theme}`, e)
        }
    }

    console.log(`ビルド成功: ${drafts.length}件`)

    // 件数調整：上限を超えたらシャッフル後にtruncate
    const finalDrafts = drafts.length > targetCount
        ? shuffle(drafts).slice(0, targetCount)
        : drafts

    console.log(`投入予定: ${finalDrafts.length}件`)

    // バルクインサート（1000件ずつ）
    const BATCH = 500
    let inserted = 0
    for (let i = 0; i < finalDrafts.length; i += BATCH) {
        const batch = finalDrafts.slice(i, i + BATCH).map(d => ({
            share_id: generateShareId(),
            title: d.title,
            destination: d.destination,
            duration_days: d.duration_days,
            wishes: d.wishes,
            itinerary: d.itinerary,
            is_official: true,
        }))
        const { error } = await supabase.from('trips').insert(batch)
        if (error) {
            console.error(`バッチ ${i / BATCH + 1} エラー:`, error.message)
        } else {
            inserted += batch.length
            console.log(`バッチ ${i / BATCH + 1}: ${batch.length}件投入（累計 ${inserted}）`)
        }
    }

    console.log('==== 完了 ====')
    console.log(`総投入件数: ${inserted}/${finalDrafts.length}`)
}

function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

main().catch(e => {
    console.error(e)
    process.exit(1)
})
