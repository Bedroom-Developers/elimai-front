import { Skeleton } from "@/shared/components/ui/skeleton"
import { ComponentProps } from "react"

type BuyTicketsFormSkeletonProps = ComponentProps<'div'>
export const BuyTicketsFormSkeleton = (props: BuyTicketsFormSkeletonProps) => {
    return (
        <div className="space-y-4" {...props}>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    )
}