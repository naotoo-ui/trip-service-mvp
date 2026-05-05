'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UrlForm() {
    const router = useRouter()
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
            const text = await res.text()
            let data: { share_id?: string; error?: string }
            try { data = JSON.parse(text) } catch { throw new Error(`サーバーエラー（タイムアウトの可能性）: ${text.slice(0, 120)}`) }
            if (!res.ok) throw new Error(data.error ?? '取得失敗')
            router.push(`/trips/${data.share_id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : '旅程の取得に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">旅行ブログのURL</label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
                <p className="text-xs text-gray-400 mt-1">じゃらん・るるぶ・アメブロ等に対応</p>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 active:scale-95 transition-all"
            >
                {loading ? '記事を解析中...' : 'URLから旅程を作成する →'}
            </button>
        </form>
    )
}
