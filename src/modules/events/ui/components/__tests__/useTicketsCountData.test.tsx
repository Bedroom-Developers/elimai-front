import { ticketsCountDataQueryFn } from '@/modules/tickets/hooks/useTicketsCountData';
import { beforeEach, describe, expect, it, vi } from 'vitest';


vi.mock("../../../../../shared/api/generated", () => ({
    getTicketsCountList: vi.fn(),
    eventLimitList: vi.fn(),
}))

const getTicketsCountListMock = vi.mocked((await import('../../../../../shared/api/generated')).getTicketsCountList);
const eventLimitListMock = vi.mocked((await import('../../../../../shared/api/generated')).eventLimitList);


describe('useTicketsCountDataQueryFn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns tickets and remaining for logged user', async () => {
        getTicketsCountListMock.mockResolvedValue({ message: '50' });
        eventLimitListMock.mockResolvedValue({ message: '10' });

        const result = await ticketsCountDataQueryFn(123, true);

        expect(getTicketsCountListMock).toHaveBeenCalledWith({ EVENT_ID: 123 });
        expect(eventLimitListMock).toHaveBeenCalledWith({ EVENT_ID: 123 });
        expect(result).toEqual({ ticketsCount: 50, remaining: 10 });
    });

    it('returns tickets and 0 remaining for unlogged user', async () => {
        getTicketsCountListMock.mockResolvedValue({ message: '30' });

        const result = await ticketsCountDataQueryFn(456, false);

        expect(getTicketsCountListMock).toHaveBeenCalledWith({ EVENT_ID: 456 });
        expect(eventLimitListMock).not.toHaveBeenCalled();
        expect(result).toEqual({ ticketsCount: 30, remaining: 0 });
    });
});
