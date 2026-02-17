import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ROLES } from "./modules/auth";

const intlMiddleware = createMiddleware(routing);

export async function adminMiddleware(req: NextRequest) {
    try {
        const token = req.cookies.get("access");
        if (!token) {
            throw new Error("No token found")
        }
        const isAdmin = req.cookies.get("role")?.value == ROLES.ADMIN;
        if (!isAdmin) {
            throw new Error("User is not admin")
        }
        return NextResponse.next()
    } catch (e) {
        console.error(e)
        return NextResponse.redirect(new URL(`/ru/login`, req.url))
    }
}

const publicRoutes = ['register', 'login']

const privateRoutes = ['profile']

export function authMiddleware(req: NextRequest) {
    const token = req.cookies.get("access");
    const { pathname } = req.nextUrl;
    const locale = req.cookies.get('NEXT_LOCALE')?.value ?? 'kz';
    const params = pathname.slice(4, pathname.length)
    if ((privateRoutes.includes(params)) && !token) {
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
    }

    if ((publicRoutes.includes(params)) && token) {
        return NextResponse.redirect(new URL(`/`, req.url))
    }

    return intlMiddleware(req);

}
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/admin")) {
        return adminMiddleware(req);
    }
    return authMiddleware(req);
}

export const config = {
    matcher: [
        "/",
        "/admin",
        "/(ru|kz)", // Locales
        "/(ru|kz)/:path*", // All paths under a locale
    ],
};
