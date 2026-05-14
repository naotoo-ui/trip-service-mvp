'use client'
import { useState } from 'react'

export default function ShareButton({ shareId }: { shareId: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        const url = `${window.location.origin}/trips/${shareId}`
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                border: copied ? 'none' : '1px solid #d1d5db',
                backgroundColor: copied ? '#10b981' : 'white',
                color: copied ? 'white' : '#6b7280',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'background-color 0.15s, color 0.15s',
            }}
        >
            {copied ? '✓ コピー済み' : '🔗 シェア'}
        </button>
    )
}
