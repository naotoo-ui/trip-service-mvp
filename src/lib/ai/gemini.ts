import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateInput, Itinerary } from '@/types'

function getModel() {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY が設定されていません')
    return new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
}

export function buildGeneratePrompt(input: GenerateInput): string {
    return `あなたは旅行プランニングの専門家です。以下の条件で旅行プランを作成してください。

行き先: ${input.destination}
日数: ${input.duration_days}日間
やりたいこと・希望: ${input.wishes ?? 'なし'}

【ルール】
- 各日に4〜7件のスポットを入れる（移動・食事・観光・宿泊をバランスよく）
- 移動（空港・バス・電車・レンタカー）も必ずスポットとして含める
- 実在する有名スポット・飲食店名を使う
- 時間は朝8〜9時スタート、夜21〜22時終了で現実的に設定する
- descriptionは旅行者が読んで楽しくなるような短い一言（20〜30文字）

以下のJSON形式のみで返してください（コードブロック・説明文は不要）：
{
  "title": "旅行タイトル（例: 沖縄2泊3日 海と食を満喫の旅）",
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "スポット名",
          "description": "旅行者が楽しくなる一言説明",
          "duration_minutes": 90,
          "type": "観光"
        }
      ]
    }
  ]
}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれか。`
}

export function buildScrapePrompt(articleText: string): string {
    return `以下のブログ記事を読み、旅程情報を抽出して構造化してください。

【ブログ記事】
${articleText.slice(0, 10000)}

【抽出ルール】
- 記事に書かれている実際の訪問スポット・飲食店・宿泊先を忠実に抽出する
- 時間が記事に書かれていれば優先して使う。なければ前後の文脈から推測する
- descriptionは記事の内容を参考にした一言（20〜30文字）
- 記事に書かれていない日は作らない
- 移動情報（電車・バス・レンタカー等）も含める

以下のJSON形式のみで返してください（コードブロック・説明文は不要）：
{
  "title": "記事の旅行タイトル",
  "destination": "主な行き先（都道府県または国名）",
  "duration_days": 3,
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "スポット名",
          "description": "記事の内容を反映した一言",
          "duration_minutes": 60,
          "type": "観光"
        }
      ]
    }
  ]
}

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
    const { title, destination, duration_days, days } = parsed
    return { title, destination, duration_days, itinerary: { days: days ?? [] } }
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
    const { title, destination, duration_days, itinerary } = parseTripJson(
        result.response.text()
    )
    return {
        title,
        destination: destination ?? '不明',
        duration_days: duration_days ?? 1,
        itinerary,
    }
}
