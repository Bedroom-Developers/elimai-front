import { Event } from "@/shared/api/generated"
import dayjsTZ from "@/shared/dayjs"

export const formatEventDate = (date: string) => {
    return dayjsTZ(date).format("DD.MM.YYYY HH:mm")
}

export const formatEventName = (event: Event, locale: string) => {
    const elimai = locale === "kz" ? "Елімай" : "Елимай"
    return locale === "kz" ? `${elimai} — ${event.name_kz}` : `${elimai} - ${event.name_ru}`
}