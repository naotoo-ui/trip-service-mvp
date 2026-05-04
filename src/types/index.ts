export type SpotType = '観光' | 'グルメ' | '移動' | '宿泊' | 'その他'

export interface Spot {
    time: string
    name: string
    description: string
    duration_minutes: number
    type: SpotType
}

export interface ItineraryDay {
    day: number
    label: string
    spots: Spot[]
}

export interface Itinerary {
    days: ItineraryDay[]
}

export interface Trip {
    id: string
    share_id: string
    title: string
    destination: string
    duration_days: number
    wishes?: string
    source_url?: string
    itinerary: Itinerary
    created_at: string
}

export interface GenerateInput {
    destination: string
    duration_days: number
    wishes?: string
}
