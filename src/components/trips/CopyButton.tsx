'use client'
import { useState } from 'react'

export default function CopyButton({ shareId }: { shareId: string }) {
    const [status, setStatus] = useState<'idle' | 'copying' | 'done' | 'error'>('idle')

    async function handleCopy() {
        if (status === 'copying') return
        setStatus('copying')
        try {
            const res = await fetch('/api/trips/copy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ share_id: shareId }),
            })
            const text = await res.text()
            let data: { share_id?: string; error?: string }
            try { data = JSON.parse(text) } catch { throw new Error(`サーバーエラー: ${text.slice(0, 120)}`) }
            if (!res.ok || !data.share_id) throw new Error(data.error ?? 'コピーに失敗しました')
            setStatus('done')
            // 少し待ってからリダイレクト（"完了" を見せる）
            setTimeout(() => {
                window.location.href = `/trips/${data.share_id}`
            }, 600)
        } catch {
            setStatus('error')
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    const label =
        status === 'copying' ? '⏳ コピー中...' :
        status === 'done'    ? '✓ コピー完了！' :
        status === 'error'   ? '✗ エラー（再試行）' :
        '📋 コピーして使う'

    const bg =
        status === 'done'  ? '#10b981' :
        status === 'error' ? '#ef4444' :
        'white'

    const color =
        status === 'done' || status === 'error' ? 'white' : '#374151'

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={status === 'copying' || status === 'done'}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                border: status === 'done' || status === 'error' ? 'none' : '1px solid #d1d5db',
                backgroundColor: bg,
                color,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: status === 'copying' || status === 'done' ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'background-color 0.15s, color 0.15s',
                opacity: status === 'copying' ? 0.7 : 1,
            }}
        >
            {label}
        </button>
    )
}
