'use client'

import { Link } from "@/i18n/routing"
import { Alert, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"

interface PurchaseErrorViewProps {
    refetch: () => void
}

export const PurchaseErrorView = ({ refetch }: PurchaseErrorViewProps) => {
    const t = useTranslations()

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 sm:p-6">
            <Alert variant="error" className="py-4">
                <AlertCircle className="size-5 shrink-0" />
                <AlertTitle className="text-base">
                    {t("result.error")}
                </AlertTitle>
            </Alert>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={refetch} className="w-full sm:w-auto">
                    {t("result.again")}
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/">{t("result.link")}</Link>
                </Button>
            </div>
        </div>
    )
}