import type { DestinationEntry } from '../types'

// 中南米・アフリカ・中東追加 destination
// マチュピチュ・ウユニ・カイロ・モロッコ・サファリ

export const OVERSEAS_EXTRA_AMERICAS_AFRICA: DestinationEntry[] = [
    // ──────────── ペルー（マチュピチュ） ────────────
    {
        id: 'machu-picchu', name: 'マチュピチュ・クスコ', country: 'ペルー', region: 'overseas_america',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'np', 'nt'],
        areas: [
            { id: 'cusco', name: 'クスコ' },
            { id: 'mp', name: 'マチュピチュ' },
            { id: 'sacred-valley', name: '聖なる谷' },
        ],
        spots: [
            { n: 'マチュピチュ遺跡', d: '空中都市・インカ帝国の世界遺産', t: '観光', dur: 240, addr: 'マチュピチュ', area: 'mp', th: ['sg', 'hs', 'wh', 'np', 'nt'], pop: 5, bk: true },
            { n: 'ワイナピチュ', d: 'マチュピチュ正面の絶景の山', t: '観光', dur: 240, addr: 'マチュピチュ', area: 'mp', th: ['ex', 'np', 'sg'], pop: 4, bk: true },
            { n: 'クスコ・アルマス広場', d: 'インカ帝国の旧首都の中心', t: '観光', dur: 90, addr: 'クスコ', area: 'cusco', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'サクサイワマン', d: 'インカの巨石遺跡', t: '観光', dur: 120, addr: 'クスコ', area: 'cusco', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'マラス塩田・モライ', d: '段々塩田と円形遺跡', t: '観光', dur: 150, addr: '聖なる谷', area: 'sacred-valley', th: ['np', 'sg', 'hs'], pop: 4 },
            { n: 'オリャンタイタンボ', d: 'インカ時代の要塞遺跡', t: '観光', dur: 90, addr: '聖なる谷', area: 'sacred-valley', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ピサック遺跡', d: '聖なる谷の段々畑遺跡', t: '観光', dur: 120, addr: '聖なる谷', area: 'sacred-valley', th: ['sg', 'hs'], pop: 3 },
            { n: 'クイ（モルモット料理）', d: 'アンデス伝統料理の体験', t: 'グルメ', dur: 60, addr: 'クスコ', area: 'cusco', th: ['gm', 'hs', 'ex'], pop: 3 },
        ],
        hotels: [
            { n: 'ベルモンド・サンクチュアリ・ロッジ', addr: 'マチュピチュ', area: 'mp', price: 110000 },
            { n: 'ベルモンド・パラシオ・ナサレナス', addr: 'クスコ', area: 'cusco', price: 95000 },
            { n: 'JWマリオット クスコ', addr: 'クスコ', area: 'cusco', price: 38000 },
        ],
    },

    // ──────────── ウユニ塩湖 ────────────
    {
        id: 'uyuni', name: 'ウユニ塩湖', country: 'ボリビア', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'cp', 'ex'],
        areas: [
            { id: 'uyuni-c', name: 'ウユニ周辺' },
            { id: 'lapaz', name: 'ラパス' },
        ],
        spots: [
            { n: 'ウユニ塩湖（天空の鏡）', d: '世界一の絶景・水鏡', t: '観光', dur: 360, addr: 'ウユニ', area: 'uyuni-c', th: ['np', 'cp'], pop: 5 },
            { n: 'インカワシ島', d: 'ウユニ塩湖中のサボテン島', t: '観光', dur: 120, addr: 'ウユニ', area: 'uyuni-c', th: ['np', 'sg'], pop: 4 },
            { n: 'コルチャニ村塩工場', d: '伝統的な塩の精製', t: '観光', dur: 60, addr: 'ウユニ近郊', area: 'uyuni-c', th: ['sg', 'ex'], pop: 3 },
            { n: '夕日と星空のウユニ', d: '塩湖の星空観賞', t: '観光', dur: 180, addr: 'ウユニ', area: 'uyuni-c', th: ['np', 'cp'], pop: 5, eveningOk: true },
            { n: 'ラパス・ロープウェイ', d: '世界一高い都市のロープウェイ', t: '観光', dur: 60, addr: 'ラパス', area: 'lapaz', th: ['np', 'sg'], pop: 4 },
            { n: '月の谷', d: 'ラパス近郊の奇岩風景', t: '観光', dur: 90, addr: 'ラパス', area: 'lapaz', th: ['np'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテル・ルナサラダ（塩のホテル）', addr: 'ウユニ近郊', area: 'uyuni-c', price: 38000 },
            { n: 'パラシオ・デ・サル', addr: 'ウユニ近郊', area: 'uyuni-c', price: 32000 },
        ],
    },

    // ──────────── カンクン・リビエラマヤ ────────────
    {
        id: 'cancun', name: 'カンクン・リビエラマヤ', country: 'メキシコ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'タクシー', intra_gap_min: 40,
        themes: ['bc', 'sg', 'np', 'cp', 'fm'],
        areas: [
            { id: 'cancun-c', name: 'カンクン' },
            { id: 'tulum', name: 'トゥルム' },
            { id: 'chichen', name: 'チチェンイッツァ周辺' },
        ],
        spots: [
            { n: 'カンクンビーチ', d: 'カリブ海の白浜', t: '観光', dur: 180, addr: 'カンクン', area: 'cancun-c', th: ['bc', 'cp'], pop: 5 },
            { n: 'チチェンイッツァ遺跡', d: 'マヤ文明の世界遺産', t: '観光', dur: 240, addr: 'チチェンイッツァ', area: 'chichen', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'トゥルム遺跡', d: 'カリブ海を望むマヤ要塞', t: '観光', dur: 120, addr: 'トゥルム', area: 'tulum', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'セノーテ・イキル', d: '神秘的な地下泉', t: '観光', dur: 90, addr: 'チチェンイッツァ近郊', area: 'chichen', th: ['ex', 'np'], pop: 5 },
            { n: 'プラヤ・デル・カルメン', d: 'ショッピングとビーチ', t: '観光', dur: 180, addr: 'プラヤ', area: 'tulum', th: ['sp', 'bc'], pop: 4 },
            { n: 'シカレ・パーク', d: 'マヤ文化＋ビーチの大型パーク', t: '観光', dur: 360, addr: '近郊', area: 'tulum', th: ['fm', 'ex', 'sg'], pop: 4, bk: true },
            { n: 'コスメル島', d: 'ダイビングの聖地', t: '観光', dur: 240, addr: 'コスメル', area: 'cancun-c', th: ['bc', 'ex', 'np'], pop: 4 },
        ],
        hotels: [
            { n: 'リッツ・カールトン・カンクン', addr: 'カンクン', area: 'cancun-c', price: 85000 },
            { n: 'ロサ・ウォーター・リゾート', addr: 'リビエラマヤ', area: 'tulum', price: 58000 },
            { n: 'パラディーゾ・カンクン', addr: 'カンクン', area: 'cancun-c', price: 32000 },
        ],
    },

    // ──────────── エジプト ────────────
    {
        id: 'egypt', name: 'エジプト', country: 'エジプト', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'ar'],
        areas: [
            { id: 'cairo', name: 'カイロ' },
            { id: 'luxor', name: 'ルクソール' },
            { id: 'aswan', name: 'アスワン' },
        ],
        spots: [
            { n: 'ギザのピラミッド・スフィンクス', d: '世界遺産・古代エジプトの象徴', t: '観光', dur: 180, addr: 'ギザ', area: 'cairo', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'エジプト考古学博物館', d: 'ツタンカーメンの黄金マスク', t: '観光', dur: 180, addr: 'カイロ', area: 'cairo', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'ハーン・ハリーリ', d: '伝統市場・お土産の宝庫', t: '観光', dur: 120, addr: 'カイロ', area: 'cairo', th: ['sg', 'sp', 'gm'], pop: 4 },
            { n: 'カルナック神殿', d: '世界最大の宗教遺跡', t: '観光', dur: 180, addr: 'ルクソール', area: 'luxor', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '王家の谷', d: 'ツタンカーメンの墓', t: '観光', dur: 180, addr: 'ルクソール', area: 'luxor', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ハトシェプスト女王神殿', d: 'ナイル西岸の壮大な葬祭殿', t: '観光', dur: 120, addr: 'ルクソール', area: 'luxor', th: ['sg', 'hs'], pop: 4 },
            { n: 'アブシンベル神殿', d: 'ラムセス2世の岩窟神殿', t: '観光', dur: 180, addr: 'アスワン', area: 'aswan', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ナイル川クルーズ', d: 'ルクソール〜アスワンを船で', t: '観光', dur: 480, addr: 'ナイル川', area: 'luxor', th: ['sg', 'cp', 'np'], pop: 5, bk: true },
        ],
        hotels: [
            { n: 'マリオット メナハウス', addr: 'ギザ', area: 'cairo', price: 38000 },
            { n: 'ソフィテル・ウィンター・パレス・ルクソール', addr: 'ルクソール', area: 'luxor', price: 45000 },
            { n: 'オールド・カタラクト・アスワン', addr: 'アスワン', area: 'aswan', price: 52000 },
        ],
    },

    // ──────────── モロッコ ────────────
    {
        id: 'morocco', name: 'モロッコ', country: 'モロッコ', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'sp', 'ex'],
        areas: [
            { id: 'marrakech', name: 'マラケシュ' },
            { id: 'fes', name: 'フェズ' },
            { id: 'casablanca', name: 'カサブランカ' },
            { id: 'sahara', name: 'サハラ砂漠' },
        ],
        spots: [
            { n: 'マラケシュ・ジャマ・エル・フナ広場', d: '世界遺産の喧騒の広場', t: '観光', dur: 180, addr: 'マラケシュ', area: 'marrakech', th: ['sg', 'hs', 'wh', 'ng'], pop: 5 },
            { n: 'マジョレル庭園', d: 'YSLが愛したコバルトブルー', t: '観光', dur: 90, addr: 'マラケシュ', area: 'marrakech', th: ['ar', 'np', 'cp'], pop: 5 },
            { n: 'バヒア宮殿', d: 'マラケシュの宮殿建築', t: '観光', dur: 90, addr: 'マラケシュ', area: 'marrakech', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'フェズ旧市街（メディナ）', d: '世界最大の迷宮市場', t: '観光', dur: 240, addr: 'フェズ', area: 'fes', th: ['sg', 'hs', 'wh', 'sp'], pop: 5 },
            { n: 'タンネリ（皮なめし職人街）', d: 'フェズの伝統職人街', t: '観光', dur: 60, addr: 'フェズ', area: 'fes', th: ['sg', 'hs', 'ex'], pop: 4 },
            { n: 'サハラ砂漠ツアー', d: 'ラクダで砂漠の星空体験', t: '観光', dur: 600, addr: 'メルズーガ', area: 'sahara', th: ['ex', 'np', 'cp'], pop: 5, bk: true },
            { n: 'シャウエン青の街', d: '全てが青に塗られた街', t: '観光', dur: 240, addr: 'シャウエン', area: 'fes', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'カサブランカ・ハッサン2世モスク', d: '世界第3位の規模のモスク', t: '観光', dur: 90, addr: 'カサブランカ', area: 'casablanca', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: 'クスクスとタジン', d: 'モロッコ伝統料理', t: 'グルメ', dur: 90, addr: '各地', area: 'marrakech', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'ラ・マムーニア', addr: 'マラケシュ', area: 'marrakech', price: 95000 },
            { n: 'リヤード・ルンディ', addr: 'マラケシュ', area: 'marrakech', price: 28000 },
            { n: 'リヤード・ファス', addr: 'フェズ', area: 'fes', price: 32000 },
        ],
    },

    // ──────────── ケニア・タンザニアサファリ ────────────
    {
        id: 'safari', name: 'ケニア・タンザニアサファリ', country: 'ケニア/タンザニア', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['nt', 'np', 'ex', 'wh'],
        areas: [
            { id: 'masai-mara', name: 'マサイマラ' },
            { id: 'serengeti', name: 'セレンゲティ' },
            { id: 'ngoro', name: 'ンゴロンゴロ' },
        ],
        spots: [
            { n: 'マサイマラ国立保護区', d: 'ビッグ5が見られる聖地', t: '観光', dur: 480, addr: 'マサイマラ', area: 'masai-mara', th: ['nt', 'np', 'ex'], pop: 5 },
            { n: 'マサイ族の村訪問', d: '伝統的な遊牧民との交流', t: '観光', dur: 120, addr: 'マサイマラ', area: 'masai-mara', th: ['ex', 'sg'], pop: 4 },
            { n: 'セレンゲティ国立公園', d: '大移動の舞台・世界遺産', t: '観光', dur: 480, addr: 'セレンゲティ', area: 'serengeti', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'ンゴロンゴロ・クレーター', d: '巨大カルデラ内の自然保護区', t: '観光', dur: 360, addr: 'ンゴロンゴロ', area: 'ngoro', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: '気球サファリ', d: '空からの絶景体験', t: '観光', dur: 180, addr: 'マサイマラ/セレンゲティ', area: 'masai-mara', th: ['ex', 'np', 'cp'], pop: 4, bk: true },
            { n: 'キリマンジャロ山遠望', d: 'アフリカ最高峰の景観', t: '観光', dur: 60, addr: 'タンザニア', area: 'ngoro', th: ['np', 'nt'], pop: 4 },
        ],
        hotels: [
            { n: 'マサイマラ・サファリロッジ', addr: 'マサイマラ', area: 'masai-mara', price: 58000 },
            { n: 'フォーシーズンズ・サファリロッジ・セレンゲティ', addr: 'セレンゲティ', area: 'serengeti', price: 145000 },
            { n: 'ンゴロンゴロ・セレナ・サファリロッジ', addr: 'ンゴロンゴロ', area: 'ngoro', price: 65000 },
        ],
    },
]
