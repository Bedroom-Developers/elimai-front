import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import messages from '../../../../../../messages/ru.json';
import { CodeForm } from "../CodeForm";
const meta: Meta<typeof CodeForm> = {
    title: 'Auth/CodeForm',
    component: CodeForm,

};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onSubmit: () => { },
        isPending: false,
    },
    decorators: [
        (Story) => (
            <NextIntlClientProvider locale="ru" messages={messages}>
                <Story />
            </NextIntlClientProvider>
        )
    ]
}
