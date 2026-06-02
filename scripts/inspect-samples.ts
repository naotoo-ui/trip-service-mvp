/**
 * 同一目的地・同一日数で異なるテーマ・出発地の variant が
 * 実際に異なる旅程を生成するか目視確認する。
 *
 * 実行: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/inspect-samples.ts
 */
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { DOMESTIC_DESTINATIONS } from './generate-model-trips/catalog/domestic'
import { OVERSEAS_DESTINATIONS } from './generate-model-trips/catalog/overseas'
import { buildItinerary, sanitizeDraft } from './generate-model-trips/builders/itinerary-builder'
import type { Variant, TopTheme } from './generate-model-trips/types'

function inspect(dest: typeof DOMESTIC_DESTINATIONS[number], themes: TopTheme[], origins: (string | undefined)[], days: number) {
    console.log(`\n========== ${dest.name} ${days}日間 ==========`)
    for (const theme of themes) {
        for (const origin of origins) {
            const variant: Variant = { destinationId: dest.id, duration_days: days, theme, origin }
            const built = buildItinerary(dest, variant)
            if (!built) {
                console.log(`\n[${theme}/${origin ?? '原点なし'}] ⚠️ スキップ（テーマ非対応）`)
                continue
            }
            const draft = sanitizeDraft(built)
            console.log(`\n[${theme}/${origin ?? '原点なし'}] ${draft.title}`)
            console.log(`  希望: ${draft.wishes}`)
            for (const day of draft.itinerary.days) {
                console.log(`  Day${day.day} ${day.label}`)
                for (const s of day.spots) {
                    console.log(`    ${s.time} ${s.name} (${s.type}, ${s.duration_minutes}min)`)
                }
            }
        }
    }
}

// 京都で複数テーマ・複数出発地を確認
const kyoto = DOMESTIC_DESTINATIONS.find(d => d.id === 'kyoto')!
inspect(kyoto, ['sg', 'gm', 'hs', 'cp'], ['東京', '大阪'], 3)

// 沖縄本島
const okinawa = DOMESTIC_DESTINATIONS.find(d => d.id === 'okinawa-main')!
inspect(okinawa, ['bc', 'np', 'fm'], ['東京', '大阪'], 3)

// パリ
const paris = OVERSEAS_DESTINATIONS.find(d => d.id === 'paris')!
inspect(paris, ['sg', 'gm', 'ar', 'cp'], ['東京', '大阪'], 5)

// アムステルダム（ユーザーが指摘した例）
const amsterdam = OVERSEAS_DESTINATIONS.find(d => d.id === 'amsterdam')!
inspect(amsterdam, ['sg', 'np', 'ar', 'hs', 'cp'], ['東京', '大阪'], 5)
