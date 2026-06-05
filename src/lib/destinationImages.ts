// 目的地名 → Wikipedia の代表画像 URL マッピング
// scripts/fetch-destination-images.ts で取得・保存した JSON を参照

import images from './destinationImages.json'

const IMAGES = images as Record<string, string>

/**
 * 目的地名から代表画像 URL を返す。完全一致で見つからない場合は部分一致で最長キーを返す。
 * （周遊ツアー名「京都・大阪」等にも対応）
 */
export function getDestinationImage(destination: string): string | null {
    if (!destination) return null
    if (IMAGES[destination]) return IMAGES[destination]

    // 最長マッチ
    let bestKey = ''
    let bestUrl: string | null = null
    for (const [key, url] of Object.entries(IMAGES)) {
        if (destination.includes(key) && key.length > bestKey.length) {
            bestKey = key
            bestUrl = url
        }
    }
    return bestUrl
}
