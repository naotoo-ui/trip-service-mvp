import * as cheerio from 'cheerio'

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function detectCharset(contentType: string | null, html: string): string {
    // Content-Type ヘッダーから検出
    if (contentType) {
        const m = contentType.match(/charset=([^\s;]+)/i)
        if (m) {
            const cs = m[1].toLowerCase().replace(/^"(.*)"$/, '$1')
            if (cs.includes('shift') || cs.includes('sjis') || cs === 'windows-31j') return 'shift_jis'
            if (cs.includes('euc')) return 'euc-jp'
        }
    }
    // HTML の <meta charset="..."> から検出
    const metaMatch = html.slice(0, 2000).match(/<meta[^>]+charset=["']?([^"'\s;>]+)/i)
    if (metaMatch) {
        const cs = metaMatch[1].toLowerCase()
        if (cs.includes('shift') || cs.includes('sjis') || cs === 'windows-31j') return 'shift_jis'
        if (cs.includes('euc')) return 'euc-jp'
    }
    return 'utf-8'
}

function extractMainContent($: cheerio.CheerioAPI): string {
    // ノイズ要素を除去
    $('script, style, nav, header, footer, aside, [class*="ad"], [class*="banner"], [class*="sidebar"], [class*="related"], [class*="recommend"], [class*="menu"], [id*="nav"], [id*="header"], [id*="footer"], [id*="sidebar"]').remove()

    // 記事本文のセレクタ（優先度順）
    const articleSelectors = [
        'article',
        '.entry-content',
        '.article-body',
        '.post-body',
        '.post-content',
        '.blog-entry',
        '.hentry',
        '.entry',
        '[class*="article"]',
        '[class*="content"]',
        'main',
        '#main',
        '.main',
    ]

    for (const selector of articleSelectors) {
        const el = $(selector)
        if (el.length > 0) {
            const text = el.text().replace(/\s+/g, ' ').trim()
            if (text.length > 200) return text
        }
    }

    // フォールバック: body全体
    return $('body').text().replace(/\s+/g, ' ').trim()
}

export function extractTextFromHtml(html: string): string {
    const $ = cheerio.load(html)
    return extractMainContent($)
}

export async function scrapeUrl(url: string): Promise<string> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': BROWSER_UA,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Cache-Control': 'no-cache',
        },
    })

    if (response.status === 429) {
        throw new Error('このサイトはスクレイピングを制限しています。別のURLをお試しください。')
    }
    if (!response.ok) {
        throw new Error(`URLの取得に失敗しました: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    const buffer = await response.arrayBuffer()

    // エンコーディング検出（Shift_JIS対応）
    const rawText = new TextDecoder('utf-8', { fatal: false }).decode(buffer)
    const charset = detectCharset(contentType, rawText)

    const html = charset === 'utf-8'
        ? rawText
        : new TextDecoder(charset, { fatal: false }).decode(buffer)

    return extractTextFromHtml(html)
}
