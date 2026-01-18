import { Button } from "@/shared/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
  const onSubmitHandler: SubmitHandler<CodeSchema> = (data) => {
    onSubmit(data);
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex flex-col gap-3 items-center">
      <Controller
        name="code"
        control={form.control}
        render={({ field }) => (
          <InputOTP maxLength={6} value={field.value} onChange={field.onChange} className="mx-auto">
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
        )}
      />
      <Button className={'w-full'} type="submit" disabled={isPending}>{t("auth.confirm.btn")}</Button>
    </form>
  );
};
