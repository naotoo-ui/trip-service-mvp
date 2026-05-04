import * as cheerio from 'cheerio'

export function extractTextFromHtml(html: string): string {
    const $ = cheerio.load(html)
    $('script, style, nav, header, footer, aside, [class*="ad"], [class*="banner"]').remove()
    return $('body').text().replace(/\s+/g, ' ').trim()
}

export async function scrapeUrl(url: string): Promise<string> {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TripServiceBot/1.0)' },
    })
    if (!response.ok) throw new Error(`URLの取得に失敗しました: ${response.status}`)
    const html = await response.text()
    return extractTextFromHtml(html)
}
