import { useGetTicketsCountList } from "@/shared/api/generated"
import { EventStatus } from "../../../events/constants"

interface TicketsCountWrapperProps {
    eventId: number
    status: string,
    children: (ticketsCount: number) => React.ReactNode
}
export const TicketsCountWrapper = ({ eventId, status, children }: TicketsCountWrapperProps) => {
    const { data: ticketsCount, isLoading } = useGetTicketsCountList<{ message: string }>({ EVENT_ID: eventId }, {
        query: {
            enabled: status === EventStatus.ACTIVE
        }
    })
    if (isLoading) return null

    return children(Number(ticketsCount?.message ?? 0))
}