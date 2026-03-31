'use client'
import { useEventsCreate } from "@/shared/api/generated"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { EVENT_QUERY_KEY } from "../../constants"
import { CreateEventSchema } from "../../schemas/event.schema"
import { CreateEventForm } from "../forms/CreateEventForm"

export const CreateEventDialog = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { mutate: createEvent, isPending } = useEventsCreate({
        mutation: {
            onSuccess: () => {
                setOpen(false)
                queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.LIST })
                toast.success("Событие создано")
            },
            onError: () => {
                toast.error("Ошибка при создании события")
            }
        }
    })
    const onSubmit = (data: CreateEventSchema) => {
        createEvent({
            data: {
                name_ru: data.name_ru,
                name_kz: data.name_kz,
                event_date: data.event_date.toISOString(),
                status: data.status,
            }
        })
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className="w-fit self-end">Создать событие</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Создать событие</DialogTitle>
                <DialogDescription>
                    Здесь вы можете создать новое событие.
                </DialogDescription>
            </DialogHeader>
            <CreateEventForm isPending={isPending} onSubmit={onSubmit} />
        </DialogContent>
    </Dialog>
}