
import { LogoutBtn } from "@/features"
import { Link } from "@/i18n/routing"
import { useAuthStore } from "@/modules/auth/model/auth.store"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { LogInIcon } from "lucide-react"
import { useTranslations } from "next-intl"

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
                <LogoutBtn />
                :
                <Button nativeButton={false} variant={'default'} render={(props) => <Link href={'/login'} {...props}><LogInIcon size={14} />{t('auth.login.btn')}</Link>}
                />}
    </section>
}
