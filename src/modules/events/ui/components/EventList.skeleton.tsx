import { Skeleton } from "@/shared/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

export const EventListSkeleton = () => {

    return (
        <section className="max-w-4xl mx-auto my-2" data-testid="event-list-skeleton">
            <Tabs defaultValue="next">
                <TabsList className="w-full gap-1">
                    <TabsTrigger value="next" disabled>
                        <Skeleton className="h-4 w-32" />
                    </TabsTrigger>
                    <TabsTrigger value="prev" disabled>
                        <Skeleton className="h-4 w-32" />
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Skeleton className="h-4 w-20" />
                        </TableHead>
                        <TableHead className="text-center">
                            <Skeleton className="h-4 w-24 mx-auto" />
                        </TableHead>
                        <TableHead className="text-right">
                            <Skeleton className="h-4 w-20 ml-auto" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell className="text-center">
                            <Skeleton className="h-5 w-48 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-9 w-24 ml-auto" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell className="text-center">
                            <Skeleton className="h-5 w-48 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-9 w-24 ml-auto" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell className="text-center">
                            <Skeleton className="h-5 w-48 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-9 w-24 ml-auto" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </section>
    )
}