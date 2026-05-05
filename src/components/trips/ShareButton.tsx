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
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all ${
                copied
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 bg-white'
            }`}
        >
            {copied ? (
                <>✓ URLをコピーしました！</>
            ) : (
                <>🔗 この旅程をシェアする</>
            )}
        </button>
    )
}
