import type { RegionId } from './types'

// 出発地名から地域コードを判定
export function detectOriginRegion(origin: string): RegionId | null {
    const p = origin.toLowerCase()
    if (/東京|神奈川|横浜|千葉|埼玉|群馬|栃木|茨城|山梨|長野|静岡|新潟/.test(p)) return 'kanto'
    if (/大阪|京都|神戸|奈良|滋賀|和歌山|兵庫/.test(p)) return 'kansai'
    if (/名古屋|愛知|岐阜|三重/.test(p)) return 'chubu'
    if (/広島|岡山|山口|鳥取|島根/.test(p)) return 'chugoku'
    if (/福岡|佐賀|長崎|熊本|大分|宮崎|鹿児島/.test(p)) return 'kyushu'
    if (/仙台|宮城|岩手|青森|秋田|山形|福島/.test(p)) return 'tohoku'
    if (/金沢|福井|富山|石川/.test(p)) return 'hokuriku'
    if (/高知|愛媛|徳島|香川/.test(p)) return 'shikoku'
    if (/北海道|札幌|函館|旭川|釧路|帯広|稚内|網走|知床/.test(p)) return 'hokkaido'
    if (/沖縄|那覇/.test(p)) return 'okinawa_main'
    if (/石垣|宮古|与論|久米島|西表/.test(p)) return 'okinawa_remote'
    return null
}

// 国内地方間の典型移動時間（時間）
const DOMESTIC_TRAVEL_HOURS: Partial<Record<RegionId, Partial<Record<RegionId, number>>>> = {
    kanto:    { kansai: 3, chubu: 2, chugoku: 5, kyushu: 7, tohoku: 2, hokuriku: 3, shikoku: 5 },
    kansai:   { kanto: 3, chubu: 1, chugoku: 2, kyushu: 3, tohoku: 5, hokuriku: 2, shikoku: 2 },
    chubu:    { kanto: 2, kansai: 1, chugoku: 3, kyushu: 4, tohoku: 3, hokuriku: 1, shikoku: 3 },
    chugoku:  { kanto: 5, kansai: 2, chubu: 3, kyushu: 2, tohoku: 7, hokuriku: 3, shikoku: 1 },
    kyushu:   { kanto: 7, kansai: 3, chubu: 4, chugoku: 2, tohoku: 8, hokuriku: 5, shikoku: 3 },
    tohoku:   { kanto: 2, kansai: 5, chubu: 3, chugoku: 7, kyushu: 8, hokuriku: 4, shikoku: 6 },
    hokuriku: { kanto: 3, kansai: 2, chubu: 1, chugoku: 3, kyushu: 5, tohoku: 4, shikoku: 3 },
    shikoku:  { kanto: 5, kansai: 2, chubu: 3, chugoku: 1, kyushu: 3, tohoku: 6, hokuriku: 3 },
}

export type DayLimits = {
    day1StartHour: number     // 1日目開始時刻（時）
    day1MaxSpots: number      // 1日目スポット最大数
    middleMaxSpots: number    // 中日のスポット最大数
    middleStartHour: number   // 中日開始時刻
    lastEndHour: number       // 最終日終了時刻（この時刻までに終わる）
    lastMaxSpots: number      // 最終日スポット最大数
}

// 出発地→目的地の移動から day1/last の制約を決定
export function computeDayLimits(
    originRegion: RegionId | null,
    destRegion: RegionId,
    destCountry: string,
): DayLimits {
    // 海外
    if (destCountry !== '日本') {
        return {
            day1StartHour: 18,        // 夕食のみ
            day1MaxSpots: 1,
            middleMaxSpots: 4,
            middleStartHour: 9,
            lastEndHour: 11,          // チェックアウト→空港
            lastMaxSpots: 1,
        }
    }

    // 沖縄離島（飛行機必須）
    if (destRegion === 'okinawa_remote' && originRegion !== 'okinawa_remote' && originRegion !== 'okinawa_main') {
        return {
            day1StartHour: 14, day1MaxSpots: 3,
            middleMaxSpots: 4, middleStartHour: 9,
            lastEndHour: 14, lastMaxSpots: 2,
        }
    }

    // 沖縄本島
    if (destRegion === 'okinawa_main' && originRegion !== 'okinawa_main' && originRegion !== 'okinawa_remote') {
        return {
            day1StartHour: 13, day1MaxSpots: 3,
            middleMaxSpots: 4, middleStartHour: 9,
            lastEndHour: 14, lastMaxSpots: 2,
        }
    }

    // 北海道
    if (destRegion === 'hokkaido' && originRegion !== 'hokkaido') {
        return {
            day1StartHour: 13, day1MaxSpots: 3,
            middleMaxSpots: 4, middleStartHour: 9,
            lastEndHour: 14, lastMaxSpots: 2,
        }
    }

    // 長距離・中距離・近距離
    if (originRegion && originRegion !== destRegion) {
        const hours = DOMESTIC_TRAVEL_HOURS[originRegion]?.[destRegion] ?? 2
        if (hours >= 4) {
            return {
                day1StartHour: 13, day1MaxSpots: 3,
                middleMaxSpots: 5, middleStartHour: 9,
                lastEndHour: 15, lastMaxSpots: 2,
            }
        }
        if (hours >= 2) {
            return {
                day1StartHour: 11, day1MaxSpots: 4,
                middleMaxSpots: 5, middleStartHour: 9,
                lastEndHour: 16, lastMaxSpots: 3,
            }
        }
    }

    // 近距離・同地方
    return {
        day1StartHour: 9, day1MaxSpots: 5,
        middleMaxSpots: 5, middleStartHour: 9,
        lastEndHour: 17, lastMaxSpots: 4,
    }
}

// 出発地→目的地の交通手段を判定（trip_style とは別の「初日移動」の解説）
export function originToDestinationMode(
    originRegion: RegionId | null,
    destRegion: RegionId,
    destCountry: string,
): '飛行機' | '新幹線' | '電車' | 'バス' | '徒歩' | null {
    if (destCountry !== '日本') return '飛行機'
    if (!originRegion) return null
    if (originRegion === destRegion) return '電車'

    // 飛行機が現実的なペア
    const flightPairs = new Set([
        'kanto-okinawa_main', 'kansai-okinawa_main', 'chubu-okinawa_main',
        'kanto-okinawa_remote', 'kansai-okinawa_remote',
        'kanto-hokkaido', 'kansai-hokkaido', 'chubu-hokkaido', 'kyushu-hokkaido',
        'kanto-kyushu', 'tohoku-kyushu', 'hokuriku-kyushu',
        'kanto-kyushu_island',
    ])
    const key = `${originRegion}-${destRegion}`
    const keyRev = `${destRegion}-${originRegion}`
    if (flightPairs.has(key) || flightPairs.has(keyRev)) return '飛行機'

    // 沖縄関連は飛行機
    if (destRegion === 'okinawa_main' || destRegion === 'okinawa_remote') return '飛行機'
    if (destRegion === 'hokkaido') return '飛行機'

    return '新幹線'
}
