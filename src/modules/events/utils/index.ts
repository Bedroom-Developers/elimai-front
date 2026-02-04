import { Event } from "@/shared/api/generated"
import dayjsTZ from "@/shared/dayjs"

export const formatEventDate = (date: string) => {
    return dayjsTZ(date).format("DD.MM.YYYY HH:mm")
}
export const formatEventName = (name: string, locale: string) => {
    const elimai = locale === "kz" ? "Елімай" : "Елимай"
    return locale === "kz" ? `${elimai} — ${name}` : `${elimai} - ${name}`
}

export const formatEventNameFromEvent = (event: Event, locale: string) => {
    const elimai = locale === "kz" ? "Елімай" : "Елимай"
    return locale === "kz" ? `${elimai} — ${event.name_kz}` : `${elimai} - ${event.name_ru}`
}
export const formatPhoneNumber = (phone: string) => {
    return phone.replace(/[-+\s]/g, "")
}