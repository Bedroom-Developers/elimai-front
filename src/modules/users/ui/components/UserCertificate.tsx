import { useMyShareholderList } from "@/shared/api/generated"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { formatCertificateData } from "../../utils"
import { CertView } from "./CertView"

export const UserCertificate = () => {
    const [isGenerating, setIsGenerating] = useState(false)
    const { data, isLoading, error } = useMyShareholderList()
    const t = useTranslations("userCertificate")

    if (isLoading) {
        return (
            <div className="flex flex-col gap-10 items-center justify-center">
                <Skeleton className="h-16 w-48" />
                <Skeleton className="h-52 w-full" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="error">
                <AlertTitle>{t("error.title")}</AlertTitle>
                <AlertDescription>
                    {t("error.description")}
                </AlertDescription>
            </Alert>
        )
    }

    if (!data) {
        return (
            <Alert variant="warning">
                <AlertTitle>{t("noData.title")}</AlertTitle>
                <AlertDescription>
                    {t("noData.description")}{" "}
                    <a
                        href="https://stocks.fcelimai.kz/ru"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        {t("noData.link")}
                    </a>
                </AlertDescription>
            </Alert>
        )
    }

    const onDownload = async () => {
        setIsGenerating(true)
        try {
            const { createPdfActions } = await import("@/modules/tickets/hooks/use-pdf")
            await createPdfActions().downloadCertPDF(formatCertificateData(data))
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <section className="flex flex-col items-center justify-center gap-10">
            <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
            <CertView certData={formatCertificateData(data)} />
            <Button disabled={isGenerating} onClick={onDownload}>
                {t("download")}
            </Button>
        </section>
    )
}
