import type { Trip } from '@/types'
import type { Theme } from './bookletThemes'
import { CoverDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'

export default function BookletBackCover({ trip: _, theme }: { trip: Trip; theme: Theme }) {
    const titleFont = getFontFamily(theme.fontStyle)

    return (
        <article
            className="booklet-page booklet-back-cover"
            style={{
                background: theme.coverBg,
                color: theme.coverText,
                borderRadius: 24,
                padding: '56px 36px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 28,
                minHeight: 520,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15)',
                fontFamily: titleFont,
            }}
        >
            <CoverDecoration kind={theme.decoration} accent={theme.accent} />

            <div style={{
                position: 'absolute', top: -80, left: -60,
                width: 240, height: 240, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -60, right: -40,
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                pointerEvents: 'none',
            }} />

            <span style={{
                position: 'relative', zIndex: 2,
                fontSize: 13, letterSpacing: '0.12em', opacity: 0.75,
            }}>
                旅程ジェネレーター
            </span>
        </article>
    )
}
