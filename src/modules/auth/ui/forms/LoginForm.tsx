"use client";
import { Link, useRouter } from "@/i18n/routing";
import { LoginCreate200, useLoginCreate } from "@/shared/api/generated";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FormField } from "@/shared/components/ui/form-field";
import { Input } from "@/shared/components/ui/input";
import { ErrorType } from "@/shared/lib/client/custom-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Role } from "../../constants";
import { useAuthStore } from "../../model/auth.store";
import { loginSchema, LoginSchema } from "../../schemas/login.schema";
import { PasswordInput } from "../components/PasswordInput";

export const LoginForm = () => {
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setIsLogged, setRole } = useAuthStore(state => state);
  const { mutate: login, isPending } = useLoginCreate({
    mutation: {
      onSuccess: (data: LoginCreate200) => {

        setIsLogged(true);
        setRole(data.role as Role);

        setCookie("access", data.access);
        setCookie("refresh", data.refresh);
        setCookie("email", data.email);
        setCookie("role", data.role);

        router.push("/");
      },
      onError: (error: ErrorType<{ non_field_errors: string[] }>) => {
        if (error.response?.data.non_field_errors.includes("Invalid credentials")) {
          form.setError("password", {
            message: "errors.auth.login.message",
          });
        } else {
          toast.error(t("errors.post.description"));
        }
      },
    },
  });
  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    login({ data });
  };

  return (
    <Card role="login-form" className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {t("auth.login.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label={t("auth.email")}
            name="email"
            error={form.formState.errors.email?.message ? t(form.formState.errors.email.message) : undefined}
            dataTestId="email_error"
          >
            <Input
              id="email"
              type="email"
              role="email-input"
              placeholder={t("auth.email")}
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
          </FormField>

          <FormField
            label={t("auth.password")}
            name="password"
            error={form.formState.errors.password?.message ? t(form.formState.errors.password.message) : undefined}
            dataTestId="password_error"
          >
            <PasswordInput
              id="password"
              role="password-input"
              placeholder={t("auth.password")}
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
          </FormField>

          <div className="space-y-4">
            <Button
              role="login-form-submit-button"
              variant="default"
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {form.formState.isSubmitting
                ? t("auth.login.btn") + "..."
                : t("auth.login.btn")}
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
              <p>
                {t.rich("auth.login.register", {
                  a: (chunk) => (
                    <Link
                      href="/register"
                      className="text-primary underline-offset-4 hover:underline font-medium"
                    >
                      {chunk}
                    </Link>
                  ),
                })}
              </p>
              <p>
                {t.rich("auth.login.restore", {
                  a: (chunk) => (
                    <Link
                      href="/restore"
                      className="text-primary underline-offset-4 hover:underline font-medium"
                    >
                      {chunk}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
