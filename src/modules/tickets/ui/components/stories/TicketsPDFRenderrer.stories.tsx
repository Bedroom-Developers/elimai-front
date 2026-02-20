import { EventStatus } from "@/modules/events/constants";
import { useCreatePdf } from "@/modules/tickets/hooks/use-pdf";
import { Ticket } from "@/modules/tickets/types";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";

const TicketsPDFRenderrer = ({ tickets }: { tickets: Ticket[] }) => {
    const { renderTicketsPDF } = useCreatePdf();
    const [url, setUrl] = useState<string>();
    useEffect(() => {
        const fetchUrl = async () => {
            const url = await renderTicketsPDF(tickets);
            if (url) {
                setUrl(url);
            }
        }
        fetchUrl();
    }, [tickets]);
    return <div className="w-full h-screen"> <iframe className="w-full h-full" src={url} /></div>

}

const meta: Meta<typeof TicketsPDFRenderrer> = {
    title: 'Tickets/TicketsPDFRenderrer',
    component: TicketsPDFRenderrer,

};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultRu: Story = {
    args: {
        tickets: [
            {
                code: '1234567890',
                name_ru: 'Кызылжар',
                name_kz: 'Кызылжар',
                date: new Date().toISOString(),
                status: EventStatus.ACTIVE,
            }
        ]
    },



}
