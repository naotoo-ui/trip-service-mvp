import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateInput, Itinerary, PlanInput, SidebarSpot, TripStyle } from '@/types'
import { ai } from './client'

function getModel() {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY が設定されていません')
    return new GoogleGenerativeAI(key).getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { maxOutputTokens: 8192 },
    })
}

// ──────────── 地域判定 ────────────

function detectRegion(place: string): string | null {
    const p = place.toLowerCase()
    if (/東京|神奈川|横浜|千葉|埼玉|群馬|栃木|茨城|山梨|長野|静岡|新潟/.test(p)) return 'kanto'
    if (/大阪|京都|神戸|奈良|滋賀|和歌山|兵庫/.test(p)) return 'kansai'
    if (/名古屋|愛知|岐阜|三重/.test(p)) return 'chubu'
    if (/広島|岡山|山口|鳥取|島根/.test(p)) return 'chugoku'
    if (/福岡|佐賀|長崎|熊本|大分|宮崎|鹿児島/.test(p)) return 'kyushu'
    if (/仙台|宮城|岩手|青森|秋田|山形|福島/.test(p)) return 'tohoku'
    if (/金沢|福井|富山|石川/.test(p)) return 'hokuriku'
    if (/高知|愛媛|徳島|香川/.test(p)) return 'shikoku'
    if (/北海道|札幌|函館|旭川|釧路|帯広|稚内|網走|知床/.test(p)) return 'hokkaido'
    if (/沖縄|那覇|石垣|宮古|与論|久米島|西表|奄美|小笠原/.test(p)) return 'island'
    return null
}

const DOMESTIC_TRAVEL_HOURS: Record<string, Record<string, number>> = {
    kanto:    { kansai: 3, chubu: 2, chugoku: 5, kyushu: 7, tohoku: 2, hokuriku: 3, shikoku: 5 },
    kansai:   { kanto: 3, chubu: 1, chugoku: 2, kyushu: 3, tohoku: 5, hokuriku: 2, shikoku: 2 },
    chubu:    { kanto: 2, kansai: 1, chugoku: 3, kyushu: 4, tohoku: 3, hokuriku: 1, shikoku: 3 },
    chugoku:  { kanto: 5, kansai: 2, chubu: 3, kyushu: 2, tohoku: 7, hokuriku: 3, shikoku: 1 },
    kyushu:   { kanto: 7, kansai: 3, chubu: 4, chugoku: 2, tohoku: 8, hokuriku: 5, shikoku: 3 },
    tohoku:   { kanto: 2, kansai: 5, chubu: 3, chugoku: 7, kyushu: 8, hokuriku: 4, shikoku: 6 },
    hokuriku: { kanto: 3, kansai: 2, chubu: 1, chugoku: 3, kyushu: 5, tohoku: 4, shikoku: 3 },
    shikoku:  { kanto: 5, kansai: 2, chubu: 3, chugoku: 1, kyushu: 3, tohoku: 6, hokuriku: 3 },
}

