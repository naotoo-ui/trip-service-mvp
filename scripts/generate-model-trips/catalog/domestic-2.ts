import type { DestinationEntry } from '../types'

// 国内: 福岡・鎌倉・箱根・河口湖・軽井沢・日光・仙台・金沢・名古屋・広島宮島

export const DOMESTIC_PART2: DestinationEntry[] = [
    // 6. 福岡・博多
    {
        id: 'fukuoka', name: '福岡', titleAlias: '福岡・博多', country: '日本', region: 'kyushu',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'sp', 'cp'],
        areas: [
            { id: 'hakata', name: '博多' }, { id: 'tenjin', name: '天神' },
            { id: 'momochi', name: '百道浜' }, { id: 'dazaifu', name: '太宰府' },
        ],
        spots: [
            { n: '櫛田神社', d: '博多総鎮守。山笠の発祥地', t: '観光', dur: 45, addr: '博多区上川端町', area: 'hakata', th: ['sg', 'hs'], pop: 4 },
            { n: '博多キャナルシティ', d: '都市型大型商業施設', t: '観光', dur: 90, addr: '博多区住吉', area: 'hakata', th: ['sp', 'sg', 'fm'], pop: 4 },
            { n: '太宰府天満宮', d: '学問の神様・梅の名所', t: '観光', dur: 90, addr: '太宰府市宰府', area: 'dazaifu', th: ['sg', 'hs'], pop: 5 },
            { n: '九州国立博物館', d: '太宰府の現代建築ミュージアム', t: '観光', dur: 90, addr: '太宰府市石坂', area: 'dazaifu', th: ['sg', 'ar', 'hs'], pop: 3 },
            { n: '福岡タワー', d: '海辺の三角タワーと夜景', t: '観光', dur: 60, addr: '早良区百道浜', area: 'momochi', th: ['np', 'ng', 'cp'], pop: 4 },
            { n: '中洲屋台街', d: '本場の博多ラーメン屋台体験', t: 'グルメ', dur: 90, addr: '博多区中洲', area: 'hakata', th: ['gm', 'ng'], pop: 5, eveningOk: true },
            { n: '一蘭 総本店', d: 'とんこつラーメンの定番', t: 'グルメ', dur: 45, addr: '博多区中洲', area: 'hakata', th: ['gm'], pop: 4 },
            { n: 'もつ鍋 おおやま 本店', d: '博多もつ鍋の名店', t: 'グルメ', dur: 90, addr: '博多区博多駅前', area: 'hakata', th: ['gm'], pop: 5 },
            { n: '元祖博多めんたい重', d: '明太子尽くしの定食', t: 'グルメ', dur: 60, addr: '中央区西中洲', area: 'tenjin', th: ['gm'], pop: 4 },
            { n: '天神中央公園', d: '都心のオアシスとグルメスポット', t: '観光', dur: 45, addr: '中央区天神', area: 'tenjin', th: ['sg', 'sp'], pop: 3 },
            { n: '糸島ドライブ', d: '夫婦岩と海カフェの絶景', t: '観光', dur: 180, addr: '糸島市志摩', area: 'momochi', th: ['np', 'cp', 'gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ヒルトン福岡シーホーク', addr: '早良区百道浜', area: 'momochi', price: 32000 },
            { n: '博多東急REIホテル', addr: '博多区博多駅東', area: 'hakata', price: 16000 },
            { n: 'ザ・ロイヤルパークホテル 福岡', addr: '博多区博多駅前', area: 'hakata', price: 22000 },
        ],
    },

    // 7. 鎌倉
    {
        id: 'kamakura', name: '鎌倉', country: '日本', region: 'kanto',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'hs', 'cp', 'np'],
        areas: [
            { id: 'kamakura-c', name: '鎌倉中心' }, { id: 'hase', name: '長谷' }, { id: 'kitakamakura', name: '北鎌倉' },
        ],
        spots: [
            { n: '鶴岡八幡宮', d: '鎌倉武家政権の象徴・源頼朝ゆかり', t: '観光', dur: 60, addr: '鎌倉市雪ノ下', area: 'kamakura-c', th: ['sg', 'hs'], pop: 5 },
            { n: '小町通り', d: '鎌倉駅前の食べ歩きストリート', t: '観光', dur: 90, addr: '鎌倉市小町', area: 'kamakura-c', th: ['sg', 'gm', 'sp'], pop: 5 },
            { n: '高徳院・鎌倉大仏', d: '13mの青銅露座大仏', t: '観光', dur: 60, addr: '鎌倉市長谷', area: 'hase', th: ['sg', 'hs'], pop: 5 },
            { n: '長谷寺', d: 'あじさい・観音・展望台で有名', t: '観光', dur: 75, addr: '鎌倉市長谷', area: 'hase', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '報国寺・竹の庭', d: '竹林に囲まれた抹茶の名所', t: '観光', dur: 60, addr: '鎌倉市浄明寺', area: 'kamakura-c', th: ['sg', 'np', 'cp'], pop: 4 },
            { n: '建長寺', d: '日本最古の禅寺', t: '観光', dur: 75, addr: '鎌倉市山ノ内', area: 'kitakamakura', th: ['sg', 'hs'], pop: 4 },
            { n: '円覚寺', d: '北鎌倉の禅寺。漱石ゆかり', t: '観光', dur: 60, addr: '鎌倉市山ノ内', area: 'kitakamakura', th: ['sg', 'hs'], pop: 3 },
            { n: '由比ヶ浜', d: '湘南の代表的なビーチ', t: '観光', dur: 45, addr: '鎌倉市由比ガ浜', area: 'hase', th: ['np', 'cp'], pop: 3 },
            { n: '江の島・新江ノ島水族館', d: '江ノ電で行ける海の絶景', t: '観光', dur: 180, addr: '藤沢市片瀬海岸', area: 'hase', th: ['sg', 'fm', 'cp', 'np'], pop: 4 },
            { n: '極楽寺切通し', d: '歴史ある鎌倉七口の一つ', t: '観光', dur: 45, addr: '鎌倉市極楽寺', area: 'hase', th: ['sg', 'hs'], pop: 3 },
            { n: 'コクリコ クレープリー', d: '小町通りの人気クレープ', t: 'グルメ', dur: 30, addr: '鎌倉市小町', area: 'kamakura-c', th: ['gm', 'cp'], pop: 3 },
            { n: '鎌倉野菜カレー かん太くん 本店', d: '地元野菜の名物カレー', t: 'グルメ', dur: 60, addr: '鎌倉市御成町', area: 'kamakura-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '鎌倉プリンスホテル', addr: '鎌倉市七里ガ浜東', area: 'hase', price: 28000 },
            { n: '鎌倉プラザホテル', addr: '鎌倉市大船', area: 'kamakura-c', price: 14000 },
        ],
    },

    // 8. 箱根
    {
        id: 'hakone', name: '箱根', country: '日本', region: 'kanto',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 35,
        themes: ['on', 'cp', 'np', 'ar', 'sg'],
        areas: [
            { id: 'hakone-yumoto', name: '箱根湯本' }, { id: 'gora', name: '強羅' }, { id: 'ashinoko', name: '芦ノ湖' },
        ],
        spots: [
            { n: '箱根神社・平和の鳥居', d: '芦ノ湖に佇む朱の大鳥居', t: '観光', dur: 75, addr: '足柄下郡箱根町元箱根', area: 'ashinoko', th: ['sg', 'hs', 'cp', 'np'], pop: 5 },
            { n: '芦ノ湖海賊船', d: '海賊船で湖上クルーズ', t: '観光', dur: 75, addr: '足柄下郡箱根町元箱根', area: 'ashinoko', th: ['sg', 'fm', 'np'], pop: 4 },
            { n: '大涌谷', d: '黒たまごと噴煙の地獄谷', t: '観光', dur: 90, addr: '足柄下郡箱根町仙石原', area: 'gora', th: ['sg', 'np'], pop: 5 },
            { n: '箱根ロープウェイ', d: '大涌谷から桃源台への空中遊覧', t: '観光', dur: 75, addr: '足柄下郡箱根町', area: 'gora', th: ['np', 'cp', 'sg'], pop: 4 },
            { n: '箱根彫刻の森美術館', d: '緑の中の野外彫刻ミュージアム', t: '観光', dur: 120, addr: '足柄下郡箱根町二ノ平', area: 'gora', th: ['ar', 'cp', 'sg'], pop: 5 },
            { n: '箱根ガラスの森美術館', d: 'ヴェネチアン・グラスの幻想空間', t: '観光', dur: 90, addr: '足柄下郡箱根町仙石原', area: 'gora', th: ['ar', 'cp'], pop: 4 },
            { n: 'ポーラ美術館', d: '森の中の現代アート美術館', t: '観光', dur: 120, addr: '足柄下郡箱根町仙石原', area: 'gora', th: ['ar', 'cp'], pop: 4 },
            { n: '岡田美術館', d: '日本・東洋美術の名品', t: '観光', dur: 90, addr: '足柄下郡箱根町小涌谷', area: 'gora', th: ['ar', 'hs'], pop: 3 },
            { n: '仙石原すすき草原', d: '秋に黄金色に染まる絶景', t: '観光', dur: 45, addr: '足柄下郡箱根町仙石原', area: 'gora', th: ['np', 'cp'], pop: 4 },
            { n: '箱根湯本温泉街', d: '温泉街散策と日帰り湯', t: '観光', dur: 120, addr: '足柄下郡箱根町湯本', area: 'hakone-yumoto', th: ['on', 'sg', 'gm'], pop: 5 },
            { n: '箱根強羅公園', d: '日本初のフランス式整形庭園', t: '観光', dur: 75, addr: '足柄下郡箱根町強羅', area: 'gora', th: ['sg', 'np'], pop: 3 },
            { n: 'はつ花本店', d: '箱根名物の自然薯そば', t: 'グルメ', dur: 60, addr: '足柄下郡箱根町湯本', area: 'hakone-yumoto', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: '箱根強羅花壇', addr: '足柄下郡箱根町強羅', area: 'gora', price: 80000 },
            { n: '富士屋ホテル', addr: '足柄下郡箱根町宮ノ下', area: 'gora', price: 65000 },
            { n: '小田急 山のホテル', addr: '足柄下郡箱根町元箱根', area: 'ashinoko', price: 45000 },
            { n: '箱根湯本温泉 ホテルおかだ', addr: '足柄下郡箱根町湯本茶屋', area: 'hakone-yumoto', price: 28000 },
        ],
    },

    // 9. 河口湖・富士
    {
        id: 'fuji-kawaguchi', name: '富士山', titleAlias: '河口湖・富士山周辺', country: '日本', region: 'kanto',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'cp', 'on', 'fm', 'sg'],
        areas: [
            { id: 'kawaguchi', name: '河口湖' }, { id: 'oshino', name: '忍野' }, { id: 'fujikyu', name: '富士急エリア' },
        ],
        spots: [
            { n: '富士山五合目', d: '富士スバルラインで車で行ける山頂下', t: '観光', dur: 120, addr: '富士河口湖町富士山', area: 'kawaguchi', th: ['sg', 'np'], pop: 5 },
            { n: '河口湖大石公園', d: 'ラベンダーと富士山', t: '観光', dur: 60, addr: '富士河口湖町大石', area: 'kawaguchi', th: ['np', 'cp'], pop: 5 },
            { n: '河口湖音楽と森の美術館', d: 'オルゴール館と富士', t: '観光', dur: 90, addr: '富士河口湖町河口', area: 'kawaguchi', th: ['ar', 'cp'], pop: 3 },
            { n: '新倉山浅間公園', d: '五重塔と富士のシンメトリー', t: '観光', dur: 90, addr: '富士吉田市新倉', area: 'fujikyu', th: ['sg', 'np'], pop: 5 },
            { n: '忍野八海', d: '富士の伏流水の湧水池', t: '観光', dur: 75, addr: '南都留郡忍野村忍草', area: 'oshino', th: ['sg', 'np'], pop: 4 },
            { n: '富士急ハイランド', d: '絶叫マシンの聖地', t: '観光', dur: 600, addr: '富士吉田市新西原', area: 'fujikyu', th: ['fm', 'ex', 'cp'], pop: 5, bk: true },
            { n: '河口湖天上山公園', d: 'カチカチ山ロープウェイで絶景展望台', t: '観光', dur: 90, addr: '富士河口湖町浅川', area: 'kawaguchi', th: ['np', 'cp'], pop: 4 },
            { n: '本栖湖', d: '千円札の逆さ富士', t: '観光', dur: 60, addr: '富士河口湖町本栖', area: 'kawaguchi', th: ['np'], pop: 4 },
            { n: '西湖いやしの里根場', d: '茅葺き屋根集落と富士', t: '観光', dur: 90, addr: '富士河口湖町西湖根場', area: 'kawaguchi', th: ['sg', 'hs', 'np'], pop: 3 },
            { n: 'ほうとう不動 河口湖南店', d: '山梨名物ほうとうの名店', t: 'グルメ', dur: 60, addr: '富士河口湖町船津', area: 'kawaguchi', th: ['gm', 'hs'], pop: 5 },
            { n: '富士山温泉', d: '富士を望む日帰り温泉', t: '観光', dur: 120, addr: '富士吉田市新西原', area: 'fujikyu', th: ['on', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: '富士河口湖温泉郷 湖楽おんやど富士吟景', addr: '富士河口湖町浅川', area: 'kawaguchi', price: 32000 },
            { n: '星のや富士', addr: '富士河口湖町大石', area: 'kawaguchi', price: 88000 },
            { n: '富士マリオットホテル山中湖', addr: '南都留郡山中湖村平野', area: 'oshino', price: 26000 },
        ],
    },

    // 10. 軽井沢
    {
        id: 'karuizawa', name: '軽井沢', country: '日本', region: 'kanto',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'cp', 'sp', 'np', 'ar'],
        areas: [
            { id: 'kyu-karuizawa', name: '旧軽井沢' }, { id: 'naka-karuizawa', name: '中軽井沢' }, { id: 'minami-karuizawa', name: '南軽井沢' },
        ],
        spots: [
            { n: '旧軽井沢銀座', d: 'カフェと土産屋が並ぶメインストリート', t: '観光', dur: 90, addr: '北佐久郡軽井沢町軽井沢', area: 'kyu-karuizawa', th: ['sg', 'sp', 'cp'], pop: 5 },
            { n: '雲場池', d: '紅葉と新緑の名所、別名スワン湖', t: '観光', dur: 60, addr: '北佐久郡軽井沢町軽井沢', area: 'kyu-karuizawa', th: ['np', 'cp'], pop: 4 },
            { n: '白糸の滝', d: '森の中に広がる絹のような滝', t: '観光', dur: 60, addr: '北佐久郡軽井沢町長倉', area: 'naka-karuizawa', th: ['np', 'cp'], pop: 5 },
            { n: '聖パウロカトリック教会', d: '軽井沢を象徴する木造教会', t: '観光', dur: 30, addr: '北佐久郡軽井沢町軽井沢', area: 'kyu-karuizawa', th: ['sg', 'cp'], pop: 4 },
            { n: 'ハルニレテラス', d: '川沿いのおしゃれショッピングモール', t: '観光', dur: 120, addr: '北佐久郡軽井沢町長倉', area: 'naka-karuizawa', th: ['sp', 'gm', 'cp'], pop: 5 },
            { n: '軽井沢プリンスショッピングプラザ', d: '日本最大級のアウトレットモール', t: '観光', dur: 180, addr: '北佐久郡軽井沢町軽井沢', area: 'minami-karuizawa', th: ['sp', 'fm'], pop: 5 },
            { n: '石の教会・内村鑑三記念堂', d: '建築美術としても名高い独特の教会', t: '観光', dur: 45, addr: '北佐久郡軽井沢町星野', area: 'naka-karuizawa', th: ['cp', 'ar', 'sg'], pop: 4 },
            { n: '軽井沢高原教会', d: '森に佇むウェディング教会', t: '観光', dur: 30, addr: '北佐久郡軽井沢町星野', area: 'naka-karuizawa', th: ['cp', 'sg'], pop: 4 },
            { n: 'ムーゼの森 軽井沢絵本の森美術館', d: '絵本原画と童話の世界', t: '観光', dur: 90, addr: '北佐久郡軽井沢町長倉', area: 'minami-karuizawa', th: ['ar', 'fm', 'cp'], pop: 3 },
            { n: '万平ホテル カフェテラス', d: 'ジョン・レノンも愛した老舗の喫茶', t: 'グルメ', dur: 60, addr: '北佐久郡軽井沢町軽井沢', area: 'kyu-karuizawa', th: ['gm', 'hs', 'cp'], pop: 4 },
            { n: 'チャーチストリート軽井沢', d: '旧軽井沢のレトロな商店街モール', t: '観光', dur: 60, addr: '北佐久郡軽井沢町軽井沢', area: 'kyu-karuizawa', th: ['sp', 'cp'], pop: 3 },
            { n: 'ミカドコーヒー軽井沢店', d: '名物モカソフトの老舗', t: 'グルメ', dur: 30, addr: '北佐久郡軽井沢町軽井沢', area: 'kyu-karuizawa', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '星のや軽井沢', addr: '北佐久郡軽井沢町星野', area: 'naka-karuizawa', price: 75000 },
            { n: 'ホテルブレストンコート', addr: '北佐久郡軽井沢町星野', area: 'naka-karuizawa', price: 32000 },
            { n: '軽井沢マリオットホテル', addr: '北佐久郡軽井沢町長倉', area: 'naka-karuizawa', price: 35000 },
        ],
    },

    // 11. 日光
    {
        id: 'nikko', name: '日光', country: '日本', region: 'kanto',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 35,
        themes: ['sg', 'hs', 'wh', 'np', 'on'],
        areas: [
            { id: 'nikko-c', name: '日光中心' }, { id: 'chuzenji', name: '中禅寺湖' }, { id: 'kinugawa', name: '鬼怒川' },
        ],
        spots: [
            { n: '日光東照宮', d: '徳川家康を祀る世界遺産', t: '観光', dur: 120, addr: '日光市山内', area: 'nikko-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '日光二荒山神社', d: '東照宮隣の世界遺産', t: '観光', dur: 60, addr: '日光市山内', area: 'nikko-c', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '輪王寺・三仏堂', d: '日光山岳信仰の総本山', t: '観光', dur: 75, addr: '日光市山内', area: 'nikko-c', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '神橋', d: '大谷川に架かる朱の名橋', t: '観光', dur: 30, addr: '日光市上鉢石町', area: 'nikko-c', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '華厳の滝', d: '日本三大名瀑、97mの大瀑布', t: '観光', dur: 60, addr: '日光市中宮祠', area: 'chuzenji', th: ['np', 'sg'], pop: 5 },
            { n: '中禅寺湖遊覧船', d: '男体山を望む高原の湖', t: '観光', dur: 90, addr: '日光市中宮祠', area: 'chuzenji', th: ['np', 'sg', 'cp'], pop: 4 },
            { n: '戦場ヶ原ハイキング', d: '湿原と高原の自然散策', t: '観光', dur: 120, addr: '日光市中宮祠', area: 'chuzenji', th: ['nt', 'np'], pop: 3 },
            { n: 'いろは坂', d: '紅葉の名所として有名な山岳道路', t: '観光', dur: 45, addr: '日光市中宮祠', area: 'chuzenji', th: ['np'], pop: 4 },
            { n: '湯滝', d: '湯ノ湖から流れ落ちる瀑布', t: '観光', dur: 45, addr: '日光市湯元', area: 'chuzenji', th: ['np'], pop: 3 },
            { n: '日光金谷ホテル ティーラウンジ', d: '日本最古のリゾートホテルの喫茶', t: 'グルメ', dur: 60, addr: '日光市上鉢石町', area: 'nikko-c', th: ['gm', 'hs', 'cp'], pop: 3 },
            { n: '油源', d: '名物の日光湯波料理', t: 'グルメ', dur: 75, addr: '日光市御幸町', area: 'nikko-c', th: ['gm', 'hs'], pop: 3 },
            { n: '鬼怒川温泉ロープウェイ', d: '鬼怒川渓谷の絶景', t: '観光', dur: 90, addr: '日光市鬼怒川温泉滝', area: 'kinugawa', th: ['np', 'on', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: '日光金谷ホテル', addr: '日光市上鉢石町', area: 'nikko-c', price: 38000 },
            { n: 'リッツ・カールトン日光', addr: '日光市中宮祠', area: 'chuzenji', price: 85000 },
            { n: '鬼怒川グランドホテル夢の季', addr: '日光市鬼怒川温泉滝', area: 'kinugawa', price: 28000 },
        ],
    },

    // 12. 仙台
    {
        id: 'sendai', name: '仙台', country: '日本', region: 'tohoku',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'hs', 'cp'],
        areas: [
            { id: 'sendai-c', name: '仙台中心' }, { id: 'matsushima', name: '松島' }, { id: 'akiu', name: '秋保' },
        ],
        spots: [
            { n: '仙台城跡', d: '伊達政宗銅像と仙台市内一望', t: '観光', dur: 75, addr: '仙台市青葉区天守台', area: 'sendai-c', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '瑞鳳殿', d: '伊達政宗の絢爛豪華な霊廟', t: '観光', dur: 75, addr: '仙台市青葉区霊屋下', area: 'sendai-c', th: ['sg', 'hs'], pop: 4 },
            { n: '大崎八幡宮', d: '伊達政宗創建の国宝社殿', t: '観光', dur: 45, addr: '仙台市青葉区八幡', area: 'sendai-c', th: ['sg', 'hs'], pop: 3 },
            { n: '松島湾遊覧船', d: '日本三景・松島の絶景クルーズ', t: '観光', dur: 90, addr: '宮城郡松島町松島', area: 'matsushima', th: ['sg', 'np', 'cp'], pop: 5 },
            { n: '瑞巌寺', d: '伊達政宗ゆかりの国宝寺院', t: '観光', dur: 75, addr: '宮城郡松島町松島町内', area: 'matsushima', th: ['sg', 'hs'], pop: 4 },
            { n: '五大堂', d: '松島湾を見渡す赤い小堂', t: '観光', dur: 30, addr: '宮城郡松島町松島町内', area: 'matsushima', th: ['sg', 'hs'], pop: 4 },
            { n: '秋保大滝', d: '高さ55mの三大滝の一つ', t: '観光', dur: 60, addr: '仙台市太白区秋保町', area: 'akiu', th: ['np'], pop: 4 },
            { n: '秋保温泉街', d: '伊達家の御殿湯', t: '観光', dur: 120, addr: '仙台市太白区秋保町', area: 'akiu', th: ['on', 'cp'], pop: 4 },
            { n: '利久 東口本店', d: '本場の仙台牛タン', t: 'グルメ', dur: 60, addr: '仙台市宮城野区榴岡', area: 'sendai-c', th: ['gm'], pop: 5 },
            { n: '阿部蒲鉾店 本店', d: 'ご当地名物の笹かまぼこ', t: 'グルメ', dur: 30, addr: '仙台市青葉区中央', area: 'sendai-c', th: ['gm', 'hs'], pop: 3 },
            { n: '勝沼茶屋', d: '松島名物の牡蠣カキフライ', t: 'グルメ', dur: 60, addr: '宮城郡松島町松島', area: 'matsushima', th: ['gm'], pop: 3 },
            { n: 'ずんだ茶寮 仙台駅店', d: '仙台名物ずんだスイーツ', t: 'グルメ', dur: 30, addr: '仙台市青葉区中央', area: 'sendai-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ウェスティンホテル仙台', addr: '仙台市青葉区一番町', area: 'sendai-c', price: 32000 },
            { n: '松島センチュリーホテル', addr: '宮城郡松島町松島', area: 'matsushima', price: 24000 },
            { n: '秋保温泉 ホテルニュー水戸屋', addr: '仙台市太白区秋保町', area: 'akiu', price: 22000 },
        ],
    },

    // 13. 金沢
    {
        id: 'kanazawa', name: '金沢', country: '日本', region: 'hokuriku',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'hs', 'cp', 'ar'],
        areas: [
            { id: 'kenrokuen', name: '兼六園・21世紀' }, { id: 'higashi', name: 'ひがし茶屋街' }, { id: 'nishi', name: '西茶屋・にし' },
        ],
        spots: [
            { n: '兼六園', d: '日本三名園の一つ。四季の絶景', t: '観光', dur: 90, addr: '金沢市兼六町', area: 'kenrokuen', th: ['sg', 'hs', 'np', 'cp'], pop: 5 },
            { n: '金沢城公園', d: '加賀百万石の城跡と石川門', t: '観光', dur: 60, addr: '金沢市丸の内', area: 'kenrokuen', th: ['sg', 'hs'], pop: 4 },
            { n: '21世紀美術館', d: 'プールやアートインスタレーション', t: '観光', dur: 120, addr: '金沢市広坂', area: 'kenrokuen', th: ['ar', 'cp'], pop: 5, bk: true },
            { n: 'ひがし茶屋街', d: '伝統的な茶屋街並み（重伝建）', t: '観光', dur: 90, addr: '金沢市東山', area: 'higashi', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '主計町茶屋街', d: '浅野川沿いの静かな茶屋街', t: '観光', dur: 60, addr: '金沢市主計町', area: 'higashi', th: ['sg', 'hs'], pop: 3 },
            { n: '近江町市場', d: '加賀百万石の台所、海鮮丼の聖地', t: 'グルメ', dur: 90, addr: '金沢市上近江町', area: 'kenrokuen', th: ['gm', 'sg'], pop: 5 },
            { n: 'にし茶屋街', d: '金沢三茶屋街のひとつ', t: '観光', dur: 60, addr: '金沢市野町', area: 'nishi', th: ['sg', 'hs', 'cp'], pop: 4 },
            { n: '長町武家屋敷跡', d: '土塀と用水路の武家屋敷街', t: '観光', dur: 60, addr: '金沢市長町', area: 'kenrokuen', th: ['sg', 'hs'], pop: 4 },
            { n: '妙立寺（忍者寺）', d: '加賀藩の隠し砦のような寺院', t: '観光', dur: 60, addr: '金沢市野町', area: 'nishi', th: ['sg', 'hs'], pop: 4, bk: true },
            { n: '金沢駅 鼓門', d: '能の鼓を模した巨大門', t: '観光', dur: 30, addr: '金沢市木ノ新保町', area: 'kenrokuen', th: ['sg', 'ar'], pop: 3 },
            { n: 'もりもり寿し近江町店', d: '近江町市場の人気回転寿司', t: 'グルメ', dur: 75, addr: '金沢市青草町', area: 'kenrokuen', th: ['gm'], pop: 4 },
            { n: '箔一 東山店', d: '金箔ソフトの定番', t: 'グルメ', dur: 30, addr: '金沢市東山', area: 'higashi', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '金沢国際ホテル', addr: '金沢市奥新保町', area: 'kenrokuen', price: 18000 },
            { n: 'ハイアットセントリック金沢', addr: '金沢市広岡', area: 'kenrokuen', price: 32000 },
            { n: '金沢白鳥路ホテル山楽', addr: '金沢市丸の内', area: 'kenrokuen', price: 22000 },
        ],
    },

    // 14. 名古屋
    {
        id: 'nagoya', name: '名古屋', country: '日本', region: 'chubu',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'gm', 'fm', 'hs'],
        areas: [
            { id: 'nagoya-c', name: '名古屋中心' }, { id: 'sakae', name: '栄' }, { id: 'atsuta', name: '熱田' },
        ],
        spots: [
            { n: '名古屋城', d: '金のシャチホコと本丸御殿', t: '観光', dur: 120, addr: '名古屋市中区本丸', area: 'nagoya-c', th: ['sg', 'hs'], pop: 5 },
            { n: '熱田神宮', d: '草薙剣を祀る三種の神器の社', t: '観光', dur: 60, addr: '名古屋市熱田区神宮', area: 'atsuta', th: ['sg', 'hs'], pop: 4 },
            { n: 'トヨタ産業技術記念館', d: '産業遺産の博物館', t: '観光', dur: 120, addr: '名古屋市西区則武新町', area: 'nagoya-c', th: ['sg', 'fm', 'hs'], pop: 4 },
            { n: '名古屋港水族館', d: '日本最大級のシャチがいる水族館', t: '観光', dur: 180, addr: '名古屋市港区港町', area: 'nagoya-c', th: ['sg', 'fm'], pop: 5 },
            { n: 'リニア・鉄道館', d: 'JR東海の歴代列車を展示', t: '観光', dur: 120, addr: '名古屋市港区金城ふ頭', area: 'nagoya-c', th: ['sg', 'fm'], pop: 4 },
            { n: 'オアシス21', d: '水の宇宙船と栄のシンボル', t: '観光', dur: 45, addr: '名古屋市東区東桜', area: 'sakae', th: ['sg', 'np', 'ar'], pop: 3 },
            { n: '大須商店街', d: '名古屋の下町商店街', t: '観光', dur: 90, addr: '名古屋市中区大須', area: 'sakae', th: ['sg', 'sp', 'gm'], pop: 4 },
            { n: '徳川美術館', d: '尾張徳川家の国宝コレクション', t: '観光', dur: 90, addr: '名古屋市東区徳川町', area: 'nagoya-c', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: '矢場とん 本店', d: '名物味噌カツの元祖', t: 'グルメ', dur: 60, addr: '名古屋市中区大須', area: 'sakae', th: ['gm'], pop: 5 },
            { n: 'ひつまぶし備長 栄本店', d: 'ひつまぶし発祥の本店', t: 'グルメ', dur: 75, addr: '名古屋市中区栄', area: 'sakae', th: ['gm', 'hs'], pop: 4 },
            { n: '世界の山ちゃん 本店', d: '幻の手羽先で有名', t: 'グルメ', dur: 60, addr: '名古屋市中区栄', area: 'sakae', th: ['gm', 'ng'], pop: 4, eveningOk: true },
            { n: 'コメダ珈琲店 本店', d: 'モーニング発祥の喫茶', t: 'グルメ', dur: 45, addr: '名古屋市瑞穂区上山町', area: 'nagoya-c', th: ['gm'], pop: 3, morningOk: true },
        ],
        hotels: [
            { n: 'マリオット名古屋', addr: '名古屋市中村区名駅', area: 'nagoya-c', price: 32000 },
            { n: '名古屋東急ホテル', addr: '名古屋市中区栄', area: 'sakae', price: 25000 },
            { n: '名古屋プリンスホテル スカイタワー', addr: '名古屋市中村区平池町', area: 'nagoya-c', price: 28000 },
        ],
    },

    // 15. 広島・宮島
    {
        id: 'hiroshima-miyajima', name: '広島', titleAlias: '広島・宮島', country: '日本', region: 'chugoku',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'gm', 'hs', 'wh', 'cp'],
        areas: [
            { id: 'hiroshima-c', name: '広島市内' }, { id: 'miyajima', name: '宮島' },
        ],
        spots: [
            { n: '厳島神社', d: '海に浮かぶ大鳥居の世界遺産', t: '観光', dur: 120, addr: '廿日市市宮島町', area: 'miyajima', th: ['sg', 'hs', 'wh', 'cp', 'np'], pop: 5 },
            { n: '宮島・弥山ロープウェイ', d: '宮島の山頂から瀬戸内海絶景', t: '観光', dur: 120, addr: '廿日市市宮島町紅葉谷', area: 'miyajima', th: ['np', 'sg'], pop: 4 },
            { n: '宮島・表参道商店街', d: 'もみじ饅頭と牡蠣の食べ歩き', t: '観光', dur: 75, addr: '廿日市市宮島町', area: 'miyajima', th: ['sg', 'gm'], pop: 5 },
            { n: '原爆ドーム', d: '世界遺産の戦争遺構', t: '観光', dur: 45, addr: '広島市中区大手町', area: 'hiroshima-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '広島平和記念資料館', d: '平和の祈りを伝える資料館', t: '観光', dur: 90, addr: '広島市中区中島町', area: 'hiroshima-c', th: ['sg', 'hs'], pop: 5 },
            { n: '広島平和記念公園', d: '原爆死没者慰霊碑のある公園', t: '観光', dur: 60, addr: '広島市中区中島町', area: 'hiroshima-c', th: ['sg', 'hs'], pop: 4 },
            { n: '広島城', d: '毛利輝元築城の鯉城', t: '観光', dur: 75, addr: '広島市中区基町', area: 'hiroshima-c', th: ['sg', 'hs'], pop: 3 },
            { n: '縮景園', d: '広島藩主の大名庭園', t: '観光', dur: 60, addr: '広島市中区上幟町', area: 'hiroshima-c', th: ['sg', 'np'], pop: 3 },
            { n: 'お好み村', d: '広島風お好み焼きの店が集まる', t: 'グルメ', dur: 75, addr: '広島市中区新天地', area: 'hiroshima-c', th: ['gm'], pop: 4 },
            { n: 'みっちゃん総本店', d: '広島お好み焼きの代表', t: 'グルメ', dur: 60, addr: '広島市中区八丁堀', area: 'hiroshima-c', th: ['gm', 'hs'], pop: 5 },
            { n: 'あなごめし うえの', d: '宮島口の老舗あなごめし', t: 'グルメ', dur: 60, addr: '廿日市市宮島口', area: 'miyajima', th: ['gm', 'hs'], pop: 5 },
            { n: 'やまだ屋 宮島本店', d: 'もみじ饅頭の老舗', t: 'グルメ', dur: 30, addr: '廿日市市宮島町', area: 'miyajima', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'シェラトングランドホテル広島', addr: '広島市東区若草町', area: 'hiroshima-c', price: 28000 },
            { n: '宮島グランドホテル有もと', addr: '廿日市市宮島町', area: 'miyajima', price: 32000 },
            { n: 'ホテル聚景荘', addr: '廿日市市宮島町', area: 'miyajima', price: 22000 },
        ],
    },
]
