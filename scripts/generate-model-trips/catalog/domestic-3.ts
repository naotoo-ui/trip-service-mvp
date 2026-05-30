import type { DestinationEntry } from '../types'

// 国内: 神戸・横浜・草津温泉・別府由布院・熊本阿蘇・高知・直島・石垣島・宮古島・屋久島

export const DOMESTIC_PART3: DestinationEntry[] = [
    // 16. 神戸
    {
        id: 'kobe', name: '神戸', country: '日本', region: 'kansai',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'cp', 'ng', 'np'],
        areas: [
            { id: 'sannomiya', name: '三宮' }, { id: 'kitano', name: '北野' }, { id: 'harbor', name: 'ハーバーランド' },
        ],
        spots: [
            { n: 'メリケンパーク', d: 'ポートタワーと海辺の写真スポット', t: '観光', dur: 60, addr: '神戸市中央区波止場町', area: 'harbor', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: '神戸ハーバーランドumie', d: '海辺のショッピング＆夜景', t: '観光', dur: 120, addr: '神戸市中央区東川崎町', area: 'harbor', th: ['sp', 'cp', 'ng'], pop: 4 },
            { n: '神戸ポートタワー', d: '神戸のシンボル展望タワー', t: '観光', dur: 60, addr: '神戸市中央区波止場町', area: 'harbor', th: ['sg', 'np', 'ng'], pop: 4 },
            { n: '北野異人館街', d: 'うろこの家など欧風建築の街並み', t: '観光', dur: 120, addr: '神戸市中央区北野町', area: 'kitano', th: ['sg', 'cp', 'hs'], pop: 5 },
            { n: '南京町（神戸中華街）', d: '関西最大の中華街', t: '観光', dur: 75, addr: '神戸市中央区栄町通', area: 'sannomiya', th: ['gm', 'sg'], pop: 5 },
            { n: '生田神社', d: '縁結びで知られる神戸の総鎮守', t: '観光', dur: 45, addr: '神戸市中央区下山手通', area: 'sannomiya', th: ['sg', 'cp'], pop: 4 },
            { n: '六甲山ガーデンテラス', d: '1000万ドルの夜景スポット', t: '観光', dur: 120, addr: '神戸市灘区六甲山町', area: 'sannomiya', th: ['ng', 'cp', 'np'], pop: 5 },
            { n: '摩耶山掬星台', d: '日本三大夜景のひとつ', t: '観光', dur: 90, addr: '神戸市灘区摩耶山町', area: 'sannomiya', th: ['ng', 'cp', 'np'], pop: 5 },
            { n: '神戸牛グリル一神', d: 'ハーバーランドの本格神戸牛', t: 'グルメ', dur: 90, addr: '神戸市中央区東川崎町', area: 'harbor', th: ['gm', 'cp'], pop: 4 },
            { n: 'モーリヤ三宮本店', d: '神戸牛ステーキの老舗', t: 'グルメ', dur: 90, addr: '神戸市中央区下山手通', area: 'sannomiya', th: ['gm', 'cp'], pop: 5, bk: true },
            { n: 'フロインドリーブ 本店', d: '教会建築のドイツパンの名店', t: 'グルメ', dur: 60, addr: '神戸市中央区生田町', area: 'kitano', th: ['gm', 'cp'], pop: 4 },
            { n: 'スターバックス 神戸北野異人館店', d: '異人館を改装したスタバ', t: 'グルメ', dur: 30, addr: '神戸市中央区北野町', area: 'kitano', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテルオークラ神戸', addr: '神戸市中央区波止場町', area: 'harbor', price: 32000 },
            { n: 'ホテル ラ・スイート神戸ハーバーランド', addr: '神戸市中央区波止場町', area: 'harbor', price: 38000 },
            { n: '神戸ベイシェラトン ホテル&タワーズ', addr: '神戸市東灘区向洋町中', area: 'harbor', price: 28000 },
        ],
    },

    // 17. 横浜
    {
        id: 'yokohama', name: '横浜', country: '日本', region: 'kanto',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'cp', 'ng', 'fm'],
        areas: [
            { id: 'minatomirai', name: 'みなとみらい' }, { id: 'chinatown', name: '中華街' }, { id: 'motomachi', name: '元町・山手' },
        ],
        spots: [
            { n: '横浜ランドマークタワー', d: '69階のスカイガーデン', t: '観光', dur: 90, addr: '横浜市西区みなとみらい', area: 'minatomirai', th: ['np', 'cp', 'ng'], pop: 5 },
            { n: 'よこはまコスモワールド', d: 'みなとみらいの大観覧車', t: '観光', dur: 90, addr: '横浜市中区新港', area: 'minatomirai', th: ['cp', 'fm', 'ng'], pop: 5 },
            { n: '赤レンガ倉庫', d: '歴史的建造物のショッピング＆カフェ', t: '観光', dur: 90, addr: '横浜市中区新港', area: 'minatomirai', th: ['sg', 'cp', 'sp'], pop: 5 },
            { n: '山下公園', d: '海辺の散策路と氷川丸', t: '観光', dur: 60, addr: '横浜市中区山下町', area: 'chinatown', th: ['sg', 'cp', 'np'], pop: 4 },
            { n: '横浜中華街', d: '日本最大の中華街', t: '観光', dur: 120, addr: '横浜市中区山下町', area: 'chinatown', th: ['gm', 'sg'], pop: 5 },
            { n: '元町商店街', d: 'おしゃれセレクトショップ街', t: '観光', dur: 75, addr: '横浜市中区元町', area: 'motomachi', th: ['sp', 'cp', 'gm'], pop: 4 },
            { n: '港の見える丘公園', d: 'バラ園とベイブリッジ展望', t: '観光', dur: 60, addr: '横浜市中区山手町', area: 'motomachi', th: ['cp', 'np'], pop: 4 },
            { n: '横浜美術館', d: 'みなとみらいの現代美術館', t: '観光', dur: 90, addr: '横浜市西区みなとみらい', area: 'minatomirai', th: ['ar', 'cp'], pop: 3 },
            { n: '横浜ワールドポーターズ', d: 'みなとみらいの大型ショッピング', t: '観光', dur: 90, addr: '横浜市中区新港', area: 'minatomirai', th: ['sp', 'fm', 'gm'], pop: 3 },
            { n: '聘珍樓 横濱本店', d: '中華街老舗の名店', t: 'グルメ', dur: 90, addr: '横浜市中区山下町', area: 'chinatown', th: ['gm', 'hs'], pop: 4 },
            { n: '崎陽軒本店', d: 'シウマイ弁当の本店', t: 'グルメ', dur: 60, addr: '横浜市西区高島', area: 'minatomirai', th: ['gm', 'hs'], pop: 3 },
            { n: 'カップヌードルミュージアム', d: 'インスタント麺の歴史と体験', t: '観光', dur: 120, addr: '横浜市中区新港', area: 'minatomirai', th: ['fm', 'ex'], pop: 4 },
        ],
        hotels: [
            { n: 'ヨコハマグランドインターコンチネンタルホテル', addr: '横浜市西区みなとみらい', area: 'minatomirai', price: 32000 },
            { n: 'ハイアットリージェンシー横浜', addr: '横浜市中区山下町', area: 'chinatown', price: 28000 },
            { n: 'ホテルニューグランド', addr: '横浜市中区山下町', area: 'chinatown', price: 22000 },
        ],
    },

    // 18. 草津温泉
    {
        id: 'kusatsu', name: '草津温泉', country: '日本', region: 'kanto',
        trip_style: 'public_transit', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['on', 'cp', 'hs', 'np'],
        areas: [
            { id: 'yubatake', name: '湯畑' }, { id: 'sainokawara', name: '西の河原' },
        ],
        spots: [
            { n: '湯畑', d: '草津温泉のシンボル。湯気立ち上る源泉', t: '観光', dur: 60, addr: '吾妻郡草津町草津', area: 'yubatake', th: ['sg', 'on', 'cp'], pop: 5 },
            { n: '熱乃湯 湯もみショー', d: '草津名物の湯もみと太鼓', t: '観光', dur: 60, addr: '吾妻郡草津町草津', area: 'yubatake', th: ['sg', 'hs', 'ex'], pop: 5, bk: true },
            { n: '湯路広場', d: '湯畑前の足湯と土産屋集積', t: '観光', dur: 45, addr: '吾妻郡草津町草津', area: 'yubatake', th: ['sg', 'on'], pop: 4 },
            { n: '西の河原公園', d: '湯川の渓流沿い遊歩道と無料足湯', t: '観光', dur: 75, addr: '吾妻郡草津町草津', area: 'sainokawara', th: ['np', 'on'], pop: 5 },
            { n: '西の河原露天風呂', d: '大規模な露天風呂', t: '観光', dur: 120, addr: '吾妻郡草津町草津', area: 'sainokawara', th: ['on', 'cp'], pop: 4 },
            { n: '草津山光泉寺', d: '湯畑を見下ろす古刹', t: '観光', dur: 30, addr: '吾妻郡草津町草津', area: 'yubatake', th: ['sg', 'hs'], pop: 3 },
            { n: '時間湯 千代の湯', d: '草津伝統の高温湯治体験', t: '観光', dur: 90, addr: '吾妻郡草津町草津', area: 'yubatake', th: ['on', 'hs'], pop: 3 },
            { n: 'スイス菓子ローヌ', d: '湯畑近くの洋菓子店', t: 'グルメ', dur: 30, addr: '吾妻郡草津町草津', area: 'yubatake', th: ['gm', 'cp'], pop: 3 },
            { n: '頼朝 湯畑店', d: '上州牛と山賊焼きの郷土料理', t: 'グルメ', dur: 75, addr: '吾妻郡草津町草津', area: 'yubatake', th: ['gm', 'hs'], pop: 4 },
            { n: '草津白根レークライン', d: '志賀草津高原ルート絶景ドライブ', t: '観光', dur: 150, addr: '吾妻郡草津町', area: 'sainokawara', th: ['np'], pop: 4 },
        ],
        hotels: [
            { n: '草津温泉 望雲', addr: '吾妻郡草津町草津', area: 'yubatake', price: 32000 },
            { n: '草津温泉 ホテル櫻井', addr: '吾妻郡草津町草津', area: 'yubatake', price: 26000 },
            { n: '草津ホテル', addr: '吾妻郡草津町草津', area: 'yubatake', price: 36000 },
        ],
    },

    // 19. 別府・由布院
    {
        id: 'beppu-yufuin', name: '別府', titleAlias: '別府・由布院', country: '日本', region: 'kyushu',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['on', 'cp', 'np', 'gm'],
        areas: [
            { id: 'beppu', name: '別府' }, { id: 'yufuin', name: '由布院' },
        ],
        spots: [
            { n: '海地獄', d: '別府地獄めぐりの代表・コバルトブルー', t: '観光', dur: 60, addr: '別府市鉄輪', area: 'beppu', th: ['sg', 'np', 'on'], pop: 5 },
            { n: '血の池地獄', d: '赤い池が広がる地獄', t: '観光', dur: 45, addr: '別府市野田', area: 'beppu', th: ['sg', 'np'], pop: 4 },
            { n: '竜巻地獄', d: '間欠泉の噴出が見られる地獄', t: '観光', dur: 45, addr: '別府市野田', area: 'beppu', th: ['sg', 'np'], pop: 3 },
            { n: 'かまど地獄', d: '6つの地獄が集合', t: '観光', dur: 45, addr: '別府市鉄輪', area: 'beppu', th: ['sg', 'np'], pop: 3 },
            { n: '別府タワー', d: '別府湾を望む展望タワー', t: '観光', dur: 60, addr: '別府市北浜', area: 'beppu', th: ['np', 'sg'], pop: 3 },
            { n: '湯布院 金鱗湖', d: '由布院の象徴・朝霧の絶景', t: '観光', dur: 75, addr: '由布市湯布院町川上', area: 'yufuin', th: ['np', 'cp'], pop: 5 },
            { n: '湯の坪街道', d: '由布院温泉のメインストリート', t: '観光', dur: 90, addr: '由布市湯布院町川上', area: 'yufuin', th: ['sg', 'sp', 'cp'], pop: 5 },
            { n: '由布岳', d: '由布院のシンボル・豊後富士', t: '観光', dur: 60, addr: '由布市湯布院町', area: 'yufuin', th: ['np', 'sg'], pop: 4 },
            { n: '湯布院フローラルヴィレッジ', d: 'ヨーロッパ風雑貨村', t: '観光', dur: 60, addr: '由布市湯布院町川上', area: 'yufuin', th: ['sg', 'cp', 'sp'], pop: 4 },
            { n: 'COMICO ART MUSEUM YUFUIN', d: '由布院の現代アート館', t: '観光', dur: 75, addr: '由布市湯布院町川上', area: 'yufuin', th: ['ar', 'cp'], pop: 3 },
            { n: 'とよ常 別府本店', d: '別府名物の特上天丼', t: 'グルメ', dur: 60, addr: '別府市北浜', area: 'beppu', th: ['gm'], pop: 4 },
            { n: '湯の岳庵', d: '由布院の名物山菜料理', t: 'グルメ', dur: 90, addr: '由布市湯布院町川上', area: 'yufuin', th: ['gm', 'hs'], pop: 3 },
            { n: 'B-speak', d: '由布院の人気ロールケーキ', t: 'グルメ', dur: 30, addr: '由布市湯布院町川上', area: 'yufuin', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '亀の井別荘', addr: '由布市湯布院町川上', area: 'yufuin', price: 65000 },
            { n: '山荘 無量塔', addr: '由布市湯布院町川上', area: 'yufuin', price: 78000 },
            { n: '杉乃井ホテル', addr: '別府市観海寺', area: 'beppu', price: 28000 },
            { n: 'ANAインターコンチネンタル別府リゾート＆スパ', addr: '別府市鉄輪', area: 'beppu', price: 38000 },
        ],
    },

    // 20. 熊本・阿蘇
    {
        id: 'kumamoto-aso', name: '熊本', titleAlias: '熊本・阿蘇', country: '日本', region: 'kyushu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['sg', 'np', 'on', 'fm', 'gm'],
        areas: [
            { id: 'kumamoto-c', name: '熊本市内' }, { id: 'aso', name: '阿蘇' }, { id: 'kurokawa', name: '黒川温泉' },
        ],
        spots: [
            { n: '熊本城', d: '名城百選の堂々たる城郭', t: '観光', dur: 120, addr: '熊本市中央区本丸', area: 'kumamoto-c', th: ['sg', 'hs'], pop: 5 },
            { n: '水前寺成趣園', d: '東海道五十三次を縮景した名園', t: '観光', dur: 75, addr: '熊本市中央区水前寺公園', area: 'kumamoto-c', th: ['sg', 'np', 'hs'], pop: 4 },
            { n: '阿蘇火口（中岳）', d: '世界最大級のカルデラの火口', t: '観光', dur: 90, addr: '阿蘇市黒川', area: 'aso', th: ['sg', 'np'], pop: 5 },
            { n: '大観峰', d: '阿蘇カルデラを一望する絶景', t: '観光', dur: 60, addr: '阿蘇市山田', area: 'aso', th: ['np'], pop: 5 },
            { n: '草千里ヶ浜', d: '阿蘇の草原と火山', t: '観光', dur: 75, addr: '阿蘇市永草', area: 'aso', th: ['np', 'cp'], pop: 4 },
            { n: '黒川温泉街', d: '昔ながらの温泉街と入湯手形', t: '観光', dur: 180, addr: '阿蘇郡南小国町満願寺', area: 'kurokawa', th: ['on', 'cp', 'sg'], pop: 5 },
            { n: '上色見熊野座神社', d: '映画ロケ地でも有名な参道', t: '観光', dur: 60, addr: '阿蘇郡高森町上色見', area: 'aso', th: ['sg', 'hs', 'np'], pop: 3 },
            { n: '通潤橋', d: '日本最大級のアーチ式石造水路橋', t: '観光', dur: 60, addr: '上益城郡山都町長原', area: 'aso', th: ['sg', 'hs'], pop: 3 },
            { n: '桜の馬場 城彩苑', d: '熊本城下の食と土産', t: '観光', dur: 90, addr: '熊本市中央区二の丸', area: 'kumamoto-c', th: ['sg', 'gm'], pop: 3 },
            { n: '味千ラーメン本店', d: '熊本ラーメンの代表', t: 'グルメ', dur: 45, addr: '熊本市東区東町', area: 'kumamoto-c', th: ['gm'], pop: 4 },
            { n: '黒亭 本店', d: '焦がしにんにくの熊本ラーメン', t: 'グルメ', dur: 45, addr: '熊本市西区二本木', area: 'kumamoto-c', th: ['gm'], pop: 4 },
            { n: '勝烈亭 新市街本店', d: '熊本のとんかつ名店', t: 'グルメ', dur: 60, addr: '熊本市中央区新市街', area: 'kumamoto-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '黒川温泉 山みず木', addr: '阿蘇郡南小国町満願寺', area: 'kurokawa', price: 42000 },
            { n: 'ANAクラウンプラザホテル熊本ニュースカイ', addr: '熊本市西区春日', area: 'kumamoto-c', price: 18000 },
            { n: '阿蘇プラザホテル', addr: '阿蘇市内牧', area: 'aso', price: 16000 },
        ],
    },

    // 21. 高知
    {
        id: 'kochi', name: '高知', country: '日本', region: 'shikoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['sg', 'gm', 'np', 'hs'],
        areas: [
            { id: 'kochi-c', name: '高知市内' }, { id: 'shimanto', name: '四万十' }, { id: 'katsurahama', name: '桂浜' },
        ],
        spots: [
            { n: '桂浜', d: '坂本龍馬像が立つ太平洋の絶景', t: '観光', dur: 75, addr: '高知市浦戸', area: 'katsurahama', th: ['sg', 'np', 'hs'], pop: 5 },
            { n: '高知城', d: '本丸全体が現存する希少な城', t: '観光', dur: 90, addr: '高知市丸ノ内', area: 'kochi-c', th: ['sg', 'hs'], pop: 5 },
            { n: 'ひろめ市場', d: '高知名物が集まる屋台村', t: 'グルメ', dur: 90, addr: '高知市帯屋町', area: 'kochi-c', th: ['gm', 'sg'], pop: 5 },
            { n: '日曜市', d: '300年以上続く街路市', t: '観光', dur: 90, addr: '高知市追手筋', area: 'kochi-c', th: ['sg', 'gm', 'hs'], pop: 4, morningOk: true },
            { n: '四万十川', d: '最後の清流と沈下橋', t: '観光', dur: 180, addr: '四万十市西土佐', area: 'shimanto', th: ['np', 'nt'], pop: 5 },
            { n: '足摺岬', d: '四国最南端の絶景岬', t: '観光', dur: 90, addr: '土佐清水市足摺岬', area: 'shimanto', th: ['np', 'sg'], pop: 4 },
            { n: '柏島', d: '透明度抜群のサンゴの海', t: '観光', dur: 90, addr: '幡多郡大月町柏島', area: 'shimanto', th: ['np', 'bc'], pop: 4 },
            { n: '高知県立坂本龍馬記念館', d: '幕末の英雄を学ぶ', t: '観光', dur: 90, addr: '高知市浦戸', area: 'katsurahama', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'はりまや橋', d: '高知の名物観光地', t: '観光', dur: 15, addr: '高知市はりまや町', area: 'kochi-c', th: ['sg'], pop: 3 },
            { n: '土佐タタキ道場', d: 'カツオの藁焼き体験', t: 'グルメ', dur: 90, addr: '香南市赤岡町', area: 'kochi-c', th: ['gm', 'ex', 'fm'], pop: 4 },
            { n: '明神丸 ひろめ市場店', d: '本場藁焼きカツオのたたき', t: 'グルメ', dur: 60, addr: '高知市帯屋町', area: 'kochi-c', th: ['gm'], pop: 5 },
            { n: '黒尊渓谷', d: '四万十川支流の紅葉名所', t: '観光', dur: 90, addr: '四万十市西土佐', area: 'shimanto', th: ['np', 'nt'], pop: 3 },
        ],
        hotels: [
            { n: '城西館', addr: '高知市上町', area: 'kochi-c', price: 28000 },
            { n: '三翠園', addr: '高知市鷹匠町', area: 'kochi-c', price: 24000 },
            { n: '足摺テルメ', addr: '土佐清水市足摺岬', area: 'shimanto', price: 22000 },
        ],
    },

    // 22. 直島・瀬戸内
    {
        id: 'naoshima', name: '直島', titleAlias: '直島・瀬戸内', country: '日本', region: 'chugoku',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 35,
        themes: ['ar', 'sg', 'cp', 'np'],
        areas: [
            { id: 'naoshima', name: '直島' }, { id: 'teshima', name: '豊島' }, { id: 'inujima', name: '犬島' },
        ],
        spots: [
            { n: '地中美術館', d: 'モネ・タレル等の名作建築美術館', t: '観光', dur: 120, addr: '香川郡直島町', area: 'naoshima', th: ['ar', 'cp'], pop: 5, bk: true },
            { n: 'ベネッセハウスミュージアム', d: '宿泊もできる現代美術館', t: '観光', dur: 120, addr: '香川郡直島町', area: 'naoshima', th: ['ar', 'cp'], pop: 5 },
            { n: '赤かぼちゃ・黄かぼちゃ', d: '草間彌生の象徴的彫刻', t: '観光', dur: 45, addr: '香川郡直島町宮浦港', area: 'naoshima', th: ['ar', 'sg', 'np'], pop: 5 },
            { n: '家プロジェクト', d: '直島の家屋を活用した芸術空間', t: '観光', dur: 120, addr: '香川郡直島町本村', area: 'naoshima', th: ['ar', 'sg'], pop: 5 },
            { n: 'ANDO MUSEUM', d: '安藤忠雄の建築ミュージアム', t: '観光', dur: 60, addr: '香川郡直島町本村', area: 'naoshima', th: ['ar', 'cp'], pop: 4 },
            { n: '李禹煥美術館', d: '日韓現代美術家の専用館', t: '観光', dur: 75, addr: '香川郡直島町', area: 'naoshima', th: ['ar', 'cp'], pop: 4 },
            { n: '豊島美術館', d: '水と光の幻想空間', t: '観光', dur: 120, addr: '小豆郡土庄町豊島', area: 'teshima', th: ['ar', 'cp'], pop: 5, bk: true },
            { n: '犬島精錬所美術館', d: '産業遺産を再生したアート', t: '観光', dur: 120, addr: '岡山市東区犬島', area: 'inujima', th: ['ar', 'sg'], pop: 4 },
            { n: '宮浦港 海の駅 なおしま', d: 'SANAA設計のフェリーターミナル', t: '観光', dur: 30, addr: '香川郡直島町宮ノ浦', area: 'naoshima', th: ['ar', 'sg'], pop: 3 },
            { n: 'カフェサロン 中奥', d: '直島の人気カフェ', t: 'グルメ', dur: 60, addr: '香川郡直島町本村', area: 'naoshima', th: ['gm', 'cp'], pop: 3 },
            { n: '海の家島小屋', d: '直島の素朴な海の家', t: 'グルメ', dur: 60, addr: '香川郡直島町本村', area: 'naoshima', th: ['gm'], pop: 2 },
            { n: '杏 ann', d: '本村のお洒落カフェ', t: 'グルメ', dur: 45, addr: '香川郡直島町本村', area: 'naoshima', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'ベネッセハウス', addr: '香川郡直島町', area: 'naoshima', price: 65000 },
            { n: '直島つつじ荘', addr: '香川郡直島町', area: 'naoshima', price: 18000 },
            { n: '玉野国際ホテル', addr: '玉野市玉', area: 'teshima', price: 16000 },
        ],
    },

    // 23. 石垣島
    {
        id: 'ishigaki', name: '石垣島', country: '日本', region: 'okinawa_remote',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['bc', 'np', 'cp', 'gm', 'fm', 'sg'],
        areas: [
            { id: 'ishigaki-c', name: '石垣市内' }, { id: 'kabira', name: '川平湾' }, { id: 'taketomi', name: '竹富島' },
        ],
        spots: [
            { n: '川平湾', d: '日本百景の珊瑚海岸', t: '観光', dur: 90, addr: '石垣市川平', area: 'kabira', th: ['np', 'cp', 'bc'], pop: 5 },
            { n: 'グラスボート川平', d: '川平湾の珊瑚と熱帯魚観察', t: '観光', dur: 60, addr: '石垣市川平', area: 'kabira', th: ['sg', 'fm', 'bc'], pop: 5 },
            { n: '玉取崎展望台', d: '石垣島東海岸の絶景展望', t: '観光', dur: 30, addr: '石垣市伊原間', area: 'ishigaki-c', th: ['np', 'sg'], pop: 4 },
            { n: '平久保崎灯台', d: '石垣島最北端の絶景灯台', t: '観光', dur: 45, addr: '石垣市平久保', area: 'ishigaki-c', th: ['np', 'sg', 'cp'], pop: 4 },
            { n: '米原ビーチ', d: 'シュノーケリングの聖地', t: '観光', dur: 120, addr: '石垣市桴海', area: 'kabira', th: ['bc', 'ex', 'np', 'fm'], pop: 5 },
            { n: '竹富島・コンドイビーチ', d: '伝統的赤瓦集落と白浜', t: '観光', dur: 240, addr: '八重山郡竹富町竹富', area: 'taketomi', th: ['sg', 'np', 'bc', 'hs'], pop: 5 },
            { n: '由布島水牛車', d: '由布島へ水牛車で渡る体験', t: '観光', dur: 120, addr: '八重山郡竹富町古見', area: 'taketomi', th: ['ex', 'fm', 'sg'], pop: 4 },
            { n: '青の洞窟（石垣島）', d: 'シュノーケルツアーの人気スポット', t: '観光', dur: 180, addr: '石垣市米原', area: 'kabira', th: ['ex', 'bc', 'np'], pop: 4, bk: true },
            { n: '石垣島鍾乳洞', d: '20万年の地球の歴史', t: '観光', dur: 60, addr: '石垣市石垣', area: 'ishigaki-c', th: ['sg', 'fm'], pop: 3 },
            { n: '石垣市公設市場', d: '南の島のグルメと土産', t: '観光', dur: 60, addr: '石垣市大川', area: 'ishigaki-c', th: ['sg', 'gm'], pop: 3 },
            { n: 'ユーグレナモール', d: '石垣中心部の商店街', t: '観光', dur: 60, addr: '石垣市大川', area: 'ishigaki-c', th: ['sp', 'sg'], pop: 3 },
            { n: '辺銀食堂', d: '島野菜と石垣牛の人気食堂', t: 'グルメ', dur: 75, addr: '石垣市石垣', area: 'ishigaki-c', th: ['gm'], pop: 4 },
            { n: 'やいま村', d: '八重山の文化体験パーク', t: '観光', dur: 90, addr: '石垣市名蔵', area: 'kabira', th: ['sg', 'fm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'ANAインターコンチネンタル石垣リゾート', addr: '石垣市真栄里', area: 'ishigaki-c', price: 42000 },
            { n: 'クラブメッド石垣島カビラ', addr: '石垣市川平', area: 'kabira', price: 58000 },
            { n: '石垣シーサイドホテル', addr: '石垣市川平', area: 'kabira', price: 28000 },
        ],
    },

    // 24. 宮古島
    {
        id: 'miyako', name: '宮古島', country: '日本', region: 'okinawa_remote',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['bc', 'np', 'cp', 'fm'],
        areas: [
            { id: 'hirara', name: '平良' }, { id: 'east-miyako', name: '東宮古' }, { id: 'kurima', name: '来間・伊良部' },
        ],
        spots: [
            { n: '与那覇前浜ビーチ', d: '東洋一の白浜と称される絶景', t: '観光', dur: 90, addr: '宮古島市下地与那覇', area: 'kurima', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: '伊良部大橋', d: '日本一長い無料橋・絶景ドライブ', t: '観光', dur: 60, addr: '宮古島市平良久貝', area: 'kurima', th: ['np', 'sg', 'cp'], pop: 5 },
            { n: '東平安名崎', d: '宮古島最東端の絶景半島', t: '観光', dur: 60, addr: '宮古島市城辺保良', area: 'east-miyako', th: ['np', 'sg'], pop: 5 },
            { n: '砂山ビーチ', d: '砂山と岩のアーチが象徴的', t: '観光', dur: 60, addr: '宮古島市平良荷川取', area: 'hirara', th: ['bc', 'np', 'cp'], pop: 4 },
            { n: '池間大橋', d: '池間島を結ぶ絶景ブリッジ', t: '観光', dur: 45, addr: '宮古島市平良池間', area: 'east-miyako', th: ['np', 'sg'], pop: 4 },
            { n: '来間大橋', d: '来間島を結ぶ青い海の橋', t: '観光', dur: 45, addr: '宮古島市下地来間', area: 'kurima', th: ['np', 'sg'], pop: 4 },
            { n: '宮古島海中公園', d: '海中観察施設で珊瑚観察', t: '観光', dur: 60, addr: '宮古島市平良狩俣', area: 'east-miyako', th: ['sg', 'fm'], pop: 3 },
            { n: '吉野海岸', d: 'シュノーケリングで人気のビーチ', t: '観光', dur: 120, addr: '宮古島市城辺新城', area: 'east-miyako', th: ['bc', 'ex'], pop: 4 },
            { n: 'シギラリゾート', d: '東洋一の温泉とリゾート施設', t: '観光', dur: 180, addr: '宮古島市上野新里', area: 'east-miyako', th: ['on', 'cp', 'fm'], pop: 4 },
            { n: '島の駅みやこ', d: '宮古島の特産品集積', t: '観光', dur: 60, addr: '宮古島市平良久貝', area: 'hirara', th: ['sp', 'gm'], pop: 3 },
            { n: '古謝そば屋', d: '宮古そばの老舗', t: 'グルメ', dur: 45, addr: '宮古島市平良西仲宗根', area: 'hirara', th: ['gm', 'hs'], pop: 4 },
            { n: 'AOSORA PARLOR', d: 'マンゴーパフェの人気店', t: 'グルメ', dur: 45, addr: '宮古島市平良西里', area: 'hirara', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'シギラベイサイドスイート アラマンダ', addr: '宮古島市上野新里', area: 'east-miyako', price: 62000 },
            { n: 'ホテルブリーズベイマリーナ', addr: '宮古島市上野宮国', area: 'east-miyako', price: 32000 },
            { n: '宮古島東急ホテル&リゾーツ', addr: '宮古島市下地与那覇', area: 'kurima', price: 38000 },
        ],
    },

    // 25. 屋久島
    {
        id: 'yakushima', name: '屋久島', country: '日本', region: 'kyushu_island',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'nt', 'wh', 'sg'],
        areas: [
            { id: 'miyanoura', name: '宮之浦' }, { id: 'anbo', name: '安房' }, { id: 'yakusugi', name: '屋久杉エリア' },
        ],
        spots: [
            { n: '縄文杉トレッキング', d: '樹齢数千年の屋久杉巨木', t: '観光', dur: 600, addr: '熊毛郡屋久島町', area: 'yakusugi', th: ['nt', 'wh', 'ex'], pop: 5 },
            { n: '白谷雲水峡', d: 'もののけ姫の苔の森', t: '観光', dur: 240, addr: '熊毛郡屋久島町宮之浦', area: 'miyanoura', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'ヤクスギランド', d: '屋久杉を気軽に体験できる森', t: '観光', dur: 180, addr: '熊毛郡屋久島町', area: 'yakusugi', th: ['nt', 'wh', 'fm'], pop: 4 },
            { n: '紀元杉', d: '車道沿いで見られる屋久杉', t: '観光', dur: 30, addr: '熊毛郡屋久島町', area: 'yakusugi', th: ['nt', 'sg'], pop: 3 },
            { n: '千尋の滝', d: '一枚岩を流れ落ちる滝', t: '観光', dur: 60, addr: '熊毛郡屋久島町原', area: 'anbo', th: ['np'], pop: 4 },
            { n: '大川の滝', d: '日本の滝百選の落差88m', t: '観光', dur: 60, addr: '熊毛郡屋久島町栗生', area: 'anbo', th: ['np'], pop: 4 },
            { n: '永田いなか浜', d: 'ウミガメの産卵地と夕日', t: '観光', dur: 60, addr: '熊毛郡屋久島町永田', area: 'miyanoura', th: ['np', 'cp', 'bc'], pop: 4 },
            { n: '屋久杉自然館', d: '屋久杉と屋久島の自然史', t: '観光', dur: 60, addr: '熊毛郡屋久島町安房', area: 'anbo', th: ['sg', 'nt'], pop: 3 },
            { n: '志戸子ガジュマル園', d: '熱帯の巨大ガジュマル', t: '観光', dur: 45, addr: '熊毛郡屋久島町志戸子', area: 'miyanoura', th: ['np', 'nt'], pop: 3 },
            { n: '尾之間温泉', d: 'モッチョム岳のふもとの素朴温泉', t: '観光', dur: 90, addr: '熊毛郡屋久島町尾之間', area: 'anbo', th: ['on'], pop: 3 },
            { n: '潮騒の宿 海舟 食事処', d: '屋久島近海の魚料理', t: 'グルメ', dur: 75, addr: '熊毛郡屋久島町宮之浦', area: 'miyanoura', th: ['gm'], pop: 3 },
            { n: '寿し いその香り', d: '屋久島ならではの寿司', t: 'グルメ', dur: 60, addr: '熊毛郡屋久島町宮之浦', area: 'miyanoura', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '屋久島いわさきホテル', addr: '熊毛郡屋久島町尾之間', area: 'anbo', price: 24000 },
            { n: 'sankara hotel&spa 屋久島', addr: '熊毛郡屋久島町麦生', area: 'anbo', price: 58000 },
            { n: 'ホテル屋久島山荘', addr: '熊毛郡屋久島町宮之浦', area: 'miyanoura', price: 16000 },
        ],
    },
]
