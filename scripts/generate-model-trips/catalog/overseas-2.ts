import type { DestinationEntry } from '../types'

// 海外 アジア遠距離・中国・東南アジア: 上海・北京・ホーチミン・ハノイ・バリ・クアラルンプール・マニラ

export const OVERSEAS_PART2: DestinationEntry[] = [
    // 上海
    {
        id: 'shanghai', name: '上海', country: '中国', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'sp', 'ng', 'hs'],
        areas: [
            { id: 'puxi', name: '浦西' }, { id: 'pudong', name: '浦東' },
        ],
        spots: [
            { n: '外灘（バンド）', d: '黄浦江沿いの夜景パノラマ', t: '観光', dur: 90, addr: '上海市黄浦区', area: 'puxi', th: ['np', 'ng', 'cp', 'sg'], pop: 5 },
            { n: '東方明珠タワー', d: '上海のシンボル展望塔', t: '観光', dur: 90, addr: '上海市浦東新区', area: 'pudong', th: ['np', 'ng'], pop: 4 },
            { n: '上海タワー観景台', d: '世界第二の高さの展望', t: '観光', dur: 90, addr: '上海市浦東新区', area: 'pudong', th: ['np', 'ng', 'cp'], pop: 4 },
            { n: '豫園', d: '明代の庭園と老街', t: '観光', dur: 120, addr: '上海市黄浦区', area: 'puxi', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '田子坊', d: '路地裏のアートと雑貨', t: '観光', dur: 90, addr: '上海市黄浦区', area: 'puxi', th: ['sg', 'ar', 'cp', 'sp'], pop: 4 },
            { n: '南京路歩行街', d: '上海最大の繁華街', t: '観光', dur: 90, addr: '上海市黄浦区', area: 'puxi', th: ['sp', 'sg'], pop: 4 },
            { n: '新天地', d: '石庫門を再生したおしゃれエリア', t: '観光', dur: 90, addr: '上海市黄浦区', area: 'puxi', th: ['gm', 'cp', 'ng'], pop: 4 },
            { n: '上海博物館', d: '中国古代芸術の至宝', t: '観光', dur: 120, addr: '上海市黄浦区', area: 'puxi', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'ディズニーランド上海', d: '中国本土初のディズニー', t: '観光', dur: 480, addr: '上海市浦東新区', area: 'pudong', th: ['fm', 'cp'], pop: 4, bk: true },
            { n: '南翔饅頭店 豫園本店', d: '小籠包の名店', t: 'グルメ', dur: 60, addr: '上海市黄浦区', area: 'puxi', th: ['gm', 'hs'], pop: 5 },
            { n: '蒼蝿小館', d: '本場の上海家庭料理', t: 'グルメ', dur: 75, addr: '上海市黄浦区', area: 'puxi', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ザ・ペニンシュラ上海', addr: '上海市黄浦区', area: 'puxi', price: 72000 },
            { n: 'ウォルドルフ アストリア上海', addr: '上海市黄浦区', area: 'puxi', price: 58000 },
            { n: 'ヒルトン 上海', addr: '上海市徐匯区', area: 'puxi', price: 32000 },
        ],
    },

    // 北京
    {
        id: 'beijing', name: '北京', country: '中国', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 35,
        themes: ['sg', 'hs', 'wh', 'gm'],
        areas: [
            { id: 'tiananmen', name: '天安門周辺' }, { id: 'wangfujing', name: '王府井' }, { id: 'great-wall', name: '万里の長城' },
        ],
        spots: [
            { n: '万里の長城（八達嶺）', d: '世界遺産の長大城壁', t: '観光', dur: 240, addr: '北京市延慶区', area: 'great-wall', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: '紫禁城（故宮博物院）', d: '明清時代の宮殿群', t: '観光', dur: 240, addr: '北京市東城区', area: 'tiananmen', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '天安門広場', d: '世界最大級の広場', t: '観光', dur: 60, addr: '北京市東城区', area: 'tiananmen', th: ['sg', 'hs'], pop: 4 },
            { n: '頤和園', d: '清朝皇帝の離宮（世界遺産）', t: '観光', dur: 150, addr: '北京市海淀区', area: 'great-wall', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '天壇公園', d: '皇帝が天を祭った世界遺産', t: '観光', dur: 120, addr: '北京市東城区', area: 'tiananmen', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '南鑼鼓巷', d: '伝統的胡同と若者文化', t: '観光', dur: 90, addr: '北京市東城区', area: 'wangfujing', th: ['sg', 'gm', 'sp'], pop: 4 },
            { n: '王府井大街', d: '北京の代表的繁華街', t: '観光', dur: 90, addr: '北京市東城区', area: 'wangfujing', th: ['sp', 'sg'], pop: 3 },
            { n: '798芸術区', d: '工場を改装した現代芸術区', t: '観光', dur: 120, addr: '北京市朝陽区', area: 'wangfujing', th: ['ar', 'cp', 'sg'], pop: 3 },
            { n: '北京ダック 全聚徳本店', d: '北京ダック発祥の老舗', t: 'グルメ', dur: 90, addr: '北京市東城区', area: 'wangfujing', th: ['gm', 'hs'], pop: 5 },
            { n: '大董烤鴨店', d: 'モダン北京ダックの名店', t: 'グルメ', dur: 90, addr: '北京市東城区', area: 'wangfujing', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'マンダリン オリエンタル 北京', addr: '北京市朝陽区', area: 'wangfujing', price: 58000 },
            { n: 'ローズウッド北京', addr: '北京市朝陽区', area: 'wangfujing', price: 52000 },
            { n: 'ペニンシュラ北京', addr: '北京市東城区', area: 'wangfujing', price: 65000 },
        ],
    },

    // ホーチミン
    {
        id: 'hochiminh', name: 'ホーチミン', country: 'ベトナム', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 30,
        themes: ['sg', 'gm', 'sp', 'hs'],
        areas: [
            { id: 'dist1', name: '1区' }, { id: 'chinatown', name: 'チョロン' },
        ],
        spots: [
            { n: 'ベンタイン市場', d: 'ホーチミン最大の伝統市場', t: '観光', dur: 90, addr: '1区', area: 'dist1', th: ['sg', 'sp', 'gm'], pop: 5 },
            { n: 'サイゴン中央郵便局', d: 'フランス植民地時代の壮麗な建築', t: '観光', dur: 45, addr: '1区', area: 'dist1', th: ['sg', 'hs'], pop: 4 },
            { n: '聖母マリア大聖堂', d: 'サイゴン中央のゴシック教会', t: '観光', dur: 30, addr: '1区', area: 'dist1', th: ['sg', 'hs'], pop: 4 },
            { n: '統一会堂', d: '南ベトナム大統領官邸跡', t: '観光', dur: 75, addr: '1区', area: 'dist1', th: ['sg', 'hs'], pop: 3 },
            { n: '戦争証跡博物館', d: 'ベトナム戦争の記録', t: '観光', dur: 90, addr: '3区', area: 'dist1', th: ['sg', 'hs'], pop: 4 },
            { n: 'クチトンネル', d: 'ベトナム戦争の地下トンネル', t: '観光', dur: 240, addr: 'ベンディン区', area: 'chinatown', th: ['sg', 'hs', 'ex'], pop: 4 },
            { n: 'メコンデルタクルーズ', d: '田園と水郷文化', t: '観光', dur: 480, addr: 'メコンデルタ', area: 'chinatown', th: ['sg', 'nt', 'ex'], pop: 4, bk: true },
            { n: 'ブイビエン通り', d: 'バックパッカー街と夜遊び', t: '観光', dur: 90, addr: '1区', area: 'dist1', th: ['ng', 'gm', 'sg'], pop: 3 },
            { n: 'フォー2000', d: 'クリントン氏も訪れた本場フォー', t: 'グルメ', dur: 45, addr: '1区', area: 'dist1', th: ['gm'], pop: 4 },
            { n: 'バインミー フォン', d: '行列のできるバインミー', t: 'グルメ', dur: 30, addr: '1区', area: 'dist1', th: ['gm'], pop: 4 },
            { n: 'シタデル ルーフトップバー', d: 'ホーチミン夜景バー', t: 'グルメ', dur: 90, addr: '1区', area: 'dist1', th: ['ng', 'cp', 'gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテルマジェスティック サイゴン', addr: '1区', area: 'dist1', price: 32000 },
            { n: 'パークハイアット サイゴン', addr: '1区', area: 'dist1', price: 42000 },
            { n: 'カラベルサイゴン', addr: '1区', area: 'dist1', price: 28000 },
        ],
    },

    // ハノイ
    {
        id: 'hanoi', name: 'ハノイ', country: 'ベトナム', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 30,
        themes: ['sg', 'gm', 'hs', 'np'],
        areas: [
            { id: 'oldquarter', name: '旧市街' }, { id: 'halong', name: 'ハロン湾' },
        ],
        spots: [
            { n: 'ハロン湾クルーズ', d: '世界遺産の島々と奇岩', t: '観光', dur: 600, addr: 'ハロン市', area: 'halong', th: ['sg', 'np', 'wh'], pop: 5, bk: true },
            { n: '旧市街36通り', d: '昔ながらの職人街', t: '観光', dur: 120, addr: 'ホアンキエム区', area: 'oldquarter', th: ['sg', 'sp', 'gm'], pop: 5 },
            { n: 'ホアンキエム湖と玉山祠', d: '伝説の湖と赤い橋', t: '観光', dur: 60, addr: 'ホアンキエム区', area: 'oldquarter', th: ['sg', 'hs'], pop: 4 },
            { n: 'タンロン遺跡', d: '千年の城塞遺跡（世界遺産）', t: '観光', dur: 90, addr: 'バーディン区', area: 'oldquarter', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: '文廟', d: 'ベトナム最古の大学跡', t: '観光', dur: 60, addr: 'ドンダー区', area: 'oldquarter', th: ['sg', 'hs'], pop: 4 },
            { n: 'ホーチミン廟', d: 'ホーチミン主席の遺体安置', t: '観光', dur: 60, addr: 'バーディン区', area: 'oldquarter', th: ['sg', 'hs'], pop: 3 },
            { n: 'タンロン水上人形劇場', d: 'ベトナム伝統水上人形劇', t: '観光', dur: 60, addr: 'ホアンキエム区', area: 'oldquarter', th: ['sg', 'hs', 'fm'], pop: 4 },
            { n: 'チャンコック寺', d: 'ハノイ最古の寺院', t: '観光', dur: 45, addr: 'タイホー区', area: 'oldquarter', th: ['sg', 'hs'], pop: 3 },
            { n: 'フォー・ティン', d: '本場ハノイのフォー', t: 'グルメ', dur: 45, addr: 'ホアンキエム区', area: 'oldquarter', th: ['gm'], pop: 4 },
            { n: 'ブンチャー・ホン', d: 'オバマ氏も訪れたブンチャー', t: 'グルメ', dur: 60, addr: 'ホアンキエム区', area: 'oldquarter', th: ['gm', 'hs'], pop: 4 },
            { n: 'エッグコーヒー ジャン', d: 'ハノイ名物の発祥', t: 'グルメ', dur: 45, addr: 'ホアンキエム区', area: 'oldquarter', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'ソフィテル レジェンド メトロポール ハノイ', addr: 'ホアンキエム区', area: 'oldquarter', price: 52000 },
            { n: 'JWマリオット ハノイ', addr: 'ナムトゥリエム区', area: 'oldquarter', price: 32000 },
            { n: 'メリア ハロン', addr: 'ハロン市', area: 'halong', price: 28000 },
        ],
    },

    // バリ
    {
        id: 'bali', name: 'バリ', country: 'インドネシア', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: 'タクシー', intra_gap_min: 40,
        themes: ['bc', 'np', 'cp', 'on', 'ar'],
        areas: [
            { id: 'kuta', name: 'クタ・スミニャック' }, { id: 'ubud', name: 'ウブド' }, { id: 'nusa-dua', name: 'ヌサドゥア' },
        ],
        spots: [
            { n: 'ウブドのライステラス（テガラランライステラス）', d: '棚田の絶景', t: '観光', dur: 90, addr: 'テガララン', area: 'ubud', th: ['np', 'cp'], pop: 5 },
            { n: 'ウブド王宮', d: 'バリ伝統舞踊と王宮見学', t: '観光', dur: 90, addr: 'ウブド', area: 'ubud', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'モンキーフォレスト', d: 'ウブドの神聖な森と猿', t: '観光', dur: 75, addr: 'ウブド', area: 'ubud', th: ['nt', 'sg', 'fm'], pop: 4 },
            { n: 'タナロット寺院', d: '海上の岩礁に立つ寺院・夕日の名所', t: '観光', dur: 90, addr: 'タバナン', area: 'kuta', th: ['sg', 'hs', 'np', 'cp'], pop: 5 },
            { n: 'ウルワツ寺院', d: '断崖の上のヒンドゥー寺院', t: '観光', dur: 120, addr: 'ウルワツ', area: 'nusa-dua', th: ['sg', 'hs', 'np', 'cp'], pop: 5 },
            { n: 'クタビーチ', d: 'サーフィンの聖地', t: '観光', dur: 120, addr: 'クタ', area: 'kuta', th: ['bc', 'sg'], pop: 4 },
            { n: 'スミニャックビーチ', d: 'ハイエンドリゾートビーチ', t: '観光', dur: 90, addr: 'スミニャック', area: 'kuta', th: ['bc', 'cp'], pop: 4 },
            { n: 'ヌサペニダ島ケリンキングビーチ', d: 'バリ随一の絶景ビーチ', t: '観光', dur: 360, addr: 'ヌサペニダ島', area: 'nusa-dua', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: 'バリ・スウィング', d: 'ジャングルブランコのフォトスポット', t: '観光', dur: 90, addr: 'ウブド', area: 'ubud', th: ['cp', 'np', 'ex'], pop: 4 },
            { n: 'バリスパ体験', d: '本場のジャワニーズスパ', t: 'その他', dur: 90, addr: 'ウブド', area: 'ubud', th: ['on', 'cp', 'ex'], pop: 4, bk: true },
            { n: 'ジンバランベイ シーフード', d: '夕日と砂浜BBQ', t: 'グルメ', dur: 120, addr: 'ジンバラン', area: 'nusa-dua', th: ['gm', 'cp', 'ng'], pop: 4 },
            { n: 'カフェ・ロータス', d: 'ウブドの蓮池カフェ', t: 'グルメ', dur: 75, addr: 'ウブド', area: 'ubud', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'フォーシーズンズリゾートバリ ジンバランベイ', addr: 'ジンバラン', area: 'nusa-dua', price: 85000 },
            { n: 'コモ シャンバラ エステート', addr: 'ウブド', area: 'ubud', price: 95000 },
            { n: 'ザ・ムリア バリ', addr: 'ヌサドゥア', area: 'nusa-dua', price: 58000 },
        ],
    },

    // クアラルンプール
    {
        id: 'kl', name: 'クアラルンプール', country: 'マレーシア', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'sp', 'np', 'ng'],
        areas: [
            { id: 'klcc', name: 'KLCC' }, { id: 'chow-kit', name: 'ブキッビンタン' },
        ],
        spots: [
            { n: 'ペトロナス・ツインタワー', d: 'KLのシンボル・夜景の名所', t: '観光', dur: 90, addr: 'KLCC', area: 'klcc', th: ['sg', 'np', 'ng'], pop: 5 },
            { n: 'スカイブリッジ展望', d: 'ツインタワー41階展望', t: '観光', dur: 60, addr: 'KLCC', area: 'klcc', th: ['np', 'ng'], pop: 4 },
            { n: 'バトゥ洞窟', d: '黄金巨像のヒンドゥー寺院', t: '観光', dur: 120, addr: 'スランゴール州ゴンバック', area: 'klcc', th: ['sg', 'hs'], pop: 5 },
            { n: 'KLタワー', d: '世界第7位の高さの電波塔', t: '観光', dur: 75, addr: 'KLCC', area: 'klcc', th: ['np', 'ng'], pop: 3 },
            { n: 'ブキッ・ビンタン', d: 'KL最大のショッピング街', t: '観光', dur: 120, addr: 'ブキッビンタン', area: 'chow-kit', th: ['sp', 'gm', 'ng'], pop: 5 },
            { n: 'パビリオン・クアラルンプール', d: '最高峰のショッピングモール', t: '観光', dur: 120, addr: 'ブキッビンタン', area: 'chow-kit', th: ['sp'], pop: 4 },
            { n: 'チャイナタウン（プタリンストリート）', d: '安価な土産と屋台', t: '観光', dur: 90, addr: 'チャイナタウン', area: 'chow-kit', th: ['sp', 'sg', 'gm'], pop: 4 },
            { n: '王宮（イスタナ・ネガラ）', d: 'マレーシア国王の宮殿', t: '観光', dur: 45, addr: 'KLCC', area: 'klcc', th: ['sg', 'hs'], pop: 3 },
            { n: 'マスジット・ネガラ（国立モスク）', d: 'マレーシア国を代表するモスク', t: '観光', dur: 60, addr: 'KLCC', area: 'klcc', th: ['sg', 'hs'], pop: 3 },
            { n: 'ジャラン・アロー屋台街', d: '夜の屋台グルメ街', t: 'グルメ', dur: 90, addr: 'ブキッビンタン', area: 'chow-kit', th: ['gm', 'ng'], pop: 5, eveningOk: true },
            { n: '亞坤カヤトースト', d: 'シンガポール発のカヤトースト名店', t: 'グルメ', dur: 45, addr: 'ブキッビンタン', area: 'chow-kit', th: ['gm', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'マンダリン オリエンタル クアラルンプール', addr: 'KLCC', area: 'klcc', price: 35000 },
            { n: 'ザ・リッツ・カールトン クアラルンプール', addr: 'ブキッビンタン', area: 'chow-kit', price: 42000 },
            { n: 'JWマリオット クアラルンプール', addr: 'ブキッビンタン', area: 'chow-kit', price: 32000 },
        ],
    },

    // マニラ
    {
        id: 'manila', name: 'マニラ', country: 'フィリピン', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 35,
        themes: ['sg', 'gm', 'hs', 'bc'],
        areas: [
            { id: 'intramuros', name: 'イントラムロス' }, { id: 'makati', name: 'マカティ' }, { id: 'cebu', name: 'セブ周辺' },
        ],
        spots: [
            { n: 'イントラムロス', d: 'スペイン統治時代の旧市街', t: '観光', dur: 120, addr: 'マニラ市', area: 'intramuros', th: ['sg', 'hs'], pop: 5 },
            { n: 'サン・アグスチン教会', d: 'フィリピン最古の教会（世界遺産）', t: '観光', dur: 60, addr: 'マニラ市', area: 'intramuros', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'マニラ大聖堂', d: 'イントラムロスの中心教会', t: '観光', dur: 45, addr: 'マニラ市', area: 'intramuros', th: ['sg', 'hs'], pop: 4 },
            { n: 'リサール公園', d: 'マニラ最大の都市公園', t: '観光', dur: 60, addr: 'マニラ市', area: 'intramuros', th: ['sg', 'hs'], pop: 3 },
            { n: 'グリーンベルト・モール', d: 'マカティの高級ショッピング', t: '観光', dur: 120, addr: 'マカティ市', area: 'makati', th: ['sp', 'gm'], pop: 4 },
            { n: 'SMモール・オブ・アジア', d: 'アジア最大級のモール', t: '観光', dur: 150, addr: 'パサイ市', area: 'makati', th: ['sp', 'fm'], pop: 4 },
            { n: 'ボラカイ島', d: '世界一の白浜と称されるリゾート', t: '観光', dur: 600, addr: 'マライ', area: 'cebu', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: 'タール火山', d: 'タール湖と火山', t: '観光', dur: 240, addr: 'バタンガス州', area: 'intramuros', th: ['np', 'sg'], pop: 4 },
            { n: 'マニラベイ サンセット', d: 'マニラ湾の夕日散歩', t: '観光', dur: 45, addr: 'マニラ市', area: 'intramuros', th: ['cp', 'np'], pop: 3 },
            { n: 'ジョリビー', d: 'フィリピン国民食ファストフード', t: 'グルメ', dur: 45, addr: 'マカティ市', area: 'makati', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ザ・ペニンシュラ マニラ', addr: 'マカティ市', area: 'makati', price: 42000 },
            { n: 'マニラ マリオット ホテル', addr: 'パサイ市', area: 'makati', price: 28000 },
            { n: 'ソフィテル フィリピン プラザ マニラ', addr: 'パサイ市', area: 'makati', price: 32000 },
        ],
    },
]
