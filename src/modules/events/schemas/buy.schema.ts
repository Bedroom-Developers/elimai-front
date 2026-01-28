
import z4 from "zod/v4";

export const buyTicketsSchema = z4.object({

    TELEPHONE: z4.string().min(11, { message: "errors.required" }),
    count: z4.string().min(1, { message: "errors.required" }),
    FIO: z4.string().min(1, { message: "errors.required" }),
})
export type BuyTicketsSchema = z4.infer<typeof buyTicketsSchema>;