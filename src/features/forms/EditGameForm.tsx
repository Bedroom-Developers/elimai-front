'use client'
import { rEditGame } from "@/shared/api/games";
import { Game, GameStatus, notificationErrors, notificationSuccess } from "@/shared/consts";
import { showErrorNotification, showSuccessNotification } from "@/shared/notifications";
import { queryClient } from "@/shared/Providers";
import { Button, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

export const EditGameForm = ({ game, close }: { game: Game, close: () => void }) => {
    const {
        handleSubmit,
        register,
        getValues,
        control,
        formState: { errors },
    } = useForm<Game>({ defaultValues: game });
    const { mutate, isLoading, isError } = useMutation({
        mutationKey: ["editGame"],
        mutationFn: rEditGame,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['games'] })
            showSuccessNotification(notificationSuccess.update);
            close()
        },
        onError: (e) => {
            console.log(e)
            showErrorNotification(notificationErrors.update)
        }

    });
    const onSubmit: SubmitHandler<Game> = (data) => {
        mutate({ ...data, event_date: dayjs(data.event_date).format("YYYY-MM-DD HH:mm:ss") })
    };


    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack p={10}>
            <TextInput
                error={errors["name_ru"]?.message}
                {...register("name_ru", { required: "Обязательное поле" })}
                placeholder={'Противник RU'}
                label={'Противник RU'}

            />
            <TextInput
                error={errors["name_kz"]?.message}
                {...register("name_kz", { required: "Обязательное поле" })}
                placeholder={'Противник KZ'}
                label={'Противник KZ'}
            />
            <Controller
                control={control}
                name="ticket_count"
                rules={{ required: "Обязательное поле" }}
                render={({ field: { value, onChange } }) =>
                    <NumberInput label="Лимит билетов" placeholder="Максимальное количество билетов" value={value} onChange={onChange} />
                }
            />

            <Controller
                control={control}
                name="event_date"
                rules={{ required: "Обязательное поле" }}
                render={({ field: { value, onChange } }) =>
                    <DateTimePicker
                        error={errors["event_date"]?.message}
                        lang="RU"
                        w={150}
                        label="Дата"
                        placeholder="Выберите дату"
                        value={dayjs(value).toDate()}
                        onChange={onChange}
                    />

                }
            />
            <Controller
                control={control}
                name="status"
                rules={{ required: "Обязательное поле" }}
                render={({ field: { value, onChange } }) =>
                    <Select
                        error={errors["status"]?.message}
                        data={GameStatus}
                        label="Статус"
                        placeholder="Выберите статус"
                        value={value}
                        onChange={onChange}
                    />

                }
            />

            <Button loading={isLoading} variant="base" disabled={isLoading} type="submit" >Изменить</Button>
        </Stack>
    </form >
}
