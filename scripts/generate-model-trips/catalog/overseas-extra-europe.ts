import type { DestinationEntry } from '../types'

// ヨーロッパ周遊で必要な追加 destination
// フィレンツェ、ベネチア、ミラノ、マドリード、リスボン、スイス、ブダペスト、
// コペンハーゲン、ストックホルム、ザルツブルク、レイキャビク

export const OVERSEAS_EXTRA_EUROPE: DestinationEntry[] = [
    // ──────────── フィレンツェ ────────────
    {
        id: 'florence', name: 'フィレンツェ', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['ar', 'hs', 'wh', 'sg', 'gm'],
        areas: [
            { id: 'duomo', name: 'ドゥオモ周辺' },
            { id: 'oltrarno', name: 'オルトラルノ' },
        ],
        spots: [
            { n: 'フィレンツェ大聖堂（ドゥオモ）', d: 'クーポラと洗礼堂の世界遺産', t: '観光', dur: 120, addr: '中心部', area: 'duomo', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'ウフィツィ美術館', d: 'ボッティチェリ・ダヴィンチ・カラヴァッジョ', t: '観光', dur: 180, addr: 'ウフィツィ', area: 'duomo', th: ['ar', 'wh'], pop: 5, bk: true },
            { n: 'ヴェッキオ橋', d: 'アルノ川に架かる宝石店の橋', t: '観光', dur: 45, addr: '中心部', area: 'duomo', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'シニョーリア広場', d: '彫刻と政治の歴史広場', t: '観光', dur: 60, addr: '中心部', area: 'duomo', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'アカデミア美術館（ダヴィデ像）', d: 'ミケランジェロのダヴィデ像', t: '観光', dur: 90, addr: '中心部', area: 'duomo', th: ['ar', 'wh'], pop: 5, bk: true },
            { n: 'ピッティ宮殿', d: 'メディチ家の宮殿と庭園', t: '観光', dur: 120, addr: 'オルトラルノ', area: 'oltrarno', th: ['ar', 'hs'], pop: 4 },
            { n: 'ミケランジェロ広場', d: 'フィレンツェ全景のパノラマ', t: '観光', dur: 45, addr: 'オルトラルノ', area: 'oltrarno', th: ['np', 'cp', 'ng'], pop: 5 },
            { n: 'サン・ロレンツォ中央市場', d: 'トスカーナ食材と老舗', t: 'グルメ', dur: 75, addr: '中心部', area: 'duomo', th: ['gm', 'sg'], pop: 4 },
            { n: 'トラットリア・ザザ', d: 'フィレンツェの名店ステーキ', t: 'グルメ', dur: 90, addr: '中央市場前', area: 'duomo', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'フォーシーズンズホテル フィレンツェ', addr: '中心部', area: 'duomo', price: 95000 },
            { n: 'ホテル サヴォイ', addr: '中心部', area: 'duomo', price: 58000 },
            { n: 'ホテル スパダイ', addr: '中心部', area: 'duomo', price: 35000 },
        ],
    },

    // ──────────── ベネチア ────────────
    {
        id: 'venice', name: 'ベネチア', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['sg', 'hs', 'wh', 'cp', 'np'],
        areas: [
            { id: 'san-marco', name: 'サンマルコ周辺' },
            { id: 'rialto', name: 'リアルト橋周辺' },
        ],
        spots: [
            { n: 'サン・マルコ広場', d: 'ナポレオンが「世界一美しい客間」と称した広場', t: '観光', dur: 90, addr: 'サンマルコ', area: 'san-marco', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'サン・マルコ寺院', d: 'ビザンチン様式の黄金モザイク', t: '観光', dur: 90, addr: 'サンマルコ', area: 'san-marco', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'ドゥカーレ宮殿', d: 'ベネチア共和国の総督宮殿', t: '観光', dur: 120, addr: 'サンマルコ', area: 'san-marco', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'リアルト橋', d: 'カナル・グランデの石造アーチ橋', t: '観光', dur: 45, addr: 'リアルト', area: 'rialto', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'ゴンドラクルーズ', d: 'ベネチア定番の運河巡り', t: '観光', dur: 60, addr: 'リアルト周辺', area: 'rialto', th: ['cp', 'sg', 'ex'], pop: 5 },
            { n: 'ブラーノ島', d: 'カラフルな家並みの島', t: '観光', dur: 180, addr: 'ブラーノ島', area: 'rialto', th: ['np', 'cp', 'sg'], pop: 5 },
            { n: 'ムラーノ島', d: 'ベネチアン・グラスの島', t: '観光', dur: 120, addr: 'ムラーノ島', area: 'rialto', th: ['sg', 'ar'], pop: 4 },
            { n: 'リアルト市場', d: 'ベネチア最古の生鮮市場', t: 'グルメ', dur: 60, addr: 'リアルト', area: 'rialto', th: ['gm', 'sg'], pop: 3 },
            { n: 'ハリーズ・バー', d: 'ベリーニ発祥の老舗バー', t: 'グルメ', dur: 60, addr: 'サンマルコ', area: 'san-marco', th: ['gm', 'cp', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'ベルモンド ホテル チプリアーニ', addr: 'ジュデッカ島', area: 'san-marco', price: 130000 },
            { n: 'ホテル ダニエリ', addr: 'サンマルコ', area: 'san-marco', price: 85000 },
            { n: 'ヒルトン ベネチア', addr: 'ジュデッカ島', area: 'san-marco', price: 48000 },
        ],
    },

    // ──────────── ミラノ ────────────
    {
        id: 'milan', name: 'ミラノ', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 25,
        themes: ['sg', 'sp', 'ar', 'gm', 'wh'],
        areas: [
            { id: 'duomo-mi', name: 'ドゥオモ周辺' },
            { id: 'navigli', name: 'ナヴィリ' },
        ],
        spots: [
            { n: 'ミラノ大聖堂', d: 'ゴシック建築の傑作・屋上テラス', t: '観光', dur: 120, addr: '中心部', area: 'duomo-mi', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'ヴィットーリオ・エマヌエーレ2世のガッレリア', d: '世界最古のアーケード', t: '観光', dur: 60, addr: '中心部', area: 'duomo-mi', th: ['sp', 'sg', 'hs'], pop: 5 },
            { n: '最後の晩餐（サンタ・マリア・デッレ・グラーツィエ）', d: 'ダヴィンチの傑作', t: '観光', dur: 60, addr: '中心部', area: 'duomo-mi', th: ['ar', 'hs', 'wh'], pop: 5, bk: true },
            { n: 'スフォルツェスコ城', d: 'ミラノの歴史を物語る城塞', t: '観光', dur: 90, addr: '中心部', area: 'duomo-mi', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'ブレラ美術館', d: 'ロンバルディア絵画の至宝', t: '観光', dur: 120, addr: '中心部', area: 'duomo-mi', th: ['ar', 'hs'], pop: 3 },
            { n: 'スカラ座', d: '世界最高峰のオペラハウス', t: '観光', dur: 60, addr: '中心部', area: 'duomo-mi', th: ['sg', 'ar', 'hs'], pop: 3 },
            { n: 'ナヴィリ運河', d: '夜カフェ・バルが連なる水辺', t: '観光', dur: 90, addr: 'ナヴィリ', area: 'navigli', th: ['cp', 'gm', 'ng'], pop: 4 },
            { n: 'モンテナポレオーネ通り', d: '世界最高級ブランド街', t: '観光', dur: 90, addr: '中心部', area: 'duomo-mi', th: ['sp'], pop: 3 },
        ],
        hotels: [
            { n: 'パークハイアットミラノ', addr: '中心部', area: 'duomo-mi', price: 78000 },
            { n: 'ブルガリホテル ミラノ', addr: '中心部', area: 'duomo-mi', price: 95000 },
            { n: 'NHコレクション ミラノ ポルタ ヌオーヴァ', addr: '中心部', area: 'duomo-mi', price: 32000 },
        ],
    },

    // ──────────── マドリード ────────────
    {
        id: 'madrid', name: 'マドリード', country: 'スペイン', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 25,
        themes: ['sg', 'ar', 'gm', 'hs'],
        areas: [
            { id: 'prado', name: 'プラド周辺' },
            { id: 'centro', name: 'マヨール広場周辺' },
        ],
        spots: [
            { n: 'プラド美術館', d: 'ベラスケス・ゴヤ・エル・グレコ', t: '観光', dur: 180, addr: 'プラド', area: 'prado', th: ['ar', 'hs'], pop: 5 },
            { n: 'ソフィア王妃芸術センター', d: 'ピカソのゲルニカ', t: '観光', dur: 120, addr: 'プラド', area: 'prado', th: ['ar', 'cp'], pop: 4 },
            { n: 'マヨール広場', d: 'スペイン王朝の中心広場', t: '観光', dur: 60, addr: '中心部', area: 'centro', th: ['sg', 'hs'], pop: 4 },
            { n: '王宮（パラシオ・レアル）', d: 'スペイン王室の宮殿', t: '観光', dur: 120, addr: '中心部', area: 'centro', th: ['sg', 'hs'], pop: 4 },
            { n: 'グラン・ビア', d: 'マドリードの目抜き通り', t: '観光', dur: 90, addr: '中心部', area: 'centro', th: ['sp', 'sg'], pop: 4 },
            { n: 'レティーロ公園', d: 'マドリードの中央公園', t: '観光', dur: 75, addr: 'プラド', area: 'prado', th: ['cp', 'np'], pop: 3 },
            { n: 'メルカード・サン・ミゲル', d: '老舗鉄骨市場のグルメ集積', t: 'グルメ', dur: 75, addr: '中心部', area: 'centro', th: ['gm', 'sg'], pop: 5 },
            { n: 'ボティン（世界最古のレストラン）', d: 'ヘミングウェイも訪れた老舗', t: 'グルメ', dur: 90, addr: '中心部', area: 'centro', th: ['gm', 'hs'], pop: 4, bk: true },
            { n: 'チョコラテリア・サン・ヒネス', d: '名物チュロスとチョコレート', t: 'グルメ', dur: 30, addr: '中心部', area: 'centro', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'マンダリンオリエンタル リッツ マドリード', addr: '中心部', area: 'prado', price: 95000 },
            { n: 'フォーシーズンズホテル マドリード', addr: '中心部', area: 'centro', price: 88000 },
            { n: 'ホテル ウェリントン', addr: '中心部', area: 'prado', price: 42000 },
        ],
    },

    // ──────────── リスボン ────────────
    {
        id: 'lisbon', name: 'リスボン', country: 'ポルトガル', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 25,
        themes: ['sg', 'hs', 'gm', 'wh', 'cp'],
        areas: [
            { id: 'alfama', name: 'アルファマ' },
            { id: 'belem', name: 'ベレン地区' },
        ],
        spots: [
            { n: 'ベレンの塔', d: '大航海時代のシンボル世界遺産', t: '観光', dur: 75, addr: 'ベレン', area: 'belem', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ジェロニモス修道院', d: 'マヌエル様式の世界遺産', t: '観光', dur: 90, addr: 'ベレン', area: 'belem', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'アルファマ地区', d: 'リスボン最古のファド発祥の街', t: '観光', dur: 120, addr: 'アルファマ', area: 'alfama', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'サン・ジョルジェ城', d: 'リスボンを見下ろす要塞', t: '観光', dur: 90, addr: 'アルファマ', area: 'alfama', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '28番トラム', d: 'アルファマを巡る黄色い路面電車', t: '観光', dur: 60, addr: 'アルファマ', area: 'alfama', th: ['sg', 'cp'], pop: 5 },
            { n: 'ロカ岬', d: 'ユーラシア大陸最西端', t: '観光', dur: 90, addr: '近郊', area: 'belem', th: ['np', 'sg'], pop: 4 },
            { n: 'シントラ・ペナ宮殿', d: 'カラフルな世界遺産', t: '観光', dur: 180, addr: 'シントラ', area: 'belem', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'パステイス・デ・ベレン', d: 'エッグタルト発祥店', t: 'グルメ', dur: 45, addr: 'ベレン', area: 'belem', th: ['gm', 'hs'], pop: 5 },
            { n: 'タイムアウト・マーケット', d: 'ポルトガル料理が集まる', t: 'グルメ', dur: 90, addr: 'リベイラ', area: 'alfama', th: ['gm', 'sg'], pop: 4 },
        ],
        hotels: [
            { n: 'フォーシーズンズ ホテル リッツ リスボン', addr: '中心部', area: 'alfama', price: 75000 },
            { n: 'ハーフ ザ ワン パレス', addr: '中心部', area: 'alfama', price: 38000 },
            { n: 'ホテル アヴェニーダ パレス', addr: '中心部', area: 'alfama', price: 22000 },
        ],
    },

    // ──────────── ポルト ────────────
    {
        id: 'porto', name: 'ポルト', country: 'ポルトガル', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'gm', 'hs', 'cp', 'wh'],
        areas: [
            { id: 'ribeira', name: 'リベイラ' },
            { id: 'vila-nova', name: 'ヴィラ・ノヴァ・デ・ガイア' },
        ],
        spots: [
            { n: 'リベイラ地区', d: 'ドウロ川沿いの世界遺産', t: '観光', dur: 90, addr: 'リベイラ', area: 'ribeira', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'ドン・ルイス1世橋', d: 'エッフェル弟子の鉄橋', t: '観光', dur: 45, addr: 'リベイラ', area: 'ribeira', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'レロ書店', d: '世界一美しい本屋の一つ', t: '観光', dur: 60, addr: '中心部', area: 'ribeira', th: ['sg', 'ar', 'cp'], pop: 5 },
            { n: 'クレリゴス教会・塔', d: 'バロックの鐘楼で街を一望', t: '観光', dur: 75, addr: '中心部', area: 'ribeira', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: 'サン・ベント駅', d: 'アズレージョ装飾の駅舎', t: '観光', dur: 45, addr: '中心部', area: 'ribeira', th: ['sg', 'ar'], pop: 4 },
            { n: 'ポートワイナリー巡り（ガイア地区）', d: '名物ポートワインの試飲', t: 'グルメ', dur: 120, addr: 'ガイア', area: 'vila-nova', th: ['gm', 'cp', 'hs'], pop: 5 },
            { n: 'ボリャオン市場', d: 'ポルトの伝統市場', t: 'グルメ', dur: 60, addr: '中心部', area: 'ribeira', th: ['gm', 'sg'], pop: 3 },
            { n: 'マジェスティック カフェ', d: 'ハリポタ作者ゆかりのカフェ', t: 'グルメ', dur: 60, addr: '中心部', area: 'ribeira', th: ['gm', 'hs', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'ザ・イェオマン・ライアン パレス', addr: '中心部', area: 'ribeira', price: 38000 },
            { n: 'ペスタナ ポルト', addr: 'リベイラ', area: 'ribeira', price: 25000 },
        ],
    },

    // ──────────── スイス（インターラーケン中心の周遊型） ────────────
    {
        id: 'switzerland', name: 'スイス', country: 'スイス', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 30,
        themes: ['np', 'nt', 'sg', 'cp', 'wh'],
        areas: [
            { id: 'interlaken', name: 'インターラーケン' },
            { id: 'lucerne', name: 'ルツェルン' },
            { id: 'zermatt', name: 'ツェルマット' },
            { id: 'zurich', name: 'チューリッヒ' },
        ],
        spots: [
            { n: 'ユングフラウヨッホ（トップ・オブ・ヨーロッパ）', d: '標高3,454mの絶景展望台', t: '観光', dur: 240, addr: 'インターラーケン', area: 'interlaken', th: ['np', 'wh', 'sg'], pop: 5 },
            { n: 'グリンデルワルト', d: 'アルプスの絵本のような村', t: '観光', dur: 180, addr: 'グリンデルワルト', area: 'interlaken', th: ['np', 'cp', 'sg'], pop: 5 },
            { n: 'ラウターブルンネン', d: '滝が連なる絶景の谷', t: '観光', dur: 120, addr: 'ラウターブルンネン', area: 'interlaken', th: ['np', 'nt'], pop: 4 },
            { n: 'カペル橋（ルツェルン）', d: 'ヨーロッパ最古の木造橋', t: '観光', dur: 60, addr: 'ルツェルン', area: 'lucerne', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'ピラトゥス山', d: 'ルツェルンの絶景峰', t: '観光', dur: 240, addr: 'ルツェルン', area: 'lucerne', th: ['np', 'cp'], pop: 4 },
            { n: 'マッターホルン（ツェルマット）', d: 'スイスの象徴的な峰', t: '観光', dur: 240, addr: 'ツェルマット', area: 'zermatt', th: ['np', 'wh', 'cp'], pop: 5 },
            { n: 'ゴルナーグラート展望台', d: 'マッターホルン正面の絶景', t: '観光', dur: 180, addr: 'ツェルマット', area: 'zermatt', th: ['np', 'cp'], pop: 5 },
            { n: 'チューリッヒ旧市街', d: 'チューリッヒ湖と歴史地区', t: '観光', dur: 120, addr: 'チューリッヒ', area: 'zurich', th: ['sg', 'hs', 'sp'], pop: 4 },
            { n: 'ベルニナ急行', d: '世界遺産のアルプス鉄道', t: '観光', dur: 240, addr: 'スイス各地', area: 'lucerne', th: ['sg', 'wh', 'np'], pop: 4 },
            { n: 'フォンデュの老舗（インターラーケン）', d: 'スイス名物チーズフォンデュ', t: 'グルメ', dur: 90, addr: 'インターラーケン', area: 'interlaken', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ビクトリア・ユングフラウ グランドホテル', addr: 'インターラーケン', area: 'interlaken', price: 78000 },
            { n: 'ホテル モン セルヴァン パレス', addr: 'ツェルマット', area: 'zermatt', price: 95000 },
            { n: 'ホテル シュバイツァーホフ ルツェルン', addr: 'ルツェルン', area: 'lucerne', price: 58000 },
        ],
    },

    // ──────────── ザルツブルク ────────────
    {
        id: 'salzburg', name: 'ザルツブルク', country: 'オーストリア', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['sg', 'hs', 'wh', 'ar', 'np'],
        areas: [
            { id: 'altstadt', name: '旧市街' },
            { id: 'hellbrunn', name: 'ヘルブルン' },
        ],
        spots: [
            { n: 'ホーエンザルツブルク城', d: '中欧最大の城塞', t: '観光', dur: 120, addr: '旧市街', area: 'altstadt', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'ザルツブルク大聖堂', d: 'バロック建築の傑作', t: '観光', dur: 60, addr: '旧市街', area: 'altstadt', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'モーツァルトの生家', d: 'モーツァルト博物館', t: '観光', dur: 75, addr: 'ゲトライデ街', area: 'altstadt', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'ゲトライデ街', d: '中世の看板が並ぶ商店街', t: '観光', dur: 90, addr: '旧市街', area: 'altstadt', th: ['sg', 'sp', 'hs'], pop: 4 },
            { n: 'ミラベル宮殿', d: 'サウンド・オブ・ミュージックの庭園', t: '観光', dur: 75, addr: '旧市街', area: 'altstadt', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: 'ハルシュタット（日帰り）', d: '世界一美しい湖畔の村', t: '観光', dur: 360, addr: 'ハルシュタット', area: 'hellbrunn', th: ['sg', 'np', 'wh', 'cp'], pop: 5 },
            { n: 'ヘルブルン宮殿', d: '水の仕掛けで有名な離宮', t: '観光', dur: 90, addr: 'ヘルブルン', area: 'hellbrunn', th: ['sg', 'hs', 'fm'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテル ザッハー ザルツブルク', addr: '旧市街', area: 'altstadt', price: 65000 },
            { n: 'ホテル エレファント', addr: '旧市街', area: 'altstadt', price: 32000 },
        ],
    },

    // ──────────── ブダペスト ────────────
    {
        id: 'budapest', name: 'ブダペスト', country: 'ハンガリー', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 25,
        themes: ['sg', 'hs', 'on', 'wh', 'ng'],
        areas: [
            { id: 'buda', name: 'ブダ側' },
            { id: 'pest', name: 'ペスト側' },
        ],
        spots: [
            { n: '国会議事堂', d: 'ドナウ川沿いのネオゴシック', t: '観光', dur: 90, addr: 'ペスト', area: 'pest', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: '漁夫の砦', d: 'ブダ城丘の絶景テラス', t: '観光', dur: 75, addr: 'ブダ', area: 'buda', th: ['np', 'sg', 'cp', 'ng'], pop: 5 },
            { n: 'ブダ王宮', d: '世界遺産の王宮丘', t: '観光', dur: 90, addr: 'ブダ', area: 'buda', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'マーチャーシュ教会', d: '色鮮やかな屋根の教会', t: '観光', dur: 60, addr: 'ブダ', area: 'buda', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'セーチェーニ温泉', d: 'ヨーロッパ最大の温泉施設', t: '観光', dur: 180, addr: 'ペスト', area: 'pest', th: ['on', 'cp'], pop: 5 },
            { n: 'ドナウ川クルーズ（夜）', d: '世界遺産の夜景クルーズ', t: '観光', dur: 90, addr: 'ペスト', area: 'pest', th: ['cp', 'ng', 'np'], pop: 5 },
            { n: '中央市場', d: '巨大な伝統市場', t: 'グルメ', dur: 75, addr: 'ペスト', area: 'pest', th: ['gm', 'sg'], pop: 4 },
            { n: 'ニューヨーク・カフェ', d: '世界一美しいカフェ', t: 'グルメ', dur: 75, addr: 'ペスト', area: 'pest', th: ['gm', 'cp', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'フォーシーズンズ ホテル グレシャム パレス', addr: 'ペスト', area: 'pest', price: 75000 },
            { n: 'コリンシア ホテル ブダペスト', addr: 'ペスト', area: 'pest', price: 38000 },
            { n: 'カンプ ホテル ブダペスト', addr: 'ペスト', area: 'pest', price: 18000 },
        ],
    },

    // ──────────── コペンハーゲン ────────────
    {
        id: 'copenhagen', name: 'コペンハーゲン', country: 'デンマーク', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'cp', 'ar', 'sp'],
        areas: [
            { id: 'nyhavn', name: 'ニューハウン' },
            { id: 'tivoli', name: 'ティボリ周辺' },
        ],
        spots: [
            { n: 'ニューハウン', d: 'カラフルな運河沿いの街並み', t: '観光', dur: 90, addr: 'ニューハウン', area: 'nyhavn', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: '人魚姫の像', d: 'アンデルセン童話の象徴', t: '観光', dur: 30, addr: 'ランゲリニエ', area: 'nyhavn', th: ['sg', 'hs'], pop: 4 },
            { n: 'チボリ公園', d: '世界最古の遊園地', t: '観光', dur: 180, addr: 'ティボリ', area: 'tivoli', th: ['cp', 'fm', 'sg'], pop: 5 },
            { n: 'アマリエンボー宮殿', d: 'デンマーク王室の住居', t: '観光', dur: 75, addr: 'アマリエンボー', area: 'nyhavn', th: ['sg', 'hs'], pop: 3 },
            { n: 'ローゼンボー城', d: '王室宝物がある城', t: '観光', dur: 90, addr: '中心部', area: 'tivoli', th: ['sg', 'hs'], pop: 3 },
            { n: 'ストロイエ通り', d: '北欧最長の歩行者天国', t: '観光', dur: 90, addr: '中心部', area: 'tivoli', th: ['sp', 'sg'], pop: 4 },
            { n: 'デザインミュージアム・デンマーク', d: '北欧デザインの殿堂', t: '観光', dur: 90, addr: '中心部', area: 'nyhavn', th: ['ar', 'sg'], pop: 3 },
            { n: 'ノーマ（伝説のレストラン）', d: '世界一の北欧料理', t: 'グルメ', dur: 180, addr: 'クリスチャンハウン', area: 'nyhavn', th: ['gm', 'cp'], pop: 5, bk: true },
        ],
        hotels: [
            { n: 'ホテル ダンマーク', addr: '中心部', area: 'tivoli', price: 32000 },
            { n: 'ホテル サンダーソン', addr: 'ニューハウン', area: 'nyhavn', price: 45000 },
        ],
    },

    // ──────────── ストックホルム ────────────
    {
        id: 'stockholm', name: 'ストックホルム', country: 'スウェーデン', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'hs', 'ar', 'cp'],
        areas: [
            { id: 'gamla-stan', name: '旧市街' },
            { id: 'djurgarden', name: 'ユールゴーデン島' },
        ],
        spots: [
            { n: 'ガムラ・スタン（旧市街）', d: '14世紀の街並みが残る島', t: '観光', dur: 120, addr: 'ガムラスタン', area: 'gamla-stan', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '王宮', d: 'スウェーデン王室の現役宮殿', t: '観光', dur: 90, addr: 'ガムラスタン', area: 'gamla-stan', th: ['sg', 'hs'], pop: 4 },
            { n: 'ヴァーサ博物館', d: '17世紀の沈没軍艦', t: '観光', dur: 120, addr: 'ユールゴーデン', area: 'djurgarden', th: ['sg', 'hs'], pop: 5 },
            { n: 'ABBAミュージアム', d: '北欧最大の音楽体験館', t: '観光', dur: 90, addr: 'ユールゴーデン', area: 'djurgarden', th: ['sg', 'ar', 'fm'], pop: 4 },
            { n: 'スカンセン野外博物館', d: '伝統建築と動物園', t: '観光', dur: 150, addr: 'ユールゴーデン', area: 'djurgarden', th: ['sg', 'hs', 'fm'], pop: 4 },
            { n: '市庁舎', d: 'ノーベル賞晩餐会の会場', t: '観光', dur: 75, addr: 'クングスホルメン', area: 'gamla-stan', th: ['sg', 'hs', 'np'], pop: 3 },
            { n: 'ストックホルム群島クルーズ', d: '3万島ある群島の絶景', t: '観光', dur: 180, addr: 'ストランドヴェーゲン', area: 'djurgarden', th: ['np', 'cp', 'sg'], pop: 4 },
        ],
        hotels: [
            { n: 'グランド ホテル ストックホルム', addr: '中心部', area: 'gamla-stan', price: 58000 },
            { n: 'ホテル スカンディック マルム', addr: '中心部', area: 'gamla-stan', price: 28000 },
        ],
    },

    // ──────────── レイキャビク（アイスランド） ────────────
    {
        id: 'reykjavik', name: 'アイスランド', country: 'アイスランド', region: 'overseas_europe',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'ex', 'cp'],
        areas: [
            { id: 'reykjavik-c', name: 'レイキャビク中心' },
            { id: 'golden-circle', name: 'ゴールデンサークル' },
            { id: 'south-coast', name: '南海岸' },
        ],
        spots: [
            { n: 'ブルーラグーン', d: '世界最大の屋外温泉', t: '観光', dur: 180, addr: 'ブルーラグーン', area: 'reykjavik-c', th: ['on', 'cp', 'np'], pop: 5, bk: true },
            { n: 'シングヴェトリル国立公園', d: '世界遺産・大陸の裂け目', t: '観光', dur: 120, addr: 'シングヴェトリル', area: 'golden-circle', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'ゲイシール間欠泉', d: '5分ごとに吹き上がる温泉', t: '観光', dur: 60, addr: 'ゲイシール', area: 'golden-circle', th: ['np', 'sg'], pop: 5 },
            { n: 'グトルフォスの滝', d: '黄金の滝と呼ばれる絶景', t: '観光', dur: 75, addr: 'グトルフォス', area: 'golden-circle', th: ['np', 'nt'], pop: 5 },
            { n: 'セリャラントスフォスの滝', d: '裏側から見られる滝', t: '観光', dur: 60, addr: '南海岸', area: 'south-coast', th: ['np', 'nt'], pop: 4 },
            { n: 'ヴィークの黒砂海岸', d: '玄武岩柱が並ぶ黒い砂浜', t: '観光', dur: 90, addr: 'ヴィーク', area: 'south-coast', th: ['np', 'cp'], pop: 5 },
            { n: 'オーロラ観賞ツアー', d: '世界トップクラスのオーロラ', t: '観光', dur: 240, addr: '郊外', area: 'reykjavik-c', th: ['np', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'ハットルグリムス教会', d: 'レイキャビクの象徴', t: '観光', dur: 60, addr: 'レイキャビク', area: 'reykjavik-c', th: ['sg', 'np'], pop: 4 },
        ],
        hotels: [
            { n: 'シリカ ホテル', addr: 'ブルーラグーン', area: 'reykjavik-c', price: 72000 },
            { n: 'ホテル ボルグ', addr: 'レイキャビク', area: 'reykjavik-c', price: 38000 },
            { n: 'グランド ホテル レイキャビク', addr: 'レイキャビク', area: 'reykjavik-c', price: 28000 },
        ],
    },
]
