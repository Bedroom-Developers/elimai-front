import z from "zod/v4";

export const loginSchema = z.object({
  email: z.email({error: ""}),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;