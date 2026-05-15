import Link from 'next/link'
import PlanForm from '@/components/trips/PlanForm'
import TripCard from '@/components/trips/TripCard'
import { getRecentTrips } from '@/lib/db/trips'

export const revalidate = 60

const FEATURES = [
    { icon: '🤖', title: 'AIで自動生成',     desc: '行き先・日数・希望から実在スポットを使った旅程を数秒で作成' },
    { icon: '📅', title: 'カレンダー編集',   desc: 'Outlook風UIでドラッグ＆ドロップ・リサイズ自由自在' },
    { icon: '🗺️', title: 'Google Maps連携', desc: '日ごとのルート・スポット詳細にも地図を埋め込み' },
    { icon: '🏨', title: '宿泊管理',         desc: 'ホテル情報・予約URL・CI/CO時刻まで一括管理' },
    { icon: '🔗', title: 'URLで共有',        desc: 'リンク1つで友人・家族と共有・コピーして派生プランも' },
    { icon: '💾', title: '自動保存',         desc: '編集が止まったら自動で保存・タブを閉じても安心' },
]

const FAQS = [
    {
        q: '無料で使えますか？',
        a: 'はい。アカウント登録なしで無料で利用できます。生成された旅程はURLで共有・編集できます。',
    },
    {
        q: 'AIの精度はどれくらい？',
        a: '実在の観光地・グルメスポットを使った実用的な旅程を生成します。お好みに合わせてカレンダー上で自由に編集できます。',
    },
    {
        q: 'スマホでも使えますか？',
        a: 'はい。スマホ対応のレスポンシブデザインで、カレンダーもタッチ操作で編集できます。',
    },
    {
        q: '生成した旅程はどう保存されますか？',
        a: '自動でクラウドに保存されます。発行されたURLを保存しておけば、いつでも編集・共有できます。',
    },
]

