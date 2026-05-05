export type SpotType = '観光' | 'グルメ' | '移動' | '宿泊' | 'その他'

export type TransportMode =
    | '電車' | '新幹線' | '地下鉄' | 'バス' | 'レンタカー'
    | 'タクシー' | '徒歩' | '飛行機' | '船' | 'バイク' | 'ライドシェア'

export type TripStyle = 'rental_car' | 'public_transit' | 'walking' | 'mixed' | 'overseas_transit'

export interface TransportOption {
    mode: TransportMode
    duration_minutes: number
    note: string        // 例: "JR線 / 約850円" "国道58号経由 / 約12km"
    recommended?: boolean
}

export interface Spot {
    time: string
    name: string
    description: string
    duration_minutes: number
    type: SpotType
    transport_options?: TransportOption[]  // 移動スポットのみ
}

export interface ItineraryDay {
    day: number
    label: string
    spots: Spot[]
}

export interface Itinerary {
    days: ItineraryDay[]
    trip_style?: TripStyle
    trip_style_reason?: string
    start_date?: string   // ISO date string e.g. "2026-05-05"
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
