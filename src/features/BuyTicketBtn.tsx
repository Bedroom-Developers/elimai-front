'use client'
import { AuthProtectedButton } from "@/features";
import { BuyTicketForm } from "@/features/forms";
import { rGetTicketsCount } from "@/shared/api/games";
import { ButtonProps, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useQuery } from "react-query";
interface BuyTicketBtnProps extends ButtonProps {
    gameId: number
    variant: string
    again?: boolean
}
export const BuyTicketBtn = ({ again = false, variant, gameId, disabled, ...props }: BuyTicketBtnProps) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: ticketsCount, isLoading } = useQuery({ queryKey: [`tickets count ${gameId}`], queryFn: () => rGetTicketsCount(gameId), enabled: !disabled })
    const t = useTranslations()
    return (
        <>
            <Modal centered size={'lg'} opened={opened} onClose={close} title={t('buy.ticketModal')}>
                {ticketsCount && <BuyTicketForm count={parseInt(ticketsCount.message)} gameId={gameId} />}
            </Modal>
            <AuthProtectedButton btnProps={{ ['data-id']: "buyBtn" }} disabled={disabled || isLoading || parseInt(ticketsCount?.message ?? '0') == 0} variant={variant} label={
                again ? t('buy.again') : t('buy.btn')
            } action={open} />
        </>
    );
};
