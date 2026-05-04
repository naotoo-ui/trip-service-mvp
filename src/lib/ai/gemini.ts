import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateInput, Itinerary } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export function buildGeneratePrompt(input: GenerateInput): string {
    return `あなたは旅行プランニングの専門家です。以下の条件で旅行プランを作成してください。

行き先: ${input.destination}
日数: ${input.duration_days}日間
やりたいこと・希望: ${input.wishes ?? 'なし'}

以下のJSON形式のみで返してください（説明文は不要）：
{
  "title": "旅行タイトル",
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "スポット名",
          "description": "簡単な説明（30文字以内）",
          "duration_minutes": 90,
          "type": "観光"
        }
      ]
    }
  ]
}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれかを使用してください。移動時間も含めたリアルなスケジュールにしてください。`
}

export function buildScrapePrompt(articleText: string): string {
    return `以下のブログ記事から旅行プランを抽出し、旅程を作成してください。

ブログ記事:
${articleText.slice(0, 8000)}

以下のJSON形式のみで返してください（説明文は不要）：
{
  "title": "旅行タイトル",
  "destination": "行き先",
  "duration_days": 3,
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "スポット名",
          "description": "簡単な説明（30文字以内）",
          "duration_minutes": 90,
          "type": "観光"
        }
      ]
    }
  ]
}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれかを使用してください。`
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(buildGeneratePrompt(input))
    const { title, itinerary } = parseTripJson(result.response.text())
    return { title, itinerary }
}

export async function generateTripFromArticle(articleText: string): Promise<{
    title: string
    destination: string
    duration_days: number
    itinerary: Itinerary
}> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(buildScrapePrompt(articleText))
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
