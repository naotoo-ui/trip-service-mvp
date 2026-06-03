import type { DestinationEntry } from '../types'

// 国内 ニッチエリア 第2弾
// 伊勢神宮・志摩、熊野古道、高野山、吉野山、鳥取砂丘、萩・津和野、
// 黒部立山アルペンルート、八ヶ岳・蓼科、横須賀・三浦、浜松・浜名湖、
// 善光寺・長野、小豆島、淡路島

export const DOMESTIC_NICHE_2: DestinationEntry[] = [
    // ──────────── 伊勢神宮・志摩 ────────────
    {
        id: 'ise-shima', name: '伊勢神宮・志摩', country: '日本', region: 'chubu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['sg', 'hs', 'gm', 'np', 'cp', 'on'],
        areas: [
            { id: 'ise', name: '伊勢' },
            { id: 'toba', name: '鳥羽' },
            { id: 'shima', name: '志摩・賢島' },
        ],
        spots: [
            { n: '伊勢神宮・内宮（皇大神宮）', d: '日本人の心のふるさと', t: '観光', dur: 120, addr: '伊勢市宇治館町', area: 'ise', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '伊勢神宮・外宮（豊受大神宮）', d: '内宮参拝前に必ず立ち寄る', t: '観光', dur: 75, addr: '伊勢市豊川町', area: 'ise', th: ['sg', 'hs'], pop: 5 },
            { n: 'おかげ横丁', d: '門前町の食べ歩きとお土産', t: '観光', dur: 120, addr: '伊勢市宇治中之切町', area: 'ise', th: ['sg', 'gm', 'sp'], pop: 5 },
            { n: '夫婦岩（二見興玉神社）', d: '注連縄で結ばれた縁結びの夫婦岩', t: '観光', dur: 60, addr: '伊勢市二見町', area: 'ise', th: ['sg', 'cp', 'hs', 'np'], pop: 5 },
            { n: '鳥羽水族館', d: '日本最大級の水族館・ジュゴン', t: '観光', dur: 150, addr: '鳥羽市鳥羽', area: 'toba', th: ['fm', 'sg'], pop: 4 },
            { n: 'ミキモト真珠島', d: '真珠養殖発祥地・海女実演', t: '観光', dur: 90, addr: '鳥羽市鳥羽', area: 'toba', th: ['sg', 'hs', 'cp'], pop: 4 },
            { n: '志摩観光ホテル', d: 'サミット開催の名門ホテル', t: '観光', dur: 60, addr: '志摩市阿児町', area: 'shima', th: ['sg', 'cp'], pop: 3 },
            { n: '横山展望台', d: '英虞湾のリアス絶景', t: '観光', dur: 60, addr: '志摩市阿児町', area: 'shima', th: ['np', 'cp'], pop: 5 },
            { n: '志摩スペイン村', d: '家族向けテーマパーク', t: '観光', dur: 240, addr: '志摩市磯部町', area: 'shima', th: ['fm', 'cp', 'sg'], pop: 4 },
            { n: '伊勢うどん 山口屋', d: '伊勢名物の独特な太麺', t: 'グルメ', dur: 45, addr: '伊勢市宮後', area: 'ise', th: ['gm', 'hs'], pop: 4 },
            { n: '赤福本店', d: '伊勢名物・餡と餅', t: 'グルメ', dur: 30, addr: '伊勢市宇治中之切町', area: 'ise', th: ['gm', 'hs'], pop: 5 },
            { n: '伊勢志摩の海女小屋体験', d: '海女文化体験', t: 'グルメ', dur: 90, addr: '鳥羽市', area: 'toba', th: ['gm', 'ex', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '志摩観光ホテル ザ クラシック', addr: '志摩市阿児町', area: 'shima', price: 58000 },
            { n: '鳥羽国際ホテル', addr: '鳥羽市鳥羽', area: 'toba', price: 38000 },
            { n: '伊勢神泉', addr: '伊勢市岩渕', area: 'ise', price: 32000 },
        ],
    },

    // ──────────── 熊野古道・那智 ────────────
    {
        id: 'kumano-kodo', name: '熊野古道', country: '日本', region: 'kansai',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['sg', 'hs', 'wh', 'np', 'nt', 'on'],
        areas: [
            { id: 'hongu', name: '本宮' },
            { id: 'nachi', name: '那智勝浦' },
            { id: 'shingu', name: '新宮' },
        ],
        spots: [
            { n: '熊野本宮大社', d: '熊野三山の中心・大斎原の大鳥居', t: '観光', dur: 90, addr: '田辺市本宮町', area: 'hongu', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '那智の滝・飛瀧神社', d: '日本一の落差133mの霊滝', t: '観光', dur: 75, addr: '東牟婁郡那智勝浦町', area: 'nachi', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: '熊野那智大社', d: '世界遺産・朱の社殿', t: '観光', dur: 60, addr: '東牟婁郡那智勝浦町', area: 'nachi', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '青岸渡寺と三重塔', d: '那智の滝を背景にした三重塔', t: '観光', dur: 60, addr: '東牟婁郡那智勝浦町', area: 'nachi', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '熊野速玉大社', d: '熊野三山の一つ', t: '観光', dur: 60, addr: '新宮市新宮', area: 'shingu', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '湯の峰温泉・つぼ湯', d: '世界遺産の温泉', t: '観光', dur: 90, addr: '田辺市本宮町', area: 'hongu', th: ['on', 'hs', 'wh'], pop: 5 },
            { n: '川湯温泉・仙人風呂', d: '川の中の冬季限定大露天', t: '観光', dur: 90, addr: '田辺市本宮町', area: 'hongu', th: ['on', 'np', 'ex'], pop: 4 },
            { n: '大門坂', d: '苔むす石段の熊野古道', t: '観光', dur: 90, addr: '東牟婁郡那智勝浦町', area: 'nachi', th: ['sg', 'hs', 'wh', 'nt'], pop: 5 },
            { n: '橋杭岩', d: '太平洋に並ぶ奇岩の絶景', t: '観光', dur: 45, addr: '東牟婁郡串本町', area: 'nachi', th: ['np', 'sg'], pop: 3 },
            { n: '潮岬', d: '本州最南端の灯台', t: '観光', dur: 60, addr: '東牟婁郡串本町', area: 'nachi', th: ['np', 'sg'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテル浦島', addr: '東牟婁郡那智勝浦町', area: 'nachi', price: 28000 },
            { n: '湯の峰温泉 あづまや', addr: '田辺市本宮町', area: 'hongu', price: 32000 },
            { n: '川湯温泉 富士屋', addr: '田辺市本宮町', area: 'hongu', price: 22000 },
        ],
    },

    // ──────────── 高野山 ────────────
    {
        id: 'koyasan', name: '高野山', country: '日本', region: 'kansai',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['sg', 'hs', 'wh'],
        areas: [
            { id: 'koyasan-c', name: '高野山中心' },
        ],
        spots: [
            { n: '金剛峯寺', d: '真言宗総本山・1200年の歴史', t: '観光', dur: 90, addr: '伊都郡高野町', area: 'koyasan-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '奥之院', d: '弘法大師御廟・墓所巡り', t: '観光', dur: 120, addr: '伊都郡高野町', area: 'koyasan-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '壇上伽藍', d: '真言密教の聖地・根本大塔', t: '観光', dur: 75, addr: '伊都郡高野町', area: 'koyasan-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '大門', d: '高野山の総門', t: '観光', dur: 30, addr: '伊都郡高野町', area: 'koyasan-c', th: ['sg', 'hs'], pop: 3 },
            { n: '宿坊体験（精進料理・写経）', d: '寺院に泊まる修行体験', t: '観光', dur: 180, addr: '伊都郡高野町', area: 'koyasan-c', th: ['ex', 'hs', 'sg'], pop: 5, bk: true },
            { n: '霊宝館', d: '高野山の国宝・重文', t: '観光', dur: 90, addr: '伊都郡高野町', area: 'koyasan-c', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: '徳川家霊台', d: '徳川家の霊廟', t: '観光', dur: 30, addr: '伊都郡高野町', area: 'koyasan-c', th: ['sg', 'hs'], pop: 2 },
        ],
        hotels: [
            { n: '宿坊 福智院', addr: '伊都郡高野町', area: 'koyasan-c', price: 22000 },
            { n: '宿坊 恵光院', addr: '伊都郡高野町', area: 'koyasan-c', price: 24000 },
        ],
    },

    // ──────────── 吉野山 ────────────
    {
        id: 'yoshino', name: '吉野山', country: '日本', region: 'kansai',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['np', 'hs', 'wh', 'sg'],
        areas: [
            { id: 'yoshino-c', name: '吉野山' },
        ],
        spots: [
            { n: '吉野山桜（千本桜）', d: '日本一の桜の名所・世界遺産', t: '観光', dur: 240, addr: '吉野郡吉野町', area: 'yoshino-c', th: ['np', 'sg', 'wh'], pop: 5 },
            { n: '金峯山寺・蔵王堂', d: '修験道の聖地・大伽藍', t: '観光', dur: 90, addr: '吉野郡吉野町', area: 'yoshino-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '吉水神社', d: '一目千本桜の絶景展望', t: '観光', dur: 60, addr: '吉野郡吉野町', area: 'yoshino-c', th: ['sg', 'np', 'hs', 'wh'], pop: 4 },
            { n: '如意輪寺', d: '南朝の悲史を物語る', t: '観光', dur: 60, addr: '吉野郡吉野町', area: 'yoshino-c', th: ['sg', 'hs'], pop: 3 },
            { n: '吉野葛きしべ', d: '吉野葛の老舗', t: 'グルメ', dur: 45, addr: '吉野郡吉野町', area: 'yoshino-c', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: '湯元宝の家', addr: '吉野郡吉野町', area: 'yoshino-c', price: 28000 },
            { n: '吉野荘 湯川屋', addr: '吉野郡吉野町', area: 'yoshino-c', price: 24000 },
        ],
    },

    // ──────────── 鳥取砂丘・三朝温泉 ────────────
    {
        id: 'tottori', name: '鳥取砂丘・三朝', country: '日本', region: 'chugoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'on', 'ex', 'sg'],
        areas: [
            { id: 'tottori-c', name: '鳥取砂丘周辺' },
            { id: 'misasa', name: '三朝温泉' },
        ],
        spots: [
            { n: '鳥取砂丘', d: '日本最大の砂丘・ラクダ乗り', t: '観光', dur: 120, addr: '鳥取市福部町', area: 'tottori-c', th: ['np', 'ex'], pop: 5 },
            { n: '砂の美術館', d: '世界の砂彫刻アート', t: '観光', dur: 90, addr: '鳥取市福部町', area: 'tottori-c', th: ['sg', 'ar', 'np'], pop: 4 },
            { n: '浦富海岸', d: '山陰海岸ジオパーク', t: '観光', dur: 120, addr: '岩美郡岩美町', area: 'tottori-c', th: ['np', 'sg'], pop: 4 },
            { n: '三朝温泉街', d: '世界屈指のラジウム泉', t: '観光', dur: 120, addr: '東伯郡三朝町', area: 'misasa', th: ['on', 'sg'], pop: 4 },
            { n: '三徳山三佛寺・投入堂', d: '断崖の国宝・修行の聖地', t: '観光', dur: 240, addr: '東伯郡三朝町', area: 'misasa', th: ['sg', 'hs', 'wh', 'ex'], pop: 5 },
            { n: 'はわい温泉・東郷湖', d: '湖畔の温泉郷', t: '観光', dur: 90, addr: '東伯郡湯梨浜町', area: 'misasa', th: ['on'], pop: 3 },
            { n: '境港・水木しげるロード', d: '妖怪ストリート', t: '観光', dur: 90, addr: '境港市本町', area: 'tottori-c', th: ['sg', 'fm'], pop: 4 },
            { n: '鳥取和牛料理', d: '希少な鳥取和牛', t: 'グルメ', dur: 90, addr: '鳥取市', area: 'tottori-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '三朝館', addr: '東伯郡三朝町', area: 'misasa', price: 24000 },
            { n: '依山楼岩崎', addr: '東伯郡三朝町', area: 'misasa', price: 38000 },
            { n: '鳥取グリーンホテルモーリス', addr: '鳥取市永楽温泉町', area: 'tottori-c', price: 12000 },
        ],
    },

    // ──────────── 萩・津和野 ────────────
    {
        id: 'hagi-tsuwano', name: '萩・津和野', country: '日本', region: 'chugoku',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 25,
        themes: ['sg', 'hs', 'wh'],
        areas: [
            { id: 'hagi', name: '萩' },
            { id: 'tsuwano', name: '津和野' },
        ],
        spots: [
            { n: '萩城下町', d: '明治維新の偉人を生んだ町', t: '観光', dur: 150, addr: '萩市堀内', area: 'hagi', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '松陰神社・松下村塾', d: '吉田松陰ゆかりの世界遺産', t: '観光', dur: 75, addr: '萩市椿東', area: 'hagi', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '萩反射炉', d: '明治日本の産業革命遺産', t: '観光', dur: 45, addr: '萩市椿東', area: 'hagi', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: '萩焼・萩八景遊覧船', d: '伝統工芸と川下り', t: '観光', dur: 90, addr: '萩市', area: 'hagi', th: ['sg', 'ar', 'cp'], pop: 3 },
            { n: '津和野・本町通り', d: '山陰の小京都', t: '観光', dur: 120, addr: '鹿足郡津和野町', area: 'tsuwano', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '太皷谷稲成神社', d: '日本五大稲荷の朱鳥居', t: '観光', dur: 60, addr: '鹿足郡津和野町', area: 'tsuwano', th: ['sg', 'hs'], pop: 4 },
            { n: '森鴎外旧居', d: '津和野出身の文豪', t: '観光', dur: 45, addr: '鹿足郡津和野町', area: 'tsuwano', th: ['sg', 'hs'], pop: 3 },
            { n: '萩本陣温泉', d: '城下町近くの温泉', t: '観光', dur: 90, addr: '萩市椿東', area: 'hagi', th: ['on'], pop: 3 },
        ],
        hotels: [
            { n: '萩本陣', addr: '萩市椿東', area: 'hagi', price: 28000 },
            { n: '萩八景観光ホテル', addr: '萩市堀内', area: 'hagi', price: 22000 },
            { n: '津和野温泉 旅館 よしのや', addr: '鹿足郡津和野町', area: 'tsuwano', price: 18000 },
        ],
    },

    // ──────────── 黒部立山アルペンルート ────────────
    {
        id: 'kurobe-tateyama', name: '黒部立山アルペンルート', country: '日本', region: 'hokuriku',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 45,
        themes: ['np', 'nt', 'ex'],
        areas: [
            { id: 'murodo', name: '室堂' },
            { id: 'kurobe', name: '黒部ダム' },
        ],
        spots: [
            { n: '室堂・雪の大谷', d: '20mを超える雪の壁', t: '観光', dur: 120, addr: '中新川郡立山町', area: 'murodo', th: ['np', 'sg'], pop: 5 },
            { n: 'みくりが池', d: 'エメラルドグリーンの火口湖', t: '観光', dur: 60, addr: '中新川郡立山町', area: 'murodo', th: ['np', 'nt'], pop: 5 },
            { n: '黒部ダム・観光放水', d: '日本最大級のアーチダム', t: '観光', dur: 90, addr: '中新川郡立山町', area: 'kurobe', th: ['sg', 'np', 'ex'], pop: 5 },
            { n: '立山ロープウェイ', d: '空中遊覧の絶景', t: '観光', dur: 60, addr: '中新川郡立山町', area: 'murodo', th: ['np', 'cp'], pop: 4 },
            { n: '大観峰展望台', d: '黒部峡谷を一望', t: '観光', dur: 45, addr: '中新川郡立山町', area: 'kurobe', th: ['np'], pop: 4 },
            { n: '宇奈月温泉', d: '黒部峡谷の入口温泉郷', t: '観光', dur: 120, addr: '黒部市宇奈月温泉', area: 'kurobe', th: ['on'], pop: 4 },
            { n: '黒部峡谷トロッコ電車', d: '渓谷を抜けるトロッコ', t: '観光', dur: 240, addr: '黒部市宇奈月町', area: 'kurobe', th: ['ex', 'np'], pop: 5 },
        ],
        hotels: [
            { n: 'ホテル立山', addr: '中新川郡立山町', area: 'murodo', price: 38000 },
            { n: '宇奈月温泉 延楽', addr: '黒部市宇奈月温泉', area: 'kurobe', price: 35000 },
            { n: '黒部観光ホテル', addr: '黒部市宇奈月温泉', area: 'kurobe', price: 22000 },
        ],
    },

    // ──────────── 善光寺・長野 ────────────
    {
        id: 'zenkoji-nagano', name: '善光寺・長野', country: '日本', region: 'kanto',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'hs', 'on', 'gm'],
        areas: [
            { id: 'nagano-c', name: '長野市内・善光寺' },
            { id: 'obuse', name: '小布施' },
            { id: 'yudanaka', name: '湯田中渋温泉' },
        ],
        spots: [
            { n: '善光寺', d: '日本最古の絶対秘仏の本尊', t: '観光', dur: 120, addr: '長野市元善町', area: 'nagano-c', th: ['sg', 'hs'], pop: 5 },
            { n: '善光寺仲見世通り', d: '門前町の食べ歩き', t: '観光', dur: 90, addr: '長野市', area: 'nagano-c', th: ['sg', 'gm', 'sp'], pop: 4 },
            { n: '小布施町（栗と北斎）', d: '葛飾北斎の晩年と栗菓子', t: '観光', dur: 120, addr: '上高井郡小布施町', area: 'obuse', th: ['sg', 'ar', 'gm', 'cp'], pop: 4 },
            { n: '北斎館', d: '北斎晩年作品の美術館', t: '観光', dur: 75, addr: '上高井郡小布施町', area: 'obuse', th: ['ar', 'hs'], pop: 4 },
            { n: '地獄谷野猿公苑', d: '温泉に入る野生猿', t: '観光', dur: 120, addr: '下高井郡山ノ内町', area: 'yudanaka', th: ['np', 'sg', 'ex'], pop: 5 },
            { n: '渋温泉九湯巡り', d: '湯田中渋の温泉巡礼', t: '観光', dur: 180, addr: '下高井郡山ノ内町', area: 'yudanaka', th: ['on', 'cp'], pop: 4 },
            { n: '戸隠神社・奥社参道', d: '杉並木の修験道', t: '観光', dur: 120, addr: '長野市戸隠', area: 'nagano-c', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '長野そば名店', d: '信州そばの本場', t: 'グルメ', dur: 60, addr: '長野市', area: 'nagano-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ホテル国際21', addr: '長野市県町', area: 'nagano-c', price: 18000 },
            { n: 'よろづや', addr: '下高井郡山ノ内町', area: 'yudanaka', price: 32000 },
            { n: '桝一客殿', addr: '上高井郡小布施町', area: 'obuse', price: 38000 },
        ],
    },

    // ──────────── 横須賀・三浦半島 ────────────
    {
        id: 'miura', name: '横須賀・三浦半島', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['sg', 'gm', 'np', 'cp', 'hs'],
        areas: [
            { id: 'yokosuka', name: '横須賀' },
            { id: 'kannonzaki', name: '観音崎' },
            { id: 'misaki', name: '三崎' },
        ],
        spots: [
            { n: '猿島', d: '東京湾唯一の自然島・要塞跡', t: '観光', dur: 240, addr: '横須賀市猿島', area: 'yokosuka', th: ['sg', 'hs', 'ex', 'np'], pop: 4 },
            { n: '記念艦三笠', d: '日露戦争の戦艦三笠', t: '観光', dur: 90, addr: '横須賀市稲岡町', area: 'yokosuka', th: ['sg', 'hs'], pop: 3 },
            { n: '観音崎灯台', d: '東京湾の入口の灯台', t: '観光', dur: 75, addr: '横須賀市鴨居', area: 'kannonzaki', th: ['np', 'sg'], pop: 3 },
            { n: '城ヶ島・馬の背洞門', d: '波が削った奇岩', t: '観光', dur: 120, addr: '三浦市三崎町', area: 'misaki', th: ['np', 'sg'], pop: 4 },
            { n: '三崎港・マグロ', d: '日本有数の遠洋マグロ漁港', t: 'グルメ', dur: 90, addr: '三浦市三崎', area: 'misaki', th: ['gm', 'sg'], pop: 5 },
            { n: '油壷', d: '相模湾を望む湾', t: '観光', dur: 60, addr: '三浦市三崎町', area: 'misaki', th: ['np', 'cp'], pop: 3 },
            { n: 'ヴェルニー公園', d: 'バラ咲く海軍の街', t: '観光', dur: 60, addr: '横須賀市汐入町', area: 'yokosuka', th: ['sg', 'cp', 'np'], pop: 3 },
            { n: 'よこすか海軍カレー', d: 'ご当地グルメ・海上自衛隊', t: 'グルメ', dur: 60, addr: '横須賀市', area: 'yokosuka', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'ホテルマホロバ・マインズ三浦', addr: '三浦市南下浦町', area: 'misaki', price: 22000 },
            { n: 'ザ・キャナル', addr: '横須賀市本町', area: 'yokosuka', price: 18000 },
        ],
    },

    // ──────────── 浜松・浜名湖 ────────────
    {
        id: 'hamamatsu', name: '浜松・浜名湖', country: '日本', region: 'chubu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['gm', 'fm', 'sg', 'np'],
        areas: [
            { id: 'hamamatsu-c', name: '浜松市内' },
            { id: 'hamanako', name: '浜名湖' },
        ],
        spots: [
            { n: '浜松城', d: '徳川家康ゆかりの出世城', t: '観光', dur: 75, addr: '浜松市中区元城町', area: 'hamamatsu-c', th: ['sg', 'hs'], pop: 4 },
            { n: '舘山寺温泉', d: '浜名湖畔の温泉郷', t: '観光', dur: 120, addr: '浜松市西区舘山寺', area: 'hamanako', th: ['on', 'cp', 'np'], pop: 4 },
            { n: '浜名湖オルゴールミュージアム', d: '舘山寺ロープウェイの上', t: '観光', dur: 60, addr: '浜松市西区舘山寺', area: 'hamanako', th: ['cp', 'ar', 'fm'], pop: 3 },
            { n: 'うなぎパイファクトリー', d: '春華堂の見学工場', t: '観光', dur: 60, addr: '浜松市西区大久保町', area: 'hamamatsu-c', th: ['fm', 'sg'], pop: 4 },
            { n: '弁天島', d: '浜名湖の夕日の名所', t: '観光', dur: 60, addr: '浜松市西区舞阪町', area: 'hamanako', th: ['np', 'cp'], pop: 4 },
            { n: 'はままつフラワーパーク', d: '世界一美しいフラワーパーク', t: '観光', dur: 120, addr: '浜松市西区舘山寺', area: 'hamanako', th: ['np', 'cp', 'fm'], pop: 4 },
            { n: 'うなぎ 八百徳', d: '浜松名物うなぎの老舗', t: 'グルメ', dur: 75, addr: '浜松市中区', area: 'hamamatsu-c', th: ['gm', 'hs'], pop: 5 },
            { n: '浜松餃子', d: '浜松名物・キャベツ餃子', t: 'グルメ', dur: 60, addr: '浜松市中区', area: 'hamamatsu-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: '浜名湖ロイヤルホテル', addr: '浜松市西区雄踏町', area: 'hamanako', price: 18000 },
            { n: '舘山寺サゴーロイヤルホテル', addr: '浜松市西区舘山寺', area: 'hamanako', price: 22000 },
        ],
    },

    // ──────────── 淡路島 ────────────
    {
        id: 'awaji', name: '淡路島', country: '日本', region: 'kansai',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['np', 'fm', 'cp', 'gm', 'on'],
        areas: [
            { id: 'iwaya', name: '岩屋・北部' },
            { id: 'sumoto', name: '洲本・南部' },
        ],
        spots: [
            { n: '大鳴門橋・うずしお観潮船', d: '世界最大の渦潮', t: '観光', dur: 90, addr: '南あわじ市福良', area: 'sumoto', th: ['np', 'sg', 'fm'], pop: 5 },
            { n: '淡路ハイウェイオアシス', d: '明石海峡大橋を望むサービスエリア', t: '観光', dur: 60, addr: '淡路市岩屋', area: 'iwaya', th: ['sg', 'np'], pop: 4 },
            { n: '淡路夢舞台', d: '安藤忠雄設計の建築群', t: '観光', dur: 90, addr: '淡路市夢舞台', area: 'iwaya', th: ['ar', 'cp', 'np'], pop: 4 },
            { n: '伊弉諾神宮', d: '日本最古の神社・国生み伝説', t: '観光', dur: 60, addr: '淡路市多賀', area: 'iwaya', th: ['sg', 'hs'], pop: 4 },
            { n: 'のじまスコーラ', d: 'おしゃれショップとカフェ', t: '観光', dur: 90, addr: '淡路市野島蟇浦', area: 'iwaya', th: ['cp', 'gm', 'sp'], pop: 4 },
            { n: 'おのころ島神社', d: '縁結びの神社・赤い大鳥居', t: '観光', dur: 45, addr: '南あわじ市榎列', area: 'sumoto', th: ['sg', 'cp', 'hs'], pop: 3 },
            { n: '淡路島牛丼・玉ねぎ料理', d: '淡路ブランド食材', t: 'グルメ', dur: 75, addr: '淡路島各地', area: 'iwaya', th: ['gm'], pop: 4 },
            { n: 'うずの丘大鳴門橋記念館', d: 'たまねぎオブジェと展望', t: '観光', dur: 60, addr: '南あわじ市福良', area: 'sumoto', th: ['sg', 'fm', 'np'], pop: 3 },
        ],
        hotels: [
            { n: 'グランドニッコー淡路', addr: '淡路市夢舞台', area: 'iwaya', price: 38000 },
            { n: '淡路夢泉景', addr: '洲本市小路谷', area: 'sumoto', price: 28000 },
            { n: 'ホテルニューアワジ', addr: '洲本市小路谷', area: 'sumoto', price: 32000 },
        ],
    },

    // ──────────── 小豆島 ────────────
    {
        id: 'shodoshima', name: '小豆島', country: '日本', region: 'shikoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['np', 'cp', 'gm', 'ar'],
        areas: [
            { id: 'shodoshima-c', name: '小豆島' },
        ],
        spots: [
            { n: 'エンジェルロード', d: '干潮時に現れる砂の道', t: '観光', dur: 60, addr: '小豆郡土庄町', area: 'shodoshima-c', th: ['np', 'cp'], pop: 5 },
            { n: '寒霞渓', d: '日本三大渓谷美のロープウェイ', t: '観光', dur: 120, addr: '小豆郡小豆島町', area: 'shodoshima-c', th: ['np', 'nt'], pop: 5 },
            { n: 'オリーブ公園', d: 'ギリシャ風車と魔女宅の世界観', t: '観光', dur: 90, addr: '小豆郡小豆島町', area: 'shodoshima-c', th: ['cp', 'np', 'sg'], pop: 5 },
            { n: '二十四の瞳映画村', d: '昭和初期の小学校再現', t: '観光', dur: 90, addr: '小豆郡小豆島町', area: 'shodoshima-c', th: ['sg', 'hs', 'fm'], pop: 4 },
            { n: '醤の郷・マルキン醤油記念館', d: '醤油の島の歴史', t: '観光', dur: 60, addr: '小豆郡小豆島町', area: 'shodoshima-c', th: ['sg', 'gm', 'hs'], pop: 3 },
            { n: 'マルキン手延べそうめん', d: '島名物の素麺', t: 'グルメ', dur: 60, addr: '小豆郡小豆島町', area: 'shodoshima-c', th: ['gm', 'hs'], pop: 4 },
            { n: 'まめまめ', d: 'オリーブをテーマにした名店', t: 'グルメ', dur: 75, addr: '小豆郡小豆島町', area: 'shodoshima-c', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'ベイリゾートホテル小豆島', addr: '小豆郡小豆島町', area: 'shodoshima-c', price: 22000 },
            { n: 'リゾートホテルオリビアン小豆島', addr: '小豆郡土庄町', area: 'shodoshima-c', price: 26000 },
        ],
    },
]
