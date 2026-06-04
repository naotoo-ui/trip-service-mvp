import type { DestinationEntry } from '../types'

// 国内 ニッチエリア 第3弾
// 那須鬼怒川、会津・大内宿、秩父川越、滋賀（彦根・近江八幡）、姫路、高松、徳島祖谷、
// 下関、嬉野唐津、宮崎日南、奄美大島、秋田男鹿、富山五箇山、湯沢、四万温泉

export const DOMESTIC_NICHE_3: DestinationEntry[] = [
    // ──────────── 那須・鬼怒川（栃木） ────────────
    {
        id: 'nasu-kinugawa', name: '那須・鬼怒川', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['on', 'fm', 'np', 'cp'],
        areas: [
            { id: 'nasu', name: '那須高原' },
            { id: 'kinugawa', name: '鬼怒川温泉' },
        ],
        spots: [
            { n: '那須どうぶつ王国', d: '雨でも遊べる動物テーマパーク', t: '観光', dur: 240, addr: '那須郡那須町', area: 'nasu', th: ['fm', 'sg'], pop: 5 },
            { n: '那須サファリパーク', d: '車で巡るサファリ', t: '観光', dur: 180, addr: '那須郡那須町', area: 'nasu', th: ['fm', 'np'], pop: 4 },
            { n: '那須テディベア・ミュージアム', d: '世界のテディベア', t: '観光', dur: 75, addr: '那須郡那須町', area: 'nasu', th: ['cp', 'fm'], pop: 3 },
            { n: '那須ステンドグラス美術館', d: 'ヨーロッパ風美術館', t: '観光', dur: 60, addr: '那須郡那須町', area: 'nasu', th: ['ar', 'cp'], pop: 3 },
            { n: '南ヶ丘牧場', d: '入場無料の体験型牧場', t: '観光', dur: 120, addr: '那須郡那須町', area: 'nasu', th: ['fm', 'gm'], pop: 4 },
            { n: '殺生石・賽の河原', d: '那須温泉の名所', t: '観光', dur: 60, addr: '那須郡那須町', area: 'nasu', th: ['sg', 'hs', 'np'], pop: 3 },
            { n: '鬼怒川温泉ロープウェイ', d: '渓谷の絶景', t: '観光', dur: 90, addr: '日光市鬼怒川温泉滝', area: 'kinugawa', th: ['np', 'on'], pop: 3 },
            { n: '東武ワールドスクウェア', d: '世界遺産のミニチュア', t: '観光', dur: 180, addr: '日光市鬼怒川温泉大原', area: 'kinugawa', th: ['fm', 'sg'], pop: 4 },
            { n: '日光江戸村', d: '江戸時代体験テーマパーク', t: '観光', dur: 240, addr: '日光市柄倉', area: 'kinugawa', th: ['fm', 'sg', 'ex'], pop: 4 },
        ],
        hotels: [
            { n: '鬼怒川金谷ホテル', addr: '日光市鬼怒川温泉大原', area: 'kinugawa', price: 38000 },
            { n: '那須温泉 山楽', addr: '那須郡那須町', area: 'nasu', price: 32000 },
            { n: '鬼怒川パークホテルズ', addr: '日光市鬼怒川温泉滝', area: 'kinugawa', price: 22000 },
        ],
    },

    // ──────────── 会津・大内宿（福島） ────────────
    {
        id: 'aizu', name: '会津若松・大内宿', country: '日本', region: 'tohoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['sg', 'hs', 'on'],
        areas: [
            { id: 'aizu-c', name: '会津若松' },
            { id: 'ouchi', name: '大内宿' },
            { id: 'goshikinuma', name: '五色沼' },
        ],
        spots: [
            { n: '鶴ヶ城（会津若松城）', d: '白虎隊と戊辰戦争の城', t: '観光', dur: 120, addr: '会津若松市追手町', area: 'aizu-c', th: ['sg', 'hs'], pop: 5 },
            { n: '白虎隊記念館・飯盛山', d: '白虎隊自刃の地', t: '観光', dur: 90, addr: '会津若松市一箕町', area: 'aizu-c', th: ['sg', 'hs'], pop: 4 },
            { n: '会津武家屋敷', d: '会津藩家老の屋敷再現', t: '観光', dur: 90, addr: '会津若松市東山町', area: 'aizu-c', th: ['sg', 'hs'], pop: 3 },
            { n: '七日町通り', d: 'レトロな大正浪漫の通り', t: '観光', dur: 60, addr: '会津若松市', area: 'aizu-c', th: ['sg', 'gm', 'cp'], pop: 3 },
            { n: '大内宿', d: '江戸期の宿場町・茅葺き屋根', t: '観光', dur: 150, addr: '南会津郡下郷町', area: 'ouchi', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '塔のへつり', d: '渓谷の奇岩絶景', t: '観光', dur: 60, addr: '南会津郡下郷町', area: 'ouchi', th: ['np'], pop: 3 },
            { n: '五色沼湖沼群', d: '色とりどりの神秘の湖', t: '観光', dur: 180, addr: '耶麻郡北塩原村', area: 'goshikinuma', th: ['np', 'nt'], pop: 5 },
            { n: '磐梯山', d: '会津のシンボル', t: '観光', dur: 120, addr: '耶麻郡', area: 'goshikinuma', th: ['np', 'nt'], pop: 3 },
            { n: '会津ラーメン・喜多方', d: '日本三大ラーメン', t: 'グルメ', dur: 60, addr: '喜多方市', area: 'aizu-c', th: ['gm'], pop: 4 },
            { n: '大内宿・ネギそば', d: '一本ねぎで食べる名物そば', t: 'グルメ', dur: 45, addr: '南会津郡下郷町', area: 'ouchi', th: ['gm', 'hs'], pop: 5 },
        ],
        hotels: [
            { n: '東山温泉 御宿 東鳳', addr: '会津若松市東山町', area: 'aizu-c', price: 26000 },
            { n: '裏磐梯ロイヤルホテル', addr: '耶麻郡北塩原村', area: 'goshikinuma', price: 22000 },
            { n: '会津芦ノ牧温泉 大川荘', addr: '会津若松市大戸町', area: 'aizu-c', price: 32000 },
        ],
    },

    // ──────────── 秩父・川越・長瀞（埼玉） ────────────
    {
        id: 'chichibu-kawagoe', name: '秩父・川越・長瀞', country: '日本', region: 'kanto',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'hs', 'np', 'on'],
        areas: [
            { id: 'chichibu', name: '秩父' },
            { id: 'kawagoe', name: '川越' },
            { id: 'nagatoro', name: '長瀞' },
        ],
        spots: [
            { n: '秩父神社', d: '秩父三社の中心', t: '観光', dur: 60, addr: '秩父市番場町', area: 'chichibu', th: ['sg', 'hs'], pop: 4 },
            { n: '三峯神社', d: '関東屈指のパワースポット', t: '観光', dur: 90, addr: '秩父市三峰', area: 'chichibu', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '羊山公園（芝桜の丘）', d: '春の絶景・芝桜', t: '観光', dur: 90, addr: '秩父市大宮', area: 'chichibu', th: ['np', 'sg'], pop: 5 },
            { n: '川越・蔵造りの街並み', d: '小江戸と呼ばれる町並み', t: '観光', dur: 150, addr: '川越市幸町', area: 'kawagoe', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '時の鐘', d: '川越のシンボル', t: '観光', dur: 30, addr: '川越市幸町', area: 'kawagoe', th: ['sg', 'hs'], pop: 5 },
            { n: '菓子屋横丁', d: '懐かしの駄菓子屋通り', t: '観光', dur: 60, addr: '川越市元町', area: 'kawagoe', th: ['sg', 'gm', 'cp'], pop: 4 },
            { n: '氷川神社', d: '川越の縁結びの神社', t: '観光', dur: 60, addr: '川越市宮下町', area: 'kawagoe', th: ['sg', 'cp', 'hs'], pop: 4 },
            { n: '長瀞ライン下り', d: '荒川渓谷の急流舟下り', t: '観光', dur: 75, addr: '秩父郡長瀞町', area: 'nagatoro', th: ['ex', 'np'], pop: 5 },
            { n: '岩畳', d: '長瀞の岩盤天然記念物', t: '観光', dur: 60, addr: '秩父郡長瀞町', area: 'nagatoro', th: ['np', 'nt'], pop: 4 },
            { n: '川越うなぎ', d: '小江戸の名物', t: 'グルメ', dur: 75, addr: '川越市', area: 'kawagoe', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: '秩父湯本武甲温泉', addr: '秩父市', area: 'chichibu', price: 18000 },
            { n: '川越プリンスホテル', addr: '川越市新富町', area: 'kawagoe', price: 22000 },
            { n: '長生館', addr: '秩父郡長瀞町', area: 'nagatoro', price: 25000 },
        ],
    },

    // ──────────── 滋賀（彦根・近江八幡・琵琶湖） ────────────
    {
        id: 'shiga', name: '滋賀（彦根・近江八幡）', country: '日本', region: 'kansai',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['sg', 'hs', 'np', 'gm'],
        areas: [
            { id: 'hikone', name: '彦根' },
            { id: 'oumi-hachiman', name: '近江八幡' },
            { id: 'hieizan', name: '比叡山' },
        ],
        spots: [
            { n: '彦根城', d: '国宝5城のひとつ・現存天守', t: '観光', dur: 150, addr: '彦根市金亀町', area: 'hikone', th: ['sg', 'hs'], pop: 5 },
            { n: '玄宮園', d: '彦根城の大名庭園', t: '観光', dur: 60, addr: '彦根市金亀町', area: 'hikone', th: ['sg', 'np'], pop: 3 },
            { n: '夢京橋キャッスルロード', d: '彦根城下町の商店街', t: '観光', dur: 75, addr: '彦根市本町', area: 'hikone', th: ['sg', 'gm', 'sp'], pop: 4 },
            { n: '近江八幡・八幡堀', d: '水郷と古い町並み', t: '観光', dur: 90, addr: '近江八幡市', area: 'oumi-hachiman', th: ['sg', 'hs', 'np', 'cp'], pop: 5 },
            { n: '八幡山ロープウェイ', d: '琵琶湖と街並みを一望', t: '観光', dur: 60, addr: '近江八幡市宮内町', area: 'oumi-hachiman', th: ['np', 'sg'], pop: 3 },
            { n: 'ラコリーナ近江八幡', d: '草屋根の建築・たねや本店', t: '観光', dur: 120, addr: '近江八幡市北之庄', area: 'oumi-hachiman', th: ['ar', 'gm', 'cp'], pop: 5 },
            { n: '比叡山延暦寺', d: '世界遺産・天台宗総本山', t: '観光', dur: 180, addr: '大津市坂本本町', area: 'hieizan', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '近江牛ステーキ', d: '日本三大和牛', t: 'グルメ', dur: 90, addr: '近江八幡市', area: 'oumi-hachiman', th: ['gm'], pop: 5 },
            { n: '琵琶湖クルーズ・ミシガン', d: '日本最大の湖クルーズ', t: '観光', dur: 90, addr: '大津市', area: 'hieizan', th: ['sg', 'np', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: '彦根キャッスル リゾート＆スパ', addr: '彦根市', area: 'hikone', price: 22000 },
            { n: 'ラコリーナ ホテル（近江八幡）', addr: '近江八幡市', area: 'oumi-hachiman', price: 28000 },
            { n: 'びわ湖大津プリンスホテル', addr: '大津市', area: 'hieizan', price: 24000 },
        ],
    },

    // ──────────── 姫路 ────────────
    {
        id: 'himeji', name: '姫路', country: '日本', region: 'kansai',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'hs', 'wh'],
        areas: [
            { id: 'himeji-c', name: '姫路市内' },
        ],
        spots: [
            { n: '姫路城（白鷺城）', d: '世界遺産・国宝・現存天守', t: '観光', dur: 180, addr: '姫路市本町', area: 'himeji-c', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: '好古園', d: '姫路城の隣の大名庭園', t: '観光', dur: 90, addr: '姫路市本町', area: 'himeji-c', th: ['sg', 'np'], pop: 3 },
            { n: '書写山圓教寺', d: '映画「ラストサムライ」ロケ地', t: '観光', dur: 180, addr: '姫路市書写', area: 'himeji-c', th: ['sg', 'hs'], pop: 4 },
            { n: '太陽公園・白鳥城', d: '世界の建築をミニチュア', t: '観光', dur: 120, addr: '姫路市打越', area: 'himeji-c', th: ['fm', 'sg'], pop: 3 },
            { n: '姫路セントラルパーク', d: 'サファリ＋遊園地', t: '観光', dur: 240, addr: '姫路市豊富町', area: 'himeji-c', th: ['fm'], pop: 3 },
            { n: '姫路おでん', d: 'ご当地グルメ・生姜醤油', t: 'グルメ', dur: 60, addr: '姫路市', area: 'himeji-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテルモントレ姫路', addr: '姫路市駅前町', area: 'himeji-c', price: 16000 },
            { n: '姫路キヤッスルホテル', addr: '姫路市総社本町', area: 'himeji-c', price: 14000 },
        ],
    },

    // ──────────── 高松・琴平 ────────────
    {
        id: 'takamatsu', name: '高松・琴平', country: '日本', region: 'shikoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['sg', 'gm', 'hs', 'np'],
        areas: [
            { id: 'takamatsu-c', name: '高松市内' },
            { id: 'kotohira', name: '琴平' },
        ],
        spots: [
            { n: '栗林公園', d: '日本三名園に劣らない名勝', t: '観光', dur: 120, addr: '高松市栗林町', area: 'takamatsu-c', th: ['sg', 'np'], pop: 5 },
            { n: '高松城（玉藻公園）', d: '日本三大水城のひとつ', t: '観光', dur: 75, addr: '高松市玉藻町', area: 'takamatsu-c', th: ['sg', 'hs'], pop: 3 },
            { n: '金刀比羅宮', d: '785段の石段の参拝', t: '観光', dur: 180, addr: '仲多度郡琴平町', area: 'kotohira', th: ['sg', 'hs', 'ex'], pop: 5 },
            { n: '父母ヶ浜', d: 'ウユニ塩湖風の絶景ビーチ', t: '観光', dur: 90, addr: '三豊市仁尾町', area: 'takamatsu-c', th: ['np', 'cp'], pop: 5 },
            { n: '屋島', d: '源平合戦の古戦場・絶景台地', t: '観光', dur: 120, addr: '高松市屋島', area: 'takamatsu-c', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '小豆島フェリー', d: '小豆島へのアクセス', t: '観光', dur: 60, addr: '高松港', area: 'takamatsu-c', th: ['ex'], pop: 3 },
            { n: '讃岐うどん 山越', d: 'うどん巡礼の聖地', t: 'グルメ', dur: 60, addr: '綾歌郡綾川町', area: 'takamatsu-c', th: ['gm', 'hs'], pop: 5 },
            { n: '骨付鳥 一鶴', d: '高松名物B級グルメ', t: 'グルメ', dur: 60, addr: '高松市', area: 'takamatsu-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'JRホテルクレメント高松', addr: '高松市浜ノ町', area: 'takamatsu-c', price: 18000 },
            { n: 'ことひら温泉 琴参閣', addr: '仲多度郡琴平町', area: 'kotohira', price: 28000 },
        ],
    },

    // ──────────── 徳島・祖谷渓 ────────────
    {
        id: 'iya', name: '徳島・祖谷渓', country: '日本', region: 'shikoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['np', 'on', 'nt', 'ex'],
        areas: [
            { id: 'tokushima-c', name: '徳島市内' },
            { id: 'iya-c', name: '祖谷渓' },
        ],
        spots: [
            { n: '鳴門の渦潮', d: '世界三大潮流の一つ', t: '観光', dur: 90, addr: '鳴門市鳴門町', area: 'tokushima-c', th: ['np', 'sg', 'fm'], pop: 5 },
            { n: '大塚国際美術館', d: '陶板複製の世界の名画', t: '観光', dur: 240, addr: '鳴門市鳴門町', area: 'tokushima-c', th: ['ar', 'sg'], pop: 5 },
            { n: '阿波おどり会館', d: '徳島の伝統踊り体験', t: '観光', dur: 90, addr: '徳島市新町橋', area: 'tokushima-c', th: ['sg', 'hs', 'ex'], pop: 4 },
            { n: 'かずら橋', d: '祖谷のシラクズで編んだ吊り橋', t: '観光', dur: 60, addr: '三好市西祖谷山村', area: 'iya-c', th: ['np', 'ex'], pop: 5 },
            { n: '小便小僧（祖谷峡）', d: '断崖の上の有名な像', t: '観光', dur: 30, addr: '三好市池田町', area: 'iya-c', th: ['sg', 'np'], pop: 3 },
            { n: '大歩危・小歩危', d: '吉野川の渓谷美', t: '観光', dur: 90, addr: '三好市山城町', area: 'iya-c', th: ['np', 'ex'], pop: 4 },
            { n: '祖谷温泉', d: '断崖のケーブルカー温泉', t: '観光', dur: 120, addr: '三好市池田町', area: 'iya-c', th: ['on', 'np'], pop: 4 },
        ],
        hotels: [
            { n: '和の宿 ホテル祖谷温泉', addr: '三好市池田町', area: 'iya-c', price: 28000 },
            { n: 'ホテルフォーシーズン徳島', addr: '徳島市寺島本町', area: 'tokushima-c', price: 14000 },
        ],
    },

    // ──────────── 下関・関門 ────────────
    {
        id: 'shimonoseki', name: '下関・関門', country: '日本', region: 'chugoku',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'hs', 'np'],
        areas: [
            { id: 'shimonoseki-c', name: '下関' },
            { id: 'kanmon', name: '関門海峡' },
        ],
        spots: [
            { n: '唐戸市場', d: 'ふぐと活気の鮮魚市場', t: 'グルメ', dur: 120, addr: '下関市唐戸町', area: 'shimonoseki-c', th: ['gm', 'sg'], pop: 5 },
            { n: '海峡ゆめタワー', d: '下関のシンボル展望塔', t: '観光', dur: 75, addr: '下関市豊前田町', area: 'shimonoseki-c', th: ['np', 'sg', 'ng'], pop: 4 },
            { n: '赤間神宮', d: '安徳天皇を祀る朱色の神社', t: '観光', dur: 60, addr: '下関市阿弥陀寺町', area: 'shimonoseki-c', th: ['sg', 'hs'], pop: 4 },
            { n: '巌流島', d: '武蔵と小次郎決闘の島', t: '観光', dur: 120, addr: '下関市', area: 'kanmon', th: ['sg', 'hs', 'ex'], pop: 4 },
            { n: '関門海峡ミュージアム', d: '海峡の歴史と文化', t: '観光', dur: 90, addr: '北九州市門司区', area: 'kanmon', th: ['sg', 'hs'], pop: 3 },
            { n: '門司港レトロ', d: '大正期の洋館街', t: '観光', dur: 120, addr: '北九州市門司区', area: 'kanmon', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'ふぐ料理 下関春帆楼', d: 'ふぐ料理公許第一号', t: 'グルメ', dur: 120, addr: '下関市阿弥陀寺町', area: 'shimonoseki-c', th: ['gm', 'hs'], pop: 5, bk: true },
            { n: '元乃隅神社（角島とセット可）', d: '海に向かう123本の鳥居', t: '観光', dur: 90, addr: '長門市油谷津黄', area: 'kanmon', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: '角島大橋', d: '透き通る海の絶景大橋', t: '観光', dur: 60, addr: '下関市豊北町', area: 'kanmon', th: ['np', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: '下関春帆楼本店', addr: '下関市阿弥陀寺町', area: 'shimonoseki-c', price: 38000 },
            { n: '下関グランドホテル', addr: '下関市南部町', area: 'shimonoseki-c', price: 22000 },
        ],
    },

    // ──────────── 嬉野・唐津・佐賀 ────────────
    {
        id: 'saga-ureshino', name: '嬉野・唐津', country: '日本', region: 'kyushu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['on', 'hs', 'sg', 'gm'],
        areas: [
            { id: 'ureshino', name: '嬉野温泉' },
            { id: 'karatsu', name: '唐津' },
        ],
        spots: [
            { n: '嬉野温泉街', d: '日本三大美肌の湯', t: '観光', dur: 120, addr: '嬉野市嬉野町', area: 'ureshino', th: ['on', 'cp', 'sg'], pop: 5 },
            { n: 'シーボルトの足湯', d: '嬉野の無料足湯', t: '観光', dur: 30, addr: '嬉野市嬉野町', area: 'ureshino', th: ['on'], pop: 3 },
            { n: '武雄温泉楼門', d: '辰野金吾設計の重要文化財', t: '観光', dur: 60, addr: '武雄市武雄町', area: 'ureshino', th: ['sg', 'hs', 'on'], pop: 4 },
            { n: '御船山楽園', d: '九州屈指の名園・ナイト紅葉', t: '観光', dur: 120, addr: '武雄市武雄町', area: 'ureshino', th: ['np', 'sg', 'cp'], pop: 4 },
            { n: '唐津城', d: '虹の松原を望む海辺の城', t: '観光', dur: 90, addr: '唐津市東城内', area: 'karatsu', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '虹の松原', d: '日本三大松原のひとつ', t: '観光', dur: 60, addr: '唐津市', area: 'karatsu', th: ['np', 'nt'], pop: 4 },
            { n: '呼子のイカ', d: 'イカ活造りの名所', t: 'グルメ', dur: 90, addr: '唐津市呼子町', area: 'karatsu', th: ['gm', 'sg'], pop: 5 },
            { n: '吉野ヶ里遺跡', d: '弥生時代の環濠集落', t: '観光', dur: 120, addr: '神埼郡吉野ヶ里町', area: 'karatsu', th: ['sg', 'hs', 'fm'], pop: 4 },
            { n: '有田焼の街', d: '日本磁器発祥の地', t: '観光', dur: 120, addr: '西松浦郡有田町', area: 'karatsu', th: ['sg', 'hs', 'ar', 'sp'], pop: 3 },
        ],
        hotels: [
            { n: '嬉野温泉 大正屋', addr: '嬉野市嬉野町', area: 'ureshino', price: 32000 },
            { n: '武雄温泉 KARAE', addr: '武雄市武雄町', area: 'ureshino', price: 22000 },
            { n: '虹の松原ホテル', addr: '唐津市東唐津', area: 'karatsu', price: 18000 },
        ],
    },

    // ──────────── 宮崎・日南海岸 ────────────
    {
        id: 'miyazaki', name: '宮崎・日南', country: '日本', region: 'kyushu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'sg', 'hs', 'gm'],
        areas: [
            { id: 'miyazaki-c', name: '宮崎市内' },
            { id: 'nichinan', name: '日南海岸' },
        ],
        spots: [
            { n: '青島神社', d: '鬼の洗濯板の絶景', t: '観光', dur: 90, addr: '宮崎市青島', area: 'miyazaki-c', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: '鵜戸神宮', d: '断崖の洞窟内の朱の社殿', t: '観光', dur: 90, addr: '日南市宮浦', area: 'nichinan', th: ['sg', 'np', 'hs'], pop: 5 },
            { n: 'サンメッセ日南', d: 'モアイ像レプリカと太平洋', t: '観光', dur: 120, addr: '日南市宮浦', area: 'nichinan', th: ['sg', 'cp', 'fm'], pop: 5 },
            { n: '飫肥城下町', d: '九州の小京都', t: '観光', dur: 120, addr: '日南市飫肥', area: 'nichinan', th: ['sg', 'hs'], pop: 4 },
            { n: '高千穂牧場', d: '霧島連山ふもとの牧場', t: '観光', dur: 120, addr: '都城市吉之元町', area: 'miyazaki-c', th: ['fm', 'np'], pop: 3 },
            { n: '宮崎神宮', d: '神武天皇を祀る神宮', t: '観光', dur: 60, addr: '宮崎市神宮', area: 'miyazaki-c', th: ['sg', 'hs'], pop: 3 },
            { n: '宮崎チキン南蛮', d: 'ご当地名物', t: 'グルメ', dur: 60, addr: '宮崎市', area: 'miyazaki-c', th: ['gm'], pop: 5 },
            { n: 'シーガイア・フェニックス', d: 'リゾート施設', t: '観光', dur: 240, addr: '宮崎市山崎町', area: 'miyazaki-c', th: ['cp', 'on', 'fm'], pop: 3 },
        ],
        hotels: [
            { n: 'シェラトン・グランデ・オーシャンリゾート', addr: '宮崎市山崎町', area: 'miyazaki-c', price: 38000 },
            { n: 'ANAホリデイ・イン リゾート 宮崎', addr: '宮崎市青島', area: 'miyazaki-c', price: 28000 },
        ],
    },

    // ──────────── 奄美大島 ────────────
    {
        id: 'amami', name: '奄美大島', country: '日本', region: 'kyushu_island',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['np', 'nt', 'wh', 'bc'],
        areas: [
            { id: 'amami-c', name: '奄美大島' },
        ],
        spots: [
            { n: '金作原原生林', d: '太古の亜熱帯原生林（世界遺産）', t: '観光', dur: 180, addr: '奄美市名瀬', area: 'amami-c', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'マングローブカヌー', d: '黒潮の森でカヌー体験', t: '観光', dur: 180, addr: '奄美市住用町', area: 'amami-c', th: ['ex', 'nt', 'np'], pop: 5 },
            { n: 'ハートロック', d: 'ハート形の潮だまり', t: '観光', dur: 60, addr: '龍郷町', area: 'amami-c', th: ['cp', 'np'], pop: 5 },
            { n: 'あやまる岬', d: '太平洋を望む絶景', t: '観光', dur: 60, addr: '奄美市笠利町', area: 'amami-c', th: ['np', 'cp'], pop: 4 },
            { n: '土盛海岸', d: 'エメラルドグリーンのビーチ', t: '観光', dur: 120, addr: '奄美市笠利町', area: 'amami-c', th: ['bc', 'np'], pop: 5 },
            { n: '田中一村美術館', d: '奄美を愛した日本画家', t: '観光', dur: 90, addr: '奄美市笠利町', area: 'amami-c', th: ['ar'], pop: 3 },
            { n: '鶏飯', d: '奄美の郷土料理', t: 'グルメ', dur: 60, addr: '奄美市', area: 'amami-c', th: ['gm', 'hs'], pop: 4 },
            { n: '黒糖焼酎蔵', d: '奄美固有の蒸留酒', t: 'グルメ', dur: 60, addr: '奄美市', area: 'amami-c', th: ['gm', 'hs', 'ex'], pop: 3 },
        ],
        hotels: [
            { n: 'ザ・シーン奄美大島', addr: '大島郡瀬戸内町', area: 'amami-c', price: 35000 },
            { n: 'ホテルウェストコート奄美', addr: '奄美市名瀬', area: 'amami-c', price: 16000 },
        ],
    },

    // ──────────── 男鹿半島・秋田 ────────────
    {
        id: 'akita-oga', name: '秋田・男鹿', country: '日本', region: 'tohoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['sg', 'hs', 'np', 'on'],
        areas: [
            { id: 'akita-c', name: '秋田市内' },
            { id: 'oga', name: '男鹿半島' },
        ],
        spots: [
            { n: '秋田なまはげ館', d: '男鹿のなまはげ文化', t: '観光', dur: 75, addr: '男鹿市北浦', area: 'oga', th: ['sg', 'hs', 'fm'], pop: 5 },
            { n: '入道崎', d: '北緯40度の絶景灯台', t: '観光', dur: 75, addr: '男鹿市北浦', area: 'oga', th: ['np', 'sg'], pop: 5 },
            { n: 'ゴジラ岩', d: '夕日に映えるゴジラ似の奇岩', t: '観光', dur: 30, addr: '男鹿市船川港', area: 'oga', th: ['np', 'sg'], pop: 4 },
            { n: '秋田犬の里', d: '秋田犬と触れ合える施設', t: '観光', dur: 60, addr: '大館市御成町', area: 'akita-c', th: ['fm', 'sg'], pop: 4 },
            { n: '千秋公園（久保田城跡）', d: '秋田の桜の名所', t: '観光', dur: 75, addr: '秋田市千秋公園', area: 'akita-c', th: ['sg', 'np', 'hs'], pop: 3 },
            { n: '比内地鶏きりたんぽ', d: '秋田名物郷土料理', t: 'グルメ', dur: 75, addr: '秋田市', area: 'akita-c', th: ['gm', 'hs'], pop: 4 },
            { n: '稲庭うどん', d: '秋田の伝統手延べうどん', t: 'グルメ', dur: 60, addr: '湯沢市稲庭町', area: 'akita-c', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: '男鹿温泉 ホテル雄山閣', addr: '男鹿市北浦', area: 'oga', price: 18000 },
            { n: 'ANAクラウンプラザホテル秋田', addr: '秋田市中通', area: 'akita-c', price: 16000 },
        ],
    },

    // ──────────── 越後湯沢・苗場 ────────────
    {
        id: 'echigo-yuzawa', name: '越後湯沢・苗場', country: '日本', region: 'hokuriku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['on', 'ex', 'np', 'fm'],
        areas: [
            { id: 'yuzawa', name: '越後湯沢' },
            { id: 'naeba', name: '苗場' },
        ],
        spots: [
            { n: '越後湯沢温泉街', d: '川端康成「雪国」の舞台', t: '観光', dur: 120, addr: '南魚沼郡湯沢町', area: 'yuzawa', th: ['on', 'hs'], pop: 5 },
            { n: '苗場スキー場', d: '関東屈指のスキーリゾート', t: '観光', dur: 360, addr: '南魚沼郡湯沢町', area: 'naeba', th: ['ex', 'fm'], pop: 5 },
            { n: 'ドラゴンドラ', d: '世界最長レベルのゴンドラ', t: '観光', dur: 90, addr: '南魚沼郡湯沢町', area: 'naeba', th: ['ex', 'np'], pop: 4 },
            { n: '湯沢ロープウェイ', d: '湯沢一望の絶景ロープウェイ', t: '観光', dur: 75, addr: '南魚沼郡湯沢町', area: 'yuzawa', th: ['np', 'cp'], pop: 3 },
            { n: 'CoCoLo湯沢・がんぎどおり', d: '駅ナカ日本酒博物館', t: '観光', dur: 75, addr: '南魚沼郡湯沢町', area: 'yuzawa', th: ['gm', 'sg', 'hs'], pop: 4 },
            { n: '魚沼産コシヒカリの郷', d: '日本一の米どころ', t: 'グルメ', dur: 60, addr: '魚沼市', area: 'yuzawa', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '苗場プリンスホテル', addr: '南魚沼郡湯沢町', area: 'naeba', price: 28000 },
            { n: '越後湯沢温泉 雪国の宿 高半', addr: '南魚沼郡湯沢町', area: 'yuzawa', price: 22000 },
            { n: 'NASPAニューオータニ', addr: '南魚沼郡湯沢町', area: 'yuzawa', price: 24000 },
        ],
    },

    // ──────────── 那覇・慶良間諸島 ────────────
    {
        id: 'kerama', name: '慶良間諸島', country: '日本', region: 'okinawa_remote',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 60,
        themes: ['bc', 'np', 'ex', 'cp'],
        areas: [
            { id: 'tokashiki', name: '渡嘉敷島' },
            { id: 'zamami', name: '座間味島' },
            { id: 'aka', name: '阿嘉島' },
        ],
        spots: [
            { n: '阿波連ビーチ（渡嘉敷）', d: 'ケラマブルーの絶景', t: '観光', dur: 180, addr: '渡嘉敷村', area: 'tokashiki', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: '渡嘉志久ビーチ', d: 'ウミガメに会えるビーチ', t: '観光', dur: 180, addr: '渡嘉敷村', area: 'tokashiki', th: ['bc', 'ex', 'np'], pop: 5 },
            { n: '古座間味ビーチ', d: '座間味島の絶景ビーチ', t: '観光', dur: 180, addr: '座間味村', area: 'zamami', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: 'ホエールウォッチング', d: 'ザトウクジラ観察ツアー', t: '観光', dur: 180, addr: '慶良間諸島', area: 'zamami', th: ['ex', 'np'], pop: 4 },
            { n: 'シュノーケリング', d: '世界屈指の透明度', t: '観光', dur: 180, addr: '慶良間諸島', area: 'tokashiki', th: ['ex', 'bc', 'np'], pop: 5 },
            { n: '阿嘉島・ニシ浜', d: '阿嘉島の絶景ビーチ', t: '観光', dur: 180, addr: '座間味村', area: 'aka', th: ['bc', 'np', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: '慶良間ハナムロリゾート（座間味）', addr: '座間味村', area: 'zamami', price: 28000 },
            { n: 'ペンション ニライカナイ', addr: '渡嘉敷村', area: 'tokashiki', price: 18000 },
        ],
    },
]
