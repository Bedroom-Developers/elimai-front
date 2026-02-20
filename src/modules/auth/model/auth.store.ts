import { isAdminList } from "@/shared/api/generated";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { create } from "zustand";
import { Role } from "../constants";
interface AuthStore {
    isLogged: boolean,
    role: Role | null,
    loading: boolean,
    setIsLogged: (isLogged: boolean) => void,
    setRole: (role: Role | null) => void,
    setLoading: (loading: boolean) => void,
    logout: () => void,
    initialize: () => Promise<void>,
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLogged: false,
    role: null,
    loading: true,
    async initialize() {
        set({ loading: true });
        try {
            set({ loading: true });
            const access = getCookie('access')
            if (!access) {
                set({ isLogged: false, role: null, loading: false });
                return
            }
            const res = await isAdminList()
            console.log('res', res)
            if (res) {
                set({ isLogged: true, role: res.role as Role ?? null, loading: false });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 403) {
                    set({ isLogged: true, role: error.response?.data.role as Role ?? 'user', loading: false });
                    return;
                }
                if (error.status === 401) {
                    set({ isLogged: false, role: null, loading: false });
                    return;
                }
            }
            set({ isLogged: false, role: null, loading: false });
        }
    },
    setIsLogged: (isLogged: boolean) => set({ isLogged }),
    setRole: (role) => set({ role }),
    setLoading: (loading: boolean) => set({ loading }),
    logout: () => set({ isLogged: false, role: null }),
}))