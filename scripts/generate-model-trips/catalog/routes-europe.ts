import type { Route } from '../types'

// ヨーロッパ：周遊型が基本。単独都市プランはパリ・ロンドン・ローマ・バルセロナ等のみ。

export const ROUTES_EUROPE: Route[] = [
    // ──────────── 単独で成立する大都市（例外的） ────────────
    {
        id: 'r-paris-solo',
        name: 'パリ',
        legs: [{ destinationId: 'paris', days: 5 }],
        suitableThemes: ['sg', 'gm', 'ar', 'cp', 'wh'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 5,
        titleSuffixes: ['パリ＋ヴェルサイユ', '美術館巡りとカフェ', 'ロマンチック・パリ', '凱旋門とエッフェル塔'],
    },
    {
        id: 'r-london-solo',
        name: 'ロンドン',
        legs: [{ destinationId: 'london', days: 5 }],
        suitableThemes: ['sg', 'ar', 'hs', 'gm', 'fm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 4,
        titleSuffixes: ['ロンドン定番観光', 'ハロッズと大英博物館', '英国王室と街歩き', '家族でロンドン'],
    },
    {
        id: 'r-rome-solo',
        name: 'ローマ',
        legs: [{ destinationId: 'rome', days: 4 }],
        suitableThemes: ['sg', 'hs', 'wh', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5],
        popularity: 3,
        titleSuffixes: ['コロッセオとヴァチカン', 'ローマの休日コース', '永遠の都を満喫'],
    },
    {
        id: 'r-barcelona-solo',
        name: 'バルセロナ',
        legs: [{ destinationId: 'barcelona', days: 4 }],
        suitableThemes: ['sg', 'ar', 'gm', 'cp'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5],
        popularity: 3,
        titleSuffixes: ['ガウディ建築巡り', 'サグラダ・ファミリアと海', '芸術と地中海グルメ'],
    },

    // ──────────── 西欧2-3国周遊（最人気） ────────────
    {
        id: 'r-paris-london',
        name: 'パリ・ロンドン',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'london', days: 3 },
        ],
        suitableThemes: ['sg', 'ar', 'gm', 'wh'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7, 8],
        popularity: 5,
        titleSuffixes: ['西欧2大都市', 'ロンドン＋パリ王道', 'ユーロスターで結ぶ2都市', '英仏ハイライト'],
    },
    {
        id: 'r-paris-london-amsterdam',
        name: 'パリ・ロンドン・アムステルダム',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'london', days: 2 },
            { destinationId: 'amsterdam', days: 2 },
        ],
        suitableThemes: ['sg', 'ar', 'wh'],
        suitableOrigins: ['東京', '大阪'],
        durations: [7, 8, 9],
        popularity: 4,
        titleSuffixes: ['西欧3国周遊', 'パリ＋ロンドン＋運河の街', '英仏蘭ハイライト'],
    },
    {
        id: 'r-paris-amsterdam',
        name: 'パリ・アムステルダム',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'amsterdam', days: 3 },
        ],
        suitableThemes: ['sg', 'ar', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['パリ＋アムステルダム', '美術館巡り2都市', '芸術の都2つ'],
    },

    // ──────────── 英国＋アイルランド ────────────
    {
        id: 'r-london-edinburgh',
        name: 'ロンドン・エディンバラ',
        legs: [{ destinationId: 'london', days: 5 }],
        suitableThemes: ['sg', 'hs', 'np'],
        suitableOrigins: ['東京', '大阪'],
        durations: [7, 8],
        popularity: 2,
        titleSuffixes: ['英国2大都市', 'ロンドン＋スコットランド', '英国列車旅'],
    },

    // ──────────── イタリア周遊 ────────────
    {
        id: 'r-italy-3city',
        name: 'イタリア三都（ローマ・フィレンツェ・ベネチア）',
        legs: [{ destinationId: 'rome', days: 5 }],
        suitableThemes: ['sg', 'hs', 'wh', 'gm', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [7, 8],
        popularity: 4,
        titleSuffixes: ['イタリア三都市', 'ローマ＋フィレンツェ＋ベネチア', '芸術と古代遺跡', '世界遺産イタリア'],
    },
    {
        id: 'r-rome-paris',
        name: 'ローマ・パリ',
        legs: [
            { destinationId: 'rome', days: 3 },
            { destinationId: 'paris', days: 3 },
        ],
        suitableThemes: ['sg', 'hs', 'gm', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['永遠の都と花の都', 'イタリア＋フランス', 'グルメと芸術2都市'],
    },

    // ──────────── スペイン ────────────
    {
        id: 'r-spain-classic',
        name: 'スペイン（バルセロナ・マドリード）',
        legs: [{ destinationId: 'barcelona', days: 5 }],
        suitableThemes: ['sg', 'hs', 'gm', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['スペイン王道周遊', 'ガウディとプラド美術館', 'フラメンコと地中海'],
    },

    // ──────────── 中欧 ────────────
    {
        id: 'r-central-eu-3',
        name: '中欧3国（プラハ・ウィーン・ブダペスト）',
        legs: [
            { destinationId: 'prague', days: 2 },
            { destinationId: 'vienna', days: 2 },
        ],
        suitableThemes: ['sg', 'hs', 'wh', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [7, 8],
        popularity: 4,
        titleSuffixes: ['中欧古都巡り', 'プラハ＋ウィーン', 'ハプスブルクと黄金の都'],
    },
    {
        id: 'r-vienna-prague',
        name: 'ウィーン・プラハ',
        legs: [
            { destinationId: 'vienna', days: 3 },
            { destinationId: 'prague', days: 3 },
        ],
        suitableThemes: ['sg', 'hs', 'ar', 'wh'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 4,
        titleSuffixes: ['音楽の都と黄金の都', '中欧2大都市', 'ハプスブルク帝国を辿る'],
    },
    {
        id: 'r-paris-berlin-prague',
        name: 'パリ・ベルリン・プラハ',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'berlin', days: 2 },
            { destinationId: 'prague', days: 2 },
        ],
        suitableThemes: ['sg', 'hs', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [7, 8],
        popularity: 2,
        titleSuffixes: ['西欧から中欧へ', '3都市鉄道周遊'],
    },

    // ──────────── ドイツ ────────────
    {
        id: 'r-germany-classic',
        name: 'ドイツ（ベルリン中心）',
        legs: [{ destinationId: 'berlin', days: 4 }],
        suitableThemes: ['sg', 'hs', 'ar', 'wh'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 2,
        titleSuffixes: ['ベルリンの壁と博物館島', 'ドイツ近現代史'],
    },

    // ──────────── ベネルクス ────────────
    {
        id: 'r-amsterdam-solo',
        name: 'アムステルダム',
        legs: [{ destinationId: 'amsterdam', days: 4 }],
        suitableThemes: ['sg', 'ar', 'cp', 'wh'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5],
        popularity: 3,
        titleSuffixes: ['運河とゴッホ美術館', 'アンネの家と街歩き', 'チューリップ満開'],
    },

    // ──────────── トルコ・ギリシャ系 ────────────
    // 既存 destination が少ないため省略・将来追加
]
