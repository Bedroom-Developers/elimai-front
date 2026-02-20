import { renderWithProviders } from "@/shared/lib/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CodeForm } from "../CodeForm";

describe('CodeForm', () => {
    let user: ReturnType<typeof userEvent.setup>;
    beforeEach(() => {
        user = userEvent.setup();
    })
    it('should render', () => {
        render(renderWithProviders(<CodeForm onSubmit={() => { }} isPending={false} />))
    })

    it("should be disabled when code is not filled", async () => {
        render(renderWithProviders(<CodeForm onSubmit={() => { }} isPending={false} />))

        expect(screen.getByRole('code-form-submit-button')).toBeDisabled()
    })
    it("should be disabled when code is not filled", async () => {
        render(renderWithProviders(<CodeForm onSubmit={() => { }} isPending={false} />))
        await user.type(screen.getByRole('code-input'), '123452')
        expect(screen.getByRole('code-form-submit-button')).not.toBeDisabled()
    })

})