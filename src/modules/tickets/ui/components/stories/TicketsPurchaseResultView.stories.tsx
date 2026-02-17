import { Ticket } from "@/modules/tickets/types";
import { Meta, ReactRenderer, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import { PartialStoryFn } from "storybook/internal/types";
import messagesKz from '../../../../../../messages/kz.json';
import messagesRu from '../../../../../../messages/ru.json';
import { TicketsPurchaseResultView } from "../TicketsPurchaseResultView";
interface DecoratorsProps {
    queryData: {
        loading: boolean;
        error: boolean;
        data?: Ticket[];

    }

    locale: string;
}
const decorators = ({ queryData, locale }: DecoratorsProps) => {
    const client = new QueryClient()
    client.setQueryData(['tickets', 'list'], queryData.data)
    return [(Story: PartialStoryFn<ReactRenderer, {
        order?: string | undefined;
    }>) => (
        <NextIntlClientProvider locale={locale} messages={locale === 'ru' ? messagesRu : messagesKz}>
            <QueryClientProvider client={client}>
                <Story />
            </QueryClientProvider>
        </NextIntlClientProvider>
    ),]
}


const meta: Meta<typeof TicketsPurchaseResultView> = {
    title: 'Tickets/TicketsPurchaseResultView',
    component: TicketsPurchaseResultView,

};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultRu: Story = {
    args: {
        order: '1234567890',
    },
    decorators: decorators({
        queryData: {
            loading: false,
            error: false,
            data: [
                {
                    name_ru: 'Ticket 1',
                    name_kz: 'Ticket 1',
                    date: '2026-01-01',
                    status: 'active',
                    code: '1234567890',
                }
            ]
        },
        locale: 'ru'
    })
}
export const DefaultKz: Story = {
    args: {
        order: '1234567890',
    },
    decorators: decorators({
        queryData: {
            loading: false,
            error: false,
            data: [
                {
                    name_ru: 'Ticket 1',
                    name_kz: 'Ticket 1',
                    date: '2026-01-01',
                    status: 'active',
                    code: '1234567890',
                }
            ]
        },
        locale: 'kz'
    })
}
export const Loading: Story = {
    args: {
        order: '1234567890',
    },
    decorators: decorators({
        queryData: {
            loading: true,
            error: false,
            data: undefined
        },
        locale: 'ru'
    })
}

export const Error: Story = {
    args: {
        order: '1234567890',
    },
    decorators: decorators({
        queryData: {
            loading: false,
            error: true,
            data: undefined
        },
        locale: 'ru'
    })
}