import type { DestinationEntry } from '../types'

// 海外追加 第6弾：抜けていた有名旅行先（バンクーバー、オーロラ、カッパドキア等）

export const OVERSEAS_EXTRA_6: DestinationEntry[] = [
    // ──────────── バンクーバー ────────────
    {
        id: 'vancouver', name: 'バンクーバー', country: 'カナダ', region: 'overseas_america',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'np', 'nt', 'gm', 'cp'],
        areas: [
            { id: 'downtown-vc', name: 'ダウンタウン' },
            { id: 'stanley', name: 'スタンレーパーク' },
            { id: 'capilano', name: '北バンクーバー' },
        ],
        spots: [
            { n: 'スタンレーパーク', d: '都心の超大型自然公園・トーテムポール', t: '観光', dur: 240, addr: 'バンクーバー', area: 'stanley', th: ['nt', 'np', 'cp', 'fm'], pop: 5 },
            { n: 'キャピラノ吊り橋', d: '渓谷の上の絶景吊り橋とツリーウォーク', t: '観光', dur: 180, addr: '北バンクーバー', area: 'capilano', th: ['np', 'ex', 'fm'], pop: 5, bk: true },
            { n: 'グランビル・アイランド', d: 'パブリックマーケットとアート', t: '観光', dur: 180, addr: 'バンクーバー', area: 'downtown-vc', th: ['sg', 'gm', 'sp', 'ar'], pop: 5 },
            { n: 'ガスタウン', d: '蒸気時計のレトロな歴史地区', t: '観光', dur: 120, addr: 'バンクーバー', area: 'downtown-vc', th: ['sg', 'hs', 'cp'], pop: 4 },
            { n: 'グラウス・マウンテン', d: 'ゴンドラで山頂・市街地一望', t: '観光', dur: 240, addr: '北バンクーバー', area: 'capilano', th: ['np', 'nt', 'ex'], pop: 4 },
            { n: 'ビクトリア（フェリー日帰り）', d: 'BC州都・ブッチャートガーデン', t: '観光', dur: 480, addr: 'ビクトリア', area: 'downtown-vc', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'クイーンエリザベスパーク', d: '高台の植物園と展望', t: '観光', dur: 120, addr: 'バンクーバー', area: 'stanley', th: ['nt', 'np'], pop: 3 },
        ],
        hotels: [
            { n: 'フェアモント・パシフィック・リム', addr: 'バンクーバー', area: 'downtown-vc', price: 55000 },
            { n: 'ローズウッド・ホテル・ジョージア', addr: 'バンクーバー', area: 'downtown-vc', price: 48000 },
        ],
    },

    // ──────────── イエローナイフ（オーロラ） ────────────
    {
        id: 'yellowknife', name: 'イエローナイフ', country: 'カナダ', region: 'overseas_america',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 45,
        themes: ['np', 'nt', 'ex', 'cp'],
        areas: [{ id: 'yk', name: 'イエローナイフ' }],
        spots: [
            { n: 'オーロラ観賞ツアー', d: '世界屈指のオーロラ出現率を誇る湖畔', t: '観光', dur: 360, addr: 'イエローナイフ', area: 'yk', th: ['np', 'ex', 'cp'], pop: 5, bk: true, eveningOk: true },
            { n: 'オーロラビレッジ', d: '伝統テントとオーロラ', t: '観光', dur: 300, addr: 'イエローナイフ近郊', area: 'yk', th: ['np', 'ex', 'cp'], pop: 5, bk: true },
            { n: 'グレート・スレイブ湖', d: '凍結した湖上のアクティビティ', t: '観光', dur: 240, addr: 'イエローナイフ', area: 'yk', th: ['np', 'ex', 'nt'], pop: 4 },
            { n: '犬ぞり体験', d: '極北の伝統交通を体験', t: '観光', dur: 180, addr: 'イエローナイフ', area: 'yk', th: ['ex', 'fm'], pop: 5, bk: true },
            { n: 'プリンス・オブ・ウェールズ博物館', d: '先住民文化と北極圏の自然', t: '観光', dur: 120, addr: 'イエローナイフ', area: 'yk', th: ['sg', 'hs'], pop: 3 },
            { n: 'オールドタウン', d: '湖畔の古い漁村集落と水上飛行機', t: '観光', dur: 90, addr: 'イエローナイフ', area: 'yk', th: ['sg', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'エクスプローラー・ホテル', addr: 'イエローナイフ', area: 'yk', price: 28000 },
            { n: 'シャトー・ノヴァ', addr: 'イエローナイフ', area: 'yk', price: 22000 },
        ],
    },

    // ──────────── バンフ・ジャスパー（カナディアンロッキー詳細） ────────────
    {
        id: 'banff-jasper', name: 'バンフ・ジャスパー', country: 'カナダ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'wh', 'cp'],
        areas: [
            { id: 'banff', name: 'バンフ' },
            { id: 'jasper', name: 'ジャスパー' },
        ],
        spots: [
            { n: 'モレーン湖', d: '紙幣にもなった氷河湖の絶景', t: '観光', dur: 180, addr: 'バンフ国立公園', area: 'banff', th: ['np', 'nt', 'wh', 'cp'], pop: 5 },
            { n: 'ルイーズ湖', d: 'エメラルドグリーンの代表的氷河湖', t: '観光', dur: 180, addr: 'バンフ国立公園', area: 'banff', th: ['np', 'nt', 'wh', 'cp'], pop: 5 },
            { n: 'バンフ・ガンドラ', d: 'サルファー山頂の360度展望', t: '観光', dur: 180, addr: 'バンフ', area: 'banff', th: ['np', 'nt'], pop: 5 },
            { n: 'バンフ・アッパー温泉', d: 'カナディアンロッキーの湯', t: '観光', dur: 120, addr: 'バンフ', area: 'banff', th: ['on', 'cp'], pop: 4 },
            { n: 'コロンビア大氷原', d: '氷河の上を雪上車で', t: '観光', dur: 240, addr: 'アイスフィールズパークウェイ', area: 'jasper', th: ['np', 'ex', 'nt'], pop: 5, bk: true },
            { n: 'マリーン湖', d: '美しい島浮かぶ氷河湖', t: '観光', dur: 240, addr: 'ジャスパー国立公園', area: 'jasper', th: ['np', 'nt'], pop: 5 },
            { n: 'アイスフィールズ・パークウェイ', d: '世界屈指の絶景ドライブルート', t: '観光', dur: 360, addr: 'バンフ→ジャスパー', area: 'banff', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: 'ペイト湖', d: '狼の形をしたターコイズ湖', t: '観光', dur: 90, addr: 'アイスフィールズパークウェイ', area: 'banff', th: ['np', 'nt'], pop: 5 },
        ],
        hotels: [
            { n: 'フェアモント・バンフ・スプリングス', addr: 'バンフ', area: 'banff', price: 85000 },
            { n: 'フェアモント・ジャスパー・パーク・ロッジ', addr: 'ジャスパー', area: 'jasper', price: 75000 },
        ],
    },

    // ──────────── カッパドキア ────────────
    {
        id: 'cappadocia', name: 'カッパドキア', country: 'トルコ', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 45,
        themes: ['np', 'wh', 'ex', 'sg', 'cp'],
        areas: [{ id: 'goreme', name: 'ギョレメ' }],
        spots: [
            { n: '気球ツアー', d: '奇岩群を空から望む夜明けの絶景', t: '観光', dur: 240, addr: 'ギョレメ', area: 'goreme', th: ['np', 'ex', 'cp', 'wh'], pop: 5, bk: true, morningOk: true },
            { n: 'ギョレメ野外博物館', d: '世界遺産の岩窟教会群', t: '観光', dur: 180, addr: 'ギョレメ', area: 'goreme', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ウチヒサル城', d: '岩を刳り抜いた巨大要塞', t: '観光', dur: 120, addr: 'ウチヒサル', area: 'goreme', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: 'カイマクル地下都市', d: '初期キリスト教徒が逃れた地下8層都市', t: '観光', dur: 180, addr: 'カイマクル', area: 'goreme', th: ['sg', 'hs', 'wh', 'ex'], pop: 5 },
            { n: 'ローズバレー', d: '夕日に染まる薔薇色の渓谷', t: '観光', dur: 180, addr: 'ギョレメ近郊', area: 'goreme', th: ['np', 'cp'], pop: 5 },
            { n: '洞窟ホテル滞在', d: '岩を刳り抜いた本格洞窟ホテル', t: '観光', dur: 120, addr: 'ギョレメ', area: 'goreme', th: ['cp', 'ex'], pop: 5 },
            { n: 'パシャバー（妖精の煙突）', d: 'キノコ型の奇岩群', t: '観光', dur: 90, addr: 'パシャバー', area: 'goreme', th: ['np', 'sg'], pop: 5 },
        ],
        hotels: [
            { n: 'ミュージアム・ホテル', addr: 'ウチヒサル', area: 'goreme', price: 58000 },
            { n: 'スルタン・ケーブ・スイーツ', addr: 'ギョレメ', area: 'goreme', price: 32000 },
        ],
    },

    // ──────────── イスタンブール ────────────
    {
        id: 'istanbul', name: 'イスタンブール', country: 'トルコ', region: 'overseas_middleeast',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 25,
        themes: ['sg', 'hs', 'wh', 'gm', 'sp', 'ar'],
        areas: [
            { id: 'sultanahmet', name: '旧市街（スルタンアフメット）' },
            { id: 'beyoglu', name: '新市街（ベイオール）' },
        ],
        spots: [
            { n: 'アヤソフィア', d: 'ビザンチン建築最高傑作・世界遺産', t: '観光', dur: 180, addr: 'スルタンアフメット', area: 'sultanahmet', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'ブルーモスク（スルタンアフメット）', d: '6本のミナレットを持つ青のモスク', t: '観光', dur: 120, addr: 'スルタンアフメット', area: 'sultanahmet', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'トプカプ宮殿', d: 'オスマン帝国スルタンの居城', t: '観光', dur: 240, addr: 'スルタンアフメット', area: 'sultanahmet', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'グランドバザール', d: '世界最古の屋内市場4000店', t: '観光', dur: 180, addr: 'スルタンアフメット', area: 'sultanahmet', th: ['sg', 'sp', 'gm', 'ex'], pop: 5 },
            { n: 'バシリカ・シスタン地下宮殿', d: '神秘的な地下貯水池', t: '観光', dur: 90, addr: 'スルタンアフメット', area: 'sultanahmet', th: ['sg', 'hs'], pop: 5 },
            { n: 'ガラタ塔', d: '新市街のシンボル・360度展望', t: '観光', dur: 90, addr: 'ベイオール', area: 'beyoglu', th: ['sg', 'np', 'ng'], pop: 5 },
            { n: 'ボスポラスクルーズ', d: 'ヨーロッパとアジアを跨ぐ船旅', t: '観光', dur: 180, addr: 'ボスポラス海峡', area: 'beyoglu', th: ['cp', 'np', 'ex'], pop: 5 },
            { n: 'イスティクラル通り', d: '新市街の目抜き通りとレトロ路面電車', t: '観光', dur: 150, addr: 'ベイオール', area: 'beyoglu', th: ['sg', 'sp', 'gm'], pop: 5 },
            { n: 'ケバブ・チキン店', d: '本場トルコ料理', t: 'グルメ', dur: 90, addr: '旧市街', area: 'sultanahmet', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'フォーシーズンズ・スルタンアフメット', addr: 'スルタンアフメット', area: 'sultanahmet', price: 65000 },
            { n: 'ペラ・パラス・ホテル', addr: 'ベイオール', area: 'beyoglu', price: 38000 },
        ],
    },

    // ──────────── 西安（兵馬俑） ────────────
    {
        id: 'xian', name: '西安', country: '中国', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 45,
        themes: ['sg', 'hs', 'wh', 'gm'],
        areas: [
            { id: 'xian-city', name: '西安市内' },
            { id: 'bingmayong', name: '兵馬俑エリア' },
        ],
        spots: [
            { n: '兵馬俑博物館', d: '秦始皇帝陵の世界遺産・兵馬俑8000体', t: '観光', dur: 240, addr: '臨潼区', area: 'bingmayong', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '秦始皇帝陵', d: '謎の地下宮殿が眠る墳丘', t: '観光', dur: 120, addr: '臨潼区', area: 'bingmayong', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '西安城壁（古城壁）', d: '中国最大の現存城壁・サイクリング', t: '観光', dur: 180, addr: '西安市内', area: 'xian-city', th: ['sg', 'hs', 'ex'], pop: 5 },
            { n: '大雁塔', d: '玄奘三蔵が建てた7層の塔・世界遺産', t: '観光', dur: 120, addr: '西安市内', area: 'xian-city', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '回民街（イスラム街）', d: '本場羊串と西安麺料理の屋台街', t: '観光', dur: 150, addr: '鼓楼近郊', area: 'xian-city', th: ['gm', 'sg', 'sp'], pop: 5, eveningOk: true },
            { n: '陝西歴史博物館', d: '中国屈指の歴史博物館', t: '観光', dur: 180, addr: '西安市内', area: 'xian-city', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: '華清池', d: '玄宗皇帝と楊貴妃の温泉宮殿', t: '観光', dur: 120, addr: '臨潼区', area: 'bingmayong', th: ['sg', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'ソフィテル・レジェンド・パイプアイ・グランド', addr: '西安市内', area: 'xian-city', price: 28000 },
            { n: '西安シェラトン', addr: '西安市内', area: 'xian-city', price: 22000 },
        ],
    },

    // ──────────── ハルシュタット ────────────
    {
        id: 'hallstatt', name: 'ハルシュタット', country: 'オーストリア', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'np', 'wh', 'cp'],
        areas: [{ id: 'hallstatt-v', name: 'ハルシュタット村' }],
        spots: [
            { n: 'ハルシュタット湖畔教会', d: '世界一美しい湖畔の村の象徴', t: '観光', dur: 120, addr: 'ハルシュタット', area: 'hallstatt-v', th: ['sg', 'np', 'wh', 'cp'], pop: 5 },
            { n: 'マーケットスクエア', d: 'カラフルな家並みのフォトスポット', t: '観光', dur: 90, addr: 'ハルシュタット', area: 'hallstatt-v', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'ハルシュタット塩坑', d: '世界最古の塩坑跡・木製滑り台体験', t: '観光', dur: 180, addr: 'ハルシュタット', area: 'hallstatt-v', th: ['sg', 'ex', 'hs'], pop: 5 },
            { n: 'スカイウォーク', d: '湖と村を見下ろす展望台', t: '観光', dur: 90, addr: 'ハルシュタット', area: 'hallstatt-v', th: ['np', 'cp'], pop: 5 },
            { n: '湖クルーズ', d: '湖上から村の絶景', t: '観光', dur: 60, addr: 'ハルシュタット', area: 'hallstatt-v', th: ['np', 'cp', 'ex'], pop: 5 },
            { n: 'ダッハシュタイン氷河洞窟', d: '近郊の青く輝く氷河洞窟', t: '観光', dur: 240, addr: 'オーバートラウン', area: 'hallstatt-v', th: ['np', 'nt', 'ex'], pop: 4 },
        ],
        hotels: [
            { n: 'ヘリテージ・ホテル・ハルシュタット', addr: 'ハルシュタット', area: 'hallstatt-v', price: 32000 },
            { n: 'シーホテル・グリュナー・バウム', addr: 'ハルシュタット', area: 'hallstatt-v', price: 28000 },
        ],
    },

    // ──────────── ニース・モナコ（コートダジュール） ────────────
    {
        id: 'nice-monaco', name: '南仏（ニース・モナコ）', country: 'フランス/モナコ', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'np', 'cp', 'bc', 'gm', 'sp'],
        areas: [
            { id: 'nice', name: 'ニース' },
            { id: 'monaco', name: 'モナコ' },
            { id: 'eze', name: 'エズ・カンヌ' },
        ],
        spots: [
            { n: 'プロムナード・デ・ザングレ', d: 'ニース海岸の散策路', t: '観光', dur: 120, addr: 'ニース', area: 'nice', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'シャガール美術館', d: 'ニースのシャガール聖書連作', t: '観光', dur: 120, addr: 'ニース', area: 'nice', th: ['ar', 'sg'], pop: 4 },
            { n: 'ニース旧市街', d: '色彩あふれる旧市街と花市場', t: '観光', dur: 180, addr: 'ニース', area: 'nice', th: ['sg', 'gm', 'cp'], pop: 5 },
            { n: 'モンテカルロ・カジノ', d: 'モナコのベル・エポック建築', t: '観光', dur: 120, addr: 'モンテカルロ', area: 'monaco', th: ['sg', 'ng', 'cp'], pop: 5 },
            { n: 'モナコ大公宮殿', d: 'グレース妃が暮らした宮殿', t: '観光', dur: 120, addr: 'モナコ', area: 'monaco', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'モナコ海洋博物館', d: 'クストー博士の海洋研究所', t: '観光', dur: 180, addr: 'モナコ', area: 'monaco', th: ['sg', 'fm'], pop: 4 },
            { n: 'エズ村', d: '断崖の鷲の巣村と地中海展望', t: '観光', dur: 180, addr: 'エズ', area: 'eze', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'カンヌ・クロワゼット通り', d: '映画祭で有名な海岸通り', t: '観光', dur: 120, addr: 'カンヌ', area: 'eze', th: ['sg', 'sp', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'ル・メリディアン・ニース', addr: 'ニース', area: 'nice', price: 48000 },
            { n: 'オテル・ド・パリ・モンテカルロ', addr: 'モナコ', area: 'monaco', price: 95000 },
        ],
    },

    // ──────────── チンクエテッレ ────────────
    {
        id: 'cinque-terre', name: 'チンクエテッレ', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 20,
        themes: ['np', 'wh', 'cp', 'bc', 'gm'],
        areas: [{ id: 'cinque', name: 'チンクエテッレ' }],
        spots: [
            { n: 'モンテロッソ・アル・マーレ', d: '5村最大・砂浜と海水浴', t: '観光', dur: 180, addr: 'モンテロッソ', area: 'cinque', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: 'ヴェルナッツァ', d: '5村で最も美しいといわれる村', t: '観光', dur: 180, addr: 'ヴェルナッツァ', area: 'cinque', th: ['sg', 'np', 'cp', 'wh'], pop: 5 },
            { n: 'コルニリア', d: '丘上の唯一海に面さない村', t: '観光', dur: 120, addr: 'コルニリア', area: 'cinque', th: ['sg', 'np'], pop: 4 },
            { n: 'マナローラ', d: '崖に張り付くカラフルな家並み', t: '観光', dur: 180, addr: 'マナローラ', area: 'cinque', th: ['sg', 'np', 'cp', 'wh'], pop: 5 },
            { n: 'リオマッジョーレ', d: '5村の玄関口・赤い建物群', t: '観光', dur: 180, addr: 'リオマッジョーレ', area: 'cinque', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'ヴィア・デッラモーレ（愛の小径）', d: '海沿いの遊歩道（修復後）', t: '観光', dur: 120, addr: 'マナローラ↔リオマッジョーレ', area: 'cinque', th: ['cp', 'np', 'ex'], pop: 5 },
            { n: 'リグーリア料理（ペスト）', d: 'バジルペーストとシーフード', t: 'グルメ', dur: 90, addr: '各村', area: 'cinque', th: ['gm', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: 'ホテル・ポルト・ロカ', addr: 'モンテロッソ', area: 'cinque', price: 42000 },
            { n: 'ヴェルナッツァ・ハイド', addr: 'ヴェルナッツァ', area: 'cinque', price: 32000 },
        ],
    },

    // ──────────── マラケシュ・サハラ ────────────
    {
        id: 'marrakech', name: 'マラケシュ・サハラ', country: 'モロッコ', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 45,
        themes: ['sg', 'hs', 'wh', 'ex', 'sp'],
        areas: [
            { id: 'marrakech-c', name: 'マラケシュ旧市街' },
            { id: 'sahara-m', name: 'サハラ砂漠' },
        ],
        spots: [
            { n: 'ジャマ・エル・フナ広場', d: '世界遺産の活気あふれる広場', t: '観光', dur: 180, addr: 'マラケシュ', area: 'marrakech-c', th: ['sg', 'sp', 'gm', 'wh'], pop: 5, eveningOk: true },
            { n: 'バヒア宮殿', d: '19世紀イスラム建築の傑作', t: '観光', dur: 120, addr: 'マラケシュ', area: 'marrakech-c', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'マジョレル庭園', d: 'YSLが愛したコバルトブルーの庭園', t: '観光', dur: 120, addr: 'マラケシュ', area: 'marrakech-c', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'クトゥビーヤ・モスク', d: 'マラケシュのシンボル', t: '観光', dur: 60, addr: 'マラケシュ', area: 'marrakech-c', th: ['sg', 'hs'], pop: 4 },
            { n: 'スーク（市場）', d: 'スパイス・じゅうたん・革製品', t: '観光', dur: 180, addr: 'マラケシュ旧市街', area: 'marrakech-c', th: ['sg', 'sp', 'ex'], pop: 5 },
            { n: 'メルズーガ砂丘ラクダツアー', d: 'サハラ砂漠で星空とラクダ縦走', t: '観光', dur: 720, addr: 'メルズーガ', area: 'sahara-m', th: ['ex', 'np', 'cp'], pop: 5, bk: true },
            { n: 'アイト・ベン・ハッドゥ', d: '世界遺産の土壁集落', t: '観光', dur: 180, addr: 'ウアルザザート近郊', area: 'sahara-m', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'トドラ渓谷', d: 'アトラス山脈の絶景渓谷', t: '観光', dur: 180, addr: 'トドラ', area: 'sahara-m', th: ['np', 'nt'], pop: 4 },
        ],
        hotels: [
            { n: 'ラ・マムーニア', addr: 'マラケシュ', area: 'marrakech-c', price: 95000 },
            { n: 'リアド・ジャルダン・セクレ', addr: 'マラケシュ旧市街', area: 'marrakech-c', price: 32000 },
        ],
    },

    // ──────────── ルアンパバーン ────────────
    {
        id: 'luang-prabang', name: 'ルアンパバーン', country: 'ラオス', region: 'overseas_asia_far',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 25,
        themes: ['sg', 'hs', 'wh', 'cp', 'ex'],
        areas: [{ id: 'lp', name: 'ルアンパバーン旧市街' }],
        spots: [
            { n: '托鉢の儀式', d: '夜明けの僧侶による托鉢・世界遺産', t: '観光', dur: 90, addr: 'ルアンパバーン', area: 'lp', th: ['sg', 'hs', 'ex'], pop: 5, morningOk: true },
            { n: 'ワット・シェントーン', d: '黄金に輝く16世紀寺院', t: '観光', dur: 120, addr: 'ルアンパバーン', area: 'lp', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'プーシーの丘', d: 'メコン川を一望できる夕日スポット', t: '観光', dur: 90, addr: 'ルアンパバーン', area: 'lp', th: ['np', 'cp', 'sg'], pop: 5 },
            { n: 'ナイトマーケット', d: '少数民族の手工芸品の夜市', t: '観光', dur: 120, addr: 'ルアンパバーン', area: 'lp', th: ['sp', 'gm', 'sg'], pop: 5, eveningOk: true },
            { n: 'クアンシーの滝', d: 'エメラルドグリーンの3段の滝', t: '観光', dur: 240, addr: 'クアンシー', area: 'lp', th: ['np', 'nt', 'cp'], pop: 5 },
            { n: 'メコン川クルーズ', d: 'パークウー洞窟と仏像', t: '観光', dur: 360, addr: 'メコン川', area: 'lp', th: ['ex', 'np', 'cp'], pop: 4 },
            { n: 'ラオス料理（ラープ）', d: 'ハーブとライムの伝統料理', t: 'グルメ', dur: 90, addr: 'ルアンパバーン', area: 'lp', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'アマンタカ', addr: 'ルアンパバーン', area: 'lp', price: 85000 },
            { n: 'ヴィラ・サントイ', addr: 'ルアンパバーン', area: 'lp', price: 22000 },
        ],
    },

    // ──────────── フィジー ────────────
    {
        id: 'fiji', name: 'フィジー', country: 'フィジー', region: 'overseas_oceania',
        trip_style: 'overseas_transit', intra_mode: '船', intra_gap_min: 60,
        themes: ['bc', 'cp', 'np', 'ex', 'fm'],
        areas: [{ id: 'fiji-main', name: 'マナ島・ヤサワ諸島' }],
        spots: [
            { n: 'マナ島ビーチ', d: '世界屈指のスノーケリング天国', t: '観光', dur: 240, addr: 'マナ島', area: 'fiji-main', th: ['bc', 'cp', 'np', 'ex'], pop: 5 },
            { n: 'ヤサワ諸島クルーズ', d: '無人島巡りクルーズ', t: '観光', dur: 480, addr: 'ヤサワ諸島', area: 'fiji-main', th: ['ex', 'np', 'cp'], pop: 5, bk: true },
            { n: 'ナンディ（ナディ）市内', d: 'ヒンドゥー寺院と地元市場', t: '観光', dur: 180, addr: 'ナディ', area: 'fiji-main', th: ['sg', 'sp', 'gm'], pop: 3 },
            { n: 'カバ儀式と村訪問', d: 'フィジー伝統文化体験', t: '観光', dur: 180, addr: 'フィジー村落', area: 'fiji-main', th: ['ex', 'hs', 'fm'], pop: 4 },
            { n: 'シュノーケリング（ソフトコーラル）', d: '世界一柔らかなサンゴ', t: '観光', dur: 180, addr: 'マナ島周辺', area: 'fiji-main', th: ['ex', 'bc', 'np'], pop: 5 },
            { n: 'ファイアダンス', d: 'フィジー伝統舞踊', t: '観光', dur: 90, addr: 'マナ島リゾート', area: 'fiji-main', th: ['ex', 'cp'], pop: 4, eveningOk: true },
        ],
        hotels: [
            { n: 'リコリコ・アイランド・リゾート', addr: 'マナ島', area: 'fiji-main', price: 75000 },
            { n: 'ソフィテル・フィジー・リゾート', addr: 'ナディ', area: 'fiji-main', price: 48000 },
        ],
    },

    // ──────────── パラオ ────────────
    {
        id: 'palau', name: 'パラオ', country: 'パラオ', region: 'overseas_oceania',
        trip_style: 'overseas_transit', intra_mode: '船', intra_gap_min: 45,
        themes: ['bc', 'ex', 'np', 'nt'],
        areas: [{ id: 'palau-main', name: 'コロール' }],
        spots: [
            { n: 'ジェリーフィッシュレイク', d: '無毒クラゲと泳ぐ秘境の湖', t: '観光', dur: 240, addr: 'マカラカル島', area: 'palau-main', th: ['ex', 'nt', 'np'], pop: 5, bk: true },
            { n: 'ロックアイランド・ツアー', d: '世界遺産のキノコ型小島群', t: '観光', dur: 360, addr: 'ロックアイランド', area: 'palau-main', th: ['np', 'wh', 'bc', 'ex'], pop: 5, bk: true },
            { n: 'ブルーコーナー（ダイビング）', d: '世界トップクラスのダイブサイト', t: '観光', dur: 240, addr: 'パラオ沖', area: 'palau-main', th: ['ex', 'np', 'nt'], pop: 5, bk: true },
            { n: 'ミルキーウェイ', d: '白い泥のスパで肌つるつる', t: '観光', dur: 90, addr: 'ロックアイランド', area: 'palau-main', th: ['ex', 'cp'], pop: 5 },
            { n: 'ペリリュー島戦跡', d: '太平洋戦争激戦地', t: '観光', dur: 360, addr: 'ペリリュー島', area: 'palau-main', th: ['sg', 'hs'], pop: 4 },
            { n: 'コロール市内', d: 'パラオ国立博物館', t: '観光', dur: 120, addr: 'コロール', area: 'palau-main', th: ['sg', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'パラオ・パシフィック・リゾート', addr: 'コロール', area: 'palau-main', price: 42000 },
            { n: 'パレイシア・ホテル・パラオ', addr: 'コロール', area: 'palau-main', price: 28000 },
        ],
    },

    // ──────────── ヨセミテ ────────────
    {
        id: 'yosemite', name: 'ヨセミテ国立公園', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['np', 'nt', 'wh', 'ex', 'fm'],
        areas: [{ id: 'yosemite-v', name: 'ヨセミテバレー' }],
        spots: [
            { n: 'エル・キャピタン', d: '世界最大級の一枚岩・クライミング聖地', t: '観光', dur: 180, addr: 'ヨセミテバレー', area: 'yosemite-v', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'ハーフドーム', d: '氷河で削られた半円形の巨岩', t: '観光', dur: 240, addr: 'ヨセミテバレー', area: 'yosemite-v', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: 'ヨセミテ滝', d: '北米最高峰の落差を誇る滝', t: '観光', dur: 180, addr: 'ヨセミテバレー', area: 'yosemite-v', th: ['np', 'nt'], pop: 5 },
            { n: 'グレイシャーポイント', d: 'バレー全景の絶景展望台', t: '観光', dur: 180, addr: 'グレイシャーポイント', area: 'yosemite-v', th: ['np', 'nt'], pop: 5 },
            { n: 'マリポサ・グローブ', d: '巨大セコイア杉群', t: '観光', dur: 240, addr: 'マリポサ', area: 'yosemite-v', th: ['nt', 'np', 'fm'], pop: 5 },
            { n: 'ミラー湖トレイル', d: 'ハーフドームを映す静寂の湖', t: '観光', dur: 240, addr: 'ヨセミテバレー', area: 'yosemite-v', th: ['nt', 'ex', 'cp'], pop: 4 },
            { n: 'タフトポイント', d: '崖の先の絶景フォト', t: '観光', dur: 180, addr: 'グレイシャーポイント周辺', area: 'yosemite-v', th: ['np', 'ex'], pop: 4 },
        ],
        hotels: [
            { n: 'アワニーホテル', addr: 'ヨセミテバレー', area: 'yosemite-v', price: 58000 },
            { n: 'ヨセミテ・ビュー・ロッジ', addr: 'エル・ポータル', area: 'yosemite-v', price: 32000 },
        ],
    },

    // ──────────── イエローストーン ────────────
    {
        id: 'yellowstone', name: 'イエローストーン国立公園', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['np', 'nt', 'wh', 'ex', 'fm'],
        areas: [{ id: 'yellow-park', name: 'イエローストーン' }],
        spots: [
            { n: 'オールド・フェイスフル間欠泉', d: '90分毎に噴出する伝説の間欠泉', t: '観光', dur: 180, addr: 'オールド・フェイスフル', area: 'yellow-park', th: ['np', 'nt', 'wh', 'fm'], pop: 5 },
            { n: 'グランド・プリズマティック温泉', d: '虹色の世界最大級温泉湖', t: '観光', dur: 180, addr: 'ミッドウェイ間欠泉地帯', area: 'yellow-park', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'マンモス・ホット・スプリングス', d: '段々畑のような石灰華段丘', t: '観光', dur: 180, addr: 'マンモス', area: 'yellow-park', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'ラマー・バレー', d: '北アメリカのセレンゲティ（バイソン・狼）', t: '観光', dur: 240, addr: 'ラマー・バレー', area: 'yellow-park', th: ['nt', 'ex', 'np'], pop: 5 },
            { n: 'イエローストーン大峡谷', d: '黄色い渓谷と滝', t: '観光', dur: 240, addr: 'グランドキャニオン地区', area: 'yellow-park', th: ['np', 'nt'], pop: 5 },
            { n: 'グランドティトン国立公園', d: '南隣の絶景山岳公園', t: '観光', dur: 360, addr: 'ティトン', area: 'yellow-park', th: ['np', 'nt', 'wh'], pop: 5 },
            { n: 'モリス間欠泉地帯', d: '世界最古の熱水地帯', t: '観光', dur: 180, addr: 'ノリス', area: 'yellow-park', th: ['np', 'nt'], pop: 4 },
        ],
        hotels: [
            { n: 'オールド・フェイスフル・イン', addr: 'オールド・フェイスフル', area: 'yellow-park', price: 38000 },
            { n: 'マンモス・ホット・スプリングス・ホテル', addr: 'マンモス', area: 'yellow-park', price: 32000 },
        ],
    },

    // ──────────── トロムソ（北欧オーロラ） ────────────
    {
        id: 'tromso', name: 'トロムソ', country: 'ノルウェー', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 30,
        themes: ['np', 'nt', 'ex', 'cp'],
        areas: [{ id: 'tromso-c', name: 'トロムソ' }],
        spots: [
            { n: 'オーロラ観賞ツアー', d: '北極圏のオーロラ・専門ガイド', t: '観光', dur: 360, addr: 'トロムソ近郊', area: 'tromso-c', th: ['np', 'ex', 'cp'], pop: 5, bk: true, eveningOk: true },
            { n: 'フィエルヘイセン山頂展望', d: 'ケーブルカーで街を一望', t: '観光', dur: 180, addr: 'トロムソ', area: 'tromso-c', th: ['np', 'cp'], pop: 5 },
            { n: '北極大聖堂', d: 'モダンな白の三角屋根', t: '観光', dur: 90, addr: 'トロムソ', area: 'tromso-c', th: ['sg', 'cp'], pop: 4 },
            { n: '犬ぞり体験（ハスキー）', d: '極北の犬ぞり走行', t: '観光', dur: 240, addr: 'トロムソ近郊', area: 'tromso-c', th: ['ex', 'fm'], pop: 5, bk: true },
            { n: 'サーミ族文化体験', d: 'トナカイ橇と先住民文化', t: '観光', dur: 240, addr: 'トロムソ近郊', area: 'tromso-c', th: ['ex', 'hs'], pop: 4 },
            { n: 'ホエールウォッチング', d: 'シャチ・ザトウクジラ観察（冬）', t: '観光', dur: 360, addr: 'トロムソ沖', area: 'tromso-c', th: ['nt', 'ex', 'np'], pop: 5, bk: true },
        ],
        hotels: [
            { n: 'クラリオン・ホテル・ジ・エッジ', addr: 'トロムソ', area: 'tromso-c', price: 38000 },
            { n: 'スカンディック・トロムソ', addr: 'トロムソ', area: 'tromso-c', price: 28000 },
        ],
    },

    // ──────────── ドロミテ（北イタリア・アルプス） ────────────
    {
        id: 'dolomites', name: 'ドロミテ', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['np', 'nt', 'wh', 'ex', 'cp'],
        areas: [{ id: 'dolomites-c', name: 'コルティナ・ダンペッツォ' }],
        spots: [
            { n: 'トレ・チーメ・ディ・ラヴァレード', d: 'ドロミテのシンボル3つの尖塔', t: '観光', dur: 240, addr: 'アウロンツォ', area: 'dolomites-c', th: ['np', 'nt', 'wh', 'ex'], pop: 5 },
            { n: 'ミズリーナ湖', d: 'ドロミテを映す静寂の湖', t: '観光', dur: 120, addr: 'ミズリーナ', area: 'dolomites-c', th: ['np', 'nt', 'cp'], pop: 5 },
            { n: 'カレッツァ湖', d: 'エメラルドグリーンの神秘の湖', t: '観光', dur: 90, addr: 'カレッツァ', area: 'dolomites-c', th: ['np', 'nt', 'cp'], pop: 5 },
            { n: 'コルティナ・ダンペッツォ', d: 'ドロミテの王道リゾート', t: '観光', dur: 180, addr: 'コルティナ', area: 'dolomites-c', th: ['sg', 'sp', 'cp'], pop: 5 },
            { n: 'セチェーダ展望台', d: 'ロープウェイで稜線へ', t: '観光', dur: 240, addr: 'オルティセイ', area: 'dolomites-c', th: ['np', 'nt'], pop: 5 },
            { n: 'プラ・デ・ラーゴ湖', d: 'ドロミテの絶景湖と山小屋', t: '観光', dur: 180, addr: 'プラート', area: 'dolomites-c', th: ['np', 'nt'], pop: 4 },
        ],
        hotels: [
            { n: 'ロザペッタ・ホテル・コルティナ', addr: 'コルティナ', area: 'dolomites-c', price: 48000 },
            { n: 'クリスタロ・リゾート', addr: 'コルティナ', area: 'dolomites-c', price: 65000 },
        ],
    },
]
