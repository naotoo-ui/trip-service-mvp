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
            onClick={handleCopy}
            className="w-full border border-blue-600 text-blue-600 rounded-lg py-3 font-medium hover:bg-blue-50 transition-colors"
        >
            {copied ? '✓ コピーしました！' : 'このURLをシェアする'}
        </button>
    )
}
