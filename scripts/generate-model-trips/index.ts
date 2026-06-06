/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { DOMESTIC_DESTINATIONS } from './catalog/domestic'
import { OVERSEAS_DESTINATIONS } from './catalog/overseas'
import { ALL_ROUTES } from './catalog/routes'
import { buildRouteItinerary, sanitizeDraft } from './builders/itinerary-builder'
import type { DraftTrip, Route, TopTheme, DestinationEntry } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE キーが必要です')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 全 destination をルックアップできる Map
const ALL_DESTINATIONS = new Map<string, DestinationEntry>()
for (const d of [...DOMESTIC_DESTINATIONS, ...OVERSEAS_DESTINATIONS]) {
    ALL_DESTINATIONS.set(d.id, d)
}

function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length: 8 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('')
}

// ──────────── Variant 展開 ────────────
// Route ごとに、テーマと出発地と日数の組み合わせを限定的に展開する。
// popularity に応じて variant 数を可変（1〜6 件程度）に。

type VariantSpec = {
    route: Route
    theme: TopTheme
    origin?: string
    duration_days: number
}

function expandVariantsFromRoute(route: Route): VariantSpec[] {
    const result: VariantSpec[] = []
    // バリエーション総数の上限（人気度から）
    const maxVariants = route.popularity

    // 海外 route（最初の leg が日本以外）は出発地を東京のみに絞る。
    // 理由：海外行きは国際線フライトの時間が圧倒的に支配的で、東京/大阪/名古屋発
    //       の差分は誤差レベル。出発地違いの variant は冗長で UX を悪化させる。
    const firstDest = ALL_DESTINATIONS.get(route.legs[0]?.destinationId ?? '')
    const isOverseas = firstDest && firstDest.country !== '日本'
    const origins = isOverseas
        ? route.suitableOrigins.filter(o => o === '東京')
        : route.suitableOrigins

    // 候補の組み合わせを全列挙
    const candidates: VariantSpec[] = []
    for (const theme of route.suitableThemes) {
        for (const dur of route.durations) {
            for (const origin of origins) {
                candidates.push({ route, theme, origin, duration_days: dur })
            }
            // 出発地なしバージョン（汎用）も入れる
            candidates.push({ route, theme, duration_days: dur })
        }
    }

    // popularity 件まで間引いて、テーマと出発地のバランスを取る
    // シンプル戦略: candidates をシャッフル風に並べて先頭から maxVariants 件
    // ただし theme と origin が偏らないよう、優先度を計算
    const picked = pickBalanced(candidates, maxVariants)
    result.push(...picked)
    return result
}

// テーマ・出発地・日数が偏らないようバランスよく N 件選ぶ
function pickBalanced(candidates: VariantSpec[], n: number): VariantSpec[] {
    if (candidates.length <= n) return candidates
    const picked: VariantSpec[] = []
    const themeCount = new Map<string, number>()
    const originCount = new Map<string, number>()
    const durationCount = new Map<number, number>()

    function score(c: VariantSpec): number {
        const tc = themeCount.get(c.theme) ?? 0
        const oc = originCount.get(c.origin ?? '_none') ?? 0
        const dc = durationCount.get(c.duration_days) ?? 0
        // 偏りが少ない（カウントが小さい）ものを優先
        return -(tc * 10 + oc * 5 + dc * 3)
    }

    const remaining = candidates.slice()
    while (picked.length < n && remaining.length > 0) {
        remaining.sort((a, b) => score(b) - score(a))
        const top = remaining.shift()!
        picked.push(top)
        themeCount.set(top.theme, (themeCount.get(top.theme) ?? 0) + 1)
        originCount.set(top.origin ?? '_none', (originCount.get(top.origin ?? '_none') ?? 0) + 1)
        durationCount.set(top.duration_days, (durationCount.get(top.duration_days) ?? 0) + 1)
    }
    return picked
}

// ──────────── メイン ────────────

async function main() {
    const arg = process.argv[2]
    const targetCount = arg ? Number(arg) : 10000

    console.log('==== モデル旅程ジェネレータ (Route ベース版) ====')
    console.log(`目標件数: ${targetCount}（上限。実際は Route × variants で決定）`)

    if (!process.argv.includes('--keep')) {
        console.log('既存の is_official=true レコードを削除中...')
        const { error: delErr, count } = await supabase
            .from('trips')
            .delete({ count: 'exact' })
            .eq('is_official', true)
        if (delErr) console.error('削除エラー:', delErr.message)
        else console.log(`削除: ${count ?? 0}件`)
    }

    console.log(`登録 Route 数: ${ALL_ROUTES.length}`)
    const variants: VariantSpec[] = []
    for (const route of ALL_ROUTES) {
        const expanded = expandVariantsFromRoute(route)
        variants.push(...expanded)
    }
    console.log(`展開 variant 数: ${variants.length}`)

    const drafts: DraftTrip[] = []
    let skipped = 0
    let skipReasons = { destNotFound: 0, build: 0 }
    for (const v of variants) {
        try {
            const legs = v.route.legs.map(l => {
                const dest = ALL_DESTINATIONS.get(l.destinationId)
                if (!dest) throw new Error(`destination not found: ${l.destinationId}`)
                return { dest, days: l.days }
            })
            const built = buildRouteItinerary(legs, v.route, v.theme, v.origin, v.duration_days)
            if (built) drafts.push(sanitizeDraft(built))
            else { skipped++; skipReasons.build++ }
        } catch (e) {
            skipped++; skipReasons.destNotFound++
            const msg = e instanceof Error ? e.message : String(e)
            console.warn(`スキップ ${v.route.id}/${v.theme}: ${msg}`)
        }
    }
    console.log(`ビルド成功: ${drafts.length}件 / スキップ: ${skipped}件（dest未定義 ${skipReasons.destNotFound} / build失敗 ${skipReasons.build}）`)

    const finalDrafts = drafts.length > targetCount
        ? shuffle(drafts).slice(0, targetCount)
        : drafts

    console.log(`投入予定: ${finalDrafts.length}件`)

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
        if (error) console.error(`バッチ ${i / BATCH + 1} エラー:`, error.message)
        else {
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

main().catch(e => { console.error(e); process.exit(1) })
