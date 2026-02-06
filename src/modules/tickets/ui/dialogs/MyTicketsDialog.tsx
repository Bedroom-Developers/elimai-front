'use client'
import { useGetTicketsByUserList } from "@/shared/api/generated"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useTranslations } from "next-intl"
import { ComponentProps, useState } from "react"
import { Ticket } from "../../types"
import { TicketView } from "../components/TicketView"

type MyTicketsDialogProps = ComponentProps<typeof Button> & { tickets?: Ticket[] }
const isEnabled = (open: boolean, tickets?: Ticket[]) => {
    if (!!tickets) {
        return true
    }
    return open
}
export const MyTicketsDialog = ({ tickets, ...props }: MyTicketsDialogProps) => {
    const [open, setOpen] = useState(false)

    const t = useTranslations("gamesTable.myTickets");
    const { data, isLoading, error } = useGetTicketsByUserList({
        query: {
            enabled: isEnabled(open, tickets)
        }
    })



    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button {...props}>
                {t('label')}
            </Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-2xl  h-[70vh] block space-y-2  md:h-[90vh] overflow-y-auto ">
            <DialogHeader>
                <DialogTitle>{t('label')}</DialogTitle>
                <DialogDescription>
                    {t('description')}
                </DialogDescription>

            </DialogHeader>
            {tickets ? <section className="flex flex-col gap-2 items-center">{tickets.map((ticket) => (
                <TicketView ticket={ticket} />
            ))}
            </section> :
                isLoading ?
                    <Skeleton className="w-full h-full" />
                    : !data ?
                        <span className="text-sm text-muted-foreground text-center">
                            {t("notFoundTickets.title")}</span> :
                        <section className="flex flex-col gap-2 items-center">{data.map((ticket) => (
                            <TicketView ticket={ticket} />
                        ))}
                        </section>}
        </DialogContent>
    </Dialog>
}