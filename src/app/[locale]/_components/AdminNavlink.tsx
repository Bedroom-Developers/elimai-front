'use client'

import { ROLES, useAuthStore } from "@/modules/auth"
import { Navlink } from "./Navlink"

export const AdminNavlink = () => {
    const role = useAuthStore(state => state.role)
    return role == ROLES.ADMIN && <Navlink href={'/admin'} label={'Админ-панель'} />

}