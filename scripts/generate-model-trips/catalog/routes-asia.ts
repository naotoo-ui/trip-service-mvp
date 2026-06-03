import type { Route } from '../types'

// アジア圏ルート
// 単独都市 + 複数都市周遊を実態に合わせて配分

export const ROUTES_ASIA: Route[] = [
    // ──────────── 韓国 ────────────
    {
        id: 'r-seoul-classic',
        name: 'ソウル',
        legs: [{ destinationId: 'seoul', days: 3 }],
        suitableThemes: ['sg', 'gm', 'sp', 'cp'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [3, 4],
        popularity: 6,
        titleSuffixes: ['明洞と仁寺洞', '韓国グルメと買い物', '景福宮と韓屋', 'カフェ巡りと夜景'],
    },
    {
        id: 'r-busan-classic',
        name: '釜山',
        legs: [{ destinationId: 'busan', days: 3 }],
        suitableThemes: ['gm', 'sg', 'cp', 'bc'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['海雲台と甘川文化村', '釜山グルメと海', 'チャガルチ市場とBIFF'],
    },
    {
        id: 'r-seoul-busan',
        name: 'ソウル・釜山',
        legs: [
            { destinationId: 'seoul', days: 3 },
            { destinationId: 'busan', days: 2 },
        ],
        suitableThemes: ['sg', 'gm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [5, 6],
        popularity: 5,
        titleSuffixes: ['韓国2大都市', 'ソウル＋釜山周遊', 'KTX で南北縦断'],
    },
    {
        id: 'r-jeju-classic',
        name: '済州島',
        legs: [{ destinationId: 'jeju', days: 3 }],
        suitableThemes: ['np', 'cp', 'bc'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['城山日出峰と海岸ドライブ', '済州島自然満喫', '韓国のハワイで絶景'],
    },

    // ──────────── 台湾 ────────────
    {
        id: 'r-taipei-classic',
        name: '台北',
        legs: [{ destinationId: 'taipei', days: 3 }],
        suitableThemes: ['sg', 'gm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 6,
        titleSuffixes: ['九份と台北101', '夜市と小籠包', '故宮博物院と古都', '街歩きとマッサージ'],
    },
    {
        id: 'r-kaohsiung-classic',
        name: '高雄',
        legs: [{ destinationId: 'kaohsiung', days: 2 }],
        suitableThemes: ['sg', 'gm', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3, 4],
        popularity: 2,
        titleSuffixes: ['蓮池潭と六合夜市', '南台湾の絶景'],
    },
    {
        id: 'r-taiwan-grand',
        name: '台湾一周（台北・台中・台南・高雄）',
        legs: [
            { destinationId: 'taipei', days: 2 },
            { destinationId: 'kaohsiung', days: 2 },
        ],
        suitableThemes: ['sg', 'gm'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [5, 6],
        popularity: 3,
        titleSuffixes: ['台湾縦断一周', '北から南へ', '高鉄で巡る台湾'],
    },

    // ──────────── 香港 ────────────
    {
        id: 'r-hongkong-classic',
        name: '香港',
        legs: [{ destinationId: 'hongkong', days: 3 }],
        suitableThemes: ['sg', 'gm', 'sp', 'ng'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['ヴィクトリアピーク夜景', '飲茶と買い物', '香港ディズニーと夜景', '九龍と中環'],
    },

    // ──────────── タイ ────────────
    {
        id: 'r-bangkok-classic',
        name: 'バンコク',
        legs: [{ destinationId: 'bangkok', days: 3 }],
        suitableThemes: ['sg', 'gm', 'sp', 'hs'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4, 5],
        popularity: 5,
        titleSuffixes: ['王宮と寺院巡り', '屋台グルメとマッサージ', 'ワット・ポーとアジアティーク', 'バンコク満喫'],
    },

    // ──────────── シンガポール ────────────
    {
        id: 'r-singapore-classic',
        name: 'シンガポール',
        legs: [{ destinationId: 'singapore', days: 3 }],
        suitableThemes: ['sg', 'gm', 'fm', 'cp', 'ng'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4, 5],
        popularity: 5,
        titleSuffixes: ['マリーナベイ・サンズと夜景', 'USS と動物園で家族旅', 'ガーデンズ・バイ・ザ・ベイ', 'シンガポール定番観光'],
    },

    // ──────────── ベトナム ────────────
    {
        id: 'r-hanoi-halong',
        name: 'ハノイ＋ハロン湾',
        legs: [{ destinationId: 'hanoi', days: 4 }],
        suitableThemes: ['sg', 'np', 'wh', 'gm'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [4, 5],
        popularity: 4,
        titleSuffixes: ['世界遺産ハロン湾クルーズ', '旧市街とハロン湾', '北ベトナム王道', 'ベトナム文化を辿る'],
    },
    {
        id: 'r-hochiminh-classic',
        name: 'ホーチミン',
        legs: [{ destinationId: 'hochiminh', days: 3 }],
        suitableThemes: ['sg', 'gm', 'hs'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['ベンタイン市場とフォー', '南ベトナム王道', 'メコンデルタとクチトンネル'],
    },

    // ──────────── インドネシア ────────────
    {
        id: 'r-bali-classic',
        name: 'バリ島',
        legs: [{ destinationId: 'bali', days: 4 }],
        suitableThemes: ['bc', 'cp', 'on', 'np'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5, 6],
        popularity: 5,
        titleSuffixes: ['ウブドのライステラスとビーチ', 'バリリゾート満喫', 'スパとビーチでカップル旅', '神々の島で文化体験'],
    },

    // ──────────── 中国 ────────────
    {
        id: 'r-shanghai-classic',
        name: '上海',
        legs: [{ destinationId: 'shanghai', days: 3 }],
        suitableThemes: ['sg', 'gm', 'ng', 'sp'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['外灘と豫園', '上海摩天楼と歴史地区'],
    },
    {
        id: 'r-beijing-classic',
        name: '北京',
        legs: [{ destinationId: 'beijing', days: 3 }],
        suitableThemes: ['sg', 'hs', 'wh', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5],
        popularity: 3,
        titleSuffixes: ['万里の長城と紫禁城', '北京歴史散策', '王朝の都を巡る'],
    },
    {
        id: 'r-china-3city',
        name: '中国三都（北京・上海・西安）',
        legs: [
            { destinationId: 'beijing', days: 2 },
            { destinationId: 'shanghai', days: 2 },
        ],
        suitableThemes: ['sg', 'hs', 'wh'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6, 7],
        popularity: 2,
        titleSuffixes: ['中国2大都市', '万里の長城と外灘'],
    },

    // ──────────── マレーシア ────────────
    {
        id: 'r-kl-classic',
        name: 'クアラルンプール',
        legs: [{ destinationId: 'kl', days: 3 }],
        suitableThemes: ['sg', 'gm', 'sp', 'ng'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['ペトロナス・ツインタワー夜景', 'バトゥ洞窟と市場', 'クアラルンプール定番'],
    },

    // ──────────── マニラ ────────────
    {
        id: 'r-manila-classic',
        name: 'マニラ・セブ',
        legs: [{ destinationId: 'manila', days: 4 }],
        suitableThemes: ['sg', 'bc', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5],
        popularity: 2,
        titleSuffixes: ['イントラムロスとセブ島', 'フィリピン定番'],
    },

    // ──────────── アンコールワット ────────────
    {
        id: 'r-angkor-classic',
        name: 'アンコールワット',
        legs: [{ destinationId: 'angkor', days: 4 }],
        suitableThemes: ['sg', 'hs', 'wh', 'ar'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5],
        popularity: 4,
        titleSuffixes: ['世界遺産アンコール遺跡群', '密林の古代遺跡', 'クメール文明を辿る', '神秘の遺跡巡り'],
    },
    {
        id: 'r-bangkok-angkor',
        name: 'バンコク・アンコールワット',
        legs: [
            { destinationId: 'bangkok', days: 3 },
            { destinationId: 'angkor', days: 3 },
        ],
        suitableThemes: ['sg', 'hs', 'wh', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['タイ＋カンボジア', 'バンコクと世界遺産', '東南アジア2大遺跡'],
    },

    // ──────────── ベトナム中部（ダナン・ホイアン） ────────────
    {
        id: 'r-danang-hoian',
        name: 'ダナン・ホイアン',
        legs: [{ destinationId: 'danang-hoian', days: 4 }],
        suitableThemes: ['sg', 'wh', 'bc', 'cp', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [4, 5],
        popularity: 4,
        titleSuffixes: ['ランタンの古都とビーチ', 'ホイアン＋バナヒルズ', 'ダナンビーチリゾート', '世界遺産＋ビーチ'],
    },
    {
        id: 'r-vietnam-vertical',
        name: 'ベトナム縦断（ハノイ・ダナン・ホイアン）',
        legs: [
            { destinationId: 'hanoi', days: 3 },
            { destinationId: 'danang-hoian', days: 3 },
        ],
        suitableThemes: ['sg', 'hs', 'wh', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['ベトナム縦断', '北部と中部', 'ハロン湾とランタンの古都'],
    },

    // ──────────── チェンマイ ────────────
    {
        id: 'r-bangkok-chiangmai',
        name: 'バンコク・チェンマイ',
        legs: [
            { destinationId: 'bangkok', days: 3 },
            { destinationId: 'chiangmai', days: 3 },
        ],
        suitableThemes: ['sg', 'gm', 'hs', 'ex'],
        suitableOrigins: ['東京', '大阪'],
        durations: [6, 7],
        popularity: 3,
        titleSuffixes: ['タイ南北周遊', 'バンコクと北部古都', '象使い体験も'],
    },
]
