"use client";

import { rLogin } from "@/shared/api/auth";
import { notificationErrors } from "@/shared/consts";
import { showErrorNotification } from "@/shared/notifications";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { deleteCookie } from "cookies-next";
import { setCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

export const AdminLoginForm = () => {
    const router = useRouter();
    const { mutate, isLoading, isError } = useMutation({
        mutationKey: ["login"],
        mutationFn: rLogin,
        onSuccess: (data) => {
            setCookie('access', data.access)
            setCookie('refresh', data.refresh)
            router.replace('/admin')
        },
        onError: (e) => {
            console.log(e)
            showErrorNotification(notificationErrors.login);
        }
    });

    const onSubmit = (data: { email: string; password: string }) => {
        mutate(data);
        deleteCookie("token");
    };
    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm<{
        email: string;
        password: string;
    }>();
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
        >
            <Stack miw={350} w={'100%'} gap={10}>
                <Title order={3}>Авторизация</Title>
                <TextInput
                    error={errors["email"]?.message}
                    {...register("email", { required: "Обязательное поле" })}
                    placeholder={'Логин'}
                />
                <PasswordInput
                    type="password"
                    error={errors["password"]?.message}
                    {...register("password", { required: "Обязательное поле" })}
                    placeholder={'Пароль'}
                />
                <Button variant="base" disabled={isLoading} type="submit" >Войти</Button>

            </Stack>
        </form>
    );
};
