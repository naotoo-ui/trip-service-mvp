// 各サイトの生のHTTPレスポンスを調査
async function fetchRaw(url: string, label: string) {
    console.log(`\n=== ${label} ===`)
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
            }
        })
        console.log(`ステータス: ${response.status} ${response.statusText}`)
        console.log(`Content-Type: ${response.headers.get('content-type')}`)
        console.log(`Content-Length: ${response.headers.get('content-length')}`)
        const text = await response.text()
        console.log(`レスポンス文字数: ${text.length}`)
        console.log(`先頭300文字: ${text.slice(0, 300)}`)
        console.log(`末尾200文字: ${text.slice(-200)}`)
    } catch (e) {
        console.error(`エラー: ${e instanceof Error ? e.message : e}`)
    }
}

async function main() {
    await fetchRaw('https://hitorijikan-nico2.hatenablog.com/entry/trip/kyoto-nara-matome-202304', 'はてなブログ1')
    await new Promise(r => setTimeout(r, 2000))
    await fetchRaw('https://www.jalan.net/travel-journal/000026149/', 'じゃらん')
}

main()
