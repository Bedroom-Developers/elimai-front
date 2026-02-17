import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { DownloadIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { ComponentProps } from "react"
import { useCreatePdf } from "../../hooks/use-pdf"
import { Ticket } from "../../types"

type DownloadPDFTicketsButtonProps = ComponentProps<typeof Button> & {
    tickets: Ticket[]
}
export const DownloadPDFTicketsButton = ({ tickets, className, ...props }: DownloadPDFTicketsButtonProps) => {
    const t = useTranslations("seeTickets")
    const { downloadTicketsPDF } = useCreatePdf()
    return <Button {...props} className={cn(className)} onClick={() => downloadTicketsPDF(tickets)} role='download-pdf-tickets-button'>
        <DownloadIcon className="w-4 h-4" />
        <span>{t("downloadAction")}</span>
    </Button>
}