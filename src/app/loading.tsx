export default function Loading() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-48 bg-gray-200 rounded mt-8" />
            </div>
        </main>
    )
}
