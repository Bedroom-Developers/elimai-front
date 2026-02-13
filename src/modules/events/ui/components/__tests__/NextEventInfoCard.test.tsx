import { EventStatus } from "@/modules/events/constants";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import messages from '../../../../../../messages/ru.json';
import { NextEventInfoCard } from "../NextEventInfoCard";
const withIntl = (ticketsCount: number, status: string) => {
    return (
        <NextIntlClientProvider locale="ru" messages={messages}>
            <NextEventInfoCard ticketsCount={ticketsCount} status={status} />
        </NextIntlClientProvider>
    )
}
describe('NextEventInfoCard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it('render next event info card', () => {
        render(withIntl(0, EventStatus.NEXT))
        expect(screen.getByTestId('next-event-info-card')).toBeInTheDocument()
    })
    it('render sold out event info card', () => {
        render(withIntl(0, EventStatus.ACTIVE))
        expect(screen.getByTestId('sold-out-event-info-card')).toBeInTheDocument()
    })
    it('render nothing if status is active and tickets count is greater than 0', () => {
        render(withIntl(100, EventStatus.ACTIVE))
        expect(screen.queryByTestId('next-event-info-card')).not.toBeInTheDocument()
        expect(screen.queryByTestId('sold-out-event-info-card')).not.toBeInTheDocument()
    })
})