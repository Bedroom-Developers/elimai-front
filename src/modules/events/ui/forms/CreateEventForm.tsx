import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { FormField } from "@/shared/components/ui/form-field";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { EventStatus } from "../../constants";
import { createEventSchema, CreateEventSchema } from "../../schemas/event.schema";

interface CreateEventFormProps {
    onSubmit: (data: CreateEventSchema) => void;
    isPending: boolean;
}
export const CreateEventForm = ({ isPending, onSubmit }: CreateEventFormProps) => {
    const form = useForm<CreateEventSchema>({
        resolver: zodResolver(createEventSchema),
    })
    const onSubmitHandler: SubmitHandler<CreateEventSchema> = (data) => {
        onSubmit(data);
    }
    return <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
            <FormField label="Название (ru)" name="name_ru" error={form.formState.errors.name_ru?.message} dataTestId="name_ru_error">
                <Input {...form.register("name_ru")} />
            </FormField>
            <FormField label="Название (kz)" name="name_kz" error={form.formState.errors.name_kz?.message} dataTestId="name_kz_error">
                <Input {...form.register("name_kz")} />
            </FormField>
        </div>
        <div className="flex gap-2 w-full">
            <Controller
                name="event_date"
                control={form.control}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <FormField label="Дата" name="event_date" error={errors.event_date?.message} dataTestId="event_date_error">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={'outline'} className={'justify-start'} >
                                    <span className="text-left text-sm "> {value ? format(value, 'dd.MM.yyyy HH:mm') : 'Выберите дату'}</span>
                                </Button>

                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar
                                    className="mx-auto text-primary"
                                    captionLayout="dropdown"
                                    selected={value}
                                    mode="single"
                                    disabled={{ before: new Date() }}
                                    onSelect={(v) => {
                                        if (!v) return;
                                        const base = value ? value : new Date();
                                        const next = new Date(
                                            v.getFullYear(),
                                            v.getMonth(),
                                            v.getDate(),
                                            base.getHours(),
                                            base.getMinutes(),
                                            base.getSeconds(),
                                            0,
                                        );
                                        onChange(next);
                                    }}
                                />
                                <FormField label="Время" name="event_time" >
                                    <Input
                                        type="time"
                                        step="1"
                                        value={value ? format(value, "HH:mm:ss") : ""}
                                        onChange={(e) => {
                                            const [h = "0", m = "0", s = "0"] = e.target.value.split(":");
                                            const base = value ? new Date(value) : new Date();

                                            const next = new Date(
                                                base.getFullYear(),
                                                base.getMonth(),
                                                base.getDate(),
                                                Number(h),
                                                Number(m),
                                                Number(s),
                                                0,
                                            );

                                            onChange(next);
                                        }}
                                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </FormField>
                            </PopoverContent>
                        </Popover>
                    </FormField>
                )}
            />
            <Controller
                name="status"
                control={form.control}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <FormField label="Статус" name="status" error={errors.status?.message} dataTestId="status_error">
                        <Select
                            value={value}
                            onValueChange={onChange}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Выберите статус" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(EventStatus).map(status => <SelectItem value={status} key={status}>{status}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </FormField>
                )}
            />
        </div>
        <FormField label="Количество билетов" name="ticket_count" error={form.formState.errors.ticket_count?.message} dataTestId="ticket_count_error">
            <Input   {...form.register("ticket_count")} />
        </FormField>

        <Button className={'ml-auto'} type="submit" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Создать</Button>
    </form>
}