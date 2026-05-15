'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DatePicker from './DatePicker'
import type { GroupType } from '@/types'
import GeneratingOverlay from './GeneratingOverlay'

// ────────── サブコンポーネント ──────────
function Counter({
    value,
    onChange,
    min = 0,
    max = 20,
}: {
    value: number
    onChange: (n: number) => void
    min?: number
    max?: number
}) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                style={{
                    width: 28, height: 28, borderRadius: 8,
                    border: '1px solid #e5e7eb', background: 'white',
                    cursor: value <= min ? 'not-allowed' : 'pointer',
                    fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: value <= min ? 0.35 : 1,
                }}
            >−</button>
            <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{value}</span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                style={{
                    width: 28, height: 28, borderRadius: 8,
                    border: '1px solid #e5e7eb', background: 'white',
                    cursor: value >= max ? 'not-allowed' : 'pointer',
                    fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: value >= max ? 0.35 : 1,
                }}
            >＋</button>
        </div>
    )
}

// ────────── スタイル定数 ──────────
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    background: '#fafafa',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 6,
    display: 'block',
}

const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
}

const GROUP_TYPES: { value: GroupType; label: string }[] = [
    { value: 'friends',   label: '👫 友人旅行' },
    { value: 'couple',    label: '💑 カップル旅行' },
    { value: 'married',   label: '💍 夫婦旅行' },
    { value: 'honeymoon', label: '🥂 新婚旅行' },
    { value: 'family',    label: '👨‍👩‍👧 家族旅行' },
    { value: 'three_gen', label: '👴👨👧 三世代旅行' },
    { value: 'girls',     label: '👩‍👩‍👧 女子旅' },
    { value: 'club',      label: '🎓 ゼミ・サークル旅行' },
    { value: 'corporate', label: '🏢 社員旅行' },
    { value: 'other',     label: '👥 その他' },
]

