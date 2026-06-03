import type { Route } from '../types'

// 国内 周遊（複数都市セット）
// 実態として「セットで行かれることが多い」組み合わせを丁寧に拾う。

export const ROUTES_DOMESTIC_TOUR: Route[] = [
    // 京都＋大阪（関西の2大都市）
    {
        id: 'r-kyoto-osaka',
        name: '京都・大阪',
        legs: [
            { destinationId: 'kyoto', days: 2 },
            { destinationId: 'osaka', days: 2 },
        ],
        suitableThemes: ['sg', 'gm', 'cp'],
        suitableOrigins: ['東京', '名古屋', '福岡', '札幌'],
        durations: [4, 5],
        popularity: 6,
        titleSuffixes: ['古都とミナミの王道', '京都＋USJ家族旅', '関西2大都市を巡る', '寺社とグルメ満喫'],
    },

    // 関西王道4都市（京都＋大阪＋奈良＋神戸）
    {
        id: 'r-kansai-classic',
        name: '関西王道（京都・大阪・奈良・神戸）',
        legs: [
            { destinationId: 'kyoto', days: 2 },
            { destinationId: 'osaka', days: 1 },
            { destinationId: 'nara', days: 1 },
            { destinationId: 'kobe', days: 1 },
        ],
        suitableThemes: ['sg', 'hs', 'wh', 'gm'],
        suitableOrigins: ['東京', '名古屋', '福岡', '札幌'],
        durations: [5, 6],
        popularity: 5,
        titleSuffixes: ['関西4都市満喫', '世界遺産と神戸夜景', '関西王道周遊', '日本史を辿る関西'],
    },

    // 京都＋奈良
    {
        id: 'r-kyoto-nara',
        name: '京都・奈良',
        legs: [
            { destinationId: 'kyoto', days: 2 },
            { destinationId: 'nara', days: 1 },
        ],
        suitableThemes: ['sg', 'hs', 'wh'],
        suitableOrigins: ['東京', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['古都2都市世界遺産', '京都＋大仏', '寺社の都を巡る'],
    },

    // 北海道 札幌＋小樽＋富良野
    {
        id: 'r-hokkaido-3city',
        name: '北海道（札幌・小樽・富良野）',
        legs: [
            { destinationId: 'sapporo-otaru', days: 2 },
            { destinationId: 'asahikawa-furano', days: 2 },
        ],
        suitableThemes: ['np', 'gm', 'sg'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [4, 5],
        popularity: 5,
        titleSuffixes: ['札幌・小樽・富良野3都市', '北海道王道周遊', 'ラベンダーと運河', '北海道グルメ満喫'],
    },

    // 北海道 道南周遊（札幌＋小樽＋函館）
    {
        id: 'r-hokkaido-south',
        name: '北海道道南（札幌・小樽・函館）',
        legs: [
            { destinationId: 'sapporo-otaru', days: 2 },
            { destinationId: 'hakodate', days: 2 },
        ],
        suitableThemes: ['sg', 'gm', 'ng'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [4, 5],
        popularity: 5,
        titleSuffixes: ['札幌＋函館2大都市', '北海道夜景巡り', '海鮮グルメ満喫'],
    },

    // 北海道 大周遊（札幌＋富良野＋知床）
    {
        id: 'r-hokkaido-grand',
        name: '北海道大周遊（札幌・富良野・知床）',
        legs: [
            { destinationId: 'sapporo-otaru', days: 1 },
            { destinationId: 'asahikawa-furano', days: 2 },
            { destinationId: 'shiretoko', days: 2 },
        ],
        suitableThemes: ['np', 'nt', 'wh'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [5, 6, 7],
        popularity: 3,
        titleSuffixes: ['北海道大周遊', '世界自然遺産と花畑', '北の絶景全制覇'],
    },

    // 東京＋鎌倉
    {
        id: 'r-tokyo-kamakura',
        name: '東京・鎌倉',
        legs: [
            { destinationId: 'tokyo', days: 2 },
            { destinationId: 'kamakura', days: 1 },
        ],
        suitableThemes: ['sg', 'hs', 'gm'],
        suitableOrigins: ['大阪', '名古屋', '福岡', '札幌'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['東京観光＋鎌倉日帰り', '都内と古都', '王道観光プラン'],
    },

    // 東京＋箱根
    {
        id: 'r-tokyo-hakone',
        name: '東京・箱根',
        legs: [
            { destinationId: 'tokyo', days: 2 },
            { destinationId: 'hakone', days: 1 },
        ],
        suitableThemes: ['sg', 'on', 'cp'],
        suitableOrigins: ['大阪', '名古屋', '福岡', '札幌'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['東京観光と温泉', '都内＋箱根の組み合わせ', '王道リフレッシュ'],
    },

    // 東京＋富士山
    {
        id: 'r-tokyo-fuji',
        name: '東京・富士山',
        legs: [
            { destinationId: 'tokyo', days: 2 },
            { destinationId: 'fuji-kawaguchi', days: 1 },
        ],
        suitableThemes: ['sg', 'np', 'fm'],
        suitableOrigins: ['大阪', '名古屋', '福岡', '札幌'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['東京＋富士絶景', '都心と富士山', '逆さ富士狙い'],
    },

    // 関東一周（東京＋鎌倉＋箱根＋富士）
    {
        id: 'r-kanto-grand',
        name: '関東一周（東京・箱根・富士・鎌倉）',
        legs: [
            { destinationId: 'tokyo', days: 2 },
            { destinationId: 'kamakura', days: 1 },
            { destinationId: 'hakone', days: 1 },
            { destinationId: 'fuji-kawaguchi', days: 1 },
        ],
        suitableThemes: ['sg', 'np', 'cp'],
        suitableOrigins: ['大阪', '名古屋', '福岡'],
        durations: [5, 6],
        popularity: 3,
        titleSuffixes: ['東京＋富士＋箱根大周遊', '関東ハイライト', '都心と絶景'],
    },

    // 中部周遊（名古屋＋高山＋金沢）
    {
        id: 'r-chubu-tour',
        name: '中部周遊（名古屋・高山・金沢）',
        legs: [
            { destinationId: 'nagoya', days: 1 },
            { destinationId: 'takayama-shirakawago', days: 2 },
            { destinationId: 'kanazawa', days: 1 },
        ],
        suitableThemes: ['sg', 'hs', 'wh'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [4, 5],
        popularity: 4,
        titleSuffixes: ['名古屋＋飛騨高山＋金沢', '世界遺産白川郷と古都', '中部3大都市'],
    },

    // 北陸（金沢＋高山）
    {
        id: 'r-hokuriku-pair',
        name: '北陸（金沢・高山）',
        legs: [
            { destinationId: 'kanazawa', days: 2 },
            { destinationId: 'takayama-shirakawago', days: 2 },
        ],
        suitableThemes: ['sg', 'hs', 'gm', 'wh'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['金沢と飛騨高山', '北陸古都めぐり', '兼六園と白川郷'],
    },

    // 中部・伊豆（東京から）
    {
        id: 'r-tokyo-izu',
        name: '東京・伊豆',
        legs: [
            { destinationId: 'tokyo', days: 2 },
            { destinationId: 'izu', days: 1 },
        ],
        suitableThemes: ['on', 'cp', 'sg'],
        suitableOrigins: ['大阪', '名古屋'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['東京観光＋熱海温泉', '都心と修善寺', '伊豆絶景＆都心'],
    },

    // 関西＋姫路（白鷺城を加える）
    {
        id: 'r-kansai-himeji',
        name: '京都・大阪・姫路',
        legs: [
            { destinationId: 'kyoto', days: 2 },
            { destinationId: 'osaka', days: 1 },
            { destinationId: 'kobe', days: 1 },
        ],
        suitableThemes: ['sg', 'hs', 'wh'],
        suitableOrigins: ['東京', '名古屋', '福岡'],
        durations: [4, 5],
        popularity: 3,
        titleSuffixes: ['関西3都市と姫路城', '世界遺産城めぐり'],
    },

    // 山陽周遊（広島＋宮島＋倉敷）
    {
        id: 'r-sanyo-tour',
        name: '山陽（広島・宮島・倉敷）',
        legs: [
            { destinationId: 'hiroshima-miyajima', days: 2 },
            { destinationId: 'kurashiki', days: 1 },
        ],
        suitableThemes: ['sg', 'hs', 'wh'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['山陽世界遺産巡り', '広島・倉敷美観', '原爆ドームと白壁の町'],
    },

    // 山陰（出雲＋松江）
    {
        id: 'r-sanin-tour',
        name: '山陰（出雲・松江・足立美術館）',
        legs: [
            { destinationId: 'izumo-matsue', days: 2 },
        ],
        suitableThemes: ['sg', 'hs', 'ar'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['縁結びと美の聖地', '出雲・松江と足立美術館'],
    },

    // 直島・倉敷・瀬戸内アート
    {
        id: 'r-setouchi-art',
        name: '瀬戸内アート（直島・倉敷）',
        legs: [
            { destinationId: 'naoshima', days: 2 },
            { destinationId: 'kurashiki', days: 1 },
        ],
        suitableThemes: ['ar', 'cp', 'sg'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['アート島と美観地区', '現代アート巡り', '瀬戸内国際芸術祭'],
    },

    // 九州北部（福岡＋別府＋由布院＋熊本）
    {
        id: 'r-kyushu-north',
        name: '九州北部（福岡・別府・由布院・熊本）',
        legs: [
            { destinationId: 'fukuoka', days: 1 },
            { destinationId: 'beppu-yufuin', days: 2 },
            { destinationId: 'kumamoto-aso', days: 1 },
        ],
        suitableThemes: ['gm', 'on', 'sg', 'np'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [4, 5],
        popularity: 5,
        titleSuffixes: ['博多＋温泉＋阿蘇', '九州北部王道周遊', 'グルメと湯けむり', '熊本城まで足を伸ばす'],
    },

    // 九州西部（福岡＋長崎＋熊本）
    {
        id: 'r-kyushu-west',
        name: '九州西部（福岡・長崎・熊本）',
        legs: [
            { destinationId: 'fukuoka', days: 1 },
            { destinationId: 'nagasaki', days: 2 },
            { destinationId: 'kumamoto-aso', days: 1 },
        ],
        suitableThemes: ['sg', 'hs', 'wh'],
        suitableOrigins: ['東京', '大阪', '名古屋', '札幌'],
        durations: [4, 5],
        popularity: 4,
        titleSuffixes: ['博多・長崎・熊本3都市', '九州の歴史と夜景', '世界遺産軍艦島とハウステンボス'],
    },

    // 九州一周
    {
        id: 'r-kyushu-grand',
        name: '九州一周（福岡・長崎・熊本・別府）',
        legs: [
            { destinationId: 'fukuoka', days: 1 },
            { destinationId: 'nagasaki', days: 1 },
            { destinationId: 'kumamoto-aso', days: 1 },
            { destinationId: 'beppu-yufuin', days: 2 },
        ],
        suitableThemes: ['sg', 'gm', 'on'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [5, 6],
        popularity: 3,
        titleSuffixes: ['九州大周遊', '九州ハイライト全部', '名所と温泉巡り'],
    },

    // 九州・福岡＋別府由布院
    {
        id: 'r-fukuoka-yufuin',
        name: '福岡・別府・由布院',
        legs: [
            { destinationId: 'fukuoka', days: 1 },
            { destinationId: 'beppu-yufuin', days: 2 },
        ],
        suitableThemes: ['gm', 'on', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['博多グルメと由布院温泉', '湯けむりカップル旅'],
    },

    // 四国一周
    {
        id: 'r-shikoku-grand',
        name: '四国一周（高知・直島・他）',
        legs: [
            { destinationId: 'kochi', days: 2 },
            { destinationId: 'naoshima', days: 2 },
        ],
        suitableThemes: ['sg', 'gm', 'ar'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [4, 5],
        popularity: 2,
        titleSuffixes: ['四国大周遊', '高知＋瀬戸内アート'],
    },

    // 東北南部（仙台＋蔵王/山形）
    {
        id: 'r-tohoku-south',
        name: '東北南部（仙台・山形・蔵王）',
        legs: [
            { destinationId: 'sendai', days: 2 },
            { destinationId: 'zao', days: 2 },
        ],
        suitableThemes: ['sg', 'on', 'gm'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['仙台＋山形蔵王', '伊達文化と銀山温泉', '東北グルメと温泉'],
    },

    // 東北北部（青森＋蔵王）
    {
        id: 'r-tohoku-north',
        name: '東北北部（青森・奥入瀬・十和田）',
        legs: [
            { destinationId: 'aomori', days: 3 },
        ],
        suitableThemes: ['sg', 'nt', 'np'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3, 4],
        popularity: 2,
        titleSuffixes: ['弘前＋奥入瀬＋ねぶた家', '青森自然と歴史'],
    },

    // 沖縄本島＋石垣島
    {
        id: 'r-okinawa-ishigaki',
        name: '沖縄本島・石垣島',
        legs: [
            { destinationId: 'okinawa-main', days: 2 },
            { destinationId: 'ishigaki', days: 2 },
        ],
        suitableThemes: ['bc', 'np', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [4, 5],
        popularity: 4,
        titleSuffixes: ['本島＋八重山ビーチ', '沖縄離島とコバルトブルー', '南国2島満喫'],
    },

    // 沖縄本島＋宮古島
    {
        id: 'r-okinawa-miyako',
        name: '沖縄本島・宮古島',
        legs: [
            { destinationId: 'okinawa-main', days: 2 },
            { destinationId: 'miyako', days: 2 },
        ],
        suitableThemes: ['bc', 'np', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [4, 5],
        popularity: 4,
        titleSuffixes: ['本島＋宮古ブルー', '沖縄2島ビーチ巡り'],
    },

    // 八重山周遊（石垣＋宮古）
    {
        id: 'r-yaeyama-tour',
        name: '沖縄離島巡り（石垣・宮古）',
        legs: [
            { destinationId: 'ishigaki', days: 3 },
            { destinationId: 'miyako', days: 2 },
        ],
        suitableThemes: ['bc', 'np', 'cp'],
        suitableOrigins: ['東京', '大阪'],
        durations: [5, 6],
        popularity: 3,
        titleSuffixes: ['八重山と宮古群島', '沖縄離島大周遊', '南国2大絶景島'],
    },

    // 軽井沢＋草津
    {
        id: 'r-karuizawa-kusatsu',
        name: '軽井沢・草津温泉',
        legs: [
            { destinationId: 'karuizawa', days: 1 },
            { destinationId: 'kusatsu', days: 1 },
        ],
        suitableThemes: ['on', 'cp', 'sg'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [3],
        popularity: 3,
        titleSuffixes: ['軽井沢＋草津湯畑', '高原リゾートと温泉', 'カップル名湯旅'],
    },

    // 日光＋鬼怒川
    {
        id: 'r-nikko-kinugawa',
        name: '日光・鬼怒川',
        legs: [
            { destinationId: 'nikko', days: 2 },
        ],
        suitableThemes: ['sg', 'hs', 'wh', 'on'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['東照宮と鬼怒川温泉', '世界遺産巡りと湯けむり'],
    },
]
