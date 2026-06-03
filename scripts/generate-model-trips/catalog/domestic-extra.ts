import type { DestinationEntry } from '../types'

// 国内 追加カタログ：既存に含まれていない目的地を順次ここに追加していく
// （奈良・鹿児島・宮崎・松山道後・徳島・小豆島・佐渡・能登・しまなみ・五島列島など）

export const DOMESTIC_EXTRA: DestinationEntry[] = [
    // ──────────── 奈良 ────────────
    {
        id: 'nara', name: '奈良', country: '日本', region: 'kansai',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['sg', 'hs', 'wh', 'cp', 'fm'],
        areas: [
            { id: 'nara-c', name: '奈良公園エリア' },
            { id: 'nishinokyo', name: '西ノ京' },
            { id: 'asuka', name: '飛鳥' },
        ],
        spots: [
            { n: '東大寺・大仏殿', d: '世界最大級の木造建築と大仏', t: '観光', dur: 90, addr: '奈良市雑司町', area: 'nara-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '奈良公園・鹿', d: '1000頭以上の野生鹿と古都の風景', t: '観光', dur: 60, addr: '奈良市春日野町', area: 'nara-c', th: ['sg', 'fm', 'np'], pop: 5 },
            { n: '春日大社', d: '朱の社殿と万葉植物園・世界遺産', t: '観光', dur: 75, addr: '奈良市春日野町', area: 'nara-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '興福寺・五重塔', d: '猿沢池に映る五重塔', t: '観光', dur: 60, addr: '奈良市登大路町', area: 'nara-c', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '法隆寺', d: '世界最古の木造建築群（世界遺産）', t: '観光', dur: 90, addr: '生駒郡斑鳩町', area: 'nishinokyo', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '薬師寺', d: '白鳳文化を代表する世界遺産', t: '観光', dur: 60, addr: '奈良市西ノ京町', area: 'nishinokyo', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: '唐招提寺', d: '鑑真和上ゆかりの世界遺産', t: '観光', dur: 60, addr: '奈良市五条町', area: 'nishinokyo', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: 'ならまち', d: '町家が並ぶ古い街並みのカフェ街', t: '観光', dur: 75, addr: '奈良市中院町', area: 'nara-c', th: ['sg', 'cp', 'gm'], pop: 4 },
            { n: '若草山', d: '奈良盆地を一望できる芝生の山', t: '観光', dur: 60, addr: '奈良市雑司町', area: 'nara-c', th: ['np', 'cp'], pop: 3 },
            { n: '飛鳥・石舞台古墳', d: '古代史最大の謎、巨石遺構', t: '観光', dur: 60, addr: '高市郡明日香村', area: 'asuka', th: ['sg', 'hs'], pop: 3 },
            { n: '大神神社', d: '日本最古の神社のひとつ', t: '観光', dur: 60, addr: '桜井市三輪', area: 'asuka', th: ['sg', 'hs'], pop: 2 },
            { n: '茶のしずく カフェ', d: 'ならまちのおしゃれカフェ', t: 'グルメ', dur: 45, addr: '奈良市中院町', area: 'nara-c', th: ['gm', 'cp'], pop: 3 },
            { n: '志津香 大仏前店', d: '名物釜飯の老舗', t: 'グルメ', dur: 60, addr: '奈良市春日野町', area: 'nara-c', th: ['gm', 'hs'], pop: 4 },
            { n: '中谷堂 高速もちつき', d: 'よもぎ餅の名店', t: 'グルメ', dur: 30, addr: '奈良市橋本町', area: 'nara-c', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: '奈良ホテル', addr: '奈良市高畑町', area: 'nara-c', price: 36000 },
            { n: 'JWマリオット・ホテル奈良', addr: '奈良市三条大路', area: 'nara-c', price: 48000 },
            { n: 'ふふ奈良', addr: '奈良市高畑町', area: 'nara-c', price: 78000 },
        ],
        titleHints: {
            sg: ['奈良の世界遺産巡り'],
            hs: ['古都歴史散策'],
            wh: ['世界遺産を巡る'],
            fm: ['鹿と触れ合う家族旅'],
        },
    },

    // ──────────── 鹿児島 ────────────
    {
        id: 'kagoshima', name: '鹿児島', country: '日本', region: 'kyushu',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'np', 'on', 'gm'],
        areas: [
            { id: 'kagoshima-c', name: '鹿児島市内' },
            { id: 'ibusuki', name: '指宿' },
            { id: 'kirishima', name: '霧島' },
        ],
        spots: [
            { n: '桜島', d: '活火山の絶景・フェリーで渡れる', t: '観光', dur: 180, addr: '鹿児島市桜島', area: 'kagoshima-c', th: ['sg', 'np'], pop: 5 },
            { n: '仙巌園', d: '島津家別邸と桜島眺望', t: '観光', dur: 90, addr: '鹿児島市吉野町', area: 'kagoshima-c', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '城山展望台', d: '鹿児島市内と桜島を一望', t: '観光', dur: 45, addr: '鹿児島市城山町', area: 'kagoshima-c', th: ['np', 'sg'], pop: 4 },
            { n: '指宿砂むし温泉', d: '世界唯一の天然砂むし風呂', t: '観光', dur: 90, addr: '指宿市湯の浜', area: 'ibusuki', th: ['on', 'sg'], pop: 5 },
            { n: '池田湖', d: '九州最大のカルデラ湖と開聞岳', t: '観光', dur: 60, addr: '指宿市池田', area: 'ibusuki', th: ['np'], pop: 3 },
            { n: '開聞岳', d: '薩摩富士と呼ばれる秀峰', t: '観光', dur: 60, addr: '指宿市開聞', area: 'ibusuki', th: ['np', 'nt'], pop: 4 },
            { n: '霧島神宮', d: '神話のふるさと・パワースポット', t: '観光', dur: 75, addr: '霧島市霧島田口', area: 'kirishima', th: ['sg', 'hs'], pop: 4 },
            { n: '霧島温泉郷', d: '硫黄香る山中の名湯', t: '観光', dur: 120, addr: '霧島市霧島田口', area: 'kirishima', th: ['on', 'cp'], pop: 4 },
            { n: '知覧特攻平和会館', d: '戦争の記憶を伝える資料館', t: '観光', dur: 90, addr: '南九州市知覧町郡', area: 'ibusuki', th: ['sg', 'hs'], pop: 3 },
            { n: '黒豚しゃぶしゃぶ あぢもり', d: '鹿児島黒豚の名店', t: 'グルメ', dur: 90, addr: '鹿児島市千日町', area: 'kagoshima-c', th: ['gm'], pop: 4 },
            { n: 'むじゃき本店 白くま', d: '鹿児島名物の巨大かき氷', t: 'グルメ', dur: 45, addr: '鹿児島市千日町', area: 'kagoshima-c', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: '指宿白水館', addr: '指宿市東方', area: 'ibusuki', price: 38000 },
            { n: '城山ホテル鹿児島', addr: '鹿児島市新照院町', area: 'kagoshima-c', price: 32000 },
            { n: '霧島ホテル', addr: '霧島市牧園町', area: 'kirishima', price: 28000 },
        ],
    },

    // ──────────── 松山・道後 ────────────
    {
        id: 'matsuyama-dogo', name: '松山・道後', country: '日本', region: 'shikoku',
        trip_style: 'public_transit', intra_mode: '電車', intra_gap_min: 25,
        themes: ['on', 'hs', 'cp', 'sg'],
        areas: [
            { id: 'matsuyama-c', name: '松山市内' },
            { id: 'dogo', name: '道後温泉' },
        ],
        spots: [
            { n: '道後温泉本館', d: '日本最古の温泉・千と千尋のモデル', t: '観光', dur: 90, addr: '松山市道後湯之町', area: 'dogo', th: ['on', 'hs', 'sg'], pop: 5 },
            { n: '道後温泉街散策', d: '坊ちゃん列車と商店街', t: '観光', dur: 75, addr: '松山市道後', area: 'dogo', th: ['sg', 'cp'], pop: 4 },
            { n: '松山城', d: '現存12天守のひとつ・ロープウェイ', t: '観光', dur: 120, addr: '松山市丸之内', area: 'matsuyama-c', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '坂の上の雲ミュージアム', d: '司馬遼太郎の小説を辿る', t: '観光', dur: 75, addr: '松山市一番町', area: 'matsuyama-c', th: ['sg', 'hs'], pop: 3 },
            { n: '萬翠荘', d: '大正レトロ建築', t: '観光', dur: 45, addr: '松山市一番町', area: 'matsuyama-c', th: ['sg', 'hs', 'cp'], pop: 3 },
            { n: '飛鳥乃湯泉', d: '道後の新しい温泉施設', t: '観光', dur: 90, addr: '松山市道後', area: 'dogo', th: ['on', 'cp'], pop: 3 },
            { n: '愛媛みかんスイーツ', d: '道後の名物みかん菓子', t: 'グルメ', dur: 30, addr: '松山市道後', area: 'dogo', th: ['gm', 'cp'], pop: 3 },
            { n: '鯛めし 秋嘉', d: '愛媛名物の鯛めし', t: 'グルメ', dur: 60, addr: '松山市道後', area: 'dogo', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: '道後温泉 ふなや', addr: '松山市道後湯之町', area: 'dogo', price: 38000 },
            { n: '道後グランドホテル', addr: '松山市道後鷺谷町', area: 'dogo', price: 26000 },
            { n: 'ANAクラウンプラザホテル松山', addr: '松山市一番町', area: 'matsuyama-c', price: 18000 },
        ],
    },

    // ──────────── しまなみ海道（尾道・今治） ────────────
    {
        id: 'shimanami', name: 'しまなみ海道', country: '日本', region: 'chugoku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 30,
        themes: ['np', 'cp', 'ex', 'nt'],
        areas: [
            { id: 'onomichi', name: '尾道' },
            { id: 'imabari', name: '今治' },
            { id: 'islands', name: 'しまなみ島々' },
        ],
        spots: [
            { n: '尾道千光寺公園', d: '尾道水道を見下ろす絶景公園', t: '観光', dur: 90, addr: '尾道市東土堂町', area: 'onomichi', th: ['np', 'sg'], pop: 5 },
            { n: '千光寺', d: '尾道を代表する寺・鐘楼', t: '観光', dur: 60, addr: '尾道市東土堂町', area: 'onomichi', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '尾道商店街', d: '本通りのレトロな商店街', t: '観光', dur: 75, addr: '尾道市土堂', area: 'onomichi', th: ['sg', 'gm', 'cp'], pop: 4 },
            { n: 'しまなみ海道サイクリング', d: '島々を渡るサイクリングロード', t: '観光', dur: 360, addr: '尾道〜今治', area: 'islands', th: ['ex', 'np', 'nt'], pop: 5 },
            { n: '生口島・耕三寺', d: '色鮮やかな堂塔と未来心の丘', t: '観光', dur: 120, addr: '尾道市瀬戸田町', area: 'islands', th: ['sg', 'np', 'ar'], pop: 4 },
            { n: '大山祇神社', d: '日本総鎮守の海の神様', t: '観光', dur: 60, addr: '今治市大三島町', area: 'islands', th: ['sg', 'hs'], pop: 3 },
            { n: '来島海峡大橋', d: '三連吊り橋の絶景', t: '観光', dur: 45, addr: '今治市波止浜', area: 'imabari', th: ['np', 'sg'], pop: 4 },
            { n: '今治タオル本店', d: '世界ブランドの工場直販', t: '観光', dur: 60, addr: '今治市本町', area: 'imabari', th: ['sp', 'sg'], pop: 3 },
            { n: '尾道ラーメン 朱華園', d: '尾道ラーメンの代表', t: 'グルメ', dur: 45, addr: '尾道市十四日元町', area: 'onomichi', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'ONOMICHI U2', addr: '尾道市西御所町', area: 'onomichi', price: 22000 },
            { n: 'NIPPONIA HOTEL 大三島', addr: '今治市大三島町', area: 'islands', price: 32000 },
            { n: 'グリーンホテル今治', addr: '今治市本町', area: 'imabari', price: 12000 },
        ],
    },

    // ──────────── 五島列島 ────────────
    {
        id: 'goto-islands', name: '五島列島', country: '日本', region: 'kyushu',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'wh', 'sg', 'nt'],
        areas: [
            { id: 'fukue', name: '福江島' },
            { id: 'naka-doi', name: '中通島' },
        ],
        spots: [
            { n: '高浜海水浴場', d: '日本一美しい砂浜と称される白浜', t: '観光', dur: 120, addr: '五島市三井楽町', area: 'fukue', th: ['bc', 'np', 'cp'], pop: 5 },
            { n: '頭ヶ島の白い教会', d: '世界遺産の隠れキリシタン教会', t: '観光', dur: 60, addr: '南松浦郡新上五島町', area: 'naka-doi', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '堂崎教会', d: '五島で最古の聖堂', t: '観光', dur: 60, addr: '五島市奥浦町', area: 'fukue', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '大瀬埼灯台', d: '東シナ海を見渡す絶景灯台', t: '観光', dur: 75, addr: '五島市玉之浦町', area: 'fukue', th: ['np', 'sg'], pop: 4 },
            { n: '鬼岳', d: '草原と火山地形のシンボル', t: '観光', dur: 90, addr: '五島市上大津町', area: 'fukue', th: ['np', 'nt'], pop: 4 },
            { n: '青砂ヶ浦天主堂', d: '美しいレンガ造りの教会', t: '観光', dur: 45, addr: '南松浦郡新上五島町', area: 'naka-doi', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: '五島うどん 中本製麺', d: '名物五島うどん', t: 'グルメ', dur: 60, addr: '五島市福江町', area: 'fukue', th: ['gm'], pop: 3 },
            { n: '福江島の海鮮丼', d: '新鮮な五島の魚', t: 'グルメ', dur: 60, addr: '五島市福江町', area: 'fukue', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: '五島コンカナ王国ワイナリー&リゾート', addr: '五島市上大津町', area: 'fukue', price: 28000 },
            { n: '五島列島リゾートホテル マルゲリータ', addr: '五島市浜町', area: 'fukue', price: 22000 },
            { n: '矢堅目の宿', addr: '南松浦郡新上五島町', area: 'naka-doi', price: 18000 },
        ],
    },

    // ──────────── 佐渡島 ────────────
    {
        id: 'sado', name: '佐渡島', country: '日本', region: 'hokuriku',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'hs', 'sg', 'ex'],
        areas: [
            { id: 'ryotsu', name: '両津' },
            { id: 'aikawa', name: '相川（佐渡金山）' },
            { id: 'ogi', name: '小木' },
        ],
        spots: [
            { n: '佐渡金山', d: '江戸期最大の金鉱山遺跡', t: '観光', dur: 120, addr: '佐渡市相川下相川', area: 'aikawa', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '尖閣湾揚島遊園', d: '荒々しいリアス海岸', t: '観光', dur: 90, addr: '佐渡市北狄', area: 'aikawa', th: ['np'], pop: 4 },
            { n: '小木のたらい舟', d: '佐渡名物のたらい舟体験', t: '観光', dur: 60, addr: '佐渡市小木', area: 'ogi', th: ['ex', 'fm', 'sg'], pop: 4 },
            { n: '宿根木集落', d: '重要伝統的建造物群保存地区', t: '観光', dur: 75, addr: '佐渡市宿根木', area: 'ogi', th: ['sg', 'hs'], pop: 4 },
            { n: 'トキの森公園', d: '国際保護鳥トキの保護センター', t: '観光', dur: 90, addr: '佐渡市新穂長畝', area: 'ryotsu', th: ['sg', 'nt', 'fm'], pop: 3 },
            { n: '北沢浮遊選鉱場跡', d: '東洋一の鉱山設備の廃墟', t: '観光', dur: 60, addr: '佐渡市相川', area: 'aikawa', th: ['sg', 'np'], pop: 4 },
            { n: '佐渡米と海鮮丼', d: '日本海の幸を満喫', t: 'グルメ', dur: 60, addr: '佐渡市両津', area: 'ryotsu', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテル吾妻', addr: '佐渡市相川下戸町', area: 'aikawa', price: 18000 },
            { n: 'ホテル大佐渡', addr: '佐渡市相川鹿伏', area: 'aikawa', price: 24000 },
        ],
    },
]
