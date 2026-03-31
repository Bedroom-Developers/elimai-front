"use client"
import { useVolunteerList, VolunteerList200Item } from "@/shared/api/generated"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { AlertCircleIcon, AlertTriangleIcon, User } from "lucide-react"
import { EVENT_QUERY_KEY } from "../../constants"
import { DeleteVolunteerDialog } from "../dialogs/DeleteVolunteerDialog"
import { VolunteerListSkeleton } from "./VolunteerList.skeleton"

interface ListItemProps {
    id: number
    volunteer: VolunteerList200Item
}
const ListItem = ({ id, volunteer }: ListItemProps) => {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 shadow-sm transition-colors hover:bg-muted/50">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="size-4 text-muted-foreground" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{volunteer.email}</p>
                    <span className="text-xs text-muted-foreground">#{id}</span>
                </div>
            </div>
            {volunteer.email && (
                <div className="shrink-0">
                    <DeleteVolunteerDialog volunteerEmail={volunteer.email} />
                </div>
            )}
        </div>
    )
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
    return (
        <section className="flex flex-col gap-2">
            {volunteers.map((volunteer, idx) => (
                <ListItem key={volunteer.email ?? idx} id={idx + 1} volunteer={volunteer} />
            ))}
        </section>
    )
}