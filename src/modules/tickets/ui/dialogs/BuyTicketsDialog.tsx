'use client'
import { AuthProtectedButton } from "@/modules/auth/ui/components/AuthProtectedButton"
import { useCreateTicketCreate } from "@/shared/api/generated"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useTranslations } from "next-intl"
import { ComponentProps, useState } from "react"
import { toast } from "sonner"
import { BuyTicketsSchema } from "../../../events/schemas/buy.schema"
import { TicketsCountWrapper } from "../components/TicketsCountWrapper"
import { BuyTicketsForm } from "../forms/BuyTicketsForm"
type BuyTicketDialogProps = {
    eventId: number
    again?: boolean
} & ComponentProps<typeof Button>
export const BuyTicketDialog = ({ eventId, again = false, ...props }: BuyTicketDialogProps) => {
    const t = useTranslations()
    const { mutate: createTicket, isPending } = useCreateTicketCreate({
        mutation: {
            onSuccess: ({ url }) => {
                if (!url) {
                    toast.error(t("buy.toast.error"))
                    return;
                }
                window.open(url, "_blank")
                setOpened(false)
            },
            onError: () => {
                toast.error(t("buy.toast.error"))
            }
        }
    })
    const [opened, setOpened] = useState(false)
    const onSubmit = (data: BuyTicketsSchema) => {
        const email = getCookie("email")
        if (!email) {
            toast.error(t("buy.toast.error"))
            return;
        }
        createTicket({
            data: {
                EMAIL: email,
                TELEPHONE: data.TELEPHONE,
                EVENT_ID: eventId,
                COUNT: Number(data.count),
                TYPE: "Ticket",
            }
        })
    }
    return <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild><AuthProtectedButton onClick={() => setOpened(true)} {...props}>{again ? t('buy.again') : t('buy.btn')}</AuthProtectedButton></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("buy.ticketModal")}</DialogTitle>
            </DialogHeader>
            <TicketsCountWrapper eventId={eventId} enabled={opened}>
                {({ ticketsCount, remaining, isLoading }) => (
                    <BuyTicketsForm isLoading={isLoading} ticketsCount={ticketsCount} remaining={remaining} onSubmit={onSubmit} isPending={isPending} />
                )}
            </TicketsCountWrapper>
        </DialogContent>
    </Dialog>
}
