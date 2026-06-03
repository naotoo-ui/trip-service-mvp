import type { Route } from '../types'

// 米州・オセアニア・中東 ルート

export const ROUTES_AMERICAS_OCEANIA_ETC: Route[] = [
    // ──────────── 北米 ────────────
    {
        id: 'r-newyork-solo',
        name: 'ニューヨーク',
        legs: [{ destinationId: 'newyork', days: 5 }],
        suitableThemes: ['sg', 'ar', 'gm', 'sp', 'ng'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6, 7],
        popularity: 4,
        titleSuffixes: ['NY定番観光', 'ブロードウェイとMoMA', 'タイムズスクエア＆セントラルパーク', 'マンハッタン夜景'],
    },
    {
        id: 'r-la-solo',
        name: 'ロサンゼルス',
        legs: [{ destinationId: 'la', days: 4 }],
        suitableThemes: ['sg', 'fm', 'cp', 'sp'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 3,
        titleSuffixes: ['ハリウッドとサンタモニカ', 'ディズニーランドと観光', 'グリフィス天文台で夜景'],
    },

    // ──────────── ハワイ ────────────
    {
        id: 'r-hawaii-oahu-solo',
        name: 'ハワイ（オアフ島）',
        legs: [{ destinationId: 'hawaii-oahu', days: 5 }],
        suitableThemes: ['bc', 'np', 'fm', 'cp', 'sp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [5, 6, 7],
        popularity: 6,
        titleSuffixes: ['ワイキキとダイヤモンドヘッド', '家族で楽しむオアフ', 'ノースショアとパールハーバー', 'ハワイ定番リゾート', 'カラカウア通りとビーチ', 'ハネムーンにも'],
    },

    // ──────────── グアム ────────────
    {
        id: 'r-guam-solo',
        name: 'グアム',
        legs: [{ destinationId: 'guam', days: 3 }],
        suitableThemes: ['bc', 'fm', 'cp', 'sp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['タモンビーチと恋人岬', 'ファミリーリゾート', 'ショッピングとマリン体験', '近場の南国'],
    },

    // ──────────── オーストラリア ────────────
    {
        id: 'r-sydney-solo',
        name: 'シドニー',
        legs: [{ destinationId: 'sydney', days: 4 }],
        suitableThemes: ['sg', 'np', 'gm', 'bc'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 3,
        titleSuffixes: ['オペラハウスとハーバー', 'ボンダイビーチとブルーマウンテンズ', 'シドニー王道観光'],
    },
    {
        id: 'r-melbourne-solo',
        name: 'メルボルン',
        legs: [{ destinationId: 'melbourne', days: 4 }],
        suitableThemes: ['sg', 'ar', 'gm', 'np'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 2,
        titleSuffixes: ['グレートオーシャンロード', '12人の使徒と街歩き', 'メルボルンカフェ巡り'],
    },

    // ──────────── 中東 ────────────
    {
        id: 'r-dubai-solo',
        name: 'ドバイ',
        legs: [{ destinationId: 'dubai', days: 4 }],
        suitableThemes: ['sg', 'sp', 'np', 'cp', 'ng'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5, 6],
        popularity: 4,
        titleSuffixes: ['ブルジュ・ハリファとモール', 'デザートサファリ', '砂漠と摩天楼', '近未来都市と砂漠'],
    },
]
