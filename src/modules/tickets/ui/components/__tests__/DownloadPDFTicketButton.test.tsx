import { Ticket } from '@/modules/tickets/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import messages from '../../../../../../messages/ru.json'
import { DownloadPDFTicketsButton } from '../DownloadPDFTicketsButton'

const downloadTicketsPDFMock = vi.fn()

vi.mock('@/modules/tickets/hooks/use-pdf', () => ({
    useCreatePdf: () => ({
        downloadTicketsPDF: downloadTicketsPDFMock,
        downloadCertPDF: vi.fn(),
    }),
}))
describe('DownloadPDFTicketButton', () => {
    it('calls downloadTicketsPDF with tickets on click', async () => {
        const user = userEvent.setup()
        const tickets: Ticket[] = [{ code: 'ABC', name_ru: 'ABC', name_kz: 'ABC', date: new Date().toISOString(), status: 'active' }]

        render(
            <NextIntlClientProvider locale="ru" messages={messages}>
                <DownloadPDFTicketsButton tickets={tickets} />
            </NextIntlClientProvider>
        )

        await user.click(screen.getByRole('download-pdf-tickets-button'))

        expect(downloadTicketsPDFMock).toHaveBeenCalledTimes(1)
        expect(downloadTicketsPDFMock).toHaveBeenCalledWith(tickets)
    })
})
