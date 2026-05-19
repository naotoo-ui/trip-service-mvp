import type { Trip } from '@/types'
import type { Theme } from './bookletThemes'
import { CoverDecoration } from './BookletDecorations'
import { getFontFamily } from './bookletFont'

export default function BookletBackCover({ trip, theme }: { trip: Trip; theme: Theme }) {
    const isDark = theme.coverText === 'white' || theme.coverText === '#ffffff'
    const titleFont = getFontFamily(theme.fontStyle)
    const labelBgColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'
    const labelBorderColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'

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
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15)',
                fontFamily: titleFont,
            }}
        >
            <CoverDecoration kind={theme.decoration} accent={theme.accent} />

            {/* 装飾円（カバーと対称） */}
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

            {/* ヘッド */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                <span style={{
                    display: 'inline-block',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    background: labelBgColor,
                    border: `1px solid ${labelBorderColor}`,
                    padding: '5px 14px',
                    borderRadius: 99,
                    marginBottom: 16,
                }}>
                    Back Cover
                </span>
                <div style={{
                    width: 64, height: 4, borderRadius: 4,
                    background: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.35)',
                    marginTop: 8,
                }} />
            </div>

            {/* メイン */}
            <div style={{ position: 'relative', zIndex: 2, margin: '24px 0', textAlign: 'center' }}>
                <p style={{
                    fontSize: 'clamp(20px, 3.5vw, 28px)',
                    fontWeight: 800,
                    lineHeight: 1.4,
                    margin: '0 0 16px',
                    letterSpacing: theme.fontStyle === 'rounded' ? '0' : '-0.01em',
                    textShadow: isDark
                        ? '0 2px 8px rgba(0,0,0,0.25)'
                        : '0 1px 2px rgba(255,255,255,0.4)',
                }}>
                    思い出に残る旅を。
                </p>
                <p style={{
                    fontSize: 13,
                    opacity: 0.9,
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: 380,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    このしおりはあなたの旅をかたちに残すための一冊です。
                    <br />
                    ページを開くたびに、その日の景色や出会いを思い出せますように。
                </p>
            </div>

            {/* フッター */}
            <div style={{
                position: 'relative', zIndex: 2,
                paddingTop: 20, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
                fontSize: 11, opacity: 0.85, letterSpacing: '0.05em',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span>{trip.destination} / {trip.duration_days}日間</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>旅程ジェネレーター</span>
            </div>
        </article>
    )
}
