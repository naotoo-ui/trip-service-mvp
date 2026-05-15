'use client'
import { useState } from 'react'
import type { Spot, SpotType } from '@/types'

function toMinsLocal(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + (m || 0)
}
function toTimeLocal(mins: number): string {
    const clamped = Math.max(0, Math.min(1439, mins))
    return `${String(Math.floor(clamped / 60)).padStart(2, '0')}:${String(clamped % 60).padStart(2, '0')}`
}

const SPOT_STYLES: Record<SpotType, { accent: string; bg: string; border: string; text: string }> = {
    観光:   { accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    グルメ: { accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
    移動:   { accent: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' },
    宿泊:   { accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
    その他: { accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
}
const SPOT_TYPES: SpotType[] = ['観光', 'グルメ', '移動', '宿泊', 'その他']

const fieldLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: '#6b7280',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'block', marginBottom: 8,
}
const inputBase: React.CSSProperties = {
    padding: '8px 10px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 13, outline: 'none',
    background: '#fafafa', fontFamily: 'inherit',
}

interface Props {
    spot: Spot
    onSave: (updated: Spot) => void
    onCancel: () => void
}

export default function SpotDetailModal({ spot, onSave, onCancel }: Props) {
    const [name, setName]                     = useState(spot.name)
    const [type, setType]                     = useState<SpotType>(spot.type)
    const [depTime, setDepTime]               = useState(spot.time)
    const [arrTime, setArrTime]               = useState(toTimeLocal(toMinsLocal(spot.time) + (spot.duration_minutes || 60)))
    const [needsBooking, setNeedsBooking]     = useState(spot.needs_booking ?? false)
    const [bookingConfirmed, setBookingConf]  = useState(spot.booking_confirmed ?? false)
    const [memo, setMemo]                     = useState(spot.memo ?? '')
    const [userLinks, setUserLinks]           = useState<string[]>(spot.user_links ?? [])

    const st = SPOT_STYLES[type] ?? SPOT_STYLES['その他']
    const isTransit = type === '移動'
    const durStep = isTransit ? 1 : 10
    // duration は depTime と arrTime から導出。発を変えると所要時間が変わり、着を変えると所要時間が変わる
    const duration = Math.max(1, toMinsLocal(arrTime) - toMinsLocal(depTime))

    function handleSave() {
        const cleanLinks = userLinks.filter(l => l.trim())
        onSave({
            ...spot,
            name: name.trim() || spot.name,
            type,
            time: isTransit ? depTime : spot.time,
            duration_minutes: duration,
            needs_booking: needsBooking || undefined,
            booking_confirmed: bookingConfirmed || undefined,
            memo: memo.trim() || undefined,
            user_links: cleanLinks.length ? cleanLinks : undefined,
        })
    }

    return (
        /* オーバーレイ */
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 2000,
                backgroundColor: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
            }}
            onClick={e => { if (e.target === e.currentTarget) onCancel() }}
        >
            {/* モーダルカード */}
            <div style={{
                background: 'white', borderRadius: 20,
                maxWidth: 480, width: '100%',
                maxHeight: '85vh', overflowY: 'auto',
                overscrollBehavior: 'contain',
                boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
            }}>
                {/* ヘッダー */}
                <div style={{
                    background: st.bg, borderRadius: '20px 20px 0 0',
                    padding: '20px 24px 16px',
                    borderBottom: `3px solid ${st.accent}`,
                }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: st.text, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                        スポット詳細
                    </p>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{
                            width: '100%', fontSize: 18, fontWeight: 700, color: '#111827',
                            border: 'none', outline: 'none', background: 'transparent',
                            boxSizing: 'border-box', fontFamily: 'inherit', padding: 0,
                        }}
                    />
                    <p style={{ fontSize: 12, color: st.text, margin: '6px 0 0', opacity: 0.8 }}>
                        {isTransit
                            ? `🚌 ${depTime} → ${arrTime}  ·  ${duration}分`
                            : `🕐 ${spot.time}  ·  ${spot.duration_minutes}分`}
                    </p>
                </div>

                {/* ボディ */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* 種別 */}
                    <div>
                        <label style={fieldLabel}>種別</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {SPOT_TYPES.map(t => {
                                const s = SPOT_STYLES[t]
                                return (
                                    <button key={t} type="button" onClick={() => setType(t)} style={{
                                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                        cursor: 'pointer',
                                        border: `1.5px solid ${type === t ? s.accent : '#e5e7eb'}`,
                                        backgroundColor: type === t ? s.bg : 'white',
                                        color: type === t ? s.accent : '#6b7280',
                                    }}>{t}</button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 発着時刻（移動ブロックのみ）*/}
                    {isTransit && (
                        <div>
                            <label style={fieldLabel}>発着時刻</label>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>発</span>
                                    <input
                                        type="time"
                                        value={depTime}
                                        onChange={e => {
                                            if (!e.target.value) return
                                            // 発を変更 → 着は固定 → 所要時間が変わる
                                            setDepTime(e.target.value)
                                        }}
                                        style={{ ...inputBase, width: 110, fontVariantNumeric: 'tabular-nums' }}
                                    />
                                </div>
                                <span style={{ fontSize: 18, color: '#d1d5db', paddingBottom: 8 }}>→</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>着</span>
                                    <input
                                        type="time"
                                        value={arrTime}
                                        onChange={e => {
                                            // 着を変更 → 発は固定 → 所要時間が変わる
                                            if (e.target.value) setArrTime(e.target.value)
                                        }}
                                        style={{ ...inputBase, width: 110, fontVariantNumeric: 'tabular-nums' }}
                                    />
                                </div>
                            </div>
                            <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0' }}>
                                発を変えると着は固定・所要時間が変わります
                            </p>
                        </div>
                    )}

                    {/* 所要時間 */}
                    <div>
                        <label style={fieldLabel}>所要時間</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                                type="button"
                                onClick={() => {
                                    // 所要時間を減らす → 発は固定 → 着が前にずれる
                                    const newDur = Math.max(durStep, duration - durStep)
                                    setArrTime(toTimeLocal(toMinsLocal(depTime) + newDur))
                                }}
                                style={{ width: 30, height: 30, border: '1.5px solid #e5e7eb', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >−</button>
                            <input
                                type="number"
                                value={duration}
                                min={isTransit ? 1 : 10}
                                max={1440}
                                step={durStep}
                                onChange={e => {
                                    const v = parseInt(e.target.value) || durStep
                                    const newDur = isTransit ? Math.max(1, v) : Math.max(10, Math.round(v / 10) * 10)
                                    setArrTime(toTimeLocal(toMinsLocal(depTime) + newDur))
                                }}
                                style={{
                                    ...inputBase, width: 72, textAlign: 'center',
                                    fontVariantNumeric: 'tabular-nums', fontWeight: 600,
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    // 所要時間を増やす → 発は固定 → 着が後ろにずれる
                                    const newDur = Math.min(1440, duration + durStep)
                                    setArrTime(toTimeLocal(toMinsLocal(depTime) + newDur))
                                }}
                                style={{ width: 30, height: 30, border: '1.5px solid #e5e7eb', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >＋</button>
                            <span style={{ fontSize: 13, color: '#6b7280' }}>分</span>
                            {isTransit && (
                                <span style={{ fontSize: 11, color: '#9ca3af' }}>（1分単位）</span>
                            )}
                        </div>
                    </div>

                    {/* 説明 */}
                    {spot.description && (
                        <div>
                            <label style={fieldLabel}>説明</label>
                            <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.6 }}>{spot.description}</p>
                        </div>
                    )}

                    {/* 予約 */}
                    <div>
                        <label style={fieldLabel}>予約</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={needsBooking}
                                    onChange={e => { setNeedsBooking(e.target.checked); if (!e.target.checked) setBookingConf(false) }}
                                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: 14, color: '#374151' }}>予約が必要</span>
                            </label>
                            {needsBooking && (
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginLeft: 26 }}>
                                    <input
                                        type="checkbox"
                                        checked={bookingConfirmed}
                                        onChange={e => setBookingConf(e.target.checked)}
                                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#10b981' }}
                                    />
                                    <span style={{ fontSize: 14, fontWeight: bookingConfirmed ? 600 : 400, color: bookingConfirmed ? '#10b981' : '#374151' }}>
                                        {bookingConfirmed ? '✓ 予約済み' : '予約済みにする'}
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* リンク */}
                    <div>
                        <label style={fieldLabel}>参考リンク</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {userLinks.map((link, i) => (
                                <div key={i} style={{ display: 'flex', gap: 6 }}>
                                    <input
                                        type="url"
                                        value={link}
                                        onChange={e => setUserLinks(prev => prev.map((l, li) => li === i ? e.target.value : l))}
                                        placeholder="https://..."
                                        style={{ ...inputBase, flex: 1 }}
                                    />
                                    <button type="button"
                                        onClick={() => setUserLinks(prev => prev.filter((_, li) => li !== i))}
                                        style={{ padding: '0 12px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', color: '#9ca3af', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
                                    >×</button>
                                </div>
                            ))}
                            {userLinks.length < 5 && (
                                <button type="button"
                                    onClick={() => setUserLinks(prev => [...prev, ''])}
                                    style={{ padding: '8px', border: '1.5px dashed #d1d5db', borderRadius: 8, background: 'white', color: '#9ca3af', fontSize: 12, cursor: 'pointer' }}
                                >+ リンクを追加</button>
                            )}
                        </div>
                    </div>

                    {/* メモ / ルートメモ */}
                    <div>
                        <label style={fieldLabel}>{isTransit ? 'ルートメモ' : 'メモ'}</label>
                        <textarea
                            value={memo}
                            onChange={e => setMemo(e.target.value)}
                            placeholder={isTransit ? '例：京都駅 → 金閣寺：バス30分、¥230' : '自由にメモを記入...'}
                            rows={3}
                            style={{ ...inputBase, resize: 'none', width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Google Maps プレビュー（移動ブロック以外）*/}
                    {!isTransit && (
                        <div>
                            <label style={fieldLabel}>地図</label>
                            <iframe
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                    spot.address ? `${spot.name} ${spot.address}` : spot.name
                                )}&output=embed&hl=ja&z=16`}
                                width="100%"
                                height="200"
                                style={{ border: 0, borderRadius: 8, display: 'block' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    )}
                </div>

                {/* フッター */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid #f3f4f6',
                    display: 'flex', gap: 8, justifyContent: 'flex-end',
                }}>
                    <button type="button" onClick={onCancel} style={{
                        padding: '9px 20px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                        background: 'white', color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>キャンセル</button>
                    <button type="button" onClick={handleSave} style={{
                        padding: '9px 24px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #2563eb, #4338ca)',
                        color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                    }}>OK</button>
                </div>
            </div>
        </div>
    )
}
