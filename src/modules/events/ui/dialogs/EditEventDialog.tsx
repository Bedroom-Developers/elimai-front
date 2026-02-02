'use client'
import { Event, useEventsUpdate } from "@/shared/api/generated"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { EVENT_QUERY_KEY } from "../../constants"
import { EditEventSchema } from "../../schemas/event.schema"
import { EditEventForm } from "../forms/EditEventForm"

interface EditEventDialogProps {
    children: React.ReactNode
    closeDropdown: () => void
    eventId: number
    defaultValues: Event
}
export const EditEventDialog = ({ eventId, defaultValues, children, closeDropdown }: EditEventDialogProps) => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { mutate: editEvent, isPending } = useEventsUpdate({
        mutation: {
            onSuccess: () => {
                setOpen(false)
                queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.LIST })
                toast.success("Событие обновлено")
                closeDropdown()
            },
            onError: () => {
                toast.error("Ошибка при обновлении события")
            }
        }
    })
    const onSubmit = (data: EditEventSchema) => {
        editEvent({
            id: eventId, data: {
                ...data,
                event_date: data.event_date.toISOString(),
                ticket_count: Number(data.ticket_count) ?? 0,
            }
        })
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Редактировать событие</DialogTitle>
                <DialogDescription>
                    Редактируйте событие для его обновления.
                </DialogDescription>
            </DialogHeader>
            <EditEventForm defaultValues={{
                name_ru: defaultValues.name_ru,
                name_kz: defaultValues.name_kz,
                event_date: new Date(defaultValues.event_date),
                status: defaultValues.status,
                ticket_count: defaultValues.ticket_count?.toString() || "",
            }} isPending={isPending} onSubmit={onSubmit} />
        </DialogContent>
    </Dialog>
}