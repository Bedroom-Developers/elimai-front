import { CreateVolunteerDialog, VolunteerList } from "@/modules/events";

export default function VolunteersPage() {
  return (
    <section className="flex flex-col gap-5 w-full">
      <h1 className="text-2xl font-bold">Волонтеры</h1>
      <p className="text-sm text-muted-foreground">
        Управление волонтерами.
      </p>
      <section className="space-y-2">
        <CreateVolunteerDialog />
        <VolunteerList />
      </section>
    </section>
  )
}
