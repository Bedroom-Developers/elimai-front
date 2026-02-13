import { EventStatus } from "@/modules/events/constants";
import { getNextEvent } from "@/modules/events/utils";
import { Event } from "@/shared/api/generated";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import messages from '../../../../../../messages/ru.json';
import { EventsView } from "../EventsView";
const mockUseEvents = vi.hoisted(() => vi.fn())

vi.mock('../../../../../shared/api/generated', () => ({
    useGetEventsList: mockUseEvents,
}))
describe('EventsView', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('loading state', () => {
        mockUseEvents.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        })
        render(<NextIntlClientProvider locale="ru" messages={messages}><EventsView />
        </NextIntlClientProvider>
        )
        expect(screen.getByTestId('event-list-skeleton')).toBeInTheDocument()

    })

    it('loading error', () => {
        mockUseEvents.mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        })
        render(<NextIntlClientProvider locale="ru" messages={messages}><EventsView />
        </NextIntlClientProvider>
        )
        expect(screen.getByTestId('events-view-error')).toBeInTheDocument()

    })
    it('not found', () => {
        mockUseEvents.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        })
        render(<NextIntlClientProvider locale="ru" messages={messages}><EventsView />
        </NextIntlClientProvider>
        )
        expect(screen.getByTestId('events-view-not-found')).toBeInTheDocument()
    })
    it('end of season', () => {
        mockUseEvents.mockReturnValue({
            data: [{ id: 1, status: EventStatus.INACTIVE }],
            isLoading: false,
            error: null,
        })
        render(<NextIntlClientProvider locale="ru" messages={messages}><EventsView />
        </NextIntlClientProvider>
        )
        expect(screen.getByTestId('events-view-end-of-season')).toBeInTheDocument()
    })

    it('returns first NEXT/ACTIVE event (single match)', () => {
        const events: Event[] = [
            { id: 1, status: EventStatus.INACTIVE, name_kz: 'Event 1', name_ru: 'Event 1', event_date: '2026-01-01' },
            { id: 2, status: EventStatus.ACTIVE, name_kz: 'Event 2', name_ru: 'Event 2', event_date: '2026-01-02' },
            { id: 3, status: EventStatus.INACTIVE, name_kz: 'Event 3', name_ru: 'Event 3', event_date: '2026-01-03' },
        ];
        const result = getNextEvent(events);
        expect(result).toEqual(events[1])
    })
})