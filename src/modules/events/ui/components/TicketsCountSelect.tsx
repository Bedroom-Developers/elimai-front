'use client'
import { Select, SelectContent, SelectItem, SelectPositioner, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useTranslations } from "next-intl"
import { ComponentProps } from "react"

type TicketsCountSelectProps = {
    limit: number,
    eventId: number
    ticketsCount: number
} & ComponentProps<typeof Select>
export const TicketsCountSelect = ({ limit, eventId, ticketsCount, ...props }: TicketsCountSelectProps) => {
    const t = useTranslations()
    return <Select {...props}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={t("buy.form.select")} />
        </SelectTrigger>
        <SelectPositioner>
            <SelectContent>
                {[1, 2, 3].map(c => <SelectItem value={c.toString()} key={c} disabled={c + limit >= 4 || c > ticketsCount}>{c}</SelectItem>)}
            </SelectContent>
        </SelectPositioner>
    </Select>
}

