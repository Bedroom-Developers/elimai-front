import { Event } from "@/shared/api/generated"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { useLocale, useTranslations } from "next-intl"
import { formatEventDate } from "../../utils"
import { EventTeamsLabel } from "./EventTeamsLabel"

interface EventCalendarProps {
    events: Event[]
}
export const EventCalendar = ({ events }: EventCalendarProps) => {
    const t = useTranslations()
    const locale = useLocale()
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-left">{t("gamesTable.game")}</TableHead>
                    <TableHead className="text-right">{t("gamesTable.date")}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map((event) => (
                    <TableRow key={event.id}>
                        <TableCell className="text-left"><EventTeamsLabel event={event} className="justify-left flex-row" separatorClassName="block" /></TableCell>
                        <TableCell className="text-right">{formatEventDate(event.event_date)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table >
    )
}