'use client'

import { Link } from "@/i18n/routing"
import { useAuthStore } from "@/modules/auth/model/auth.store"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { LogInIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { LogoutButton } from "./LogoutButton"

export const AuthStatusButton = () => {
    const loading = useAuthStore(state => state.loading)
    const isLogged = useAuthStore(state => state.isLogged)
    console.log('loading', loading, new Date().toLocaleString())

    const t = useTranslations()
    return <section className="min-w-[103px]">
        {loading ?
            <Skeleton className="w-full h-[35px]" />
            :
            isLogged ?
                <LogoutButton />
                :
                <Button variant={'default'} asChild><Link href={'/login'}>
                    <LogInIcon size={14} />{t('auth.login.btn')}</Link>
                </Button>
        }
    </section>
}
