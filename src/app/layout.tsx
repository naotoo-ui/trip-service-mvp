import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import Link from "next/link"
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" className={geist.variable}>
            <body className="min-h-screen flex flex-col bg-gray-50">
                <header className="bg-white/85 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2">
                        {/* ロゴ */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-80 transition-opacity shrink-0"
                        >
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)' }}
                            >
                                <span style={{ filter: 'drop-shadow(0 0 0 white)' }}>✈️</span>
                            </span>
                            <span className="text-[15px] sm:text-base tracking-tight whitespace-nowrap">
                                旅程ジェネレーター
                            </span>
                        </Link>

                        {/* ナビゲーション */}
                        <nav className="flex items-center gap-1">
                            <Link
                                href="/explore"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                                <span className="text-base leading-none">🔍</span>
                                <span>探す</span>
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap shadow-sm hover:shadow-md transition-all"
                                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)' }}
                            >
                                <span>＋</span>
                                <span>作成</span>
                            </Link>
                            {/* 将来用: ユーザーアバター */}
                            {/* <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors ml-1">
                                <span>👤</span>
                            </button> */}
                        </nav>
                    </div>
                </header>
                <main className="flex-1">
                    {children}
                </main>
                <footer className="border-t border-gray-200/80 bg-white">
                    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span>✈️</span>
                            <span>旅程ジェネレーター</span>
                            <span className="text-gray-300">·</span>
                            <span>AI Travel Planner</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            <Link href="/" className="hover:text-gray-900 transition-colors">作成</Link>
                            <Link href="/explore" className="hover:text-gray-900 transition-colors">探す</Link>
                        </nav>
                    </div>
                </footer>
            </body>
        </html>
    )
}
