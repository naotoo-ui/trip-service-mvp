import GenerateForm from '@/components/trips/GenerateForm'
import UrlForm from '@/components/trips/UrlForm'

export default function Home() {
    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-2">旅程ジェネレーター</h1>
            <p className="text-center text-gray-500 mb-8">
                AIが旅行プランを自動で作成します
            </p>
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4">条件から作成</h2>
                <GenerateForm />
            </section>
            <hr className="border-gray-200 mb-10" />
            <section>
                <h2 className="text-lg font-semibold mb-1">ブログ記事から作成</h2>
                <p className="text-sm text-gray-500 mb-4">旅行ブログのURLを入力すると、記事の内容から旅程を自動生成します</p>
                <UrlForm />
            </section>
        </main>
    )
}
