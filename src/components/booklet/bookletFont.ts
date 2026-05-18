import type { FontStyle } from './bookletThemes'

// テーマの fontStyle に応じた CSS font-family を返す
export function getFontFamily(style: FontStyle): string {
    switch (style) {
        case 'rounded':
            return '"Kosugi Maru", "Hiragino Maru Gothic ProN", "M PLUS Rounded 1c", "Klee One", sans-serif'
        case 'serif':
            return '"Shippori Mincho", "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif'
        case 'classic':
        default:
            return 'inherit'
    }
}
