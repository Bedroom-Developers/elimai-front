import { Event } from "@/shared/api/generated"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { useLocale, useTranslations } from "next-intl"
import { BuyTicketDialog } from "../../../tickets/ui/dialogs/BuyTicketsDialog"
import { formatEventDate } from "../../utils"
import { EventTeamsLabel } from "./EventTeamsLabel"

interface NextEventTableProps {
    event: Event
    ticketsCount: number
}
export const NextEventTable = ({ event, ticketsCount }: NextEventTableProps) => {
    const t = useTranslations()
    const locale = useLocale()
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t("gamesTable.date")}</TableHead>
                    <TableHead className="text-center">{t("gamesTable.game")}</TableHead>
                    <TableHead className="text-right">{t("gamesTable.buy")}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>{formatEventDate(event.event_date)}</TableCell>
                    <TableCell className="text-center"><EventTeamsLabel event={event} className="justify-center" /></TableCell>
                    <TableCell className="text-right">{event.id && <BuyTicketDialog disabled={ticketsCount <= 0} variant="default" eventId={event.id} />}</TableCell>
                </TableRow>
            </TableBody>
        </Table >
    )
}