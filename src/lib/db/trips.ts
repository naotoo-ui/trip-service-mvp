import { supabase } from './supabase'
import type { Trip, Itinerary } from '@/types'

export function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length: 8 }, () =>
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
    const share_id = generateShareId()
    const { data, error } = await supabase
        .from('trips')
        .insert({ ...params, share_id })
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
        .order('created_at', { ascending: false })
        .limit(limit)
    if (error) return []
    return data as Trip[]
}

export async function updateTripItinerary(share_id: string, itinerary: Itinerary, title?: string): Promise<void> {
    const patch: Record<string, unknown> = { itinerary }
    if (title !== undefined) patch.title = title
    const { error } = await supabase
        .from('trips')
        .update(patch)
        .eq('share_id', share_id)
    if (error) throw new Error(error.message)
}

export async function copyTrip(source_share_id: string): Promise<Trip> {
    const source = await getTripByShareId(source_share_id)
    if (!source) throw new Error('コピー元の旅程が見つかりません')
    const new_share_id = generateShareId()
    const { data, error } = await supabase
        .from('trips')
        .insert({
            share_id: new_share_id,
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
