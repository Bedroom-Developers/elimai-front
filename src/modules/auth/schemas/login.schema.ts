import z from "zod/v4";

export const loginSchema = z.object({
  email: z.email({ error: "errors.auth.required" }),
  password: z.string().min(1, { error: "errors.auth.required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;