'use client'
import { useEventsCreate } from "@/shared/api/generated"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { CreateEventSchema } from "../../schemas/event.schema"
import { CreateEventForm } from "../forms/CreateEventForm"

export const CreateEventDialog = () => {
    const [open, setOpen] = useState(false)
    const { mutate: createEvent, isPending } = useEventsCreate({
        mutation: {
            onSuccess: () => {
                setOpen(false)
                toast.success("Событие создано")
            },
            onError: () => {
                toast.error("Ошибка при создании события")
            }
        }
    })
    const onSubmit = (data: CreateEventSchema) => {
        console.log(data);
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
        <DialogTrigger render={(props) => <Button className="w-fit self-end" {...props}>Создать событие</Button>} />
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