import type { DestinationEntry } from '../types'

// 国内 ニッチエリア
// 角館・銀山温泉・能登半島・高千穂・城崎・天橋立・八幡平・上高地等

export const DOMESTIC_NICHE: DestinationEntry[] = [
    // ──────────── 角館・乳頭温泉 ────────────
    {
        id: 'kakunodate', name: '角館・乳頭温泉', country: '日本', region: 'tohoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['sg', 'hs', 'on', 'np'],
        areas: [
            { id: 'kakunodate-c', name: '角館武家屋敷' },
            { id: 'nyuto', name: '乳頭温泉郷' },
        ],
        spots: [
            { n: '角館武家屋敷通り', d: 'みちのくの小京都・桜の名所', t: '観光', dur: 90, addr: '仙北市角館町', area: 'kakunodate-c', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '青柳家', d: '角館武家屋敷の代表', t: '観光', dur: 60, addr: '仙北市角館町', area: 'kakunodate-c', th: ['sg', 'hs'], pop: 4 },
            { n: '石黒家', d: '現存する角館最古の武家屋敷', t: '観光', dur: 45, addr: '仙北市角館町', area: 'kakunodate-c', th: ['sg', 'hs'], pop: 3 },
            { n: '田沢湖', d: '日本一深い湖と辰子姫像', t: '観光', dur: 90, addr: '仙北市田沢湖', area: 'nyuto', th: ['np', 'sg'], pop: 4 },
            { n: '乳頭温泉郷・鶴の湯', d: '東北秘湯の代表・茅葺き屋根', t: '観光', dur: 120, addr: '仙北市田沢湖', area: 'nyuto', th: ['on', 'np', 'hs'], pop: 5 },
            { n: '乳頭温泉・妙乃湯', d: '渓流沿いの混浴露天風呂', t: '観光', dur: 90, addr: '仙北市田沢湖', area: 'nyuto', th: ['on', 'cp'], pop: 4 },
            { n: '抱返り渓谷', d: '青い淵と紅葉の名所', t: '観光', dur: 90, addr: '仙北市', area: 'kakunodate-c', th: ['np', 'nt'], pop: 3 },
            { n: '稲庭うどん 佐藤養助', d: '秋田名物の伝統うどん', t: 'グルメ', dur: 60, addr: '仙北市角館町', area: 'kakunodate-c', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: '鶴の湯温泉', addr: '仙北市田沢湖', area: 'nyuto', price: 28000 },
            { n: '妙乃湯', addr: '仙北市田沢湖', area: 'nyuto', price: 32000 },
            { n: 'プラザホテル山麓荘', addr: '仙北市田沢湖', area: 'nyuto', price: 18000 },
        ],
    },

    // ──────────── 銀山温泉 ────────────
    {
        id: 'ginzan', name: '銀山温泉', country: '日本', region: 'tohoku',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 10,
        themes: ['on', 'cp', 'hs', 'np'],
        areas: [
            { id: 'ginzan-c', name: '銀山温泉街' },
        ],
        spots: [
            { n: '銀山温泉街', d: '大正レトロな木造旅館が並ぶ', t: '観光', dur: 90, addr: '尾花沢市銀山新畑', area: 'ginzan-c', th: ['sg', 'on', 'hs', 'cp', 'np'], pop: 5 },
            { n: '白銀の滝', d: '銀山温泉のシンボル', t: '観光', dur: 30, addr: '尾花沢市銀山新畑', area: 'ginzan-c', th: ['np'], pop: 4 },
            { n: '能登屋旅館', d: '千と千尋のモデルとも言われる老舗', t: '観光', dur: 30, addr: '尾花沢市銀山新畑', area: 'ginzan-c', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '昭和館', d: 'レトロな看板と街並み', t: '観光', dur: 30, addr: '尾花沢市銀山新畑', area: 'ginzan-c', th: ['sg', 'hs'], pop: 3 },
            { n: '足湯・しろがね湯', d: '誰でも入れる足湯', t: '観光', dur: 30, addr: '尾花沢市銀山新畑', area: 'ginzan-c', th: ['on', 'cp'], pop: 4 },
            { n: '銀山温泉名物カレーパン', d: '温泉街の名物', t: 'グルメ', dur: 30, addr: '尾花沢市銀山新畑', area: 'ginzan-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '能登屋旅館', addr: '尾花沢市銀山新畑', area: 'ginzan-c', price: 38000 },
            { n: '古勢起屋別館', addr: '尾花沢市銀山新畑', area: 'ginzan-c', price: 32000 },
            { n: '藤屋', addr: '尾花沢市銀山新畑', area: 'ginzan-c', price: 42000 },
        ],
    },

    // ──────────── 能登半島 ────────────
    {
        id: 'noto', name: '能登半島', country: '日本', region: 'hokuriku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['np', 'sg', 'on', 'gm'],
        areas: [
            { id: 'wajima', name: '輪島' },
            { id: 'noto-mid', name: '能登中部' },
        ],
        spots: [
            { n: '輪島朝市', d: '日本三大朝市のひとつ', t: '観光', dur: 90, addr: '輪島市河井町', area: 'wajima', th: ['sg', 'gm'], pop: 5, morningOk: true },
            { n: '白米千枚田', d: '日本海を望む棚田の絶景', t: '観光', dur: 90, addr: '輪島市白米町', area: 'wajima', th: ['np', 'sg'], pop: 5 },
            { n: '見附島（軍艦島）', d: '能登のシンボル奇岩', t: '観光', dur: 45, addr: '珠洲市宝立町', area: 'noto-mid', th: ['np', 'sg'], pop: 4 },
            { n: '禄剛崎', d: '能登半島最先端の灯台', t: '観光', dur: 60, addr: '珠洲市狼煙', area: 'noto-mid', th: ['np', 'sg'], pop: 3 },
            { n: '気多大社', d: '縁結びの能登一の宮', t: '観光', dur: 60, addr: '羽咋市寺家町', area: 'noto-mid', th: ['sg', 'hs', 'cp'], pop: 3 },
            { n: '千里浜なぎさドライブウェイ', d: '日本唯一の砂浜ドライブロード', t: '観光', dur: 60, addr: '羽咋市千里浜町', area: 'noto-mid', th: ['np', 'ex'], pop: 5 },
            { n: '輪島塗会館', d: '輪島塗の歴史と展示', t: '観光', dur: 60, addr: '輪島市河井町', area: 'wajima', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'のと里山街道（能登地酒）', d: '能登の地酒と海鮮', t: 'グルメ', dur: 90, addr: '輪島市', area: 'wajima', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: '輪島温泉八汐', addr: '輪島市鳳至町', area: 'wajima', price: 28000 },
            { n: '能登 渚亭たなか屋', addr: '七尾市和倉町', area: 'noto-mid', price: 38000 },
            { n: '加賀屋（和倉温泉）', addr: '七尾市和倉町', area: 'noto-mid', price: 58000 },
        ],
    },

    // ──────────── 高千穂峡 ────────────
    {
        id: 'takachiho', name: '高千穂峡', country: '日本', region: 'kyushu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['np', 'hs', 'nt', 'cp'],
        areas: [
            { id: 'takachiho-c', name: '高千穂峡周辺' },
        ],
        spots: [
            { n: '高千穂峡・真名井の滝', d: '神話の里・峡谷ボートで絶景', t: '観光', dur: 120, addr: '西臼杵郡高千穂町', area: 'takachiho-c', th: ['np', 'cp'], pop: 5 },
            { n: '高千穂神社', d: '神話の里・夜神楽の発祥地', t: '観光', dur: 60, addr: '西臼杵郡高千穂町', area: 'takachiho-c', th: ['sg', 'hs'], pop: 5 },
            { n: '天岩戸神社', d: '天照大神の隠れた洞窟', t: '観光', dur: 75, addr: '西臼杵郡高千穂町', area: 'takachiho-c', th: ['sg', 'hs'], pop: 4 },
            { n: '天安河原', d: '神々が集った神話の地', t: '観光', dur: 60, addr: '西臼杵郡高千穂町', area: 'takachiho-c', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '高千穂神社・夜神楽', d: '毎晩奉納される伝統神楽', t: '観光', dur: 60, addr: '西臼杵郡高千穂町', area: 'takachiho-c', th: ['sg', 'hs'], pop: 4, eveningOk: true },
            { n: '国見ヶ丘', d: '雲海の絶景スポット', t: '観光', dur: 60, addr: '西臼杵郡高千穂町', area: 'takachiho-c', th: ['np'], pop: 4 },
            { n: '神楽宿 そば', d: '高千穂名物のそば', t: 'グルメ', dur: 60, addr: '西臼杵郡高千穂町', area: 'takachiho-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '高千穂神楽宿', addr: '西臼杵郡高千穂町', area: 'takachiho-c', price: 22000 },
            { n: '高千穂温泉', addr: '西臼杵郡高千穂町', area: 'takachiho-c', price: 18000 },
        ],
    },

    // ──────────── 城崎温泉・天橋立 ────────────
    {
        id: 'kinosaki-amanohashidate', name: '城崎温泉・天橋立', country: '日本', region: 'kansai',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['on', 'sg', 'cp', 'np'],
        areas: [
            { id: 'kinosaki', name: '城崎温泉' },
            { id: 'amano', name: '天橋立' },
            { id: 'ine', name: '伊根の舟屋' },
        ],
        spots: [
            { n: '城崎温泉街・外湯巡り', d: '7つの外湯巡りが定番', t: '観光', dur: 180, addr: '豊岡市城崎町', area: 'kinosaki', th: ['on', 'sg', 'cp', 'hs'], pop: 5 },
            { n: '城崎ロープウェイ・温泉寺', d: '城崎を見下ろす絶景展望', t: '観光', dur: 90, addr: '豊岡市城崎町', area: 'kinosaki', th: ['sg', 'np', 'hs'], pop: 3 },
            { n: '天橋立', d: '日本三景・松並木の砂州', t: '観光', dur: 120, addr: '宮津市文珠', area: 'amano', th: ['np', 'sg', 'cp'], pop: 5 },
            { n: '天橋立ビューランド', d: '股のぞきで有名な展望', t: '観光', dur: 90, addr: '宮津市文珠', area: 'amano', th: ['np', 'cp', 'sg'], pop: 5 },
            { n: '伊根の舟屋', d: '海に浮かぶ伝統集落', t: '観光', dur: 90, addr: '与謝郡伊根町', area: 'ine', th: ['sg', 'hs', 'np', 'cp'], pop: 5 },
            { n: '舟屋遊覧船', d: '伊根湾を舟で巡るクルーズ', t: '観光', dur: 60, addr: '与謝郡伊根町', area: 'ine', th: ['ex', 'sg', 'cp'], pop: 4 },
            { n: '智恩寺・文殊堂', d: '日本三大文殊', t: '観光', dur: 60, addr: '宮津市文珠', area: 'amano', th: ['sg', 'hs'], pop: 3 },
            { n: '城崎カニ料理', d: '冬の松葉ガニ', t: 'グルメ', dur: 120, addr: '豊岡市城崎町', area: 'kinosaki', th: ['gm', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: '西村屋本館', addr: '豊岡市城崎町', area: 'kinosaki', price: 42000 },
            { n: '三木屋', addr: '豊岡市城崎町', area: 'kinosaki', price: 28000 },
            { n: '天橋立ホテル', addr: '宮津市文珠', area: 'amano', price: 24000 },
        ],
    },

    // ──────────── 上高地・乗鞍 ────────────
    {
        id: 'kamikochi', name: '上高地・乗鞍', country: '日本', region: 'chubu',
        trip_style: 'rental_car', intra_mode: 'バス', intra_gap_min: 40,
        themes: ['nt', 'np', 'ex'],
        areas: [
            { id: 'kamikochi-c', name: '上高地' },
            { id: 'norikura', name: '乗鞍' },
        ],
        spots: [
            { n: '河童橋', d: '上高地のシンボル吊り橋', t: '観光', dur: 60, addr: '松本市安曇上高地', area: 'kamikochi-c', th: ['np', 'sg'], pop: 5 },
            { n: '大正池', d: '焼岳と立ち枯れの木の絶景', t: '観光', dur: 75, addr: '松本市安曇上高地', area: 'kamikochi-c', th: ['np', 'cp'], pop: 5 },
            { n: '明神池', d: '穂高神社奥宮の神秘の池', t: '観光', dur: 90, addr: '松本市安曇上高地', area: 'kamikochi-c', th: ['np', 'nt'], pop: 4 },
            { n: '上高地ハイキング（明神コース）', d: '初心者向けトレッキング', t: '観光', dur: 240, addr: '松本市安曇上高地', area: 'kamikochi-c', th: ['nt', 'ex', 'np'], pop: 4 },
            { n: '乗鞍畳平', d: '日本最高所のバス到達点', t: '観光', dur: 120, addr: '高山市丹生川町', area: 'norikura', th: ['np', 'nt'], pop: 4 },
            { n: '乗鞍高原温泉', d: '高原のリフレッシュ温泉', t: '観光', dur: 120, addr: '松本市安曇乗鞍', area: 'norikura', th: ['on', 'np'], pop: 3 },
            { n: '上高地ランチ・五千尺ホテル', d: 'カレーが名物', t: 'グルメ', dur: 60, addr: '松本市安曇上高地', area: 'kamikochi-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '上高地帝国ホテル', addr: '松本市安曇上高地', area: 'kamikochi-c', price: 58000 },
            { n: '上高地ルミエスタホテル', addr: '松本市安曇上高地', area: 'kamikochi-c', price: 42000 },
            { n: '乗鞍高原温泉', addr: '松本市安曇乗鞍', area: 'norikura', price: 22000 },
        ],
    },

    // ──────────── 諏訪・茅野 ────────────
    {
        id: 'suwa', name: '諏訪・茅野', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['sg', 'hs', 'on', 'np'],
        areas: [
            { id: 'suwa-c', name: '諏訪湖周辺' },
            { id: 'chino', name: '茅野・八ヶ岳' },
        ],
        spots: [
            { n: '諏訪大社・上社本宮', d: '7年に1度の御柱祭で有名', t: '観光', dur: 75, addr: '諏訪市中洲', area: 'suwa-c', th: ['sg', 'hs'], pop: 5 },
            { n: '諏訪湖', d: '長野県最大の湖と御神渡り', t: '観光', dur: 60, addr: '諏訪市', area: 'suwa-c', th: ['np', 'sg'], pop: 4 },
            { n: '高島城', d: '諏訪藩主の城跡', t: '観光', dur: 45, addr: '諏訪市高島', area: 'suwa-c', th: ['sg', 'hs'], pop: 3 },
            { n: '上諏訪温泉', d: '諏訪湖畔の温泉街', t: '観光', dur: 120, addr: '諏訪市湯の脇', area: 'suwa-c', th: ['on', 'sg'], pop: 3 },
            { n: '八ヶ岳・蓼科', d: '高原リゾートと天文台', t: '観光', dur: 180, addr: '茅野市北山', area: 'chino', th: ['np', 'nt', 'cp'], pop: 4 },
            { n: 'ハーモ美術館', d: '諏訪湖畔の素朴派美術館', t: '観光', dur: 75, addr: '諏訪郡下諏訪町', area: 'suwa-c', th: ['ar', 'cp'], pop: 2 },
            { n: '諏訪の地酒・諏訪五蔵', d: '日本酒の酒蔵巡り', t: 'グルメ', dur: 120, addr: '諏訪市', area: 'suwa-c', th: ['gm', 'hs', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '上諏訪温泉 浜の湯', addr: '諏訪市湯の脇', area: 'suwa-c', price: 26000 },
            { n: 'スパ＆リゾート蓼科', addr: '茅野市北山', area: 'chino', price: 28000 },
        ],
    },
]
