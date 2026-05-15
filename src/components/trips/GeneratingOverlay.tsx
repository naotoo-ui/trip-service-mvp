'use client'
import { useState, useEffect } from 'react'

const STEPS = [
    { label: '目的地・条件を解析中' },
    { label: '最適なルートを検索中' },
    { label: '観光スポットを選定中' },
    { label: 'グルメ・宿泊を手配中' },
    { label: '旅程を仕上げています' },
]

const TIPS = [
    '最適な組み合わせをAIが考えています ✨',
    '地元の人気スポットもチェック中です 📍',
    'あなただけの旅程を作っています 🗺️',
    '移動時間も考慮して計算しています 🚌',
    'もう少しお待ちください ☕',
]

// 各ステップが完了するまでの秒数（合計 ~55秒）
const STEP_DURATIONS = [8, 12, 12, 13, 10]

export default function GeneratingOverlay() {
    const [currentStep, setCurrentStep] = useState(0)
    const [tipIdx, setTipIdx]           = useState(0)
    const [elapsed, setElapsed]         = useState(0)

    useEffect(() => {
        const timer = setInterval(() => setElapsed(s => s + 1), 1000)
        return () => clearInterval(timer)
    }, [])

    // ステップを順に進める
    useEffect(() => {
        let total = 0
        for (let i = 0; i < STEPS.length - 1; i++) {
            total += STEP_DURATIONS[i]
            if (elapsed < total) { setCurrentStep(i); return }
        }
        setCurrentStep(STEPS.length - 1)
    }, [elapsed])

    // Tips をローテーション
    useEffect(() => {
        const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 5000)
        return () => clearInterval(t)
    }, [])

    const progressPct = Math.min(92, (elapsed / 58) * 92)

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(248,247,244,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
        }}>
            <div style={{
                background: 'white',
                borderRadius: 24,
                padding: '40px 36px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                width: '100%',
                maxWidth: 380,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
            }}>

                {/* スピナー + 飛行機 */}
                <div style={{ position: 'relative', width: 80, height: 80 }}>
                    {/* 外側リング */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: '3px solid #e0e7ff',
                    }} />
                    {/* 回転する弧 */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: '3px solid transparent',
                        borderTopColor: '#2563eb',
                        borderRightColor: '#818cf8',
                        animation: 'spin-ring 1.2s linear infinite',
                    }} />
                    {/* 内側の飛行機 */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28,
                        animation: 'float-plane 2.4s ease-in-out infinite',
                    }}>✈️</div>
                </div>

                {/* タイトル */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                        AIが旅程を生成しています
                    </p>
                    {/* バウンドドット */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                        {[0, 1, 2].map(i => (
                            <span key={i} style={{
                                display: 'inline-block',
                                width: 6, height: 6,
                                borderRadius: '50%',
                                backgroundColor: '#2563eb',
                                animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                            }} />
                        ))}
                    </div>
                </div>

                {/* プログレスバー */}
                <div style={{ width: '100%' }}>
                    <div style={{
                        height: 6, backgroundColor: '#e0e7ff',
                        borderRadius: 99, overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progressPct}%`,
                            borderRadius: 99,
                            background: 'linear-gradient(90deg, #2563eb, #818cf8, #2563eb)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s linear infinite',
                            transition: 'width 1s ease-out',
                        }} />
                    </div>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '5px 0 0', textAlign: 'right' }}>
                        最大60秒ほどかかる場合があります
                    </p>
                </div>

                {/* ステップ一覧 */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {STEPS.map((step, i) => {
                        const done    = i < currentStep
                        const active  = i === currentStep
                        const pending = i > currentStep
                        return (
                            <div
                                key={i}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    opacity: pending ? 0.35 : 1,
                                    animation: active ? 'fade-in-up 0.4s ease' : 'none',
                                }}
                            >
                                {/* アイコン */}
                                <div style={{
                                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: done ? '#2563eb' : active ? '#eff6ff' : '#f3f4f6',
                                    border: active ? '2px solid #2563eb' : 'none',
                                }}>
                                    {done ? (
                                        <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>
                                    ) : active ? (
                                        <div style={{
                                            width: 10, height: 10, borderRadius: '50%',
                                            border: '2px solid transparent',
                                            borderTopColor: '#2563eb',
                                            animation: 'spin-ring 0.8s linear infinite',
                                        }} />
                                    ) : (
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#d1d5db' }} />
                                    )}
                                </div>
                                {/* ラベル */}
                                <span style={{
                                    fontSize: 13, fontWeight: active ? 600 : 400,
                                    color: done ? '#374151' : active ? '#111827' : '#9ca3af',
                                }}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* ヒントメッセージ */}
                <div style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: 10,
                    border: '1px solid #bae6fd',
                }}>
                    <p key={tipIdx} style={{
                        fontSize: 12, color: '#0369a1', margin: 0, textAlign: 'center',
                        animation: 'fade-in-up 0.5s ease',
                    }}>
                        {TIPS[tipIdx]}
                    </p>
                </div>

            </div>
        </div>
    )
}
