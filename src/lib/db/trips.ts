import { supabase } from './supabase'
import type { Trip, Itinerary } from '@/types'

export function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length: 8 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('')
}

// 編集権限トークン（32文字・予測困難）
export function generateEditToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return Array.from({ length: 32 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('')
}

export async function saveTrip(params: {
    title: string
    destination: string
    duration_days: number
    wishes?: string
    source_url?: string
    itinerary: Itinerary
}): Promise<Trip> {
    const share_id   = generateShareId()
    const edit_token = generateEditToken()
    const { data, error } = await supabase
        .from('trips')
        .insert({ ...params, share_id, edit_token })
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data as Trip
}

export async function getTripByShareId(share_id: string): Promise<Trip | null> {
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('share_id', share_id)
        .single()
    if (error) return null
    return data as Trip
}

export async function getRecentTrips(limit = 20): Promise<Trip[]> {
    const { data, error } = await supabase
        .from('trips')
        .select('id, share_id, title, destination, duration_days, created_at')
        .eq('is_official', false)
        .order('created_at', { ascending: false })
        .limit(limit)
    if (error) return []
    return data as Trip[]
}

// モデルプラン（公式キュレーション）の軽量フェッチ
export async function getModelTrips(opts: {
    destination?: string
    duration?: number
    keyword?: string
    limit?: number
    offset?: number
}): Promise<{ items: Trip[]; total: number }> {
    const { destination, duration, keyword, limit = 100, offset = 0 } = opts
    let query = supabase
        .from('trips')
        .select('id, share_id, title, destination, duration_days, created_at, wishes', { count: 'exact' })
        .eq('is_official', true)
        .order('destination', { ascending: true })
        .order('duration_days', { ascending: true })

    if (destination) query = query.ilike('destination', `%${destination}%`)
    if (typeof duration === 'number') query = query.eq('duration_days', duration)
    if (keyword) query = query.ilike('title', `%${keyword}%`)

    const { data, error, count } = await query.range(offset, offset + limit - 1)
    if (error) return { items: [], total: 0 }
    return { items: (data ?? []) as Trip[], total: count ?? 0 }
}

// /models フィルタ用：モデルプランの目的地リスト（重複除去）
export async function getModelDestinations(): Promise<string[]> {
    const { data, error } = await supabase
        .from('trips')
        .select('destination')
        .eq('is_official', true)
    if (error || !data) return []
    const set = new Set<string>()
    for (const row of data as { destination: string }[]) {
        if (row.destination) set.add(row.destination)
    }
    return Array.from(set).sort()
}

// edit_token 検証付き更新（NULL のレガシー旅程は誰でも編集可能・後方互換）
export async function updateTripItinerary(
    share_id: string,
    itinerary: Itinerary,
    title?: string,
    edit_token?: string,
): Promise<{ ok: boolean; error?: 'forbidden' | 'not_found' | 'unknown' }> {
    const trip = await getTripByShareId(share_id)
    if (!trip) return { ok: false, error: 'not_found' }

    // edit_token がDBにあるなら一致しないと拒否
    if (trip.edit_token && trip.edit_token !== edit_token) {
        return { ok: false, error: 'forbidden' }
    }

    const patch: Record<string, unknown> = { itinerary }
    if (title !== undefined) patch.title = title
    const { error } = await supabase
        .from('trips')
        .update(patch)
        .eq('share_id', share_id)
    if (error) return { ok: false, error: 'unknown' }
    return { ok: true }
}

export async function copyTrip(source_share_id: string): Promise<Trip> {
    const source = await getTripByShareId(source_share_id)
    if (!source) throw new Error('コピー元の旅程が見つかりません')
    const new_share_id = generateShareId()
    const edit_token   = generateEditToken()
    const { data, error } = await supabase
        .from('trips')
        .insert({
            share_id: new_share_id,
            edit_token,
            title: `${source.title}（コピー）`,
            destination: source.destination,
            duration_days: source.duration_days,
            wishes: source.wishes,
            source_url: source.source_url,
            itinerary: source.itinerary,
        })
        .select()
        .single()
    if (error) throw new Error(error.message)
    return data as Trip
}
