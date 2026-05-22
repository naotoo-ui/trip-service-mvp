// generateTripFromArticle が ai.complete (ハイブリッドルーター) 経由で動くことを検証。
// このファイルは static import を一切使わず、各テスト内で require して
// モックを確実に適用する(他のテストファイルでの import 順序の影響を避ける)。

describe('generateTripFromArticle (Ollama経由 / ハイブリッドルーター)', () => {
    beforeEach(() => {
        jest.resetModules()
    })

    afterEach(() => {
        jest.resetModules()
        jest.dontMock('../client')
    })

    it('ai.complete を extract タスクで呼ぶ', async () => {
        const mockComplete = jest.fn().mockResolvedValue({
            text: JSON.stringify({
                title: 'テスト旅',
                destination: '京都',
                duration_days: 2,
                days: [
                    {
                        day: 1,
                        label: '清水寺巡り',
                        spots: [
                            {
                                time: '10:00',
                                name: '清水寺',
                                description: 'テスト',
                                duration_minutes: 60,
                                type: '観光',
                                address: '京都市',
                            },
                        ],
                    },
                ],
            }),
            source: 'ollama',
            model: 'qwen2.5-3b-extract',
            latencyMs: 5000,
            fallbackUsed: false,
        })

        jest.doMock('../client', () => ({
            ai: { complete: mockComplete },
            aiRoutes: {},
        }))

        const { generateTripFromArticle } = require('../gemini')
        const result = await generateTripFromArticle(
            '京都に行きました。清水寺を見学しました。',
        )

        expect(mockComplete).toHaveBeenCalledWith(
            'extract',
            expect.objectContaining({
                prompt: expect.stringContaining('清水寺'),
            }),
        )
        expect(result.title).toBe('テスト旅')
        expect(result.destination).toBe('京都')
        expect(result.itinerary.days[0].spots[0].name).toBe('清水寺')
    })

    it('Ollama 失敗時、Gemini にフォールバックされた結果でも正常に処理', async () => {
        const mockComplete = jest.fn().mockResolvedValue({
            text: JSON.stringify({
                title: 'フォールバック旅',
                destination: '東京',
                duration_days: 1,
                days: [
                    {
                        day: 1,
                        label: '浅草',
                        spots: [
                            {
                                time: '09:00',
                                name: '浅草寺',
                                description: '',
                                duration_minutes: 60,
                                type: '観光',
                                address: '東京',
                            },
                        ],
                    },
                ],
            }),
            source: 'gemini',
            model: 'gemini-2.5-flash-lite',
            latencyMs: 8000,
            fallbackUsed: true,
        })

        jest.doMock('../client', () => ({
            ai: { complete: mockComplete },
            aiRoutes: {},
        }))

        const { generateTripFromArticle } = require('../gemini')
        const result = await generateTripFromArticle('東京の浅草寺に行きました。')
        expect(result.title).toBe('フォールバック旅')
        expect(result.destination).toBe('東京')
    })
})
