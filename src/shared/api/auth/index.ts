import { backendUrl, customFetch } from "@/shared/api";
import { getCookie, setCookie } from "cookies-next";
type LoginResponse = {
    access: string, refresh: string, email: string, isAdmin: boolean, role: string
}
export const rLogin = async (body: { email: string; password: string }): Promise<LoginResponse> => {
    return customFetch<LoginResponse>({ method: "POST", path: 'login/', body: { json: body } });
};
export const rCreateVolunteer = async (body: { email: string; password: string }): Promise<LoginResponse> => {
    return customFetch<LoginResponse>({ method: "POST", path: 'volunteer/', body: { json: body } });
};
export const rGetVolunteers = async (): Promise<{ email: string, password: string }[]> => {
    return customFetch({ method: "GET", path: 'volunteer/' });
};
export const rDeleteVolunteer = async (email: string): Promise<{ message: string }> => {
    return customFetch({ method: "DELETE", path: `volunteer/`, body: { json: { email } } });
};


export const rIsAdmin = async (token: string) => {
    const url = `${backendUrl}/api/is-admin/`
    try {
        const response = await fetch(url, {
            method: "GET", headers: {
                'Content-type': 'application/json',
                "authorization": `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw {
                message: "User is not admin.",
                status: response.status,
                url: response.url,
            }
        }
        const data = await response.json()
        return data
    } catch (e) {
        console.log(e)
        throw e
    }
}
export const rSendCode = (body: { email: string, type: string }) => {
    return customFetch({ method: "POST", path: 'send-code/', body: { json: body } })
}
export const rVerifyCode = (data: {
    email: string,
    code: string,
    password: string
}) => {
    return customFetch({ method: "POST", path: 'verify-code/', body: { json: { ...data, full_name: " " } } })
}
export const rResetPassword = (data: {
    email: string,
    code: string,
    new_password: string
}) => {
    return customFetch({ method: "POST", path: 'reset-password/', body: { json: data } })
}

export const rRefreshToken = async (refresh: string): Promise<{ access: string } | undefined> => {
    const url = `${backendUrl}/api/token/refresh/`
    try {
        const response = await fetch(url, {
            method: "POST", body: JSON.stringify({ refresh }), headers: {
                'Content-type': 'application/json'
            }
        })
        if (!response.ok) {
            throw {
                message: "Error, can't refresh access token",
                status: response.status,
                url: response.url,
            }
        }
        const data = await response.json()
        return data
    } catch (e) {
        console.log(e)
    }
}
export const revalidateToken = async (): Promise<string | null> => {
    try {
        const refresh = getCookie('refresh');
        if (!refresh) {
            console.log('No refresh token available');
            return null;
        }
        const response = await rRefreshToken(refresh as string);
        if (response && response.access) {
            // Optionally, store the new access token
            setCookie('access', response.access);
            return response.access;
        }
        return null;
    } catch (error) {
        console.log('Token revalidation error:', error);
        return null;
    }
};
