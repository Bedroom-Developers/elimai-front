'use client'

import { formatEventName } from "@/modules/events"
import { useGetTicketsByUserList } from "@/shared/api/generated"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"
import { DownloadPDFTicketsButton } from "./DownloadPDFTicketsButton"

export const UserBoughtTicketsTable = () => {
    const { data, isLoading, error } = useGetTicketsByUserList()
    const locale = useLocale()
    const t = useTranslations("userBoughtTickets")
    const groupedTickets = useMemo(() => {
        if (!data) return null
        return Object.groupBy(data, (ticket) => {
            const key = `name_${locale}` as keyof typeof ticket;
            return ticket[key];
        });

    }, [data])
    console.log(data, groupedTickets)

    if (isLoading) {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("table.headers.match")}</TableHead>
                        <TableHead>{t("table.headers.ticketCount")}</TableHead>
                        <TableHead>{t("table.headers.tickets")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(3)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    if (error) {
        return (
            <Alert variant="error">
                <AlertTitle>{t("error.title")}</AlertTitle>
                <AlertDescription>
                    {t("error.description")}
                </AlertDescription>
            </Alert>
        )
    }

    if (!data || !groupedTickets) {
        return (
            <Alert variant="warning">
                <AlertTitle>{t("noData.title")}</AlertTitle>
                <AlertDescription>
                    {t("noData.description")}
                </AlertDescription>
            </Alert>
        )
    }

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>{t("table.headers.match")}</TableHead>
                <TableHead>{t("table.headers.ticketCount")}</TableHead>
                <TableHead>{t("table.headers.tickets")}</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {Object.keys(groupedTickets).map((key) => (
                groupedTickets[key] && <TableRow key={key}>
                    <TableCell>{formatEventName(key, locale)}</TableCell>
                    <TableCell>{groupedTickets[key]?.length}</TableCell>
                    <TableCell>
                        <DownloadPDFTicketsButton variant={'ghost'} tickets={groupedTickets[key]} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

}