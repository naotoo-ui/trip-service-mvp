import type { Route } from '../types'

// 国内 単独エリア（1都市/1エリアで完結する旅行パターン）
// destination の性質に合わせてテーマ・日数・出発地を限定。
// popularity = バリエーション数（1-6）

export const ROUTES_DOMESTIC_SINGLE: Route[] = [
    // 京都（単独で十分成立する大観光地）
    {
        id: 'r-kyoto-classic',
        name: '京都',
        legs: [{ destinationId: 'kyoto', days: 3 }],
        suitableThemes: ['sg', 'hs', 'wh', 'gm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 6,
        titleSuffixes: ['王道観光モデルコース', '寺社巡りプラン', '京都ハイライト', '古都堪能プラン'],
    },

    // 大阪（USJ含めて単独で成立）
    {
        id: 'r-osaka-classic',
        name: '大阪',
        legs: [{ destinationId: 'osaka', days: 3 }],
        suitableThemes: ['sg', 'gm', 'fm', 'cp'],
        suitableOrigins: ['東京', '名古屋', '福岡', '札幌'],
        durations: [2, 3, 4],
        popularity: 5,
        titleSuffixes: ['ミナミとキタを楽しむ', '王道観光プラン', 'グルメ満喫モデル', 'USJも楽しむ家族旅'],
    },

    // 東京（単独で成立）
    {
        id: 'r-tokyo-classic',
        name: '東京',
        legs: [{ destinationId: 'tokyo', days: 3 }],
        suitableThemes: ['sg', 'gm', 'sp', 'ar', 'ng'],
        suitableOrigins: ['大阪', '名古屋', '福岡', '札幌'],
        durations: [2, 3, 4],
        popularity: 6,
        titleSuffixes: ['東京定番観光', 'スカイツリーと浅草', 'グルメと夜景', 'ショッピング満喫'],
    },

    // 沖縄本島（単独で成立する島）
    {
        id: 'r-okinawa-main',
        name: '沖縄本島',
        legs: [{ destinationId: 'okinawa-main', days: 3 }],
        suitableThemes: ['sg', 'bc', 'np', 'fm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4, 5],
        popularity: 6,
        titleSuffixes: ['美ら海と那覇', '南国リゾート満喫', '家族で楽しむ沖縄', 'ドライブと海'],
    },

    // 札幌・小樽（北海道の玄関口・単独ペア）
    {
        id: 'r-sapporo-otaru',
        name: '札幌・小樽',
        legs: [{ destinationId: 'sapporo-otaru', days: 3 }],
        suitableThemes: ['sg', 'gm', 'np', 'ng'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 5,
        titleSuffixes: ['札幌の夜景と小樽運河', '北海道グルメ満喫', '街歩きと運河', '王道観光'],
    },

    // 福岡（九州の玄関口・単独）
    {
        id: 'r-fukuoka',
        name: '福岡',
        legs: [{ destinationId: 'fukuoka', days: 2 }],
        suitableThemes: ['gm', 'sg', 'sp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '札幌'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['博多グルメ満喫', '太宰府も訪れる王道', '夜の中洲を楽しむ', '街グルメ'],
    },

    // 鎌倉（東京から日帰り〜1泊が中心）
    {
        id: 'r-kamakura',
        name: '鎌倉',
        legs: [{ destinationId: 'kamakura', days: 2 }],
        suitableThemes: ['sg', 'hs', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [1, 2],
        popularity: 3,
        titleSuffixes: ['古都鎌倉散策', '小町通り食べ歩き', '大仏と長谷寺'],
    },

    // 箱根（東京からの定番温泉）
    {
        id: 'r-hakone',
        name: '箱根',
        legs: [{ destinationId: 'hakone', days: 2 }],
        suitableThemes: ['on', 'cp', 'ar', 'np'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2, 3],
        popularity: 5,
        titleSuffixes: ['温泉とアート巡り', '芦ノ湖と大涌谷', '美術館巡り', 'カップル温泉旅'],
    },

    // 富士山・河口湖（東京から）
    {
        id: 'r-fuji-kawaguchi',
        name: '富士山・河口湖',
        legs: [{ destinationId: 'fuji-kawaguchi', days: 2 }],
        suitableThemes: ['np', 'cp', 'fm', 'on'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['富士絶景と五湖巡り', '富士山と河口湖', '富士急ハイランド家族旅', '逆さ富士を狙う'],
    },

    // 軽井沢（東京から定番リゾート）
    {
        id: 'r-karuizawa',
        name: '軽井沢',
        legs: [{ destinationId: 'karuizawa', days: 2 }],
        suitableThemes: ['sg', 'cp', 'sp', 'np'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['旧軽銀座と雲場池', 'アウトレットと教会', 'ハルニレテラスでカフェ巡り', '森の中の高原リゾート'],
    },

    // 日光（東京から1-2泊定番）
    {
        id: 'r-nikko',
        name: '日光',
        legs: [{ destinationId: 'nikko', days: 2 }],
        suitableThemes: ['sg', 'hs', 'wh', 'np'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['東照宮と華厳の滝', '世界遺産を巡る', '中禅寺湖と奥日光', '日光二社一寺'],
    },

    // 仙台（東北の玄関口）
    {
        id: 'r-sendai',
        name: '仙台',
        legs: [{ destinationId: 'sendai', days: 2 }],
        suitableThemes: ['sg', 'gm', 'hs'],
        suitableOrigins: ['東京', '大阪', '名古屋', '札幌'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['牛タンと松島', '伊達政宗ゆかり', '仙台＋松島日帰り'],
    },

    // 金沢（北陸新幹線で人気）
    {
        id: 'r-kanazawa',
        name: '金沢',
        legs: [{ destinationId: 'kanazawa', days: 2 }],
        suitableThemes: ['sg', 'hs', 'gm', 'ar', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [2, 3],
        popularity: 5,
        titleSuffixes: ['兼六園と21世紀美術館', 'ひがし茶屋街散策', '近江町市場の海鮮', '加賀百万石の風情'],
    },

    // 名古屋（中部の玄関口・単独）
    {
        id: 'r-nagoya',
        name: '名古屋',
        legs: [{ destinationId: 'nagoya', days: 2 }],
        suitableThemes: ['gm', 'sg', 'fm'],
        suitableOrigins: ['東京', '大阪', '福岡', '札幌'],
        durations: [2],
        popularity: 3,
        titleSuffixes: ['ひつまぶしと味噌カツ', '名古屋城と熱田神宮', '家族で水族館とリニア館'],
    },

    // 広島・宮島
    {
        id: 'r-hiroshima-miyajima',
        name: '広島・宮島',
        legs: [{ destinationId: 'hiroshima-miyajima', days: 2 }],
        suitableThemes: ['sg', 'wh', 'hs', 'gm'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['原爆ドームと厳島神社', '世界遺産二箇所巡り', 'お好み焼きと牡蠣', '宮島で泊まる'],
    },

    // 神戸
    {
        id: 'r-kobe',
        name: '神戸',
        legs: [{ destinationId: 'kobe', days: 2 }],
        suitableThemes: ['gm', 'cp', 'ng', 'sg'],
        suitableOrigins: ['東京', '名古屋', '福岡'],
        durations: [2],
        popularity: 3,
        titleSuffixes: ['神戸牛と異人館', 'ハーバーランドの夜景', '北野で異国情緒'],
    },

    // 横浜
    {
        id: 'r-yokohama',
        name: '横浜',
        legs: [{ destinationId: 'yokohama', days: 2 }],
        suitableThemes: ['sg', 'gm', 'cp', 'ng', 'fm'],
        suitableOrigins: ['大阪', '名古屋', '福岡'],
        durations: [1, 2],
        popularity: 3,
        titleSuffixes: ['みなとみらい夜景', '中華街と元町', '赤レンガとコスモワールド'],
    },

    // 草津温泉
    {
        id: 'r-kusatsu',
        name: '草津温泉',
        legs: [{ destinationId: 'kusatsu', days: 2 }],
        suitableThemes: ['on', 'cp', 'hs'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2],
        popularity: 3,
        titleSuffixes: ['湯畑と西の河原', '温泉街で湯巡り', '湯もみショーを楽しむ'],
    },

    // 別府・由布院（九州2大温泉）
    {
        id: 'r-beppu-yufuin',
        name: '別府・由布院',
        legs: [{ destinationId: 'beppu-yufuin', days: 2 }],
        suitableThemes: ['on', 'np', 'cp', 'gm'],
        suitableOrigins: ['東京', '大阪', '福岡', '名古屋'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['地獄めぐりと金鱗湖', '由布院温泉満喫', '湯けむりの2大温泉', 'カップル温泉旅'],
    },

    // 熊本・阿蘇
    {
        id: 'r-kumamoto-aso',
        name: '熊本・阿蘇',
        legs: [{ destinationId: 'kumamoto-aso', days: 2 }],
        suitableThemes: ['sg', 'np', 'on'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['熊本城と阿蘇カルデラ', '黒川温泉で湯巡り', '草千里と大観峰'],
    },

    // 高知
    {
        id: 'r-kochi',
        name: '高知',
        legs: [{ destinationId: 'kochi', days: 2 }],
        suitableThemes: ['gm', 'sg', 'np'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2, 3],
        popularity: 2,
        titleSuffixes: ['桂浜と高知城', 'ひろめ市場のカツオ', '四万十川絶景'],
    },

    // 直島・瀬戸内
    {
        id: 'r-naoshima',
        name: '直島・瀬戸内',
        legs: [{ destinationId: 'naoshima', days: 2 }],
        suitableThemes: ['ar', 'cp', 'sg'],
        suitableOrigins: ['東京', '大阪'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['アートの島巡り', '地中美術館と家プロジェクト', '瀬戸内国際芸術祭'],
    },

    // 石垣島
    {
        id: 'r-ishigaki',
        name: '石垣島',
        legs: [{ destinationId: 'ishigaki', days: 3 }],
        suitableThemes: ['bc', 'np', 'fm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['川平湾と離島めぐり', '竹富島・西表島も', '南国ビーチリゾート', 'マリンとシュノーケル'],
    },

    // 宮古島
    {
        id: 'r-miyako',
        name: '宮古島',
        legs: [{ destinationId: 'miyako', days: 3 }],
        suitableThemes: ['bc', 'np', 'cp', 'fm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['伊良部大橋と前浜', '東洋一の白浜満喫', '絶景ドライブと海', '宮古ブルーを巡る'],
    },

    // 屋久島
    {
        id: 'r-yakushima',
        name: '屋久島',
        legs: [{ destinationId: 'yakushima', days: 3 }],
        suitableThemes: ['nt', 'wh', 'np'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['縄文杉トレッキング', '白谷雲水峡と滝巡り', '世界遺産の森を歩く'],
    },

    // 函館
    {
        id: 'r-hakodate',
        name: '函館',
        legs: [{ destinationId: 'hakodate', days: 2 }],
        suitableThemes: ['ng', 'sg', 'gm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['函館山の夜景', '元町と五稜郭', '朝市と海鮮丼', 'カップル夜景旅'],
    },

    // 旭川・富良野
    {
        id: 'r-asahikawa-furano',
        name: '旭川・富良野',
        legs: [{ destinationId: 'asahikawa-furano', days: 3 }],
        suitableThemes: ['np', 'fm', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [3, 4],
        popularity: 3,
        titleSuffixes: ['ラベンダーと青い池', '旭山動物園と家族', 'パッチワーク絶景ドライブ'],
    },

    // 知床
    {
        id: 'r-shiretoko',
        name: '知床',
        legs: [{ destinationId: 'shiretoko', days: 2 }],
        suitableThemes: ['nt', 'wh', 'np'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3],
        popularity: 2,
        titleSuffixes: ['世界自然遺産トレッキング', '知床五湖と岬クルーズ'],
    },

    // 青森
    {
        id: 'r-aomori',
        name: '青森',
        legs: [{ destinationId: 'aomori', days: 2 }],
        suitableThemes: ['sg', 'hs', 'gm'],
        suitableOrigins: ['東京', '大阪'],
        durations: [2, 3],
        popularity: 2,
        titleSuffixes: ['ねぶた家と縄文遺跡', '弘前城と奥入瀬'],
    },

    // 蔵王
    {
        id: 'r-zao',
        name: '山形・蔵王',
        legs: [{ destinationId: 'zao', days: 2 }],
        suitableThemes: ['on', 'np', 'sg'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2],
        popularity: 2,
        titleSuffixes: ['御釜と温泉街', '山寺と銀山温泉'],
    },

    // 高山・白川郷
    {
        id: 'r-takayama-shirakawago',
        name: '高山・白川郷',
        legs: [{ destinationId: 'takayama-shirakawago', days: 2 }],
        suitableThemes: ['sg', 'hs', 'wh', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['古い町並みと合掌造り', '世界遺産集落散策', '飛騨牛と古都', '冬の白川郷ライトアップ'],
    },

    // 伊豆
    {
        id: 'r-izu',
        name: '伊豆',
        legs: [{ destinationId: 'izu', days: 2 }],
        suitableThemes: ['on', 'np', 'cp'],
        suitableOrigins: ['東京', '名古屋'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['熱海・修善寺・下田', '城ヶ崎海岸と河津桜', '温泉とドライブ'],
    },

    // 出雲・松江
    {
        id: 'r-izumo-matsue',
        name: '出雲・松江',
        legs: [{ destinationId: 'izumo-matsue', days: 2 }],
        suitableThemes: ['sg', 'hs', 'cp', 'on'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['出雲大社と縁結び', '松江城と足立美術館', '玉造温泉と美肌の湯'],
    },

    // 倉敷
    {
        id: 'r-kurashiki',
        name: '倉敷',
        legs: [{ destinationId: 'kurashiki', days: 2 }],
        suitableThemes: ['sg', 'hs', 'ar', 'cp'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [2],
        popularity: 2,
        titleSuffixes: ['美観地区と大原美術館', '川舟流しと白壁の街'],
    },

    // 長崎
    {
        id: 'r-nagasaki',
        name: '長崎',
        legs: [{ destinationId: 'nagasaki', days: 2 }],
        suitableThemes: ['sg', 'hs', 'ng', 'wh', 'gm'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [2, 3],
        popularity: 4,
        titleSuffixes: ['グラバー園と中華街', '稲佐山の夜景', '軍艦島と平和公園', 'ハウステンボスも'],
    },

    // ──────────── 追加エリア（DOMESTIC_EXTRA・NICHE 由来） ────────────

    // 奈良
    {
        id: 'r-nara',
        name: '奈良',
        legs: [{ destinationId: 'nara', days: 2 }],
        suitableThemes: ['sg', 'hs', 'wh', 'fm', 'cp'],
        suitableOrigins: ['東京', '名古屋', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['東大寺と鹿', '法隆寺と世界遺産', 'ならまち散策', '飛鳥古墳巡り'],
    },

    // 鹿児島
    {
        id: 'r-kagoshima',
        name: '鹿児島',
        legs: [{ destinationId: 'kagoshima', days: 2 }],
        suitableThemes: ['sg', 'np', 'on', 'gm'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['桜島と仙巌園', '指宿砂むしと開聞岳', '霧島温泉巡り'],
    },

    // 松山・道後
    {
        id: 'r-matsuyama-dogo',
        name: '松山・道後',
        legs: [{ destinationId: 'matsuyama-dogo', days: 2 }],
        suitableThemes: ['on', 'hs', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['道後温泉本館', '松山城と道後', '坊ちゃんゆかりの地'],
    },

    // しまなみ海道
    {
        id: 'r-shimanami',
        name: 'しまなみ海道',
        legs: [{ destinationId: 'shimanami', days: 2 }],
        suitableThemes: ['ex', 'np', 'cp', 'nt'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['尾道＋サイクリング', '島々の絶景巡り', 'しまなみ自転車旅'],
    },

    // 五島列島
    {
        id: 'r-goto',
        name: '五島列島',
        legs: [{ destinationId: 'goto-islands', days: 3 }],
        suitableThemes: ['np', 'wh', 'bc', 'cp'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [3, 4],
        popularity: 2,
        titleSuffixes: ['潜伏キリシタン世界遺産', '日本一の白浜', '隠れ教会巡り'],
    },

    // 佐渡島
    {
        id: 'r-sado',
        name: '佐渡島',
        legs: [{ destinationId: 'sado', days: 3 }],
        suitableThemes: ['sg', 'hs', 'np', 'ex'],
        suitableOrigins: ['東京', '大阪'],
        durations: [3, 4],
        popularity: 2,
        titleSuffixes: ['佐渡金山と宿根木', 'たらい舟と海岸絶景'],
    },

    // 角館・乳頭温泉
    {
        id: 'r-kakunodate',
        name: '角館・乳頭温泉',
        legs: [{ destinationId: 'kakunodate', days: 2 }],
        suitableThemes: ['on', 'sg', 'hs', 'np'],
        suitableOrigins: ['東京', '大阪'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['武家屋敷と秘湯', '乳頭温泉郷で湯巡り', '田沢湖と角館'],
        titlePrefix: '',
    },

    // 銀山温泉
    {
        id: 'r-ginzan',
        name: '銀山温泉',
        legs: [{ destinationId: 'ginzan', days: 2 }],
        suitableThemes: ['on', 'cp', 'hs', 'np'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2],
        popularity: 4,
        titleSuffixes: ['大正レトロな湯けむり', 'カップル温泉旅', '千と千尋の世界へ', '雪化粧の温泉街'],
    },

    // 能登半島
    {
        id: 'r-noto',
        name: '能登半島',
        legs: [{ destinationId: 'noto', days: 2 }],
        suitableThemes: ['np', 'on', 'gm'],
        suitableOrigins: ['東京', '大阪', '名古屋', '福岡'],
        durations: [2, 3, 4],
        popularity: 3,
        titleSuffixes: ['輪島朝市と千枚田', 'なぎさドライブと和倉温泉', '能登の絶景巡り'],
    },

    // 高千穂峡
    {
        id: 'r-takachiho',
        name: '高千穂峡',
        legs: [{ destinationId: 'takachiho', days: 2 }],
        suitableThemes: ['np', 'hs', 'cp'],
        suitableOrigins: ['東京', '大阪', '福岡'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['神話の里と真名井の滝', '夜神楽と天岩戸', '雲海と神社巡り'],
    },

    // 城崎温泉・天橋立
    {
        id: 'r-kinosaki-amanohashidate',
        name: '城崎温泉・天橋立',
        legs: [{ destinationId: 'kinosaki-amanohashidate', days: 2 }],
        suitableThemes: ['on', 'np', 'cp'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [3, 4],
        popularity: 4,
        titleSuffixes: ['外湯巡りと松葉ガニ', '日本三景と温泉', '伊根の舟屋も', 'カップル湯けむり旅'],
    },

    // 上高地・乗鞍
    {
        id: 'r-kamikochi',
        name: '上高地・乗鞍',
        legs: [{ destinationId: 'kamikochi', days: 2 }],
        suitableThemes: ['nt', 'np', 'ex'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2, 3],
        popularity: 3,
        titleSuffixes: ['河童橋と大正池', '上高地ハイキング', '乗鞍高原温泉と絶景'],
    },

    // 諏訪・茅野
    {
        id: 'r-suwa',
        name: '諏訪・茅野',
        legs: [{ destinationId: 'suwa', days: 2 }],
        suitableThemes: ['sg', 'hs', 'on', 'np'],
        suitableOrigins: ['東京', '大阪', '名古屋'],
        durations: [2],
        popularity: 2,
        titleSuffixes: ['諏訪大社と湖畔温泉', '八ヶ岳と地酒巡り'],
    },
]