// 出発地→目的地の移動ヒントを生成（初日・最終日のスポット量を制御）
function getDepartureTravelHint(origin: string, destination: string, durationDays: number): string {
    const dest = destination.toLowerCase()
    const orig = origin.toLowerCase()

    // 海外
    const isOverseas = /ソウル|釜山|台湾|台北|バンコク|シンガポール|ハワイ|グアム|ニューヨーク|パリ|ロンドン|ローマ|スペイン|バルセロナ|プラハ|ウィーン|アムステルダム|ベルリン|マニラ|クアラルンプール|ホーチミン|ハノイ|バリ|シドニー|メルボルン|ドバイ|香港|上海|北京|済州|海外|アメリカ|ヨーロッパ|アジア/.test(dest)
    if (isOverseas) {
        return `【出発地移動の必須ルール：国際線フライト】
- 1日目: 国際便の搭乗・フライト・入国審査・ホテル移動で夕方〜夜着。観光スポットは夕食1件のみか0件にする。絶対に午前〜昼の観光スポットを配置しない
- 最終日: 国際便搭乗のため午前中で観光終了（最大2スポット）、チェックアウト後は空港直行`
    }

    // 国内離島（飛行機必須）
    const isIsland = /沖縄|石垣|宮古|奄美|与論|久米島|西表|小笠原/.test(dest)
    const origIsNotIsland = !/沖縄|石垣|宮古|奄美|与論|久米島|西表|小笠原/.test(orig)
    if (isIsland && origIsNotIsland) {
        return `【出発地移動の必須ルール：国内離島フライト】
- 1日目: 空港チェックイン→搭乗→到着→荷物受取→市内移動で13〜14時着想定。午後から最大3スポット（合計4時間以内）のみ配置
- 最終日: 帰路フライトのため13時には空港到着必要。午前中のみ最大2スポット`
    }

    // 北海道（本州から）
    const isHokkaido = /北海道|札幌|函館|旭川|釧路|帯広|稚内|網走|知床/.test(dest)
    const origIsHonshu = !/北海道|札幌|函館|旭川/.test(orig)
    if (isHokkaido && origIsHonshu) {
        return `【出発地移動の必須ルール：北海道フライト】
- 1日目: 空港→搭乗→着陸→市内移動で13時頃着想定。午後から最大3スポット
- 最終日: 帰路フライトのため13〜14時には空港到着必要。午前中のみ最大2スポット`
    }

    // 国内長距離新幹線・電車
    const origRegion = detectRegion(orig)
    const destRegion = detectRegion(dest)
    if (origRegion && destRegion && origRegion !== destRegion) {
        const hours = DOMESTIC_TRAVEL_HOURS[origRegion]?.[destRegion] ?? 2
        if (hours >= 4) {
            return `【出発地移動の必須ルール：長距離移動 約${hours}時間】
- 1日目: 移動時間を考慮し最初のスポットは13時以降（最大3スポット）
- 最終日: 帰路の移動を考慮し15時には観光終了（最大2スポット）`
        }
        if (hours >= 2) {
            return `【出発地移動の必須ルール：中距離移動 約${hours}時間】
- 1日目: 移動後の到着を考慮し最初のスポットは11〜12時頃（最大4スポット）
- 最終日: 帰路の移動を考慮し16時には観光終了`
        }
    }

    if (durationDays >= 2) {
        return `出発地 ${origin} からの移動時間を考慮し、1日目の最初のスポット開始時刻と最終日の終了時刻を現実的に設定すること。`
    }
    return ''
}

// ──────────── 行き先から旅行スタイルを推定するヒント ────────────

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

// 全プロンプト共通の現実性ルール
const REALISM_RULES = `- 【必須】同一スポット名を全日程で重複させない
- 【必須】各日のスポットはtime順に並べ、前のスポットの time + duration_minutes を超えてから次のスポットを開始すること（時間の重複・逆転禁止）
- 【必須・地理的現実性】1日の観光は同一エリア（隣接する市区町村・地区）に集中させる。離れた地方・都市を同日に組み合わせない（例：京都と大阪は同日可・東京と京都は同日不可）
- 【必須・地理的現実性】スポット間には徒歩/電車/レンタカーで現実的に移動できる距離のみ設定する（GoogleMapsで不可能なルートは厳禁）
- 【必須・地理的現実性】複数の離れた目的地を巡る場合（例：東京→大阪→広島）、各都市を別の日に割り当て、移動日を明確に設ける`

