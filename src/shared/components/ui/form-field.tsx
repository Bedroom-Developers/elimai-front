import { cn } from "@/shared/lib/utils";
import { Label } from "./label";
import { ValidationError } from "./validation-error";

interface FormFieldProps {
    label: string;
    name: string;
    children: React.ReactNode;
    error?: string;
    dataTestId?: string;

}
export const FormField = ({ label, name, children, error, dataTestId }: FormFieldProps) => {
    return <div className={cn("flex flex-col gap-2 w-full", error && "text-red-500")}>
        <Label htmlFor={name}>{label}</Label>
        {children}
        <ValidationError error={error} dataTestId={dataTestId} />
    </div>
}