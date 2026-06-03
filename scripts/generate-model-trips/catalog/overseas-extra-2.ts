import type { DestinationEntry } from '../types'

// 海外追加 第2弾
// 南イタリア・クロアチア・トルコ・ギリシャ・スコットランド・アイルランド・
// ロヴァニエミ・トロムソ（オーロラ）・ボストン・ワシントン・SF・グランドキャニオン・
// カナディアンロッキー・モルディブ・ボラボラ・サントリーニ・セーシェル等

export const OVERSEAS_EXTRA_2: DestinationEntry[] = [
    // ──────────── 南イタリア（ナポリ・カプリ・アマルフィ） ────────────
    {
        id: 'south-italy', name: '南イタリア', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 40,
        themes: ['sg', 'hs', 'wh', 'gm', 'np', 'cp', 'bc'],
        areas: [
            { id: 'naples', name: 'ナポリ' },
            { id: 'amalfi', name: 'アマルフィ海岸' },
            { id: 'capri', name: 'カプリ島' },
        ],
        spots: [
            { n: 'ポンペイ遺跡', d: 'ヴェスヴィオ火山に埋もれた古代都市', t: '観光', dur: 240, addr: 'ポンペイ', area: 'naples', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ナポリ歴史地区', d: '世界遺産の旧市街', t: '観光', dur: 180, addr: 'ナポリ', area: 'naples', th: ['sg', 'hs', 'wh', 'gm'], pop: 4 },
            { n: 'ナポリ国立考古学博物館', d: 'ポンペイ出土品の宝庫', t: '観光', dur: 120, addr: 'ナポリ', area: 'naples', th: ['ar', 'hs'], pop: 4 },
            { n: 'アマルフィ海岸ドライブ', d: '断崖と碧海の絶景街道', t: '観光', dur: 240, addr: 'アマルフィ海岸', area: 'amalfi', th: ['np', 'cp', 'sg', 'wh'], pop: 5 },
            { n: 'ポジターノ', d: 'カラフルな崖の街', t: '観光', dur: 180, addr: 'ポジターノ', area: 'amalfi', th: ['sg', 'cp', 'np', 'bc'], pop: 5 },
            { n: 'ラヴェッロ', d: '高台の絶景庭園と教会', t: '観光', dur: 150, addr: 'ラヴェッロ', area: 'amalfi', th: ['sg', 'np', 'cp', 'ar'], pop: 4 },
            { n: '青の洞窟（カプリ島）', d: '神秘のコバルトブルー', t: '観光', dur: 180, addr: 'カプリ島', area: 'capri', th: ['np', 'sg', 'cp'], pop: 5, bk: true },
            { n: 'アナカプリ', d: 'カプリ島上のリゾート', t: '観光', dur: 150, addr: 'カプリ島', area: 'capri', th: ['sg', 'np', 'cp'], pop: 4 },
            { n: 'ナポリピッツァ', d: 'ピッツァ発祥の本場', t: 'グルメ', dur: 60, addr: 'ナポリ', area: 'naples', th: ['gm', 'hs'], pop: 5 },
        ],
        hotels: [
            { n: 'ベルモンド ホテル チプリアーニ', addr: 'カプリ島', area: 'capri', price: 130000 },
            { n: 'ホテル サンタ・カテリーナ', addr: 'アマルフィ', area: 'amalfi', price: 85000 },
            { n: 'グランド ホテル パルカーズ', addr: 'ナポリ', area: 'naples', price: 42000 },
        ],
    },

    // ──────────── シチリア ────────────
    {
        id: 'sicily', name: 'シチリア', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh', 'gm', 'np'],
        areas: [
            { id: 'palermo', name: 'パレルモ' },
            { id: 'taormina', name: 'タオルミーナ' },
            { id: 'agrigento', name: 'アグリジェント' },
        ],
        spots: [
            { n: 'タオルミーナ・ギリシャ劇場', d: 'エトナ山を背景にした古代劇場', t: '観光', dur: 120, addr: 'タオルミーナ', area: 'taormina', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'タオルミーナ旧市街', d: '中世の街並みと地中海', t: '観光', dur: 120, addr: 'タオルミーナ', area: 'taormina', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'エトナ山', d: '欧州最大の活火山', t: '観光', dur: 240, addr: 'エトナ山', area: 'taormina', th: ['np', 'ex', 'nt'], pop: 4 },
            { n: 'アグリジェント神殿の谷', d: 'ギリシャ神殿群の世界遺産', t: '観光', dur: 180, addr: 'アグリジェント', area: 'agrigento', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'パレルモ歴史地区', d: 'モンレアーレ大聖堂と王宮', t: '観光', dur: 180, addr: 'パレルモ', area: 'palermo', th: ['sg', 'hs', 'wh', 'ar'], pop: 4 },
            { n: 'カターニア魚市場', d: 'シチリアの食文化', t: 'グルメ', dur: 90, addr: 'カターニア', area: 'taormina', th: ['gm', 'sg'], pop: 4 },
            { n: 'カンノーロ', d: 'シチリア発祥の伝統菓子', t: 'グルメ', dur: 30, addr: 'パレルモ', area: 'palermo', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'グランド ホテル ティメオ・タオルミーナ', addr: 'タオルミーナ', area: 'taormina', price: 65000 },
            { n: 'ヴィラ・イグレア', addr: 'パレルモ', area: 'palermo', price: 38000 },
        ],
    },

    // ──────────── クロアチア ────────────
    {
        id: 'croatia', name: 'クロアチア', country: 'クロアチア', region: 'overseas_europe',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['sg', 'hs', 'wh', 'np', 'cp', 'bc'],
        areas: [
            { id: 'dubrovnik', name: 'ドゥブロヴニク' },
            { id: 'split', name: 'スプリット' },
            { id: 'plitvice', name: 'プリトヴィツェ' },
        ],
        spots: [
            { n: 'ドゥブロヴニク旧市街', d: 'アドリア海の真珠・世界遺産', t: '観光', dur: 240, addr: 'ドゥブロヴニク', area: 'dubrovnik', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'ドゥブロヴニク城壁巡り', d: '海を望む歩く絶景', t: '観光', dur: 120, addr: 'ドゥブロヴニク', area: 'dubrovnik', th: ['sg', 'np', 'wh'], pop: 5 },
            { n: 'スルジ山ロープウェイ', d: '街と海を一望する展望', t: '観光', dur: 90, addr: 'ドゥブロヴニク', area: 'dubrovnik', th: ['np', 'cp', 'ng'], pop: 5 },
            { n: 'スプリット・ディオクレティアヌス宮殿', d: '世界遺産のローマ宮殿跡', t: '観光', dur: 180, addr: 'スプリット', area: 'split', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'リヴァ通り（スプリット）', d: '海沿いのプロムナード', t: '観光', dur: 90, addr: 'スプリット', area: 'split', th: ['sg', 'cp'], pop: 4 },
            { n: 'プリトヴィツェ湖群国立公園', d: '世界遺産の16湖と滝', t: '観光', dur: 360, addr: 'プリトヴィツェ', area: 'plitvice', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'フヴァル島', d: 'クロアチアの楽園リゾート', t: '観光', dur: 240, addr: 'フヴァル', area: 'split', th: ['bc', 'cp', 'np'], pop: 4 },
            { n: '黒シーザリック・チーズ', d: 'クロアチア名物魚介料理', t: 'グルメ', dur: 90, addr: '海沿い各地', area: 'dubrovnik', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ヒルトン インペリアル ドゥブロヴニク', addr: 'ドゥブロヴニク', area: 'dubrovnik', price: 65000 },
            { n: 'ル メリディアン レフ スプリット', addr: 'スプリット', area: 'split', price: 38000 },
        ],
    },

    // ──────────── トルコ ────────────
    {
        id: 'turkey', name: 'トルコ', country: 'トルコ', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh', 'ex', 'np', 'gm'],
        areas: [
            { id: 'istanbul', name: 'イスタンブール' },
            { id: 'cappadocia', name: 'カッパドキア' },
            { id: 'ephesus', name: 'エフェソス・パムッカレ' },
        ],
        spots: [
            { n: 'アヤソフィア', d: 'ビザンチン・オスマンの世界遺産', t: '観光', dur: 120, addr: 'イスタンブール', area: 'istanbul', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'ブルーモスク', d: '青の6本ミナレットのモスク', t: '観光', dur: 90, addr: 'イスタンブール', area: 'istanbul', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'トプカプ宮殿', d: 'オスマン帝国の宮殿', t: '観光', dur: 150, addr: 'イスタンブール', area: 'istanbul', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'グランドバザール', d: '世界最大級の屋根付き市場', t: '観光', dur: 120, addr: 'イスタンブール', area: 'istanbul', th: ['sg', 'sp', 'gm'], pop: 5 },
            { n: 'ボスポラス海峡クルーズ', d: 'アジアと欧州を結ぶ海峡', t: '観光', dur: 120, addr: 'イスタンブール', area: 'istanbul', th: ['sg', 'cp', 'np'], pop: 4 },
            { n: 'カッパドキア気球ツアー', d: '奇岩地形の空中遊覧', t: '観光', dur: 180, addr: 'ギョレメ', area: 'cappadocia', th: ['ex', 'np', 'cp', 'sg'], pop: 5, bk: true },
            { n: 'ギョレメ野外博物館', d: '岩窟教会群の世界遺産', t: '観光', dur: 180, addr: 'ギョレメ', area: 'cappadocia', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'カイマクル地下都市', d: '初期キリスト教徒の隠れ家', t: '観光', dur: 90, addr: 'カイマクル', area: 'cappadocia', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'パムッカレ・石灰棚', d: '白い段々プールの世界遺産', t: '観光', dur: 180, addr: 'パムッカレ', area: 'ephesus', th: ['np', 'sg', 'wh', 'on'], pop: 5 },
            { n: 'エフェソス遺跡', d: 'ローマ時代の都市遺跡', t: '観光', dur: 180, addr: 'セルチュク', area: 'ephesus', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'トルコ料理（ケバブ・メゼ）', d: '世界三大料理の一つ', t: 'グルメ', dur: 90, addr: '各地', area: 'istanbul', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'チラーガン パレス ケンピンスキー', addr: 'イスタンブール', area: 'istanbul', price: 78000 },
            { n: 'ミュージアム ホテル カッパドキア', addr: 'ウチヒサル', area: 'cappadocia', price: 58000 },
            { n: 'カラホセイン ロッジ', addr: 'パムッカレ', area: 'ephesus', price: 22000 },
        ],
    },

    // ──────────── ギリシャ ────────────
    {
        id: 'greece', name: 'ギリシャ', country: 'ギリシャ', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'np', 'cp', 'bc'],
        areas: [
            { id: 'athens', name: 'アテネ' },
            { id: 'santorini', name: 'サントリーニ' },
            { id: 'mykonos', name: 'ミコノス' },
        ],
        spots: [
            { n: 'アクロポリス・パルテノン神殿', d: '古代ギリシャ文明の象徴', t: '観光', dur: 180, addr: 'アテネ', area: 'athens', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'プラカ地区', d: 'アクロポリス麓の古い街', t: '観光', dur: 120, addr: 'アテネ', area: 'athens', th: ['sg', 'gm', 'sp'], pop: 4 },
            { n: 'アクロポリス博物館', d: '神殿出土品の現代美術館', t: '観光', dur: 120, addr: 'アテネ', area: 'athens', th: ['ar', 'hs', 'wh'], pop: 4 },
            { n: 'サントリーニ・イア', d: '白と青の絶景・夕日の名所', t: '観光', dur: 180, addr: 'イア', area: 'santorini', th: ['np', 'cp', 'sg'], pop: 5 },
            { n: 'フィラ', d: 'サントリーニ島の首都', t: '観光', dur: 120, addr: 'フィラ', area: 'santorini', th: ['sg', 'cp', 'gm'], pop: 4 },
            { n: 'レッドビーチ・ブラックビーチ', d: 'サントリーニの個性ビーチ', t: '観光', dur: 120, addr: 'サントリーニ', area: 'santorini', th: ['bc', 'np'], pop: 4 },
            { n: 'ミコノス旧市街', d: '白い迷路と風車', t: '観光', dur: 150, addr: 'ミコノス', area: 'mykonos', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'デロス島（世界遺産）', d: 'アポロン生誕の聖地', t: '観光', dur: 180, addr: 'デロス', area: 'mykonos', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: 'パラダイスビーチ', d: 'ミコノスのパーティーリゾート', t: '観光', dur: 180, addr: 'ミコノス', area: 'mykonos', th: ['bc', 'ng', 'cp'], pop: 4 },
            { n: 'ギリシャ料理・ムサカ', d: 'ナス層のグラタン', t: 'グルメ', dur: 75, addr: '各地', area: 'athens', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'ホテル グランデ ブレターニュ', addr: 'アテネ', area: 'athens', price: 58000 },
            { n: 'ケイトス スイーツ', addr: 'イア', area: 'santorini', price: 95000 },
            { n: 'ベルヴェデーレ ホテル', addr: 'ミコノス', area: 'mykonos', price: 65000 },
        ],
    },

    // ──────────── スコットランド（エディンバラ） ────────────
    {
        id: 'scotland', name: 'スコットランド', country: 'イギリス', region: 'overseas_europe',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh', 'np', 'nt'],
        areas: [
            { id: 'edinburgh', name: 'エディンバラ' },
            { id: 'highlands', name: 'ハイランド' },
            { id: 'skye', name: 'スカイ島' },
        ],
        spots: [
            { n: 'エディンバラ城', d: '岩山の上の世界遺産城', t: '観光', dur: 150, addr: 'エディンバラ', area: 'edinburgh', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ロイヤル・マイル', d: '旧市街の目抜き通り', t: '観光', dur: 120, addr: 'エディンバラ', area: 'edinburgh', th: ['sg', 'hs', 'wh', 'sp'], pop: 5 },
            { n: 'ホリールード宮殿', d: 'スコットランド王室の宮殿', t: '観光', dur: 120, addr: 'エディンバラ', area: 'edinburgh', th: ['sg', 'hs'], pop: 4 },
            { n: 'アーサーズシート', d: 'エディンバラ展望の死火山', t: '観光', dur: 120, addr: 'エディンバラ', area: 'edinburgh', th: ['np', 'nt', 'cp'], pop: 4 },
            { n: 'ネス湖', d: 'ネッシー伝説の湖', t: '観光', dur: 180, addr: 'インヴァネス', area: 'highlands', th: ['sg', 'np'], pop: 4 },
            { n: 'グレンコー峡谷', d: 'ハリポタロケ地の絶景', t: '観光', dur: 240, addr: 'グレンコー', area: 'highlands', th: ['np', 'nt'], pop: 5 },
            { n: 'スカイ島・クイレイン', d: '神秘的な岩山風景', t: '観光', dur: 240, addr: 'スカイ島', area: 'skye', th: ['np', 'nt'], pop: 4 },
            { n: 'スコッチウイスキー蒸留所', d: 'スコットランドの誇り', t: 'グルメ', dur: 120, addr: 'スコットランド各地', area: 'highlands', th: ['gm', 'ex'], pop: 5 },
            { n: 'ハギス', d: 'スコットランド名物料理', t: 'グルメ', dur: 60, addr: 'エディンバラ', area: 'edinburgh', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'バルモラル ホテル', addr: 'エディンバラ', area: 'edinburgh', price: 68000 },
            { n: 'インヴァネス城近郊ホテル', addr: 'インヴァネス', area: 'highlands', price: 28000 },
        ],
    },

    // ──────────── ロヴァニエミ（フィンランド・オーロラ） ────────────
    {
        id: 'rovaniemi', name: 'ロヴァニエミ', country: 'フィンランド', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 45,
        themes: ['np', 'ex', 'cp', 'fm'],
        areas: [
            { id: 'rovaniemi-c', name: 'ロヴァニエミ' },
        ],
        spots: [
            { n: 'サンタクロース村', d: '北極圏のサンタの家', t: '観光', dur: 120, addr: 'ロヴァニエミ', area: 'rovaniemi-c', th: ['sg', 'fm', 'cp'], pop: 5 },
            { n: 'オーロラ観賞ツアー', d: '世界トップクラスの観賞地', t: '観光', dur: 240, addr: '郊外', area: 'rovaniemi-c', th: ['np', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'ハスキー犬ぞり', d: 'ラップランドの定番体験', t: '観光', dur: 180, addr: '郊外', area: 'rovaniemi-c', th: ['ex', 'fm', 'cp'], pop: 5, bk: true },
            { n: 'トナカイそり', d: 'サーミ族の伝統', t: '観光', dur: 90, addr: '郊外', area: 'rovaniemi-c', th: ['ex', 'fm'], pop: 4 },
            { n: 'スノーモービル体験', d: '雪原を疾走', t: '観光', dur: 120, addr: '郊外', area: 'rovaniemi-c', th: ['ex'], pop: 4 },
            { n: 'アルクティクム科学博物館', d: '北極圏の自然と文化', t: '観光', dur: 90, addr: 'ロヴァニエミ', area: 'rovaniemi-c', th: ['sg', 'fm'], pop: 3 },
            { n: 'サンタクロースエクスプレス', d: 'ヘルシンキからの寝台列車', t: '観光', dur: 240, addr: 'ロヴァニエミ', area: 'rovaniemi-c', th: ['ex'], pop: 3 },
        ],
        hotels: [
            { n: 'カクスラウッタネン・アークティック・リゾート', addr: 'サーリセルカ', area: 'rovaniemi-c', price: 72000 },
            { n: 'グラスイグルー・アークティックリゾート', addr: 'ロヴァニエミ', area: 'rovaniemi-c', price: 58000 },
            { n: 'サンタクロース・ホテル', addr: 'ロヴァニエミ', area: 'rovaniemi-c', price: 32000 },
        ],
    },

    // ──────────── アメリカ・ボストン・ワシントン ────────────
    {
        id: 'boston-washington', name: 'ボストン・ワシントンDC', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'overseas_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'hs', 'ar', 'fm'],
        areas: [
            { id: 'boston', name: 'ボストン' },
            { id: 'washington', name: 'ワシントンDC' },
        ],
        spots: [
            { n: 'フリーダム・トレイル', d: '独立革命史跡を辿るルート', t: '観光', dur: 240, addr: 'ボストン', area: 'boston', th: ['sg', 'hs', 'ex'], pop: 5 },
            { n: 'ハーバード大学', d: '世界最高峰の学府の見学', t: '観光', dur: 120, addr: 'ケンブリッジ', area: 'boston', th: ['sg', 'hs'], pop: 5 },
            { n: 'クインシー・マーケット', d: 'ボストンの食市場', t: 'グルメ', dur: 90, addr: 'ボストン', area: 'boston', th: ['gm', 'sg'], pop: 4 },
            { n: 'ボストン美術館', d: 'アメリカ屈指のコレクション', t: '観光', dur: 180, addr: 'ボストン', area: 'boston', th: ['ar', 'sg'], pop: 4 },
            { n: 'ホワイトハウス', d: 'アメリカ大統領官邸', t: '観光', dur: 90, addr: 'ワシントンDC', area: 'washington', th: ['sg', 'hs'], pop: 5 },
            { n: '国立公文書館', d: '独立宣言原本', t: '観光', dur: 90, addr: 'ワシントンDC', area: 'washington', th: ['sg', 'hs'], pop: 4 },
            { n: 'スミソニアン博物館群', d: '無料で楽しめる世界的博物館', t: '観光', dur: 240, addr: 'ワシントンDC', area: 'washington', th: ['sg', 'ar', 'hs', 'fm'], pop: 5 },
            { n: 'リンカーン記念堂・国立広場', d: 'ナショナルモールの中心', t: '観光', dur: 120, addr: 'ワシントンDC', area: 'washington', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'ロブスターロール（ボストン）', d: '東海岸名物', t: 'グルメ', dur: 60, addr: 'ボストン', area: 'boston', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ザ・リッツ・カールトン ボストン', addr: 'ボストン', area: 'boston', price: 78000 },
            { n: 'マンダリン オリエンタル ワシントンDC', addr: 'ワシントンDC', area: 'washington', price: 65000 },
            { n: 'フォー シーズンズ ワシントンDC', addr: 'ワシントンDC', area: 'washington', price: 95000 },
        ],
    },

    // ──────────── サンフランシスコ ────────────
    {
        id: 'sf', name: 'サンフランシスコ', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'overseas_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'cp', 'np', 'ar'],
        areas: [
            { id: 'sf-c', name: 'SF中心' },
        ],
        spots: [
            { n: 'ゴールデンゲートブリッジ', d: 'SFの象徴的吊り橋', t: '観光', dur: 90, addr: 'サンフランシスコ', area: 'sf-c', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'フィッシャーマンズワーフ', d: '海辺の食観光地', t: '観光', dur: 150, addr: 'サンフランシスコ', area: 'sf-c', th: ['gm', 'sg', 'fm'], pop: 5 },
            { n: 'アルカトラズ島', d: '元監獄のミステリーツアー', t: '観光', dur: 180, addr: 'アルカトラズ', area: 'sf-c', th: ['sg', 'hs', 'ex'], pop: 5, bk: true },
            { n: 'ケーブルカー', d: 'SFのレトロな移動手段', t: '観光', dur: 60, addr: 'サンフランシスコ', area: 'sf-c', th: ['sg', 'hs', 'ex'], pop: 5 },
            { n: 'ロンバート・ストリート', d: '世界一曲がりくねった坂道', t: '観光', dur: 45, addr: 'サンフランシスコ', area: 'sf-c', th: ['sg', 'cp'], pop: 4 },
            { n: 'チャイナタウン', d: '北米最大の中華街', t: '観光', dur: 120, addr: 'サンフランシスコ', area: 'sf-c', th: ['sg', 'gm'], pop: 4 },
            { n: 'ナパ・ソノマワイナリー', d: 'カリフォルニアワインの聖地', t: '観光', dur: 360, addr: 'ナパ', area: 'sf-c', th: ['gm', 'cp', 'ex'], pop: 5 },
            { n: 'ペインテッドレディース', d: 'SF名物カラフルなビクトリアン', t: '観光', dur: 30, addr: 'サンフランシスコ', area: 'sf-c', th: ['sg', 'cp'], pop: 3 },
            { n: 'ボウディン・ベーカリー', d: 'クラムチャウダーボウル', t: 'グルメ', dur: 60, addr: 'フィッシャーマンズワーフ', area: 'sf-c', th: ['gm', 'sg'], pop: 4 },
        ],
        hotels: [
            { n: 'ザ・リッツ・カールトン サンフランシスコ', addr: 'サンフランシスコ', area: 'sf-c', price: 75000 },
            { n: 'パレス ホテル', addr: 'サンフランシスコ', area: 'sf-c', price: 48000 },
        ],
    },

    // ──────────── グランドサークル（ラスベガス起点） ────────────
    {
        id: 'grand-circle', name: 'グランドサークル', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'sg', 'wh'],
        areas: [
            { id: 'lasvegas', name: 'ラスベガス' },
            { id: 'grand-canyon', name: 'グランドキャニオン' },
            { id: 'sedona', name: 'セドナ' },
            { id: 'antelope', name: 'アンテロープ' },
        ],
        spots: [
            { n: 'グランドキャニオン国立公園', d: '世界遺産の大渓谷', t: '観光', dur: 360, addr: 'グランドキャニオン', area: 'grand-canyon', th: ['np', 'wh', 'nt', 'sg'], pop: 5 },
            { n: 'グランドキャニオン・サウスリム', d: '最も人気の展望地', t: '観光', dur: 240, addr: 'サウスリム', area: 'grand-canyon', th: ['np', 'wh'], pop: 5 },
            { n: 'セドナ・ベルロック', d: 'パワースポット・赤い岩山', t: '観光', dur: 180, addr: 'セドナ', area: 'sedona', th: ['np', 'nt', 'cp'], pop: 5 },
            { n: 'アンテロープキャニオン', d: '光の差し込む赤い洞窟', t: '観光', dur: 120, addr: 'ページ', area: 'antelope', th: ['np', 'cp', 'sg'], pop: 5, bk: true },
            { n: 'ホースシューベンド', d: '蛇行するコロラド川の絶景', t: '観光', dur: 90, addr: 'ページ', area: 'antelope', th: ['np', 'cp'], pop: 5 },
            { n: 'モニュメントバレー', d: '映画ロケ地の赤い大地', t: '観光', dur: 240, addr: 'モニュメントバレー', area: 'antelope', th: ['np', 'sg'], pop: 5 },
            { n: 'ザイオン国立公園', d: '険しい赤い断崖の絶景', t: '観光', dur: 360, addr: 'ザイオン', area: 'grand-canyon', th: ['np', 'nt'], pop: 4 },
            { n: 'ブライスキャニオン', d: 'フードゥと呼ばれる奇岩', t: '観光', dur: 240, addr: 'ブライス', area: 'grand-canyon', th: ['np'], pop: 4 },
            { n: 'ラスベガス・ストリップ', d: 'カジノとショーの夜景', t: '観光', dur: 180, addr: 'ラスベガス', area: 'lasvegas', th: ['sg', 'ng', 'ex'], pop: 5 },
            { n: 'ベラージオの噴水ショー', d: 'ラスベガス名物', t: '観光', dur: 30, addr: 'ラスベガス', area: 'lasvegas', th: ['sg', 'ng', 'cp'], pop: 4, eveningOk: true },
        ],
        hotels: [
            { n: 'ベラージオ ラスベガス', addr: 'ラスベガス', area: 'lasvegas', price: 32000 },
            { n: 'エンチャントメント リゾート（セドナ）', addr: 'セドナ', area: 'sedona', price: 58000 },
            { n: 'エルトバール ホテル', addr: 'グランドキャニオン', area: 'grand-canyon', price: 28000 },
        ],
    },

    // ──────────── カナディアンロッキー ────────────
    {
        id: 'canadian-rockies', name: 'カナディアンロッキー', country: 'カナダ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'wh', 'ex'],
        areas: [
            { id: 'banff', name: 'バンフ' },
            { id: 'jasper', name: 'ジャスパー' },
            { id: 'vancouver', name: 'バンクーバー' },
        ],
        spots: [
            { n: 'モレーン湖', d: '10ペアクの絶景・湖', t: '観光', dur: 120, addr: 'バンフ', area: 'banff', th: ['np', 'wh'], pop: 5 },
            { n: 'ルイーズ湖', d: 'ターコイズブルーの宝石', t: '観光', dur: 180, addr: 'バンフ', area: 'banff', th: ['np', 'wh', 'cp'], pop: 5 },
            { n: 'バンフ国立公園', d: 'カナディアンロッキーの中心', t: '観光', dur: 240, addr: 'バンフ', area: 'banff', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'コロンビア大氷原', d: 'アイスエクスプローラー氷河体験', t: '観光', dur: 240, addr: 'コロンビア氷原', area: 'jasper', th: ['np', 'ex', 'wh'], pop: 5 },
            { n: 'マリーン湖', d: 'ジャスパーの絶景湖', t: '観光', dur: 180, addr: 'ジャスパー', area: 'jasper', th: ['np', 'wh'], pop: 5 },
            { n: 'スタンレーパーク', d: 'バンクーバーの巨大公園', t: '観光', dur: 180, addr: 'バンクーバー', area: 'vancouver', th: ['np', 'nt', 'fm'], pop: 4 },
            { n: 'グランビル・アイランド', d: 'パブリックマーケット', t: 'グルメ', dur: 120, addr: 'バンクーバー', area: 'vancouver', th: ['gm', 'sg'], pop: 4 },
            { n: 'キャピラノ吊り橋', d: '熱帯雨林の空中遊歩', t: '観光', dur: 120, addr: 'バンクーバー', area: 'vancouver', th: ['np', 'ex', 'fm'], pop: 4 },
            { n: 'ヘッドウォーターズ・ロッジ', d: 'ロッキー絶景のロッジ滞在', t: '観光', dur: 240, addr: 'バンフ', area: 'banff', th: ['cp', 'np'], pop: 3 },
        ],
        hotels: [
            { n: 'フェアモント シャトー レイク ルイーズ', addr: 'ルイーズ湖', area: 'banff', price: 95000 },
            { n: 'フェアモント バンフ スプリングス', addr: 'バンフ', area: 'banff', price: 78000 },
            { n: 'フェアモント パシフィック リム', addr: 'バンクーバー', area: 'vancouver', price: 52000 },
        ],
    },

    // ──────────── モルディブ ────────────
    {
        id: 'maldives', name: 'モルディブ', country: 'モルディブ', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 30,
        themes: ['bc', 'cp', 'on', 'np', 'ex'],
        areas: [
            { id: 'maldives-c', name: 'モルディブ' },
        ],
        spots: [
            { n: '水上ヴィラ', d: 'モルディブ象徴の水上コテージ滞在', t: '観光', dur: 600, addr: 'モルディブ', area: 'maldives-c', th: ['cp', 'bc', 'np'], pop: 5 },
            { n: 'シュノーケリング・ハウスリーフ', d: 'リゾート前の珊瑚礁', t: '観光', dur: 180, addr: 'モルディブ', area: 'maldives-c', th: ['bc', 'ex', 'np'], pop: 5 },
            { n: 'ドルフィンクルーズ', d: 'インド洋のイルカ観察', t: '観光', dur: 180, addr: 'モルディブ', area: 'maldives-c', th: ['ex', 'cp', 'np'], pop: 4 },
            { n: 'スパ・トリートメント', d: 'インド洋を望むスパ体験', t: 'その他', dur: 120, addr: 'モルディブ', area: 'maldives-c', th: ['on', 'cp'], pop: 5 },
            { n: 'サンセットクルーズ', d: 'インド洋の夕日と夜空', t: '観光', dur: 120, addr: 'モルディブ', area: 'maldives-c', th: ['cp', 'np', 'ng'], pop: 5 },
            { n: 'マレ首都散策', d: 'モルディブの首都', t: '観光', dur: 180, addr: 'マレ', area: 'maldives-c', th: ['sg', 'hs'], pop: 3 },
            { n: 'マンタ＆ジンベエ', d: 'スポット潜水で大物に出会う', t: '観光', dur: 240, addr: 'モルディブ', area: 'maldives-c', th: ['ex', 'np'], pop: 5, bk: true },
        ],
        hotels: [
            { n: 'コンラッド モルディブ ランガリ', addr: 'ランガリ島', area: 'maldives-c', price: 145000 },
            { n: 'シックスセンシズ ラーム', addr: 'ラーム環礁', area: 'maldives-c', price: 195000 },
            { n: 'パークハイアット モルディブ', addr: 'ハダハ', area: 'maldives-c', price: 110000 },
            { n: 'コモ・ココアアイランド', addr: 'マッカナフシ島', area: 'maldives-c', price: 165000 },
        ],
    },

    // ──────────── ボラボラ・タヒチ ────────────
    {
        id: 'bora-bora', name: 'タヒチ・ボラボラ', country: 'フランス領ポリネシア', region: 'overseas_oceania',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 40,
        themes: ['bc', 'cp', 'on', 'np'],
        areas: [
            { id: 'bora', name: 'ボラボラ' },
            { id: 'tahiti', name: 'タヒチ島' },
        ],
        spots: [
            { n: 'ボラボラ水上ヴィラ滞在', d: '南太平洋の楽園', t: '観光', dur: 600, addr: 'ボラボラ', area: 'bora', th: ['cp', 'bc', 'np'], pop: 5 },
            { n: 'マタイラビーチ', d: 'ボラボラ最高のビーチ', t: '観光', dur: 180, addr: 'ボラボラ', area: 'bora', th: ['bc', 'cp', 'np'], pop: 5 },
            { n: 'オテマヌ山', d: 'ボラボラのシンボル', t: '観光', dur: 120, addr: 'ボラボラ', area: 'bora', th: ['np', 'sg'], pop: 5 },
            { n: 'シャークレイ・スノーケル', d: 'サメと泳ぐ体験', t: '観光', dur: 240, addr: 'ボラボラ', area: 'bora', th: ['ex', 'cp'], pop: 5 },
            { n: 'パペーテ市場', d: 'タヒチの食と工芸', t: '観光', dur: 90, addr: 'パペーテ', area: 'tahiti', th: ['sg', 'gm', 'sp'], pop: 3 },
            { n: 'ファアラバイ展望台', d: 'タヒチ島の絶景', t: '観光', dur: 60, addr: 'タヒチ', area: 'tahiti', th: ['np'], pop: 3 },
            { n: 'スパ・タヒチアンマッサージ', d: 'モノイオイルの伝統スパ', t: 'その他', dur: 90, addr: 'ボラボラ', area: 'bora', th: ['on', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'フォーシーズンズ ボラボラ', addr: 'ボラボラ', area: 'bora', price: 195000 },
            { n: 'セントレジス ボラボラ リゾート', addr: 'ボラボラ', area: 'bora', price: 165000 },
            { n: 'ル メリディアン ボラボラ', addr: 'ボラボラ', area: 'bora', price: 95000 },
        ],
    },

    // ──────────── セーシェル ────────────
    {
        id: 'seychelles', name: 'セーシェル', country: 'セーシェル', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: '船', intra_gap_min: 40,
        themes: ['bc', 'cp', 'np', 'nt'],
        areas: [
            { id: 'mahe', name: 'マヘ島' },
            { id: 'praslin', name: 'プララン島' },
            { id: 'lade', name: 'ラ・ディーグ島' },
        ],
        spots: [
            { n: 'アンス・スルス・ダルジャン', d: '世界一美しいと称されるビーチ', t: '観光', dur: 180, addr: 'ラ・ディーグ', area: 'lade', th: ['bc', 'cp', 'np'], pop: 5 },
            { n: 'ヴァレ・ド・メイ', d: '世界遺産の自然保護区', t: '観光', dur: 150, addr: 'プララン', area: 'praslin', th: ['nt', 'wh', 'np'], pop: 5 },
            { n: 'アンスラジオビーチ', d: 'プララン島の天国', t: '観光', dur: 180, addr: 'プララン', area: 'praslin', th: ['bc', 'cp', 'np'], pop: 5 },
            { n: 'モーンセシェロワ国立公園', d: 'マヘ島の山岳ハイキング', t: '観光', dur: 240, addr: 'マヘ', area: 'mahe', th: ['nt', 'ex'], pop: 3 },
            { n: '巨大ゾウガメ保護区', d: 'セーシェル固有種', t: '観光', dur: 90, addr: 'プララン', area: 'praslin', th: ['nt', 'fm'], pop: 4 },
            { n: 'ココ・ド・メール', d: '世界最大の種子', t: '観光', dur: 60, addr: 'プララン', area: 'praslin', th: ['sg', 'nt'], pop: 3 },
        ],
        hotels: [
            { n: 'フォーシーズンズ リゾート セーシェル', addr: 'マヘ', area: 'mahe', price: 195000 },
            { n: 'コンスタンス・レモリア・セーシェル', addr: 'プララン', area: 'praslin', price: 145000 },
        ],
    },
]
