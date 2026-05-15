'use client'
import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'tripgen.recentTrips.v1'
const MAX_ITEMS   = 20

export type RecentTrip = {
    share_id: string
    edit_token?: string        // 編集権限を持つ場合のみ
    title: string
    destination: string
    duration_days: number
    role: 'owner' | 'viewer'   // owner = 自分が作成 or コピー、viewer = 他人の旅程を閲覧
    accessed_at: number        // unix ms
}

function read(): RecentTrip[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed.filter(t => t && typeof t.share_id === 'string')
    } catch {
        return []
    }
}

function write(trips: RecentTrip[]) {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips.slice(0, MAX_ITEMS)))
    } catch {
        // QuotaExceeded 等は無視
    }
}

export function recordTripAccess(trip: Omit<RecentTrip, 'accessed_at' | 'role'> & { editable?: boolean }): void {
    if (typeof window === 'undefined') return
    const existing = read()
    // 既存があれば role はマージ（owner を優先）
    const prev = existing.find(t => t.share_id === trip.share_id)
    const role: 'owner' | 'viewer' = (prev?.role === 'owner' || trip.editable) ? 'owner' : 'viewer'
    const edit_token = role === 'owner' ? (trip.edit_token ?? prev?.edit_token) : undefined

    const next: RecentTrip = {
        share_id:      trip.share_id,
        edit_token,
        title:         trip.title,
        destination:   trip.destination,
        duration_days: trip.duration_days,
        role,
        accessed_at:   Date.now(),
    }
    const filtered = existing.filter(t => t.share_id !== trip.share_id)
    write([next, ...filtered])
}

export function useRecentTrips(): {
    trips: RecentTrip[]
    remove: (share_id: string) => void
    clear: () => void
    refresh: () => void
} {
    const [trips, setTrips] = useState<RecentTrip[]>([])

    const refresh = useCallback(() => setTrips(read()), [])

    useEffect(() => {
        refresh()
        // 他タブからの変更も拾う
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) refresh()
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [refresh])

    const remove = useCallback((share_id: string) => {
        const next = read().filter(t => t.share_id !== share_id)
        write(next)
        setTrips(next)
    }, [])

    const clear = useCallback(() => {
        write([])
        setTrips([])
    }, [])

    return { trips, remove, clear, refresh }
}
