import { CreateEventDialog } from "@/modules/events/ui/dialogs/CreateEventDialog";
import { EventsManagementTable } from "@/modules/events/ui/components/EventsManagementTable";

export default function Page() {
    return <section className="flex flex-col gap-5 w-full ">
        <h1 className="text-2xl font-bold">Управление событиями</h1>
        <p className="text-sm text-muted-foreground">Здесь вы можете управлять событиями, создавать новые, изменять существующие и удалять.</p>

        <CreateEventDialog />
        <section className="p-2 border rounded-md">
            <EventsManagementTable />
        </section>
    </section>
}
