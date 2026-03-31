import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertTriangle, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { EventStatus } from "../../constants";
interface NextEventInfoCardProps {
    ticketsCount: number
    status: string
    isLoading: boolean
    remaining: number
}
export const NextEventInfoCard = ({ ticketsCount, status, isLoading, remaining }: NextEventInfoCardProps) => {
    const t = useTranslations();

    if (isLoading) return null
    if (remaining <= 0 && ticketsCount > 0) {
        return null;
    }

    if (status == EventStatus.NEXT) {
        return (
            <Alert
                data-testid="next-event-info-card"
                variant={'success'}
                title={t("alert.near.title")}
            >
                <InfoIcon />
                <AlertTitle>{t("alert.near.title")}</AlertTitle>
                <AlertDescription>{t("alert.near.message")}</AlertDescription>
            </Alert>
        );
    }


    if (
        status === EventStatus.ACTIVE && ticketsCount <= 0
    ) {
        return (
            <Alert
                variant="error"
                data-testid="sold-out-event-info-card"
            >
                <AlertTriangle />
                <AlertTitle>{t("alert.soldout.title")}</AlertTitle>
                <AlertDescription>{t("alert.soldout.message")}</AlertDescription>
            </Alert>
        );
    }

    return null;
}