// ────────── メインコンポーネント ──────────
export default function PlanForm() {
    const router = useRouter()

    const [destinations, setDestinations] = useState<string[]>([])
    const [destInput, setDestInput]       = useState('')

    const [durationDays, setDurationDays] = useState(3)
    const [startDate, setStartDate]       = useState<Date | undefined>()
    const [origin, setOrigin]             = useState('')

    const [adults, setAdults]         = useState(2)
    const [children, setChildren]     = useState(0)
    const [groupType, setGroupType]   = useState<GroupType | ''>('')

    const [wishes, setWishes] = useState('')
    const [urls, setUrls]     = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')

    function addDestination() {
        const d = destInput.trim()
        if (d && !destinations.includes(d)) {
            setDestinations(prev => [...prev, d])
        }
        setDestInput('')
    }

    async function handleSubmit() {
        if (destinations.length === 0) { setError('目的地を1つ以上入力してください'); return }
        setLoading(true)
        setError('')
        try {
            const validUrls = urls.filter(u => u.trim())
            const res = await fetch('/api/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destinations,
                    duration_days: durationDays,
                    start_date:  startDate?.toISOString().split('T')[0],
                    origin:      origin.trim() || undefined,
                    adults,
                    children:    children || undefined,
                    group_type:  groupType || undefined,
                    wishes:      wishes.trim() || undefined,
                    urls:        validUrls.length ? validUrls : undefined,
                }),
            })
            const text = await res.text()
            let data: { share_id?: string; edit_token?: string; error?: string }
            try { data = JSON.parse(text) } catch { throw new Error(`サーバーエラー（タイムアウトの可能性）: ${text.slice(0, 120)}`) }
            if (!res.ok) throw new Error(data.error ?? '生成失敗')
            const url = data.edit_token
                ? `/trips/${data.share_id}?edit=${data.edit_token}`
                : `/trips/${data.share_id}`
            router.push(url)
        } catch (err) {
            setError(err instanceof Error ? err.message : '旅程の生成に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        {loading && <GeneratingOverlay />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* ── 目的地 ── */}
            <div style={sectionStyle}>
                <label style={labelStyle}>
                    目的地 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {destinations.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                        {destinations.map((d, i) => (
                            <span key={i} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                backgroundColor: '#eff6ff', color: '#2563eb',
                                border: '1px solid #bfdbfe', borderRadius: 20,
                                padding: '3px 10px 3px 12px', fontSize: 13, fontWeight: 500,
                            }}>
                                {d}
                                <button
                                    type="button"
                                    onClick={() => setDestinations(prev => prev.filter((_, idx) => idx !== i))}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#93c5fd', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
                                >×</button>
                            </span>
                        ))}
                    </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        type="text"
                        value={destInput}
                        onChange={e => setDestInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDestination() } }}
                        placeholder="例：沖縄、パリ、ニューヨーク（複数追加可）"
                        style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                        type="button"
                        onClick={addDestination}
                        style={{
                            padding: '0 16px', borderRadius: 10,
                            border: '1.5px solid #2563eb', background: 'white',
                            color: '#2563eb', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                        }}
                    >+ 追加</button>
                </div>
            </div>

            {/* ── 旅行期間・日程・出発地 ── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ ...sectionStyle, flexShrink: 0 }}>
                    <label style={labelStyle}>旅行期間 <span style={{ color: '#ef4444' }}>*</span></label>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 12px', border: '1.5px solid #e5e7eb',
                        borderRadius: 10, background: '#fafafa',
                    }}>
                        <button type="button" onClick={() => setDurationDays(d => Math.max(1, d - 1))}
                            style={{ width: 24, height: 24, border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            −
                        </button>
                        <span style={{ fontWeight: 700, fontSize: 15, minWidth: 64, textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {durationDays === 1 ? '日帰り' : `${durationDays - 1}泊${durationDays}日`}
                        </span>
                        <button type="button" onClick={() => setDurationDays(d => Math.min(14, d + 1))}
                            style={{ width: 24, height: 24, border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ＋
                        </button>
                    </div>
                </div>

                <div style={{ ...sectionStyle, flex: 1, minWidth: 180 }}>
                    <label style={labelStyle}>旅行日程 <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 10, textTransform: 'none' }}>任意</span></label>
                    <DatePicker value={startDate} duration={durationDays} onChange={setStartDate} />
                </div>

                <div style={{ ...sectionStyle, minWidth: 90 }}>
                    <label style={labelStyle}>出発地 <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 10, textTransform: 'none' }}>任意</span></label>
                    <input
                        type="text"
                        value={origin}
                        onChange={e => setOrigin(e.target.value)}
                        placeholder="例：東京"
                        style={{ ...inputStyle, width: 96 }}
                    />
                </div>
            </div>

            {/* ── 旅行者 ── */}
            <div style={sectionStyle}>
                <label style={labelStyle}>旅行者 <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 10, textTransform: 'none' }}>任意</span></label>
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
                    padding: '12px 14px', border: '1.5px solid #e5e7eb',
                    borderRadius: 10, background: '#fafafa',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>大人</span>
                        <Counter value={adults} onChange={setAdults} min={1} />
                    </div>
                    <div style={{ width: 1, height: 20, background: '#e5e7eb', flexShrink: 0 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>子供</span>
                        <Counter value={children} onChange={setChildren} min={0} />
                    </div>
                    <div style={{ width: 1, height: 20, background: '#e5e7eb', flexShrink: 0 }} />
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {GROUP_TYPES.map(g => (
                            <button
                                key={g.value}
                                type="button"
                                onClick={() => setGroupType(prev => prev === g.value ? '' : g.value)}
                                style={{
                                    padding: '4px 12px', borderRadius: 20, fontSize: 12,
                                    fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                                    transition: 'all 0.15s',
                                    border: groupType === g.value ? '1.5px solid #2563eb' : '1.5px solid #e5e7eb',
                                    backgroundColor: groupType === g.value ? '#eff6ff' : 'white',
                                    color: groupType === g.value ? '#2563eb' : '#6b7280',
                                }}
                            >{g.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── やりたいこと ── */}
            <div style={sectionStyle}>
                <label style={labelStyle}>やりたいこと・行きたい場所 <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 10, textTransform: 'none' }}>任意</span></label>
                <textarea
                    value={wishes}
                    onChange={e => setWishes(e.target.value)}
                    placeholder="例：海と食事を楽しみたい、美術館めぐり、絶景スポット..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'none' }}
                />
            </div>

            {/* ── 参考URL ── */}
            <div style={sectionStyle}>
                <label style={labelStyle}>参考URL <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 10, textTransform: 'none' }}>任意・最大5つ</span></label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {urls.map((url, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="url"
                                value={url}
                                onChange={e => setUrls(prev => prev.map((u, idx) => idx === i ? e.target.value : u))}
                                placeholder="https://..."
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={() => setUrls(prev => prev.filter((_, idx) => idx !== i))}
                                style={{
                                    padding: '0 14px', border: '1.5px solid #e5e7eb',
                                    borderRadius: 10, background: 'white', cursor: 'pointer',
                                    color: '#9ca3af', fontSize: 18, flexShrink: 0,
                                }}
                            >×</button>
                        </div>
                    ))}
                    {urls.length < 5 && (
                        <button
                            type="button"
                            onClick={() => setUrls(prev => [...prev, ''])}
                            style={{
                                padding: '9px 0', border: '1.5px dashed #d1d5db',
                                borderRadius: 10, background: 'white', color: '#9ca3af',
                                fontSize: 13, cursor: 'pointer', width: '100%',
                            }}
                        >+ URLを追加</button>
                    )}
                </div>
            </div>

            {/* ── エラー ── */}
            {error && (
                <div style={{
                    padding: '10px 14px', background: '#fef2f2',
                    border: '1px solid #fecaca', borderRadius: 10,
                    fontSize: 13, color: '#dc2626',
                }}>
                    {error}
                </div>
            )}

            {/* ── 送信ボタン ── */}
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    width: '100%', padding: '15px',
                    borderRadius: 12, border: 'none',
                    background: loading
                        ? '#93c5fd'
                        : 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
                    color: 'white', fontSize: 16, fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.35)',
                    transition: 'all 0.2s',
                }}
            >
                {loading ? '✈️ AIが旅程を生成中... (最大60秒)' : '✈️ 旅程を生成する'}
            </button>
        </div>
        </>
    )
}
