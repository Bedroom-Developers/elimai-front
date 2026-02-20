'use client'
import { useGetEventsList } from "@/shared/api/generated"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import { TicketsCountWrapper } from "../../../tickets/ui/components/TicketsCountWrapper"
import { EventStatus } from "../../constants"
import { getNextEvent } from "../../utils"
import { EventCalendar } from "./EventCalendar"
import { EventListSkeleton } from "./EventList.skeleton"
import { NextEventInfoCard } from "./NextEventInfoCard"
import { NextEventTable } from "./NextEventTable"

export const EventsView = () => {
    const t = useTranslations()
    const { data: events, isLoading } = useGetEventsList()
    const nextEvent = useMemo(() => {
        return getNextEvent(events)
    }, [events]);


    if (isLoading) {
        return <EventListSkeleton />
    }

    if (!events) {
        return (
            <section data-testid="events-view-error" className="max-w-4xl mx-auto my-10">
                <Alert
                    variant="error"
                >
                    <AlertCircleIcon />
                    <AlertTitle>{t("gamesTable.error.title")}</AlertTitle>
                    <AlertDescription>{t("gamesTable.error.desc")}</AlertDescription>
                </Alert>
            </section>
        );
    }
    if (events.length === 0) {
        return (
            <section data-testid="events-view-not-found" className="max-w-4xl mx-auto my-10">
                <Alert
                    variant={'warning'}
                >
                    <AlertTriangleIcon />
                    <AlertTitle>{t("gamesTable.notFound.title")}</AlertTitle>
                    <AlertDescription>{t("gamesTable.notFound.desc")}</AlertDescription>
                </Alert>
            </section>
        );
    }
    if (events.every((event) => event.status == EventStatus.INACTIVE)) {
        return (
            <section data-testid="events-view-end-of-season" className="max-w-4xl mx-auto my-10">

                <Alert
                    variant="success"
                >
                    <CheckCircleIcon />
                    <AlertTitle>{t("gamesTable.endOfSeason.title")}</AlertTitle>
                </Alert>
            </section>
        );
    }
    return (
        <section className="max-w-4xl mx-auto my-2">
            <Tabs
                defaultValue="next"
            >
                <TabsList className=" w-full gap-1  ">
                    <TabsTrigger value="next">{t("gamesTable.tabs.next")}</TabsTrigger>
                    <TabsTrigger value="prev">{t("gamesTable.tabs.prev")}</TabsTrigger>
                </TabsList>
                <TabsContent
                    value="next"
                    className="min-h-32 flex  justify-center flex-col border rounded-md p-1"
                >
                    {nextEvent && nextEvent.id && nextEvent.status &&
                        <TicketsCountWrapper eventId={nextEvent.id} enabled={nextEvent.status == EventStatus.ACTIVE}>
                            {
                                ({ ticketsCount, remaining, isLoading }) =>
                                    <>
                                        <NextEventInfoCard remaining={remaining} status={nextEvent.status} ticketsCount={ticketsCount} isLoading={isLoading} />
                                        <NextEventTable event={nextEvent} ticketsCount={ticketsCount} />
                                    </>

                            }
                        </TicketsCountWrapper>}
                </TabsContent>
                <TabsContent
                    value="prev"
                    className="min-h-40 flex  justify-center border rounded-md p-1"
                >
                    <EventCalendar events={events.filter((event) => event.status === EventStatus.INACTIVE)} />
                </TabsContent>

            </Tabs>
        </section>
    )
}
