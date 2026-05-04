// scrapeUrl のインライン実装でデバッグ
import * as cheerio from 'cheerio'

async function scrapeUrl(url: string): Promise<string> {
    console.log('  fetch開始...')
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
    })
    console.log(`  ステータス: ${response.status}`)

    if (response.status === 429) {
        throw new Error('このサイトはスクレイピングを制限しています')
    }
    if (!response.ok) {
        throw new Error(`取得失敗: ${response.status}`)
    }

    const html = await response.text()
    console.log(`  HTML長: ${html.length}`)
    const $ = cheerio.load(html)
    $('script, style, nav, header, footer, aside').remove()
    const text = $('body').text().replace(/\s+/g, ' ').trim()
    return text
}

async function main() {
    const urls = [
        { url: 'https://hitorijikan-nico2.hatenablog.com/entry/trip/kyoto-nara-matome-202304', label: 'はてな1' },
        { url: 'https://ameblo.jp/tabiakari/entry-12961531031.html', label: 'アメブロ' },
    ]

    for (const { url, label } of urls) {
        console.log(`\n[${label}]`)
        try {
            const text = await scrapeUrl(url)
            console.log(`  文字数: ${text.length}`)
            console.log(`  先頭80: ${text.slice(0, 80)}`)
        } catch (e) {
            console.error(`  エラー: ${e instanceof Error ? e.message : e}`)
        }
        await new Promise(r => setTimeout(r, 2000))
    }
}

main()
