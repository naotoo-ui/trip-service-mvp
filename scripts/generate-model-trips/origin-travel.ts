/**
 * 出発地→目的地の現実的な移動を「Spotとして」生成する。
 * これにより旅程の1日目最初に "羽田空港→那覇空港" のような工程が必ず入り、
 * 出発地を変えた variant が中身の異なるプランになる。
 */
import type { Spot } from '../../src/types'
import type { RegionId } from './types'

type TravelDesc = {
    name: string                // "羽田空港 → 那覇空港"
    description: string         // "JAL便で約3時間。LCCならピーチも選択肢"
    duration_minutes: number
    address: string             // "東京〜沖縄"
    type: '移動' | 'その他'      // 旅程型では 移動 はないので その他 にフォールバック
}

// 国内：都市別の最寄り駅・空港
const ORIGIN_AIRPORTS: Record<string, { air: string; jr: string }> = {
    '東京': { air: '羽田空港', jr: '東京駅' },
    '神奈川': { air: '羽田空港', jr: '新横浜駅' },
    '横浜': { air: '羽田空港', jr: '新横浜駅' },
    '大阪': { air: '関西国際空港', jr: '新大阪駅' },
    '京都': { air: '関西国際空港', jr: '京都駅' },
    '名古屋': { air: '中部国際空港セントレア', jr: '名古屋駅' },
    '福岡': { air: '福岡空港', jr: '博多駅' },
    '札幌': { air: '新千歳空港', jr: '札幌駅' },
    '仙台': { air: '仙台空港', jr: '仙台駅' },
    '広島': { air: '広島空港', jr: '広島駅' },
}

