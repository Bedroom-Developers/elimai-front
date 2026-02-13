'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useTranslations } from "next-intl"
import { ComponentProps } from "react"
import { isTicketCountValid } from "../../utils"

type TicketsCountSelectProps = {
    limit: number,
    ticketsCount: number
} & ComponentProps<typeof Select>
export const TicketsCountSelect = ({ limit, ticketsCount, ...props }: TicketsCountSelectProps) => {
    const t = useTranslations()
    return <Select {...props}>
        <SelectTrigger data-testid="tickets-count-select-trigger" className="w-full">
            <SelectValue placeholder={t("buy.form.select")} />
        </SelectTrigger>
        <SelectContent>
            {[1, 2, 3].map(c => <SelectItem data-testid={`tickets-count-select-option-${c}`} value={c.toString()} key={c} disabled={!isTicketCountValid({ count: c, ticketsCount, limit })}>{c}</SelectItem>)}
        </SelectContent>
    </Select>
}

