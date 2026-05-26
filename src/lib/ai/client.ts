// ハイブリッドAIクライアント（Gemini / Ollama）— このリポジトリに内包
// （以前は @local-llm/client (file: ../local-llm/shared-client) を参照していたが、
//  Vercel が外部パスを解決できないため、最小限の実装をこのリポジトリへ vendor した）

import { GoogleGenerativeAI } from '@google/generative-ai'

export type Provider = 'ollama' | 'gemini'

export interface RouteConfig {
    model: string
    provider?: Provider
    timeoutMs?: number
    format?: 'json'
}

export interface FallbackConfig {
    provider: Provider
    model: string
    timeoutMs?: number
}

export interface ClientConfig {
    routes: Record<string, RouteConfig>
    fallback?: FallbackConfig
    logging?: boolean
    ollamaHost?: string
}

export interface CompletionInput {
    prompt: string
    maxTokens?: number
    temperature?: number
}

export interface CompletionResult {
    text: string
    source: Provider
    model: string
    latencyMs: number
    fallbackUsed: boolean
}

export interface Client {
    complete(task: string, input: CompletionInput): Promise<CompletionResult>
}

// ──────────── Gemini ────────────

async function completeWithGemini(
    model: string,
    input: CompletionInput,
    timeoutMs: number,
): Promise<string> {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY が設定されていません')
    const genModel = new GoogleGenerativeAI(key).getGenerativeModel({
        model,
        generationConfig: {
            maxOutputTokens: input.maxTokens ?? 8192,
            temperature: input.temperature,
        },
    })

    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), timeoutMs)
    try {
        const result = await genModel.generateContent(input.prompt)
        return result.response.text()
    } finally {
        clearTimeout(timer)
    }
}

// ──────────── Ollama（ローカル開発時のみ。Vercel/本番では使われない） ────────────

async function completeWithOllama(
    model: string,
    input: CompletionInput,
    timeoutMs: number,
    host: string,
    format: 'json' | undefined,
): Promise<string> {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), timeoutMs)
    try {
        const res = await fetch(`${host}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt: input.prompt,
                stream: false,
                ...(format ? { format } : {}),
                options: {
                    ...(input.temperature !== undefined ? { temperature: input.temperature } : {}),
                    ...(input.maxTokens !== undefined ? { num_predict: input.maxTokens } : {}),
                },
            }),
            signal: ac.signal,
        })
        if (!res.ok) throw new Error(`Ollama HTTP ${res.status}: ${await res.text().catch(() => '')}`)
        const data = await res.json() as { response?: string }
        return data.response ?? ''
    } finally {
        clearTimeout(timer)
    }
}

// ──────────── ハイブリッドルーター ────────────

export function createClient(config: ClientConfig): Client {
    const host = config.ollamaHost ?? process.env.OLLAMA_HOST ?? 'http://localhost:11434'
    const logging = !!config.logging

    function log(...args: unknown[]) {
        if (logging) console.log('[local-llm]', ...args)
    }

    async function run(task: string, input: CompletionInput): Promise<CompletionResult> {
        const route = config.routes[task]
        if (!route) throw new Error(`route 未定義: ${task}`)
        const provider: Provider = route.provider ?? 'gemini'
        const timeoutMs = route.timeoutMs ?? 60000
        const start = Date.now()

        try {
            const text = provider === 'ollama'
                ? await completeWithOllama(route.model, input, timeoutMs, host, route.format)
                : await completeWithGemini(route.model, input, timeoutMs)
            const latencyMs = Date.now() - start
            log(`task=${task} provider=${provider} model=${route.model} latency=${latencyMs}ms`)
            return { text, source: provider, model: route.model, latencyMs, fallbackUsed: false }
        } catch (err) {
            if (config.fallback && provider !== config.fallback.provider) {
                log(`task=${task} primary(${provider}) failed → fallback to ${config.fallback.provider}:`, err)
                const fbTimeout = config.fallback.timeoutMs ?? 60000
                const text = config.fallback.provider === 'ollama'
                    ? await completeWithOllama(config.fallback.model, input, fbTimeout, host, route.format)
                    : await completeWithGemini(config.fallback.model, input, fbTimeout)
                const latencyMs = Date.now() - start
                return {
                    text, source: config.fallback.provider, model: config.fallback.model,
                    latencyMs, fallbackUsed: true,
                }
            }
            throw err
        }
    }

    return { complete: run }
}

// ──────────── このプロジェクトのルート設定 ────────────

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
