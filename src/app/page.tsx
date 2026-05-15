import Link from 'next/link'
import PlanForm from '@/components/trips/PlanForm'
import TripCard from '@/components/trips/TripCard'
import { getRecentTrips } from '@/lib/db/trips'

export const revalidate = 60

export default async function Home() {
    const recentTrips = await getRecentTrips(8)
    const sampleTrips = recentTrips
        .filter(t => t.title?.trim() && t.destination?.trim())
        .slice(0, 6)

    return (
        <>
            {/* ── ヒーロー ── */}
            <section style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #4338ca 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* 装飾 */}
                <div style={{
                    position: 'absolute', top: -80, right: -60,
                    width: 240, height: 240, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -40, left: -40,
                    width: 160, height: 160, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />

                <div style={{
                    maxWidth: 720, margin: '0 auto',
                    padding: '56px 24px 80px', textAlign: 'center',
                    position: 'relative', zIndex: 1,
                }}>
                    <p style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: '#bfdbfe', marginBottom: 12,
                    }}>
                        AI Travel Planner
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800,
                        lineHeight: 1.2, marginBottom: 16,
                    }}>
                        旅の計画を、AIが代わりに。
                    </h1>
                    <p style={{
                        fontSize: 15, color: '#dbeafe', maxWidth: 480, margin: '0 auto 22px',
                        lineHeight: 1.6,
                    }}>
                        行き先と日数を入力するだけで、30秒で実用的な旅程ができあがります。<br />
                        カレンダーで自由に編集・URL で誰とでも共有できます。
                    </p>

                    {/* 指標 */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 16,
                        padding: '8px 16px', borderRadius: 99,
                        background: 'rgba(255,255,255,0.12)',
                        fontSize: 12, color: '#dbeafe',
                        backdropFilter: 'blur(6px)',
                    }}>
                        <span>⚡ 約30秒で生成</span>
                        <span style={{ opacity: 0.5 }}>·</span>
                        <span>📝 自由に編集</span>
                        <span style={{ opacity: 0.5 }}>·</span>
                        <span>🔗 URLで共有</span>
                    </div>
                </div>
            </section>

            {/* ── フォームカード ── */}
            <section id="form" style={{ maxWidth: 720, margin: '-48px auto 0', padding: '0 12px' }}>
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

            {/* ── 使い方ガイド ── */}
            <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 24px' }}>
                <p style={{
                    textAlign: 'center', fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#9ca3af', marginBottom: 36,
                }}>
                    How it works
                </p>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[
                        { step: '01', icon: '✏️', title: '条件を入力', desc: '行き先・日数・やりたいことを入力するだけ' },
                        { step: '02', icon: '🤖', title: 'AIが自動生成', desc: '実在スポットを使ったリアルな旅程を数秒で作成' },
                        { step: '03', icon: '✈️', title: '旅を楽しむ', desc: 'カレンダーで編集・URLをシェアして共有' },
                    ].map(({ step, icon, title, desc }) => (
                        <div key={step} style={{
                            flex: '1 1 180px', maxWidth: 220,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 10, textAlign: 'center',
                        }}>
                            <div style={{
                                width: 56, height: 56, background: '#eff6ff',
                                borderRadius: 16, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: 26,
                            }}>
                                {icon}
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', margin: 0, letterSpacing: '0.06em' }}>{step}</p>
                            <h3 style={{ fontWeight: 700, fontSize: 14, color: '#111827', margin: 0 }}>{title}</h3>
                            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── みんなのプラン ── */}
            {sampleTrips.length > 0 && (
                <section style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 16px 24px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                        marginBottom: 20, flexWrap: 'wrap', gap: 8,
                    }}>
                        <div>
                            <p style={{
                                fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                                textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 6px',
                            }}>
                                Inspiration
                            </p>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>
                                📚 みんなのプラン
                            </h2>
                            <p style={{ fontSize: 13, color: '#6b7280', margin: '6px 0 0' }}>
                                AIが作った旅程の実例。気に入ったらコピーして自分用にできます。
                            </p>
                        </div>
                        <Link
                            href="/explore"
                            style={{
                                fontSize: 13, fontWeight: 600,
                                color: '#2563eb', textDecoration: 'none',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            すべて見る →
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid', gap: 16,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    }}>
                        {sampleTrips.map(trip => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── 最終 CTA ── */}
            <section style={{
                maxWidth: 1100, margin: '0 auto',
                padding: '40px 16px 80px',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
                    borderRadius: 24, padding: '48px 28px',
                    color: 'white', textAlign: 'center',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: -50, right: -50,
                        width: 180, height: 180, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -40, left: -30,
                        width: 140, height: 140, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p style={{ fontSize: 36, margin: '0 0 14px' }}>🌟</p>
                        <h2 style={{
                            fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800,
                            margin: '0 0 12px',
                        }}>
                            さあ、あなたの旅程を作ろう
                        </h2>
                        <p style={{
                            fontSize: 14, color: '#dbeafe', margin: '0 0 24px',
                            maxWidth: 480, marginInline: 'auto', lineHeight: 1.6,
                        }}>
                            AIが、あなたの旅行プランを30秒で形にします。<br />
                            悩む時間を、旅の楽しみに使いましょう。
                        </p>
                        <Link
                            href="#form"
                            style={{
                                display: 'inline-block',
                                padding: '13px 32px', borderRadius: 12,
                                background: 'white',
                                color: '#2563eb', fontSize: 15, fontWeight: 800,
                                textDecoration: 'none',
                                boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
                            }}
                        >
                            旅程を作る →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
