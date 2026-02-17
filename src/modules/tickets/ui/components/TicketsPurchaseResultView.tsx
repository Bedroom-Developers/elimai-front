'use client'
import { useGetTicketList } from "@/shared/api/generated";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Ticket } from "../../types";
import { PurchaseErrorView } from "./PurchaseErrorView";
import { PurchaseSuccessView } from "./PurchaseSuccessView";

export const TicketsPurchaseResultView = ({ order }: { order?: string }) => {
    const { data, isLoading, error, refetch } = useGetTicketList<Ticket[]>({
        ORDER: order ?? ""
    }, { query: { enabled: !!order, refetchOnWindowFocus: false, refetchOnMount: false, queryKey: ['tickets', 'list'] } })

    if (isLoading) {
        return (
            <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4 sm:p-6">
                <Skeleton className="h-24 w-full rounded-lg" />
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
            </div>
        )
    }

    if (error || !data) {
        return <PurchaseErrorView refetch={refetch} />
    }

    return <PurchaseSuccessView tickets={data} />

}