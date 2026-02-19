import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslations } from "next-intl";
import { CodeSchema } from "../../schemas/code.schema";
import { ResendCodeTimer } from "../components/ResendCodeTimer";
import { CodeForm } from "../forms/CodeForm";
interface CodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  actionType: "register" | "restore";
  onSubmit: (data: CodeSchema) => void;
  isPending: boolean;
}
export const CodeDialog = ({
  open,
  onOpenChange,
  onSubmit,
  email,
  actionType,
  isPending,
}: CodeDialogProps) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader role="code-dialog-header">
          <DialogTitle>{t("auth.confirm.title")}</DialogTitle>
          <DialogDescription role="code-dialog-description">
            {t("auth.confirm.description", { email })}
          </DialogDescription>
        </DialogHeader>
        <CodeForm onSubmit={onSubmit} isPending={isPending} />
        <ResendCodeTimer initialSeconds={60} email={email} actionType={actionType} />
      </DialogContent>
    </Dialog>
  );
};
