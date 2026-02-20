'use client'

import { ROLES, useAuthStore } from "@/modules/auth"
import { EventStatus } from "@/modules/events/constants"
import { getEventsList } from "@/shared/api/generated"
import { Skeleton } from "@/shared/components/ui/skeleton"
import dayjsTZ from "@/shared/dayjs"
import { useQuery } from "@tanstack/react-query"
import { Navlink } from "./Navlink"

export const VolunteerNavlink = () => {

    const role = useAuthStore(state => state.role)
    const { data, isLoading } = useQuery({
        queryKey: ['volunteer-events', role],
        queryFn: async () => {
            const events = await getEventsList()
            const activeEvent = events.find(event => event.status === EventStatus.ACTIVE)
            if (!activeEvent) return null

            if (dayjsTZ(activeEvent.event_date).get("date") == dayjsTZ().get("date") &&
                dayjsTZ(activeEvent.event_date).get("month") == dayjsTZ().get("month")) {
                return activeEvent.id
            }
            return null
        },
        refetchOnMount: true,
        enabled: role == ROLES.VOLUNTEER,
    })

    if (isLoading) return <Skeleton className="w-[82px] h-[24px]" />
    if (!data) return null


    return <Navlink href={`/admin/qr/${data}`} label={'QR-сканер'} />
}