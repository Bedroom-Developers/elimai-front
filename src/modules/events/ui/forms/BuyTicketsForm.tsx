import { buyTicketsSchema, BuyTicketsSchema } from "@/modules/events/schemas/buy.schema";
import { eventLimitList, getTicketsCountList } from "@/shared/api/generated";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ValidationError } from "@/shared/components/ui/validation-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { useHookFormMask } from 'use-mask-input';
import { BuyTicketsFormSkeleton } from "../components/BuyTicketsForm.skeleton";
import { TicketsCountSelect } from "../components/TicketsCountSelect";

interface BuyTicketsFormProps {
    eventId: number
    onSubmit: (data: BuyTicketsSchema) => void
}
export const BuyTicketsForm = ({ eventId, onSubmit }: BuyTicketsFormProps) => {
    const t = useTranslations()
    const { data, isLoading, isError } = useQuery<{ ticketsCount: number, remaining: number }>({
        queryKey: ['buy form', eventId],
        queryFn: async () => {
            const [ticketsCountData, remainingData] = await Promise.all([
                getTicketsCountList({ EVENT_ID: eventId }),
                eventLimitList({ EVENT_ID: eventId })
            ]) as [{ message: string }, { message: string }]
            return { ticketsCount: Number(ticketsCountData.message), remaining: Number(remainingData.message) }
        }
    })


    const form = useForm<BuyTicketsSchema>({
        resolver: zodResolver(buyTicketsSchema),
        defaultValues: {
            TELEPHONE: "",
            count: 0,
            FIO: "",
        },
    })

    const registerWithMask = useHookFormMask(form.register);
    const onSubmitHandler = (data: BuyTicketsSchema) => {
        onSubmit(data)
    }
    if (isLoading) return <BuyTicketsFormSkeleton />
    if (isError) return <div className="text-red-500 p-4">Error</div>
    if (!data) return <div className="text-red-500 p-4">Error</div>

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
                            limit={data.remaining}
                            eventId={eventId}
                            ticketsCount={data.ticketsCount}
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
            <span className="text-gray-400 ml-2 block mb-3" >{t("buy.form.count", { count: data.ticketsCount })} </span>
            <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? t("buy.form.btn") + "..." : t("buy.form.btn")}
            </Button>
        </form>
    )
}