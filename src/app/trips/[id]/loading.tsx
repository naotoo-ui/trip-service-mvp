export default function Loading() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <div className="animate-pulse space-y-6">
                <div>
                    <div className="h-7 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-4/6" />
                    </div>
                ))}
                <div className="h-12 bg-gray-200 rounded mt-8" />
            </div>
        </main>
    )
}
