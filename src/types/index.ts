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
    address?: string               // AI生成: 住所ヒント（例: "那覇市牧志"）Google Maps検索精度向上に使用
    needs_booking?: boolean        // AI判定: 予約が必要か
    booking_confirmed?: boolean    // ユーザー設定: 予約済みか
    memo?: string                  // ユーザーメモ
    user_links?: string[]          // ユーザー追加リンク（最大5件）
}

export interface HotelInfo {
    name: string
    address?: string
    check_in?: string        // "15:00" 形式
    check_out?: string       // "11:00" 形式
    price_per_night?: number // 円
    booking_confirmed?: boolean
    booking_url?: string
    memo?: string
}

export interface ItineraryDay {
    day: number
    label: string
    spots: Spot[]
    hotel?: HotelInfo
}

export interface SidebarSpot {
    name: string
    description: string
    type: SpotType
    duration_minutes: number
    popularity?: number  // 1-5
}

export interface Itinerary {
    days: ItineraryDay[]
    trip_style?: TripStyle
    trip_style_reason?: string
    start_date?: string   // ISO date string e.g. "2026-05-05"
    sidebar_spots?: SidebarSpot[]
}

export interface Trip {
    id: string
    share_id: string
    edit_token?: string         // 編集権限トークン（NULL = 旧トリップ・現在は閲覧専用）
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

export type GroupType =
    | 'friends' | 'family' | 'couple' | 'other'
    | 'married' | 'three_gen' | 'corporate' | 'club' | 'girls' | 'honeymoon'

export interface PlanInput {
    destinations: string[]   // 必須・複数可
    duration_days: number    // 必須
    start_date?: string
    origin?: string
    adults?: number
    children?: number
    group_type?: GroupType
    wishes?: string
    urls?: string[]          // 最大5つ
}
