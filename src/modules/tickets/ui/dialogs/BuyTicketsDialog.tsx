'use client'
import { AuthProtectedButton } from "@/modules/auth/ui/components/AuthProtectedButton"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useTranslations } from "next-intl"
import { ComponentProps, useState } from "react"
import { BuyTicketsSchema } from "../../../events/schemas/buy.schema"
import { formatPhoneNumber } from "../../../events/utils"
import { TicketsCountWrapper } from "../components/TicketsCountWrapper"
import { BuyTicketsForm } from "../forms/BuyTicketsForm"
type BuyTicketDialogProps = {
    eventId: number
    again?: boolean
} & ComponentProps<typeof Button>
export const BuyTicketDialog = ({ eventId, again = false, ...props }: BuyTicketDialogProps) => {
    const t = useTranslations()
    const [opened, setOpened] = useState(false)
    const onSubmit = (data: BuyTicketsSchema) => {
        console.log({ ...data, TELEPHONE: formatPhoneNumber(data.TELEPHONE) })
    }
    return <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild><AuthProtectedButton onClick={() => setOpened(true)} {...props}>{again ? t('buy.again') : t('buy.btn')}</AuthProtectedButton></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("buy.ticketModal")}</DialogTitle>
            </DialogHeader>
            <TicketsCountWrapper eventId={eventId} enabled={opened}>
                {({ ticketsCount, remaining, isLoading }) => (
                    <BuyTicketsForm isLoading={isLoading} ticketsCount={ticketsCount} remaining={remaining} onSubmit={onSubmit} />
                )}
            </TicketsCountWrapper>
        </DialogContent>
    </Dialog>
}
