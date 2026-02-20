import { Event, exportTicketsList } from "@/shared/api/generated"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog"
import dayjsTZ from "@/shared/dayjs"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GetReportDialogProps {
    children: React.ReactNode
    event: Event
    closeDropdown: () => void

}
export const GetReportDialog = ({ children, event, closeDropdown }: GetReportDialogProps) => {
    const {
        mutate: getExcel,
        isPending,
    } = useMutation({
        mutationKey: [`excel ${event.id}`],
        mutationFn: () => {
            if (!event.id) throw new Error("Event ID is required")

            return exportTicketsList({
                EVENT_ID: event.id,
            })
        },
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${event.name_ru}-${dayjsTZ(event.event_date).format(
                "YYYY-MM-DD HH:mm"
            )}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            closeDropdown()
        },
        onError: (e) => {
            console.error(e);
            toast.error("Ошибка при получении отчета")
        },
    });

    return <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Получить отчет</AlertDialogTitle>
                <AlertDialogDescription>
                    Вы уверены, что хотите получить отчет?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={() => getExcel()}>{isPending && <Loader2 className="w-4 h-4 animate-spin" />}Получить отчет</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}