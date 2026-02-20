import z from "zod/v4";

export const restoreSchema = z.object({
    email: z.email({error: "errors.auth.email.invalid"}),
    newPassword: z.string().min(8, {error: "errors.auth.password.minLength"}),
    confirmPassword: z.string().min(8, {error: "errors.auth.password.minLength"}),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "errors.auth.password.match",
})
export type RestoreSchema = z.infer<typeof restoreSchema>;