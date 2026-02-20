import { Button } from "@/shared/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { ValidationError } from "@/shared/components/ui/validation-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { CodeSchema, codeSchema } from "../../schemas/code.schema";
interface CodeFormProps {
  onSubmit: (data: CodeSchema) => void;
  isPending: boolean;
}
export const CodeForm = ({ onSubmit, isPending }: CodeFormProps) => {
  const t = useTranslations();
  const form = useForm<CodeSchema>({
    resolver: zodResolver(codeSchema),
    mode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });
  const length = useWatch({ control: form.control, name: "code" }).length;
  const onSubmitHandler: SubmitHandler<CodeSchema> = (data) => {
    onSubmit(data);
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex flex-col gap-3 items-center">
      <Controller
        name="code"
        control={form.control}
        render={({ field }) => (
          <div className="flex flex-col  gap-2 w-full mx-auto items-center"> <InputOTP role="code-input" maxLength={6} value={field.value} onChange={field.onChange} >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
            <ValidationError
              error={form.formState.errors.code?.message ? t(form.formState.errors.code.message) : undefined}
              dataTestId="code_error"
            />
          </div>
        )}
      />
      <Button role="code-form-submit-button" className={'w-full'} type="submit" disabled={isPending || length !== 6}>{t("auth.confirm.btn")}</Button>
    </form>
  );
};
