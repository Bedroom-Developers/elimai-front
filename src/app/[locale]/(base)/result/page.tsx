import { TicketsPurchaseResultView } from "@/modules/tickets";

export default function Page({ searchParams }: { searchParams: { order: string } }) {
    return <section className="min-h-screen flex items-center justify-center">
        <TicketsPurchaseResultView order={searchParams.order} />
    </section>
}
