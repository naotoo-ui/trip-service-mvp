export default function Loading() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {/* しおりヘッダースケルトン */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-6 animate-pulse">
                <div className="h-3 bg-blue-200 rounded w-24 mb-3" />
                <div className="h-7 bg-blue-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-blue-200 rounded w-1/3" />
            </div>
            {/* タブスケルトン */}
            <div className="flex gap-2 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-9 w-20 bg-gray-200 rounded-full" />
                ))}
            </div>
            {/* カードスケルトン */}
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}
