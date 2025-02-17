"use client";

import { Link } from "@/i18n/routing";
import { rSendCode } from "@/shared/api/auth";
import { showErrorNotification } from "@/shared/notifications";
import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ConfirmForm } from "./ConfirmForm";
type RegisterDto = {
    email: string;
    password: string;
    confirmPassword: string;

}
export const RegisterForm = () => {
    const [showConfirm, setShowConfirm] = useState(false)
    const t = useTranslations()
    const { mutate: sendCode, isLoading } = useMutation({
        mutationKey: ["send-code"],
        mutationFn: rSendCode,
        onSuccess: (data) => {
            setShowConfirm(true)
        },
        onError: (e: { status: number }) => {
            if (e.status >= 400 && e.status < 500) {
                showErrorNotification({ title: t('errors.auth.alreadyExists.title'), message: t('errors.auth.alreadyExists.message') });
            } else {
                showErrorNotification({ title: t('errors.auth.code.title'), message: t('errors.auth.code.message') });
            }
        }
    });

    const onRegisterFormSubmit = (data: RegisterDto) => {
        sendCode({ email: data.email, type: 'Registr' });
    };
    const {
        handleSubmit,
        register,
        watch,
        getValues,
        formState: { errors },
    } = useForm<RegisterDto>({ mode: 'onChange' });

    const password = watch('password', '')
    return (!showConfirm ?
        <form
            onSubmit={handleSubmit(onRegisterFormSubmit)}
        >
            <Stack px={20} py={10} miw={350} w={'100%'} gap={10} >
                <Title order={3}>{t('auth.register.title')}</Title>
                <TextInput
                    type="email"
                    label={t('auth.email')}
                    error={errors["email"]?.message}
                    {...register("email", { required: t('errors.required') })}
                    placeholder={t('auth.email')}
                />
                <PasswordInput
                    type="password"
                    label={t('auth.password')}
                    error={errors["password"]?.message}
                    {...register("password", {
                        required: t('errors.required'), validate: {
                            hasNumber: (value) =>
                                /\d/.test(value) || t('errors.auth.hasNumber'),
                            hasUpperCase: (value) =>
                                /[A-Z]/.test(value) ||
                                t('errors.auth.hasUpperCase'),
                            hasMinimumLength: (value) =>
                                value.length >= 8 ||
                                t('errors.auth.hasMinimumLength'),
                        }
                    })}
                    placeholder={t('auth.password')}
                />
                <PasswordInput
                    type="password"
                    label={t('auth.confirmPassword')}
                    error={errors["confirmPassword"]?.message}
                    {...register("confirmPassword", {
                        required: t('errors.required'), validate: {
                            isEqual: (value) => value == password ||
                                t('errors.auth.not-equal'),

                        }
                    })}
                    placeholder={t('auth.password')}
                />

                <Text c={'slate.6'} >{t.rich('auth.register.login', { a: chunk => <Link className="link" href={'/login'}>{chunk}</Link> })}</Text>
                <Button variant="base" type="submit" >{t('auth.register.btn')}</Button>

            </Stack>
        </form> : <ConfirmForm mode="register" userData={{ email: getValues().email, password: getValues().password }} />
    );
};


