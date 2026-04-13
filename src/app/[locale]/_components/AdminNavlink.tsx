'use client'

import { ROLES } from "@/modules/auth/constants"
import { useAuthStore } from "@/modules/auth/model/auth.store"
import { Navlink } from "./Navlink"

export const AdminNavlink = () => {
    const role = useAuthStore(state => state.role)
    return role == ROLES.ADMIN && <Navlink href={'/admin'} label={'Админ-панель'} />
}