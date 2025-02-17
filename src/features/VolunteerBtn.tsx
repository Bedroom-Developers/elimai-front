'use client'
import { CreateVolunteerForm } from "@/features/forms/CreateVolunteerForm";
import { rDeleteVolunteer, rGetVolunteers } from "@/shared/api/auth";
import { notificationErrors, notificationSuccess } from "@/shared/consts";
import { showErrorNotification, showSuccessNotification } from "@/shared/notifications";
import { queryClient } from "@/shared/Providers";
import { Box, Button, Flex, LoadingOverlay, Modal, Stack, Table, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DeleteIcon } from "lucide-react";
import { useMutation, useQuery } from "react-query";

export const VolunteerBtn = () => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal fullScreen opened={opened} onClose={close} title={'Волонтеры'}>
                <CreateVolunteerForm />
                <VolunteersTable />
            </Modal>
            <Button maw={300} variant="base" onClick={open}>
                Волонтеры
            </Button>
        </>
    );
}

export const VolunteersTable = () => {
    const { data: volunteers, isLoading, isError } = useQuery({
        queryKey: ['volunteers'], queryFn: async () => {
            const data = await rGetVolunteers()
            return data
        }, onError: (e: { detail: string }) => {
        }
    })
    if (isLoading) {
        return <Box w={'100%'} h={400} pos='relative'><LoadingOverlay loaderProps={{ color: 'elimai.6' }} visible={isLoading} zIndex={1000} /></Box>
    }
    if (!volunteers) { return <Title c={'red.5'} order={3}>Ошибка загрузки</Title> }
    const rows = volunteers.map((element, idx) => (
        <Table.Tr key={element.email}>
            <Table.Td>{element.email}</Table.Td>
            <Table.Td ta={'center'}><DeleteVolunteerBtn email={element.email} /></Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack align="center" my={20} >
            <Title order={2}>Список волонтеров</Title>
            <Table.ScrollContainer maw={600} minWidth={290} w={'100%'}>
                <Table withTableBorder miw={390} fz={{
                    xs: 14, md: 16, lg: 18
                }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th ta={'center'}>Логин</Table.Th>
                            <Table.Th ta={'center'}>Удалить</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>

                </Table>
            </Table.ScrollContainer>
        </Stack>
    );
}
const DeleteVolunteerBtn = ({ email }: { email: string }) => {
    const { mutate: deleteData, isLoading } = useMutation({
        mutationKey: [`deleteData ${email}`],
        mutationFn: async () => {
            await rDeleteVolunteer(email);
        },
        onSuccess: () => {
            showSuccessNotification(notificationSuccess.delete);
            queryClient.invalidateQueries({ queryKey: ["volunteers"] });
        },
        onError: (e) => {
            console.log("Delete error :", e);
            showErrorNotification(notificationErrors.delete);
        },
    });
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Удалить">
                <Box>
                    <Text mb={20} fz={"lg"}>
                        Вы уверены , что хотите удалить Волонтера?
                    </Text>
                    <Flex justify={"center"} align={"center"} gap={20}>
                        <Button
                            onClick={() => deleteData()}
                            loading={isLoading}
                            disabled={isLoading}
                            color="red.6"
                        >
                            Да
                        </Button>
                        <Button variant="outline" color="slate.9" onClick={close}>
                            Отмена
                        </Button>
                    </Flex>
                </Box>
            </Modal>
            <Button color="red.6" onClick={open}>
                <DeleteIcon />
            </Button>
        </>
    );
}
