"use client";

import { rCreateVolunteer } from "@/shared/api/auth";
import { showErrorNotification, showSuccessNotification } from "@/shared/notifications";
import { queryClient } from "@/shared/Providers";
import { Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
type LoginDto = {
    email: string;
    password: string;
}
export const CreateVolunteerForm = () => {
    const router = useRouter()
    const { mutate: createVolunteer, isLoading } = useMutation({
        mutationKey: ["create volunteer"],
        mutationFn: rCreateVolunteer,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['volunteers'] })
            showSuccessNotification({ title: "Успешно", message: "Волонтер создан" });

            reset()
        },
        onError: (e) => {
            console.log(e)
            showErrorNotification({ title: "Ошибка", message: "Что-то пошло не так" });
        }
    });
    const onSubmit = (data: LoginDto) => {
        createVolunteer(data)

    };
    const {
        handleSubmit,
        register,
        watch,
        reset,
        getValues,
        formState: { errors },
    } = useForm<LoginDto>({ mode: 'onChange' });

    const password = watch('password', '')
    return <form
        onSubmit={handleSubmit(onSubmit)}
    >
        <Stack maw={600} mx={'auto'} px={20} py={10} miw={350} w={'100%'} gap={10} >
            <Title order={3}>Создать</Title>
            <TextInput
                label={'Логин'}
                error={errors["email"]?.message}
                {...register("email", { required: "Обязательное поле" })}
                placeholder='Логин'
                disabled={false}
            />
            <PasswordInput
                type="password"
                label="Пароль"
                error={errors["password"]?.message}
                {...register("password", { required: "Обязательное поле" })}
                placeholder="Пароль" />
            <Button loading={isLoading} disabled={isLoading} variant="base" type="submit" >Создать волонтера</Button>

        </Stack>
    </form>

}



