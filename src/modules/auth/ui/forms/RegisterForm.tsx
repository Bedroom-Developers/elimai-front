"use client";
import { Link, useRouter } from "@/i18n/routing";
import { useSendCodeCreate, useVerifyCodeCreate } from "@/shared/api/generated";
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
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CodeSchema } from "../../schemas/code.schema";
import { registerSchema, RegisterSchema } from "../../schemas/register.schema";
import { CodeDialog } from "../dialogs/CodeDialog";

export const RegisterForm = () => {
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutate: sendCode, isPending } = useSendCodeCreate({
    mutation: {
      onSuccess: () => {
        setOpenCodeDialog(true);
      },
      onError: (e: ErrorType<{ errors: Record<string, string> }>) => {
        if (e.response?.data?.errors?.email) {
          form.setError("email", {
            message: t("errors.auth.alreadyExists.message"),
          });
        } else {
          toast.error(t("errors.auth.code.message"));
        }
      },
    },
  });
  const {mutate: verifyCode, isPending: isVerifyCodePending} = useVerifyCodeCreate({
    mutation: {
      onSuccess: () => {
        toast.success(t("auth.register.success"));
        router.push("/login");
      },
      onError: () => {
        toast.error(t("errors.auth.code.message"));
      },
    }
  })

  const onCodeSubmit: SubmitHandler<RegisterSchema> = (data) => {
    sendCode({
      data: { email: data.email, type: "register", cabinet:"" },
    });
  };

  const onRegisterSubmit= (data:CodeSchema) => {
    const email = form.getValues("email");
    const password = form.getValues("password");
    verifyCode({ data: { email, code: data.code, password } });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {t("auth.register.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onCodeSubmit)} className="space-y-4">
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
            <Input
              id="password"
              type="password"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("auth.confirmPassword")}
              aria-invalid={!!form.formState.errors.confirmPassword}
              {...form.register("confirmPassword")}
            />
            <ValidationError
              error={
                form.formState.errors.confirmPassword?.message
                  ? t(form.formState.errors.confirmPassword.message)
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
                ? t("auth.register.btn") + "..."
                : t("auth.register.btn")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t.rich("auth.register.login", {
                a: (chunk) => (
                  <Link
                    href="/login"
                    className="text-primary underline-offset-4 hover:underline font-medium"
                  >
                    {chunk}
                  </Link>
                ),
              })}
            </p>
          </div>
        </form>
        <CodeDialog
          open={openCodeDialog}
          onOpenChange={setOpenCodeDialog}
          email={form.getValues("email")}
          actionType="register"
          onSubmit={onRegisterSubmit}
          isPending={isVerifyCodePending}
        />
      </CardContent>
    </Card>
  );
};
