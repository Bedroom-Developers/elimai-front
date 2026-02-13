
import z3 from "zod/v3";

export const buyTicketsSchema = z3.object({

    TELEPHONE: z3.string().transform((val) => val.replace(/[+\-_]/g, "")).refine((val) => val.length === 11, { message: "errors.required" }),
    count: z3.string({
        errorMap: () => ({ message: "errors.required" })
    }).min(1),
    FIO: z3.string().min(1, { message: "errors.required" }),
})
export type BuyTicketsSchema = z3.infer<typeof buyTicketsSchema>;
