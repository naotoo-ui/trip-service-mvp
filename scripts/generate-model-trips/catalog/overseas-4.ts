import type { DestinationEntry } from '../types'

// 海外 アメリカ・オセアニア・中東: NY・LA・ハワイ・グアム・シドニー・メルボルン・ドバイ

export const OVERSEAS_PART4: DestinationEntry[] = [
    // ニューヨーク
    {
        id: 'newyork', name: 'ニューヨーク', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'sp', 'ng', 'ar'],
        areas: [
            { id: 'midtown', name: 'ミッドタウン' }, { id: 'downtown', name: 'ダウンタウン' }, { id: 'central-park', name: 'セントラルパーク' },
        ],
        spots: [
            { n: '自由の女神', d: 'リバティ島のシンボル', t: '観光', dur: 240, addr: 'リバティ島', area: 'downtown', th: ['sg', 'hs', 'np'], pop: 5, bk: true },
            { n: 'タイムズスクエア', d: 'ニューヨークの心臓部', t: '観光', dur: 90, addr: 'ミッドタウン', area: 'midtown', th: ['sg', 'ng'], pop: 5 },
            { n: 'エンパイア・ステート・ビル', d: 'NY定番の絶景展望台', t: '観光', dur: 90, addr: 'ミッドタウン', area: 'midtown', th: ['np', 'ng', 'cp'], pop: 5 },
            { n: 'トップ・オブ・ザ・ロック', d: 'ロックフェラーセンター展望台', t: '観光', dur: 90, addr: 'ミッドタウン', area: 'midtown', th: ['np', 'ng', 'cp'], pop: 4 },
            { n: 'セントラルパーク', d: 'NYの巨大都市公園', t: '観光', dur: 120, addr: 'マンハッタン', area: 'central-park', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'メトロポリタン美術館', d: '世界三大美術館', t: '観光', dur: 240, addr: 'アッパーイーストサイド', area: 'central-park', th: ['ar', 'hs'], pop: 5 },
            { n: 'MoMA', d: '世界最高峰の現代美術館', t: '観光', dur: 180, addr: 'ミッドタウン', area: 'midtown', th: ['ar', 'cp'], pop: 5 },
            { n: 'ブルックリンブリッジ', d: 'マンハッタンを望む歩道橋', t: '観光', dur: 90, addr: 'ブルックリン', area: 'downtown', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'ハイライン', d: '旧高架線を再生した空中遊歩道', t: '観光', dur: 90, addr: 'チェルシー', area: 'midtown', th: ['sg', 'cp', 'np'], pop: 4 },
            { n: '9.11メモリアル', d: '世界貿易センター跡', t: '観光', dur: 90, addr: 'ダウンタウン', area: 'downtown', th: ['sg', 'hs'], pop: 5 },
            { n: 'ワンワールド展望台', d: 'WTCの最新展望台', t: '観光', dur: 90, addr: 'ダウンタウン', area: 'downtown', th: ['np', 'ng', 'cp'], pop: 4 },
            { n: 'ブロードウェイミュージカル', d: '本場のミュージカル鑑賞', t: '観光', dur: 180, addr: 'ミッドタウン', area: 'midtown', th: ['ar', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'チェルシーマーケット', d: '工場跡を再生したフードホール', t: 'グルメ', dur: 90, addr: 'チェルシー', area: 'midtown', th: ['gm', 'sg'], pop: 4 },
            { n: 'Katz\'s Delicatessen', d: '本場ニューヨークパストラミ', t: 'グルメ', dur: 75, addr: 'ロウアー・イーストサイド', area: 'downtown', th: ['gm', 'hs'], pop: 4 },
            { n: 'Joe\'s Pizza', d: 'NY style pizzaの定番', t: 'グルメ', dur: 30, addr: 'グリニッジビレッジ', area: 'downtown', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ザ・プラザ', addr: 'ミッドタウン', area: 'central-park', price: 95000 },
            { n: 'マンダリン オリエンタル ニューヨーク', addr: 'ミッドタウン', area: 'central-park', price: 110000 },
            { n: 'ザ・ノーマッド・ホテル', addr: 'ミッドタウン', area: 'midtown', price: 65000 },
        ],
    },

    // ロサンゼルス
    {
        id: 'la', name: 'ロサンゼルス', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['sg', 'fm', 'cp', 'sp', 'np'],
        areas: [
            { id: 'hollywood', name: 'ハリウッド' }, { id: 'beverly', name: 'ビバリーヒルズ' }, { id: 'santa-monica', name: 'サンタモニカ' },
        ],
        spots: [
            { n: 'ハリウッドサイン', d: 'LAのシンボル', t: '観光', dur: 60, addr: 'ハリウッド', area: 'hollywood', th: ['sg', 'np'], pop: 5 },
            { n: 'ウォーク・オブ・フェイム', d: '俳優の星型タイル', t: '観光', dur: 90, addr: 'ハリウッド', area: 'hollywood', th: ['sg', 'hs'], pop: 4 },
            { n: 'チャイニーズシアター', d: '有名俳優の手形足形', t: '観光', dur: 45, addr: 'ハリウッド', area: 'hollywood', th: ['sg', 'hs'], pop: 3 },
            { n: 'グリフィス天文台', d: 'LAのパノラマ夜景', t: '観光', dur: 120, addr: 'グリフィス公園', area: 'hollywood', th: ['np', 'ng', 'cp'], pop: 5 },
            { n: 'サンタモニカピア', d: '太平洋に突き出た有名な桟橋', t: '観光', dur: 120, addr: 'サンタモニカ', area: 'santa-monica', th: ['sg', 'cp', 'fm'], pop: 5 },
            { n: 'ヴェニスビーチ', d: 'カラフルな自由なビーチ', t: '観光', dur: 120, addr: 'ヴェニス', area: 'santa-monica', th: ['bc', 'sg'], pop: 4 },
            { n: 'ロデオドライブ', d: 'ビバリーヒルズの高級街', t: '観光', dur: 90, addr: 'ビバリーヒルズ', area: 'beverly', th: ['sp', 'sg'], pop: 4 },
            { n: 'ゲッティセンター', d: '丘の上の無料芸術センター', t: '観光', dur: 180, addr: 'ブレントウッド', area: 'beverly', th: ['ar', 'np'], pop: 4 },
            { n: 'ユニバーサル・スタジオ・ハリウッド', d: '本家USJ', t: '観光', dur: 480, addr: 'ユニバーサルシティ', area: 'hollywood', th: ['fm', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'ディズニーランド・アナハイム', d: 'ディズニー世界初のパーク', t: '観光', dur: 600, addr: 'アナハイム', area: 'hollywood', th: ['fm', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'ピンクの壁（ポール・スミス）', d: 'インスタの定番フォトスポット', t: '観光', dur: 30, addr: 'メルローズ', area: 'hollywood', th: ['sg', 'cp'], pop: 3 },
            { n: 'Pink\'s Hot Dogs', d: 'LAの伝説的ホットドッグ', t: 'グルメ', dur: 45, addr: 'ハリウッド', area: 'hollywood', th: ['gm', 'hs'], pop: 4 },
            { n: 'In-N-Out Burger', d: 'カリフォルニア発祥のバーガー', t: 'グルメ', dur: 45, addr: 'LA各所', area: 'hollywood', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ザ・ビバリー・ヒルズ・ホテル', addr: 'ビバリーヒルズ', area: 'beverly', price: 95000 },
            { n: 'シャトー・マーモント', addr: 'ハリウッド', area: 'hollywood', price: 78000 },
            { n: 'シェラトン・ゲートウェイ・ロサンゼルス', addr: 'LAX近郊', area: 'hollywood', price: 32000 },
        ],
    },

    // ハワイ・オアフ
    {
        id: 'hawaii-oahu', name: 'ハワイ', titleAlias: 'ハワイ・オアフ島', country: 'アメリカ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['bc', 'np', 'cp', 'fm', 'gm', 'sp'],
        areas: [
            { id: 'waikiki', name: 'ワイキキ' }, { id: 'northshore', name: 'ノースショア' }, { id: 'east', name: '東海岸' },
        ],
        spots: [
            { n: 'ワイキキビーチ', d: 'ハワイ最有名ビーチ', t: '観光', dur: 120, addr: 'ワイキキ', area: 'waikiki', th: ['bc', 'sg', 'cp'], pop: 5 },
            { n: 'ダイヤモンドヘッド', d: 'ハワイの絶景火山口', t: '観光', dur: 120, addr: 'ホノルル', area: 'waikiki', th: ['np', 'ex'], pop: 5 },
            { n: 'カラカウア大通り', d: 'ワイキキのメインストリート', t: '観光', dur: 120, addr: 'ワイキキ', area: 'waikiki', th: ['sp', 'gm', 'cp'], pop: 4 },
            { n: 'アラモアナセンター', d: 'ハワイ最大のショッピング', t: '観光', dur: 180, addr: 'アラモアナ', area: 'waikiki', th: ['sp'], pop: 5 },
            { n: 'パールハーバー', d: '真珠湾攻撃の歴史記念施設', t: '観光', dur: 240, addr: 'パールハーバー', area: 'east', th: ['sg', 'hs'], pop: 5 },
            { n: 'ハナウマ湾', d: '熱帯魚と泳げる絶景湾', t: '観光', dur: 240, addr: 'ホノルル', area: 'east', th: ['bc', 'np', 'fm'], pop: 5, bk: true },
            { n: 'ノースショア・サンセットビーチ', d: '冬の大波で有名', t: '観光', dur: 120, addr: 'ノースショア', area: 'northshore', th: ['bc', 'np', 'cp'], pop: 4 },
            { n: 'ドール・プランテーション', d: 'パイナップル農園とトレイン', t: '観光', dur: 120, addr: 'ノースショア', area: 'northshore', th: ['sg', 'fm', 'gm'], pop: 4 },
            { n: 'カイルアビーチ', d: '全米No.1ビーチに選出', t: '観光', dur: 180, addr: 'カイルア', area: 'east', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: 'ラニカイビーチ', d: '天国の海と呼ばれる絶景', t: '観光', dur: 120, addr: 'カイルア', area: 'east', th: ['bc', 'cp', 'np'], pop: 5 },
            { n: 'クアロアランチ', d: 'ジュラシックパーク撮影地', t: '観光', dur: 240, addr: 'クアロア', area: 'east', th: ['nt', 'ex', 'fm'], pop: 4, bk: true },
            { n: 'マラサダ Leonard\'s Bakery', d: 'ハワイ名物のドーナツ', t: 'グルメ', dur: 30, addr: 'ホノルル', area: 'waikiki', th: ['gm'], pop: 5 },
            { n: 'エッグスシングス ワイキキ本店', d: 'パンケーキの行列店', t: 'グルメ', dur: 75, addr: 'ワイキキ', area: 'waikiki', th: ['gm', 'cp'], pop: 5, morningOk: true },
            { n: 'ラハイナ・チキン Yo\'s Drive Inn', d: 'ハワイのプレートランチ', t: 'グルメ', dur: 45, addr: 'ホノルル', area: 'waikiki', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ザ・ロイヤル・ハワイアン', addr: 'ワイキキ', area: 'waikiki', price: 88000 },
            { n: 'ハレクラニ', addr: 'ワイキキ', area: 'waikiki', price: 95000 },
            { n: 'ハイアット リージェンシー ワイキキ', addr: 'ワイキキ', area: 'waikiki', price: 52000 },
            { n: 'シェラトン ワイキキ', addr: 'ワイキキ', area: 'waikiki', price: 58000 },
        ],
    },

    // グアム
    {
        id: 'guam', name: 'グアム', country: 'アメリカ', region: 'overseas_oceania',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['bc', 'fm', 'cp', 'np', 'sp'],
        areas: [
            { id: 'tumon', name: 'タモン' }, { id: 'south', name: '南部' },
        ],
        spots: [
            { n: 'タモンビーチ', d: 'グアムを代表するビーチ', t: '観光', dur: 120, addr: 'タモン', area: 'tumon', th: ['bc', 'sg', 'fm'], pop: 5 },
            { n: '恋人岬', d: 'グアムの伝説と絶景', t: '観光', dur: 60, addr: 'タムニン', area: 'tumon', th: ['cp', 'np', 'sg'], pop: 5 },
            { n: 'GPO（グアム プレミア アウトレット）', d: 'グアム最大のアウトレット', t: '観光', dur: 180, addr: 'タムニン', area: 'tumon', th: ['sp', 'gm'], pop: 4 },
            { n: 'マイクロネシアモール', d: 'グアム本島最大のモール', t: '観光', dur: 150, addr: 'デデド', area: 'tumon', th: ['sp', 'fm'], pop: 4 },
            { n: 'イナラハン天然プール', d: '南部の絶景天然プール', t: '観光', dur: 90, addr: 'イナラハン', area: 'south', th: ['bc', 'np'], pop: 4 },
            { n: 'タロフォフォの滝', d: '熱帯ジャングルの滝', t: '観光', dur: 90, addr: 'タロフォフォ', area: 'south', th: ['np', 'nt'], pop: 3 },
            { n: 'ココスアイランド', d: 'ボートで渡る無人島', t: '観光', dur: 240, addr: 'メリッソ', area: 'south', th: ['bc', 'ex', 'np'], pop: 4, bk: true },
            { n: 'ターザフォール体験', d: 'ジャングル冒険体験', t: '観光', dur: 180, addr: '南部', area: 'south', th: ['ex', 'nt'], pop: 3, bk: true },
            { n: 'チャモロビレッジ ナイトマーケット', d: '水曜夜の屋台フェスタ', t: 'グルメ', dur: 90, addr: 'ハガニア', area: 'tumon', th: ['gm', 'ng', 'sg'], pop: 5, eveningOk: true },
            { n: 'ザ・ビーチ・レストラン&バー', d: 'タモン湾を眺める海辺', t: 'グルメ', dur: 90, addr: 'タモン', area: 'tumon', th: ['gm', 'cp', 'ng'], pop: 4 },
        ],
        hotels: [
            { n: 'デュシタニ グアム リゾート', addr: 'タモン', area: 'tumon', price: 42000 },
            { n: 'ヒルトン グアム リゾート', addr: 'タモン', area: 'tumon', price: 38000 },
            { n: 'ホテル・ニッコー・グアム', addr: 'タモン', area: 'tumon', price: 32000 },
        ],
    },

    // シドニー
    {
        id: 'sydney', name: 'シドニー', country: 'オーストラリア', region: 'overseas_oceania',
        trip_style: 'overseas_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'np', 'cp', 'gm', 'bc', 'fm'],
        areas: [
            { id: 'cbd', name: 'シドニーCBD' }, { id: 'bondi', name: 'ボンダイ' }, { id: 'blue-mts', name: 'ブルーマウンテンズ' },
        ],
        spots: [
            { n: 'シドニー・オペラハウス', d: '世界遺産の貝殻建築', t: '観光', dur: 120, addr: 'シドニーCBD', area: 'cbd', th: ['sg', 'ar', 'wh', 'np'], pop: 5 },
            { n: 'シドニー・ハーバーブリッジ', d: 'ハーバーの巨大鉄橋', t: '観光', dur: 75, addr: 'シドニーCBD', area: 'cbd', th: ['sg', 'np', 'ex'], pop: 5 },
            { n: 'ロックス地区', d: 'シドニー発祥の歴史的地区', t: '観光', dur: 90, addr: 'シドニーCBD', area: 'cbd', th: ['sg', 'hs', 'gm'], pop: 4 },
            { n: 'ボンダイビーチ', d: 'オーストラリア有名ビーチ', t: '観光', dur: 180, addr: 'ボンダイ', area: 'bondi', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: 'タロンガ動物園', d: 'シドニー湾を望む動物園', t: '観光', dur: 240, addr: 'モスマン', area: 'cbd', th: ['fm', 'nt', 'sg'], pop: 4 },
            { n: 'ロイヤル植物園', d: 'シドニーの中央植物園', t: '観光', dur: 90, addr: 'シドニーCBD', area: 'cbd', th: ['nt', 'np', 'cp'], pop: 3 },
            { n: 'マンリービーチ・フェリー', d: 'フェリーで渡るビーチ', t: '観光', dur: 180, addr: 'マンリー', area: 'cbd', th: ['bc', 'cp', 'sg'], pop: 4 },
            { n: 'ブルーマウンテンズ', d: '世界遺産の青い山並み', t: '観光', dur: 480, addr: 'カトゥーンバ', area: 'blue-mts', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'シドニータワーアイ', d: '街を一望する展望タワー', t: '観光', dur: 75, addr: 'シドニーCBD', area: 'cbd', th: ['np', 'ng'], pop: 3 },
            { n: 'クイーン・ビクトリア・ビルディング', d: 'シドニー最美のショッピング', t: '観光', dur: 75, addr: 'シドニーCBD', area: 'cbd', th: ['sg', 'sp', 'hs'], pop: 3 },
            { n: 'パディーズマーケット', d: 'シドニーの蚤の市', t: '観光', dur: 90, addr: 'ヘイマーケット', area: 'cbd', th: ['sg', 'sp', 'gm'], pop: 3 },
            { n: 'ボンダイ・アイスバーグス', d: 'オーシャンプール併設レストラン', t: 'グルメ', dur: 120, addr: 'ボンダイ', area: 'bondi', th: ['gm', 'cp', 'np'], pop: 4 },
            { n: 'Hurricane\'s Grill', d: '名物BBQリブ', t: 'グルメ', dur: 90, addr: 'ボンダイ', area: 'bondi', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'パークハイアット シドニー', addr: 'ロックス', area: 'cbd', price: 105000 },
            { n: 'シャングリラ ホテル シドニー', addr: 'シドニーCBD', area: 'cbd', price: 58000 },
            { n: 'フォーシーズンズ シドニー', addr: 'シドニーCBD', area: 'cbd', price: 65000 },
        ],
    },

    // メルボルン
    {
        id: 'melbourne', name: 'メルボルン', country: 'オーストラリア', region: 'overseas_oceania',
        trip_style: 'overseas_transit', intra_mode: 'バス', intra_gap_min: 30,
        themes: ['sg', 'gm', 'ar', 'cp', 'sp'],
        areas: [
            { id: 'cbd', name: 'CBD' }, { id: 'great-ocean', name: 'グレートオーシャンロード' },
        ],
        spots: [
            { n: 'ユーレカ・スカイデッキ', d: 'メルボルン最高層展望', t: '観光', dur: 75, addr: 'サウスバンク', area: 'cbd', th: ['np', 'ng', 'cp'], pop: 4 },
            { n: 'フェデレーション・スクエア', d: 'メルボルンの中心広場', t: '観光', dur: 60, addr: 'CBD', area: 'cbd', th: ['sg', 'ar'], pop: 4 },
            { n: 'クイーン・ビクトリア・マーケット', d: 'メルボルン最大の市場', t: 'グルメ', dur: 120, addr: 'CBD', area: 'cbd', th: ['gm', 'sg', 'sp'], pop: 5 },
            { n: 'メルボルン・コーヒー文化', d: 'カフェ街散策', t: 'グルメ', dur: 90, addr: 'CBD', area: 'cbd', th: ['gm', 'cp'], pop: 5 },
            { n: 'ホシエ・レーン', d: 'ストリートアートのメッカ', t: '観光', dur: 60, addr: 'CBD', area: 'cbd', th: ['ar', 'sg', 'cp'], pop: 4 },
            { n: 'グレートオーシャンロード', d: '世界遺産級の絶景ドライブ', t: '観光', dur: 600, addr: 'ビクトリア州', area: 'great-ocean', th: ['np', 'sg'], pop: 5 },
            { n: '12人の使徒', d: 'グレートオーシャンの奇岩', t: '観光', dur: 120, addr: 'ポートキャンベル', area: 'great-ocean', th: ['np', 'sg'], pop: 5 },
            { n: 'フィリップ島ペンギンパレード', d: '夕暮れのペンギン行進', t: '観光', dur: 240, addr: 'フィリップ島', area: 'great-ocean', th: ['nt', 'sg', 'fm'], pop: 5, bk: true },
            { n: 'シー・ライフ・メルボルン水族館', d: '南極ペンギンの水族館', t: '観光', dur: 120, addr: 'CBD', area: 'cbd', th: ['fm', 'sg'], pop: 3 },
            { n: 'メルボルン王立植物園', d: '美しい植物園', t: '観光', dur: 90, addr: 'サウスヤラ', area: 'cbd', th: ['nt', 'cp'], pop: 3 },
            { n: 'Pellegrini\'s Espresso Bar', d: 'メルボルンの老舗エスプレッソ', t: 'グルメ', dur: 45, addr: 'CBD', area: 'cbd', th: ['gm', 'hs', 'cp'], pop: 4 },
            { n: 'Chin Chin', d: '東南アジア料理の人気店', t: 'グルメ', dur: 90, addr: 'CBD', area: 'cbd', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'クラウン・タワーズ・メルボルン', addr: 'サウスバンク', area: 'cbd', price: 65000 },
            { n: 'パークハイアット メルボルン', addr: 'イーストメルボルン', area: 'cbd', price: 58000 },
            { n: 'ザ・ラングハム メルボルン', addr: 'サウスバンク', area: 'cbd', price: 52000 },
        ],
    },

    // ドバイ
    {
        id: 'dubai', name: 'ドバイ', country: 'UAE', region: 'overseas_middleeast',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'np', 'sp', 'cp', 'ng', 'ex'],
        areas: [
            { id: 'downtown', name: 'ダウンタウン' }, { id: 'marina', name: 'マリーナ・ジュメイラ' }, { id: 'old', name: 'オールドドバイ' },
        ],
        spots: [
            { n: 'ブルジュ・ハリファ', d: '世界一の超高層ビル', t: '観光', dur: 120, addr: 'ダウンタウン', area: 'downtown', th: ['sg', 'np', 'ng'], pop: 5, bk: true },
            { n: 'ドバイモール', d: '世界最大のショッピングモール', t: '観光', dur: 180, addr: 'ダウンタウン', area: 'downtown', th: ['sp', 'fm'], pop: 5 },
            { n: 'ドバイファウンテン', d: 'ブルジュハリファ前の音楽噴水', t: '観光', dur: 30, addr: 'ダウンタウン', area: 'downtown', th: ['cp', 'ng', 'sg'], pop: 4, eveningOk: true },
            { n: 'パームジュメイラ', d: '人工島の絶景', t: '観光', dur: 120, addr: 'パームジュメイラ', area: 'marina', th: ['np', 'sg'], pop: 5 },
            { n: 'ブルジュアルアラブ', d: '7つ星帆の形ホテル', t: '観光', dur: 60, addr: 'ジュメイラ', area: 'marina', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'ジュメイラビーチ', d: 'ドバイの美しい白浜', t: '観光', dur: 120, addr: 'ジュメイラ', area: 'marina', th: ['bc', 'cp'], pop: 4 },
            { n: 'ゴールドスーク', d: '金細工の伝統市場', t: '観光', dur: 75, addr: 'デイラ', area: 'old', th: ['sp', 'sg', 'hs'], pop: 4 },
            { n: 'スパイススーク', d: 'スパイスの伝統市場', t: '観光', dur: 60, addr: 'デイラ', area: 'old', th: ['sp', 'gm', 'hs'], pop: 4 },
            { n: 'デザートサファリ', d: '砂漠ドライブと夕日', t: '観光', dur: 360, addr: 'ドバイ砂漠', area: 'old', th: ['ex', 'cp', 'np'], pop: 5, bk: true },
            { n: 'ドバイマリーナ', d: 'モダンな運河とヨット', t: '観光', dur: 120, addr: 'ドバイマリーナ', area: 'marina', th: ['cp', 'gm', 'sp'], pop: 4 },
            { n: 'シェイク・ザイード・グランドモスク（アブダビ）', d: '巨大な白亜のモスク', t: '観光', dur: 180, addr: 'アブダビ', area: 'old', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'アル・ファヒディ歴史地区', d: '旧市街の風塔建築', t: '観光', dur: 90, addr: 'ブルドバイ', area: 'old', th: ['sg', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'ブルジュ・アル・アラブ・ジュメイラ', addr: 'ジュメイラ', area: 'marina', price: 180000 },
            { n: 'アトランティス ザ パーム', addr: 'パームジュメイラ', area: 'marina', price: 85000 },
            { n: 'アルマーニ ホテル ドバイ', addr: 'ダウンタウン', area: 'downtown', price: 110000 },
            { n: 'マディナ・ジュメイラ', addr: 'ジュメイラ', area: 'marina', price: 95000 },
        ],
    },
]