// 目的地別の最寄り駅・空港
const DEST_GATEWAY: Record<string, { air: string; jr: string; airline?: string }> = {
    // 国内
    'kyoto':                 { air: '関西国際空港', jr: '京都駅' },
    'okinawa-main':          { air: '那覇空港', jr: '那覇空港', airline: 'JAL/ANA' },
    'sapporo-otaru':         { air: '新千歳空港', jr: '札幌駅', airline: 'JAL/ANA/AIRDO' },
    'tokyo':                 { air: '羽田空港', jr: '東京駅' },
    'osaka':                 { air: '関西国際空港', jr: '新大阪駅' },
    'fukuoka':               { air: '福岡空港', jr: '博多駅', airline: 'JAL/ANA/Skymark' },
    'kamakura':              { air: '羽田空港', jr: '鎌倉駅' },
    'hakone':                { air: '羽田空港', jr: '小田原駅' },
    'fuji-kawaguchi':        { air: '羽田空港', jr: '河口湖駅' },
    'karuizawa':             { air: '羽田空港', jr: '軽井沢駅' },
    'nikko':                 { air: '羽田空港', jr: '日光駅' },
    'sendai':                { air: '仙台空港', jr: '仙台駅', airline: 'JAL/ANA' },
    'kanazawa':              { air: '小松空港', jr: '金沢駅', airline: 'JAL/ANA' },
    'nagoya':                { air: '中部国際空港セントレア', jr: '名古屋駅' },
    'hiroshima-miyajima':    { air: '広島空港', jr: '広島駅', airline: 'JAL/ANA' },
    'kobe':                  { air: '神戸空港', jr: '新神戸駅' },
    'yokohama':              { air: '羽田空港', jr: '新横浜駅' },
    'kusatsu':               { air: '羽田空港', jr: '長野原草津口駅' },
    'beppu-yufuin':          { air: '大分空港', jr: '別府駅', airline: 'JAL/ANA' },
    'kumamoto-aso':          { air: '熊本空港', jr: '熊本駅', airline: 'JAL/ANA/Solaseed' },
    'kochi':                 { air: '高知龍馬空港', jr: '高知駅', airline: 'JAL/ANA' },
    'naoshima':              { air: '高松空港', jr: '岡山駅', airline: 'JAL/ANA' },
    'ishigaki':              { air: '新石垣空港', jr: '新石垣空港', airline: 'JAL/ANA/Peach' },
    'miyako':                { air: '宮古空港', jr: '宮古空港', airline: 'JAL/ANA' },
    'yakushima':             { air: '屋久島空港', jr: '屋久島空港', airline: 'JAC' },
    'hakodate':              { air: '函館空港', jr: '函館駅', airline: 'JAL/ANA/AIRDO' },
    'asahikawa-furano':      { air: '旭川空港', jr: '旭川駅', airline: 'JAL/ANA' },
    'shiretoko':             { air: '女満別空港', jr: '網走駅', airline: 'JAL/ANA' },
    'aomori':                { air: '青森空港', jr: '新青森駅', airline: 'JAL/ANA' },
    'zao':                   { air: '仙台空港', jr: '山形駅', airline: 'JAL/ANA' },
    'takayama-shirakawago':  { air: '中部国際空港セントレア', jr: '高山駅' },
    'izu':                   { air: '羽田空港', jr: '熱海駅' },
    'izumo-matsue':          { air: '出雲空港', jr: '出雲市駅', airline: 'JAL/ANA' },
    'kurashiki':             { air: '岡山空港', jr: '倉敷駅' },
    'nagasaki':              { air: '長崎空港', jr: '長崎駅', airline: 'JAL/ANA/Solaseed' },

    // 海外
    'seoul':         { air: '仁川国際空港', jr: '仁川国際空港', airline: 'JAL/ANA/大韓航空/アシアナ' },
    'busan':         { air: '金海国際空港', jr: '金海国際空港', airline: 'JAL/大韓航空/エアプサン' },
    'taipei':        { air: '台北桃園国際空港', jr: '桃園空港', airline: 'JAL/ANA/EVA/チャイナエア' },
    'kaohsiung':     { air: '高雄国際空港', jr: '高雄国際空港', airline: 'JAL/エバー航空/チャイナエア' },
    'hongkong':      { air: '香港国際空港', jr: '香港国際空港', airline: 'JAL/ANA/キャセイパシフィック' },
    'jeju':          { air: '済州国際空港', jr: '済州国際空港', airline: '大韓航空/アシアナ' },
    'bangkok':       { air: 'スワンナプーム国際空港', jr: 'スワンナプーム空港', airline: 'JAL/ANA/タイ国際航空' },
    'singapore':     { air: 'チャンギ国際空港', jr: 'チャンギ空港', airline: 'JAL/ANA/シンガポール航空' },
    'shanghai':      { air: '上海浦東国際空港', jr: '浦東空港', airline: 'JAL/ANA/中国東方航空' },
    'beijing':       { air: '北京首都国際空港', jr: '首都空港', airline: 'JAL/ANA/中国国際航空' },
    'hochiminh':     { air: 'タンソンニャット国際空港', jr: 'タンソンニャット空港', airline: 'JAL/ANA/ベトナム航空' },
    'hanoi':         { air: 'ノイバイ国際空港', jr: 'ノイバイ空港', airline: 'JAL/ANA/ベトナム航空' },
    'bali':          { air: 'デンパサール国際空港', jr: 'デンパサール空港', airline: 'ガルーダ/シンガポール経由' },
    'kl':            { air: 'クアラルンプール国際空港', jr: 'KLIA', airline: 'JAL/ANA/マレーシア航空' },
    'manila':        { air: 'ニノイ・アキノ国際空港', jr: 'マニラ空港', airline: 'JAL/ANA/フィリピン航空' },
    'paris':         { air: 'シャルル・ド・ゴール空港', jr: 'CDG空港', airline: 'JAL/ANA/エールフランス' },
    'london':        { air: 'ヒースロー空港', jr: 'LHR', airline: 'JAL/ANA/BA' },
    'rome':          { air: 'フィウミチーノ空港', jr: 'FCO', airline: 'JAL/ANA/ITAエアウェイズ' },
    'barcelona':     { air: 'バルセロナ・エル・プラット空港', jr: 'BCN', airline: 'イベリア航空/経由便' },
    'prague':        { air: 'プラハ・ヴァーツラフ・ハヴェル国際空港', jr: 'PRG', airline: '経由便（KLM/ルフトハンザ）' },
    'vienna':        { air: 'ウィーン国際空港', jr: 'VIE', airline: 'ANA/オーストリア航空' },
    'amsterdam':     { air: 'スキポール空港', jr: 'AMS', airline: 'JAL/ANA/KLM' },
    'berlin':        { air: 'ベルリン・ブランデンブルク空港', jr: 'BER', airline: 'JAL/ANA/ルフトハンザ' },
    'newyork':       { air: 'ジョン・F・ケネディ国際空港', jr: 'JFK', airline: 'JAL/ANA/AA' },
    'la':            { air: 'ロサンゼルス国際空港', jr: 'LAX', airline: 'JAL/ANA/AA' },
    'hawaii-oahu':   { air: 'ダニエル・K・イノウエ国際空港', jr: 'ホノルル空港', airline: 'JAL/ANA/ハワイアン航空' },
    'guam':          { air: 'グアム国際空港', jr: 'グアム空港', airline: 'JAL/ユナイテッド' },
    'sydney':        { air: 'シドニー国際空港', jr: 'SYD', airline: 'JAL/ANA/カンタス' },
    'melbourne':     { air: 'メルボルン空港', jr: 'MEL', airline: 'JAL/カンタス（直行便なし要乗継）' },
    'dubai':         { air: 'ドバイ国際空港', jr: 'DXB', airline: 'JAL/エミレーツ' },
}

