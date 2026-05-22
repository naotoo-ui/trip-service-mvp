describe('ai client config', () => {
    const ORIGINAL_USE_OLLAMA = process.env.USE_OLLAMA
    const ORIGINAL_NODE_ENV = process.env.NODE_ENV

    afterEach(() => {
        process.env.USE_OLLAMA = ORIGINAL_USE_OLLAMA
        process.env.NODE_ENV = ORIGINAL_NODE_ENV
        jest.resetModules()
    })

    it('USE_OLLAMA=true で extract が Ollama にルーティング', () => {
        process.env.USE_OLLAMA = 'true'
        process.env.NODE_ENV = 'development'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes.extract.model).toBe('qwen2.5-3b-extract')
        expect(aiRoutes.extract.format).toBe('json')
        expect(aiRoutes.extract.provider).toBe('ollama')
    })

    it('USE_OLLAMA=false で extract が Gemini にルーティング', () => {
        process.env.USE_OLLAMA = 'false'
        process.env.NODE_ENV = 'production'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes.extract.model).toBe('gemini-2.5-flash-lite')
        expect(aiRoutes.extract.provider).toBe('gemini')
    })

    it('generate-trip-input は常に Gemini(USE_OLLAMA関係なし)', () => {
        process.env.USE_OLLAMA = 'true'
        process.env.NODE_ENV = 'development'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes['generate-trip-input'].model).toBe('gemini-2.5-flash-lite')
    })

    it('generate-trip-plan は常に Gemini', () => {
        process.env.USE_OLLAMA = 'true'
        process.env.NODE_ENV = 'development'
        jest.resetModules()
        const { aiRoutes } = require('../client')
        expect(aiRoutes['generate-trip-plan'].model).toBe('gemini-2.5-flash-lite')
    })
})
