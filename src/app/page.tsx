import GenerateForm from '@/components/trips/GenerateForm'

export default function Home() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-2">旅程ジェネレーター</h1>
            <p className="text-center text-gray-500 mb-8">
                AIが旅行プランを自動で作成します
            </p>
            <section>
                <h2 className="text-lg font-semibold mb-4">条件から作成</h2>
                <GenerateForm />
            </section>
        </main>
    )
}
