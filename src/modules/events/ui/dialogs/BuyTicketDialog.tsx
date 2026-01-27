import { AuthProtectedButton } from "@/modules/auth/ui/components/AuthProtectedButton"
import { ButtonProps } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useState } from "react"
type BuyTicketDialogProps = {
    eventId: number
    again?: boolean
} & ButtonProps
export const BuyTicketDialog = ({ eventId, again = false, ...props }: BuyTicketDialogProps) => {
    const t = useTranslations()
    const [opened, setOpened] = useState(false)
    return <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger render={() => <AuthProtectedButton onClick={() => setOpened(true)} {...props}>{again ? t('buy.again') : t('buy.btn')}</AuthProtectedButton>} />
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}
