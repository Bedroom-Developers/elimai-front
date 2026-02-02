'use client'
import { useEventsDelete } from "@/shared/api/generated"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { EVENT_QUERY_KEY } from "../../constants"
interface DeleteEventDialogProps {
    eventId: number
    children: React.ReactNode
    closeDropdown: () => void
}
export const DeleteEventDialog = ({ eventId, children, closeDropdown }: DeleteEventDialogProps) => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { mutate: deleteEvent, isPending } = useEventsDelete({
        mutation: {
            onSuccess: () => {
                toast.success("Событие удалено")
                queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.LIST })
                setOpen(false)
                closeDropdown()
            },
            onError: () => {
                toast.error("Ошибка при удалении события")
            }
        }
    })
    const onSubmit = () => {
        deleteEvent({ id: eventId })
    }
    return <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild
        >{children}</AlertDialogTrigger>
        <AlertDialogContent  >
            <AlertDialogHeader>
                <AlertDialogTitle >Удалить событие</AlertDialogTitle>
                <AlertDialogDescription>
                    Вы уверены, что хотите удалить событие?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction disabled={isPending} onClick={onSubmit}>
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Удалить</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}