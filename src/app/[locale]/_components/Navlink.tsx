'use client'
import { Link as IntlLink } from "@/i18n/routing"
import { cn } from "@/shared/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps } from "react"
const isActive = (pathname: string, href: string, locale: string) => {
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/"
    const normalizedHref = href === "/" ? "/" : href.replace(/\/$/, "")
    return pathWithoutLocale === normalizedHref || pathWithoutLocale.startsWith(normalizedHref + "/")
}

interface NavlinkProps extends ComponentProps<'a'> {
    href: string
    label: string
    withIntl?: boolean
}
export const Navlink = ({ href, label, withIntl, ...props }: NavlinkProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const pathname = usePathname()
    const Comp = withIntl ? IntlLink : Link
    const active = isActive(pathname, href, locale)

    return <Comp className={cn(active && "text-primary underline underline-offset-4")} href={href} {...props}>{withIntl ? t(label) : label}</Comp>

}