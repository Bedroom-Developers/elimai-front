import { TicketsPurchaseResultView } from "@/modules/tickets";

export default async function Page({ searchParams }: { searchParams: Promise<{ order: string }> }) {
    const { order } = await searchParams;

    return <section data-testid="result-page" data-order={order} className="min-h-screen flex items-center justify-center">
        <TicketsPurchaseResultView order={order} />
    </section>
}