// 同一県内の例外（鎌倉←→東京、神戸←→大阪 など、飛行機・新幹線不要）
function isLocal(origin: string, destId: string): boolean {
    const localPairs: [string, string[]][] = [
        ['東京', ['kamakura', 'hakone', 'fuji-kawaguchi', 'karuizawa', 'nikko', 'izu', 'yokohama', 'kusatsu']],
        ['横浜', ['kamakura', 'hakone', 'fuji-kawaguchi', 'izu', 'yokohama']],
        ['大阪', ['kyoto', 'kobe', 'nara', 'osaka']],
        ['京都', ['kyoto', 'osaka', 'kobe']],
        ['名古屋', ['takayama-shirakawago', 'nagoya']],
        ['広島', ['hiroshima-miyajima', 'kurashiki']],
        ['福岡', ['fukuoka', 'beppu-yufuin', 'kumamoto-aso']],
        ['札幌', ['hakodate', 'asahikawa-furano', 'shiretoko', 'sapporo-otaru']],
    ]
    for (const [o, dests] of localPairs) {
        if (origin.includes(o) && dests.includes(destId)) return true
    }
    return false
}

// 国内移動：飛行機 or 新幹線 or 在来線
function buildDomesticTravel(
    origin: string,
    destId: string,
    destName: string,
    destRegion: RegionId,
): TravelDesc | null {
    if (isLocal(origin, destId)) {
        // 在来線・新幹線で1〜2時間。同一県内は移動工程として軽く
        const gateway = DEST_GATEWAY[destId]
        if (!gateway) return null
        return {
            name: `${origin}駅 → ${gateway.jr}`,
            description: `${origin}から${destName}へ電車で移動。所要約1〜2時間`,
            duration_minutes: 90,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }

    const gateway = DEST_GATEWAY[destId]
    if (!gateway) return null
    const originGateway = ORIGIN_AIRPORTS[origin] ?? { air: `${origin}空港`, jr: `${origin}駅` }

    // 離島・北海道・九州（東京/関西から）は飛行機
    if (destRegion === 'okinawa_main' || destRegion === 'okinawa_remote') {
        const hours = origin === '東京' ? '約2時間40分' : origin === '大阪' ? '約2時間20分' : '約2〜3時間'
        return {
            name: `${originGateway.air} → ${gateway.air}`,
            description: `${gateway.airline ?? 'JAL/ANA'}便で${hours}。LCCならピーチ・ジェットスター・ソラシドも選択肢`,
            duration_minutes: 240, // チェックイン/搭乗/フライト/到着までトータル
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    if (destRegion === 'hokkaido') {
        const hours = origin === '東京' ? '約1時間35分' : origin === '大阪' ? '約2時間' : '約2時間'
        return {
            name: `${originGateway.air} → ${gateway.air}`,
            description: `${gateway.airline ?? 'JAL/ANA/AIRDO'}便で${hours}。札幌市内へはエアポートライナーで約40分`,
            duration_minutes: 210,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    if (destRegion === 'kyushu_island') {
        return {
            name: `${originGateway.air} → ${gateway.air}`,
            description: `${gateway.airline ?? 'JAC'}便で約2時間（鹿児島経由）`,
            duration_minutes: 240,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    // 九州: 東京/関西からは飛行機、福岡からは在来線/新幹線
    if (destRegion === 'kyushu') {
        if (origin === '福岡') {
            return {
                name: `博多駅 → ${gateway.jr}`,
                description: `JR特急/新幹線で約1〜2時間`,
                duration_minutes: 120,
                address: `${origin}〜${destName}`,
                type: 'その他',
            }
        }
        return {
            name: `${originGateway.air} → ${gateway.air}`,
            description: `${gateway.airline ?? 'JAL/ANA'}便で約1.5〜2時間。空港から市内へバス/電車で30分`,
            duration_minutes: 210,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    // 東北: 東京から新幹線2時間前後、関西からは飛行機
    if (destRegion === 'tohoku') {
        if (origin === '東京') {
            return {
                name: `東京駅 → ${gateway.jr}`,
                description: `東北新幹線「はやぶさ」で約2時間`,
                duration_minutes: 150,
                address: `${origin}〜${destName}`,
                type: 'その他',
            }
        }
        return {
            name: `${originGateway.air} → ${gateway.air}`,
            description: `${gateway.airline ?? 'JAL/ANA'}便で約1〜1.5時間`,
            duration_minutes: 180,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    // 中国・四国: 東京から新幹線3〜4h、関西から1〜2h
    if (destRegion === 'chugoku' || destRegion === 'shikoku') {
        if (origin === '東京') {
            return {
                name: `東京駅 → ${gateway.jr}`,
                description: `東海道・山陽新幹線「のぞみ」で約3〜4時間`,
                duration_minutes: 240,
                address: `${origin}〜${destName}`,
                type: 'その他',
            }
        }
        if (origin === '大阪' || origin === '名古屋') {
            return {
                name: `${origin === '大阪' ? '新大阪' : '名古屋'}駅 → ${gateway.jr}`,
                description: `山陽新幹線で約1〜2時間`,
                duration_minutes: 120,
                address: `${origin}〜${destName}`,
                type: 'その他',
            }
        }
    }
    // 関東・中部・関西・北陸（中距離）: 新幹線が主
    if (origin === '東京') {
        return {
            name: `東京駅 → ${gateway.jr}`,
            description: `新幹線で約2〜3時間`,
            duration_minutes: 180,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    if (origin === '大阪') {
        return {
            name: `新大阪駅 → ${gateway.jr}`,
            description: `新幹線/特急で約1〜2.5時間`,
            duration_minutes: 150,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    if (origin === '名古屋') {
        return {
            name: `名古屋駅 → ${gateway.jr}`,
            description: `新幹線/特急で約1.5〜2時間`,
            duration_minutes: 120,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    if (origin === '福岡') {
        return {
            name: `${originGateway.air} → ${gateway.air}`,
            description: `${gateway.airline ?? 'JAL/ANA'}便で約1.5時間`,
            duration_minutes: 210,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    if (origin === '札幌') {
        return {
            name: `${originGateway.air} → ${gateway.air}`,
            description: `${gateway.airline ?? 'JAL/ANA'}便で約1.5〜2時間`,
            duration_minutes: 210,
            address: `${origin}〜${destName}`,
            type: 'その他',
        }
    }
    return null
}

// 海外移動：直行便があるか、所要時間
function buildOverseasTravel(
    origin: string,
    destId: string,
    destName: string,
): TravelDesc | null {
    const gateway = DEST_GATEWAY[destId]
    if (!gateway) return null
    const originAir = ORIGIN_AIRPORTS[origin]?.air ?? `${origin}空港`

    const overseasHours: Record<string, { tokyo: string; osaka: string }> = {
        'seoul':     { tokyo: '約2時間30分', osaka: '約1時間50分' },
        'busan':     { tokyo: '約2時間20分', osaka: '約1時間30分' },
        'taipei':    { tokyo: '約4時間', osaka: '約3時間30分' },
        'kaohsiung': { tokyo: '約4時間30分', osaka: '約4時間' },
        'hongkong':  { tokyo: '約5時間', osaka: '約4時間30分' },
        'jeju':      { tokyo: '約2時間50分（仁川経由が多い）', osaka: '約2時間（直行便あり）' },
        'bangkok':   { tokyo: '約6時間30分', osaka: '約6時間' },
        'singapore': { tokyo: '約7時間30分', osaka: '約7時間' },
        'shanghai':  { tokyo: '約3時間', osaka: '約2時間30分' },
        'beijing':   { tokyo: '約4時間', osaka: '約3時間30分' },
        'hochiminh': { tokyo: '約6時間30分', osaka: '約6時間' },
        'hanoi':     { tokyo: '約6時間', osaka: '約5時間30分' },
        'bali':      { tokyo: '約7時間30分（直行便季節運航）', osaka: '約8時間（経由便が一般的）' },
        'kl':        { tokyo: '約7時間30分', osaka: '約7時間' },
        'manila':    { tokyo: '約4時間30分', osaka: '約4時間' },
        'paris':     { tokyo: '約14時間（直行便）', osaka: '約14時間（直行便または経由便）' },
        'london':    { tokyo: '約14時間（直行便）', osaka: '約14時間（経由便が一般的）' },
        'rome':      { tokyo: '約13時間（直行便）', osaka: '約14時間（経由便）' },
        'barcelona': { tokyo: '約15時間（経由便）', osaka: '約16時間（経由便）' },
        'prague':    { tokyo: '約14時間（経由便）', osaka: '約15時間（経由便）' },
        'vienna':    { tokyo: '約14時間（ANA直行便）', osaka: '約15時間（経由便）' },
        'amsterdam': { tokyo: '約12時間（KLM直行便）', osaka: '約12時間（直行便）' },
        'berlin':    { tokyo: '約14時間（経由便）', osaka: '約15時間（経由便）' },
        'newyork':   { tokyo: '約13時間（直行便）', osaka: '約13時間（直行便）' },
        'la':        { tokyo: '約10時間（直行便）', osaka: '約10時間（直行便）' },
        'hawaii-oahu': { tokyo: '約7時間', osaka: '約7時間30分' },
        'guam':      { tokyo: '約3時間30分', osaka: '約4時間' },
        'sydney':    { tokyo: '約9時間30分（直行便）', osaka: '約10時間（経由便）' },
        'melbourne': { tokyo: '約10時間30分（経由便）', osaka: '約11時間（経由便）' },
        'dubai':     { tokyo: '約11時間30分', osaka: '約12時間' },
    }

    const info = overseasHours[destId]
    const hours = info ? (origin === '東京' ? info.tokyo : info.osaka) : '約3〜14時間'

    return {
        name: `${originAir} → ${gateway.air}`,
        description: `${gateway.airline ?? 'JAL/ANA'}便など${hours}。チェックイン2時間前、入国審査込みで半日かけて到着`,
        duration_minutes: destId === 'paris' || destId === 'london' || destId === 'rome'
            || destId === 'barcelona' || destId === 'prague' || destId === 'vienna'
            || destId === 'amsterdam' || destId === 'berlin' || destId === 'newyork'
            ? 900 // 国際線は実質1日かかる
            : destId === 'la' || destId === 'sydney' || destId === 'melbourne' || destId === 'dubai'
                ? 720
                : destId === 'bangkok' || destId === 'singapore' || destId === 'bali' || destId === 'kl'
                    || destId === 'hochiminh' || destId === 'hanoi' || destId === 'hawaii-oahu'
                    || destId === 'manila' || destId === 'guam' || destId === 'beijing'
                    ? 480
                    : 300, // 近距離アジア
        address: `${origin}〜${destName}`,
        type: 'その他',
    }
}

// 出発地 → 目的地 の Spot を生成
export function makeOutboundSpot(
    origin: string,
    destId: string,
    destName: string,
    destRegion: RegionId,
    destCountry: string,
    startHourBase: number,
): { spot: Spot; consumedMinutes: number } | null {
    const desc = destCountry === '日本'
        ? buildDomesticTravel(origin, destId, destName, destRegion)
        : buildOverseasTravel(origin, destId, destName)
    if (!desc) return null

    const time = `${String(startHourBase).padStart(2, '0')}:00`
    return {
        spot: {
            time,
            name: desc.name,
            description: desc.description,
            duration_minutes: desc.duration_minutes,
            type: desc.type,
            address: desc.address,
        },
        consumedMinutes: desc.duration_minutes,
    }
}

// 目的地 → 出発地 の帰路 Spot
export function makeReturnSpot(
    origin: string,
    destId: string,
    destName: string,
    destRegion: RegionId,
    destCountry: string,
    startHour: number,
): Spot | null {
    const desc = destCountry === '日本'
        ? buildDomesticTravel(origin, destId, destName, destRegion)
        : buildOverseasTravel(origin, destId, destName)
    if (!desc) return null

    // 名前を「目的地 → 出発地」に反転
    const parts = desc.name.split(' → ')
    const returnName = parts.length === 2 ? `${parts[1]} → ${parts[0]}` : `${destName}発 → ${origin}`
    const time = `${String(startHour).padStart(2, '0')}:00`
    return {
        time,
        name: returnName,
        description: `${desc.description}。帰路は搭乗手続きに余裕を持って`,
        duration_minutes: desc.duration_minutes,
        type: desc.type,
        address: `${destName}〜${origin}`,
    }
}
