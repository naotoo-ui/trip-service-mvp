import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10 text-center">
            <h1 className="text-2xl font-bold mb-2">旅程が見つかりません</h1>
            <p className="text-gray-500 mb-8">URLが間違っているか、旅程が削除された可能性があります。</p>
            <Link
                href="/"
                className="inline-block bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
                トップへ戻る
            </Link>
        </main>
    )
}
