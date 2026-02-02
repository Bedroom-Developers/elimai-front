import { Skeleton } from "@/shared/components/ui/skeleton"

export const VolunteerListSkeleton = () => {
    return (
        <section className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center p-2 border border-gray-200 rounded-md bg-slate-50"
                >
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 shrink-0" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="h-9 w-24" />
                </div>
            ))}
        </section>
    )
}
