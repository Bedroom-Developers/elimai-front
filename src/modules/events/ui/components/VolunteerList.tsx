"use client"
import { useVolunteerList, VolunteerList200Item } from "@/shared/api/generated"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { AlertCircleIcon, AlertTriangleIcon } from "lucide-react"
import { EVENT_QUERY_KEY } from "../../constants"
import { DeleteVolunteerDialog } from "../dialogs/DeleteVolunteerDialog"
import { VolunteerListSkeleton } from "./VolunteerList.skeleton"

interface ListItemProps {
    id: number
    volunteer: VolunteerList200Item
}
const ListItem = ({ id, volunteer }: ListItemProps) => {
    return <div className="flex justify-between items-center p-2 border border-gray-200 rounded-md bg-slate-50">
        <div className="flex items-center gap-2">
            <span >{id}.</span>
            <p>{volunteer.email}</p>
        </div>
        {volunteer.email && <DeleteVolunteerDialog volunteerEmail={volunteer.email} />}
    </div>
}
export const VolunteerList = () => {
    const { data: volunteers, isLoading, error } = useVolunteerList({ query: { queryKey: EVENT_QUERY_KEY.VOLUNTEERS } })
    if (isLoading) {
        return <VolunteerListSkeleton />
    }
    if (error) {
        return (
            <Alert variant="error">
                <AlertCircleIcon />
                <AlertTitle>Ошибка: Волонтеры не найдены</AlertTitle>
                <AlertDescription>Произошла ошибка при загрузке списка волонтеров. Попробуйте обновить страницу или повторите попытку позже.</AlertDescription>
            </Alert>
        )
    }
    if (!volunteers || volunteers.length === 0) {
        return (
            <Alert variant="warning">
                <AlertTriangleIcon />
                <AlertTitle>Волонтеры не найдены</AlertTitle>
                <AlertDescription>К сожалению, на данный момент нет зарегистрированных волонтеров.</AlertDescription>
            </Alert>
        )
    }
    return <section>
        {volunteers.map((volunteer, idx) => (
            <ListItem key={idx} id={idx + 1} volunteer={volunteer} />
        ))}

    </section>
}