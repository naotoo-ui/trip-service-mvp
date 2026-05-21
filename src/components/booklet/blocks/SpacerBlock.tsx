'use client'

type Props = {
    height: number
    editable?: boolean
}

export default function SpacerBlock({ height, editable }: Props) {
    return (
        <div
            className="booklet-spacer"
            aria-hidden="true"
            style={{
                height,
                ...(editable ? {
                    background: 'repeating-linear-gradient(45deg, rgba(148,163,184,0.07) 0 8px, transparent 8px 16px)',
                    borderRadius: 8,
                } : {}),
            }}
        />
    )
}
