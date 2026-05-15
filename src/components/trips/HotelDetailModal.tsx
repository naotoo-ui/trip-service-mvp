'use client'
import { useState } from 'react'
import type { HotelInfo } from '@/types'

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
    hotel: HotelInfo | undefined
    dayLabel: string
    onSave: (hotel: HotelInfo) => void
    onDelete: () => void
    onCancel: () => void
}

export default function HotelDetailModal({ hotel, dayLabel, onSave, onDelete, onCancel }: Props) {
    const [name, setName]             = useState(hotel?.name ?? '')
    const [address, setAddress]       = useState(hotel?.address ?? '')
    const [checkIn, setCheckIn]       = useState(hotel?.check_in ?? '15:00')
    const [checkOut, setCheckOut]     = useState(hotel?.check_out ?? '11:00')
    const [price, setPrice]           = useState<string>(hotel?.price_per_night ? String(hotel.price_per_night) : '')
    const [confirmed, setConfirmed]   = useState(hotel?.booking_confirmed ?? false)
    const [bookingUrl, setBookingUrl] = useState(hotel?.booking_url ?? '')
    const [memo, setMemo]             = useState(hotel?.memo ?? '')

    function handleSave() {
        if (!name.trim()) return
        onSave({
            name: name.trim(),
            address: address.trim() || undefined,
            check_in: checkIn || undefined,
            check_out: checkOut || undefined,
            price_per_night: price ? parseInt(price) : undefined,
            booking_confirmed: confirmed || undefined,
            booking_url: bookingUrl.trim() || undefined,
            memo: memo.trim() || undefined,
        })
    }

    const mapsQuery = name.trim()
        ? encodeURIComponent(address.trim() ? `${name.trim()} ${address.trim()}` : name.trim())
        : null

    return (
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
            <div style={{
                background: 'white', borderRadius: 20,
                maxWidth: 480, width: '100%',
                maxHeight: '88vh', overflowY: 'auto',
                overscrollBehavior: 'contain',
                boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
            }}>
                {/* ヘッダー */}
                <div style={{
                    background: '#f5f3ff', borderRadius: '20px 20px 0 0',
                    padding: '20px 24px 16px',
                    borderBottom: '3px solid #7c3aed',
                }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                        🏨 宿泊情報 — {dayLabel}
                    </p>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="ホテル名・宿泊施設名"
                        style={{
                            width: '100%', fontSize: 18, fontWeight: 700, color: '#111827',
                            border: 'none', outline: 'none', background: 'transparent',
                            boxSizing: 'border-box', fontFamily: 'inherit', padding: 0,
                        }}
                    />
                </div>

                {/* ボディ */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* 住所 */}
                    <div>
                        <label style={fieldLabel}>住所</label>
                        <input
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="例：那覇市松山1丁目"
                            style={{ ...inputBase, width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* チェックイン・アウト */}
                    <div>
                        <label style={fieldLabel}>チェックイン / アウト</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>IN</span>
                                <input
                                    type="time"
                                    value={checkIn}
                                    onChange={e => setCheckIn(e.target.value)}
                                    style={{ ...inputBase, width: 110, fontVariantNumeric: 'tabular-nums' }}
                                />
                            </div>
                            <span style={{ fontSize: 18, color: '#d1d5db', paddingTop: 18 }}>→</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>OUT</span>
                                <input
                                    type="time"
                                    value={checkOut}
                                    onChange={e => setCheckOut(e.target.value)}
                                    style={{ ...inputBase, width: 110, fontVariantNumeric: 'tabular-nums' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 料金/泊 */}
                    <div>
                        <label style={fieldLabel}>料金 / 泊</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="例：12000"
                                min={0}
                                style={{ ...inputBase, width: 140, fontVariantNumeric: 'tabular-nums' }}
                            />
                            <span style={{ fontSize: 13, color: '#6b7280' }}>円</span>
                        </div>
                    </div>

                    {/* 予約 */}
                    <div>
                        <label style={fieldLabel}>予約</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={confirmed}
                                    onChange={e => setConfirmed(e.target.checked)}
                                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#10b981' }}
                                />
                                <span style={{ fontSize: 14, fontWeight: confirmed ? 600 : 400, color: confirmed ? '#10b981' : '#374151' }}>
                                    {confirmed ? '✓ 予約済み' : '予約済みにする'}
                                </span>
                            </label>
                            <input
                                type="url"
                                value={bookingUrl}
                                onChange={e => setBookingUrl(e.target.value)}
                                placeholder="予約サイトURL（じゃらん・楽天トラベル等）"
                                style={{ ...inputBase, width: '100%', boxSizing: 'border-box' }}
                            />
                            {bookingUrl && (
                                <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 12, color: '#2563eb', textDecoration: 'underline', textUnderlineOffset: 2 }}
                                >
                                    予約ページを開く →
                                </a>
                            )}
                        </div>
                    </div>

                    {/* メモ */}
                    <div>
                        <label style={fieldLabel}>メモ</label>
                        <textarea
                            value={memo}
                            onChange={e => setMemo(e.target.value)}
                            placeholder="駐車場・朝食・アクセス方法など"
                            rows={3}
                            style={{ ...inputBase, resize: 'none', width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Google Maps プレビュー */}
                    {mapsQuery && (
                        <div>
                            <label style={fieldLabel}>地図</label>
                            <iframe
                                src={`https://maps.google.com/maps?q=${mapsQuery}&output=embed&hl=ja&z=16`}
                                style={{ border: 0, borderRadius: 8, display: 'block', width: '100%', aspectRatio: '1 / 1' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    )}
                </div>

                {/* フッター */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid #f3f4f6',
                    display: 'flex', gap: 8, justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {hotel ? (
                        <button type="button" onClick={onDelete} style={{
                            padding: '8px 14px', borderRadius: 10,
                            border: '1.5px solid #fecaca',
                            background: 'white', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>削除</button>
                    ) : (
                        <div />
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" onClick={onCancel} style={{
                            padding: '9px 20px', borderRadius: 10, border: '1.5px solid #e5e7eb',
                            background: 'white', color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>キャンセル</button>
                        <button type="button" onClick={handleSave} disabled={!name.trim()} style={{
                            padding: '9px 24px', borderRadius: 10, border: 'none',
                            background: name.trim() ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#e5e7eb',
                            color: name.trim() ? 'white' : '#9ca3af',
                            fontSize: 13, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'not-allowed',
                            boxShadow: name.trim() ? '0 2px 8px rgba(124,58,237,0.3)' : 'none',
                        }}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
