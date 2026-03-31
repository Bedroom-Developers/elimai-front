import { ErrorType } from '@/shared/lib/client/custom-instance';
import { renderWithProviders } from '@/shared/lib/tests';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RestoreForm } from '../RestoreForm';
const createError = (errors: Record<string, string>): ErrorType<{ errors: Record<string, string> }> => {
    return {
        isAxiosError: true,
        toJSON: vi.fn(),
        name: 'AxiosError',
        message: 'AxiosError message',
        response: {
            data: { errors },
            statusText: 'Bad Request',
            status: 400,
            headers: {},
            config: {
                headers: {} as AxiosRequestHeaders,
            } as InternalAxiosRequestConfig,


        },
    }

}
const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();
vi.mock("sonner", () => ({
    toast: {
        error: (...args: unknown[]) => toastErrorMock(...args),
        success: (...args: unknown[]) => toastSuccessMock(...args),
    },
}));
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
let sendCodeMutationCallbacks: { onSuccess?: () => void; onError?: (e?: ErrorType<{ errors: Record<string, string> }>) => void } = {
    onSuccess: vi.fn(),
    onError: vi.fn()
}
let resetPasswordMutationCallbacks: { onSuccess?: () => void; onError?: () => void } = {
    onSuccess: vi.fn(),
    onError: vi.fn()
}

vi.mock('@/shared/api/generated', () => ({
    useSendCodeCreate: (options: { mutation: typeof sendCodeMutationCallbacks }) => {
        sendCodeMutationCallbacks = options.mutation;
        return { mutate: mutateMock, isPending: false };
    },
    useResetPasswordCreate: (options: { mutation: typeof resetPasswordMutationCallbacks }) => {
        resetPasswordMutationCallbacks = options.mutation;
        return { mutate: mutateMock, isPending: false };
    }
}))


describe('RestoreForm', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    })

    it('should render', () => {
        render(renderWithProviders(<RestoreForm />))
        expect(screen.getByRole('restore-form')).toBeInTheDocument()
    })

    it("should show validation errors on submit with empty fields", async () => {
        render(renderWithProviders(<RestoreForm />))
        await user.click(screen.getByRole('restore-form-submit-button'))
        await screen.findByTestId('email_error')
        expect(screen.getByTestId('email_error')).toHaveTextContent('Неверный формат email')
        expect(screen.getByTestId('newPassword_error')).toHaveTextContent('Поле должно содержать не менее 8 символов')
        expect(screen.getByTestId('confirmPassword_error')).toHaveTextContent('Поле должно содержать не менее 8 символов')
    })

    it("should show non-existing email error if email is not found", async () => {
        render(renderWithProviders(<RestoreForm />))
        await user.type(screen.getByRole('email-input'), 'test@test.com')
        await user.type(screen.getByRole('newPassword-input'), 'Test12345678')
        await user.type(screen.getByRole('confirmPassword-input'), 'Test12345678')
        const emailError = createError({ email: 'Пользователь с такой почтой не существует' })
        await user.click(screen.getByRole('restore-form-submit-button'))

        await act(async () => {
            sendCodeMutationCallbacks.onError?.(emailError);
        })
        expect(screen.getByTestId('email_error')).toHaveTextContent('Пользователь с такой почтой не существует')

    })

    it("should open code dialog when code is sent", async () => {
        render(renderWithProviders(<RestoreForm />))
        await user.type(screen.getByRole('email-input'), 'test@abai-it.kz')
        await user.type(screen.getByRole('newPassword-input'), 'Test12345678')
        await user.type(screen.getByRole('confirmPassword-input'), 'Test12345678')
        await user.click(screen.getByRole('restore-form-submit-button'))
        await act(async () => {
            sendCodeMutationCallbacks.onSuccess?.();
        })
        expect(screen.getByRole('code-dialog-header')).toBeInTheDocument()
    })


    it("should show error toast when code is invalid", async () => {
        render(renderWithProviders(<RestoreForm />))
        await user.type(screen.getByRole('email-input'), 'test@abai-it.kz')
        await user.type(screen.getByRole('newPassword-input'), 'Test12345678')
        await user.type(screen.getByRole('confirmPassword-input'), 'Test12345678')
        await user.click(screen.getByRole('restore-form-submit-button'))
        await act(async () => {
            resetPasswordMutationCallbacks.onError?.();
        })
        expect(toastErrorMock).toHaveBeenCalledTimes(1);
    })

    it("should redirect to login page when code is verified", async () => {
        render(renderWithProviders(<RestoreForm />))
        await act(async () => {
            resetPasswordMutationCallbacks.onSuccess?.();
        })
        expect(toastSuccessMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith('/ru/login')
    })
});