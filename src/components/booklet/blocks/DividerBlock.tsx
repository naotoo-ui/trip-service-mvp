'use client'
import type { Theme } from '../bookletThemes'

type Props = {
    style?: 'solid' | 'dashed' | 'dotted'
    theme: Theme
}

export default function DividerBlock({ style = 'dashed', theme }: Props) {
    return (
        <div
            className="booklet-divider"
            style={{
                padding: '14px 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <div style={{
                width: '100%',
                borderTop: `2px ${style} ${theme.accent}`,
                opacity: 0.6,
            }} />
        </div>
    )
}
