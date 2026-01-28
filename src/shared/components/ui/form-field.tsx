import { Label } from "./label";
import { ValidationError } from "./validation-error";

interface FormFieldProps {
    label: string;
    name: string;
    children: React.ReactNode;
    error?: string;

}
export const FormField = ({ label, name, children, error }: FormFieldProps) => {
    return <div className="flex flex-col gap-2 w-full">
        <Label htmlFor={name}>{label}</Label>
        {children}
        <ValidationError error={error} />
    </div>
}