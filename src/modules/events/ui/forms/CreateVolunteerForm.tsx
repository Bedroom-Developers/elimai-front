'use client'
import { Button } from "@/shared/components/ui/button"
import { FormField } from "@/shared/components/ui/form-field"
import { Input } from "@/shared/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { CreateVolunteerSchema, createVolunteerSchema } from "../../schemas/volunteer.schema"
interface CreateVolunteerFormProps {
    onSubmit: (data: CreateVolunteerSchema) => void
    isPending: boolean
}
export const CreateVolunteerForm = ({ onSubmit, isPending }: CreateVolunteerFormProps) => {
    const form = useForm<CreateVolunteerSchema>({
        resolver: zodResolver(createVolunteerSchema),
    })
    const onSubmitHandler: SubmitHandler<CreateVolunteerSchema> = (data) => {
        onSubmit(data)
    }
    return <form onSubmit={form.handleSubmit(onSubmitHandler)} className="flex flex-col gap-2 ">
        <FormField label="Введите email" name="email" error={form.formState.errors.email?.message}>
            <Input placeholder="Email" {...form.register("email")} />
        </FormField>
        <FormField label="Введите пароль" name="password" error={form.formState.errors.password?.message}>
            <Input placeholder="Введите пароль" {...form.register("password")} />
        </FormField>
        <Button disabled={isPending} type="submit">Создать волонтера</Button>
    </form>
}