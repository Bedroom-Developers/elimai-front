import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { NextIntlClientProvider } from 'next-intl';
import { CreateEventForm } from '../CreateEventForm';

describe('CreateEventForm', () => {

    let user: ReturnType<typeof userEvent.setup>;
    beforeEach(() => {
        user = userEvent.setup();
    })

    it('should show validation errors on submit with empty fields', async () => {
        render(<NextIntlClientProvider locale="ru"><CreateEventForm onSubmit={() => { }} isPending={false} /></NextIntlClientProvider>)
        await user.click(screen.getByRole('button', { name: /Создать/i }))
        await screen.findByTestId('name_ru_error')
        expect(screen.getByTestId('name_ru_error')).toHaveTextContent(/Название \(ru\) обязательно для заполнения/)
        expect(screen.getByTestId('name_kz_error')).toHaveTextContent(/Название \(kz\) обязательно для заполнения/)
        expect(screen.getByTestId('event_date_error')).toHaveTextContent(/Дата обязательна для заполнения/)
        expect(screen.getByTestId('status_error')).toHaveTextContent(/Статус обязателен для заполнения/)
        expect(screen.getByTestId('ticket_count_error')).toHaveTextContent(/Количество билетов обязательно для заполнения/)
    })
})
