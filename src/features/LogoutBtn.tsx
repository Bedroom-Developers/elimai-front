import { useRouter } from "@/i18n/routing"
import { useAuthStore } from "@/modules/auth"
import { Button } from "@/shared/components/ui/button"
import { deleteCookie } from "cookies-next/client"
import { LogOutIcon } from "lucide-react"
import { useTranslations } from "next-intl"

export const LogoutBtn = () => {
    const router = useRouter()
    const logout = useAuthStore(state => state.logout);
    const handleLogout = () => {
        deleteCookie("access")
        deleteCookie("refresh")
        deleteCookie("email")
        logout()
        router.replace('/')
    }
    const t = useTranslations()
    return <Button onClick={handleLogout}>
        <LogOutIcon size={14} />
        <span>{t('auth.logout')}</span>
    </Button>
}
