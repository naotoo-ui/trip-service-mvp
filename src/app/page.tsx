import PlanForm from '@/components/trips/PlanForm'

export default function Home() {
    return (
        <>
            {/* ヒーローセクション */}
            <section style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #4338ca 100%)',
                color: 'white',
            }}>
                <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 24px 80px', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#bfdbfe', marginBottom: 12 }}>
                        AI Travel Planner
                    </p>
                    <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
                        旅の計画を、AIが代わりに。
                    </h1>
                    <p style={{ fontSize: 15, color: '#dbeafe', maxWidth: 400, margin: '0 auto' }}>
                        行き先・日数・やりたいことを入力するだけで、AIがリアルな旅程を自動作成します。
                    </p>
                </div>
            </section>

            {/* フォームカード */}
            <section style={{ maxWidth: 680, margin: '-48px auto 0', padding: '0 12px' }}>
                <div style={{
                    background: 'white',
                    borderRadius: 20,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                    border: '1px solid #f0f0f0',
                    padding: '20px 16px 24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                        <span style={{ fontSize: 24 }}>🗺️</span>
                        <div>
                            <h2 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>旅程を作成する</h2>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>行き先・日数・希望を入力してAIが自動生成</p>
                        </div>
                    </div>
                    <PlanForm />
                </div>
            </section>

            {/* 使い方ガイド */}
            <section style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px' }}>
                <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 36 }}>
                    How it works
                </p>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { step: '01', icon: '✏️', title: '条件を入力', desc: '行き先・日数・やりたいことを入力するだけ' },
                        { step: '02', icon: '🤖', title: 'AIが自動生成', desc: '実在スポットを使ったリアルな旅程を数秒で作成' },
                        { step: '03', icon: '✈️', title: '旅を楽しむ', desc: 'URLをシェアして一緒に旅行計画を共有' },
                    ].map(({ step, icon, title, desc }) => (
                        <div key={step} style={{ flex: '1 1 160px', maxWidth: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                            <div style={{ width: 52, height: 52, background: '#eff6ff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                {icon}
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', margin: 0 }}>{step}</p>
                            <h3 style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>{title}</h3>
                            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
