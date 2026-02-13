import { buyTicketsSchema, BuyTicketsSchema } from "@/modules/events/schemas/buy.schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ValidationError } from "@/shared/components/ui/validation-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { useHookFormMask } from 'use-mask-input';
import { TicketsCountSelect } from "../components/TicketsCountSelect";

interface BuyTicketsFormProps {

    ticketsCount: number
    remaining: number
    isLoading: boolean
    onSubmit: (data: BuyTicketsSchema) => void
}
export const BuyTicketsForm = ({ isLoading, ticketsCount, remaining, onSubmit }: BuyTicketsFormProps) => {
    const t = useTranslations()


    const form = useForm<BuyTicketsSchema>({
        resolver: zodResolver(buyTicketsSchema),
        defaultValues: {
            TELEPHONE: "",
            count: "0",
            FIO: "",
        },
    })

    const registerWithMask = useHookFormMask(form.register);
    const onSubmitHandler = (data: BuyTicketsSchema) => {
        onSubmit(data)
    }
    if (isLoading) return <Skeleton data-testid="buy-tickets-form-skeleton" className="w-full h-10" />

    return (
        <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4 min-h-[280px]">
            <div className="space-y-2">
                <Label htmlFor="FIO">{t("buy.form.fio")}</Label>
                <Input
                    id="FIO"
                    placeholder={t("buy.form.fio")}
                    aria-invalid={!!form.formState.errors.FIO}
                    {...form.register("FIO")}
                />
                <ValidationError
                    error={
                        form.formState.errors.FIO?.message
                            ? t(form.formState.errors.FIO.message)
                            : undefined
                    }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="TELEPHONE">{t("buy.form.tel")}</Label>
                <Input
                    id="TELEPHONE"
                    type="tel"
                    placeholder={t("buy.form.tel")}
                    aria-invalid={!!form.formState.errors.TELEPHONE}
                    {...registerWithMask("TELEPHONE", ["+7-999-999-99-99"])}
                />
                <ValidationError
                    error={
                        form.formState.errors.TELEPHONE?.message
                            ? t(form.formState.errors.TELEPHONE.message)
                            : undefined
                    }
                />
            </div>
            <div className="space-y-2">
                <Label>{t("buy.form.select")}</Label>
                <Controller
                    name="count"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                        <TicketsCountSelect
                            value={value}
                            onValueChange={onChange}
                            limit={remaining}
                            ticketsCount={ticketsCount}
                        />
                    )}
                />
                <ValidationError
                    error={
                        form.formState.errors.count?.message
                            ? t(form.formState.errors.count.message)
                            : undefined
                    }
                />
            </div>
            <span className="text-gray-400 ml-2 block mb-3" >{t("buy.form.count", { count: ticketsCount })} </span>
            <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? t("buy.form.btnPending") : t("buy.form.btn")}
            </Button>
        </form>
    )
}