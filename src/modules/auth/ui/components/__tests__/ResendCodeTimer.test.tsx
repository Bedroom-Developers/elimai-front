import { formatTime } from "@/modules/auth/utils"
import { renderWithProviders } from "@/shared/lib/tests"
import { act, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ResendCodeTimer } from "../ResendCodeTimer"



describe('ResendCodeTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });
    it('should render', () => {
        render(renderWithProviders(<ResendCodeTimer initialSeconds={1} email={""} actionType="register" />))
    })
    it("formatTime should return the correct time", () => {
        const time = formatTime(60)
        expect(time).toBe('1:00')
    })

    it('should show the correct time', async () => {
        render(renderWithProviders(<ResendCodeTimer initialSeconds={1} email={""} actionType="register" />))

        expect(screen.getByTestId('resend-code-timer-text')).toHaveTextContent('0:01')
    })
    it("should show resend button when the time is up", async () => {
        render(
            renderWithProviders(
                <ResendCodeTimer initialSeconds={1} email="" actionType="register" />
            )
        );

        expect(screen.getByTestId("resend-code-timer-text")).toBeInTheDocument();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1000);
        });

        expect(screen.getByRole("resend-code-timer-button")).toBeInTheDocument();
        expect(screen.queryByTestId("resend-code-timer-text")).not.toBeInTheDocument();
    });

})