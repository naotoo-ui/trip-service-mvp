import type { SpotType, TripStyle, TransportMode, Itinerary } from '../../src/types'

// テーマコード（短縮）
// sg=観光 / gm=グルメ / np=絶景 / on=温泉 / hs=歴史 / ex=体験
// ng=夜景 / sp=ショッピング / nt=自然 / cp=カップル / fm=家族 / so=一人旅
// wh=世界遺産 / ar=アート / bc=ビーチ
export type ThemeCode =
    | 'sg' | 'gm' | 'np' | 'on' | 'hs' | 'ex'
    | 'ng' | 'sp' | 'nt' | 'cp' | 'fm' | 'so'
    | 'wh' | 'ar' | 'bc'

// テーマ表示用ラベル（ユーザー向けタイトル/フィルタに使う）
export const THEME_LABELS: Record<ThemeCode, string> = {
    sg: '観光', gm: 'グルメ', np: '絶景', on: '温泉', hs: '歴史', ex: '体験',
    ng: '夜景', sp: 'ショッピング', nt: '自然', cp: 'カップル', fm: '家族', so: '一人旅',
    wh: '世界遺産', ar: 'アート', bc: 'ビーチ',
}

// variant 展開時に使う「上位テーマ」
export type TopTheme =
    | 'sg' | 'gm' | 'np' | 'on' | 'hs' | 'cp' | 'fm' | 'sp' | 'bc' | 'wh' | 'ar'
    | 'ng' | 'nt' | 'ex'

// 1スポットのカタログエントリ
export interface SpotEntry {
    n: string                // name
    d: string                // description (30〜80字)
    t: SpotType              // 観光/グルメ/その他
    dur: number              // duration_minutes
    addr: string             // 住所（市区町村＋町名）
    area: string             // エリアコード
    th: ThemeCode[]          // 適合テーマ
    pop: number              // 1-5
    bk?: boolean             // needs_booking
    morningOk?: boolean      // 朝早く開く
    eveningOk?: boolean      // 夜遅くまで
}

// ホテルカタログ
export interface HotelEntry {
    n: string                // name
    addr: string             // address
    area: string             // エリアコード
    price?: number           // price_per_night
}

// エリアクラスタ（同日にまとめるためのヒント）
export interface AreaCluster {
    id: string
    name: string             // 表示用
}

// 目的地カタログ
export interface DestinationEntry {
    id: string
    name: string             // '京都'
    titleAlias?: string      // タイトル用の別名（例: '京都市内'）
    country: string          // '日本' / '韓国' …
    region: RegionId
    trip_style: TripStyle
    intra_mode: TransportMode  // スポット間の典型移動
    intra_gap_min: number      // スポット間の典型移動時間（分）
    spots: SpotEntry[]
    hotels: HotelEntry[]
    areas: AreaCluster[]
    // 利用可能テーマ（このリストから variant 展開）
    themes: TopTheme[]
    // タイトル用の典型的なキャッチフレーズ（テーマ別・任意）
    titleHints?: Partial<Record<TopTheme, string[]>>
}

// 欧州周遊：複数 destination を順に巡るルート
export interface MultiCountryRoute {
    id: string
    name: string             // 'パリ→ロンドン'
    legs: {
        destinationId: string  // 'paris' 等（overseas.ts の id と一致）
        days: number           // この目的地での滞在日数
    }[]
    themes: TopTheme[]
}

// 地域コード（移動時間判定）
export type RegionId =
    | 'kanto' | 'kansai' | 'chubu' | 'chugoku' | 'kyushu'
    | 'tohoku' | 'hokuriku' | 'shikoku' | 'hokkaido' | 'okinawa_main'
    | 'okinawa_remote' | 'kyushu_island'
    // 海外（移動時間ロジックには未使用だが分類用）
    | 'overseas_asia_near' | 'overseas_asia_far' | 'overseas_oceania'
    | 'overseas_europe' | 'overseas_america' | 'overseas_middleeast'

// ジェネレータが組み立てる中間表現
export interface DraftTrip {
    title: string
    destination: string
    duration_days: number
    wishes: string
    is_official: true
    itinerary: Itinerary
}

// variant: 1つの旅程に展開される元情報
export interface Variant {
    destinationId: string
    duration_days: number
    theme: TopTheme
    origin?: string
    // 周遊ルート用
    routeId?: string
}

// ──────────── Route: 旅行ルート ────────────
// 「目的地の性質に応じた、現実的なプランパターン」を表す。
// 単一目的地でも複数目的地（周遊）でもこれで表現する。
// 1ルート＝1旅行パターン。テーマや出発地でバリエーション展開する。
export interface Route {
    id: string
    name: string                          // 「京都・大阪 王道周遊」「北海道・道東周遊」など、表示・タイトル用
    legs: RouteLeg[]                      // 1つなら単独・複数なら周遊
    suitableThemes: TopTheme[]            // このルートに似合うテーマ（1-5）
    suitableOrigins: ('東京'|'大阪'|'名古屋'|'福岡'|'札幌')[]   // 想定される出発地
    durations: number[]                   // 適した日数の候補（例 [3, 4]）
    seasonal?: 'spring'|'summer'|'autumn'|'winter'  // 季節限定なら
    seasonalNote?: string                 // 「桜」「紅葉」「ねぶた祭り」など
    popularity: 1|2|3|4|5|6               // 1-6。variant 数の目安
    titlePrefix?: string                  // 「春の」「紅葉の」「冬の」など
    isOverseas?: boolean                  // 海外向けの判定
    // タイトル末尾のサフィックス候補（与えなければデフォルト）
    titleSuffixes?: string[]
    // 希望文（wishes）の候補
    wishesPhrases?: string[]
}

export interface RouteLeg {
    destinationId: string                 // catalog の destination.id
    days: number                          // この目的地での滞在日数
}
