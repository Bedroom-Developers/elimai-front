"use client";
import { Link, useRouter } from "@/i18n/routing";
import { useLoginCreate } from "@/shared/api/generated";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ValidationError } from "@/shared/components/ui/validation-error";
import { ErrorType } from "@/shared/lib/client/custom-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
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
  const { mutate: login, isPending } = useLoginCreate({
    mutation: {
      onSuccess: (data) => {
        router.push("/");
      },
      onError: (error:ErrorType<{ non_field_errors: string[] }>) => {
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {t("auth.login.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.email")}
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            <ValidationError
              error={
                form.formState.errors.email?.message
                  ? t(form.formState.errors.email.message)
                  : undefined
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <PasswordInput
              id="password"
              placeholder={t("auth.password")}
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
            <ValidationError
              error={
                form.formState.errors.password?.message
                  ? t(form.formState.errors.password.message)
                  : undefined
              }
            />
          </div>

          <div className="space-y-4">
            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isPending}
            >
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
