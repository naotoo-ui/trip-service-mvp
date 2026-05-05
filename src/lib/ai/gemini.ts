import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateInput, Itinerary, TripStyle } from '@/types'

function getModel() {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY が設定されていません')
    return new GoogleGenerativeAI(key).getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { maxOutputTokens: 4096 },
    })
}

// 行き先から旅行スタイルを推定するヒント
function getTripStyleHint(destination: string, wishes?: string): string {
    const text = `${destination} ${wishes ?? ''}`.toLowerCase()

    if (/沖縄|離島|石垣|宮古|奄美|小笠原/.test(text)) {
        return '沖縄・離島はレンタカーが基本。公共交通が少なく観光地が点在しているため。trip_style: "rental_car"'
    }
    if (/北海道|富良野|美瑛|知床|稚内/.test(text)) {
        return '北海道の観光地間は距離が長くレンタカーが現実的。trip_style: "rental_car"'
    }
    if (/東京|大阪|京都|名古屋|福岡|札幌|横浜|神戸/.test(text)) {
        return '都市部は電車・地下鉄が最も効率的。trip_style: "public_transit"'
    }
    if (/パリ|ロンドン|ニューヨーク|ソウル|台北|バンコク|シンガポール|香港/.test(text)) {
        return '海外都市は地下鉄・タクシー・ライドシェアが主役。trip_style: "overseas_transit"'
    }
    if (/ハワイ|グアム/.test(text)) {
        return 'リゾート島はレンタカーかツアーバスが中心。trip_style: "rental_car"'
    }
    if (/ヨーロッパ|スイス|イタリア|スペイン|ドイツ|フランス/.test(text)) {
        return 'ヨーロッパ都市間は鉄道、市内は地下鉄・路面電車。trip_style: "mixed"'
    }
    return '旅行先の交通事情を考慮してtrip_styleを判断してください。'
}

export function buildGeneratePrompt(input: GenerateInput): string {
    const styleHint = getTripStyleHint(input.destination, input.wishes)

    return `旅行プランニングの専門家として、以下の条件でJSON形式のみで旅程を出力してください。説明文・コードブロック不要。

行き先: ${input.destination} / ${input.duration_days}日間 / 希望: ${input.wishes ?? 'なし'}
交通手段ヒント: ${styleHint}

ルール:
- 各日に観光・グルメスポット3〜4件（移動スポット含まず）
- 隣接スポット間には必ず移動スポット（"A → B" 形式）を挿入
- 移動スポットのtransport_optionsは推奨1件＋代替1件の計2件
- 8〜9時スタート、実在する店名・スポット名を使用
- trip_styleは一貫させる

出力フォーマット:
{"title":"...","trip_style":"rental_car","trip_style_reason":"...","days":[{"day":1,"label":"1日目","spots":[{"time":"09:00","name":"...","description":"...","duration_minutes":60,"type":"観光","transport_options":[]},{"time":"10:30","name":"A → B","description":"...","duration_minutes":30,"type":"移動","transport_options":[{"mode":"レンタカー","duration_minutes":30,"note":"...","recommended":true},{"mode":"タクシー","duration_minutes":35,"note":"..."}]}]}]}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれか。`
}

export function buildScrapePrompt(articleText: string): string {
    return `以下のブログ記事から旅程をJSON形式のみで抽出してください。説明文・コードブロック不要。

【記事】
${articleText.slice(0, 6000)}

ルール:
- 記事のスポット・飲食店・宿泊先を忠実に抽出
- 記事の交通手段をtrip_styleに反映
- 隣接スポット間に移動スポット（"A → B"形式）を挿入
- transport_optionsは推奨1件＋代替1件

出力フォーマット:
{"title":"...","destination":"...","duration_days":3,"trip_style":"rental_car","trip_style_reason":"...","days":[{"day":1,"label":"1日目","spots":[{"time":"09:00","name":"...","description":"...","duration_minutes":60,"type":"観光","transport_options":[]},{"time":"10:00","name":"A → B","description":"...","duration_minutes":30,"type":"移動","transport_options":[{"mode":"レンタカー","duration_minutes":30,"note":"...","recommended":true},{"mode":"タクシー","duration_minutes":35,"note":"..."}]}]}]}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれか。`
}

export function parseTripJson(raw: string): {
    title: string
    destination?: string
    duration_days?: number
    itinerary: Itinerary
} {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const { title, destination, duration_days, days, trip_style, trip_style_reason } = parsed
    return {
        title,
        destination,
        duration_days,
        itinerary: {
            days: days ?? [],
            trip_style: trip_style as TripStyle | undefined,
            trip_style_reason,
        },
    }
}

export async function generateTripFromInput(
    input: GenerateInput
): Promise<{ title: string; itinerary: Itinerary }> {
    const result = await getModel().generateContent(buildGeneratePrompt(input))
    const { title, itinerary } = parseTripJson(result.response.text())
    return { title, itinerary }
}

export async function generateTripFromArticle(articleText: string): Promise<{
    title: string
    destination: string
    duration_days: number
    itinerary: Itinerary
}> {
    const result = await getModel().generateContent(buildScrapePrompt(articleText))
    const { title, destination, duration_days, itinerary } = parseTripJson(result.response.text())
    return {
        title,
        destination: destination ?? '不明',
        duration_days: duration_days ?? 1,
        itinerary,
    }
}
