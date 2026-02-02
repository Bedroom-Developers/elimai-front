'use client'
import { CreateTicketDialog, GetReportDialog } from "@/modules/tickets"
import { Event } from "@/shared/api/generated"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { EllipsisIcon, FileIcon, PlusIcon, SquarePen, Trash } from "lucide-react"
import { useState } from "react"
import { DeleteEventDialog } from "../dialogs/DeleteEventDialog"
import { EditEventDialog } from "../dialogs/EditEventDialog"

interface EventActionsProps {
    event: Event
}

export const EventActions = ({ event }: EventActionsProps) => {
    const [open, setOpen] = useState(false)
    const closeDropdown = () => {
        setOpen(false)
    }
    return <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger><EllipsisIcon className="size-4" /></DropdownMenuTrigger>
        <DropdownMenuContent >
            <DropdownMenuGroup>
                <DropdownMenuLabel>Управление событием</DropdownMenuLabel>
                {event.id && <>
                    <CreateTicketDialog closeDropdown={closeDropdown} >
                        <DropdownMenuItem>
                            <PlusIcon />
                            Создать билет
                        </DropdownMenuItem>


                    </CreateTicketDialog>
                    <EditEventDialog eventId={event.id} defaultValues={event} closeDropdown={closeDropdown} >

                        <DropdownMenuItem >
                            <SquarePen />
                            Изменить
                        </DropdownMenuItem>
                    </EditEventDialog>
                    <DeleteEventDialog eventId={event.id} closeDropdown={closeDropdown} >
                        <DropdownMenuItem >
                            <Trash />
                            Удалить
                        </DropdownMenuItem>
                    </DeleteEventDialog>

                </>}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuLabel>Отчеты</DropdownMenuLabel>
                <GetReportDialog event={event} closeDropdown={closeDropdown} >
                    <DropdownMenuItem> <FileIcon />Скачать Excel</DropdownMenuItem>
                </GetReportDialog>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>

}