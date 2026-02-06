import { Button } from "@/shared/components/ui/button"
import { Ticket } from "@/shared/types"
import { DownloadIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { ComponentProps } from "react"
import { useCreatePdf } from "../../hooks/use-pdf"

type DownloadPDFTicketsButtonProps = ComponentProps<typeof Button> & {
    tickets: Ticket[]
}
export const DownloadPDFTicketsButton = ({ tickets, ...props }: DownloadPDFTicketsButtonProps) => {
    const t = useTranslations("seeTickets")
    const { downloadTicketsPDF } = useCreatePdf()
    return <Button {...props} onClick={() => downloadTicketsPDF(tickets)}>
        <DownloadIcon className="w-4 h-4" />
        <span>{t("downloadAction")}</span>
    </Button>
}