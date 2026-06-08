import type { DestinationEntry } from '../types'

// 東京から1泊2日向けの新規 destinations。
// 既存と被らないよう、関東圏＋甲信越の人気行き先を網羅的に追加。

export const DOMESTIC_1N2: DestinationEntry[] = [
    // ──────────── 熱海 ────────────
    {
        id: 'atami', name: '熱海', country: '日本', region: 'kanto',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 25,
        themes: ['on', 'np', 'cp', 'gm', 'sg'],
        areas: [{ id: 'atami-c', name: '熱海' }],
        spots: [
            { n: '熱海サンビーチ', d: '市街地に隣接する遠浅の砂浜', t: '観光', dur: 90, addr: '熱海市東海岸町', area: 'atami-c', th: ['np', 'cp', 'bc'], pop: 5 },
            { n: '熱海城', d: '海を見下ろす高台の城型展望施設', t: '観光', dur: 90, addr: '熱海市曽我山町', area: 'atami-c', th: ['sg', 'np'], pop: 4 },
            { n: 'MOA美術館', d: '相模湾を望む高台の私設美術館', t: '観光', dur: 120, addr: '熱海市桃山町', area: 'atami-c', th: ['ar', 'sg'], pop: 4 },
            { n: '來宮神社', d: '樹齢2000年の大楠で知られる古社', t: '観光', dur: 60, addr: '熱海市西山町', area: 'atami-c', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '熱海銀座商店街', d: '老舗と新店が並ぶ目抜き通り', t: '観光', dur: 90, addr: '熱海市銀座町', area: 'atami-c', th: ['gm', 'sg', 'sp'], pop: 4 },
            { n: '初島フェリー（離島ピクニック）', d: '熱海港から30分の離島・海カフェ', t: '観光', dur: 240, addr: '熱海港〜初島', area: 'atami-c', th: ['np', 'cp', 'ex'], pop: 4 },
            { n: '熱海花火大会（夏期）', d: '海上で打ち上がる季節限定花火', t: '観光', dur: 90, addr: '熱海港', area: 'atami-c', th: ['cp', 'ng'], pop: 5, eveningOk: true },
            { n: '熱海プリン', d: 'レトロ瓶入りのご当地プリン', t: 'グルメ', dur: 30, addr: '熱海市銀座町', area: 'atami-c', th: ['gm', 'sg'], pop: 4 },
            { n: '海鮮丼（駅前商店街）', d: '相模湾の地魚を使った海鮮ランチ', t: 'グルメ', dur: 75, addr: '熱海駅前', area: 'atami-c', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: '熱海後楽園ホテル', addr: '熱海市和田浜南町', area: 'atami-c', price: 28000 },
            { n: 'ATAMI せかいえ', addr: '熱海市熱海', area: 'atami-c', price: 65000 },
        ],
    },

    // ──────────── 伊東・下田（東伊豆〜南伊豆） ────────────
    {
        id: 'ito-shimoda', name: '伊東・下田', country: '日本', region: 'chubu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['on', 'np', 'bc', 'cp', 'hs'],
        areas: [
            { id: 'ito', name: '伊東' },
            { id: 'shimoda', name: '下田・南伊豆' },
        ],
        spots: [
            { n: '城ヶ崎海岸 門脇吊橋', d: '断崖と海原に架かる吊り橋', t: '観光', dur: 90, addr: '伊東市富戸', area: 'ito', th: ['np', 'ex', 'cp'], pop: 5 },
            { n: '大室山リフト', d: 'お椀型の山頂をリフトで巡る', t: '観光', dur: 90, addr: '伊東市池', area: 'ito', th: ['np', 'cp', 'fm'], pop: 5 },
            { n: 'シャボテン動物公園', d: 'サボテンとカピバラ温泉', t: '観光', dur: 180, addr: '伊東市富戸', area: 'ito', th: ['fm', 'ex'], pop: 4 },
            { n: '伊東温泉街', d: '木造旅館が残る古湯の温泉街', t: '観光', dur: 90, addr: '伊東市湯川', area: 'ito', th: ['on', 'hs', 'cp'], pop: 4 },
            { n: '白浜大浜海水浴場', d: '南伊豆を代表する白砂のビーチ', t: '観光', dur: 180, addr: '下田市白浜', area: 'shimoda', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: '下田ペリーロード', d: 'なまこ壁の街並みが残る石畳の小径', t: '観光', dur: 60, addr: '下田市三丁目', area: 'shimoda', th: ['sg', 'hs', 'cp'], pop: 4 },
            { n: '寝姿山 下田ロープウェイ', d: '港を見下ろす山頂展望', t: '観光', dur: 90, addr: '下田市東本郷', area: 'shimoda', th: ['np', 'cp'], pop: 4 },
            { n: '伊豆 海鮮（金目鯛煮付け）', d: '下田名物の金目鯛をしっかり煮付けで', t: 'グルメ', dur: 75, addr: '下田市内', area: 'shimoda', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'ハトヤホテル', addr: '伊東市岡', area: 'ito', price: 22000 },
            { n: '下田大和館', addr: '下田市吉佐美', area: 'shimoda', price: 35000 },
        ],
    },

    // ──────────── 横浜・みなとみらい ────────────
    {
        id: 'minatomirai', name: '横浜・みなとみらい', country: '日本', region: 'kanto',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['sg', 'ng', 'cp', 'gm', 'sp', 'fm', 'ar'],
        areas: [
            { id: 'mm21', name: 'みなとみらい' },
            { id: 'chinatown', name: '中華街・元町' },
        ],
        spots: [
            { n: '横浜ランドマークタワー スカイガーデン', d: '69階の展望フロアからの大パノラマ', t: '観光', dur: 90, addr: '横浜市西区みなとみらい', area: 'mm21', th: ['np', 'ng', 'cp', 'sg'], pop: 5 },
            { n: '赤レンガ倉庫', d: '明治期の倉庫を改装したショッピングモール', t: '観光', dur: 120, addr: '横浜市中区新港', area: 'mm21', th: ['sg', 'sp', 'gm', 'hs'], pop: 5 },
            { n: 'カップヌードルミュージアム', d: 'インスタント麺の歴史と自作体験', t: '観光', dur: 150, addr: '横浜市中区新港', area: 'mm21', th: ['fm', 'ex'], pop: 4 },
            { n: '横浜中華街', d: '関帝廟を中心とする日本最大の中華街', t: '観光', dur: 120, addr: '横浜市中区山下町', area: 'chinatown', th: ['gm', 'sp', 'sg'], pop: 5 },
            { n: '山下公園', d: '氷川丸が停泊するベイサイドの公園', t: '観光', dur: 60, addr: '横浜市中区山下町', area: 'chinatown', th: ['cp', 'np'], pop: 4 },
            { n: '元町ショッピングストリート', d: '老舗の洋館風ブティック街', t: '観光', dur: 90, addr: '横浜市中区元町', area: 'chinatown', th: ['sp', 'cp', 'sg'], pop: 4 },
            { n: 'よこはまコスモワールド（観覧車）', d: 'コスモクロック21の夜景観覧', t: '観光', dur: 60, addr: '横浜市中区新港', area: 'mm21', th: ['ng', 'cp', 'fm'], pop: 5, eveningOk: true },
            { n: '中華街 飲茶ランチ', d: '点心の食べ歩きと本格ディナー', t: 'グルメ', dur: 90, addr: '横浜市中区山下町', area: 'chinatown', th: ['gm', 'cp'], pop: 5 },
            { n: '横浜ハンマーヘッド', d: '新港埠頭のクルーズ船バース', t: '観光', dur: 60, addr: '横浜市中区新港', area: 'mm21', th: ['sg', 'sp'], pop: 3 },
        ],
        hotels: [
            { n: 'ヨコハマ グランド インターコンチネンタル ホテル', addr: '横浜市西区みなとみらい', area: 'mm21', price: 32000 },
            { n: 'ホテルニューグランド', addr: '横浜市中区山下町', area: 'chinatown', price: 38000 },
        ],
    },

    // ──────────── 江ノ島・湘南 ────────────
    {
        id: 'enoshima-shonan', name: '江ノ島・湘南', country: '日本', region: 'kanto',
        trip_style: 'walking', intra_mode: '電車', intra_gap_min: 20,
        themes: ['sg', 'np', 'cp', 'bc', 'gm'],
        areas: [
            { id: 'enoshima', name: '江ノ島' },
            { id: 'shonan', name: '茅ヶ崎・葉山' },
        ],
        spots: [
            { n: '江島神社', d: '島内3社からなる弁財天信仰の中心', t: '観光', dur: 90, addr: '藤沢市江の島', area: 'enoshima', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '江の島シーキャンドル展望台', d: '湘南海岸を見渡せる白いタワー', t: '観光', dur: 90, addr: '藤沢市江の島', area: 'enoshima', th: ['np', 'cp', 'ng'], pop: 5 },
            { n: '岩屋洞窟', d: '波の浸食でできた島先端の海食洞', t: '観光', dur: 60, addr: '藤沢市江の島', area: 'enoshima', th: ['sg', 'np', 'ex'], pop: 4 },
            { n: 'しらす丼ランチ', d: '生・釜揚げの湘南名物', t: 'グルメ', dur: 60, addr: '藤沢市江の島', area: 'enoshima', th: ['gm'], pop: 5 },
            { n: '腰越・小動神社', d: '海岸沿いの趣のある小さな神社', t: '観光', dur: 30, addr: '鎌倉市腰越', area: 'enoshima', th: ['sg', 'hs'], pop: 3 },
            { n: '稲村ヶ崎', d: '富士山と江ノ島を望むサンセットスポット', t: '観光', dur: 60, addr: '鎌倉市稲村ガ崎', area: 'enoshima', th: ['np', 'cp', 'ng'], pop: 5, eveningOk: true },
            { n: '葉山一色海岸', d: '富士山が望める南向きの白浜', t: '観光', dur: 120, addr: '三浦郡葉山町一色', area: 'shonan', th: ['bc', 'np', 'cp'], pop: 4 },
            { n: '茅ヶ崎・サザンビーチ', d: '湘南サウンドの聖地', t: '観光', dur: 90, addr: '茅ヶ崎市中海岸', area: 'shonan', th: ['bc', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '江の島アイランドスパ', addr: '藤沢市江の島', area: 'enoshima', price: 28000 },
            { n: '葉山うみのホテル', addr: '葉山町一色', area: 'shonan', price: 32000 },
        ],
    },

    // ──────────── 房総内房（館山・鋸山） ────────────
    {
        id: 'boso-uchibo', name: '房総内房（館山・鋸山）', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'bc', 'cp', 'fm', 'gm'],
        areas: [{ id: 'uchibo', name: '内房' }],
        spots: [
            { n: '鋸山 ロープウェー', d: '山頂から東京湾を一望する展望', t: '観光', dur: 90, addr: '富津市金谷', area: 'uchibo', th: ['np', 'ex'], pop: 5 },
            { n: '鋸山 地獄のぞき', d: '断崖から突き出た展望スポット', t: '観光', dur: 120, addr: '富津市金谷', area: 'uchibo', th: ['np', 'ex', 'sg'], pop: 5 },
            { n: '日本寺 大仏', d: '日本最大級の磨崖仏', t: '観光', dur: 90, addr: '安房郡鋸南町元名', area: 'uchibo', th: ['sg', 'hs'], pop: 4 },
            { n: '館山城（八犬伝博物館）', d: '里見氏ゆかりの天守風博物館', t: '観光', dur: 90, addr: '館山市館山', area: 'uchibo', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '沖ノ島 シュノーケリング', d: '陸続きの無人島で透明な海', t: '観光', dur: 180, addr: '館山市富士見', area: 'uchibo', th: ['bc', 'ex', 'fm'], pop: 5 },
            { n: '館山夕日桟橋', d: '500mの海上桟橋からの夕日', t: '観光', dur: 60, addr: '館山市館山', area: 'uchibo', th: ['cp', 'np'], pop: 5, eveningOk: true },
            { n: '富津岬展望台', d: '東京湾アクアラインの先に富士山', t: '観光', dur: 60, addr: '富津市富津', area: 'uchibo', th: ['np', 'cp'], pop: 4 },
            { n: 'なめろう・房総漁師丼', d: '内房漁港の朝獲れ漁師飯', t: 'グルメ', dur: 60, addr: '館山市内', area: 'uchibo', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: '南房総白浜温泉 ホテル千倉', addr: '南房総市千倉町', area: 'uchibo', price: 22000 },
            { n: '休暇村 館山', addr: '館山市西岬', area: 'uchibo', price: 18000 },
        ],
    },

    // ──────────── 房総外房（鴨川・勝浦） ────────────
    {
        id: 'boso-sotobo', name: '房総外房（鴨川・勝浦）', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['fm', 'np', 'bc', 'on', 'gm'],
        areas: [{ id: 'sotobo', name: '外房' }],
        spots: [
            { n: '鴨川シーワールド', d: 'シャチのパフォーマンスで有名な水族館', t: '観光', dur: 240, addr: '鴨川市東町', area: 'sotobo', th: ['fm', 'sg'], pop: 5 },
            { n: '誕生寺', d: '日蓮聖人ゆかりの古刹', t: '観光', dur: 60, addr: '鴨川市小湊', area: 'sotobo', th: ['sg', 'hs'], pop: 3 },
            { n: '鵜原理想郷', d: 'リアス式海岸の遊歩道', t: '観光', dur: 120, addr: '勝浦市鵜原', area: 'sotobo', th: ['np', 'ex'], pop: 4 },
            { n: '勝浦朝市', d: '日本三大朝市のひとつ', t: '観光', dur: 90, addr: '勝浦市浜勝浦', area: 'sotobo', th: ['gm', 'sg'], pop: 4, morningOk: true },
            { n: '養老渓谷 粟又の滝', d: '紅葉の名所として知られる滝', t: '観光', dur: 120, addr: '夷隅郡大多喜町', area: 'sotobo', th: ['np', 'nt'], pop: 5 },
            { n: '大山千枚田', d: '東京から最も近い棚田の景観', t: '観光', dur: 90, addr: '鴨川市平塚', area: 'sotobo', th: ['np', 'nt', 'cp'], pop: 4 },
            { n: '勝浦タンタンメン', d: '辛味と旨味が特徴のご当地麺', t: 'グルメ', dur: 60, addr: '勝浦市内', area: 'sotobo', th: ['gm'], pop: 5 },
            { n: '鴨川温泉', d: '太平洋を望む外房の海辺の湯', t: '観光', dur: 90, addr: '鴨川市', area: 'sotobo', th: ['on', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '鴨川グランドホテル', addr: '鴨川市広場', area: 'sotobo', price: 25000 },
            { n: 'ホテル三日月 龍宮城スパ・ホテル三日月', addr: '木更津市北浜町', area: 'sotobo', price: 28000 },
        ],
    },

    // ──────────── 水戸・大洗 ────────────
    {
        id: 'mito-oarai', name: '水戸・大洗', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['sg', 'np', 'hs', 'fm', 'gm'],
        areas: [
            { id: 'mito', name: '水戸' },
            { id: 'oarai', name: '大洗' },
        ],
        spots: [
            { n: '偕楽園', d: '日本三名園のひとつ・梅の名所', t: '観光', dur: 120, addr: '水戸市常磐町', area: 'mito', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: '弘道館', d: '水戸藩の藩校跡', t: '観光', dur: 60, addr: '水戸市三の丸', area: 'mito', th: ['sg', 'hs'], pop: 3 },
            { n: 'アクアワールド茨城県大洗水族館', d: '日本最大級のサメ展示', t: '観光', dur: 180, addr: '東茨城郡大洗町磯浜町', area: 'oarai', th: ['fm', 'sg'], pop: 5 },
            { n: '大洗磯前神社 神磯の鳥居', d: '海上の岩に立つ鳥居の絶景', t: '観光', dur: 60, addr: '東茨城郡大洗町磯浜町', area: 'oarai', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: 'めんたいパーク大洗', d: 'できたて明太子の工場見学', t: '観光', dur: 60, addr: '東茨城郡大洗町磯浜町', area: 'oarai', th: ['gm', 'fm', 'sg'], pop: 4 },
            { n: 'ひたち海浜公園', d: 'ネモフィラとコキアで彩る丘', t: '観光', dur: 180, addr: 'ひたちなか市馬渡', area: 'mito', th: ['np', 'cp', 'fm'], pop: 5 },
            { n: '大洗海鮮市場', d: '常磐の朝獲れ海鮮を市場で', t: 'グルメ', dur: 90, addr: '大洗町磯浜町', area: 'oarai', th: ['gm'], pop: 5 },
            { n: '袋田の滝（季節）', d: '日本三大瀑布の四段の滝', t: '観光', dur: 180, addr: '久慈郡大子町袋田', area: 'mito', th: ['np', 'nt'], pop: 5 },
        ],
        hotels: [
            { n: '大洗ホテル', addr: '東茨城郡大洗町', area: 'oarai', price: 22000 },
            { n: 'ホテルテラス・ザ・ガーデン水戸', addr: '水戸市宮町', area: 'mito', price: 14000 },
        ],
    },

    // ──────────── 銚子・犬吠埼 ────────────
    {
        id: 'choshi', name: '銚子・犬吠埼', country: '日本', region: 'kanto',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 30,
        themes: ['np', 'gm', 'cp', 'sg', 'fm'],
        areas: [{ id: 'choshi-c', name: '銚子' }],
        spots: [
            { n: '犬吠埼灯台', d: '日本最東端付近の白亜の灯台', t: '観光', dur: 90, addr: '銚子市犬吠埼', area: 'choshi-c', th: ['np', 'sg', 'cp'], pop: 5 },
            { n: '銚子電鉄', d: 'ぬれ煎餅で有名な小さなローカル線', t: '観光', dur: 90, addr: '銚子市内', area: 'choshi-c', th: ['ex', 'fm', 'sg'], pop: 5 },
            { n: '地球の丸く見える丘展望館', d: '海平線の弧を実感できる展望', t: '観光', dur: 60, addr: '銚子市天王台', area: 'choshi-c', th: ['np', 'cp'], pop: 5 },
            { n: '銚子ポートタワー', d: '漁港を見下ろす展望タワー', t: '観光', dur: 60, addr: '銚子市川口町', area: 'choshi-c', th: ['np', 'sg'], pop: 3 },
            { n: '屛風ヶ浦', d: '東洋のドーバーと呼ばれる断崖', t: '観光', dur: 90, addr: '銚子市潮見町', area: 'choshi-c', th: ['np', 'cp', 'nt'], pop: 5 },
            { n: '銚子漁港 海鮮丼', d: '水揚げ日本一級の漁港のランチ', t: 'グルメ', dur: 75, addr: '銚子市川口町', area: 'choshi-c', th: ['gm'], pop: 5 },
            { n: '犬吠埼 初日の出', d: '太平洋から昇る一番乗りの朝日', t: '観光', dur: 90, addr: '銚子市犬吠埼', area: 'choshi-c', th: ['np', 'cp', 'ex'], pop: 4, morningOk: true },
            { n: 'ヤマサ醤油工場見学', d: '創業1645年の醤油蔵', t: '観光', dur: 90, addr: '銚子市北小川町', area: 'choshi-c', th: ['ex', 'fm', 'sg'], pop: 4 },
        ],
        hotels: [
            { n: '犬吠埼ホテル', addr: '銚子市犬吠埼', area: 'choshi-c', price: 26000 },
            { n: '犬吠埼観光ホテル', addr: '銚子市犬吠埼', area: 'choshi-c', price: 22000 },
        ],
    },

    // ──────────── 伊香保温泉 ────────────
    {
        id: 'ikaho', name: '伊香保温泉', country: '日本', region: 'kanto',
        trip_style: 'walking', intra_mode: 'バス', intra_gap_min: 25,
        themes: ['on', 'cp', 'np', 'hs', 'gm'],
        areas: [{ id: 'ikaho-c', name: '伊香保' }],
        spots: [
            { n: '伊香保 石段街', d: '365段の石段の両側に並ぶ温泉街', t: '観光', dur: 120, addr: '渋川市伊香保町', area: 'ikaho-c', th: ['on', 'sg', 'cp'], pop: 5 },
            { n: '伊香保神社', d: '石段街の頂上に鎮座する温泉守護神', t: '観光', dur: 30, addr: '渋川市伊香保町', area: 'ikaho-c', th: ['sg', 'hs'], pop: 4 },
            { n: '伊香保露天風呂', d: '黄金の湯の源泉に近い露天', t: '観光', dur: 90, addr: '渋川市伊香保町', area: 'ikaho-c', th: ['on', 'cp'], pop: 5 },
            { n: '河鹿橋', d: '紅葉ライトアップで知られる朱の太鼓橋', t: '観光', dur: 30, addr: '渋川市伊香保町', area: 'ikaho-c', th: ['np', 'cp'], pop: 4 },
            { n: '榛名湖', d: 'カルデラ湖と榛名富士のセット', t: '観光', dur: 120, addr: '高崎市榛名湖町', area: 'ikaho-c', th: ['np', 'nt', 'cp'], pop: 5 },
            { n: 'グリーン牧場', d: '羊や羊毛体験ができる観光牧場', t: '観光', dur: 180, addr: '渋川市金井', area: 'ikaho-c', th: ['fm', 'ex'], pop: 4 },
            { n: 'おもちゃと人形 自動車博物館', d: 'レトロ収集品が並ぶ大型施設', t: '観光', dur: 120, addr: '渋川市伊香保町', area: 'ikaho-c', th: ['fm', 'sg'], pop: 3 },
            { n: '水沢うどん', d: '日本三大うどんのひとつ', t: 'グルメ', dur: 60, addr: '渋川市伊香保町水沢', area: 'ikaho-c', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'お宿 玉樹', addr: '渋川市伊香保町', area: 'ikaho-c', price: 38000 },
            { n: '福一', addr: '渋川市伊香保町', area: 'ikaho-c', price: 45000 },
        ],
    },

    // ──────────── 水上温泉・谷川岳 ────────────
    {
        id: 'minakami', name: '水上温泉・谷川岳', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['on', 'nt', 'np', 'ex', 'cp'],
        areas: [{ id: 'minakami-c', name: 'みなかみ' }],
        spots: [
            { n: '谷川岳ロープウェー', d: '天神平までを結ぶ山岳ロープウェー', t: '観光', dur: 180, addr: 'みなかみ町湯桧曽', area: 'minakami-c', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: '一ノ倉沢', d: '日本三大岩壁のひとつの大屏風岩', t: '観光', dur: 120, addr: 'みなかみ町湯桧曽', area: 'minakami-c', th: ['np', 'nt'], pop: 4 },
            { n: '諏訪峡', d: '利根川の渓谷美と遊歩道', t: '観光', dur: 90, addr: 'みなかみ町小日向', area: 'minakami-c', th: ['np', 'cp'], pop: 4 },
            { n: '水上ラフティング', d: '日本屈指の急流下り', t: '観光', dur: 180, addr: 'みなかみ町', area: 'minakami-c', th: ['ex', 'fm'], pop: 5, bk: true },
            { n: '宝川温泉 汪泉閣', d: '川沿いに広がる超大露天風呂', t: '観光', dur: 90, addr: 'みなかみ町藤原', area: 'minakami-c', th: ['on', 'cp'], pop: 5 },
            { n: 'たくみの里', d: '工芸体験が並ぶ里山の道の駅群', t: '観光', dur: 120, addr: 'みなかみ町須川', area: 'minakami-c', th: ['ex', 'fm', 'sg'], pop: 4 },
            { n: '土合駅 もぐら駅', d: 'ホームへ486段の地下深い駅', t: '観光', dur: 60, addr: 'みなかみ町湯桧曽', area: 'minakami-c', th: ['ex', 'sg'], pop: 4 },
            { n: '上州牛・水上の蕎麦', d: '清流が育てた山の幸ランチ', t: 'グルメ', dur: 75, addr: 'みなかみ町内', area: 'minakami-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: '水上温泉 松乃井', addr: 'みなかみ町小日向', area: 'minakami-c', price: 28000 },
            { n: '宝川温泉 汪泉閣', addr: 'みなかみ町藤原', area: 'minakami-c', price: 32000 },
        ],
    },

    // ──────────── 川越（小江戸） ────────────
    {
        id: 'kawagoe-koedo', name: '川越（小江戸）', country: '日本', region: 'kanto',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 15,
        themes: ['sg', 'hs', 'gm', 'cp', 'sp'],
        areas: [{ id: 'koedo', name: '小江戸' }],
        spots: [
            { n: '時の鐘', d: '川越のシンボル・江戸期から続く鐘楼', t: '観光', dur: 30, addr: '川越市幸町', area: 'koedo', th: ['sg', 'hs'], pop: 5 },
            { n: '蔵造りの町並み', d: '黒漆喰の蔵が並ぶ一番街', t: '観光', dur: 120, addr: '川越市幸町', area: 'koedo', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '菓子屋横丁', d: '昔懐かしい駄菓子の専門店街', t: '観光', dur: 60, addr: '川越市元町', area: 'koedo', th: ['sg', 'gm', 'fm'], pop: 5 },
            { n: '川越氷川神社', d: '縁結びと夏の風鈴回廊で有名', t: '観光', dur: 90, addr: '川越市宮下町', area: 'koedo', th: ['sg', 'cp', 'hs'], pop: 5 },
            { n: '喜多院', d: '五百羅漢と徳川家ゆかりの古刹', t: '観光', dur: 90, addr: '川越市小仙波町', area: 'koedo', th: ['sg', 'hs'], pop: 4 },
            { n: '川越城本丸御殿', d: '関東唯一の現存本丸御殿', t: '観光', dur: 60, addr: '川越市郭町', area: 'koedo', th: ['sg', 'hs'], pop: 4 },
            { n: 'うなぎ料理', d: '川越名物として伝統がある', t: 'グルメ', dur: 75, addr: '川越市内', area: 'koedo', th: ['gm', 'hs'], pop: 5 },
            { n: 'COEDOビール', d: '川越発祥のクラフトビール', t: 'グルメ', dur: 60, addr: '川越市内', area: 'koedo', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '川越プリンスホテル', addr: '川越市新富町', area: 'koedo', price: 16000 },
            { n: 'ホテル三井ガーデン川越', addr: '川越市脇田本町', area: 'koedo', price: 14000 },
        ],
    },

    // ──────────── 奥多摩・御岳 ────────────
    {
        id: 'okutama-mitake', name: '奥多摩・御岳', country: '日本', region: 'kanto',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 30,
        themes: ['nt', 'np', 'ex', 'on', 'cp'],
        areas: [{ id: 'okutama-c', name: '奥多摩' }],
        spots: [
            { n: '御岳山 武蔵御嶽神社', d: 'ケーブルカーと参道', t: '観光', dur: 120, addr: '青梅市御岳山', area: 'okutama-c', th: ['sg', 'hs', 'nt'], pop: 5 },
            { n: 'ロックガーデン', d: '苔むす沢沿いのトレイル', t: '観光', dur: 180, addr: '青梅市御岳山', area: 'okutama-c', th: ['nt', 'np', 'ex'], pop: 5 },
            { n: '日原鍾乳洞', d: '関東随一の規模の鍾乳洞', t: '観光', dur: 120, addr: '奥多摩町日原', area: 'okutama-c', th: ['nt', 'ex', 'sg'], pop: 5 },
            { n: '奥多摩湖（小河内ダム）', d: 'ダム湖の遊歩道と周辺ハイク', t: '観光', dur: 120, addr: '奥多摩町原', area: 'okutama-c', th: ['np', 'nt', 'cp'], pop: 4 },
            { n: '鳩ノ巣渓谷', d: '多摩川上流の渓谷美', t: '観光', dur: 90, addr: '奥多摩町棚澤', area: 'okutama-c', th: ['np', 'nt'], pop: 4 },
            { n: '河辺温泉 梅の湯', d: '河辺駅直結の日帰り温泉', t: '観光', dur: 90, addr: '青梅市河辺町', area: 'okutama-c', th: ['on'], pop: 4 },
            { n: 'もえぎの湯', d: '奥多摩駅から徒歩圏の渓谷湯', t: '観光', dur: 90, addr: '奥多摩町氷川', area: 'okutama-c', th: ['on', 'cp'], pop: 4 },
            { n: 'わさび丼・山菜そば', d: '清流で育つわさびと山の幸', t: 'グルメ', dur: 60, addr: '奥多摩町内', area: 'okutama-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: '奥多摩 氷川キャンプ場', addr: '奥多摩町氷川', area: 'okutama-c', price: 8000 },
            { n: '奥多摩温泉 もえぎの湯 別館', addr: '奥多摩町氷川', area: 'okutama-c', price: 16000 },
        ],
    },

    // ──────────── 奥日光・中禅寺湖 ────────────
    {
        id: 'okunikko', name: '奥日光・中禅寺湖', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'バス', intra_gap_min: 30,
        themes: ['nt', 'np', 'on', 'cp', 'wh'],
        areas: [{ id: 'okunikko-c', name: '奥日光' }],
        spots: [
            { n: '華厳の滝', d: '日本三名瀑のひとつ・落差97mの大瀑布', t: '観光', dur: 90, addr: '日光市中宮祠', area: 'okunikko-c', th: ['np', 'nt'], pop: 5 },
            { n: '中禅寺湖遊覧船', d: '湖上から男体山を望む船旅', t: '観光', dur: 120, addr: '日光市中宮祠', area: 'okunikko-c', th: ['np', 'cp'], pop: 4 },
            { n: '戦場ヶ原ハイキング', d: '湿原を縦断する木道トレイル', t: '観光', dur: 180, addr: '日光市中宮祠', area: 'okunikko-c', th: ['nt', 'np', 'ex'], pop: 5 },
            { n: '竜頭の滝', d: '紅葉の名所として知られる二条の滝', t: '観光', dur: 60, addr: '日光市中宮祠', area: 'okunikko-c', th: ['np', 'nt'], pop: 5 },
            { n: '湯滝', d: '湯ノ湖から流れ落ちる柱状節理の滝', t: '観光', dur: 60, addr: '日光市湯元', area: 'okunikko-c', th: ['np', 'nt'], pop: 4 },
            { n: '湯元温泉', d: '硫黄泉が流れる奥日光の湯治場', t: '観光', dur: 90, addr: '日光市湯元', area: 'okunikko-c', th: ['on', 'cp'], pop: 5 },
            { n: 'いろは坂', d: 'カーブ48個の紅葉ドライブルート', t: '観光', dur: 60, addr: '日光市中宮祠', area: 'okunikko-c', th: ['np', 'ex'], pop: 5 },
            { n: '湯波料理', d: '日光門前町から続く伝統食', t: 'グルメ', dur: 90, addr: '日光市内', area: 'okunikko-c', th: ['gm', 'hs'], pop: 5 },
        ],
        hotels: [
            { n: '中禅寺金谷ホテル', addr: '日光市中宮祠', area: 'okunikko-c', price: 32000 },
            { n: '休暇村 日光湯元', addr: '日光市湯元', area: 'okunikko-c', price: 18000 },
        ],
    },

    // ──────────── 伊豆大島 ────────────
    {
        id: 'izu-oshima', name: '伊豆大島', country: '日本', region: 'okinawa_remote',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 40,
        themes: ['np', 'nt', 'ex', 'bc'],
        areas: [{ id: 'oshima-c', name: '伊豆大島' }],
        spots: [
            { n: '三原山', d: '直径3kmのカルデラを持つ活火山', t: '観光', dur: 240, addr: '大島町元町', area: 'oshima-c', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: '裏砂漠', d: '日本唯一砂漠と呼ばれる火山荒野', t: '観光', dur: 180, addr: '大島町', area: 'oshima-c', th: ['np', 'nt'], pop: 4 },
            { n: '波浮港', d: '火山湖が港となった景勝地', t: '観光', dur: 90, addr: '大島町波浮', area: 'oshima-c', th: ['sg', 'np', 'hs'], pop: 4 },
            { n: '地層大切断面', d: '高さ約30m続く縞模様の地層断面', t: '観光', dur: 60, addr: '大島町', area: 'oshima-c', th: ['np', 'nt'], pop: 4 },
            { n: '椿園', d: '島の島花300種類が咲き乱れる', t: '観光', dur: 90, addr: '大島町泉津', area: 'oshima-c', th: ['np', 'cp'], pop: 4 },
            { n: '元町温泉浜の湯', d: '海を望む露天の日帰り湯', t: '観光', dur: 90, addr: '大島町元町', area: 'oshima-c', th: ['on', 'np'], pop: 4 },
            { n: 'べっこう寿司', d: '島の漬け魚を使ったご当地寿司', t: 'グルメ', dur: 75, addr: '大島町内', area: 'oshima-c', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: '大島温泉ホテル', addr: '大島町元町', area: 'oshima-c', price: 18000 },
            { n: 'ホテル赤門', addr: '大島町元町', area: 'oshima-c', price: 14000 },
        ],
    },

    // ──────────── 八ヶ岳・清里 ────────────
    {
        id: 'yatsugatake-kiyosato', name: '八ヶ岳・清里', country: '日本', region: 'chubu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['np', 'nt', 'cp', 'fm', 'gm'],
        areas: [{ id: 'kiyosato', name: '清里・小淵沢' }],
        spots: [
            { n: '清泉寮', d: '高原の象徴・ソフトクリームとカフェ', t: '観光', dur: 90, addr: '北杜市高根町清里', area: 'kiyosato', th: ['gm', 'cp', 'np'], pop: 5 },
            { n: '美し森', d: '清里の代表的展望ハイク', t: '観光', dur: 90, addr: '北杜市大泉町', area: 'kiyosato', th: ['np', 'nt'], pop: 5 },
            { n: 'まきば公園', d: '八ヶ岳麓の県営牧場', t: '観光', dur: 120, addr: '北杜市大泉町', area: 'kiyosato', th: ['fm', 'np'], pop: 4 },
            { n: '吐竜の滝', d: '苔むす岩肌を流れる清流', t: '観光', dur: 60, addr: '北杜市大泉町', area: 'kiyosato', th: ['np', 'nt'], pop: 4 },
            { n: '萌木の村', d: 'メリーゴーランドのある森のリゾート', t: '観光', dur: 120, addr: '北杜市高根町清里', area: 'kiyosato', th: ['cp', 'fm', 'sp'], pop: 4 },
            { n: 'シャトレーゼ白州工場', d: 'お菓子の工場見学', t: '観光', dur: 90, addr: '北杜市白州町', area: 'kiyosato', th: ['fm', 'gm'], pop: 4 },
            { n: '尾白の森', d: '名水百選の渓谷', t: '観光', dur: 120, addr: '北杜市白州町', area: 'kiyosato', th: ['np', 'nt'], pop: 4 },
            { n: '高原野菜と地ビール', d: '清里近郊で採れた直売所食', t: 'グルメ', dur: 75, addr: '北杜市内', area: 'kiyosato', th: ['gm', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: '清里高原ホテル', addr: '北杜市高根町清里', area: 'kiyosato', price: 32000 },
            { n: 'リゾナーレ八ヶ岳', addr: '北杜市小淵沢町', area: 'kiyosato', price: 48000 },
        ],
    },

    // ──────────── 山梨ワイナリー（甲府・勝沼） ────────────
    {
        id: 'yamanashi-wine', name: '山梨ワイナリー（甲府・勝沼）', country: '日本', region: 'chubu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['gm', 'cp', 'sg', 'on', 'np'],
        areas: [
            { id: 'koshu', name: '勝沼' },
            { id: 'kofu', name: '甲府' },
        ],
        spots: [
            { n: 'シャトーメルシャン勝沼ワイナリー', d: '日本ワインの代表ワイナリー見学', t: '観光', dur: 120, addr: '甲州市勝沼町', area: 'koshu', th: ['gm', 'ex', 'sg'], pop: 5 },
            { n: 'ぶどうの丘', d: 'ワインカーヴで150種試飲', t: '観光', dur: 120, addr: '甲州市勝沼町', area: 'koshu', th: ['gm', 'cp', 'np'], pop: 5 },
            { n: 'シャトー酒折ワイナリー', d: '甲府市内の老舗ワイナリー', t: '観光', dur: 90, addr: '甲府市酒折', area: 'kofu', th: ['gm', 'ex'], pop: 4 },
            { n: '勝沼ぶどう郷駅と眺望', d: '甲府盆地を見渡す高台', t: '観光', dur: 60, addr: '甲州市勝沼町', area: 'koshu', th: ['np', 'cp'], pop: 4 },
            { n: '昇仙峡', d: '巨岩と渓谷美の景勝地', t: '観光', dur: 180, addr: '甲府市猪狩町', area: 'kofu', th: ['np', 'nt'], pop: 5 },
            { n: '武田神社', d: '武田信玄を祀る躑躅ヶ崎館跡', t: '観光', dur: 60, addr: '甲府市古府中町', area: 'kofu', th: ['sg', 'hs'], pop: 4 },
            { n: 'ほうとう（甲府）', d: '味噌仕立ての郷土麺料理', t: 'グルメ', dur: 60, addr: '甲府市内', area: 'kofu', th: ['gm', 'hs'], pop: 5 },
            { n: '石和温泉', d: '甲府盆地の代表的温泉地', t: '観光', dur: 90, addr: '笛吹市石和町', area: 'kofu', th: ['on', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'ぶどうの丘 天空の湯', addr: '甲州市勝沼町', area: 'koshu', price: 18000 },
            { n: '常磐ホテル', addr: '甲府市湯村', area: 'kofu', price: 26000 },
        ],
    },

    // ──────────── 渋温泉・地獄谷野猿 ────────────
    {
        id: 'shibu-yamanouchi', name: '渋温泉・地獄谷野猿', country: '日本', region: 'chubu',
        trip_style: 'walking', intra_mode: 'バス', intra_gap_min: 25,
        themes: ['on', 'sg', 'hs', 'np', 'cp', 'ex'],
        areas: [{ id: 'shibu', name: '渋・湯田中' }],
        spots: [
            { n: '渋温泉 九湯めぐり', d: '外湯巡りで9つの湯を回るスタンプラリー', t: '観光', dur: 180, addr: '下高井郡山ノ内町', area: 'shibu', th: ['on', 'ex'], pop: 5 },
            { n: '渋温泉 石畳の温泉街', d: '木造旅館が並ぶ古い湯治場', t: '観光', dur: 90, addr: '下高井郡山ノ内町', area: 'shibu', th: ['on', 'sg', 'cp', 'hs'], pop: 5 },
            { n: '地獄谷野猿公苑', d: '雪深い温泉に入るスノーモンキー', t: '観光', dur: 120, addr: '下高井郡山ノ内町', area: 'shibu', th: ['np', 'ex', 'fm'], pop: 5 },
            { n: '横湯川 遊歩道', d: '渓谷沿いの自然散策路', t: '観光', dur: 60, addr: '下高井郡山ノ内町', area: 'shibu', th: ['np', 'nt'], pop: 4 },
            { n: '湯田中温泉', d: '渋温泉と並ぶ歴史ある湯郷', t: '観光', dur: 90, addr: '下高井郡山ノ内町', area: 'shibu', th: ['on', 'hs'], pop: 4 },
            { n: '志賀高原', d: '高原のスキー・ハイクエリア', t: '観光', dur: 180, addr: '下高井郡山ノ内町', area: 'shibu', th: ['np', 'nt', 'ex'], pop: 4 },
            { n: '信州そば', d: 'コシのある二八蕎麦', t: 'グルメ', dur: 60, addr: '下高井郡山ノ内町', area: 'shibu', th: ['gm', 'hs'], pop: 5 },
        ],
        hotels: [
            { n: '金具屋', addr: '下高井郡山ノ内町渋温泉', area: 'shibu', price: 32000 },
            { n: '春蘭の宿 さかえや', addr: '下高井郡山ノ内町渋温泉', area: 'shibu', price: 38000 },
        ],
    },

    // ──────────── 上田・別所温泉 ────────────
    {
        id: 'ueda-bessho', name: '上田・別所温泉', country: '日本', region: 'chubu',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'hs', 'on', 'cp'],
        areas: [
            { id: 'ueda', name: '上田' },
            { id: 'bessho', name: '別所温泉' },
        ],
        spots: [
            { n: '上田城跡公園', d: '真田氏ゆかりの城跡と桜の名所', t: '観光', dur: 120, addr: '上田市二の丸', area: 'ueda', th: ['sg', 'hs'], pop: 5 },
            { n: '真田神社', d: '上田城内に鎮座する真田家の社', t: '観光', dur: 30, addr: '上田市二の丸', area: 'ueda', th: ['sg', 'hs'], pop: 4 },
            { n: '北向観音', d: '善光寺と一対の参拝地', t: '観光', dur: 60, addr: '上田市別所温泉', area: 'bessho', th: ['sg', 'hs'], pop: 4 },
            { n: '安楽寺 八角三重塔', d: '日本唯一の八角三重塔・国宝', t: '観光', dur: 60, addr: '上田市別所温泉', area: 'bessho', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '別所温泉 外湯巡り', d: '大師湯・大湯・石湯の三つの外湯', t: '観光', dur: 120, addr: '上田市別所温泉', area: 'bessho', th: ['on', 'ex'], pop: 5 },
            { n: '上田電鉄別所線', d: '千曲川の鉄橋を渡るローカル線', t: '観光', dur: 90, addr: '上田市〜別所温泉', area: 'ueda', th: ['ex', 'cp', 'sg'], pop: 4 },
            { n: '美味だれ焼鳥', d: '上田名物のニンニク醤油焼鳥', t: 'グルメ', dur: 75, addr: '上田市内', area: 'ueda', th: ['gm'], pop: 4 },
            { n: '信州そば（別所温泉）', d: '温泉街で食べる手打ち蕎麦', t: 'グルメ', dur: 60, addr: '上田市別所温泉', area: 'bessho', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: '臨泉楼 柏屋別荘', addr: '上田市別所温泉', area: 'bessho', price: 35000 },
            { n: 'かしわや本店', addr: '上田市別所温泉', area: 'bessho', price: 32000 },
        ],
    },

    // ──────────── 川治温泉・湯西川 ────────────
    {
        id: 'kawaji', name: '川治温泉・湯西川', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['on', 'hs', 'np', 'cp', 'nt'],
        areas: [
            { id: 'kawaji-c', name: '川治' },
            { id: 'yunishigawa', name: '湯西川' },
        ],
        spots: [
            { n: '川治温泉 露天風呂', d: '男鹿川と鬼怒川の合流点の温泉地', t: '観光', dur: 90, addr: '日光市川治温泉', area: 'kawaji-c', th: ['on', 'cp'], pop: 5 },
            { n: '龍王峡', d: '鬼怒川上流の渓谷ハイキング', t: '観光', dur: 180, addr: '日光市藤原', area: 'kawaji-c', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: '湯西川温泉', d: '平家落人伝説の山里の湯郷', t: '観光', dur: 90, addr: '日光市湯西川', area: 'yunishigawa', th: ['on', 'hs', 'cp'], pop: 5 },
            { n: '平家の里', d: '茅葺民家を保存した平家集落', t: '観光', dur: 90, addr: '日光市湯西川', area: 'yunishigawa', th: ['sg', 'hs'], pop: 4 },
            { n: '湯西川温泉かまくら祭り（冬）', d: '雪原に並ぶ無数のミニかまくら', t: '観光', dur: 90, addr: '日光市湯西川', area: 'yunishigawa', th: ['np', 'cp'], pop: 5, eveningOk: true },
            { n: '川治温泉 共同浴場', d: '地元住民も使う風情ある外湯', t: '観光', dur: 60, addr: '日光市川治温泉', area: 'kawaji-c', th: ['on'], pop: 3 },
            { n: '会津西街道', d: '日光から会津へ続く街道筋', t: '観光', dur: 60, addr: '日光市', area: 'kawaji-c', th: ['sg', 'hs'], pop: 3 },
            { n: '湯波・川魚料理', d: '山と渓流の幸の郷土料理', t: 'グルメ', dur: 75, addr: '日光市内', area: 'kawaji-c', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: '一柳閣本館', addr: '日光市川治温泉', area: 'kawaji-c', price: 22000 },
            { n: '伴久ホテル', addr: '日光市湯西川', area: 'yunishigawa', price: 28000 },
        ],
    },

    // ──────────── 修善寺・伊豆長岡 ────────────
    {
        id: 'shuzenji', name: '修善寺・伊豆長岡', country: '日本', region: 'chubu',
        trip_style: 'walking', intra_mode: 'バス', intra_gap_min: 25,
        themes: ['on', 'sg', 'hs', 'cp', 'np'],
        areas: [
            { id: 'shuzenji-c', name: '修善寺' },
            { id: 'iznagaoka', name: '伊豆長岡' },
        ],
        spots: [
            { n: '修禅寺', d: '弘法大師ゆかりの古刹', t: '観光', dur: 60, addr: '伊豆市修善寺', area: 'shuzenji-c', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '竹林の小径', d: '修善寺温泉街の写真スポット', t: '観光', dur: 60, addr: '伊豆市修善寺', area: 'shuzenji-c', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: '独鈷の湯', d: '修善寺発祥の伝説の足湯', t: '観光', dur: 30, addr: '伊豆市修善寺', area: 'shuzenji-c', th: ['on', 'sg', 'hs'], pop: 4 },
            { n: 'かつらぎ山ロープウェイ', d: '富士山と駿河湾を望む山頂', t: '観光', dur: 120, addr: '伊豆の国市長岡', area: 'iznagaoka', th: ['np', 'cp'], pop: 5 },
            { n: '韮山反射炉', d: '幕末の世界遺産', t: '観光', dur: 90, addr: '伊豆の国市韮山', area: 'iznagaoka', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '伊豆長岡温泉', d: '富士山を望む湯郷', t: '観光', dur: 90, addr: '伊豆の国市長岡', area: 'iznagaoka', th: ['on', 'cp'], pop: 4 },
            { n: 'わさび料理', d: '伊豆名産わさびを贅沢に使う', t: 'グルメ', dur: 75, addr: '伊豆市内', area: 'shuzenji-c', th: ['gm'], pop: 5 },
            { n: '中伊豆ワイナリーヒルズ', d: '富士山を望むワイン畑とテイスティング', t: '観光', dur: 120, addr: '伊豆市下白岩', area: 'iznagaoka', th: ['gm', 'cp', 'ex'], pop: 4 },
        ],
        hotels: [
            { n: 'あさば', addr: '伊豆市修善寺', area: 'shuzenji-c', price: 75000 },
            { n: '湯回廊 菊屋', addr: '伊豆市修善寺', area: 'shuzenji-c', price: 38000 },
        ],
    },

    // ──────────── 高崎・富岡（製糸場） ────────────
    {
        id: 'takasaki-tomioka', name: '高崎・富岡', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 35,
        themes: ['sg', 'hs', 'wh', 'gm', 'fm'],
        areas: [
            { id: 'takasaki', name: '高崎' },
            { id: 'tomioka', name: '富岡' },
        ],
        spots: [
            { n: '富岡製糸場', d: '近代産業の世界遺産・明治の工場', t: '観光', dur: 120, addr: '富岡市富岡', area: 'tomioka', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'こんにゃくパーク', d: 'こんにゃく製品の工場見学と無料試食', t: '観光', dur: 90, addr: '甘楽郡甘楽町', area: 'tomioka', th: ['fm', 'gm'], pop: 4 },
            { n: '高崎観音（白衣大観音）', d: '高さ41.8mの胎内に登れる大観音', t: '観光', dur: 60, addr: '高崎市石原町', area: 'takasaki', th: ['sg', 'np'], pop: 4 },
            { n: '少林山達磨寺', d: '高崎だるま発祥の禅寺', t: '観光', dur: 60, addr: '高崎市鼻高町', area: 'takasaki', th: ['sg', 'hs'], pop: 4 },
            { n: 'ガトーフェスタ ハラダ本社工場', d: 'ラスク工場見学とお買い物', t: '観光', dur: 60, addr: '高崎市新町', area: 'takasaki', th: ['gm', 'fm', 'sp'], pop: 5 },
            { n: '高崎パスタ', d: '日本一のパスタ街と謳う名物', t: 'グルメ', dur: 75, addr: '高崎市内', area: 'takasaki', th: ['gm'], pop: 4 },
            { n: 'こんにゃく田楽', d: '群馬名物の郷土料理', t: 'グルメ', dur: 60, addr: '富岡市内', area: 'tomioka', th: ['gm', 'hs'], pop: 4 },
            { n: '妙義山', d: '荒々しい奇岩のシルエットの名山', t: '観光', dur: 180, addr: '富岡市妙義町', area: 'tomioka', th: ['np', 'nt', 'ex'], pop: 4 },
        ],
        hotels: [
            { n: 'ホテルメトロポリタン高崎', addr: '高崎市八島町', area: 'takasaki', price: 15000 },
            { n: '磯部温泉 ホテル磯部ガーデン', addr: '安中市磯部', area: 'tomioka', price: 22000 },
        ],
    },
]
