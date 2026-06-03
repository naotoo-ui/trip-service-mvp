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

    // ──────────── 北米 周遊 ────────────
    {
        id: 'r-us-east-coast',
        name: 'アメリカ東海岸（NY中心）',
        legs: [{ destinationId: 'newyork', days: 5 }],
        suitableThemes: ['sg', 'ar', 'gm', 'hs', 'sp'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['東海岸ハイライト', 'NYワシントン日帰り', '東海岸主要都市'],
    },
    {
        id: 'r-us-west-coast',
        name: 'アメリカ西海岸（LA中心）',
        legs: [{ destinationId: 'la', days: 5 }],
        suitableThemes: ['sg', 'fm', 'cp', 'sp', 'np'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['西海岸ハイライト', 'ハリウッドとビーチ', 'ロサンゼルス満喫'],
    },

    // ──────────── ハワイ周遊 ────────────
    {
        id: 'r-hawaii-multi',
        name: 'ハワイ・オアフ＋α',
        legs: [{ destinationId: 'hawaii-oahu', days: 6 }],
        suitableThemes: ['bc', 'np', 'fm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [6, 7, 8],
        popularity: 4,
        titleSuffixes: ['ハワイで過ごす長旅', 'オアフ＋マウイ気分', 'ハワイ満喫長期滞在', 'ハネムーンハワイ'],
    },

    // ──────────── オーストラリア周遊 ────────────
    {
        id: 'r-sydney-melbourne',
        name: 'シドニー・メルボルン',
        legs: [
            { destinationId: 'sydney', days: 3 },
            { destinationId: 'melbourne', days: 3 },
        ],
        suitableThemes: ['sg', 'np', 'gm', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7, 8],
        popularity: 3,
        titleSuffixes: ['豪州2大都市', 'オペラハウスとグレートオーシャンロード', '東岸縦断'],
    },

    // ──────────── ドバイ＋エジプト風（ドバイ強化のみ） ────────────
    {
        id: 'r-dubai-deep',
        name: 'ドバイ＋アブダビ',
        legs: [{ destinationId: 'dubai', days: 5 }],
        suitableThemes: ['sg', 'sp', 'np', 'cp', 'ng', 'ex'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 3,
        titleSuffixes: ['ドバイ・アブダビ周遊', '王宮とモスク巡り', '砂漠の冒険'],
    },
]
