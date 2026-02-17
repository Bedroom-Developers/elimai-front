import { Event } from "@/shared/api/generated"
import dayjsTZ from "@/shared/dayjs"
import { EventStatus } from "../constants"

export const formatEventDate = (date: string) => {
    return dayjsTZ(date).format("DD.MM.YYYY HH:mm")
}

export const getEventTeams = (name: { name_kz: string, name_ru: string }, locale: string) => {
    const elimai = locale === "kz" ? "Елімай" : "Елимай"
    const enemy = locale === "kz" ? name.name_kz : name.name_ru
    return { elimai, enemy }
}
export const formatEventName = (name: string, locale: string) => {
    const elimai = locale === "kz" ? "Елімай" : "Елимай"
    return locale === "kz" ? `${elimai} — ${name}` : `${elimai} - ${name}`
}


export const formatPhoneNumber = (phone: string) => {
    return phone.replace(/[-+\s]/g, "")
}
export const getNextEvent = (events?: Event[]) => {
    if (!events) return null;
    const matches = events.filter(
        (event) => event.status === EventStatus.NEXT || event.status === EventStatus.ACTIVE
    );
    if (matches?.length && matches.length > 1) {
        console.warn(
            `Multiple next/active events found (${matches.length}):`,
            matches.map((e) => ({ id: e.id, status: e.status }))
        );
    }
    return matches?.[0] ?? null;
}