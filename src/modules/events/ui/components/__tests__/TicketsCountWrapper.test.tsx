import { TicketsCountWrapper } from "@/modules/tickets/ui/components/TicketsCountWrapper";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseEvents = vi.hoisted(() => vi.fn());

vi.mock('../../../../../modules/tickets/hooks/useTicketsCountData', () => ({
    useTicketsCountData: mockUseEvents,
}))

describe('TicketsCountWrapper', () => {
    it('no request if status is not active', () => {
        mockUseEvents.mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        })
        render(<TicketsCountWrapper eventId={1} enabled={false} >
            {({ ticketsCount, remaining, isLoading }) => <div>TicketsCountWrapper {ticketsCount}</div>}
        </TicketsCountWrapper>)
        expect(mockUseEvents).toHaveBeenCalledTimes(1)
    })

})