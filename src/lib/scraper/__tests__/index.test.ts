import { extractTextFromHtml } from '../index'

describe('extractTextFromHtml', () => {
    it('scriptタグとstyleタグの内容を除去する', () => {
        const html = `
            <html>
                <head>
                    <script>alert('hello')</script>
                    <style>body { color: red }</style>
                </head>
                <body><p>旅行記事の本文です。</p></body>
            </html>
        `
        const result = extractTextFromHtml(html)
        expect(result).toContain('旅行記事の本文です。')
        expect(result).not.toContain("alert('hello')")
        expect(result).not.toContain('color: red')
    })

    it('nav・header・footerの内容を除去する', () => {
        const html = `
            <body>
                <nav>メニュー</nav>
                <main><p>本文テキスト</p></main>
                <footer>フッター</footer>
            </body>
        `
        const result = extractTextFromHtml(html)
        expect(result).toContain('本文テキスト')
        expect(result).not.toContain('メニュー')
        expect(result).not.toContain('フッター')
    })

    it('連続するスペースを1つにまとめる', () => {
        const html = '<body><p>Hello   World</p></body>'
        const result = extractTextFromHtml(html)
        expect(result).toBe('Hello World')
    })
})
