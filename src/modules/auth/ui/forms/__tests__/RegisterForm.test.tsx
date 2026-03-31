import { ErrorType } from "@/shared/lib/client/custom-instance";
import { renderWithProviders } from "@/shared/lib/tests";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterForm } from "../RegisterForm";

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
const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();
vi.mock("sonner", () => ({
    toast: {
        error: (...args: unknown[]) => toastErrorMock(...args),
        success: (...args: unknown[]) => toastSuccessMock(...args),

    },
}));
const mutateMock = vi.fn();
let sendCodeMutationCallbacks: { onSuccess?: () => void; onError?: (e: ErrorType<{ errors: Record<string, string> }>) => void } = {
    onSuccess: vi.fn(),
    onError: vi.fn()
}
let verifyCodeMutationCallbacks: { onSuccess?: () => void; onError?: (e?: ErrorType<{ errors: Record<string, string> }>) => void } = {
    onSuccess: vi.fn(),
    onError: vi.fn()
}

vi.mock('../../../../../shared/api/generated', () => ({
    useSendCodeCreate: (options: { mutation: typeof sendCodeMutationCallbacks }) => {
        sendCodeMutationCallbacks = options.mutation;
        return { mutate: mutateMock, isPending: false };
    },
    useVerifyCodeCreate: (options: { mutation: typeof verifyCodeMutationCallbacks }) => {
        verifyCodeMutationCallbacks = options.mutation;
        return { mutate: mutateMock, isPending: false };
    }
}))


describe('RegisterForm', () => {
    let user: ReturnType<typeof userEvent.setup>;
    beforeEach(() => {
        user = userEvent.setup();
    })
    it('should render', () => {
        render(renderWithProviders(<RegisterForm />))
    })
    it('should show validation errors on submit with empty fields', async () => {
        render(renderWithProviders(<RegisterForm />))
        await user.click(screen.getByRole('register-form-submit-button'))
        await screen.findByTestId('email_error')
        expect(screen.getByTestId('email_error')).toHaveTextContent('Обязательное поле')
        expect(screen.getByTestId('password_error')).toHaveTextContent('Поле должно содержать не менее 8 символов')
        expect(screen.getByTestId('confirmPassword_error')).toHaveTextContent('Поле должно содержать не менее 8 символов')
    })

    it('should show validation errors on submit with invalid email', async () => {
        render(renderWithProviders(<RegisterForm />))
        await user.type(screen.getByRole('email-input'), 'test@test.com')
        await user.click(screen.getByRole('register-form-submit-button'))
        await screen.findByTestId('email_error')
        expect(screen.getByTestId('email_error')).toHaveTextContent('Email с недопустимым доменом')
    })
    it('should open code dialog when code is sent', async () => {
        render(renderWithProviders(<RegisterForm />))
        await user.type(screen.getByRole('email-input'), 'test@abai-it.kz')
        await user.type(screen.getByRole('password-input'), 'Test12345678')
        await user.type(screen.getByRole('confirmPassword-input'), 'Test12345678')
        await user.click(screen.getByRole('register-form-submit-button'))
        await act(async () => {
            sendCodeMutationCallbacks.onSuccess?.();
        });
        expect(screen.getByRole('dialog')).toBeInTheDocument()

    })
    it('should show error toast when code is invalid', async () => {
        render(renderWithProviders(<RegisterForm />))
        await user.type(screen.getByRole('email-input'), 'test@abai-it.kz')
        await user.type(screen.getByRole('password-input'), 'Test12345678')
        await user.type(screen.getByRole('confirmPassword-input'), 'Test12345678')
        await user.click(screen.getByRole('register-form-submit-button'))
        await act(async () => {
            verifyCodeMutationCallbacks.onError?.();
        });
        expect(toastErrorMock).toHaveBeenCalledTimes(1);
    })
    it("should redirect to login page when code is verified", async () => {
        render(renderWithProviders(<RegisterForm />))
        await act(async () => {
            verifyCodeMutationCallbacks.onSuccess?.();
        });
        expect(toastSuccessMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith('/ru/login')
    })
})