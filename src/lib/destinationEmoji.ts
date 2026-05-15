const destinationEmoji: Record<string, string> = {
    沖縄: '🌺', 京都: '⛩️', 北海道: '🐻', 東京: '🗼', 大阪: '🍜',
    福岡: '🍜', 名古屋: '🏯', 仙台: '🌳', 広島: '⛩️', 神戸: '🌉',
    鎌倉: '🪷', 箱根: '♨️', 軽井沢: '🌲', 富士: '🗻', 屋久島: '🌳',
    韓国: '🇰🇷', ソウル: '🇰🇷', 釜山: '🇰🇷',
    台湾: '🇹🇼', 台北: '🇹🇼',
    タイ: '🇹🇭', バンコク: '🇹🇭',
    シンガポール: '🇸🇬', ベトナム: '🇻🇳', インドネシア: '🇮🇩',
    バリ: '🌴', セブ: '🏝️', グアム: '🏖️', サイパン: '🏖️',
    ハワイ: '🌺', アメリカ: '🇺🇸', ニューヨーク: '🗽', ロサンゼルス: '🌴',
    パリ: '🗼', フランス: '🇫🇷', ロンドン: '🇬🇧', イギリス: '🇬🇧',
    ローマ: '🇮🇹', イタリア: '🇮🇹', スペイン: '🇪🇸', ドイツ: '🇩🇪',
    オーストラリア: '🇦🇺', カナダ: '🇨🇦',
}

export function getDestinationEmoji(destination: string): string {
    for (const [key, value] of Object.entries(destinationEmoji)) {
        if (destination.includes(key)) return value
    }
    return '✈️'
}