export default async function Home() {
    const recentTrips = await getRecentTrips(8)
    const sampleTrips = recentTrips
        .filter(t => t.title?.trim() && t.destination?.trim())
        .slice(0, 6)

    return (
        <>
            {/* ────────── ヒーロー + フォーム（統合） ────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #4338ca 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* 装飾円 */}
                <div style={{
                    position: 'absolute', top: -120, right: -80,
                    width: 320, height: 320, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -60, left: -60,
                    width: 220, height: 220, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />

                <div style={{
                    maxWidth: 820, margin: '0 auto',
                    padding: '48px 16px 64px',
                    position: 'relative', zIndex: 1,
                }}>
                    {/* ── ヒーローコピー ── */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <p style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                            textTransform: 'uppercase', color: '#bfdbfe', margin: '0 0 14px',
                        }}>
                            AI Travel Planner
                        </p>
                        <h1 style={{
                            fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800,
                            lineHeight: 1.15, margin: '0 0 18px',
                            letterSpacing: '-0.02em',
                        }}>
                            旅の計画を、AIが代わりに。
                        </h1>
                        <p style={{
                            fontSize: 15, color: '#dbeafe', maxWidth: 540,
                            margin: '0 auto 24px', lineHeight: 1.65,
                        }}>
                            行き先と日数を入力するだけで、30秒で実用的な旅程ができあがります。<br />
                            カレンダーで自由に編集・URLで誰とでも共有できます。
                        </p>

                        {/* 指標バッジ */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 14,
                            padding: '8px 18px', borderRadius: 99,
                            background: 'rgba(255,255,255,0.13)',
                            backdropFilter: 'blur(6px)',
                            fontSize: 12, color: '#dbeafe', fontWeight: 500,
                            marginBottom: 16,
                        }}>
                            <span>⚡ 30秒で生成</span>
                            <span style={{ opacity: 0.4 }}>·</span>
                            <span>📝 自由に編集</span>
                            <span style={{ opacity: 0.4 }}>·</span>
                            <span>🔗 URLで共有</span>
                        </div>

                        {/* 二次CTA: /explore */}
                        <div>
                            <Link
                                href="/explore"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    fontSize: 13, color: '#bfdbfe',
                                    textDecoration: 'underline', textUnderlineOffset: 4,
                                    opacity: 0.9,
                                }}
                            >
                                🔍 先にプラン例をのぞく →
                            </Link>
                        </div>
                    </div>

                    {/* ── フォームカード（ヒーロー内に統合） ── */}
                    <div
                        id="form"
                        style={{
                            background: 'white',
                            borderRadius: 24,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.08)',
                            padding: '24px 18px 28px',
                            color: '#111827',
                            scrollMarginTop: 70,
                        }}
                    >
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            paddingBottom: 18, marginBottom: 22,
                            borderBottom: '1px solid #f3f4f6',
                        }}>
                            <span style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 20, flexShrink: 0,
                            }}>🗺️</span>
                            <div>
                                <h2 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>
                                    旅程を作成する
                                </h2>
                                <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
                                    行き先・日数・希望を入力してAIが自動生成
                                </p>
                            </div>
                        </div>
                        <PlanForm />
                    </div>
                </div>
            </section>

            {/* ────────── How it works ────────── */}
            <section style={{ background: 'white' }}>
                <div style={{ maxWidth: 920, margin: '0 auto', padding: '72px 24px 56px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 44 }}>
                        <p style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                            textTransform: 'uppercase', color: '#3b82f6', margin: '0 0 8px',
                        }}>
                            How it works
                        </p>
                        <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#111827', margin: 0 }}>
                            たった3ステップ
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid', gap: 24,
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    }}>
                        {[
                            { step: '01', icon: '✏️', title: '条件を入力', desc: '行き先・日数・やりたいことを入力するだけ' },
                            { step: '02', icon: '🤖', title: 'AIが自動生成', desc: '実在スポットを使ったリアルな旅程を数秒で作成' },
                            { step: '03', icon: '✈️', title: '旅を楽しむ', desc: 'カレンダーで編集・URLをシェアして共有' },
                        ].map(({ step, icon, title, desc }) => (
                            <div key={step} style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: 12, textAlign: 'center',
                                padding: '24px 16px',
                                background: '#f9fafb', borderRadius: 16,
                                border: '1px solid #f3f4f6',
                            }}>
                                <div style={{
                                    width: 64, height: 64,
                                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                    borderRadius: 18, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: 30,
                                }}>
                                    {icon}
                                </div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', margin: 0, letterSpacing: '0.08em' }}>
                                    STEP {step}
                                </p>
                                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', margin: 0 }}>{title}</h3>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────────── みんなのプラン ────────── */}
            {sampleTrips.length > 0 && (
                <section style={{ background: '#f9fafb' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 16px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                            marginBottom: 28, flexWrap: 'wrap', gap: 12,
                        }}>
                            <div>
                                <p style={{
                                    fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                                    textTransform: 'uppercase', color: '#3b82f6', margin: '0 0 8px',
                                }}>
                                    Inspiration
                                </p>
                                <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#111827', margin: 0 }}>
                                    📚 みんなのプラン
                                </h2>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: '8px 0 0', maxWidth: 540, lineHeight: 1.6 }}>
                                    AIが作った旅程の実例。気に入ったらコピーして自分用にカスタマイズできます。
                                </p>
                            </div>
                            <Link
                                href="/explore"
                                style={{
                                    fontSize: 13, fontWeight: 700,
                                    color: '#2563eb', textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    padding: '8px 14px', borderRadius: 10,
                                    border: '1.5px solid #bfdbfe', background: 'white',
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
                    </div>
                </section>
            )}

            {/* ────────── 機能ハイライト ────────── */}
            <section style={{ background: 'white' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 16px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 44 }}>
                        <p style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                            textTransform: 'uppercase', color: '#3b82f6', margin: '0 0 8px',
                        }}>
                            Features
                        </p>
                        <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#111827', margin: 0 }}>
                            できること
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid', gap: 16,
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    }}>
                        {FEATURES.map(f => (
                            <div key={f.title} style={{
                                padding: '22px 20px',
                                background: '#f9fafb',
                                borderRadius: 16,
                                border: '1px solid #f3f4f6',
                                display: 'flex', flexDirection: 'column', gap: 10,
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 22,
                                }}>{f.icon}</div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────────── FAQ ────────── */}
            <section style={{ background: '#f9fafb' }}>
                <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 16px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <p style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                            textTransform: 'uppercase', color: '#3b82f6', margin: '0 0 8px',
                        }}>
                            FAQ
                        </p>
                        <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: '#111827', margin: 0 }}>
                            よくある質問
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {FAQS.map((faq, i) => (
                            <details
                                key={i}
                                style={{
                                    background: 'white', borderRadius: 12,
                                    border: '1px solid #f0f0f0',
                                    overflow: 'hidden',
                                }}
                            >
                                <summary style={{
                                    padding: '16px 20px',
                                    cursor: 'pointer',
                                    fontSize: 14, fontWeight: 600, color: '#111827',
                                    listStyle: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    gap: 12,
                                }}>
                                    <span>Q. {faq.q}</span>
                                    <span className="faq-toggle" style={{ fontSize: 18, color: '#9ca3af', flexShrink: 0, width: 18, textAlign: 'center' }} />
                                </summary>
                                <div style={{
                                    padding: '0 20px 16px',
                                    fontSize: 13, color: '#4b5563', lineHeight: 1.7,
                                    borderTop: '1px solid #f3f4f6',
                                    paddingTop: 14,
                                }}>
                                    A. {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────────── 最終CTA ────────── */}
            <section style={{ background: 'white' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px 80px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
                        borderRadius: 28, padding: '52px 28px',
                        color: 'white', textAlign: 'center',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: -60, right: -60,
                            width: 220, height: 220, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)',
                        }} />
                        <div style={{
                            position: 'absolute', bottom: -50, left: -40,
                            width: 180, height: 180, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.06)',
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <p style={{ fontSize: 36, margin: '0 0 14px' }}>🌟</p>
                            <h2 style={{
                                fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800,
                                margin: '0 0 14px', letterSpacing: '-0.01em',
                            }}>
                                さあ、あなたの旅程を作ろう
                            </h2>
                            <p style={{
                                fontSize: 14, color: '#dbeafe', margin: '0 0 28px',
                                maxWidth: 480, marginInline: 'auto', lineHeight: 1.65,
                            }}>
                                AIが、あなたの旅行プランを30秒で形にします。<br />
                                悩む時間を、旅の楽しみに使いましょう。
                            </p>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link
                                    href="#form"
                                    style={{
                                        display: 'inline-block',
                                        padding: '14px 32px', borderRadius: 12,
                                        background: 'white',
                                        color: '#2563eb', fontSize: 15, fontWeight: 800,
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
                                    }}
                                >
                                    旅程を作る →
                                </Link>
                                <Link
                                    href="/explore"
                                    style={{
                                        display: 'inline-block',
                                        padding: '14px 24px', borderRadius: 12,
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(4px)',
                                        color: 'white', fontSize: 14, fontWeight: 700,
                                        textDecoration: 'none',
                                        border: '1.5px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    プラン例を見る
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
