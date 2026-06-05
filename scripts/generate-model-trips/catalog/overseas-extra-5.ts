import type { DestinationEntry } from '../types'

// 海外追加 第5弾：アフリカ大幅拡充・中東・中央アジア（シルクロード）・南米追加

export const OVERSEAS_EXTRA_5: DestinationEntry[] = [
    // ──────────── エチオピア ────────────
    {
        id: 'ethiopia', name: 'エチオピア', country: 'エチオピア', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'nt'],
        areas: [
            { id: 'lalibela', name: 'ラリベラ' },
            { id: 'addis', name: 'アディスアベバ' },
            { id: 'axum', name: 'アクスム' },
        ],
        spots: [
            { n: 'ラリベラ岩窟教会群', d: '世界遺産・1枚岩を掘り抜いた11の教会', t: '観光', dur: 240, addr: 'ラリベラ', area: 'lalibela', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '聖ギオルギス教会', d: '十字架型の代表的岩窟教会', t: '観光', dur: 90, addr: 'ラリベラ', area: 'lalibela', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'アクスム遺跡', d: 'アクスム王国のオベリスク群', t: '観光', dur: 180, addr: 'アクスム', area: 'axum', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ゴンダール宮殿群', d: 'アフリカのキャメロット・世界遺産', t: '観光', dur: 180, addr: 'ゴンダール', area: 'addis', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'シミエン国立公園', d: '世界遺産の絶景山岳と希少動物', t: '観光', dur: 360, addr: 'シミエン', area: 'addis', th: ['np', 'nt', 'wh'], pop: 4 },
            { n: 'ダナキル砂漠', d: '世界最低地点の活火山地帯', t: '観光', dur: 480, addr: 'アファール', area: 'addis', th: ['np', 'nt', 'ex'], pop: 4 },
            { n: 'インジェラ＋ワット料理', d: '酸味のあるクレープと煮込み', t: 'グルメ', dur: 90, addr: '各地', area: 'addis', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'マリブ・ロッジ', addr: 'ラリベラ', area: 'lalibela', price: 32000 },
            { n: 'ヒルトン・アディスアベバ', addr: 'アディスアベバ', area: 'addis', price: 22000 },
        ],
    },

    // ──────────── ウガンダ・ルワンダ（ゴリラ） ────────────
    {
        id: 'uganda-rwanda', name: 'ウガンダ・ルワンダ', country: 'ウガンダ/ルワンダ', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['nt', 'np', 'ex', 'wh'],
        areas: [
            { id: 'bwindi', name: 'ブウィンディ' },
            { id: 'volcanoes', name: 'ボルケーノ国立公園' },
        ],
        spots: [
            { n: 'ブウィンディ原生国立公園・ゴリラトレッキング', d: 'マウンテンゴリラと至近距離で対面', t: '観光', dur: 480, addr: 'ブウィンディ', area: 'bwindi', th: ['nt', 'np', 'wh', 'ex'], pop: 5, bk: true },
            { n: 'ボルケーノ国立公園（ルワンダ）', d: 'ダイアン・フォッシーゆかりのゴリラ生息地', t: '観光', dur: 480, addr: 'ボルケーノ', area: 'volcanoes', th: ['nt', 'np', 'ex'], pop: 5, bk: true },
            { n: 'クイーンエリザベス国立公園', d: 'ライオン・象が見られるサバンナ', t: '観光', dur: 480, addr: 'カセセ', area: 'bwindi', th: ['nt', 'np'], pop: 4 },
            { n: 'キガリ虐殺記念館', d: 'ルワンダ虐殺の歴史を学ぶ', t: '観光', dur: 120, addr: 'キガリ', area: 'volcanoes', th: ['sg', 'hs'], pop: 4 },
            { n: 'ナイル川源流（ジンジャ）', d: '世界最長の川の始まり', t: '観光', dur: 240, addr: 'ジンジャ', area: 'bwindi', th: ['np', 'sg', 'ex'], pop: 4 },
        ],
        hotels: [
            { n: 'バンブー・ゴリラ・ロッジ', addr: 'ブウィンディ', area: 'bwindi', price: 58000 },
            { n: 'ワンアンドオンリー・ニュンウェ・ハウス', addr: 'ニュンウェ', area: 'volcanoes', price: 145000 },
        ],
    },

    // ──────────── ボツワナ（オカバンゴ・デルタ） ────────────
    {
        id: 'botswana', name: 'ボツワナ', country: 'ボツワナ', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['nt', 'np', 'wh', 'ex'],
        areas: [
            { id: 'okavango', name: 'オカバンゴ・デルタ' },
            { id: 'chobe', name: 'チョベ' },
        ],
        spots: [
            { n: 'オカバンゴ・デルタ', d: '世界遺産・砂漠の内陸三角州', t: '観光', dur: 480, addr: 'オカバンゴ', area: 'okavango', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'モコロ（丸木舟）クルーズ', d: 'オカバンゴを伝統舟で巡る', t: '観光', dur: 240, addr: 'オカバンゴ', area: 'okavango', th: ['ex', 'nt'], pop: 5 },
            { n: 'チョベ国立公園', d: '世界最大級の象の群れ', t: '観光', dur: 480, addr: 'チョベ', area: 'chobe', th: ['nt', 'np'], pop: 5 },
            { n: 'チョベ川クルーズ', d: '水辺の動物を船から観察', t: '観光', dur: 180, addr: 'チョベ', area: 'chobe', th: ['ex', 'nt', 'np'], pop: 5 },
            { n: 'マカディカディ塩湖', d: '世界最大級の塩原', t: '観光', dur: 480, addr: 'マカディカディ', area: 'okavango', th: ['np', 'nt'], pop: 4 },
        ],
        hotels: [
            { n: 'バンレンバ・キャンプ', addr: 'オカバンゴ', area: 'okavango', price: 195000 },
            { n: 'チョベ・ゲーム・ロッジ', addr: 'チョベ', area: 'chobe', price: 85000 },
        ],
    },

    // ──────────── キリマンジャロ（タンザニア登山） ────────────
    {
        id: 'kilimanjaro', name: 'キリマンジャロ', country: 'タンザニア', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 60,
        themes: ['nt', 'ex', 'np', 'wh'],
        areas: [
            { id: 'kili', name: 'キリマンジャロ国立公園' },
        ],
        spots: [
            { n: 'キリマンジャロ登山（マチャメルート）', d: 'アフリカ最高峰5895mへの登頂', t: '観光', dur: 720, addr: 'キリマンジャロ', area: 'kili', th: ['ex', 'np', 'wh'], pop: 5, bk: true },
            { n: 'ウフルピーク（山頂）', d: 'アフリカ大陸最高峰の頂', t: '観光', dur: 240, addr: 'キリマンジャロ', area: 'kili', th: ['np', 'ex'], pop: 5 },
            { n: 'モシの町', d: 'キリマンジャロの玄関口', t: '観光', dur: 180, addr: 'モシ', area: 'kili', th: ['sg', 'hs'], pop: 3 },
            { n: 'マラング・ゲート', d: '伝統的なコカコーラルート', t: '観光', dur: 180, addr: 'キリマンジャロ', area: 'kili', th: ['ex'], pop: 4 },
            { n: 'チャガ村文化体験', d: 'キリマンジャロ麓の先住民', t: '観光', dur: 180, addr: 'モシ', area: 'kili', th: ['ex', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'キリマンジャロ・ホワイト・ハウス', addr: 'モシ', area: 'kili', price: 18000 },
            { n: 'マラング・ロッジ', addr: 'マラング', area: 'kili', price: 22000 },
        ],
    },

    // ──────────── チュニジア ────────────
    {
        id: 'tunisia', name: 'チュニジア', country: 'チュニジア', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh', 'np'],
        areas: [
            { id: 'tunis', name: 'チュニス' },
            { id: 'carthage', name: 'カルタゴ' },
            { id: 'sahara-tn', name: 'サハラ・ドゥーズ' },
        ],
        spots: [
            { n: 'カルタゴ遺跡', d: '古代カルタゴの世界遺産', t: '観光', dur: 240, addr: 'チュニス近郊', area: 'carthage', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'シディ・ブ・サイド', d: '青と白の絶景村', t: '観光', dur: 120, addr: 'チュニス近郊', area: 'carthage', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'チュニス旧市街（メディナ）', d: 'スーク（市場）と路地の世界遺産', t: '観光', dur: 180, addr: 'チュニス', area: 'tunis', th: ['sg', 'hs', 'wh', 'sp'], pop: 4 },
            { n: 'バルドー博物館', d: '世界最大級のモザイク博物館', t: '観光', dur: 150, addr: 'チュニス', area: 'tunis', th: ['sg', 'ar', 'hs'], pop: 4 },
            { n: 'ドゥッガ遺跡', d: 'ローマ時代の世界遺産', t: '観光', dur: 180, addr: 'ドゥッガ', area: 'tunis', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: 'マトマタ穴居住居', d: 'スターウォーズロケ地', t: '観光', dur: 180, addr: 'マトマタ', area: 'sahara-tn', th: ['sg', 'ex'], pop: 4 },
            { n: 'サハラ砂漠ツアー', d: 'ラクダ縦走と星空', t: '観光', dur: 360, addr: 'ドゥーズ', area: 'sahara-tn', th: ['ex', 'np'], pop: 5, bk: true },
            { n: 'クスクス料理', d: '北アフリカ伝統料理', t: 'グルメ', dur: 90, addr: '各地', area: 'tunis', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'ダール・ベン・ガセム', addr: 'チュニス', area: 'tunis', price: 22000 },
            { n: 'ザ・レジデンス・チュニス', addr: 'チュニス', area: 'tunis', price: 35000 },
        ],
    },

    // ──────────── セネガル ────────────
    {
        id: 'senegal', name: 'セネガル', country: 'セネガル', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh', 'nt'],
        areas: [
            { id: 'dakar', name: 'ダカール' },
            { id: 'saint-louis', name: 'サン＝ルイ' },
        ],
        spots: [
            { n: 'ゴレ島', d: '奴隷貿易の世界遺産', t: '観光', dur: 240, addr: 'ダカール沖', area: 'dakar', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'アフリカ・ルネサンスの像', d: 'アフリカ最大の銅像', t: '観光', dur: 90, addr: 'ダカール', area: 'dakar', th: ['sg'], pop: 3 },
            { n: 'サン＝ルイ旧市街', d: 'フランス植民地時代の世界遺産', t: '観光', dur: 240, addr: 'サン＝ルイ', area: 'saint-louis', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'バンディア野生保護区', d: 'キリン・サイ等の動物観察', t: '観光', dur: 240, addr: 'バンディア', area: 'dakar', th: ['nt', 'fm'], pop: 4 },
            { n: 'ピンク湖（ラクローズ）', d: '塩分濃度が高くピンクに見える湖', t: '観光', dur: 180, addr: 'ラクローズ', area: 'dakar', th: ['np'], pop: 4 },
        ],
        hotels: [
            { n: 'ラディソン・ブルー・ダカール', addr: 'ダカール', area: 'dakar', price: 28000 },
            { n: 'ラ・レジデンス・サン＝ルイ', addr: 'サン＝ルイ', area: 'saint-louis', price: 18000 },
        ],
    },

    // ──────────── ガーナ ────────────
    {
        id: 'ghana', name: 'ガーナ', country: 'ガーナ', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh'],
        areas: [
            { id: 'accra', name: 'アクラ' },
            { id: 'cape-coast', name: 'ケープコースト' },
        ],
        spots: [
            { n: 'ケープコースト城', d: '奴隷貿易の世界遺産', t: '観光', dur: 180, addr: 'ケープコースト', area: 'cape-coast', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'エルミナ城', d: 'サハラ以南最古の欧州建築', t: '観光', dur: 150, addr: 'エルミナ', area: 'cape-coast', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'カクム国立公園キャノピーウォーク', d: '熱帯雨林の空中遊歩', t: '観光', dur: 180, addr: 'カクム', area: 'cape-coast', th: ['nt', 'ex', 'np'], pop: 5 },
            { n: 'ンクルマ廟', d: 'ガーナ初代大統領記念館', t: '観光', dur: 90, addr: 'アクラ', area: 'accra', th: ['sg', 'hs'], pop: 3 },
            { n: 'アクラのマカロ市場', d: '西アフリカ最大級の市場', t: '観光', dur: 120, addr: 'アクラ', area: 'accra', th: ['sg', 'sp'], pop: 3 },
        ],
        hotels: [
            { n: 'ケンピンスキー・ホテル・ゴールドコースト', addr: 'アクラ', area: 'accra', price: 22000 },
            { n: 'コークス・ベイ・リゾート', addr: 'ケープコースト', area: 'cape-coast', price: 18000 },
        ],
    },

    // ──────────── オマーン ────────────
    {
        id: 'oman', name: 'オマーン', country: 'オマーン', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['sg', 'np', 'nt', 'cp'],
        areas: [
            { id: 'muscat', name: 'マスカット' },
            { id: 'wahiba', name: 'ワヒバ砂漠' },
        ],
        spots: [
            { n: 'スルタン・カブース・グランド・モスク', d: '中東屈指の壮麗なモスク', t: '観光', dur: 120, addr: 'マスカット', area: 'muscat', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'ムトラ・スーク', d: 'マスカット旧市場・乳香の香り', t: '観光', dur: 90, addr: 'マスカット', area: 'muscat', th: ['sg', 'sp', 'gm'], pop: 5 },
            { n: 'ジャブリン城', d: '17世紀の城塞', t: '観光', dur: 90, addr: 'ジャブリン', area: 'muscat', th: ['sg', 'hs'], pop: 3 },
            { n: 'ワヒバ砂漠キャンプ', d: '黄金の砂丘でテント泊', t: '観光', dur: 480, addr: 'ワヒバ', area: 'wahiba', th: ['ex', 'np', 'cp'], pop: 5, bk: true },
            { n: 'ワディ・シャブ', d: 'エメラルドの渓谷ハイキング', t: '観光', dur: 240, addr: 'ティウィ', area: 'wahiba', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: 'ニズワ要塞', d: 'オマーン古都の世界遺産級城', t: '観光', dur: 120, addr: 'ニズワ', area: 'muscat', th: ['sg', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'シャングリラ・バー・アル・ジッサ・リゾート', addr: 'マスカット', area: 'muscat', price: 48000 },
            { n: 'デザート・ナイト・キャンプ', addr: 'ワヒバ', area: 'wahiba', price: 38000 },
        ],
    },

    // ──────────── サウジアラビア（アルウラ） ────────────
    {
        id: 'saudi', name: 'サウジアラビア', country: 'サウジアラビア', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'np'],
        areas: [
            { id: 'alula', name: 'アルウラ' },
            { id: 'riyadh', name: 'リヤド' },
        ],
        spots: [
            { n: 'マダイン・サーレハ（ヘグラ）', d: 'ペトラと同じナバテア人の世界遺産', t: '観光', dur: 240, addr: 'アルウラ', area: 'alula', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'エレファント・ロック', d: '象の形をした巨大奇岩', t: '観光', dur: 90, addr: 'アルウラ', area: 'alula', th: ['np', 'sg'], pop: 5 },
            { n: 'アルウラ旧市街', d: '砂漠のオアシス古都', t: '観光', dur: 180, addr: 'アルウラ', area: 'alula', th: ['sg', 'hs'], pop: 4 },
            { n: 'マラヤ・コンサートホール', d: '世界最大の鏡張り建築', t: '観光', dur: 90, addr: 'アルウラ', area: 'alula', th: ['ar', 'sg'], pop: 4 },
            { n: 'ディルイーヤ歴史地区', d: 'リヤド近郊の世界遺産', t: '観光', dur: 180, addr: 'リヤド近郊', area: 'riyadh', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: 'キングダム・センター', d: 'リヤドの近代摩天楼', t: '観光', dur: 90, addr: 'リヤド', area: 'riyadh', th: ['sg', 'np', 'ng'], pop: 3 },
        ],
        hotels: [
            { n: 'ハビタス・アルウラ', addr: 'アルウラ', area: 'alula', price: 95000 },
            { n: 'リッツ・カールトン・リヤド', addr: 'リヤド', area: 'riyadh', price: 42000 },
        ],
    },

    // ──────────── レバノン ────────────
    {
        id: 'lebanon', name: 'レバノン', country: 'レバノン', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'wh', 'gm'],
        areas: [
            { id: 'beirut', name: 'ベイルート' },
            { id: 'baalbek', name: 'バールベック' },
        ],
        spots: [
            { n: 'バールベック遺跡', d: 'ローマ時代最大級の神殿遺跡（世界遺産）', t: '観光', dur: 240, addr: 'バールベック', area: 'baalbek', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ジェイタ洞窟', d: '世界遺産候補のカルスト洞窟', t: '観光', dur: 180, addr: 'ジェイタ', area: 'beirut', th: ['np', 'sg'], pop: 5 },
            { n: 'ビブロス遺跡', d: '世界最古の継続居住都市', t: '観光', dur: 180, addr: 'ビブロス', area: 'beirut', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ベイルート国立博物館', d: 'フェニキア人の至宝', t: '観光', dur: 120, addr: 'ベイルート', area: 'beirut', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'ロックスオブラウシェ', d: 'ベイルートのシンボル奇岩', t: '観光', dur: 60, addr: 'ベイルート', area: 'beirut', th: ['np', 'cp'], pop: 4 },
            { n: 'レバノン料理（メゼ）', d: '中東料理の至宝', t: 'グルメ', dur: 120, addr: '各地', area: 'beirut', th: ['gm', 'hs'], pop: 5 },
        ],
        hotels: [
            { n: 'ル・グレイ・ベイルート', addr: 'ベイルート', area: 'beirut', price: 32000 },
            { n: 'シャトー・サン・トーマ', addr: 'バトロン', area: 'beirut', price: 22000 },
        ],
    },

    // ──────────── カタール ────────────
    {
        id: 'qatar', name: 'カタール', country: 'カタール', region: 'overseas_middleeast',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 30,
        themes: ['sg', 'ar', 'sp', 'ng', 'np'],
        areas: [{ id: 'doha', name: 'ドーハ' }],
        spots: [
            { n: 'イスラム美術館', d: 'I.M.ペイ設計の傑作', t: '観光', dur: 180, addr: 'ドーハ', area: 'doha', th: ['sg', 'ar', 'hs'], pop: 5 },
            { n: 'スーク・ワキフ', d: '伝統的バザール', t: '観光', dur: 180, addr: 'ドーハ', area: 'doha', th: ['sg', 'sp', 'gm'], pop: 5 },
            { n: 'ザ・パール・カタール', d: '人工島の高級リゾート', t: '観光', dur: 180, addr: 'ドーハ', area: 'doha', th: ['sg', 'sp', 'cp'], pop: 4 },
            { n: 'コーニッシュ通り', d: '海岸プロムナードと夜景', t: '観光', dur: 120, addr: 'ドーハ', area: 'doha', th: ['cp', 'ng', 'np'], pop: 4 },
            { n: 'カタール国立博物館', d: '砂漠のバラを模した建築', t: '観光', dur: 150, addr: 'ドーハ', area: 'doha', th: ['ar', 'sg'], pop: 4 },
            { n: 'デザート・サファリ（ハロル・アディード）', d: '内陸海と砂漠', t: '観光', dur: 360, addr: 'ハロル・アディード', area: 'doha', th: ['ex', 'np'], pop: 5, bk: true },
        ],
        hotels: [
            { n: 'マンダリン・オリエンタル・ドーハ', addr: 'ドーハ', area: 'doha', price: 58000 },
            { n: 'セント・レジス・ドーハ', addr: 'ドーハ', area: 'doha', price: 48000 },
        ],
    },

    // ──────────── ウズベキスタン（シルクロード） ────────────
    {
        id: 'uzbekistan', name: 'ウズベキスタン', country: 'ウズベキスタン', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'ar'],
        areas: [
            { id: 'samarkand', name: 'サマルカンド' },
            { id: 'bukhara', name: 'ブハラ' },
            { id: 'khiva', name: 'ヒヴァ' },
        ],
        spots: [
            { n: 'レギスタン広場', d: 'サマルカンドの青い世界遺産', t: '観光', dur: 240, addr: 'サマルカンド', area: 'samarkand', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'ビビハニム・モスク', d: 'ティムールが愛した妃の名を冠す', t: '観光', dur: 90, addr: 'サマルカンド', area: 'samarkand', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'シャーヒズインダ廟', d: '青のタイルの霊廟群', t: '観光', dur: 120, addr: 'サマルカンド', area: 'samarkand', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ブハラ旧市街', d: '中央アジア最大級の世界遺産旧市街', t: '観光', dur: 240, addr: 'ブハラ', area: 'bukhara', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'カラーン・ミナレット', d: 'チンギスハンが見逃した塔', t: '観光', dur: 60, addr: 'ブハラ', area: 'bukhara', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ヒヴァ・イチャンカラ', d: '城壁内の世界遺産旧市街', t: '観光', dur: 240, addr: 'ヒヴァ', area: 'khiva', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ウズベキスタン・プロフ（料理）', d: '中央アジアの炊き込み米', t: 'グルメ', dur: 90, addr: '各地', area: 'samarkand', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'レギスタン・プラザ・ホテル', addr: 'サマルカンド', area: 'samarkand', price: 22000 },
            { n: 'カラーン・ブティック・ホテル', addr: 'ブハラ', area: 'bukhara', price: 18000 },
        ],
    },

    // ──────────── ジョージア（コーカサス） ────────────
    {
        id: 'georgia', name: 'ジョージア', country: 'ジョージア', region: 'overseas_europe',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'np', 'gm'],
        areas: [
            { id: 'tbilisi', name: 'トビリシ' },
            { id: 'kazbegi', name: 'カズベギ' },
        ],
        spots: [
            { n: 'トビリシ旧市街', d: 'カラフルな家並みと温泉街', t: '観光', dur: 240, addr: 'トビリシ', area: 'tbilisi', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'ナリカラ要塞', d: 'トビリシを見下ろす古代要塞', t: '観光', dur: 120, addr: 'トビリシ', area: 'tbilisi', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: 'ゲルゲティ三位一体教会', d: 'コーカサスの絶景教会', t: '観光', dur: 240, addr: 'カズベギ', area: 'kazbegi', th: ['sg', 'np', 'hs', 'wh'], pop: 5 },
            { n: 'ムツヘタ', d: 'ジョージアの宗教的中心・世界遺産', t: '観光', dur: 180, addr: 'ムツヘタ', area: 'tbilisi', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ウプリスツィヘ', d: '岩窟都市遺跡', t: '観光', dur: 180, addr: 'ウプリスツィヘ', area: 'tbilisi', th: ['sg', 'hs'], pop: 4 },
            { n: 'ハチャプリ（ジョージア料理）', d: '舟形チーズパン', t: 'グルメ', dur: 75, addr: '各地', area: 'tbilisi', th: ['gm'], pop: 5 },
            { n: 'カヘティワイナリー', d: '世界最古のワイン産地', t: 'グルメ', dur: 240, addr: 'カヘティ', area: 'tbilisi', th: ['gm', 'ex', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: 'ストーリーズ・ホテル・トビリシ', addr: 'トビリシ', area: 'tbilisi', price: 22000 },
            { n: 'ルームズ・ホテル・カズベギ', addr: 'カズベギ', area: 'kazbegi', price: 28000 },
        ],
    },

    // ──────────── イラン ────────────
    {
        id: 'iran', name: 'イラン', country: 'イラン', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['sg', 'hs', 'wh', 'ar'],
        areas: [
            { id: 'tehran', name: 'テヘラン' },
            { id: 'isfahan', name: 'イスファハン' },
            { id: 'persepolis', name: 'ペルセポリス' },
        ],
        spots: [
            { n: 'イマーム広場（イスファハン）', d: '世界遺産・ペルシア建築の傑作', t: '観光', dur: 240, addr: 'イスファハン', area: 'isfahan', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'シェイク・ロトフォラ・モスク', d: 'イマーム広場の青いタイル', t: '観光', dur: 90, addr: 'イスファハン', area: 'isfahan', th: ['sg', 'ar', 'wh'], pop: 5 },
            { n: 'ペルセポリス遺跡', d: 'アケメネス朝ペルシアの世界遺産', t: '観光', dur: 240, addr: 'ペルセポリス', area: 'persepolis', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'シーラーズ・ナシール・アル・モルク・モスク', d: 'ピンクモスクのステンドグラス', t: '観光', dur: 90, addr: 'シーラーズ', area: 'persepolis', th: ['sg', 'ar', 'cp'], pop: 5 },
            { n: 'テヘラン国立博物館', d: 'ペルシア文明の至宝', t: '観光', dur: 180, addr: 'テヘラン', area: 'tehran', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'ヤズド旧市街', d: '砂漠の風塔の世界遺産', t: '観光', dur: 240, addr: 'ヤズド', area: 'isfahan', th: ['sg', 'hs', 'wh'], pop: 5 },
        ],
        hotels: [
            { n: 'アバシ・ホテル・イスファハン', addr: 'イスファハン', area: 'isfahan', price: 32000 },
            { n: 'エスピナス・パレス・テヘラン', addr: 'テヘラン', area: 'tehran', price: 22000 },
        ],
    },

    // ──────────── アタカマ砂漠（チリ） ────────────
    {
        id: 'atacama', name: 'アタカマ砂漠', country: 'チリ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['np', 'nt', 'ex'],
        areas: [{ id: 'atacama-c', name: 'サン・ペドロ・デ・アタカマ' }],
        spots: [
            { n: 'ムーン・バレー（月の谷）', d: '月面のような奇景', t: '観光', dur: 240, addr: 'サン・ペドロ', area: 'atacama-c', th: ['np', 'cp'], pop: 5 },
            { n: 'タティオ間欠泉', d: '世界第3の標高の間欠泉群', t: '観光', dur: 360, addr: 'タティオ', area: 'atacama-c', th: ['np', 'ex'], pop: 5 },
            { n: 'チャクサ・ラグーン', d: 'フラミンゴの塩湖', t: '観光', dur: 180, addr: 'アタカマ塩湖', area: 'atacama-c', th: ['np', 'nt'], pop: 4 },
            { n: 'ALMA天文台見学', d: '世界最高峰の電波望遠鏡群', t: '観光', dur: 180, addr: 'アタカマ', area: 'atacama-c', th: ['sg', 'ex'], pop: 4 },
            { n: '星空観賞', d: '世界一の透明度の夜空', t: '観光', dur: 180, addr: 'アタカマ', area: 'atacama-c', th: ['np', 'cp', 'ex'], pop: 5 },
        ],
        hotels: [
            { n: 'ティエラ・アタカマ・ホテル', addr: 'サン・ペドロ', area: 'atacama-c', price: 95000 },
            { n: 'アルト・アタカマ・デザートロッジ', addr: 'サン・ペドロ', area: 'atacama-c', price: 85000 },
        ],
    },

    // ──────────── コロンビア・ボゴタ ────────────
    {
        id: 'colombia-bogota', name: 'ボゴタ・コロンビア', country: 'コロンビア', region: 'overseas_america',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 25,
        themes: ['sg', 'gm', 'ar', 'cp'],
        areas: [{ id: 'bogota', name: 'ボゴタ' }],
        spots: [
            { n: 'ラ・カンデラリア地区', d: 'ボゴタ旧市街', t: '観光', dur: 180, addr: 'ボゴタ', area: 'bogota', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'モンセラーテの丘', d: 'ボゴタを見下ろす展望台', t: '観光', dur: 180, addr: 'ボゴタ', area: 'bogota', th: ['np', 'sg'], pop: 5 },
            { n: '黄金博物館', d: '世界最大級のプレコロンビア金器', t: '観光', dur: 150, addr: 'ボゴタ', area: 'bogota', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'シパキラの塩の大聖堂', d: '岩塩坑内の地下大聖堂', t: '観光', dur: 240, addr: 'シパキラ', area: 'bogota', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: 'ボテロ博物館', d: 'ボリビア生まれの太った人物画', t: '観光', dur: 120, addr: 'ボゴタ', area: 'bogota', th: ['ar', 'sg'], pop: 4 },
            { n: 'コロンビアコーヒー', d: '本場のコーヒー文化', t: 'グルメ', dur: 90, addr: 'ボゴタ', area: 'bogota', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'JWマリオット・ホテル・ボゴタ', addr: 'ボゴタ', area: 'bogota', price: 32000 },
            { n: 'カサ・サンタクララ', addr: 'ボゴタ旧市街', area: 'bogota', price: 18000 },
        ],
    },

    // ──────────── ベリーズ（マヤ＋海） ────────────
    {
        id: 'belize', name: 'ベリーズ', country: 'ベリーズ', region: 'overseas_america',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 60,
        themes: ['bc', 'nt', 'wh', 'np'],
        areas: [
            { id: 'caye', name: 'キーカーカー' },
            { id: 'tikal', name: 'ティカル方面' },
        ],
        spots: [
            { n: 'グレートブルーホール', d: '深海に開いた円形の海洋洞窟', t: '観光', dur: 360, addr: 'ライトハウスリーフ', area: 'caye', th: ['np', 'ex', 'wh'], pop: 5, bk: true },
            { n: 'キーカーカー島', d: 'ベリーズのリラックスビーチ', t: '観光', dur: 240, addr: 'キーカーカー', area: 'caye', th: ['bc', 'cp', 'np'], pop: 5 },
            { n: 'シューネー古代マヤ遺跡', d: '神秘的なマヤ遺跡', t: '観光', dur: 240, addr: 'シューネー', area: 'tikal', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'カラコル遺跡', d: 'ジャングルのマヤ大都市', t: '観光', dur: 360, addr: 'カラコル', area: 'tikal', th: ['sg', 'hs', 'wh', 'nt'], pop: 4 },
            { n: 'ATM洞窟（アクトゥンチュニチル）', d: 'マヤ生贄遺跡の洞窟', t: '観光', dur: 360, addr: 'ATM洞窟', area: 'tikal', th: ['ex', 'hs', 'nt'], pop: 5 },
        ],
        hotels: [
            { n: 'ターネック・カイ・リゾート', addr: 'キーカーカー', area: 'caye', price: 38000 },
            { n: 'チャア・クリーク・リゾート', addr: 'サン・イグナシオ', area: 'tikal', price: 42000 },
        ],
    },
]
