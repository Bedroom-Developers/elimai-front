import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

export const EventManagementTableSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-32" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-32" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-36" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-20" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-40" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-40" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-8" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
