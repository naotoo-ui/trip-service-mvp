import type { DestinationEntry } from '../types'

// 海外 ヨーロッパ: パリ・ロンドン・ローマ・バルセロナ・プラハ・ウィーン・アムステルダム・ベルリン

export const OVERSEAS_PART3: DestinationEntry[] = [
    // パリ
    {
        id: 'paris', name: 'パリ', country: 'フランス', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'cp', 'ar', 'sp', 'hs', 'wh'],
        areas: [
            { id: 'eiffel', name: 'エッフェル・トロカデロ' }, { id: 'louvre', name: 'ルーブル周辺' }, { id: 'montmartre', name: 'モンマルトル' }, { id: 'versailles', name: 'ヴェルサイユ' },
        ],
        spots: [
            { n: 'エッフェル塔', d: 'パリの象徴と展望', t: '観光', dur: 120, addr: '7区', area: 'eiffel', th: ['sg', 'np', 'cp', 'ng'], pop: 5 },
            { n: 'ルーブル美術館', d: '世界一の美術館・モナリザ', t: '観光', dur: 240, addr: '1区', area: 'louvre', th: ['ar', 'sg', 'hs'], pop: 5, bk: true },
            { n: 'シャンゼリゼ通り・凱旋門', d: 'パリの目抜き通りと凱旋門', t: '観光', dur: 120, addr: '8区', area: 'louvre', th: ['sg', 'sp', 'hs'], pop: 5 },
            { n: 'ノートルダム大聖堂', d: 'ゴシック建築の傑作（修復進行中）', t: '観光', dur: 60, addr: '4区', area: 'louvre', th: ['sg', 'hs'], pop: 4 },
            { n: 'モンマルトル・サクレクール寺院', d: '丘の上の白亜の聖堂', t: '観光', dur: 120, addr: '18区', area: 'montmartre', th: ['sg', 'np', 'cp', 'hs'], pop: 5 },
            { n: 'オルセー美術館', d: '印象派の傑作コレクション', t: '観光', dur: 180, addr: '7区', area: 'louvre', th: ['ar', 'cp'], pop: 5 },
            { n: 'オランジュリー美術館', d: 'モネの睡蓮の楕円形展示', t: '観光', dur: 90, addr: '1区', area: 'louvre', th: ['ar', 'cp'], pop: 4 },
            { n: 'セーヌ川クルーズ', d: 'パリの夜景を水上から', t: '観光', dur: 90, addr: '1区', area: 'eiffel', th: ['cp', 'ng', 'np'], pop: 5 },
            { n: 'ヴェルサイユ宮殿', d: 'ルイ14世の世界遺産宮殿', t: '観光', dur: 240, addr: 'ヴェルサイユ', area: 'versailles', th: ['sg', 'hs', 'wh'], pop: 5, bk: true },
            { n: 'モンサンミッシェル日帰りツアー', d: 'パリ発の世界遺産ツアー', t: '観光', dur: 720, addr: 'ノルマンディー', area: 'versailles', th: ['sg', 'hs', 'wh'], pop: 5, bk: true },
            { n: 'マレ地区散策', d: 'おしゃれカフェと貴族邸宅街', t: '観光', dur: 120, addr: '4区', area: 'louvre', th: ['sg', 'cp', 'sp'], pop: 4 },
            { n: 'ラ・デュレ シャンゼリゼ', d: 'マカロン発祥の老舗', t: 'グルメ', dur: 45, addr: '8区', area: 'louvre', th: ['gm', 'cp'], pop: 5 },
            { n: 'ル・コンスーラ', d: 'モンマルトルの老舗ビストロ', t: 'グルメ', dur: 90, addr: '18区', area: 'montmartre', th: ['gm', 'hs'], pop: 4 },
            { n: 'ピエール・エルメ・パリ', d: '世界的マカロンとパティスリー', t: 'グルメ', dur: 45, addr: '6区', area: 'louvre', th: ['gm', 'cp'], pop: 4 },
            { n: 'ムーラン・ルージュ', d: 'パリ伝統のキャバレーショー', t: '観光', dur: 150, addr: '18区', area: 'montmartre', th: ['ng', 'cp', 'ex'], pop: 4, bk: true },
        ],
        hotels: [
            { n: 'リッツ・パリ', addr: '1区', area: 'louvre', price: 130000 },
            { n: 'ザ・ペニンシュラ・パリ', addr: '16区', area: 'eiffel', price: 110000 },
            { n: 'ホテル・ル・ブリストル・パリ', addr: '8区', area: 'louvre', price: 120000 },
            { n: 'ホテル ルッテシア', addr: '6区', area: 'louvre', price: 78000 },
        ],
    },

    // ロンドン
    {
        id: 'london', name: 'ロンドン', country: 'イギリス', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'hs', 'ar', 'sp', 'fm', 'wh'],
        areas: [
            { id: 'westminster', name: 'ウェストミンスター' }, { id: 'city', name: 'シティ' }, { id: 'kensington', name: 'ケンジントン' },
        ],
        spots: [
            { n: 'ビッグベン・国会議事堂', d: 'ロンドンのシンボル', t: '観光', dur: 60, addr: 'ウェストミンスター', area: 'westminster', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ロンドン・アイ', d: 'テムズ川沿いの大観覧車', t: '観光', dur: 60, addr: 'ランベス', area: 'westminster', th: ['np', 'cp', 'ng'], pop: 5 },
            { n: 'バッキンガム宮殿', d: '衛兵交代式が見もの', t: '観光', dur: 90, addr: 'ウェストミンスター', area: 'westminster', th: ['sg', 'hs'], pop: 5 },
            { n: '大英博物館', d: '世界の至宝コレクション', t: '観光', dur: 240, addr: 'ブルームズベリー', area: 'city', th: ['ar', 'hs', 'sg'], pop: 5 },
            { n: 'ロンドン塔', d: '王室宝物殿の世界遺産', t: '観光', dur: 180, addr: 'シティ', area: 'city', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'タワーブリッジ', d: 'ロンドンの代表的橋', t: '観光', dur: 45, addr: 'シティ', area: 'city', th: ['sg', 'np'], pop: 4 },
            { n: 'ウェストミンスター寺院', d: '英国王室戴冠式の世界遺産', t: '観光', dur: 90, addr: 'ウェストミンスター', area: 'westminster', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ナショナル・ギャラリー', d: '無料の世界的美術館', t: '観光', dur: 150, addr: 'トラファルガー広場', area: 'westminster', th: ['ar', 'hs'], pop: 4 },
            { n: '自然史博物館', d: '恐竜と地球科学の博物館', t: '観光', dur: 150, addr: 'ケンジントン', area: 'kensington', th: ['sg', 'fm'], pop: 4 },
            { n: 'ハロッズ', d: 'ロンドンの伝統高級デパート', t: '観光', dur: 120, addr: 'ナイツブリッジ', area: 'kensington', th: ['sp', 'gm'], pop: 4 },
            { n: 'カムデン・マーケット', d: 'パンクとサブカルの市場', t: '観光', dur: 90, addr: 'カムデン', area: 'city', th: ['sg', 'sp', 'gm'], pop: 3 },
            { n: 'コヴェント・ガーデン', d: '大道芸と買い物の広場', t: '観光', dur: 90, addr: 'コヴェント・ガーデン', area: 'city', th: ['sg', 'sp', 'gm'], pop: 4 },
            { n: 'アフタヌーンティー（フォートナム&メイソン）', d: '本場のアフタヌーンティー', t: 'グルメ', dur: 120, addr: 'ピカデリー', area: 'westminster', th: ['gm', 'cp', 'hs'], pop: 5, bk: true },
            { n: 'ボロー・マーケット', d: 'ロンドン最古の食品市場', t: 'グルメ', dur: 90, addr: 'サザーク', area: 'city', th: ['gm', 'sg'], pop: 5 },
            { n: 'パブ（ザ・チャーチル・アームズ）', d: '花に覆われた伝統パブ', t: 'グルメ', dur: 90, addr: 'ノッティングヒル', area: 'kensington', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'ザ・リッツ・ロンドン', addr: 'ピカデリー', area: 'westminster', price: 140000 },
            { n: 'クラリッジス', addr: 'メイフェア', area: 'westminster', price: 130000 },
            { n: 'コノート', addr: 'メイフェア', area: 'westminster', price: 145000 },
            { n: 'ザ・サヴォイ', addr: 'ストランド', area: 'city', price: 110000 },
        ],
    },

    // ローマ
    {
        id: 'rome', name: 'ローマ', country: 'イタリア', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'hs', 'wh', 'cp', 'ar'],
        areas: [
            { id: 'ancient', name: '古代ローマ' }, { id: 'vatican', name: 'ヴァチカン' }, { id: 'trastevere', name: 'トラステヴェレ' },
        ],
        spots: [
            { n: 'コロッセオ', d: '古代ローマの円形闘技場（世界遺産）', t: '観光', dur: 120, addr: '古代ローマ', area: 'ancient', th: ['sg', 'hs', 'wh'], pop: 5, bk: true },
            { n: 'フォロ・ロマーノ', d: 'ローマ帝国の中心遺跡', t: '観光', dur: 120, addr: '古代ローマ', area: 'ancient', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'バチカン市国・サン・ピエトロ大聖堂', d: 'カトリックの総本山', t: '観光', dur: 180, addr: 'ヴァチカン', area: 'vatican', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ヴァチカン美術館・システィーナ礼拝堂', d: 'ミケランジェロの傑作', t: '観光', dur: 240, addr: 'ヴァチカン', area: 'vatican', th: ['ar', 'sg', 'hs'], pop: 5, bk: true },
            { n: 'トレヴィの泉', d: 'コインを投げる願いの泉', t: '観光', dur: 45, addr: 'ローマ中心', area: 'trastevere', th: ['sg', 'cp'], pop: 5 },
            { n: 'スペイン広場・スペイン階段', d: 'ローマの休日の舞台', t: '観光', dur: 60, addr: 'ローマ中心', area: 'trastevere', th: ['sg', 'cp'], pop: 5 },
            { n: 'パンテオン', d: '完璧な保存の古代神殿', t: '観光', dur: 60, addr: 'ローマ中心', area: 'trastevere', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ナヴォーナ広場', d: 'バロックの噴水広場', t: '観光', dur: 60, addr: 'ローマ中心', area: 'trastevere', th: ['sg', 'cp'], pop: 4 },
            { n: 'トラステヴェレ地区', d: 'ローマっ子の下町散策', t: '観光', dur: 120, addr: 'トラステヴェレ', area: 'trastevere', th: ['sg', 'gm', 'cp'], pop: 4 },
            { n: 'カラカラ浴場', d: '巨大ローマ式公衆浴場跡', t: '観光', dur: 90, addr: '古代ローマ', area: 'ancient', th: ['sg', 'hs'], pop: 3 },
            { n: 'ジョリッティ', d: '本場のローマジェラート老舗', t: 'グルメ', dur: 30, addr: 'ローマ中心', area: 'trastevere', th: ['gm', 'cp'], pop: 5 },
            { n: 'ダ・エンツォ・アル29', d: 'トラステヴェレの伝統トラットリア', t: 'グルメ', dur: 90, addr: 'トラステヴェレ', area: 'trastevere', th: ['gm', 'cp'], pop: 5 },
            { n: 'ピッツェリア ダ・バッフェット', d: 'ローマ風薄ピザの名店', t: 'グルメ', dur: 75, addr: 'ローマ中心', area: 'trastevere', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ホテル・ハスラー・ローマ', addr: 'ローマ中心', area: 'trastevere', price: 88000 },
            { n: 'ザ・セント・レジス・ローマ', addr: 'ローマ中心', area: 'trastevere', price: 95000 },
            { n: 'ホテル・デ・ルッシー', addr: 'ローマ中心', area: 'trastevere', price: 78000 },
        ],
    },

    // バルセロナ
    {
        id: 'barcelona', name: 'バルセロナ', country: 'スペイン', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'ar', 'cp', 'wh', 'bc'],
        areas: [
            { id: 'gothic', name: 'ゴシック地区' }, { id: 'gracia', name: 'グラシア' }, { id: 'barceloneta', name: 'バルセロネータ' },
        ],
        spots: [
            { n: 'サグラダ・ファミリア', d: 'ガウディの未完の傑作', t: '観光', dur: 150, addr: 'グラシア区', area: 'gracia', th: ['sg', 'ar', 'wh'], pop: 5, bk: true },
            { n: 'グエル公園', d: 'ガウディのおとぎの世界', t: '観光', dur: 120, addr: 'グラシア区', area: 'gracia', th: ['ar', 'np', 'wh', 'cp'], pop: 5, bk: true },
            { n: 'カサ・バトリョ', d: 'ガウディのモデルニスモ建築', t: '観光', dur: 90, addr: 'グラシア通り', area: 'gracia', th: ['ar', 'wh', 'cp'], pop: 4 },
            { n: 'カサ・ミラ', d: 'ガウディのもうひとつの代表作', t: '観光', dur: 75, addr: 'グラシア通り', area: 'gracia', th: ['ar', 'wh'], pop: 4 },
            { n: 'ランブラス通り', d: 'バルセロナ最大の歩行者天国', t: '観光', dur: 90, addr: 'ゴシック地区', area: 'gothic', th: ['sg', 'sp', 'gm'], pop: 5 },
            { n: 'ゴシック地区・大聖堂', d: '中世の路地と大聖堂', t: '観光', dur: 120, addr: 'ゴシック地区', area: 'gothic', th: ['sg', 'hs'], pop: 5 },
            { n: 'ピカソ美術館', d: 'ピカソの初期コレクション', t: '観光', dur: 90, addr: 'ゴシック地区', area: 'gothic', th: ['ar', 'hs'], pop: 4 },
            { n: 'バルセロネータビーチ', d: '地中海のリゾートビーチ', t: '観光', dur: 90, addr: 'バルセロネータ', area: 'barceloneta', th: ['bc', 'cp'], pop: 4 },
            { n: 'モンジュイック城・噴水ショー', d: '夜の音楽噴水ショー', t: '観光', dur: 90, addr: 'モンジュイック', area: 'gothic', th: ['ng', 'cp', 'np'], pop: 4 },
            { n: 'ボケリア市場', d: 'ヨーロッパ屈指の食材市場', t: 'グルメ', dur: 90, addr: 'ランブラス', area: 'gothic', th: ['gm', 'sg'], pop: 5 },
            { n: 'タパス バー ボディオ', d: 'ゴシックの老舗タパスバー', t: 'グルメ', dur: 75, addr: 'ゴシック地区', area: 'gothic', th: ['gm', 'hs'], pop: 4 },
            { n: 'パエリア レストラン 7 Portes', d: 'バルセロナの老舗パエリア', t: 'グルメ', dur: 90, addr: 'バルセロネータ', area: 'barceloneta', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'マンダリン オリエンタル バルセロナ', addr: 'グラシア', area: 'gracia', price: 78000 },
            { n: 'ホテル・アーツ・バルセロナ', addr: 'バルセロネータ', area: 'barceloneta', price: 68000 },
            { n: 'ホテル・カーサ・フスター', addr: 'グラシア', area: 'gracia', price: 48000 },
        ],
    },

    // プラハ
    {
        id: 'prague', name: 'プラハ', country: 'チェコ', region: 'overseas_europe',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'hs', 'wh', 'cp', 'gm'],
        areas: [
            { id: 'oldtown', name: '旧市街' }, { id: 'castle', name: 'プラハ城' },
        ],
        spots: [
            { n: 'プラハ城', d: 'チェコ大統領官邸・聖ヴィート大聖堂', t: '観光', dur: 180, addr: 'プラハ城地区', area: 'castle', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'カレル橋', d: '銅像が並ぶゴシック橋', t: '観光', dur: 60, addr: '旧市街', area: 'oldtown', th: ['sg', 'hs', 'cp', 'np'], pop: 5 },
            { n: '旧市街広場・天文時計', d: 'ヨーロッパ最古の天文時計', t: '観光', dur: 60, addr: '旧市街', area: 'oldtown', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'ユダヤ人街', d: '歴史的シナゴーグ群', t: '観光', dur: 120, addr: 'ヨゼフォフ', area: 'oldtown', th: ['sg', 'hs'], pop: 3 },
            { n: '黄金小路', d: 'プラハ城内のカフカゆかりの路地', t: '観光', dur: 30, addr: 'プラハ城地区', area: 'castle', th: ['sg', 'hs'], pop: 4 },
            { n: 'ヴァーツラフ広場', d: 'プラハの目抜き通り', t: '観光', dur: 60, addr: '新市街', area: 'oldtown', th: ['sg', 'sp'], pop: 3 },
            { n: 'クレメンティヌム', d: 'バロックの図書館', t: '観光', dur: 60, addr: '旧市街', area: 'oldtown', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'チャールズ橋からの夜景', d: '夕暮れの絶景スポット', t: '観光', dur: 60, addr: '旧市街', area: 'oldtown', th: ['cp', 'ng', 'np'], pop: 5 },
            { n: '聖ニコラス教会', d: 'バロックの傑作教会', t: '観光', dur: 45, addr: '旧市街', area: 'oldtown', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'プラハ料理 U Fleku', d: '500年続く伝統ビアホール', t: 'グルメ', dur: 90, addr: '新市街', area: 'oldtown', th: ['gm', 'hs'], pop: 4 },
            { n: 'カフェ・ルーブル', d: 'カフカも通ったカフェ', t: 'グルメ', dur: 60, addr: '新市街', area: 'oldtown', th: ['gm', 'hs', 'cp'], pop: 3 },
            { n: 'トルデルニーク（屋台）', d: '名物の筒形パン', t: 'グルメ', dur: 30, addr: '旧市街', area: 'oldtown', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'フォーシーズンズホテル プラハ', addr: '旧市街', area: 'oldtown', price: 62000 },
            { n: 'マンダリン オリエンタル プラハ', addr: 'マラー・ストラナ', area: 'castle', price: 55000 },
            { n: 'ホテル パリ プラハ', addr: '旧市街', area: 'oldtown', price: 28000 },
        ],
    },

    // ウィーン
    {
        id: 'vienna', name: 'ウィーン', country: 'オーストリア', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 25,
        themes: ['sg', 'hs', 'wh', 'ar', 'cp'],
        areas: [
            { id: 'innere', name: '旧市街' }, { id: 'schonbrunn', name: 'シェーンブルン' },
        ],
        spots: [
            { n: 'シェーンブルン宮殿', d: 'ハプスブルク家の世界遺産', t: '観光', dur: 180, addr: 'マイドリンク', area: 'schonbrunn', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ホーフブルク王宮', d: 'ハプスブルク帝国の宮殿', t: '観光', dur: 120, addr: '旧市街', area: 'innere', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'シュテファン大聖堂', d: 'ウィーンの大聖堂', t: '観光', dur: 60, addr: '旧市街', area: 'innere', th: ['sg', 'hs'], pop: 5 },
            { n: '美術史美術館', d: 'ハプスブルクの絵画コレクション', t: '観光', dur: 180, addr: '旧市街', area: 'innere', th: ['ar', 'hs'], pop: 5 },
            { n: 'ベルヴェデーレ宮殿', d: 'クリムト「接吻」のあるバロック宮殿', t: '観光', dur: 120, addr: 'ベルヴェデーレ', area: 'innere', th: ['ar', 'hs', 'cp'], pop: 5 },
            { n: 'ウィーン国立歌劇場', d: '世界最高峰のオペラハウス', t: '観光', dur: 75, addr: '旧市街', area: 'innere', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'リング通り散策', d: 'ウィーン旧市街の環状道路', t: '観光', dur: 90, addr: '旧市街', area: 'innere', th: ['sg', 'hs'], pop: 3 },
            { n: 'カフェ・ザッハー', d: 'ザッハートルテ発祥の名店', t: 'グルメ', dur: 60, addr: '旧市街', area: 'innere', th: ['gm', 'hs', 'cp'], pop: 5 },
            { n: 'カフェ・セントラル', d: 'フロイトも通った歴史カフェ', t: 'グルメ', dur: 60, addr: '旧市街', area: 'innere', th: ['gm', 'hs'], pop: 4 },
            { n: 'プラーター遊園地', d: 'ウィーンの大観覧車', t: '観光', dur: 120, addr: 'プラーター', area: 'innere', th: ['fm', 'cp'], pop: 3 },
            { n: 'フィガロハウス（モーツァルトハウス）', d: 'モーツァルト住居跡', t: '観光', dur: 60, addr: '旧市街', area: 'innere', th: ['sg', 'hs'], pop: 3 },
            { n: 'フィグルミューラー', d: 'ウィーン名物の巨大シュニッツェル', t: 'グルメ', dur: 75, addr: '旧市街', area: 'innere', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'ホテル・ザッハー・ウィーン', addr: '旧市街', area: 'innere', price: 72000 },
            { n: 'ザ・リッツ・カールトン・ウィーン', addr: '旧市街', area: 'innere', price: 65000 },
            { n: 'ホテル・インペリアル', addr: '旧市街', area: 'innere', price: 78000 },
        ],
    },

    // アムステルダム
    {
        id: 'amsterdam', name: 'アムステルダム', country: 'オランダ', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'ar', 'cp', 'hs', 'np'],
        areas: [
            { id: 'canal', name: '運河地区' }, { id: 'museum', name: 'ミュージアム広場' },
        ],
        spots: [
            { n: '運河巡りクルーズ', d: '世界遺産の運河を巡る', t: '観光', dur: 90, addr: '運河地区', area: 'canal', th: ['sg', 'cp', 'wh', 'np'], pop: 5 },
            { n: 'アンネ・フランクの家', d: 'アンネが隠れ住んだ家', t: '観光', dur: 90, addr: '運河地区', area: 'canal', th: ['sg', 'hs'], pop: 5, bk: true },
            { n: 'アムステルダム国立美術館', d: 'レンブラントとフェルメール', t: '観光', dur: 180, addr: 'ミュージアム広場', area: 'museum', th: ['ar', 'hs'], pop: 5 },
            { n: 'ゴッホ美術館', d: '世界最大のゴッホ作品コレクション', t: '観光', dur: 150, addr: 'ミュージアム広場', area: 'museum', th: ['ar', 'cp'], pop: 5, bk: true },
            { n: 'ダム広場・王宮', d: 'アムステルダムの中心広場', t: '観光', dur: 60, addr: '運河地区', area: 'canal', th: ['sg', 'hs'], pop: 4 },
            { n: 'ヨルダーン地区', d: 'おしゃれカフェの運河沿い地区', t: '観光', dur: 120, addr: 'ヨルダーン', area: 'canal', th: ['sg', 'gm', 'cp', 'sp'], pop: 4 },
            { n: 'ハイネケンエクスペリエンス', d: 'ビール工場見学', t: '観光', dur: 90, addr: 'ミュージアム広場', area: 'museum', th: ['ex', 'gm', 'fm'], pop: 4 },
            { n: 'フォンデル公園', d: 'アムステルダムの中央公園', t: '観光', dur: 75, addr: 'ミュージアム広場', area: 'museum', th: ['nt', 'cp'], pop: 3 },
            { n: 'キューケンホフ公園（季節限定）', d: 'チューリップの絶景庭園', t: '観光', dur: 240, addr: 'リッセ', area: 'canal', th: ['np', 'cp'], pop: 5 },
            { n: 'ザーンセスカンス', d: '伝統的風車村', t: '観光', dur: 180, addr: 'ザーンセスカンス', area: 'canal', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: 'パンケーキ・ハウス・アップステアーズ', d: '本場オランダパンケーキ', t: 'グルメ', dur: 60, addr: '運河地区', area: 'canal', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'デ・ロロップ', addr: '運河地区', area: 'canal', price: 95000 },
            { n: 'コンサーバトリウム ホテル', addr: 'ミュージアム広場', area: 'museum', price: 78000 },
            { n: 'ホテル・パルク・センラル', addr: '運河地区', area: 'canal', price: 42000 },
        ],
    },

    // ベルリン
    {
        id: 'berlin', name: 'ベルリン', country: 'ドイツ', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'hs', 'ar', 'gm'],
        areas: [
            { id: 'mitte', name: 'ミッテ' }, { id: 'kreuzberg', name: 'クロイツベルク' },
        ],
        spots: [
            { n: 'ブランデンブルク門', d: 'ベルリンとドイツのシンボル', t: '観光', dur: 45, addr: 'ミッテ', area: 'mitte', th: ['sg', 'hs'], pop: 5 },
            { n: 'ベルリンの壁・イーストサイドギャラリー', d: '世界最長の屋外アートギャラリー', t: '観光', dur: 90, addr: 'フリードリヒスハイン', area: 'kreuzberg', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'チェックポイント・チャーリー', d: '冷戦時代の検問所跡', t: '観光', dur: 45, addr: 'クロイツベルク', area: 'kreuzberg', th: ['sg', 'hs'], pop: 4 },
            { n: '博物館島', d: '5つの世界遺産博物館', t: '観光', dur: 240, addr: 'ミッテ', area: 'mitte', th: ['ar', 'hs', 'wh'], pop: 5 },
            { n: 'ペルガモン博物館', d: '古代ギリシャの大祭壇', t: '観光', dur: 150, addr: 'ミッテ', area: 'mitte', th: ['ar', 'hs', 'wh'], pop: 5 },
            { n: 'テレビ塔', d: 'ベルリン最高の展望', t: '観光', dur: 75, addr: 'ミッテ', area: 'mitte', th: ['np', 'sg'], pop: 4 },
            { n: 'ホロコースト記念碑', d: 'ナチス犠牲者への追悼碑', t: '観光', dur: 60, addr: 'ミッテ', area: 'mitte', th: ['sg', 'hs'], pop: 4 },
            { n: 'ライヒスターク（国会議事堂）', d: 'ガラスドームと国会建築', t: '観光', dur: 90, addr: 'ミッテ', area: 'mitte', th: ['sg', 'hs', 'np'], pop: 4, bk: true },
            { n: 'ティアガルテン公園', d: 'ベルリン中心の大公園', t: '観光', dur: 90, addr: 'ミッテ', area: 'mitte', th: ['nt', 'cp'], pop: 3 },
            { n: 'カリーブルスト Konnopke', d: 'ベルリン名物カリーブルスト', t: 'グルメ', dur: 45, addr: 'プレンツラウアーベルク', area: 'kreuzberg', th: ['gm', 'hs'], pop: 4 },
            { n: 'シュランクヴェルクシュタット', d: '本場のクラフトビアホール', t: 'グルメ', dur: 90, addr: 'クロイツベルク', area: 'kreuzberg', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテル・アドロン・ケンピンスキー・ベルリン', addr: 'ミッテ', area: 'mitte', price: 78000 },
            { n: 'ザ・リッツ・カールトン・ベルリン', addr: 'ミッテ', area: 'mitte', price: 65000 },
            { n: 'ホテル・デ・ローマ', addr: 'ミッテ', area: 'mitte', price: 58000 },
        ],
    },
]
