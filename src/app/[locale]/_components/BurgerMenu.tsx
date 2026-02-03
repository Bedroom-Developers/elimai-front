"use client"

import { Button } from "@/shared/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { useState } from "react"
import { AdminNavlink } from "./AdminNavlink"
import { LinkList } from "./LinkList"
import { Navlink } from "./Navlink"

export const BurgerMenu = () => {
    const [open, setOpen] = useState(false)
    return <Sheet >
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ">
                <MenuIcon className="size-4" />
            </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-4">
            <LinkList className="flex-col  flex items-start">
                {(links) => <>
                    {links.map(link => <SheetClose asChild><Navlink key={link.href} href={link.href} label={link.label} withIntl {...link.options} />
                    </SheetClose>
                    )}
                    <AdminNavlink />
                </>}
            </LinkList>
        </SheetContent>
    </Sheet>
}