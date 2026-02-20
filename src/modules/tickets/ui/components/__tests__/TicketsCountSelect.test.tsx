import { isTicketCountValid } from "@/modules/tickets/utils"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import { beforeEach, describe, expect, it } from "vitest"
import messages from '../../../../../../messages/ru.json'
import { TicketsCountSelect } from "../TicketsCountSelect"
describe('TicketsCountSelect', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    })

    it('should be disabled if the count is invalid', () => {
        //test count
        expect(isTicketCountValid({ count: 1, ticketsCount: 1, limit: 0 })).toBe(true)
        expect(isTicketCountValid({ count: 2, ticketsCount: 1, limit: 0 })).toBe(false)
        expect(isTicketCountValid({ count: 3, ticketsCount: 1, limit: 0 })).toBe(false)
        // test limit
        expect(isTicketCountValid({ count: 3, ticketsCount: 10, limit: 0 })).toBe(true)
        expect(isTicketCountValid({ count: 3, ticketsCount: 10, limit: 3 })).toBe(false)
        expect(isTicketCountValid({ count: 2, ticketsCount: 10, limit: 1 })).toBe(true)

    }),
        it('should render the select with the correct options', async () => {

            render(<NextIntlClientProvider locale="ru" messages={messages}><TicketsCountSelect limit={3} ticketsCount={3} /></NextIntlClientProvider>)
            const trigger = screen.getByTestId('tickets-count-select-trigger')
            await user.click(trigger)
            await screen.findAllByTestId('tickets-count-select-option-1')

            const options = screen.getAllByRole('option')
            options.forEach(option => {
                expect(option).toHaveAttribute('data-disabled')
            })

        }),
        it('should allow to select only 1 ticket', async () => {

            render(<NextIntlClientProvider locale="ru" messages={messages}><TicketsCountSelect limit={2} ticketsCount={3} /></NextIntlClientProvider>)
            const trigger = screen.getByTestId('tickets-count-select-trigger')
            await user.click(trigger)
            await screen.findAllByTestId('tickets-count-select-option-1')

            const options = screen.getAllByRole('option')
            expect(options[0]).not.toHaveAttribute('data-disabled')
        })
})