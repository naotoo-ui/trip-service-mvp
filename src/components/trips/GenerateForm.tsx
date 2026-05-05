'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DatePicker from './DatePicker'

export default function GenerateForm() {
    const router = useRouter()
    const [destination, setDestination]   = useState('')
    const [durationDays, setDurationDays] = useState(2)
    const [wishes, setWishes]             = useState('')
    const [startDate, setStartDate]       = useState<Date | undefined>()
    const [loading, setLoading]           = useState(false)
    const [error, setError]               = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination,
                    duration_days: durationDays,
                    wishes,
                    start_date: startDate?.toISOString().split('T')[0],
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            router.push(`/trips/${data.share_id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : '旅程の生成に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">行き先</label>
                <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="例：沖縄、京都、パリ"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">日数</label>
                <select
                    value={durationDays}
                    onChange={e => setDurationDays(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                >
                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                        <option key={n} value={n}>{n}日間</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">旅行日程 <span className="text-gray-300">（任意）</span></label>
                <DatePicker
                    value={startDate}
                    duration={durationDays}
                    onChange={setStartDate}
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    やりたいこと <span className="text-gray-300">（任意）</span>
                </label>
                <textarea
                    value={wishes}
                    onChange={e => setWishes(e.target.value)}
                    placeholder="例：海と食事を楽しみたい"
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"
                />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-95 transition-all"
            >
                {loading ? '生成中...' : '旅程を生成する →'}
            </button>
        </form>
    )
}
