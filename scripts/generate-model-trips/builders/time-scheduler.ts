import type { Spot } from '../../../src/types'
import type { SpotEntry } from '../types'

/**
 * 時刻配置：与えられたスポット列に対して time を順に割り当てる
 * - 開始時刻: startHour:00
 * - 各スポット間に gap_min を入れる
 * - "HH:MM" 形式を返す
 */
export function scheduleSpots(
    entries: SpotEntry[],
    startHour: number,
    gapMinutes: number,
    lunchHour = 12,            // 12時前後にグルメを入れたい
): Spot[] {
    let cursor = startHour * 60

    // 並び替え：「グルメ」は昼食/夕食帯に寄せる、それ以外は順序維持
    const ordered = orderForMealtimes(entries, lunchHour)

    return ordered.map((e): Spot => {
        const time = formatHHMM(cursor)
        const dur = e.dur
        cursor += dur + gapMinutes
        return {
            time,
            name: e.n,
            description: e.d,
            duration_minutes: dur,
            type: e.t,
            address: e.addr,
            ...(e.bk ? { needs_booking: true } : {}),
        }
    })
}

// グルメは昼食(11-13)・夕食(18-20)に寄せる
function orderForMealtimes(entries: SpotEntry[], lunchHour: number): SpotEntry[] {
    const gourmet = entries.filter(e => e.t === 'グルメ')
    const others = entries.filter(e => e.t !== 'グルメ')
    if (gourmet.length === 0) return entries

    // 昼食候補は1件まで（残りは観光の合間に）
    const lunchPick = gourmet[0]
    const remainingGourmet = gourmet.slice(1)

    // others を「昼食前」「昼食後」に分割
    const beforeLunchCount = Math.max(1, Math.floor(others.length * 0.4))
    const result: SpotEntry[] = []
    result.push(...others.slice(0, beforeLunchCount))
    result.push(lunchPick)
    result.push(...others.slice(beforeLunchCount))
    // 残りのグルメは末尾（夕食/カフェ）
    result.push(...remainingGourmet)
    return result
}

function formatHHMM(minutes: number): string {
    const h = Math.floor(minutes / 60) % 24
    const m = minutes % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
