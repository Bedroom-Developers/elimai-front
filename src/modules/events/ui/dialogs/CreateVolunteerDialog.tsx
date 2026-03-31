'use client'
import { useVolunteerCreate } from "@/shared/api/generated"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { CreateVolunteerSchema } from "../../schemas/volunteer.schema"
import { CreateVolunteerForm } from "../forms/CreateVolunteerForm"
import { EVENT_QUERY_KEY } from "../../constants"

export const CreateVolunteerDialog = () => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { mutate: createVolunteer, isPending } = useVolunteerCreate({
        mutation: {
            onSuccess: () => {
                toast.success("Волонтер создан")
                queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.VOLUNTEERS })
                setOpen(false)
            },
            onError: () => {
                toast.error("Ошибка при создании волонтера")
            }
        }
    })
    const onSubmit = (data: CreateVolunteerSchema) => {
        createVolunteer({
            data
        })
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>Создать волонтера</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Создать волонтера</DialogTitle>
                <DialogDescription>Здесь вы можете создать нового волонтера.</DialogDescription>
            </DialogHeader>
            <CreateVolunteerForm onSubmit={onSubmit} isPending={isPending} />
        </DialogContent>
    </Dialog>
}