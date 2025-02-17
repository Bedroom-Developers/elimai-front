'use client'
import { AuthProtectedButton } from "@/features";
import { Alert, Button, ButtonProps, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
interface BuySubscriptionBtnProps extends ButtonProps {
}
export const BuySubscriptionBtn = ({ disabled, ...props }: BuySubscriptionBtnProps) => {
    const [opened, { open, close }] = useDisclosure(false);
    const t = useTranslations()
    return (
        <>
            <Modal size={'xl'} opened={opened} onClose={close} title={t('buy.subModal')}>
                <Stack gap={10}>
                    <Alert
                        icon={<AlertTriangle />}
                        p={10}
                        variant="filled" color="elimai.2" title={t('buy.subscriptionDetails.title')}
                    >

                        <ul>
                            <li>{t('buy.subscriptionDetails.description')}</li>
                            <li>{t('buy.subscriptionDetails.validity')}</li>
                            <li>{t('buy.subscriptionDetails.transferability')}</li>
                            <li>{t('buy.subscriptionDetails.price')}</li>
                            <li>{t('buy.subscriptionDetails.paymentTerms')}</li>
                            <li>
                                {t('buy.subscriptionDetails.refundPolicy')}
                            </li>

                        </ul>
                    </Alert>
                    <Button variant="base">{t('buy.form.btn')}</Button>
                </Stack>
            </Modal>
            <AuthProtectedButton disabled={disabled} variant="alert" label={
                t('buy.subBtn')
            } action={open} />
        </>
    );
};
