import { useAuthStore } from "@/modules/auth/model/auth.store";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import messages from '../../../../../../messages/ru.json';
import { AuthProtectedButton } from "../AuthProtectedButton";



describe('AuthProtectedButton', () => {
    it('when user is logged in, it should call onClick', async () => {
        const onClick = vi.fn()

        render(
            <NextIntlClientProvider locale="ru" messages={messages}>
                <AuthProtectedButton onClick={onClick}>Login</AuthProtectedButton>
            </NextIntlClientProvider>
        )

        await act(async () => {
            useAuthStore.setState({ isLogged: true })
        })

        fireEvent.click(screen.getByText('Login'))
        expect(onClick).toHaveBeenCalled()
        expect(screen.queryByTestId('auth-protected-button-dialog')).not.toBeInTheDocument()
    }),
        it('when user is not logged in, it should open the dialog', async () => {
            const onClick = vi.fn()

            render(
                <NextIntlClientProvider locale="ru" messages={messages}>
                    <AuthProtectedButton onClick={onClick}>Login</AuthProtectedButton>
                </NextIntlClientProvider>
            )
            fireEvent.click(screen.getByText('Login'))
            expect(screen.getByTestId('auth-protected-button-dialog')).toBeInTheDocument()
            expect(onClick).not.toHaveBeenCalled()
        })

})