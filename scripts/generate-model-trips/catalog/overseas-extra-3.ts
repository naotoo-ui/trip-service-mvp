import type { DestinationEntry } from '../types'

// 海外追加 第3弾
// インド・スリランカ・ネパール・ブータン・バガン・中国深部（桂林・成都・九寨溝）・
// ヨルダン（ペトラ）・南アフリカ・ナミビア・NZ南北・ケアンズ・シカゴ・アラスカ・
// ガラパゴス・ハバナ・コスタリカ

export const OVERSEAS_EXTRA_3: DestinationEntry[] = [
    // ──────────── インド・ゴールデントライアングル ────────────
    {
        id: 'india-golden', name: 'インド・ゴールデントライアングル', country: 'インド', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: 'タクシー', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'gm', 'ar'],
        areas: [
            { id: 'delhi', name: 'デリー' },
            { id: 'agra', name: 'アグラ' },
            { id: 'jaipur', name: 'ジャイプール' },
        ],
        spots: [
            { n: 'タージマハル', d: '世界遺産・愛の墓廟', t: '観光', dur: 240, addr: 'アグラ', area: 'agra', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'アグラ城（赤の城）', d: 'ムガル帝国の世界遺産', t: '観光', dur: 150, addr: 'アグラ', area: 'agra', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'メヘターブ・バーグ', d: 'タージマハル川向こうの夕景', t: '観光', dur: 90, addr: 'アグラ', area: 'agra', th: ['np', 'cp'], pop: 4 },
            { n: 'アンベール城（ジャイプール）', d: '丘の上のラージプート要塞', t: '観光', dur: 180, addr: 'ジャイプール', area: 'jaipur', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '風の宮殿（ハワ・マハル）', d: 'ジャイプール象徴のピンクの宮殿', t: '観光', dur: 75, addr: 'ジャイプール', area: 'jaipur', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'シティ・パレス（ジャイプール）', d: 'マハラジャの宮殿群', t: '観光', dur: 150, addr: 'ジャイプール', area: 'jaipur', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'クトゥブ・ミナール', d: 'デリーの世界遺産・赤い塔', t: '観光', dur: 90, addr: 'デリー', area: 'delhi', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '赤い城（デリー）', d: 'ムガル帝国の世界遺産城塞', t: '観光', dur: 120, addr: 'デリー', area: 'delhi', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'インド門', d: 'デリーの凱旋門', t: '観光', dur: 60, addr: 'デリー', area: 'delhi', th: ['sg', 'hs'], pop: 3 },
            { n: 'インドカレー（タンドリーチキン・ナン）', d: '本場のスパイス料理', t: 'グルメ', dur: 90, addr: '各地', area: 'delhi', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'タージマハル・ホテル ニューデリー', addr: 'デリー', area: 'delhi', price: 45000 },
            { n: 'オベロイ・アマルヴィラス', addr: 'アグラ', area: 'agra', price: 85000 },
            { n: 'ランバー宮殿', addr: 'ジャイプール', area: 'jaipur', price: 78000 },
        ],
    },

    // ──────────── スリランカ ────────────
    {
        id: 'srilanka', name: 'スリランカ', country: 'スリランカ', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: 'タクシー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh', 'np', 'nt', 'bc'],
        areas: [
            { id: 'colombo', name: 'コロンボ' },
            { id: 'kandy', name: 'キャンディ' },
            { id: 'sigiriya', name: 'シーギリヤ' },
        ],
        spots: [
            { n: 'シーギリヤロック', d: 'ライオン岩の世界遺産', t: '観光', dur: 240, addr: 'シーギリヤ', area: 'sigiriya', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'ダンブッラ石窟寺院', d: '世界遺産の岩窟仏教寺院', t: '観光', dur: 120, addr: 'ダンブッラ', area: 'sigiriya', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ポロンナルワ古代都市', d: '11世紀の世界遺産', t: '観光', dur: 180, addr: 'ポロンナルワ', area: 'sigiriya', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '仏歯寺（キャンディ）', d: '釈迦の歯を祀る世界遺産', t: '観光', dur: 120, addr: 'キャンディ', area: 'kandy', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '紅茶畑（ヌワラエリヤ）', d: 'セイロンティーの故郷', t: '観光', dur: 180, addr: 'ヌワラエリヤ', area: 'kandy', th: ['np', 'gm', 'ex'], pop: 5 },
            { n: '列車旅（キャンディ〜エラ）', d: '世界で最も美しい列車旅', t: '観光', dur: 360, addr: 'スリランカ中部', area: 'kandy', th: ['np', 'ex', 'cp'], pop: 5 },
            { n: 'ゴール旧市街', d: 'オランダ植民地時代の世界遺産', t: '観光', dur: 120, addr: 'ゴール', area: 'colombo', th: ['sg', 'hs', 'wh', 'bc'], pop: 4 },
            { n: 'ミリッサビーチ', d: '南海岸のリゾート・クジラ', t: '観光', dur: 180, addr: 'ミリッサ', area: 'colombo', th: ['bc', 'cp', 'np'], pop: 4 },
            { n: 'スリランカカレー', d: '甘くスパイシーな名物', t: 'グルメ', dur: 75, addr: '各地', area: 'colombo', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ジェットウィング・ライトハウス', addr: 'ゴール', area: 'colombo', price: 38000 },
            { n: 'シーギリヤ・ヴィレッジホテル', addr: 'シーギリヤ', area: 'sigiriya', price: 22000 },
            { n: 'クイーンズ・ホテル', addr: 'キャンディ', area: 'kandy', price: 18000 },
        ],
    },

    // ──────────── ネパール ────────────
    {
        id: 'nepal', name: 'ネパール', country: 'ネパール', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'np', 'nt', 'ex'],
        areas: [
            { id: 'kathmandu', name: 'カトマンズ' },
            { id: 'pokhara', name: 'ポカラ' },
        ],
        spots: [
            { n: 'ダルバール広場（カトマンズ）', d: 'ネパール王宮の世界遺産', t: '観光', dur: 180, addr: 'カトマンズ', area: 'kathmandu', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'スワヤンブナート（モンキーテンプル）', d: '丘の上の眼の仏塔', t: '観光', dur: 120, addr: 'カトマンズ', area: 'kathmandu', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ボダナート', d: '世界最大級の仏塔', t: '観光', dur: 90, addr: 'カトマンズ', area: 'kathmandu', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'パシュパティナート', d: 'ヒンドゥー教火葬場の世界遺産', t: '観光', dur: 120, addr: 'カトマンズ', area: 'kathmandu', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'バクタプル古都', d: '中世そのままの街並み世界遺産', t: '観光', dur: 180, addr: 'バクタプル', area: 'kathmandu', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ヒマラヤ展望飛行', d: 'エベレストを空から', t: '観光', dur: 120, addr: 'カトマンズ', area: 'kathmandu', th: ['np', 'ex'], pop: 5, bk: true },
            { n: 'ポカラ・フェワ湖', d: 'アンナプルナ山脈を映す湖', t: '観光', dur: 180, addr: 'ポカラ', area: 'pokhara', th: ['np', 'cp', 'nt'], pop: 5 },
            { n: 'サランコットの丘', d: 'ヒマラヤ朝日の絶景', t: '観光', dur: 180, addr: 'ポカラ', area: 'pokhara', th: ['np', 'cp'], pop: 5 },
            { n: 'ダル料理（ダルバート）', d: 'ネパール家庭料理', t: 'グルメ', dur: 75, addr: '各地', area: 'kathmandu', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'ドワリカズ・ホテル', addr: 'カトマンズ', area: 'kathmandu', price: 32000 },
            { n: 'フィッシュテイル・ロッジ', addr: 'ポカラ', area: 'pokhara', price: 18000 },
        ],
    },

    // ──────────── 中国・桂林 ────────────
    {
        id: 'guilin', name: '桂林・陽朔', country: '中国', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 40,
        themes: ['np', 'nt', 'sg', 'cp'],
        areas: [
            { id: 'guilin-c', name: '桂林' },
            { id: 'yangshuo', name: '陽朔' },
        ],
        spots: [
            { n: '漓江下り（桂林〜陽朔）', d: 'カルスト地形の絶景クルーズ', t: '観光', dur: 240, addr: '漓江', area: 'guilin-c', th: ['np', 'sg', 'cp'], pop: 5 },
            { n: '象鼻山', d: '桂林のシンボル', t: '観光', dur: 75, addr: '桂林', area: 'guilin-c', th: ['sg', 'np'], pop: 4 },
            { n: '芦笛岩', d: 'ライトアップ鍾乳洞', t: '観光', dur: 120, addr: '桂林', area: 'guilin-c', th: ['sg', 'np'], pop: 4 },
            { n: '陽朔・西街', d: '陽朔の繁華街', t: '観光', dur: 90, addr: '陽朔', area: 'yangshuo', th: ['sg', 'gm', 'sp'], pop: 4 },
            { n: '十里画廊', d: '陽朔の田園風景サイクリング', t: '観光', dur: 180, addr: '陽朔', area: 'yangshuo', th: ['np', 'ex'], pop: 4 },
            { n: '龍脊棚田', d: '世界遺産級の段々畑', t: '観光', dur: 240, addr: '龍勝', area: 'guilin-c', th: ['np', 'hs'], pop: 5 },
            { n: '印象・劉三姐ショー', d: '張藝謀演出の野外舞台', t: '観光', dur: 120, addr: '陽朔', area: 'yangshuo', th: ['ar', 'cp', 'ex'], pop: 4 },
            { n: '桂林米粉', d: 'ご当地名物', t: 'グルメ', dur: 45, addr: '桂林', area: 'guilin-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'シャングリラホテル桂林', addr: '桂林', area: 'guilin-c', price: 28000 },
            { n: 'アマン陽朔', addr: '陽朔', area: 'yangshuo', price: 95000 },
        ],
    },

    // ──────────── 中国・成都＋九寨溝 ────────────
    {
        id: 'chengdu-jiuzhaigou', name: '成都・九寨溝', country: '中国', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['np', 'nt', 'wh', 'sg', 'gm'],
        areas: [
            { id: 'chengdu', name: '成都' },
            { id: 'jiuzhaigou', name: '九寨溝' },
            { id: 'huanglong', name: '黄龍' },
        ],
        spots: [
            { n: '成都ジャイアントパンダ繁育研究基地', d: '世界最大級のパンダ保護センター', t: '観光', dur: 180, addr: '成都', area: 'chengdu', th: ['nt', 'fm', 'sg'], pop: 5 },
            { n: '杜甫草堂', d: '詩人・杜甫の住居跡', t: '観光', dur: 120, addr: '成都', area: 'chengdu', th: ['sg', 'hs'], pop: 3 },
            { n: '錦里古街', d: '蜀文化の伝統商店街', t: '観光', dur: 90, addr: '成都', area: 'chengdu', th: ['sg', 'gm', 'sp'], pop: 4 },
            { n: '九寨溝', d: 'エメラルドグリーンの世界遺産湖群', t: '観光', dur: 480, addr: '九寨溝', area: 'jiuzhaigou', th: ['np', 'wh', 'nt'], pop: 5 },
            { n: '黄龍', d: '世界遺産のカルシウム棚', t: '観光', dur: 360, addr: '黄龍', area: 'huanglong', th: ['np', 'wh'], pop: 5 },
            { n: '楽山大仏', d: '世界最大の磨崖石仏（世界遺産）', t: '観光', dur: 180, addr: '楽山', area: 'chengdu', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '青城山', d: '道教の聖地・世界遺産', t: '観光', dur: 240, addr: '青城山', area: 'chengdu', th: ['sg', 'hs', 'wh', 'nt'], pop: 3 },
            { n: '麻婆豆腐・四川料理', d: '本場の激辛料理', t: 'グルメ', dur: 90, addr: '成都', area: 'chengdu', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'リッツ・カールトン成都', addr: '成都', area: 'chengdu', price: 38000 },
            { n: '九寨天堂洲際大飯店', addr: '九寨溝', area: 'jiuzhaigou', price: 35000 },
        ],
    },

    // ──────────── ヨルダン（ペトラ） ────────────
    {
        id: 'jordan', name: 'ヨルダン', country: 'ヨルダン', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'np', 'ex'],
        areas: [
            { id: 'amman', name: 'アンマン' },
            { id: 'petra', name: 'ペトラ' },
            { id: 'wadi-rum', name: 'ワディラム' },
            { id: 'dead-sea', name: '死海' },
        ],
        spots: [
            { n: 'ペトラ遺跡', d: '岩窟都市の世界遺産・新世界七不思議', t: '観光', dur: 480, addr: 'ペトラ', area: 'petra', th: ['sg', 'hs', 'wh', 'ex'], pop: 5 },
            { n: 'ペトラ・エド・ディル（修道院）', d: 'ペトラ最大の遺跡', t: '観光', dur: 240, addr: 'ペトラ', area: 'petra', th: ['sg', 'hs', 'wh', 'ex'], pop: 4 },
            { n: 'ペトラ・ナイトツアー', d: 'キャンドル灯る幻想的なシーク', t: '観光', dur: 120, addr: 'ペトラ', area: 'petra', th: ['cp', 'ng', 'sg'], pop: 4, bk: true },
            { n: 'ワディラム砂漠', d: '映画ロケ地の赤い砂漠', t: '観光', dur: 360, addr: 'ワディラム', area: 'wadi-rum', th: ['np', 'ex', 'cp'], pop: 5 },
            { n: '死海', d: '塩分濃度世界最高の湖', t: '観光', dur: 240, addr: '死海', area: 'dead-sea', th: ['ex', 'np', 'on', 'cp'], pop: 5 },
            { n: 'ジェラシュ遺跡', d: 'ローマ時代の遺跡', t: '観光', dur: 180, addr: 'ジェラシュ', area: 'amman', th: ['sg', 'hs'], pop: 4 },
            { n: 'アンマン城塞', d: 'ローマ時代の遺跡', t: '観光', dur: 90, addr: 'アンマン', area: 'amman', th: ['sg', 'hs'], pop: 3 },
            { n: '中東料理（マンサフ・メゼ）', d: 'ヨルダン伝統料理', t: 'グルメ', dur: 90, addr: '各地', area: 'amman', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'ムーベンピック・リゾート・ペトラ', addr: 'ペトラ', area: 'petra', price: 32000 },
            { n: 'ケンピンスキー・ホテル・イシュタール 死海', addr: '死海', area: 'dead-sea', price: 38000 },
            { n: 'フォーシーズンズ アンマン', addr: 'アンマン', area: 'amman', price: 35000 },
        ],
    },

    // ──────────── 南アフリカ ────────────
    {
        id: 'cape-town', name: '南アフリカ（ケープタウン）', country: '南アフリカ', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['np', 'nt', 'sg', 'gm'],
        areas: [
            { id: 'capetown', name: 'ケープタウン' },
            { id: 'garden-route', name: 'ガーデンルート' },
            { id: 'safari-sa', name: 'クルーガー国立公園' },
        ],
        spots: [
            { n: 'テーブルマウンテン', d: 'ケープタウンのシンボル', t: '観光', dur: 180, addr: 'ケープタウン', area: 'capetown', th: ['np', 'sg', 'nt'], pop: 5 },
            { n: '喜望峰', d: 'アフリカ大陸最南西端', t: '観光', dur: 240, addr: 'ケープタウン', area: 'capetown', th: ['np', 'sg'], pop: 5 },
            { n: 'V&Aウォーターフロント', d: 'ケープタウンの観光地区', t: '観光', dur: 180, addr: 'ケープタウン', area: 'capetown', th: ['sg', 'gm', 'sp'], pop: 5 },
            { n: 'ボルダーズビーチ', d: 'ペンギンに会えるビーチ', t: '観光', dur: 120, addr: 'サイモンズタウン', area: 'capetown', th: ['nt', 'fm', 'np'], pop: 5 },
            { n: 'ロベン島', d: 'マンデラ収監の世界遺産', t: '観光', dur: 240, addr: 'ロベン島', area: 'capetown', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ステレンボッシュワインランド', d: '南アフリカのワイン産地', t: '観光', dur: 180, addr: 'ステレンボッシュ', area: 'capetown', th: ['gm', 'cp', 'ex'], pop: 5 },
            { n: 'クルーガー国立公園サファリ', d: 'ビッグ5が見られるサファリ', t: '観光', dur: 480, addr: 'クルーガー', area: 'safari-sa', th: ['nt', 'np', 'ex'], pop: 5 },
            { n: 'ハーマナス（ホエール）', d: '世界最高の陸上ホエール観察', t: '観光', dur: 180, addr: 'ハーマナス', area: 'garden-route', th: ['nt', 'np'], pop: 4 },
        ],
        hotels: [
            { n: 'ワンアンドオンリー ケープタウン', addr: 'ケープタウン', area: 'capetown', price: 78000 },
            { n: 'マウントネルソン ホテル', addr: 'ケープタウン', area: 'capetown', price: 52000 },
            { n: 'シンギタ・サビサンド・ロッジ', addr: 'クルーガー', area: 'safari-sa', price: 165000 },
        ],
    },

    // ──────────── ナミビア ────────────
    {
        id: 'namibia', name: 'ナミビア（ナミブ砂漠）', country: 'ナミビア', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'ex', 'cp'],
        areas: [
            { id: 'sossusvlei', name: 'ソススフレイ' },
            { id: 'etosha', name: 'エトーシャ' },
        ],
        spots: [
            { n: 'デッドフレイ', d: '枯れ木が立つ白い湖底', t: '観光', dur: 180, addr: 'ナミブ砂漠', area: 'sossusvlei', th: ['np', 'cp', 'ex'], pop: 5 },
            { n: 'ソススフレイ・砂丘登り', d: '世界最古の砂漠', t: '観光', dur: 240, addr: 'ナミブ砂漠', area: 'sossusvlei', th: ['np', 'ex', 'nt'], pop: 5 },
            { n: 'デューン45（砂丘）', d: '名前の通りの巨大砂丘', t: '観光', dur: 120, addr: 'ナミブ砂漠', area: 'sossusvlei', th: ['np'], pop: 4 },
            { n: 'エトーシャ国立公園', d: 'ナミビア最大のサファリ', t: '観光', dur: 480, addr: 'エトーシャ', area: 'etosha', th: ['nt', 'np', 'ex'], pop: 5 },
            { n: 'スワコプムンド', d: 'ドイツ植民地時代の街', t: '観光', dur: 120, addr: 'スワコプムンド', area: 'sossusvlei', th: ['sg', 'hs'], pop: 3 },
            { n: '気球サファリ（ソススフレイ）', d: '砂漠の上空遊覧', t: '観光', dur: 180, addr: 'ナミブ砂漠', area: 'sossusvlei', th: ['ex', 'cp', 'np'], pop: 4, bk: true },
        ],
        hotels: [
            { n: 'リトル・クララ・ロッジ', addr: 'ナミブ砂漠', area: 'sossusvlei', price: 95000 },
            { n: 'オンギャバ・サファリキャンプ', addr: 'エトーシャ', area: 'etosha', price: 58000 },
        ],
    },

    // ──────────── ニュージーランド南北 ────────────
    {
        id: 'newzealand', name: 'ニュージーランド', country: 'ニュージーランド', region: 'overseas_oceania',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'ex', 'cp', 'wh'],
        areas: [
            { id: 'auckland', name: 'オークランド' },
            { id: 'rotorua', name: 'ロトルア' },
            { id: 'queenstown', name: 'クイーンズタウン' },
            { id: 'mt-cook', name: 'マウントクック' },
        ],
        spots: [
            { n: 'ミルフォードサウンド', d: '世界遺産のフィヨルド', t: '観光', dur: 360, addr: 'ミルフォードサウンド', area: 'queenstown', th: ['np', 'wh', 'nt', 'cp'], pop: 5 },
            { n: 'クイーンズタウン・スカイライン', d: '湖と山を望むロープウェイ', t: '観光', dur: 120, addr: 'クイーンズタウン', area: 'queenstown', th: ['np', 'cp', 'ex'], pop: 5 },
            { n: 'マウントクック国立公園', d: 'ニュージーランド最高峰', t: '観光', dur: 240, addr: 'マウントクック', area: 'mt-cook', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'テカポ湖', d: '星空保護区の湖', t: '観光', dur: 180, addr: 'テカポ', area: 'mt-cook', th: ['np', 'cp'], pop: 5 },
            { n: 'ロトルア・地熱地帯', d: 'マオリ文化と温泉', t: '観光', dur: 180, addr: 'ロトルア', area: 'rotorua', th: ['on', 'sg', 'np', 'ex'], pop: 5 },
            { n: 'ホビット村（ホビトン）', d: 'ロードオブザリング撮影地', t: '観光', dur: 180, addr: 'マタマタ', area: 'rotorua', th: ['sg', 'ex', 'fm'], pop: 5, bk: true },
            { n: 'ワイトモ洞窟（土ボタル）', d: '光るキノコバエの洞窟', t: '観光', dur: 180, addr: 'ワイトモ', area: 'auckland', th: ['np', 'ex', 'cp'], pop: 4 },
            { n: 'オークランド・スカイタワー', d: 'NZ最高層の展望塔', t: '観光', dur: 90, addr: 'オークランド', area: 'auckland', th: ['sg', 'np', 'ng'], pop: 3 },
            { n: 'クイーンズタウン・バンジー', d: '世界初のバンジージャンプ', t: '観光', dur: 180, addr: 'クイーンズタウン', area: 'queenstown', th: ['ex'], pop: 3 },
        ],
        hotels: [
            { n: 'ザ・リッツ・カールトン オークランド', addr: 'オークランド', area: 'auckland', price: 48000 },
            { n: 'ヒルトン・クイーンズタウン', addr: 'クイーンズタウン', area: 'queenstown', price: 42000 },
            { n: 'ハーミテージ・ホテル', addr: 'マウントクック', area: 'mt-cook', price: 38000 },
        ],
    },

    // ──────────── ケアンズ＋GBR ────────────
    {
        id: 'cairns', name: 'ケアンズ・GBR', country: 'オーストラリア', region: 'overseas_oceania',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 40,
        themes: ['np', 'nt', 'wh', 'ex', 'bc'],
        areas: [
            { id: 'cairns-c', name: 'ケアンズ' },
            { id: 'gbr', name: 'グレートバリアリーフ' },
        ],
        spots: [
            { n: 'グレートバリアリーフ', d: '世界遺産・世界最大の珊瑚礁', t: '観光', dur: 480, addr: 'GBR', area: 'gbr', th: ['wh', 'np', 'bc', 'ex'], pop: 5 },
            { n: 'グリーン島', d: '日帰りで行けるサンゴ島', t: '観光', dur: 480, addr: 'グリーン島', area: 'gbr', th: ['bc', 'fm', 'ex'], pop: 5 },
            { n: 'キュランダ熱帯雨林', d: '世界遺産の熱帯雨林', t: '観光', dur: 240, addr: 'キュランダ', area: 'cairns-c', th: ['nt', 'wh', 'np'], pop: 5 },
            { n: 'キュランダ高原列車・スカイレール', d: '熱帯雨林の絶景遊覧', t: '観光', dur: 240, addr: 'キュランダ', area: 'cairns-c', th: ['np', 'ex', 'sg'], pop: 5 },
            { n: 'ケアンズ・ナイトマーケット', d: '夜のローカル市場', t: 'グルメ', dur: 90, addr: 'ケアンズ', area: 'cairns-c', th: ['gm', 'sp', 'ng'], pop: 3 },
            { n: 'ポートダグラス', d: 'リゾートタウン', t: '観光', dur: 180, addr: 'ポートダグラス', area: 'cairns-c', th: ['bc', 'cp'], pop: 4 },
            { n: 'アサートン高原', d: '滝めぐりとカルデラ湖', t: '観光', dur: 360, addr: 'アサートン', area: 'cairns-c', th: ['np', 'nt'], pop: 4 },
            { n: 'ハミルトン島（GBR玄関）', d: 'リゾートアイランド', t: '観光', dur: 480, addr: 'ハミルトン島', area: 'gbr', th: ['bc', 'cp', 'np'], pop: 5 },
        ],
        hotels: [
            { n: 'プルマン・リーフホテル・カジノ', addr: 'ケアンズ', area: 'cairns-c', price: 28000 },
            { n: 'カイヒル・ビーチクラブ・リゾート', addr: 'ハミルトン島', area: 'gbr', price: 58000 },
        ],
    },

    // ──────────── シカゴ ────────────
    {
        id: 'chicago', name: 'シカゴ', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 25,
        themes: ['sg', 'ar', 'gm', 'sp', 'ng'],
        areas: [
            { id: 'chicago-c', name: 'シカゴ中心' },
        ],
        spots: [
            { n: 'クラウドゲート（ザ・ビーン）', d: 'ミレニアムパークの巨大豆', t: '観光', dur: 60, addr: 'シカゴ', area: 'chicago-c', th: ['sg', 'ar', 'cp'], pop: 5 },
            { n: 'シカゴ美術館', d: '全米屈指の美術館', t: '観光', dur: 180, addr: 'シカゴ', area: 'chicago-c', th: ['ar', 'sg'], pop: 5 },
            { n: 'ウィリスタワー展望台', d: '北米屈指の高層展望', t: '観光', dur: 90, addr: 'シカゴ', area: 'chicago-c', th: ['np', 'ng', 'sg'], pop: 4 },
            { n: '建築クルーズ', d: 'シカゴ川から建築美鑑賞', t: '観光', dur: 90, addr: 'シカゴ川', area: 'chicago-c', th: ['sg', 'ar', 'cp'], pop: 5 },
            { n: 'ネイビーピア', d: 'ミシガン湖畔の桟橋', t: '観光', dur: 120, addr: 'シカゴ', area: 'chicago-c', th: ['sg', 'fm', 'cp'], pop: 4 },
            { n: 'マグニフィセントマイル', d: 'シカゴのメインストリート', t: '観光', dur: 120, addr: 'シカゴ', area: 'chicago-c', th: ['sp', 'sg'], pop: 4 },
            { n: 'シカゴ・ピザ', d: 'ディープディッシュ発祥地', t: 'グルメ', dur: 90, addr: 'シカゴ', area: 'chicago-c', th: ['gm', 'hs'], pop: 5 },
            { n: 'ブルースバー', d: 'シカゴブルース発祥', t: '観光', dur: 180, addr: 'シカゴ', area: 'chicago-c', th: ['ng', 'gm'], pop: 4, eveningOk: true },
        ],
        hotels: [
            { n: 'ザ・ペニンシュラ シカゴ', addr: 'シカゴ', area: 'chicago-c', price: 78000 },
            { n: 'パームハウス・ヒルトン', addr: 'シカゴ', area: 'chicago-c', price: 32000 },
        ],
    },

    // ──────────── アラスカ ────────────
    {
        id: 'alaska', name: 'アラスカ', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'ex', 'wh'],
        areas: [
            { id: 'anchorage', name: 'アンカレッジ' },
            { id: 'denali', name: 'デナリ国立公園' },
            { id: 'fairbanks', name: 'フェアバンクス' },
        ],
        spots: [
            { n: 'デナリ国立公園', d: '北米最高峰の国立公園', t: '観光', dur: 480, addr: 'デナリ', area: 'denali', th: ['np', 'nt'], pop: 5 },
            { n: 'オーロラ観賞（フェアバンクス）', d: '世界屈指のオーロラ観察地', t: '観光', dur: 240, addr: 'フェアバンクス', area: 'fairbanks', th: ['np', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'チェナ温泉', d: 'オーロラと温泉', t: '観光', dur: 180, addr: 'チェナ', area: 'fairbanks', th: ['on', 'np', 'cp'], pop: 5 },
            { n: 'アンカレッジ博物館', d: 'アラスカ先住民文化', t: '観光', dur: 120, addr: 'アンカレッジ', area: 'anchorage', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'クルーズ・氷河見学', d: 'プリンスウィリアム湾', t: '観光', dur: 360, addr: 'ウィッティア', area: 'anchorage', th: ['np', 'nt', 'ex'], pop: 4 },
            { n: '犬ぞり体験', d: 'アラスカ伝統の犬ぞり', t: '観光', dur: 180, addr: '各地', area: 'fairbanks', th: ['ex', 'fm'], pop: 4 },
        ],
        hotels: [
            { n: 'デナリプリンセス・ウィルダネス・ロッジ', addr: 'デナリ', area: 'denali', price: 42000 },
            { n: 'チェナ温泉リゾート', addr: 'チェナ', area: 'fairbanks', price: 38000 },
        ],
    },

    // ──────────── ガラパゴス諸島 ────────────
    {
        id: 'galapagos', name: 'ガラパゴス諸島', country: 'エクアドル', region: 'overseas_america',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 90,
        themes: ['nt', 'np', 'wh', 'ex'],
        areas: [
            { id: 'galapagos-c', name: 'ガラパゴス諸島' },
        ],
        spots: [
            { n: 'サンタクルス島・チャールズダーウィン研究所', d: 'ゾウガメの飼育と研究', t: '観光', dur: 180, addr: 'サンタクルス', area: 'galapagos-c', th: ['nt', 'sg', 'wh'], pop: 5 },
            { n: 'バルトラ島', d: 'ガラパゴス玄関口', t: '観光', dur: 120, addr: 'バルトラ', area: 'galapagos-c', th: ['nt', 'np'], pop: 4 },
            { n: 'イザベラ島', d: '最大の島・火山と野生動物', t: '観光', dur: 480, addr: 'イザベラ', area: 'galapagos-c', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'フェルナンディナ島', d: '原始のまま残る島', t: '観光', dur: 360, addr: 'フェルナンディナ', area: 'galapagos-c', th: ['nt', 'np', 'wh'], pop: 4 },
            { n: 'クルーズ（4-7日）', d: 'ガラパゴス諸島クルーズ', t: '観光', dur: 720, addr: '各島', area: 'galapagos-c', th: ['nt', 'np', 'wh', 'ex'], pop: 5, bk: true },
            { n: 'シュノーケリング・ダイビング', d: 'アシカ・ペンギン・サメ', t: '観光', dur: 180, addr: '各島', area: 'galapagos-c', th: ['ex', 'nt'], pop: 5 },
        ],
        hotels: [
            { n: 'フィンチベイ・ガラパゴス・ホテル', addr: 'サンタクルス', area: 'galapagos-c', price: 78000 },
            { n: 'ガラパゴス・サファリキャンプ', addr: 'サンタクルス', area: 'galapagos-c', price: 95000 },
        ],
    },

    // ──────────── ハバナ（キューバ） ────────────
    {
        id: 'havana', name: 'ハバナ', country: 'キューバ', region: 'overseas_america',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'hs', 'wh', 'cp', 'gm'],
        areas: [
            { id: 'havana-c', name: 'ハバナ' },
        ],
        spots: [
            { n: 'オールド・ハバナ', d: '世界遺産の旧市街', t: '観光', dur: 240, addr: 'ハバナ', area: 'havana-c', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'カピトリオ', d: 'ハバナの国会議事堂', t: '観光', dur: 75, addr: 'ハバナ', area: 'havana-c', th: ['sg', 'hs'], pop: 4 },
            { n: 'マレコン通り', d: '海岸沿いの絶景プロムナード', t: '観光', dur: 90, addr: 'ハバナ', area: 'havana-c', th: ['np', 'sg', 'cp'], pop: 5 },
            { n: 'クラシックカー乗車体験', d: '50年代のアメリカ車で街めぐり', t: '観光', dur: 120, addr: 'ハバナ', area: 'havana-c', th: ['ex', 'cp', 'sg'], pop: 5 },
            { n: 'モロ要塞', d: 'ハバナ港の歴史要塞', t: '観光', dur: 90, addr: 'ハバナ', area: 'havana-c', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ヘミングウェイ博物館', d: '20年を過ごした作家の家', t: '観光', dur: 90, addr: 'ハバナ', area: 'havana-c', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'モヒート発祥の店', d: '老舗バー La Bodeguita', t: 'グルメ', dur: 75, addr: 'ハバナ', area: 'havana-c', th: ['gm', 'hs', 'ng'], pop: 4 },
            { n: 'サルサ・ナイトクラブ', d: 'キューバの音楽体験', t: '観光', dur: 180, addr: 'ハバナ', area: 'havana-c', th: ['ng', 'ex', 'cp'], pop: 4, eveningOk: true },
        ],
        hotels: [
            { n: 'ホテル・ナシオナル・デ・キューバ', addr: 'ハバナ', area: 'havana-c', price: 32000 },
            { n: 'ホテル・サラトガ', addr: 'ハバナ', area: 'havana-c', price: 28000 },
        ],
    },

    // ──────────── ブータン ────────────
    {
        id: 'bhutan', name: 'ブータン', country: 'ブータン', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'nt', 'np'],
        areas: [
            { id: 'paro', name: 'パロ' },
            { id: 'thimphu', name: 'ティンプー' },
            { id: 'punakha', name: 'プナカ' },
        ],
        spots: [
            { n: 'タクツァン僧院（虎穴寺）', d: '崖の上の世界遺産級寺院', t: '観光', dur: 300, addr: 'パロ', area: 'paro', th: ['sg', 'hs', 'np', 'ex'], pop: 5 },
            { n: 'パロ・ゾン（リンプン・ゾン）', d: 'パロの城塞僧院', t: '観光', dur: 90, addr: 'パロ', area: 'paro', th: ['sg', 'hs'], pop: 4 },
            { n: 'ティンプー・ゾン', d: 'ブータンの政治宗教中心', t: '観光', dur: 90, addr: 'ティンプー', area: 'thimphu', th: ['sg', 'hs'], pop: 4 },
            { n: 'タカン展望台', d: 'ブータンの国獣', t: '観光', dur: 60, addr: 'ティンプー', area: 'thimphu', th: ['nt', 'sg'], pop: 3 },
            { n: 'プナカ・ゾン', d: 'ブータン最美の僧院', t: '観光', dur: 120, addr: 'プナカ', area: 'punakha', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'ドチュラ峠', d: '108仏塔の絶景', t: '観光', dur: 60, addr: 'ドチュラ', area: 'punakha', th: ['np', 'sg', 'hs'], pop: 4 },
            { n: 'エマダツィ（ブータン料理）', d: '激辛唐辛子チーズ煮', t: 'グルメ', dur: 60, addr: '各地', area: 'thimphu', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'アマンコラ・パロ', addr: 'パロ', area: 'paro', price: 145000 },
            { n: 'タージ・タシ', addr: 'ティンプー', area: 'thimphu', price: 48000 },
        ],
    },
]
