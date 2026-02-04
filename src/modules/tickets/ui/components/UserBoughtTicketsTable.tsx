'use client'

import { formatEventName } from "@/modules/events"
import { useGetTicketsByUserList } from "@/shared/api/generated"
import { Button } from "@/shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DownloadIcon } from "lucide-react"
import { useLocale } from "next-intl"
import { useMemo } from "react"

export const UserBoughtTicketsTable = () => {
    const { data, isLoading, error } = useGetTicketsByUserList()
    const locale = useLocale()
    const groupedTickets = useMemo(() => {
        if (!data) return null
        return Object.groupBy(data, (ticket) => {
            const key = `name_${locale}` as keyof typeof ticket;
            return ticket[key];
        });

    }, [data])
    console.log(data, groupedTickets)

    if (isLoading) return <div>loading</div>
    if (error) return <div>error</div>
    if (!data) return <div>no data</div>
    if (!groupedTickets) return <div>no data</div>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Матч</TableHead>
                <TableHead>Количество билетов</TableHead>
                <TableHead>Билеты</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {Object.keys(groupedTickets).map((key) => (
                <TableRow key={key}>
                    <TableCell>{formatEventName(key, locale)}</TableCell>
                    <TableCell>{groupedTickets[key]?.length}</TableCell>
                    <TableCell>
                        <Button variant={'ghost'}><DownloadIcon /> Скачать</Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

}