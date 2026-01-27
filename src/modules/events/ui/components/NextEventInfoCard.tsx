import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertTriangle, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { EventStatus } from "../../constants";
interface NextEventInfoCardProps {
    ticketsCount: number
    status: string
}
export const NextEventInfoCard = ({ ticketsCount, status }: NextEventInfoCardProps) => {
    const t = useTranslations();

    console.log(ticketsCount, status)

    if (status == EventStatus.NEXT) {
        return (
            <Alert
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
            >
                <AlertTriangle />
                <AlertTitle>{t("alert.soldout.title")}</AlertTitle>
                <AlertDescription>{t("alert.soldout.message")}</AlertDescription>
            </Alert>
        );
    }

    return null;
}