'use client'
import { usePathname } from "@/i18n/routing"
import { Center, Text } from "@mantine/core"
import { MoveLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

export const HeaderLink = () => {
    const router = useRouter()
    const pathname = usePathname()
    const t = useTranslations()
    const onClick = () => {
        if (pathname == '/') {
            router.push('https://fcelimai.kz/')
        } else {
            router.push('/')
        }

    }
    return <button onClick={onClick}>
        <Center style={{ gap: 10 }}>
            <MoveLeft />
            <Text fw={'bold'} c={'slate.9'} size="lg">
                {t(pathname == '/' ? 'header.main' : "header.back")}
            </Text>
        </Center>
    </button>
}
