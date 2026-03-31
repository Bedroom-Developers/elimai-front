import { renderWithProviders } from "@/shared/lib/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CodeDialog } from "../CodeDialog";

describe('CodeDialog', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    })
    it('should render', () => {
        render(renderWithProviders(<CodeDialog open={true} onOpenChange={() => { }} email={""} actionType="register" onSubmit={() => { }} isPending={false} />))
        expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument()
    })
    it("shouldn't close when clicking on the overlay", async () => {
        render(renderWithProviders(<CodeDialog open={true} onOpenChange={() => { }} email={""} actionType="register" onSubmit={() => { }} isPending={false} />))
        await user.click(screen.getByTestId('dialog-overlay'))
        expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument()
    })
    it("shouldn't close when click on ESC key", async () => {
        render(renderWithProviders(<CodeDialog open={true} onOpenChange={() => { }} email={""} actionType="register" onSubmit={() => { }} isPending={false} />))
        await user.keyboard('{Escape}')
        expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument()
    })
})