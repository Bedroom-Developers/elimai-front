'use client'
import { AuthProtectedButton } from "@/modules/auth/ui/components/AuthProtectedButton"
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
            <AuthProtectedButton variant={'default'} onClick={() => setOpen(true)} {...props}>
                {t('label')}
            </AuthProtectedButton >
        </DialogTrigger>
        <DialogContent className="md:max-w-2xl  space-y-2 flex flex-col   ">
            <DialogHeader>
                <DialogTitle>{t('label')}</DialogTitle>
                <DialogDescription>
                    {t('description')}
                </DialogDescription>

            </DialogHeader>
            {isLoading ?
                <Skeleton className="w-full h-full" />
                : !data ?
                    <span className="text-sm text-muted-foreground text-center">
                        {t("notFoundTickets.title")}</span> :
                    <section className="flex flex-col gap-2 items-center overflow-y-auto  h-[500px] md:h-[80vh]">{data.map((ticket) => (
                        <TicketView key={ticket.code} ticket={ticket} />
                    ))}
                    </section>}
        </DialogContent>
    </Dialog>
}