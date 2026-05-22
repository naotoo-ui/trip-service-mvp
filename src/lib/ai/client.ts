import { createClient, RouteConfig } from '@local-llm/client'

const isLocalDev =
    process.env.NODE_ENV === 'development' || process.env.USE_OLLAMA === 'true'

export const aiRoutes: Record<string, RouteConfig> = {
    extract: isLocalDev
        ? { model: 'qwen2.5-3b-extract', provider: 'ollama', timeoutMs: 60000, format: 'json' }
        : { model: 'gemini-2.5-flash-lite', provider: 'gemini' },
    'generate-trip-input': { model: 'gemini-2.5-flash-lite', provider: 'gemini' },
    'generate-trip-plan': { model: 'gemini-2.5-flash-lite', provider: 'gemini' },
}

export const ai = createClient({
    routes: aiRoutes,
    fallback: { provider: 'gemini', model: 'gemini-2.5-flash-lite', timeoutMs: 60000 },
    logging: true,
})
