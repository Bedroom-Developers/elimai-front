import { AuthStatusButton } from "@/modules/auth"
import Image from "next/image"
import { AdminNavlink } from "./AdminNavlink"
import { BurgerMenu } from "./BurgerMenu"
import { LinkList, } from "./LinkList"
import LocaleSwitcher from "./LocaleSwitcher"
import { Navlink } from "./Navlink"

export const Header = () => {
    return <header className="flex items-center justify-between px-4 py-2">
        <Image src={'/logonew.png'} width={50} height={50} alt='e-logo' />
        <LinkList >
            {(links) => <>
                {links.map(link => <Navlink key={link.href} href={link.href} label={link.label} withIntl {...link.options} />)}
                <AdminNavlink />
            </>}
        </LinkList>
        <section className="flex items-center gap-2">
            <LocaleSwitcher className="bg-white" />
            <AuthStatusButton />
            <BurgerMenu />
        </section>

    </header>
}