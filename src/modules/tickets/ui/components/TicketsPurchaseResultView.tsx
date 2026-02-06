'use client'
import { useGetTicketList } from "@/shared/api/generated";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { Ticket } from "../../types";
import { PurchaseErrorView } from "./PurchaseErrorView";
import { PurchaseSuccessView } from "./PurchaseSuccessView";

export const TicketsPurchaseResultView = () => {
    const order = useSearchParams().get("order");
    const { data, isLoading, error, refetch } = useGetTicketList<Ticket[]>({
        ORDER: order ?? ""
    }, { query: { enabled: !!order, refetchOnWindowFocus: false } })

    if (isLoading) {
        return <Skeleton className="w-5xl h-52" />
    }

    if (error || !data) {
        return <PurchaseErrorView refetch={refetch} />
    }

    return <PurchaseSuccessView tickets={data} />

}