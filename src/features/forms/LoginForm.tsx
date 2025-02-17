"use client";

import { Link } from "@/i18n/routing";
import { rLogin } from "@/shared/api/auth";
import { rGetGames } from "@/shared/api/games";
import { GameStatus } from "@/shared/consts";
import { useAuth } from "@/shared/context";
import { showErrorNotification } from "@/shared/notifications";
import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { deleteCookie, setCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
type LoginDto = {
    email: string;
    password: string;
}
export const LoginForm = () => {
    const t = useTranslations()
    const router = useRouter()

    const { logged, refetch } = useAuth()
    const [getLoading, setGetLoading] = useState(false)
    const { mutate: login, isLoading } = useMutation({
        mutationKey: ["login"],
        mutationFn: rLogin,
        onSuccess: (data) => {
            setCookie('access', data.access)
            setCookie('refresh', data.refresh)
            setCookie('email', data.email)
            if (logged) logged()
            if (refetch) refetch()

            switch (data.role) {
                case 'volunteer':
                    setGetLoading(true)
                    rGetGames().then(games => {
                        const active = games.find(game => game.status == GameStatus[0])
                        if (active) {
                            router.replace(`/admin/qr/${active.id}`)
                        } else {
                            router.replace(`/`)
                        }
                    }).finally(() => setGetLoading(false))
                    break;
                default: router.replace('/')
            }

        },
        onError: (e) => {
            console.log(e)
            showErrorNotification({ title: t('errors.auth.login.title'), message: t('errors.auth.login.message') });
        }
    });
    const onSubmit = (data: LoginDto) => {
        login(data)
        deleteCookie('access')
        deleteCookie('refresh')
    };
    const {
        handleSubmit,
        register,
        watch,
        getValues,
        formState: { errors },
    } = useForm<LoginDto>({ mode: 'onChange' });

    const password = watch('password', '')
    return <form
        onSubmit={handleSubmit(onSubmit)}
    >
        <Stack px={20} py={10} miw={350} w={'100%'} gap={10} >
            <Title order={3}>{t('auth.login.title')}</Title>
            <TextInput
                label={t('auth.email')}
                error={errors["email"]?.message}
                {...register("email", { required: t('errors.required') })}
                placeholder={t('auth.email')}
                disabled={false}
            />
            <PasswordInput
                type="password"
                label={t('auth.password')}
                error={errors["password"]?.message}
                {...register("password", {
                    required: t('errors.required'),
                })}
                placeholder={t('auth.password')}
            />
            <Text size="sm" c={'slate.6'} >{t.rich('auth.login.restore', { a: (chunk) => <Link className="link" href={'/restore'}>{chunk}</Link> })}</Text>
            <Text size="sm" c={'slate.6'} >{t.rich('auth.login.register', { a: (chunk) => <Link className="link" href={'/register'}>{chunk}</Link> })}</Text>
            <Button loading={isLoading || getLoading} disabled={isLoading || getLoading} variant="base" type="submit" >{t('auth.login.btn')}</Button>

        </Stack>
    </form>

}
