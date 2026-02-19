"use client";
import { Link, useRouter } from "@/i18n/routing";
import {
  useResetPasswordCreate,
  useSendCodeCreate,
} from "@/shared/api/generated";
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
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CodeSchema } from "../../schemas/code.schema";
import { RestoreSchema, restoreSchema } from "../../schemas/restore.schema";
import { PasswordInput } from "../components/PasswordInput";
import { CodeDialog } from "../dialogs/CodeDialog";

export const RestoreForm = () => {
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const form = useForm<RestoreSchema>({
    resolver: zodResolver(restoreSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      newPassword: "",
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
            message: "errors.auth.notFound.message",
          });
        } else {
          toast.error(t("errors.auth.code.message"));
        }
      },
    },
  });
  const { mutate: resetPassword, isPending: isResetPasswordPending } =
    useResetPasswordCreate({
      mutation: {
        onSuccess: () => {
          toast.success(t("auth.restore.success"));
          router.push("/login");
        },
        onError: () => {
          toast.error(t("errors.auth.otp.message"));
        },
      },
    });

  const onSubmit: SubmitHandler<RestoreSchema> = (data) => {
    sendCode({
      data: { email: data.email, type: "restore", cabinet: "restore" },
    });
  };

  const onCodeSubmit = (data: CodeSchema) => {
    const email = form.getValues("email");
    const newPassword = form.getValues("newPassword");
    resetPassword({
      data: { email, code: data.code, new_password: newPassword },
    });
  };

  return (
    <Card role="restore-form" className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {t("auth.restore.title")}
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
            label={t("auth.newPassword")}
            name="newPassword"
            error={form.formState.errors.newPassword?.message ? t(form.formState.errors.newPassword.message) : undefined}
            dataTestId="newPassword_error"
          >
            <PasswordInput
              id="newPassword"
              placeholder={t("auth.newPassword")}
              role="newPassword-input"
              aria-invalid={!!form.formState.errors.newPassword}
              {...form.register("newPassword")}
            />
          </FormField>

          <FormField

            label={t("auth.confirmPassword")}
            name="confirmPassword"
            error={form.formState.errors.confirmPassword?.message ? t(form.formState.errors.confirmPassword.message) : undefined}
            dataTestId="confirmPassword_error"
          >
            <PasswordInput
              id="confirmPassword"
              placeholder={t("auth.confirmPassword")}
              role="confirmPassword-input"
              aria-invalid={!!form.formState.errors.confirmPassword}
              {...form.register("confirmPassword")}
            />
          </FormField>

          <div className="space-y-4">
            <Button
              variant="default"
              type="submit"
              role="restore-form-submit-button"
              className="w-full"
              disabled={form.formState.isSubmitting || isPending}
            >
              {form.formState.isSubmitting
                ? t("auth.restore.btn") + "..."
                : t("auth.restore.btn")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t.rich("auth.restore.login", {
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
          actionType="restore"
          onSubmit={onCodeSubmit}
          isPending={isResetPasswordPending}
        />
      </CardContent>
    </Card>
  );
};