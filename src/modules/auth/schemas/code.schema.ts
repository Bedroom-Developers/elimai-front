import z from "zod/v4";

export const codeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "errors.auth.required" })
    .max(6, { message: "errors.auth.maxLength" }),
});

export type CodeSchema = z.infer<typeof codeSchema>;
