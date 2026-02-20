import { useVolunteerDelete } from "@/shared/api/generated"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog"
import { Button } from "@/shared/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { EVENT_QUERY_KEY } from "../../constants"

interface DeleteVolunteerDialogProps {
    volunteerEmail: string
}
export const DeleteVolunteerDialog = ({ volunteerEmail }: DeleteVolunteerDialogProps) => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutate: deleteVolunteer, isPending } = useVolunteerDelete({
        mutation: {
            onSuccess: () => {
                toast.success("Волонтер удален")
                queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.VOLUNTEERS })
                setOpen(false)
            },
            onError: () => {
                toast.error("Ошибка при удалении волонтера")
            }
        },

    })
    const onSubmit = () => {
        deleteVolunteer({
            data: {
                email: volunteerEmail
            }
        })
    }
    return <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button variant="ghost" >
                Удалить
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Удалить волонтера</AlertDialogTitle>
                <AlertDialogDescription>
                    Вы уверены, что хотите удалить волонтера?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button disabled={isPending} variant="destructive" onClick={onSubmit}>
                        Удалить
                    </Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}