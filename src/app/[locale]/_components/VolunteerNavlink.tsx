'use client'

import { ROLES, useAuthStore } from "@/modules/auth"
import { EventStatus } from "@/modules/events/constants"
import { getEventsList } from "@/shared/api/generated"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Navlink } from "./Navlink"

export const VolunteerNavlink = () => {

    const role = useAuthStore(state => state.role)
    console.log(role, 'role')
    const { data, isLoading } = useQuery({
        queryKey: ['volunteer-events'],
        queryFn: async () => {
            const events = await getEventsList()
            const activeEvent = events.find(event => event.status === EventStatus.ACTIVE)
            if (!activeEvent) return null

            if (dayjs(activeEvent.event_date).get("date") == dayjs().get("date") &&
                dayjs(activeEvent.event_date).get("month") == dayjs().get("month")) {
                return activeEvent.id
            }
            return null
        },
        enabled: role == ROLES.VOLUNTEER,
    })

    if (isLoading) return <Skeleton className="w-[82px] h-[24px]" />
    if (!data) return null


    return <Navlink href={`/admin/qr/${data}`} label={'QR-сканер'} />
}