import { buildGeneratePrompt, parseTripJson } from '../gemini'

describe('buildGeneratePrompt', () => {
    it('行き先・日数・やりたいことをプロンプトに含む', () => {
        const prompt = buildGeneratePrompt({
            destination: '沖縄',
            duration_days: 3,
            wishes: '海を楽しみたい',
        })
        expect(prompt).toContain('沖縄')
        expect(prompt).toContain('3日間')
        expect(prompt).toContain('海を楽しみたい')
    })

    it('wishesが未指定の場合は「なし」を含む', () => {
        const prompt = buildGeneratePrompt({ destination: '東京', duration_days: 2 })
        expect(prompt).toContain('なし')
    })
})

describe('parseTripJson', () => {
    it('正常なJSONからtitleとitineraryを取り出す', () => {
        const raw = JSON.stringify({
            title: '沖縄3日間の旅',
            days: [{ day: 1, label: '1日目', spots: [] }],
        })
        const result = parseTripJson(raw)
        expect(result.title).toBe('沖縄3日間の旅')
        expect(result.itinerary.days).toHaveLength(1)
    })

    it('```json コードフェンスを除去してパースできる', () => {
        const raw = '```json\n{"title":"test","days":[]}\n```'
        const result = parseTripJson(raw)
        expect(result.title).toBe('test')
    })

    it('不正なJSONの場合はエラーを投げる', () => {
        expect(() => parseTripJson('invalid json')).toThrow()
    })
})
