'use client'
import { Link } from "@/i18n/routing"
import { useAuthStore } from "@/modules/auth/model/auth.store"
import { Button, ButtonProps } from "@/shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { BaseUIEvent } from "@base-ui/react/utils/types"
import { useTranslations } from "next-intl"
import { MouseEvent, useState } from "react"

type AuthProtectedButtonProps = ButtonProps
export function AuthProtectedButton({ children, onClick, ...props }: AuthProtectedButtonProps) {
    const [opened, setOpened] = useState(false)
    const isLogged = useAuthStore(state => state.isLogged)
    const handleClick = (e: BaseUIEvent<MouseEvent<HTMLButtonElement, globalThis.MouseEvent>>) => {
        if (isLogged && onClick) {
            onClick(e)
            return
        }
        setOpened(true)
    }

    const t = useTranslations()
    return <Dialog open={opened} onOpenChange={setOpened} >
        <DialogTrigger asChild>
            <Button variant={'outline'} onClick={e => handleClick(e)}>{children}</Button>
        </DialogTrigger>
        <DialogContent >
            <DialogHeader>
                <DialogTitle>{t('auth.protected.title')}</DialogTitle>
                <DialogDescription className={
                    'text-md'
                }>
                    {t.rich('auth.protected.desc', { login: chunk => <Link className="text-primary font-bold underline cursor-pointer" href={'/login'}>{chunk}</Link>, register: chunk => <Link className="text-primary font-bold underline cursor-pointer" href={'/register'}>{chunk}</Link> })}
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}
