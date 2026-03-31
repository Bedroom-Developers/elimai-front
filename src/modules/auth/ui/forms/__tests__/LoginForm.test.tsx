

import { LoginCreate200 } from '@/shared/api/generated';
import { ErrorType } from '@/shared/lib/client/custom-instance';
import { renderWithProviders } from '@/shared/lib/tests';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '../LoginForm';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock

    }),
    redirect: vi.fn(),
    permanentRedirect: vi.fn(),
    usePathname: () => ({
        get: vi.fn()
    }),
    useSearchParams: () => ({
        get: vi.fn()
    })
}))
const mutateMock = vi.fn();
let loginMutationCallbacks: { onSuccess?: (data: LoginCreate200) => void; onError?: (e?: ErrorType<{ errors: Record<string, string> }>) => void } = {
    onSuccess: vi.fn(),
    onError: vi.fn(),
}
vi.mock('@/shared/api/generated', () => ({
    useLoginCreate: (options: { mutation: typeof loginMutationCallbacks }) => {
        loginMutationCallbacks = options.mutation;
        return { mutate: mutateMock, isPending: false };
    }
}))
describe('LoginForm', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    })

    it('should render', () => {
        render(renderWithProviders(<LoginForm />))
        expect(screen.getByRole('login-form')).toBeInTheDocument()
    })

    it('should show validation errors on submit with empty fields', async () => {
        render(renderWithProviders(<LoginForm />))
        await user.click(screen.getByRole('login-form-submit-button'))
        await screen.findByTestId('email_error')
        expect(screen.getByTestId('email_error')).toHaveTextContent('Обязательное поле')
        expect(screen.getByTestId('password_error')).toHaveTextContent('Обязательное поле')
    })
    it("should redirect on success login", async () => {
        render(renderWithProviders(<LoginForm />))
        await user.type(screen.getByRole('email-input'), 'test@abai-it.kz')
        await user.type(screen.getByRole('password-input'), 'Test12345678')
        await user.click(screen.getByRole('login-form-submit-button'))
        await act(async () => {
            loginMutationCallbacks.onSuccess?.({
                access: 'test',
                refresh: 'test',
                role: 'test',
            });
        });
        expect(pushMock).toHaveBeenCalledWith('/ru')
    })

})