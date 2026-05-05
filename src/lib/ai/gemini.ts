import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateInput, Itinerary, TripStyle } from '@/types'

function getModel() {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY が設定されていません')
    return new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.5-flash' })
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

    return `あなたは旅行プランニングの専門家です。以下の条件でリアルな旅行プランを作成してください。

行き先: ${input.destination}
日数: ${input.duration_days}日間
やりたいこと・希望: ${input.wishes ?? 'なし'}

【交通手段の判断】
${styleHint}
旅行全体を通じて一貫した交通手段を使うよう計画してください。

【ルール】
- 各日に4〜7件の観光・グルメスポットを入れる（移動スポットは別途）
- 連続するスポット間に必ず「移動」スポットを入れる
- 移動スポットでは出発地→目的地を "A → B" の形式で name に書く
- 移動スポットには現実的な所要時間・距離を考慮した transport_options を2〜3個用意する
- 同じエリア内の近いスポットをまとめ、無駄な移動を避ける
- 時間は朝8〜9時スタートで現実的に設定する
- 実在するスポット・飲食店名を使う

以下のJSON形式のみで返してください（コードブロック・説明文は不要）：
{
  "title": "旅行タイトル",
  "trip_style": "rental_car",
  "trip_style_reason": "沖縄は公共交通が少なくレンタカーが最適",
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "那覇空港",
          "description": "到着・レンタカーピックアップ",
          "duration_minutes": 60,
          "type": "移動",
          "transport_options": [
            { "mode": "レンタカー", "duration_minutes": 0, "note": "空港内カウンターで手続き", "recommended": true }
          ]
        },
        {
          "time": "10:30",
          "name": "那覇空港 → 国際通り",
          "description": "空港から那覇市内へ移動",
          "duration_minutes": 25,
          "type": "移動",
          "transport_options": [
            { "mode": "レンタカー", "duration_minutes": 25, "note": "国道58号経由 / 約10km", "recommended": true },
            { "mode": "ゆいレール", "duration_minutes": 15, "note": "空港駅→県庁前駅 / 約370円" },
            { "mode": "タクシー", "duration_minutes": 20, "note": "約1,500〜2,000円" }
          ]
        },
        {
          "time": "11:00",
          "name": "国際通り",
          "description": "お土産と地元グルメを楽しむ那覇のメインストリート",
          "duration_minutes": 90,
          "type": "観光",
          "transport_options": []
        }
      ]
    }
  ]
}

typeは「観光」「グルメ」「移動」「宿泊」「その他」のいずれか。
transport_optionsは移動スポット以外は空配列でOK。`
}

export function buildScrapePrompt(articleText: string): string {
    return `以下のブログ記事を読み、旅程情報を抽出して構造化してください。

【ブログ記事】
${articleText.slice(0, 10000)}

【抽出ルール】
- 記事に書かれている実際の訪問スポット・飲食店・宿泊先を忠実に抽出する
- 記事の交通手段（レンタカー/電車/バス等）を読み取りtrip_styleに反映する
- 連続スポット間には必ず移動スポットを入れ、記事の内容から交通手段を読み取る
- 移動スポットのtransport_optionsは記事記載の手段を1番目に、代替案を追加する
- 時間が記事に書かれていれば優先して使い、なければ前後から推測する
- 記事に書かれていない日は作らない

以下のJSON形式のみで返してください（コードブロック・説明文は不要）：
{
  "title": "記事の旅行タイトル",
  "destination": "主な行き先",
  "duration_days": 3,
  "trip_style": "rental_car",
  "trip_style_reason": "記事でレンタカーを使用していたため",
  "days": [
    {
      "day": 1,
      "label": "1日目",
      "spots": [
        {
          "time": "09:00",
          "name": "A → B",
          "description": "移動の説明",
          "duration_minutes": 30,
          "type": "移動",
          "transport_options": [
            { "mode": "レンタカー", "duration_minutes": 30, "note": "記事の交通手段", "recommended": true }
          ]
        },
        {
          "time": "09:30",
          "name": "スポット名",
          "description": "記事の内容を反映した一言",
          "duration_minutes": 60,
          "type": "観光",
          "transport_options": []
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
