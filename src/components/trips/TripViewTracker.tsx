'use client'
import { useEffect } from 'react'
import { recordTripAccess } from '@/hooks/useRecentTrips'

type Props = {
    shareId: string
    title: string
    destination: string
    durationDays: number
    editToken?: string
}

export default function TripViewTracker({ shareId, title, destination, durationDays, editToken }: Props) {
    useEffect(() => {
        recordTripAccess({
            share_id: shareId,
            title,
            destination,
            duration_days: durationDays,
            edit_token: editToken,
            editable: Boolean(editToken),
        })
    }, [shareId, title, destination, durationDays, editToken])

    return null
}
