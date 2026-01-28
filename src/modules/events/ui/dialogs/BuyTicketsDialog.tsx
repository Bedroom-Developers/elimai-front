'use client'
import { AuthProtectedButton } from "@/modules/auth/ui/components/AuthProtectedButton"
import { ButtonProps } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { BuyTicketsSchema } from "../../schemas/buy.schema"
import { formatPhoneNumber } from "../../utils"
import { BuyTicketsForm } from "../forms/BuyTicketsForm"
type BuyTicketDialogProps = {
    eventId: number
    again?: boolean
} & ButtonProps
export const BuyTicketDialog = ({ eventId, again = false, ...props }: BuyTicketDialogProps) => {
    const t = useTranslations()
    const [opened, setOpened] = useState(false)
    const onSubmit = (data: BuyTicketsSchema) => {
        console.log({ ...data, TELEPHONE: formatPhoneNumber(data.TELEPHONE) })
    }
    return <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger render={() => <AuthProtectedButton onClick={() => setOpened(true)} {...props}>{again ? t('buy.again') : t('buy.btn')}</AuthProtectedButton>} />
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("buy.ticketModal")}</DialogTitle>
            </DialogHeader>
            <BuyTicketsForm eventId={eventId} onSubmit={onSubmit} />
        </DialogContent>
    </Dialog>
}
