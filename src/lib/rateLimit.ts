const KEY = 'tripgen.rateLimit.v1'
export const DAILY_MAX = 10

type RateLimitRecord = { date: string; count: number }

function getToday(): string {
    return new Date().toISOString().split('T')[0]
}

export function getRateLimitRecord(): RateLimitRecord {
    if (typeof window === 'undefined') return { date: getToday(), count: 0 }
    const today = getToday()
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) return { date: today, count: 0 }
        const record: RateLimitRecord = JSON.parse(raw)
        if (record.date !== today) return { date: today, count: 0 }
        return record
    } catch {
        return { date: today, count: 0 }
    }
}

export function incrementRateLimit(): void {
    const today = getToday()
    const record = getRateLimitRecord()
    localStorage.setItem(KEY, JSON.stringify({ date: today, count: record.count + 1 }))
}

export function isClientRateLimited(): boolean {
    return getRateLimitRecord().count >= DAILY_MAX
}

export function getRemainingCount(): number {
    return Math.max(0, DAILY_MAX - getRateLimitRecord().count)
}
