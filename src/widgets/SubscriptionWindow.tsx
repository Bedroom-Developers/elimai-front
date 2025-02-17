'use client'
import { Link, useRouter } from "@/i18n/routing"
import { rBuyTicket, rGetSubscriptionCount } from "@/shared/api/games"
import { useAuth } from "@/shared/context"
import { showErrorNotification } from "@/shared/notifications"
import { Alert, Box, Button, Group, Input, Skeleton, Stack, Text } from "@mantine/core"
import { getCookie } from "cookies-next"
import { AlertTriangle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IMaskInput } from "react-imask"
import { useMutation, useQuery } from "react-query"
export const SubscriptionWindow = () => {
    const t = useTranslations()
    const { isLogged, loading } = useAuth()
    return <Stack p={10} maw={600}>
        {loading ? <Skeleton w={'100%'} h={177} /> : !isLogged &&
            <Stack><Alert
                icon={<AlertTriangle />}
                p={10}
                variant="filled" color="red.4" title={t('alert.401.title')}
            >
                <ul>
                    <li>{t('alert.401.message')}</li>
                </ul>
            </Alert>
                <Group>
                    <Button flex={1} variant="base" component={Link} href={'/login'}>{t('auth.login.btn')}</Button>
                    <Button flex={1} variant="outline" component={Link} href={'/register'}>{t('auth.register.btn')}</Button>
                </Group>
            </Stack>

        }
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
        <Form />
    </Stack >
}

const Form = () => {
    const t = useTranslations()
    const { locale } = useParams()
    const router = useRouter()
    const {
        handleSubmit,
        register,
        getValues,
        control,
        formState: { errors },
    } = useForm<{ tel: string }>();
    const { mutate, isLoading: mutateLoading, isError } = useMutation({
        mutationKey: [`buySub`],
        mutationFn: rBuyTicket,
        onSuccess: (data) => {
            const { url } = JSON.parse(data)
            router.push(url)
        },
        onError: (e: { message: string, status: number }) => {
            switch (e.status) {
                case 409:
                    showErrorNotification({ title: t('errors.sub.409.title'), message: t('errors.sub.409.description') })
                    break;
                case 401:
                    showErrorNotification({ title: t('errors.sub.401.title'), message: t('errors.sub.401.description') })
                    break;
                default:
                    showErrorNotification({ title: t('errors.post.title'), message: t('errors.post.description') })
            }


        }
    });
    const { data: subCount, isLoading } = useQuery({ queryKey: [`sub count`], queryFn: rGetSubscriptionCount })
    const count = 1000 - (subCount ? parseInt(subCount.message) : 0)
    const Count = isLoading ? <Skeleton w={'100%'} h={30} /> :
        <Text c="slate.6">{t('buy.subCount', { count })} </Text>

    const onSubmit: SubmitHandler<{ tel: string }> = (data) => {
        mutate({ data: { TELEPHONE: data.tel.replace(/[()\s-]/g, ""), EMAIL: getCookie('email'), COUNT: 1, EVENT_ID: 1, LOCALE: locale as string, TYPE: 'Aboniment' } })

    };
    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack >
            <Controller
                name="tel"
                control={control}
                rules={{ required: t('errors.required') }}
                render={({ field: { value, onChange } }) => <Box>
                    <label htmlFor="tel" ><Text fz={14} fw={500}>{t('buy.form.tel')}</Text></label>
                    <Input
                        id="tel"
                        required
                        component={IMaskInput}
                        mask="+7 (000) 000-00-00"
                        value={value}
                        onChange={onChange}
                        error={errors["tel"]?.message}
                        placeholder={t('buy.form.tel')}
                        label={t('buy.form.tel')}

                    /></Box>} />

            {Count}
            <Button
                loading={mutateLoading || isLoading}
                variant="base"
                disabled={mutateLoading || isLoading || count == 0}
                type="submit" >{t('buy.form.btn')}</Button>
        </Stack>
    </form>
}
