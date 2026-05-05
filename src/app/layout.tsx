import type { Metadata } from "next"
import { Geist } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
    title: "旅程ジェネレーター",
    description: "AIが旅行プランを自動で作成します。行き先・日数・やりたいことを入力するか、旅行ブログのURLを貼り付けるだけで旅程を生成します。",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" className={geist.variable}>
            <body className="min-h-screen flex flex-col">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-80 transition-opacity">
                            <span className="text-xl">✈️</span>
                            <span className="text-lg tracking-tight">旅程ジェネレーター</span>
                        </Link>
                        <nav className="flex items-center gap-4 text-sm text-gray-500">
                            <Link href="/" className="hover:text-gray-900 transition-colors">新しい旅程</Link>
                        </nav>
                    </div>
                </header>
                <main className="flex-1">
                    {children}
                </main>
                <footer className="border-t border-gray-200 bg-white mt-16">
                    <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
                        © 2026 旅程ジェネレーター · AIが旅行プランを自動作成
                    </div>
                </footer>
            </body>
        </html>
    )
}
