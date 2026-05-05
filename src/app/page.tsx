import GenerateForm from '@/components/trips/GenerateForm'
import UrlForm from '@/components/trips/UrlForm'

export default function Home() {
    return (
        <>
            {/* ヒーローセクション */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                    <p className="text-blue-200 text-sm font-medium tracking-widest uppercase mb-3">AI Travel Planner</p>
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        旅の計画を、<br className="sm:hidden" />AIが代わりに。
                    </h1>
                    <p className="text-blue-100 text-base max-w-md mx-auto">
                        行き先と日数を入力するだけで、AIがリアルな旅程を自動生成します。
                        旅行ブログのURLからも作成できます。
                    </p>
                </div>
            </section>

            {/* フォームセクション */}
            <section className="max-w-3xl mx-auto px-4 -mt-6">
                <div className="grid sm:grid-cols-2 gap-4">
                    {/* 条件から作成 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-2xl">🗺️</span>
                            <div>
                                <h2 className="font-bold text-gray-900">条件から作成</h2>
                                <p className="text-xs text-gray-400">行き先・日数・希望を入力</p>
                            </div>
                        </div>
                        <GenerateForm />
                    </div>

                    {/* URLから作成 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-2xl">📰</span>
                            <div>
                                <h2 className="font-bold text-gray-900">ブログから作成</h2>
                                <p className="text-xs text-gray-400">旅行記事のURLを貼り付け</p>
                            </div>
                        </div>
                        <UrlForm />
                    </div>
                </div>
            </section>

            {/* 使い方ガイド */}
            <section className="max-w-3xl mx-auto px-4 py-16">
                <h2 className="text-center text-sm font-medium text-gray-400 tracking-widest uppercase mb-8">How it works</h2>
                <div className="grid sm:grid-cols-3 gap-6 text-center">
                    {[
                        { step: '01', icon: '✏️', title: '条件を入力', desc: '行き先・日数・やりたいことを入力するだけ' },
                        { step: '02', icon: '🤖', title: 'AIが自動生成', desc: '実在スポットを使ったリアルな旅程を数秒で作成' },
                        { step: '03', icon: '✈️', title: '旅を楽しむ', desc: 'URLをシェアして一緒に旅行計画を共有' },
                    ].map(({ step, icon, title, desc }) => (
                        <div key={step} className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">
                                {icon}
                            </div>
                            <p className="text-xs text-blue-500 font-bold">{step}</p>
                            <h3 className="font-semibold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
