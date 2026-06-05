/**
 * 目的地名 → Wikipedia の代表画像 URL を取得して JSON に保存するスクリプト。
 *
 * 実行: npx ts-node scripts/fetch-destination-images.ts
 * 出力: src/lib/destinationImages.json
 *
 * Wikipedia REST API（無料・API キー不要・CORS 対応）を使う。
 * 取得した URL は upload.wikimedia.org のサムネイル。
 */
import * as fs from 'fs'
import * as path from 'path'

// 目的地名 → Wikipedia 記事タイトル（曖昧避け）
// 部分一致もサポートするので、複数都市を含むツアー名は最初に見つかった単独都市名にマップされる
const WIKI_ARTICLES: Record<string, string> = {
    // 北海道
    '札幌': '札幌市', '札幌・小樽': '小樽市', '小樽': '小樽市',
    '函館': '函館市', '旭川': '旭川市', '旭川・富良野': '富良野市',
    '富良野': '富良野市', '知床': '知床国立公園',
    // 東北
    '青森': '青森市', '弘前': '弘前市', '秋田': '秋田市',
    '秋田・男鹿': '男鹿半島', '仙台': '仙台市', '山形': '山形市',
    '山形・蔵王': '蔵王連峰', '蔵王': '蔵王連峰',
    '会津': '会津若松市', '会津若松・大内宿': '大内宿',
    '銀山温泉': '銀山温泉', '角館・乳頭温泉': '角館',
    // 関東
    '東京': '東京都', '横浜': '横浜市', '鎌倉': '鎌倉市',
    '横須賀・三浦半島': '三浦半島', '箱根': '箱根町',
    '河口湖・富士山周辺': '富士山', '富士山周辺': '富士山',
    '日光': '日光市', '草津温泉': '草津温泉', '那須・鬼怒川': '那須町',
    '軽井沢': '軽井沢町', '秩父・川越・長瀞': '川越市',
    // 中部
    '名古屋': '名古屋市', '高山・白川郷': '白川郷',
    '高山': '高山市', '白川郷': '白川郷', '伊豆': '伊豆半島',
    '浜松・浜名湖': '浜名湖', '善光寺・長野': '善光寺',
    '上高地・乗鞍': '上高地', '諏訪・茅野': '諏訪湖',
    '富士山': '富士山', '黒部立山アルペンルート': '立山黒部アルペンルート',
    // 北陸
    '金沢': '金沢市', '能登半島': '能登半島',
    '佐渡島': '佐渡島', '佐渡': '佐渡島',
    '越後湯沢・苗場': '越後湯沢駅',
    // 関西
    '京都': '京都市', '大阪': '大阪市', '神戸': '神戸市', '奈良': '奈良市',
    '滋賀（彦根・近江八幡）': '彦根城',
    '伊勢神宮・志摩': '伊勢神宮', '熊野古道': '熊野古道',
    '高野山': '高野山', '吉野山': '吉野山',
    '姫路': '姫路城', '城崎温泉・天橋立': '天橋立',
    '淡路島': '淡路島',
    // 中国
    '広島・宮島': '厳島神社', '広島': '広島市', '倉敷': '倉敷市',
    '出雲・松江': '出雲大社', '出雲': '出雲大社', '松江': '松江城',
    '鳥取砂丘・三朝': '鳥取砂丘', '萩・津和野': '萩市',
    '下関・関門': '関門海峡',
    // 四国
    '高松・琴平': '金刀比羅宮', '徳島・祖谷渓': '祖谷渓',
    '高知': '高知市', '松山・道後': '道後温泉',
    '直島・瀬戸内': '直島町', 'しまなみ海道': 'しまなみ海道',
    '小豆島': '小豆島',
    // 九州
    '福岡': '福岡市', '福岡・博多': '福岡市', '長崎': '長崎市',
    '熊本・阿蘇': '阿蘇山', '別府・由布院': '由布院温泉',
    '宮崎・日南': '日南海岸', '鹿児島': '桜島',
    '嬉野・唐津': '嬉野温泉', '高千穂峡': '高千穂峡',
    '屋久島': '屋久島', '五島列島': '五島列島',
    // 沖縄
    '沖縄': '沖縄県', '沖縄本島': '沖縄本島',
    '石垣島': '石垣島', '宮古島': '宮古島',
    '奄美大島': '奄美大島', '慶良間諸島': '慶良間諸島',

    // ─── 海外 ───
    // 東アジア
    'ソウル': 'ソウル特別市', '釜山': '釜山広域市',
    '済州島': '済州特別自治道', '台北': '台北市', '高雄': '高雄市',
    '香港': '香港', '上海': '上海市', '北京': '北京市',
    '桂林・陽朔': '桂林市', '成都・九寨溝': '九寨溝',
    // 東南アジア
    'バンコク': 'バンコク', 'チェンマイ': 'チエンマイ',
    'シンガポール': 'シンガポール', 'クアラルンプール': 'クアラルンプール',
    'バリ': 'バリ州', 'バリ島': 'バリ島',
    'ハノイ': 'ハノイ', 'ホーチミン': 'ホーチミン市',
    'ダナン・ホイアン': 'ホイアン', 'マニラ': 'マニラ',
    'シェムリアップ・アンコール': 'アンコール・ワット',
    // 南アジア
    'インド・ゴールデントライアングル': 'タージ・マハル',
    'スリランカ': 'シーギリヤ',
    'ネパール': 'カトマンズ', 'ブータン': 'パロ・ゾン',
    // 西欧
    'パリ': 'パリ', 'ロンドン': 'ロンドン', 'ローマ': 'ローマ',
    'フィレンツェ': 'フィレンツェ', 'ベネチア': 'ヴェネツィア',
    'ミラノ': 'ミラノ', '南イタリア': 'アマルフィ海岸',
    'シチリア': 'タオルミーナ',
    'バルセロナ': 'バルセロナ', 'マドリード': 'マドリード',
    'リスボン': 'リスボン', 'ポルト': 'ポルト',
    'アムステルダム': 'アムステルダム', 'プラハ': 'プラハ',
    'ウィーン': 'ウィーン', 'ザルツブルク': 'ザルツブルク',
    'ブダペスト': 'ブダペスト', 'ベルリン': 'ベルリン',
    'コペンハーゲン': 'コペンハーゲン', 'ストックホルム': 'ストックホルム',
    'アイスランド': 'レイキャヴィーク', 'スイス': 'ツェルマット',
    'クロアチア': 'ドゥブロヴニク', 'トルコ': 'カッパドキア',
    'ギリシャ': 'サントリーニ島', 'スコットランド': 'エディンバラ',
    'ロヴァニエミ': 'ロヴァニエミ',
    'ノルウェー・フィヨルド': 'ガイランゲルフィヨルド',
    'アイルランド': 'ダブリン', 'ポーランド': 'クラクフ',
    // 北米
    'ニューヨーク': 'ニューヨーク', 'ロサンゼルス': 'ロサンゼルス',
    'サンフランシスコ': 'サンフランシスコ', 'ボストン・ワシントンDC': 'ワシントンD.C.',
    'シカゴ': 'シカゴ', 'グランドサークル': 'グランドキャニオン',
    'ハワイ・オアフ島': 'ワイキキ', 'ハワイ': 'ワイキキ',
    'グアム': 'グアム', 'カナディアンロッキー': 'バンフ国立公園',
    'アラスカ': 'デナリ国立公園',
    'トロント・ナイアガラ': 'ナイアガラの滝',
    'モントリオール・ケベック': 'ケベック・シティー',
    'プリンスエドワード島': 'プリンスエドワードアイランド州',
    // 中南米
    'カンクン・リビエラマヤ': 'カンクン',
    'マチュピチュ・クスコ': 'マチュ・ピチュ',
    'ペルー（マチュピチュ・クスコ）': 'マチュ・ピチュ',
    'ウユニ塩湖': 'ウユニ塩湖', 'ガラパゴス諸島': 'ガラパゴス諸島',
    'ハバナ': 'ハバナ', 'ハバナ（キューバ）': 'ハバナ',
    'リオデジャネイロ': 'リオデジャネイロ',
    'イグアスの滝': 'イグアスの滝',
    'ブエノスアイレス': 'ブエノスアイレス',
    'パタゴニア': 'ペリト・モレノ氷河',
    'イースター島': 'モアイ',
    'コスタリカ': 'アレナル火山',
    'カルタヘナ・コロンビア': 'カルタヘナ_(コロンビア)',
    'アマゾン（マナウス）': 'マナウス',
    // オセアニア
    'シドニー': 'シドニー', 'メルボルン': 'メルボルン',
    'ニュージーランド': 'ミルフォードサウンド',
    'ケアンズ・GBR': 'グレートバリアリーフ',
    // 中東・アフリカ
    'ドバイ': 'ブルジュ・ハリファ', 'エジプト': 'ギーザ',
    'モロッコ': 'マラケシュ', 'ヨルダン': 'ペトラ',
    'ケニア・タンザニアサファリ': 'マサイマラ国立保護区',
    '南アフリカ（ケープタウン）': 'テーブルマウンテン',
    'ナミビア（ナミブ砂漠）': 'ナミブ砂漠',
    'タンザニア・ザンジバル': 'セレンゲティ国立公園',
    'マダガスカル': 'バオバブ',
    'ヴィクトリアの滝': 'ヴィクトリアの滝',
    'モーリシャス': 'モーリシャス', 'イスラエル': 'エルサレム',
    // 島々
    'モルディブ': 'モルディブ',
    'タヒチ・ボラボラ': 'ボラボラ島',
    'ボラボラ': 'ボラボラ島', 'セーシェル': 'セーシェル',
    'サントリーニ': 'サントリーニ島',
    'インド大周遊（ゴールデントライアングル＋バラナシ）': 'ヴァーラーナシー',
    'バラナシ・ガンジス川': 'ヴァーラーナシー',
    'ケララ・南インド': 'ケーララ州',
    'モンゴル': 'ウランバートル',
}

