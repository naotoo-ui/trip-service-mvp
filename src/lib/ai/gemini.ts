import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateInput, Itinerary, PlanInput, SidebarSpot, TripStyle } from '@/types'

function getModel() {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY が設定されていません')
    return new GoogleGenerativeAI(key).getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { maxOutputTokens: 8192 },
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
- 各日に観光・グルメスポット3〜5件
- 移動時間を考慮してスポット間に十分な空き時間を設ける（移動ブロックは生成しない）
- 8〜9時スタート、実在する店名・スポット名を使用
- trip_styleは一貫させる
- 各スポットにaddress（市区町村＋町名レベル、例:「那覇市首里金城町」「京都市東山区」）を付与
- 各日のlabelは「その日のテーマ」を端的に表す8〜14文字（例:「首里・那覇市内観光」「美ら海エリア満喫」「国際通りグルメ巡り」）。「1日目」のような単純番号は禁止。

出力フォーマット:
{"title":"...","trip_style":"rental_car","trip_style_reason":"...","days":[{"day":1,"label":"首里・那覇市内観光","spots":[{"time":"09:00","name":"...","description":"...","duration_minutes":60,"type":"観光","address":"那覇市首里金城町"},{"time":"11:00","name":"...","description":"...","duration_minutes":90,"type":"グルメ","address":"那覇市牧志"}]}]}

typeは「観光」「グルメ」「宿泊」「その他」のいずれか（移動は含めない）。`
}

export function buildScrapePrompt(articleText: string): string {
    return `以下のブログ記事から旅程をJSON形式のみで抽出してください。説明文・コードブロック不要。

【記事】
${articleText.slice(0, 6000)}

ルール:
- 記事のスポット・飲食店・宿泊先を忠実に抽出
- 記事の交通手段をtrip_styleに反映
- 移動時間を考慮してスポット間に十分な空き時間を設ける（移動ブロックは生成しない）
- 各スポットにaddress（市区町村＋町名レベル、例:「那覇市首里金城町」「京都市東山区」）を付与
- 各日のlabelは「その日のテーマ」を端的に表す8〜14文字（例:「首里・那覇市内観光」「美ら海エリア満喫」）。「1日目」のような単純番号は禁止。

出力フォーマット:
{"title":"...","destination":"...","duration_days":3,"trip_style":"rental_car","trip_style_reason":"...","days":[{"day":1,"label":"首里・那覇市内観光","spots":[{"time":"09:00","name":"...","description":"...","duration_minutes":60,"type":"観光","address":"那覇市首里金城町"},{"time":"11:00","name":"...","description":"...","duration_minutes":90,"type":"グルメ","address":"那覇市牧志"}]}]}

typeは「観光」「グルメ」「宿泊」「その他」のいずれか（移動は含めない）。`
}

export function parseTripJson(raw: string): {
    title: string
    destination?: string
    duration_days?: number
    itinerary: Itinerary
} {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const { title, destination, duration_days, days, trip_style, trip_style_reason, sidebar_spots } = parsed
    return {
        title,
        destination,
        duration_days,
        itinerary: {
            days: days ?? [],
            trip_style: trip_style as TripStyle | undefined,
            trip_style_reason,
            sidebar_spots: (sidebar_spots as SidebarSpot[] | undefined) ?? [],
        },
    }
}

async function callGemini(prompt: string): Promise<string> {
    try {
        const result = await getModel().generateContent(prompt)
        return result.response.text()
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit')) {
            throw new Error('RATE_LIMIT: AIの1日あたりの生成上限に達しました。しばらく時間をおいてから再度お試しください。')
        }
        throw err
    }
}

export async function generateTripFromInput(
    input: GenerateInput
): Promise<{ title: string; itinerary: Itinerary }> {
    const raw = await callGemini(buildGeneratePrompt(input))
    const { title, itinerary } = parseTripJson(raw)
    return { title, itinerary }
}

export function buildPlanPrompt(input: PlanInput, articleTexts: string[]): string {
    const destination = input.destinations.join('・')
    const styleHint = getTripStyleHint(destination, input.wishes)

    const groupLabels: Record<string, string> = {
        friends: '友人旅行', couple: 'カップル旅行', married: '夫婦旅行', honeymoon: '新婚旅行',
        family: '家族旅行', three_gen: '三世代旅行', girls: '女子旅',
        club: 'ゼミ・サークル旅行', corporate: '社員旅行', other: 'グループ旅行',
    }
    const metaLines = [
        input.origin          ? `出発地: ${input.origin}` : '',
        input.adults          ? `大人${input.adults}人${input.children ? `・子供${input.children}人` : ''}` : '',
        input.group_type      ? `旅行スタイル: ${groupLabels[input.group_type]}` : '',
    ].filter(Boolean).join(' / ')

    const articleSection = articleTexts.length > 0
        ? `\n参考記事（優先的に活用してください）:\n${articleTexts.map((t, i) => `[記事${i + 1}] ${t.slice(0, 2000)}`).join('\n---\n')}`
        : ''

    return `旅行プランニングの専門家として、以下の条件でJSON形式のみで旅程を出力してください。説明文・コードブロック不要。

目的地: ${destination} / ${input.duration_days}日間
${metaLines ? `補足: ${metaLines}` : ''}
希望: ${input.wishes ?? 'なし'}
交通手段ヒント: ${styleHint}
${articleSection}

ルール:
- 各日に観光・グルメスポット3〜5件
- 移動時間を考慮してスポット間に十分な空き時間を設ける（移動ブロックは生成しない）
- 8〜9時スタート、実在する店名・スポット名を使用
- trip_styleは一貫させる
- 参考記事がある場合、記事に記載されたスポットを積極的に活用
- 人気度4-5のスポットは時系列がなくても移動時間を考慮して旅程に自動配置
- 旅程に組み込めなかったスポット（混雑・時間不足・記事掲載の未採用スポット）はsidebar_spotsに追加（最大10件、popularity 1-5）
- 予約が必要なスポット（人気観光地・レストラン・体験アクティビティ・チケット制施設等）にはneeds_booking:trueを付与（不要なら省略）
- 各スポットにaddress（市区町村＋町名レベル、例:「那覇市首里金城町」「京都市東山区」）を付与
- 各日のlabelは「その日のテーマ」を端的に表す8〜14文字（例:「首里・那覇市内観光」「美ら海エリア満喫」「国際通りグルメ巡り」）。「1日目」のような単純番号は禁止。

出力フォーマット:
{"title":"...","trip_style":"rental_car","trip_style_reason":"...","days":[{"day":1,"label":"首里・那覇市内観光","spots":[{"time":"09:00","name":"...","description":"...","duration_minutes":60,"type":"観光","address":"那覇市首里金城町","needs_booking":true},{"time":"11:00","name":"...","description":"...","duration_minutes":90,"type":"グルメ","address":"那覇市牧志"}]}],"sidebar_spots":[{"name":"...","description":"...","type":"観光","duration_minutes":90,"popularity":4}]}

typeは「観光」「グルメ」「宿泊」「その他」のいずれか（移動は含めない）。`
}

export async function generateTripFromPlan(
    input: PlanInput,
    articleTexts: string[]
): Promise<{ title: string; itinerary: Itinerary }> {
    const raw = await callGemini(buildPlanPrompt(input, articleTexts))
    const { title, itinerary } = parseTripJson(raw)
    return { title, itinerary }
}

export async function generateTripFromArticle(articleText: string): Promise<{
    title: string
    destination: string
    duration_days: number
    itinerary: Itinerary
}> {
    const raw = await callGemini(buildScrapePrompt(articleText))
    const { title, destination, duration_days, itinerary } = parseTripJson(raw)
    return {
        title,
        destination: destination ?? '不明',
        duration_days: duration_days ?? 1,
        itinerary,
    }
}
