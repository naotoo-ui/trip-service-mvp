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
            <body className="min-h-screen flex flex-col">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-80 transition-opacity">
                            <span className="text-xl">✈️</span>
                            <span className="text-base sm:text-lg tracking-tight">旅程ジェネレーター</span>
                        </Link>
                        <nav className="flex items-center gap-3 text-sm text-gray-500">
                            <Link href="/trips" className="hidden sm:block hover:text-gray-900 transition-colors">旅程一覧</Link>
                            <Link href="/" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium whitespace-nowrap">
                                ＋ 作成
                            </Link>
                        </nav>
                    </div>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </body>
        </html>
    )
}
