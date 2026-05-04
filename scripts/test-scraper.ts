import { scrapeUrl } from '../src/lib/scraper/index.js'

const TEST_URLS = [
    { url: 'https://hitorijikan-nico2.hatenablog.com/entry/trip/kyoto-nara-matome-202304', label: 'はてなブログ1' },
    { url: 'https://nt-kaokatsu.hatenablog.com/entry/2024/03/24/181815', label: 'はてなブログ2' },
    { url: 'https://www.jalan.net/travel-journal/000026149/', label: 'じゃらん' },
    { url: 'https://plus.rurubu.jp/article/lw2q65yu6', label: 'るるぶ' },
    { url: 'https://4travel.jp/travelogue/11916960', label: 'フォートラベル' },
    { url: 'https://ameblo.jp/tabiakari/entry-12961531031.html', label: 'アメブロ' },
]

async function main() {
    for (const { url, label } of TEST_URLS) {
        try {
            console.log(`\n[${label}]`)
            const text = await scrapeUrl(url)
            console.log(`  文字数: ${text.length}`)
            console.log(`  先頭100文字: ${text.slice(0, 100)}`)
        } catch (e) {
            console.error(`  エラー: ${e instanceof Error ? e.message : e}`)
        }
        await new Promise(r => setTimeout(r, 1000))
    }
}

main()
