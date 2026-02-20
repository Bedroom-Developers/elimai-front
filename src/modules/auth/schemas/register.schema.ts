import z from "zod/v4";
import { ALLOWED_DOMAINS_FOR_REGISTER } from "../constants";

export const registerSchema = z
  .object({
    email: z
      .string({ error: "errors.auth.required" })
      .min(1, { error: "errors.auth.required" }),
    password: z
      .string({ error: "errors.auth.required" })
      .min(8, { error: "errors.auth.hasMinimumLength" }),
    confirmPassword: z
      .string({ error: "errors.auth.required" })
      .min(8, { error: "errors.auth.hasMinimumLength" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "errors.auth.not-equal",
  })
  .refine(
    (data) => ALLOWED_DOMAINS_FOR_REGISTER.includes(data.email.split("@")[1]),
    {
      path: ["email"],
      message: "errors.auth.invalidEmailDomain",
    }
  );

export type RegisterSchema = z.infer<typeof registerSchema>;
