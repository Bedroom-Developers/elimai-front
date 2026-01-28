"use client"
import { Event, useGetEventsList } from "@/shared/api/generated"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPositioner, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { ColumnDef, MappedTable } from "@/shared/components/ui/table"
import { format } from "date-fns"
import { AlertCircleIcon, AlertTriangleIcon, EllipsisIcon, FileIcon, SquarePen, Trash } from "lucide-react"
import { EVENT_QUERY_KEY, EventsAccesorKeys } from "../../constants"
import { EventManagementTableSkeleton } from "./EventManagementTable.skeleton"
const columns: ColumnDef<Event, EventsAccesorKeys>[] = [

    {
        header: "Дата",
        accessorKey: "event_date",
        cell: (row) => format(row.event_date, "dd.mm.yyyy HH:mm")
    },
    {
        header: "Название (ru)",
        accessorKey: "name_ru",
        cell: (row) => row.name_ru
    },
    {
        header: "Название (kz)",
        accessorKey: "name_kz",
        cell: (row) => row.name_kz
    },
    {
        header: "Статус",
        accessorKey: "status",
        cell: (row) => row.status
    },
    {
        header: "Количество билетов",
        accessorKey: "ticket_count",
        cell: (row) => row.ticket_count
    },
    {
        header: "Действия",
        accessorKey: "actions",
        cell: (row) => <DropdownMenu>
            <DropdownMenuTrigger><EllipsisIcon className="size-4" /></DropdownMenuTrigger>
            <DropdownMenuPositioner>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Управление событием</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <SquarePen />
                            Изменить
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash />
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Отчеты</DropdownMenuLabel>
                        <DropdownMenuItem> <FileIcon />Скачать Excel</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenuPositioner>
        </DropdownMenu>
    }
]

export const EventsManagementTable = () => {
    const { data: events, isLoading, error } = useGetEventsList({
        query: {
            queryKey: [EVENT_QUERY_KEY.LIST],
        }
    })
    if (isLoading) return <EventManagementTableSkeleton />
    if (error) {
        return (
            <Alert variant="error">
                <AlertCircleIcon />
                <AlertTitle>Ошибка: События не найдены</AlertTitle>
                <AlertDescription>Произошла ошибка при поиске событий. Попробуйте обновить страницу или повторите попытку позже.</AlertDescription>
            </Alert>
        )
    }
    if (!events || events.length === 0) {
        return (
            <Alert variant="warning">
                <AlertTriangleIcon />
                <AlertTitle>События не найдены</AlertTitle>
                <AlertDescription>К сожалению, на данный момент нет доступных событий. Пожалуйста, проверьте позже.</AlertDescription>
            </Alert>
        )
    }
    return <MappedTable columns={columns} data={events} />
}