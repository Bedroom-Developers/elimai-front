'use client'

import { BadgeCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { Ticket } from "../../types"
import { DownloadPDFTicketsButton } from "./DownloadPDFTicketsButton"
import { TicketView } from "./TicketView"

interface PurchaseSuccessViewProps {
    tickets: Ticket[]
}

export const PurchaseSuccessView = ({ tickets }: PurchaseSuccessViewProps) => {
    const t = useTranslations()

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 max-w-2xl mx-auto dark:bg-emerald-950 dark:text-emerald-100">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div className="space-y-1">
                    <p className="font-semibold no-overlap">
                        {t("result.success.tickets.message")}
                    </p>
                    <ul className="list-disc pl-5 text-sm">
                        <li className="no-overlap">{t("result.success.tickets.additional_info.email")}</li>
                        <li className="no-overlap">{t("result.success.tickets.additional_info.account")}</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-4 mx-auto">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <DownloadPDFTicketsButton tickets={tickets} className="w-full" />
                </div>

                {tickets.map(ticket => <TicketView key={ticket.code} ticket={ticket} />)}
            </div>
        </div>
    )
}