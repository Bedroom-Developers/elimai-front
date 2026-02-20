import z from "zod/v4";

export const createVolunteerSchema = z.object({
    email: z.email({ message: "Email обязателен для заполнения" }),
    password: z.string().min(8, { message: "Пароль должен быть не менее 8 символов" }),
})
export type CreateVolunteerSchema = z.infer<typeof createVolunteerSchema>