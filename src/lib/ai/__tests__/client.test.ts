describe('ai client config', () => {
    const ORIGINAL_USE_OLLAMA = process.env.USE_OLLAMA
    const ORIGINAL_NODE_ENV = process.env.NODE_ENV
    // process.env.NODE_ENV は Next.js の型では readonly になるため、
    // テスト内で書き換える時のみ型を緩める。
    const env = process.env as Record<string, string | undefined>

    afterEach(() => {
        env.USE_OLLAMA = ORIGINAL_USE_OLLAMA
        env.NODE_ENV = ORIGINAL_NODE_ENV
        jest.resetModules()
    })

    it('USE_OLLAMA=true で extract が Ollama にルーティング', () => {
        env.USE_OLLAMA = 'true'
        env.NODE_ENV = 'development'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes.extract.model).toBe('qwen2.5-3b-extract')
        expect(aiRoutes.extract.format).toBe('json')
        expect(aiRoutes.extract.provider).toBe('ollama')
    })

    it('USE_OLLAMA=false で extract が Gemini にルーティング', () => {
        env.USE_OLLAMA = 'false'
        env.NODE_ENV = 'production'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes.extract.model).toBe('gemini-2.5-flash-lite')
        expect(aiRoutes.extract.provider).toBe('gemini')
    })

    it('generate-trip-input は常に Gemini(USE_OLLAMA関係なし)', () => {
        env.USE_OLLAMA = 'true'
        env.NODE_ENV = 'development'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes['generate-trip-input'].model).toBe('gemini-2.5-flash-lite')
    })

    it('generate-trip-plan は常に Gemini', () => {
        env.USE_OLLAMA = 'true'
        env.NODE_ENV = 'development'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes['generate-trip-plan'].model).toBe('gemini-2.5-flash-lite')
    })
})
