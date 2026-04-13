import { Event, useTicketsCreate } from "@/shared/api/generated"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog"
import dayjsTZ from "@/shared/dayjs"
import { toast } from "sonner"

interface CreateTicketDialogProps {
    closeDropdown: () => void
    children: React.ReactNode
    event: Event
}

export const CreateTicketDialog = ({ closeDropdown, children, event }: CreateTicketDialogProps) => {
    const { mutate: createTicket, isPending } = useTicketsCreate({
        mutation: {
            onSuccess: async (data) => {
                const { createPdfActions } = await import("../../hooks/use-pdf")
                await createPdfActions().downloadTicketsPDF([{
                    code: data.code,
                    status: 'Active',
                    date: new Date().toISOString(),
                    name_kz: event.name_kz,
                    name_ru: event.name_ru,
                }])
                toast.success("Билет создан")
                closeDropdown()
            },
            onError: () => {
                toast.error("Ошибка при создании билета")
            }
        }
    })
    const onSubmit = () => {
        if (!event.id) return;
        createTicket({
            data: {
                event: event.id,
                email: 'admin',
                telephone: 'admin',
                will_deactivate_at: dayjsTZ(event.event_date).format("YYYY-MM-DD"),
                status: 'Active',
                code: 'ticket-' + Date.now(),
                payment: null
            }
        })

    }
    return <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Создать билет</AlertDialogTitle>
                <AlertDialogDescription>
                    Вы уверены, что хотите создать билет?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction disabled={isPending} onClick={onSubmit}>Создать</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}
