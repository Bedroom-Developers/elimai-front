import { eventLimitList, getTicketsCountList } from "@/shared/api/generated"
import { useQuery } from "@tanstack/react-query"

export const useTicketsCountData = (eventId: number, enabled?: boolean) => {
    return useQuery<{ ticketsCount: number, remaining: number }>({
        queryKey: ['buy form', eventId],
        queryFn: async () => {
            const [ticketsCountData, remainingData] = await Promise.all([
                getTicketsCountList({ EVENT_ID: eventId }),
                eventLimitList({ EVENT_ID: eventId })
            ]) as [{ message: string }, { message: string }]
            return { ticketsCount: Number(ticketsCountData.message), remaining: Number(remainingData.message) }
        },
        enabled: enabled ?? true
    })
}