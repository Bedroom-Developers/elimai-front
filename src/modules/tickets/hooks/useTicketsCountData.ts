'use client'
import { useAuthStore } from "@/modules/auth"
import { eventLimitList, getTicketsCountList } from "@/shared/api/generated"
import { useQuery } from "@tanstack/react-query"
export const ticketsCountDataQueryFn = async (eventId: number, isLogged: boolean) => {
    const promises = []
    promises.push(getTicketsCountList({ EVENT_ID: eventId }))
    if (isLogged) {
        promises.push(eventLimitList({ EVENT_ID: eventId }))
    }
    const [ticketsCountData, remainingData] = await Promise.all(promises) as [{ message: string }, { message: string }]
    return { ticketsCount: Number(ticketsCountData.message), remaining: Number(remainingData?.message ?? 0) }
}

export const useTicketsCountData = (eventId: number, enabled?: boolean) => {
    const isLogged = useAuthStore(state => state.isLogged)
    return useQuery<{ ticketsCount: number, remaining: number }>({
        queryKey: ['buy form', eventId],
        queryFn: () => {
            return ticketsCountDataQueryFn(eventId, isLogged)
        },
        enabled: enabled ?? true
    })
}

