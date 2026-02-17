import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/modules/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import messages from "../../../../../../messages/ru.json";
import { BuyTicketDialog } from "../BuyTicketsDialog";

// Mocks


const url = "https://example.com/payment";
const getCookieMock = vi.fn();
vi.mock("cookies-next/client", () => ({
    getCookie: (...args: unknown[]) => getCookieMock(...args),
}));

const toastErrorMock = vi.fn();
vi.mock("sonner", () => ({
    toast: { error: (...args: unknown[]) => toastErrorMock(...args) },
}));

const mutateMock = vi.fn();
let mutationCallbacks: { onSuccess?: (data: { url?: string }) => void; onError?: () => void } =
    {};

vi.mock("@/shared/api/generated", () => ({
    useCreateTicketCreate: (options: { mutation: typeof mutationCallbacks }) => {
        mutationCallbacks = options.mutation;
        return { mutate: mutateMock, isPending: false };
    },
}));



// Mock формы, чтобы не кликать реальные поля — форма уже покрыта своими тестами
vi.mock("../../forms/BuyTicketsForm", () => ({
    BuyTicketsForm: (props: { onSubmit: (data: any) => void }) => (
        <button
            data-testid="mock-buy-tickets-form-submit"
            onClick={() =>
                props.onSubmit({
                    email: "test@example.com",
                    TELEPHONE: "+7-777-777-77-77",
                    count: "1",
                })
            }
        >
            MockBuyTicketsForm
        </button>
    ),
}));

const renderDialog = () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <NextIntlClientProvider locale="ru" messages={messages}>
                <BuyTicketDialog eventId={1} />
            </NextIntlClientProvider>
        </QueryClientProvider>
    );
    return { user };
};

describe("BuyTicketDialog", () => {
    beforeEach(async () => {
        await act(async () => {
            useAuthStore.setState({ isLogged: true })
        })
        Object.defineProperty(window, "location", {
            value: {
                href: url,
            },
            writable: true,
        });
        getCookieMock.mockReturnValue("test@example.com");

        vi.clearAllMocks();

    });

    it("shows error toast and does not call mutate when email is missing", async () => {
        const { user } = renderDialog();
        getCookieMock.mockReturnValue(undefined);

        // открыть диалог
        await user.click(screen.getByRole("button", { name: /Купить/i }));
        // клик по замоканной форме, чтобы вызвать onSubmit
        await user.click(screen.getByTestId("mock-buy-tickets-form-submit"));

        expect(toastErrorMock).toHaveBeenCalledTimes(1);
        expect(mutateMock).not.toHaveBeenCalled();
    });

    it("shows error toast when onSuccess returns no url", async () => {
        const { user } = renderDialog();

        await user.click(screen.getByRole("button", { name: /Купить/i }));
        await user.click(screen.getByTestId("mock-buy-tickets-form-submit"));

        expect(mutateMock).toHaveBeenCalledTimes(1);

        await act(async () => {
            mutationCallbacks.onSuccess?.({ url: undefined });
        });

        expect(toastErrorMock).toHaveBeenCalledTimes(1);
    });

    it("pushes router and closes dialog on success with url", async () => {
        const { user } = renderDialog();

        await user.click(screen.getByRole("button", { name: /Купить/i }));
        await user.click(screen.getByTestId("mock-buy-tickets-form-submit"));

        await act(async () => {
            mutationCallbacks.onSuccess?.({ url });
        });

        expect(window.location.href).toBe(url)
        await waitFor(() => {
            expect(screen.queryByText("Покупка билетов")).not.toBeInTheDocument();
        });
    });

    it("shows error toast on mutation error", async () => {
        const { user } = renderDialog();
        await user.click(screen.getByRole("button", { name: /Купить/i }));
        await user.click(screen.getByTestId("mock-buy-tickets-form-submit"));

        await act(async () => {
            mutationCallbacks.onError?.();
        });

        expect(toastErrorMock).toHaveBeenCalledTimes(1);
    });
});
