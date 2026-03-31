'use client'
import { useEffect } from "react"
import { useAuthStore } from "../../model/auth.store"

interface AuthContextProps {
    children: React.ReactNode
}

export const AuthContext = ({ children }: AuthContextProps) => {
    const initialize = useAuthStore(state => state.initialize)

    useEffect(() => {
        initialize()
    }, [])
    return <>{children}</>
}