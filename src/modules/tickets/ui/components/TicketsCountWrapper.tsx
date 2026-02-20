import { useTicketsCountData } from "../../hooks/useTicketsCountData"

interface TicketsCountWrapperProps {
    eventId: number
    enabled?: boolean
    children: ({ ticketsCount, remaining, isLoading }: { ticketsCount: number, remaining: number, isLoading: boolean }) => React.ReactNode
}
export const TicketsCountWrapper = ({ eventId, enabled, children }: TicketsCountWrapperProps) => {

    const { data: ticketsCount, isLoading } = useTicketsCountData(eventId, enabled)


    return children({ ticketsCount: ticketsCount?.ticketsCount ?? 0, remaining: ticketsCount?.remaining ?? 0, isLoading })
}