import { z } from "zod/v4";

export const createEventSchema = z.object({
    name_kz: z.string().min(1, { error: "Название (kz) обязательно для заполнения" }),
    name_ru: z.string().min(1, { error: "Название (ru) обязательно для заполнения" }),
    event_date: z.date({ error: "Дата обязательна для заполнения" }),
    status: z.string({ error: "Статус обязателен для заполнения" }),
    ticket_count: z.string().min(1, { error: "Количество билетов обязательно для заполнения" }),
})

export const editEventSchema = createEventSchema;
export type CreateEventSchema = z.infer<typeof createEventSchema>;
export type EditEventSchema = z.infer<typeof editEventSchema>;