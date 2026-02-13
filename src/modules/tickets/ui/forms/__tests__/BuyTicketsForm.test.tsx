import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../../../messages/ru.json';
import { BuyTicketsForm } from '../BuyTicketsForm';

describe('BuyTicketsForm', () => {

    let user: ReturnType<typeof userEvent.setup>;
    beforeEach(() => {
        user = userEvent.setup();
    })

    it('should show validation errors on submit with empty fields', async () => {
        render(<NextIntlClientProvider locale="ru" messages={messages}><BuyTicketsForm ticketsCount={0} remaining={0} isLoading={false} onSubmit={() => { }} /></NextIntlClientProvider>)
        await user.click(screen.getByRole('buy-tickets-form-submit-button'))
        await screen.findByTestId('FIO_error')
        expect(screen.getByTestId('FIO_error')).toHaveTextContent(/Обязательное поле/)
        expect(screen.getByTestId('TELEPHONE_error')).toHaveTextContent(/Обязательное поле/)
        expect(screen.getByTestId('count_error')).toHaveTextContent(/Обязательное поле/)
    })

    it('should show validation errors on submit with invalid telephone', async () => {
        render(<NextIntlClientProvider locale="ru" messages={messages}><BuyTicketsForm ticketsCount={0} remaining={0} isLoading={false} onSubmit={() => { }} /></NextIntlClientProvider>)
        await user.type(screen.getByRole('telephone-input'), '777322323')
        await user.click(screen.getByRole('buy-tickets-form-submit-button'))
        await screen.findByTestId('TELEPHONE_error')
        expect(screen.getByTestId('TELEPHONE_error')).toHaveTextContent(/Обязательное поле/)
    })
    it('should submit form with valid data', async () => {
        const onSubmit = vi.fn();
        render(<NextIntlClientProvider locale="ru" messages={messages}><BuyTicketsForm ticketsCount={10} remaining={0} isLoading={false} onSubmit={onSubmit} /></NextIntlClientProvider>)
        await user.type(screen.getByRole('fio-input'), 'test')
        await user.type(screen.getByRole('telephone-input'), '7773223232')
        await user.click(screen.getByTestId('tickets-count-select-trigger'))
        await user.click(screen.getByTestId('tickets-count-select-option-1'))
        await user.click(screen.getByRole('buy-tickets-form-submit-button'))
        expect(onSubmit).toHaveBeenCalledWith({
            FIO: 'test',
            TELEPHONE: '77773223232',
            count: '1'
        })
    })
})
