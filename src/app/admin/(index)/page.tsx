import { AddGameBtn, VolunteerBtn } from "@/features";
import { AdminGamesTable } from "@/widgets";
import { Stack } from "@mantine/core";

export default function Page() {
    return <Stack>
        <AddGameBtn />
        <VolunteerBtn />
        <AdminGamesTable />
    </Stack>
}
