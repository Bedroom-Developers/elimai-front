import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { DownloadIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { ComponentProps, useState } from "react"
import { Ticket } from "../../types"

type DownloadPDFTicketsButtonProps = ComponentProps<typeof Button> & {
    tickets: Ticket[]
}
export const DownloadPDFTicketsButton = ({ tickets, className, ...props }: DownloadPDFTicketsButtonProps) => {
    const t = useTranslations("seeTickets")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        setIsGenerating(true)
        try {
            const { createPdfActions } = await import("../../hooks/use-pdf")
            await createPdfActions().downloadTicketsPDF(tickets)
        } finally {
            setIsGenerating(false)
        }
    }

    return <Button {...props} disabled={props.disabled || isGenerating} className={cn(className)} onClick={handleDownload} role='download-pdf-tickets-button'>
        <DownloadIcon className="w-4 h-4" />
        <span>{t("downloadAction")}</span>
    </Button>
}
