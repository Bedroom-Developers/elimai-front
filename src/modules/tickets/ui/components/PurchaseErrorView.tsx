'use client'

import { Link } from "@/i18n/routing"
import { Button } from "@/shared/components/ui/button"
import { Ban } from "lucide-react"
import { useTranslations } from "next-intl"

interface PurchaseErrorViewProps {
    refetch: () => void
}

export const PurchaseErrorView = ({ refetch }: PurchaseErrorViewProps) => {
    const t = useTranslations()

    return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Ban className="h-20 w-20 text-destructive" />
            <p className="text-2xl font-semibold text-destructive">
                {t("result.error")}
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Button onClick={refetch}>
                    {t("result.again")}
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">{t("result.link")}</Link>
                </Button>
            </div>
        </div>
    )
}