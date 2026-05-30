import type { DestinationEntry } from '../types'

// 国内: 函館・旭川富良野・知床・青森・蔵王・高山白川郷・伊豆・出雲松江・倉敷・長崎

export const DOMESTIC_PART4: DestinationEntry[] = [
    // 26. 函館
    {
        id: 'hakodate', name: '函館', country: '日本', region: 'hokkaido',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'ng', 'hs', 'cp'],
        areas: [
            { id: 'motomachi', name: '元町・ベイ' }, { id: 'goryokaku', name: '五稜郭' }, { id: 'yunokawa', name: '湯の川' },
        ],
        spots: [
            { n: '函館山夜景', d: '世界三大夜景のひとつ', t: '観光', dur: 90, addr: '函館市函館山', area: 'motomachi', th: ['ng', 'cp', 'np'], pop: 5, eveningOk: true },
            { n: '元町の坂・教会群', d: '異国情緒漂う洋風建築の街並み', t: '観光', dur: 120, addr: '函館市元町', area: 'motomachi', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '金森赤レンガ倉庫', d: '明治の倉庫を再生したベイエリア', t: '観光', dur: 90, addr: '函館市末広町', area: 'motomachi', th: ['sg', 'sp', 'cp'], pop: 5 },
            { n: '五稜郭タワー', d: '星形要塞を一望', t: '観光', dur: 60, addr: '函館市五稜郭町', area: 'goryokaku', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '五稜郭公園', d: '幕末の星形要塞跡。桜の名所', t: '観光', dur: 60, addr: '函館市五稜郭町', area: 'goryokaku', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '函館朝市', d: '海鮮丼とイカ釣り体験', t: 'グルメ', dur: 75, addr: '函館市若松町', area: 'motomachi', th: ['gm', 'sg'], pop: 5, morningOk: true },
            { n: 'ハリストス正教会', d: '日本最古のロシア正教会', t: '観光', dur: 30, addr: '函館市元町', area: 'motomachi', th: ['sg', 'hs'], pop: 3 },
            { n: 'カトリック元町教会', d: 'ゴシック建築の教会', t: '観光', dur: 30, addr: '函館市元町', area: 'motomachi', th: ['sg', 'hs'], pop: 3 },
            { n: 'トラピスチヌ修道院', d: 'カトリック女子修道院', t: '観光', dur: 60, addr: '函館市上湯川町', area: 'yunokawa', th: ['sg', 'hs'], pop: 3 },
            { n: '湯の川温泉街', d: '函館の奥座敷温泉', t: '観光', dur: 120, addr: '函館市湯川町', area: 'yunokawa', th: ['on', 'cp'], pop: 4 },
            { n: 'ラッキーピエロ ベイエリア本店', d: 'ご当地バーガーの行列店', t: 'グルメ', dur: 60, addr: '函館市末広町', area: 'motomachi', th: ['gm'], pop: 5 },
            { n: '函館麺厨房あじさい', d: '塩ラーメンの名店', t: 'グルメ', dur: 45, addr: '函館市五稜郭町', area: 'goryokaku', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'センチュリーマリーナ函館', addr: '函館市大手町', area: 'motomachi', price: 26000 },
            { n: '湯の川プリンスホテル渚亭', addr: '函館市湯川町', area: 'yunokawa', price: 28000 },
            { n: 'ラビスタ函館ベイ', addr: '函館市豊川町', area: 'motomachi', price: 32000 },
        ],
    },

    // 27. 旭川・富良野
    {
        id: 'asahikawa-furano', name: '富良野', titleAlias: '旭川・富良野', country: '日本', region: 'hokkaido',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['np', 'fm', 'cp', 'gm'],
        areas: [
            { id: 'asahikawa', name: '旭川' }, { id: 'biei', name: '美瑛' }, { id: 'furano', name: '富良野' },
        ],
        spots: [
            { n: '旭山動物園', d: '行動展示で有名な動物園', t: '観光', dur: 240, addr: '旭川市東旭川町倉沼', area: 'asahikawa', th: ['fm', 'sg'], pop: 5 },
            { n: '青い池', d: '神秘的なコバルトブルーの池', t: '観光', dur: 60, addr: '上川郡美瑛町白金', area: 'biei', th: ['np', 'cp'], pop: 5 },
            { n: '白ひげの滝', d: '岩肌から流れる白い滝', t: '観光', dur: 30, addr: '上川郡美瑛町白金', area: 'biei', th: ['np'], pop: 4 },
            { n: '四季彩の丘', d: '美瑛の花の絶景パッチワーク', t: '観光', dur: 90, addr: '上川郡美瑛町新星', area: 'biei', th: ['np', 'cp', 'fm'], pop: 5 },
            { n: 'ぜるぶの丘', d: '花畑とアトラクション', t: '観光', dur: 75, addr: '上川郡美瑛町大三', area: 'biei', th: ['np', 'fm'], pop: 4 },
            { n: 'パッチワークの路', d: '美瑛のドライブコース', t: '観光', dur: 120, addr: '上川郡美瑛町', area: 'biei', th: ['np'], pop: 4 },
            { n: 'ファーム富田', d: 'ラベンダー畑の代表', t: '観光', dur: 90, addr: '空知郡中富良野町基線北', area: 'furano', th: ['np', 'cp'], pop: 5 },
            { n: '富良野チーズ工房', d: 'チーズ作り体験', t: '観光', dur: 90, addr: '富良野市中五区', area: 'furano', th: ['fm', 'ex', 'gm'], pop: 3 },
            { n: 'ニングルテラス', d: 'クラフトショップの森', t: '観光', dur: 60, addr: '富良野市中御料', area: 'furano', th: ['sg', 'cp', 'sp'], pop: 4 },
            { n: 'ふらのジャム園', d: '38種類のジャムと共生農園', t: '観光', dur: 60, addr: '富良野市東麓郷の3', area: 'furano', th: ['gm', 'fm'], pop: 3 },
            { n: '蜂屋 5条創業店', d: '旭川醤油ラーメン', t: 'グルメ', dur: 45, addr: '旭川市五条通', area: 'asahikawa', th: ['gm'], pop: 4 },
            { n: '富良野マルシェ', d: '富良野の地元食材', t: 'グルメ', dur: 60, addr: '富良野市幸町', area: 'furano', th: ['gm', 'sp'], pop: 3 },
        ],
        hotels: [
            { n: '新富良野プリンスホテル', addr: '富良野市中御料', area: 'furano', price: 28000 },
            { n: 'JRイン旭川', addr: '旭川市宮下通', area: 'asahikawa', price: 14000 },
            { n: 'ホテル ラ・テール', addr: '富良野市上五区', area: 'furano', price: 22000 },
        ],
    },

    // 28. 知床
    {
        id: 'shiretoko', name: '知床', country: '日本', region: 'hokkaido',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['nt', 'np', 'wh', 'sg'],
        areas: [
            { id: 'utoro', name: 'ウトロ' }, { id: 'rausu', name: '羅臼' },
        ],
        spots: [
            { n: '知床五湖', d: '世界自然遺産の原生林散策', t: '観光', dur: 180, addr: '斜里郡斜里町岩尾別', area: 'utoro', th: ['nt', 'wh', 'np'], pop: 5 },
            { n: 'オシンコシンの滝', d: '日本の滝百選', t: '観光', dur: 30, addr: '斜里郡斜里町ウトロ', area: 'utoro', th: ['np'], pop: 4 },
            { n: '知床岬クルーズ', d: '半島先端と野生動物観察', t: '観光', dur: 240, addr: '斜里郡斜里町ウトロ', area: 'utoro', th: ['nt', 'np', 'sg'], pop: 5, bk: true },
            { n: 'カムイワッカ湯の滝', d: '温泉が流れ落ちる秘境の滝', t: '観光', dur: 120, addr: '斜里郡斜里町岩尾別', area: 'utoro', th: ['nt', 'np', 'ex'], pop: 4 },
            { n: '知床自然センター', d: '知床の自然と生態を学ぶ', t: '観光', dur: 60, addr: '斜里郡斜里町岩尾別', area: 'utoro', th: ['sg', 'nt', 'fm'], pop: 3 },
            { n: '知床峠展望台', d: '羅臼岳と国後島が見える絶景', t: '観光', dur: 30, addr: '斜里郡斜里町', area: 'utoro', th: ['np', 'sg'], pop: 4 },
            { n: 'プユニ岬', d: 'オホーツク海と知床連山', t: '観光', dur: 30, addr: '斜里郡斜里町ウトロ', area: 'utoro', th: ['np'], pop: 3 },
            { n: '羅臼国後展望塔', d: '北方領土を望む展望塔', t: '観光', dur: 45, addr: '目梨郡羅臼町', area: 'rausu', th: ['sg', 'np'], pop: 3 },
            { n: '熊の湯', d: 'ヒグマも入ると言われる秘湯', t: '観光', dur: 60, addr: '目梨郡羅臼町湯ノ沢町', area: 'rausu', th: ['on'], pop: 3 },
            { n: '羅臼漁港の朝市', d: '知床の海の幸', t: 'グルメ', dur: 45, addr: '目梨郡羅臼町本町', area: 'rausu', th: ['gm', 'sg'], pop: 3, morningOk: true },
            { n: '知床 食堂 波飛沫', d: '海鮮丼の人気店', t: 'グルメ', dur: 60, addr: '斜里郡斜里町ウトロ西', area: 'utoro', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '知床ノーブルホテル', addr: '斜里郡斜里町ウトロ', area: 'utoro', price: 26000 },
            { n: '知床第一ホテル', addr: '斜里郡斜里町ウトロ', area: 'utoro', price: 32000 },
            { n: '羅臼の宿 まるみ', addr: '目梨郡羅臼町', area: 'rausu', price: 18000 },
        ],
    },

    // 29. 青森
    {
        id: 'aomori', name: '青森', country: '日本', region: 'tohoku',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'gm', 'np', 'hs'],
        areas: [
            { id: 'aomori-c', name: '青森市内' }, { id: 'hirosaki', name: '弘前' }, { id: 'oirase', name: '奥入瀬・十和田' },
        ],
        spots: [
            { n: 'ねぶたの家 ワ・ラッセ', d: 'ねぶた祭りの常設展示', t: '観光', dur: 90, addr: '青森市安方', area: 'aomori-c', th: ['sg', 'hs', 'fm'], pop: 5 },
            { n: '青森県立美術館', d: '奈良美智の犬と棟方志功', t: '観光', dur: 90, addr: '青森市安田近野', area: 'aomori-c', th: ['ar', 'cp'], pop: 4 },
            { n: '三内丸山遺跡', d: '日本最大級の縄文遺跡（世界遺産）', t: '観光', dur: 120, addr: '青森市三内', area: 'aomori-c', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '弘前城', d: '東北で唯一の現存天守', t: '観光', dur: 90, addr: '弘前市下白銀町', area: 'hirosaki', th: ['sg', 'hs'], pop: 5 },
            { n: '弘前公園', d: '日本一の桜の名所', t: '観光', dur: 90, addr: '弘前市下白銀町', area: 'hirosaki', th: ['np', 'sg'], pop: 5 },
            { n: '奥入瀬渓流', d: '十和田八幡平の絶景渓流', t: '観光', dur: 180, addr: '十和田市奥瀬', area: 'oirase', th: ['np', 'nt'], pop: 5 },
            { n: '十和田湖 遊覧船', d: 'カルデラ湖のクルーズ', t: '観光', dur: 90, addr: '十和田市奥瀬', area: 'oirase', th: ['np', 'sg'], pop: 4 },
            { n: '酸ヶ湯温泉', d: '千人風呂と豪雪の名湯', t: '観光', dur: 120, addr: '青森市荒川南荒川山', area: 'aomori-c', th: ['on', 'hs'], pop: 4 },
            { n: '青森魚菜センター のっけ丼', d: '好きな具材で作る海鮮丼', t: 'グルメ', dur: 60, addr: '青森市古川', area: 'aomori-c', th: ['gm', 'ex'], pop: 5 },
            { n: '味の札幌大西', d: '青森味噌カレーミルクラーメン', t: 'グルメ', dur: 45, addr: '青森市古川', area: 'aomori-c', th: ['gm'], pop: 3 },
            { n: '長尾中華そば', d: '青森煮干しラーメン', t: 'グルメ', dur: 45, addr: '青森市三好', area: 'aomori-c', th: ['gm'], pop: 4 },
            { n: '津軽藩ねぷた村', d: '弘前ねぷたの体験施設', t: '観光', dur: 75, addr: '弘前市亀甲町', area: 'hirosaki', th: ['sg', 'hs', 'fm'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテル青森', addr: '青森市堤町', area: 'aomori-c', price: 18000 },
            { n: '星野リゾート 奥入瀬渓流ホテル', addr: '十和田市奥瀬', area: 'oirase', price: 38000 },
            { n: '弘前パークホテル', addr: '弘前市土手町', area: 'hirosaki', price: 14000 },
        ],
    },

    // 30. 蔵王（山形）
    {
        id: 'zao', name: '蔵王', country: '日本', region: 'tohoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['on', 'np', 'sg', 'nt'],
        areas: [
            { id: 'zao-onsen', name: '蔵王温泉' }, { id: 'okama', name: '御釜' },
        ],
        spots: [
            { n: '蔵王御釜', d: '五色沼と呼ばれるカルデラ湖', t: '観光', dur: 90, addr: '上山市永野', area: 'okama', th: ['np', 'sg'], pop: 5 },
            { n: '蔵王ロープウェイ・樹氷', d: '冬の樹氷原と春夏は山頂展望', t: '観光', dur: 120, addr: '山形市蔵王温泉', area: 'zao-onsen', th: ['np', 'sg', 'cp'], pop: 5 },
            { n: '蔵王温泉大露天風呂', d: '渓谷の大規模露天風呂', t: '観光', dur: 90, addr: '山形市蔵王温泉', area: 'zao-onsen', th: ['on', 'cp'], pop: 5 },
            { n: '蔵王温泉街', d: '昔ながらの温泉街散策', t: '観光', dur: 90, addr: '山形市蔵王温泉', area: 'zao-onsen', th: ['on', 'sg'], pop: 4 },
            { n: '蔵王スカイケーブル', d: '中央高原を結ぶケーブルカー', t: '観光', dur: 60, addr: '山形市蔵王温泉', area: 'zao-onsen', th: ['np', 'sg'], pop: 3 },
            { n: '山形国際ホテル', d: '蔵王連峰を望むホテル朝食', t: 'グルメ', dur: 60, addr: '山形市香澄町', area: 'zao-onsen', th: ['gm'], pop: 2 },
            { n: '山寺立石寺', d: '芭蕉ゆかりの絶景山岳寺院', t: '観光', dur: 150, addr: '山形市山寺', area: 'okama', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '銀山温泉', d: '大正レトロな温泉街', t: '観光', dur: 180, addr: '尾花沢市大字銀山新畑', area: 'zao-onsen', th: ['on', 'cp', 'hs'], pop: 5 },
            { n: '蔵王中央ロープウェイ', d: '中央高原・観松平までアクセス', t: '観光', dur: 60, addr: '山形市蔵王温泉', area: 'zao-onsen', th: ['np'], pop: 3 },
            { n: '稲花餅 田中屋', d: '蔵王名物の小ぶりな餅', t: 'グルメ', dur: 30, addr: '山形市蔵王温泉', area: 'zao-onsen', th: ['gm', 'hs'], pop: 3 },
            { n: '玉こんにゃく 山形駅前店', d: '山形名物のたまこん', t: 'グルメ', dur: 30, addr: '山形市香澄町', area: 'zao-onsen', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '蔵王国際ホテル', addr: '山形市蔵王温泉', area: 'zao-onsen', price: 26000 },
            { n: '山形蔵王温泉 五感の湯つるや', addr: '山形市蔵王温泉', area: 'zao-onsen', price: 32000 },
            { n: '銀山温泉 古勢起屋別館', addr: '尾花沢市大字銀山新畑', area: 'zao-onsen', price: 38000 },
        ],
    },

    // 31. 高山・白川郷
    {
        id: 'takayama-shirakawago', name: '高山', titleAlias: '高山・白川郷', country: '日本', region: 'chubu',
        trip_style: 'public_transit', intra_mode: 'バス', intra_gap_min: 40,
        themes: ['sg', 'hs', 'wh', 'gm', 'cp'],
        areas: [
            { id: 'takayama', name: '高山' }, { id: 'shirakawago', name: '白川郷' },
        ],
        spots: [
            { n: '高山古い町並み', d: '江戸時代から続く商家の街並み', t: '観光', dur: 120, addr: '高山市上三之町', area: 'takayama', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '高山陣屋', d: '全国唯一現存する代官所', t: '観光', dur: 75, addr: '高山市八軒町', area: 'takayama', th: ['sg', 'hs'], pop: 4 },
            { n: '宮川朝市', d: '飛騨の食材と工芸品', t: '観光', dur: 60, addr: '高山市下三之町', area: 'takayama', th: ['gm', 'sg'], pop: 4, morningOk: true },
            { n: '飛騨高山まちの博物館', d: '無料で楽しめる町の歴史館', t: '観光', dur: 60, addr: '高山市上一之町', area: 'takayama', th: ['sg', 'hs'], pop: 3 },
            { n: '飛騨民俗村 飛騨の里', d: '合掌造りなど飛騨の古民家集落', t: '観光', dur: 120, addr: '高山市上岡本町', area: 'takayama', th: ['sg', 'hs', 'fm'], pop: 4 },
            { n: '白川郷・荻町合掌造り集落', d: '世界遺産の合掌造り集落', t: '観光', dur: 180, addr: '大野郡白川村荻町', area: 'shirakawago', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: '白川郷展望台 城山', d: '集落全体を見渡せる絶景', t: '観光', dur: 30, addr: '大野郡白川村荻町', area: 'shirakawago', th: ['np', 'sg'], pop: 5 },
            { n: '和田家', d: '白川郷で最大の合掌造り見学', t: '観光', dur: 60, addr: '大野郡白川村荻町', area: 'shirakawago', th: ['sg', 'hs'], pop: 4 },
            { n: '飛騨牛 寿楽久 本店', d: '飛騨牛の老舗', t: 'グルメ', dur: 90, addr: '高山市総和町', area: 'takayama', th: ['gm'], pop: 5 },
            { n: '中華そば まさご', d: '高山中華そばの名店', t: 'グルメ', dur: 45, addr: '高山市有楽町', area: 'takayama', th: ['gm'], pop: 4 },
            { n: '坂口屋', d: '飛騨牛にぎりの人気店', t: 'グルメ', dur: 30, addr: '高山市上三之町', area: 'takayama', th: ['gm'], pop: 4 },
            { n: 'お食事処 い～り～', d: '白川郷の郷土料理', t: 'グルメ', dur: 60, addr: '大野郡白川村荻町', area: 'shirakawago', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: '本陣平野屋花兆庵', addr: '高山市本町', area: 'takayama', price: 42000 },
            { n: 'スパホテルアルピナ飛騨高山', addr: '高山市名田町', area: 'takayama', price: 18000 },
            { n: '白川郷の湯', addr: '大野郡白川村', area: 'shirakawago', price: 24000 },
        ],
    },

    // 32. 伊豆
    {
        id: 'izu', name: '伊豆', country: '日本', region: 'chubu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['on', 'np', 'cp', 'gm'],
        areas: [
            { id: 'atami', name: '熱海' }, { id: 'shimoda', name: '下田・河津' }, { id: 'shuzenji', name: '修善寺' },
        ],
        spots: [
            { n: '熱海サンビーチ', d: '夜にライトアップされる人気ビーチ', t: '観光', dur: 60, addr: '熱海市東海岸町', area: 'atami', th: ['bc', 'cp', 'np'], pop: 4 },
            { n: '来宮神社', d: '大楠と縁結びパワースポット', t: '観光', dur: 60, addr: '熱海市西山町', area: 'atami', th: ['sg', 'cp', 'hs'], pop: 5 },
            { n: '熱海花火大会会場（親水公園）', d: '海と夜景の散策スポット', t: '観光', dur: 60, addr: '熱海市渚町', area: 'atami', th: ['cp', 'ng', 'np'], pop: 4 },
            { n: '城ヶ崎海岸 門脇吊橋', d: '断崖絶壁と吊橋のスリル', t: '観光', dur: 75, addr: '伊東市富戸', area: 'shuzenji', th: ['np', 'sg'], pop: 4 },
            { n: '河津七滝', d: '渓流沿いの7つの滝めぐり', t: '観光', dur: 90, addr: '賀茂郡河津町梨本', area: 'shimoda', th: ['np', 'nt'], pop: 4 },
            { n: '河津桜並木', d: '日本一早咲きの桜', t: '観光', dur: 90, addr: '賀茂郡河津町', area: 'shimoda', th: ['np', 'sg'], pop: 5 },
            { n: '修善寺温泉街', d: '弘法大師ゆかりの古湯', t: '観光', dur: 90, addr: '伊豆市修善寺', area: 'shuzenji', th: ['on', 'hs', 'cp'], pop: 5 },
            { n: '竹林の小径（修善寺）', d: '紅葉と竹林の絶景散策路', t: '観光', dur: 30, addr: '伊豆市修善寺', area: 'shuzenji', th: ['sg', 'np', 'cp'], pop: 4 },
            { n: '黒船ペリーロード（下田）', d: '開国の歴史を歩く石畳の路地', t: '観光', dur: 60, addr: '下田市三丁目', area: 'shimoda', th: ['sg', 'hs', 'cp'], pop: 4 },
            { n: '下田海中水族館', d: 'イルカと触れ合える水族館', t: '観光', dur: 120, addr: '下田市三丁目', area: 'shimoda', th: ['fm', 'sg'], pop: 3 },
            { n: 'MOA美術館', d: '熱海の絶景庭園と美術館', t: '観光', dur: 120, addr: '熱海市桃山町', area: 'atami', th: ['ar', 'np', 'cp'], pop: 4 },
            { n: '寿司 鈴木', d: '熱海の名物寿司', t: 'グルメ', dur: 90, addr: '熱海市銀座町', area: 'atami', th: ['gm'], pop: 4 },
            { n: '河津バガテル公園', d: 'フランス式バラ庭園', t: '観光', dur: 75, addr: '賀茂郡河津町峰', area: 'shimoda', th: ['np', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: '熱海後楽園ホテル', addr: '熱海市和田浜南町', area: 'atami', price: 28000 },
            { n: '星のや東京', addr: '伊豆市修善寺', area: 'shuzenji', price: 88000 },
            { n: '下田東急ホテル', addr: '下田市五丁目', area: 'shimoda', price: 32000 },
        ],
    },

    // 33. 出雲・松江
    {
        id: 'izumo-matsue', name: '出雲', titleAlias: '出雲・松江', country: '日本', region: 'chugoku',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'hs', 'cp', 'on'],
        areas: [
            { id: 'izumo', name: '出雲' }, { id: 'matsue', name: '松江' },
        ],
        spots: [
            { n: '出雲大社', d: '縁結びの神様・日本最古の社のひとつ', t: '観光', dur: 120, addr: '出雲市大社町杵築東', area: 'izumo', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '稲佐の浜', d: '神々が集う神聖な砂浜', t: '観光', dur: 45, addr: '出雲市大社町杵築北', area: 'izumo', th: ['sg', 'np', 'hs'], pop: 4 },
            { n: '島根県立古代出雲歴史博物館', d: '神話と古代史の博物館', t: '観光', dur: 90, addr: '出雲市大社町杵築東', area: 'izumo', th: ['sg', 'hs'], pop: 3 },
            { n: '日御碕灯台', d: '島根半島最西端の絶景灯台', t: '観光', dur: 60, addr: '出雲市大社町日御碕', area: 'izumo', th: ['np', 'sg'], pop: 4 },
            { n: '松江城', d: '国宝5城のひとつ・現存天守', t: '観光', dur: 90, addr: '松江市殿町', area: 'matsue', th: ['sg', 'hs'], pop: 5 },
            { n: '堀川遊覧船', d: '松江城の堀をめぐる', t: '観光', dur: 60, addr: '松江市黒田町', area: 'matsue', th: ['sg', 'cp'], pop: 4 },
            { n: '塩見縄手 武家屋敷', d: '松江城北の武家屋敷通り', t: '観光', dur: 60, addr: '松江市北堀町', area: 'matsue', th: ['sg', 'hs'], pop: 3 },
            { n: '足立美術館', d: '世界一の日本庭園と横山大観', t: '観光', dur: 150, addr: '安来市古川町', area: 'matsue', th: ['ar', 'np', 'cp'], pop: 5 },
            { n: '玉造温泉', d: '美肌の湯として有名', t: '観光', dur: 180, addr: '松江市玉湯町玉造', area: 'matsue', th: ['on', 'cp'], pop: 4 },
            { n: '宍道湖夕日スポット', d: '夕日の名所・松江のシンボル', t: '観光', dur: 45, addr: '松江市袖師町', area: 'matsue', th: ['np', 'cp'], pop: 5 },
            { n: '出雲そば 砂屋', d: '本場の出雲三段重ねそば', t: 'グルメ', dur: 60, addr: '出雲市大社町杵築東', area: 'izumo', th: ['gm', 'hs'], pop: 4 },
            { n: 'カラコロ工房', d: '松江のクラフトと和菓子', t: '観光', dur: 60, addr: '松江市殿町', area: 'matsue', th: ['sp', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: '玉造グランドホテル長生閣', addr: '松江市玉湯町玉造', area: 'matsue', price: 28000 },
            { n: '出雲大社 御師宿坊 大杜', addr: '出雲市大社町', area: 'izumo', price: 22000 },
            { n: 'ホテル一畑', addr: '松江市千鳥町', area: 'matsue', price: 18000 },
        ],
    },

    // 34. 倉敷
    {
        id: 'kurashiki', name: '倉敷', country: '日本', region: 'chugoku',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['sg', 'hs', 'ar', 'cp'],
        areas: [
            { id: 'bikan', name: '美観地区' }, { id: 'kojima', name: '児島' },
        ],
        spots: [
            { n: '倉敷美観地区', d: '白壁となまこ壁の歴史的街並み', t: '観光', dur: 120, addr: '倉敷市本町', area: 'bikan', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '大原美術館', d: '日本最初の私立西洋美術館', t: '観光', dur: 120, addr: '倉敷市中央', area: 'bikan', th: ['ar', 'hs'], pop: 5 },
            { n: '倉敷川舟流し', d: '川舟で美観地区を遊覧', t: '観光', dur: 30, addr: '倉敷市中央', area: 'bikan', th: ['sg', 'cp'], pop: 4 },
            { n: '倉敷アイビースクエア', d: '蔦のからまる紡績工場跡', t: '観光', dur: 90, addr: '倉敷市本町', area: 'bikan', th: ['sg', 'hs', 'cp'], pop: 4 },
            { n: '倉敷民藝館', d: '柳宗悦の民藝運動拠点', t: '観光', dur: 60, addr: '倉敷市中央', area: 'bikan', th: ['sg', 'ar', 'hs'], pop: 3 },
            { n: '阿智神社', d: '美観地区を見下ろす古社', t: '観光', dur: 45, addr: '倉敷市本町', area: 'bikan', th: ['sg', 'hs'], pop: 3 },
            { n: '本町通り', d: '美観地区裏のカフェ＆雑貨通り', t: '観光', dur: 75, addr: '倉敷市本町', area: 'bikan', th: ['sg', 'sp', 'cp', 'gm'], pop: 4 },
            { n: '児島ジーンズストリート', d: '国産デニム発祥の街並み', t: '観光', dur: 90, addr: '倉敷市児島味野', area: 'kojima', th: ['sg', 'sp'], pop: 3 },
            { n: '日本郷土玩具館', d: '昔懐かしい郷土玩具', t: '観光', dur: 60, addr: '倉敷市中央', area: 'bikan', th: ['sg', 'fm', 'hs'], pop: 3 },
            { n: '三宅商店', d: 'パフェが名物のレトロカフェ', t: 'グルメ', dur: 60, addr: '倉敷市本町', area: 'bikan', th: ['gm', 'cp'], pop: 4 },
            { n: 'くらしき桃子', d: '岡山の桃を使ったスイーツ', t: 'グルメ', dur: 45, addr: '倉敷市本町', area: 'bikan', th: ['gm', 'cp'], pop: 4 },
            { n: 'えびす饅頭', d: '昔ながらの今川焼風お饅頭', t: 'グルメ', dur: 30, addr: '倉敷市阿知', area: 'bikan', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '倉敷国際ホテル', addr: '倉敷市中央', area: 'bikan', price: 22000 },
            { n: 'クラシキ ロイヤル アート ホテル', addr: '倉敷市阿知', area: 'bikan', price: 18000 },
            { n: '倉敷アイビースクエア（宿泊）', addr: '倉敷市本町', area: 'bikan', price: 24000 },
        ],
    },

    // 35. 長崎
    {
        id: 'nagasaki', name: '長崎', country: '日本', region: 'kyushu',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'hs', 'wh', 'ng', 'gm'],
        areas: [
            { id: 'nagasaki-c', name: '長崎市内' }, { id: 'inasayama', name: '稲佐山' }, { id: 'sasebo', name: '佐世保' },
        ],
        spots: [
            { n: '長崎平和公園・平和祈念像', d: '原爆の記憶と平和の祈り', t: '観光', dur: 60, addr: '長崎市松山町', area: 'nagasaki-c', th: ['sg', 'hs'], pop: 5 },
            { n: '長崎原爆資料館', d: '原爆被害の記録と平和', t: '観光', dur: 90, addr: '長崎市平野町', area: 'nagasaki-c', th: ['sg', 'hs'], pop: 4 },
            { n: 'グラバー園', d: '幕末の洋館と港の絶景', t: '観光', dur: 120, addr: '長崎市南山手町', area: 'nagasaki-c', th: ['sg', 'hs', 'cp', 'np'], pop: 5 },
            { n: '大浦天主堂', d: '日本最古のカトリック教会（国宝・世界遺産）', t: '観光', dur: 60, addr: '長崎市南山手町', area: 'nagasaki-c', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '出島', d: '鎖国時代の対外貿易拠点', t: '観光', dur: 90, addr: '長崎市出島町', area: 'nagasaki-c', th: ['sg', 'hs'], pop: 4 },
            { n: '稲佐山展望台', d: '世界新三大夜景のひとつ', t: '観光', dur: 90, addr: '長崎市稲佐町', area: 'inasayama', th: ['ng', 'cp', 'np'], pop: 5 },
            { n: '長崎中華街（新地）', d: '日本三大中華街', t: '観光', dur: 90, addr: '長崎市新地町', area: 'nagasaki-c', th: ['gm', 'sg'], pop: 4 },
            { n: 'オランダ坂', d: '異国情緒漂う石畳の坂', t: '観光', dur: 45, addr: '長崎市東山手町', area: 'nagasaki-c', th: ['sg', 'hs', 'cp'], pop: 3 },
            { n: '軍艦島（端島）クルーズ', d: '世界遺産の海底炭鉱跡', t: '観光', dur: 180, addr: '長崎市高島町', area: 'nagasaki-c', th: ['sg', 'hs', 'wh'], pop: 5, bk: true },
            { n: 'ハウステンボス', d: 'オランダの街並みテーマパーク', t: '観光', dur: 480, addr: '佐世保市ハウステンボス町', area: 'sasebo', th: ['fm', 'cp', 'sg'], pop: 5, bk: true },
            { n: '九十九島観光船', d: 'リアス式の絶景クルーズ', t: '観光', dur: 75, addr: '佐世保市鹿子前町', area: 'sasebo', th: ['np', 'sg'], pop: 4 },
            { n: '吉宗 本店', d: '長崎名物 茶碗蒸しと角煮', t: 'グルメ', dur: 75, addr: '長崎市浜町', area: 'nagasaki-c', th: ['gm', 'hs'], pop: 4 },
            { n: '江山楼 中華街本店', d: '長崎ちゃんぽんの名店', t: 'グルメ', dur: 60, addr: '長崎市新地町', area: 'nagasaki-c', th: ['gm'], pop: 4 },
            { n: '岩崎本舗', d: '長崎名物角煮まんじゅう', t: 'グルメ', dur: 30, addr: '長崎市浜町', area: 'nagasaki-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ガーデンテラス長崎', addr: '長崎市秋月町', area: 'inasayama', price: 38000 },
            { n: '長崎マリオットホテル', addr: '長崎市尾上町', area: 'nagasaki-c', price: 28000 },
            { n: 'ホテルオークラJRハウステンボス', addr: '佐世保市ハウステンボス町', area: 'sasebo', price: 32000 },
        ],
    },
]
