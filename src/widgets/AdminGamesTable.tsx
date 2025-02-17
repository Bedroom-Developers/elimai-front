'use client'
import { DeleteGameBtn, EditGameBtn } from "@/features";
import { rCreateAdminSub, rCreateAdminTicket, rGetGameExcel, rGetGames, rGetSubExcel } from "@/shared/api/games";
import { Game, notificationErrors } from "@/shared/consts";
import { useCreatePdf } from "@/shared/hooks";
import { showErrorNotification } from "@/shared/notifications";
import { Box, Button, Group, LoadingOverlay, Stack, Table, Title } from "@mantine/core";
import { deleteCookie } from "cookies-next";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "react-query";
export const AdminGamesTable = () => {
    const router = useRouter()
    const { data: games, isLoading, isError } = useQuery({
        queryKey: ['games'], queryFn: async () => {
            const data = await rGetGames()
            return data
        }, onError: (e: { detail: string }) => {
            if (e.detail == 'Invalid token.') {
                deleteCookie('token')
                router.replace('/admin/login')

            }
        }
    })
    if (isLoading) {
        return <Box w={'100%'} h={400} pos='relative'><LoadingOverlay loaderProps={{ color: 'elimai.6' }} visible={isLoading} zIndex={1000} /></Box>
    }
    if (!games) { return <Title c={'red.5'} order={3}>Ошибка загрузки</Title> }
    const rows = games.map((element, idx) => (
        <Table.Tr key={element.id}>
            <Table.Td ta={'center'}>{dayjs(element.event_date).locale('ru').format("MMMM D,YYYY HH:mm")}</Table.Td>
            <Table.Td ta={'center'}>{element.name_ru}</Table.Td>
            <Table.Td ta={'center'}>{element.name_kz}</Table.Td>
            <Table.Td ta={'center'}>
                {element.status}
            </Table.Td>
            <Table.Td ta={'center'}>
                <CreateAdminTicketBtn game={element} />
            </Table.Td>

            <Table.Td ta={'center'}>
                <EditGameBtn game={element} />
            </Table.Td>
            <Table.Td ta={'center'}>
                <DeleteGameBtn id={element.id} />
            </Table.Td>
            <Table.Td ta={'center'}>
                <GetExcelTicketBtn game={element} />
            </Table.Td>

        </Table.Tr>
    ));

    return (
        <Stack align="center" my={20} >
            <Group w={'100%'} align="start">
                <CreateAdminSubBtn />
                <GetExcelSubBtn />
            </Group>
            <Title order={2}>Матчи</Title>
            <Table.ScrollContainer minWidth={500} w={'100%'}>
                <Table miw={390} fz={{
                    xs: 14, md: 16, lg: 18
                }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th ta={'center'}>Дата</Table.Th>
                            <Table.Th ta={'center'}>Противник RU</Table.Th>
                            <Table.Th ta={'center'}>Противник KZ</Table.Th>
                            <Table.Th ta={'center'}>Статус</Table.Th>
                            <Table.Th ta={'center'}>Создать билет</Table.Th>
                            <Table.Th ta={'center'}>Изменить</Table.Th>
                            <Table.Th ta={'center'}>Удалить</Table.Th>
                            <Table.Th ta={'center'}>Отчет</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>

                </Table>
            </Table.ScrollContainer>
        </Stack>
    );
}
const CreateAdminTicketBtn = ({ game }: { game: Game }) => {
    const { createTicket } = useCreatePdf()
    const { mutate: create, isLoading, isError } = useMutation({
        mutationKey: [`admin-ticket ${game.id}`], mutationFn: rCreateAdminTicket, onSuccess: (data) => {
            createTicket([{ code: data.code, date: dayjs(game.event_date).format("YYYY-MM-DD"), name_ru: game.name_ru, name_kz: game.name_kz, status: data.status }])
        }, onError: (e) => {
            console.log(e)
            showErrorNotification(notificationErrors.create)
        }
    })

    return <Button loading={isLoading} onClick={() => create({ data: { order: '000001', event: game.id, email: 'admin', telephone: 'admin', will_deactivate_at: dayjs(game.event_date).format("YYYY-MM-DD"), status: 'Active', psign: 'none', code: 'ticket-' + Date.now() } })}>
        Создать билет
    </Button>


}
const GetExcelTicketBtn = ({ game }: { game: Game }) => {
    const { mutate: getExcel, isLoading, isError } = useMutation({
        mutationKey: [`excel ${game.id}`], mutationFn: rGetGameExcel, onSuccess: (data) => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${game.name_ru}-${dayjs(game.event_date).format('YYYY-MM-DD HH:mm')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }, onError: (e) => {
            console.log(e)
            showErrorNotification(notificationErrors.get)
        }
    })

    return <Button bg={'slate.7'} loading={isLoading} onClick={() => getExcel(game.id)}>
        Отчет
    </Button>


}
const GetExcelSubBtn = () => {
    const { mutate: getExcel, isLoading, isError } = useMutation({
        mutationKey: [`excel sub`], mutationFn: rGetSubExcel, onSuccess: (data) => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Абонементы-${dayjs(new Date()).format('YYYY-MM-DD')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }, onError: (e) => {
            console.log(e)
            showErrorNotification(notificationErrors.get)
        }
    })

    return <Button bg={'slate.7'} loading={isLoading} onClick={() => getExcel()}>
        Отчет Абонементы
    </Button>


}
const CreateAdminSubBtn = () => {
    const { createSub } = useCreatePdf()
    const { mutate: create, isLoading, isError } = useMutation({
        mutationKey: [`admin-ticketsub`], mutationFn: rCreateAdminSub, onSuccess: (data) => {
            createSub(data.code)
        }, onError: (e) => {
            console.log(e)
            showErrorNotification(notificationErrors.create)
        }
    })

    return <Button variant="alert" loading={isLoading} onClick={() => create({ data: { order: '000001', event: '0', email: 'admin', telephone: 'admin', will_deactivate_at: dayjs(new Date()).format("YYYY-MM-DD"), status: 'Active', psign: 'none', code: 'aboniment-' + Date.now() } })}>
        Создать Абонемент
    </Button>


}
