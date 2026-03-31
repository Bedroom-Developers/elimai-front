import { useResizeObserver } from "../../hooks/use-resize-observer"
import { Ticket } from "../../types"

interface TicketViewProps {
    ticket: Ticket
}
export const TicketView = ({ ticket }: TicketViewProps) => {
    const { canvasRef } = useResizeObserver({
        data: ticket,
        kind: 'ticket',
        templateUrl: '/ticket-template.png'
    })
    return <canvas
        width={564}
        height={800}
        className="w-full h-auto block max-w-[564px] max-h-[800px] rounded-lg shadow-md"
        ref={canvasRef}
    />
}