export function buildGeneratePrompt(input: GenerateInput): string {
    const styleHint = getTripStyleHint(input.destination, input.wishes)

    return `旅行プランニングの専門家として、以下の条件でJSON形式のみで旅程を出力してください。説明文・コードブロック不要。

行き先: ${input.destination} / ${input.duration_days}日間 / 希望: ${input.wishes ?? 'なし'}
交通手段ヒント: ${styleHint}

ルール:
- 各日に観光・グルメスポット3〜5件
- スポット間には移動時間（電車15〜30分・レンタカー20〜60分・徒歩10〜20分）を空き時間として確保すること（移動ブロックは生成しない）
- 8〜9時スタート、実在する店名・スポット名を使用
- trip_styleは一貫させる
- 各スポットにaddress（市区町村＋町名レベル、例:「那覇市首里金城町」「京都市東山区」）を付与
- 各日のlabelは「その日のテーマ」を端的に表す8〜14文字（例:「首里・那覇市内観光」「美ら海エリア満喫」「国際通りグルメ巡り」）。「1日目」のような単純番号は禁止。
${REALISM_RULES}

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
- スポット間には移動時間（電車15〜30分・レンタカー20〜60分・徒歩10〜20分）を空き時間として確保すること（移動ブロックは生成しない）
- 各スポットにaddress（市区町村＋町名レベル、例:「那覇市首里金城町」「京都市東山区」）を付与
- 各日のlabelは「その日のテーマ」を端的に表す8〜14文字（例:「首里・那覇市内観光」「美ら海エリア満喫」）。「1日目」のような単純番号は禁止。
${REALISM_RULES}

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

function toMins(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return isNaN(h) ? 0 : h * 60 + (m || 0)
}

export function sanitizeItinerary(itinerary: Itinerary): Itinerary {
    const seenNames = new Set<string>()

    const days = itinerary.days.map(day => {
        // 重複スポットを除外
        const uniqueSpots = day.spots.filter(spot => {
            const key = spot.name.trim().toLowerCase()
            if (seenNames.has(key)) return false
            seenNames.add(key)
            return true
        })

        // 時間の重複・逆転を修正（前のスポット終了後に開始するよう補正）
        let lastEndMins = -1
        const fixedSpots = uniqueSpots.map(spot => {
            const startMins = toMins(spot.time)
            const dur = Math.max(20, spot.duration_minutes || 60)

            let adjStart = startMins
            if (adjStart < lastEndMins) {
                adjStart = lastEndMins + 15
            }
            lastEndMins = adjStart + dur

            const h = Math.floor(adjStart / 60)
            const m = adjStart % 60
            return {
                ...spot,
                time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
                duration_minutes: dur,
            }
        })

        return { ...day, spots: fixedSpots }
    })

    return { ...itinerary, days }
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
    return { title, itinerary: sanitizeItinerary(itinerary) }
}

export function buildPlanPrompt(input: PlanInput, articleTexts: string[]): string {
    const destination = input.destinations.join('・')
    const styleHint = getTripStyleHint(destination, input.wishes)
    const departureHint = input.origin
        ? getDepartureTravelHint(input.origin, destination, input.duration_days)
        : ''

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
${departureHint ? `\n${departureHint}` : ''}${articleSection}

ルール:
- 各日に観光・グルメスポット3〜5件
- スポット間には移動時間（電車15〜30分・レンタカー20〜60分・徒歩10〜20分）を空き時間として確保すること（移動ブロックは生成しない）
- 実在する店名・スポット名を使用
- trip_styleは一貫させる
- 参考記事がある場合、記事に記載されたスポットを積極的に活用
- 人気度4-5のスポットは時系列がなくても移動時間を考慮して旅程に自動配置
- 旅程に組み込めなかったスポット（混雑・時間不足・記事掲載の未採用スポット）はsidebar_spotsに追加（最大10件、popularity 1-5）
- 予約が必要なスポット（人気観光地・レストラン・体験アクティビティ・チケット制施設等）にはneeds_booking:trueを付与（不要なら省略）
- 各スポットにaddress（市区町村＋町名レベル、例:「那覇市首里金城町」「京都市東山区」）を付与
- 各日のlabelは「その日のテーマ」を端的に表す8〜14文字（例:「首里・那覇市内観光」「美ら海エリア満喫」「国際通りグルメ巡り」）。「1日目」のような単純番号は禁止。
${REALISM_RULES}

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
    return { title, itinerary: sanitizeItinerary(itinerary) }
}

export async function generateTripFromArticle(articleText: string): Promise<{
    title: string
    destination: string
    duration_days: number
    itinerary: Itinerary
}> {
    // ハイブリッドルーター経由(USE_OLLAMA=true なら Ollama、失敗時は Gemini にフォールバック)
    const { text } = await ai.complete('extract', { prompt: buildScrapePrompt(articleText) })
    const { title, destination, duration_days, itinerary } = parseTripJson(text)
    return {
        title,
        destination: destination ?? '不明',
        duration_days: duration_days ?? 1,
        itinerary: sanitizeItinerary(itinerary),
    }
}
