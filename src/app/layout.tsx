import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import Link from "next/link"
import { Analytics } from '@vercel/analytics/next'
import RecentTripsButton from '@/components/trips/RecentTripsButton'
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
    title: "旅程ジェネレーター",
    description: "AIが旅行プランを自動で作成します。行き先・日数・やりたいことを入力するか、旅行ブログのURLを貼り付けるだけで旅程を生成します。",
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? `https://${process.env.VERCEL_URL ?? 'localhost:3000'}`
    ),
    openGraph: {
        siteName: '旅程ジェネレーター',
        locale: 'ja_JP',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

const headerStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(255, 255, 255, 0.82)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
}

const headerInnerStyle: React.CSSProperties = {
    maxWidth: 1200, margin: '0 auto',
    height: 60,
    padding: '0 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 8,
}

const logoLinkStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', color: '#0f172a',
    flexShrink: 0,
}

const logoTileStyle: React.CSSProperties = {
    width: 36, height: 36, borderRadius: 11,
    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, lineHeight: 1,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
    flexShrink: 0,
}

const navStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 4,
}

const navLinkStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 12px', borderRadius: 10,
    textDecoration: 'none', color: '#475569',
    fontSize: 13, fontWeight: 600,
    transition: 'background 0.15s, color 0.15s',
    whiteSpace: 'nowrap',
}

const ctaButtonStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '9px 16px', borderRadius: 10,
    textDecoration: 'none', color: 'white',
    fontSize: 13, fontWeight: 700,
    background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.32)',
    whiteSpace: 'nowrap',
    transition: 'box-shadow 0.15s, transform 0.1s',
    letterSpacing: '0.01em',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" className={geist.variable}>
            <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <header style={headerStyle}>
                    <div style={headerInnerStyle}>
                        {/* ロゴ */}
                        <Link href="/" style={logoLinkStyle}>
                            <div style={logoTileStyle}>✈️</div>
                            <span
                                className="logo-text"
                                style={{
                                    fontSize: 15, fontWeight: 800,
                                    letterSpacing: '-0.01em',
                                    color: '#0f172a',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                旅程ジェネレーター
                            </span>
                        </Link>

                        {/* ナビゲーション */}
                        <nav style={navStyle}>
                            <Link href="/explore" style={navLinkStyle} className="nav-hover">
                                <span style={{ fontSize: 14 }}>🔍</span>
                                <span className="nav-label">探す</span>
                            </Link>
                            <RecentTripsButton />
                            <Link href="/" style={ctaButtonStyle} className="cta-hover">
                                <span>＋</span>
                                <span className="nav-label">作成</span>
                            </Link>
                            {/* 将来用: ユーザーアバター */}
                            {/* <button style={{ width: 36, height: 36, borderRadius: 999, ... }}>👤</button> */}
                        </nav>
                    </div>
                </header>

                <main style={{ flex: 1 }}>
                    {children}
                </main>

                <Analytics />

                <footer style={{
                    borderTop: '1px solid rgba(15,23,42,0.06)',
                    background: 'white',
                }}>
                    <div style={{
                        maxWidth: 1200, margin: '0 auto',
                        padding: '20px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 12, flexWrap: 'wrap',
                        fontSize: 12, color: '#64748b',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 14 }}>✈️</span>
                            <span style={{ fontWeight: 600 }}>旅程ジェネレーター</span>
                            <span style={{ color: '#cbd5e1' }}>·</span>
                            <span>AI Travel Planner</span>
                        </div>
                        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>作成</Link>
                            <Link href="/explore" style={{ color: '#64748b', textDecoration: 'none' }}>探す</Link>
                        </nav>
                    </div>
                </footer>
            </body>
        </html>
    )
}
