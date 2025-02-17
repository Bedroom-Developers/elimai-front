'use client'
import { rSendCode } from "@/shared/api/auth";
import { showErrorNotification } from "@/shared/notifications";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ConfirmForm } from "./ConfirmForm";

type RestoreDto = {
    email: string;
    newPassword: string;
    confirmNewPassword: string;

}
export const RestoreForm = () => {
    const [showConfirm, setShowConfirm] = useState(false)
    const t = useTranslations()
    const { mutate: sendCode, isLoading } = useMutation({
        mutationKey: ["send-code"],
        mutationFn: rSendCode,
        onSuccess: (data) => {
            setShowConfirm(true)
            // setCookie('token', data.token, { maxAge: 60 * 60 })
            // router.replace('/admin')
        },
        onError: (e: { status: number }) => {
            if (e.status >= 400 && e.status < 500) {
                showErrorNotification({ title: t('errors.auth.alreadyExists.title'), message: t('errors.auth.alreadyExists.message') });
            } else {
                showErrorNotification({ title: t('errors.auth.code.title'), message: t('errors.auth.code.message') });
            }
        }
    });

    const onRestoreFormSubmit = (data: RestoreDto) => {
        sendCode({ email: data.email, type: 'restore' });
    };
    const {
        handleSubmit,
        register,
        watch,
        getValues,
        formState: { errors },
    } = useForm<RestoreDto>({ mode: 'onChange' });

    const password = watch('newPassword', '')
    return (!showConfirm ?
        <form
            onSubmit={handleSubmit(onRestoreFormSubmit)}
        >
            <Stack px={20} py={10} miw={350} w={'100%'} gap={10} >
                <Title order={3}>{t('auth.restore.title')}</Title>
                <TextInput
                    type="email"
                    label={t('auth.email')}
                    error={errors["email"]?.message}
                    {...register("email", { required: t('errors.required') })}
                    placeholder={t('auth.email')}
                />

                <PasswordInput
                    type="password"
                    label={t('auth.newPassword')}
                    error={errors["newPassword"]?.message}
                    {...register("newPassword", {
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
                    placeholder={t('auth.newPassword')}
                />
                <PasswordInput
                    type="password"
                    label={t('auth.confirmPassword')}
                    error={errors["confirmNewPassword"]?.message}
                    {...register("confirmNewPassword", {
                        required: t('errors.required'), validate: {
                            isEqual: (value) => value == password ||
                                t('errors.auth.not-equal'),
                        }
                    })}
                    placeholder={t('auth.confirmPassword')}
                />
                <Button loading={isLoading} disabled={isLoading} variant="base" type="submit" >{t('auth.restore.btn')}</Button>

            </Stack>
        </form> : <ConfirmForm mode="restore" userData={{ email: getValues().email, password: getValues().newPassword }} />
    );
};

