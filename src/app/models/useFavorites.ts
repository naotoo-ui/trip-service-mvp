'use client'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'tripservice.models.favorites.v1'

function readStorage(): Set<string> {
    if (typeof window === 'undefined') return new Set()
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return new Set()
        const arr = JSON.parse(raw) as unknown
        if (!Array.isArray(arr)) return new Set()
        return new Set(arr.filter((x): x is string => typeof x === 'string'))
    } catch {
        return new Set()
    }
}

function writeStorage(set: Set<string>): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)))
    } catch { /* quota / private mode */ }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<Set<string>>(() => new Set())
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setFavorites(readStorage())
        setHydrated(true)
    }, [])

    const toggle = useCallback((id: string) => {
        setFavorites(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            writeStorage(next)
            return next
        })
    }, [])

    const has = useCallback((id: string) => favorites.has(id), [favorites])

    return { favorites, toggle, has, hydrated }
}