interface WikiSummary {
    thumbnail?: { source: string; width: number; height: number }
    originalimage?: { source: string; width: number; height: number }
    description?: string
}

async function fetchWikiImageOnce(article: string, lang: 'ja' | 'en'): Promise<string | null> {
    try {
        const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article)}`
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'TripServiceMVP/1.0 (https://github.com/naotoo-ui/trip-service-mvp) contact: dev@example.com',
                'Accept': 'application/json',
            },
        })
        if (!res.ok) return null
        const data = await res.json() as WikiSummary
        return data.thumbnail?.source ?? data.originalimage?.source ?? null
    } catch {
        return null
    }
}

// 日本語 → 英語の有名地名対応（日本語版で見つからない時のフォールバック）
const JA_TO_EN: Record<string, string> = {
    'シドニー': 'Sydney', 'メルボルン': 'Melbourne',
    'マラケシュ': 'Marrakesh', 'カイロ': 'Cairo',
    'ペトラ': 'Petra', 'エルサレム': 'Jerusalem',
    'マサイマラ国立保護区': 'Maasai Mara', 'セレンゲティ国立公園': 'Serengeti',
    'テーブルマウンテン': 'Table Mountain', 'ナミブ砂漠': 'Namib Desert',
    'ヴィクトリアの滝': 'Victoria Falls', 'バオバブ': 'Avenue of the Baobabs',
    'モーリシャス': 'Mauritius', 'モルディブ': 'Maldives',
    'ボラボラ島': 'Bora Bora', 'セーシェル': 'Seychelles',
    'サントリーニ島': 'Santorini',
    'マナウス': 'Manaus', 'ガラパゴス諸島': 'Galápagos Islands',
    'ペリト・モレノ氷河': 'Perito Moreno Glacier',
    'モアイ': 'Moai', 'アレナル火山': 'Arenal Volcano',
    'カルタヘナ_(コロンビア)': 'Cartagena, Colombia',
    'リオデジャネイロ': 'Rio de Janeiro', 'イグアスの滝': 'Iguazu Falls',
    'ブエノスアイレス': 'Buenos Aires', 'ハバナ': 'Havana',
    'マチュ・ピチュ': 'Machu Picchu', 'ウユニ塩湖': 'Salar de Uyuni',
    'バンフ国立公園': 'Banff National Park', 'デナリ国立公園': 'Denali National Park',
    'ナイアガラの滝': 'Niagara Falls', 'ケベック・シティー': 'Quebec City',
    'プリンスエドワードアイランド州': 'Prince Edward Island',
    'グランドキャニオン': 'Grand Canyon',
    'ワイキキ': 'Waikiki', 'グアム': 'Guam',
    'カンクン': 'Cancún', 'グレートバリアリーフ': 'Great Barrier Reef',
    'ミルフォードサウンド': 'Milford Sound', 'ブルジュ・ハリファ': 'Burj Khalifa',
    'ギーザ': 'Giza Pyramid Complex',
    'カトマンズ': 'Kathmandu', 'パロ・ゾン': 'Paro Taktsang',
    'タージ・マハル': 'Taj Mahal', 'シーギリヤ': 'Sigiriya',
    'ヴァーラーナシー': 'Varanasi', 'ケーララ州': 'Kerala',
    'ウランバートル': 'Ulaanbaatar', 'アンコール・ワット': 'Angkor Wat',
    'ホイアン': 'Hội An', 'ボラカイ': 'Boracay',
    'ロヴァニエミ': 'Rovaniemi', 'ガイランゲルフィヨルド': 'Geirangerfjord',
    'ダブリン': 'Dublin', 'クラクフ': 'Kraków',
    'ドゥブロヴニク': 'Dubrovnik', 'カッパドキア': 'Cappadocia',
    'エディンバラ': 'Edinburgh', 'ツェルマット': 'Zermatt',
    'レイキャヴィーク': 'Reykjavík', 'アマルフィ海岸': 'Amalfi Coast',
    'タオルミーナ': 'Taormina', 'ヴェネツィア': 'Venice',
    'フィレンツェ': 'Florence',
}

async function fetchWikiImage(article: string): Promise<string | null> {
    // 1) 日本語版を試す
    let img = await fetchWikiImageOnce(article, 'ja')
    if (img) return img
    // 2) 英語版にフォールバック
    const enTitle = JA_TO_EN[article] ?? article
    img = await fetchWikiImageOnce(enTitle, 'en')
    return img
}

// Wikimedia の thumbnail URL を望むサイズに調整
// 例: .../320px-XXX.jpg → .../800px-XXX.jpg
function resizeUrl(url: string, sizePx: number): string {
    return url.replace(/\/\d+px-/, `/${sizePx}px-`)
}

async function main() {
    const result: Record<string, string> = {}
    let success = 0
    let failed = 0
    const entries = Object.entries(WIKI_ARTICLES)
    console.log(`Fetching ${entries.length} destination images from Wikipedia...`)
    for (const [dest, article] of entries) {
        process.stdout.write(`  ${dest} → ${article} ... `)
        const url = await fetchWikiImage(article)
        if (url) {
            // 800px に統一（カード用に十分・モバイル軽量）
            result[dest] = resizeUrl(url, 800)
            console.log('✓')
            success++
        } else {
            console.log('✗')
            failed++
        }
        // Wikipedia 側に優しく：200ms 待機
        await new Promise(r => setTimeout(r, 200))
    }

    const outPath = path.join(__dirname, '..', 'src', 'lib', 'destinationImages.json')
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8')
    console.log(`\n✓ Success: ${success} / Failed: ${failed}`)
    console.log(`Saved to ${outPath}`)
}

main().catch(e => { console.error(e); process.exit(1) })
