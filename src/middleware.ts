import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ROLES } from "./modules/auth/constants";

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
        return NextResponse.redirect(new URL(`/ru/login`, req.url))
    }
}

const publicRoutes = new Set(["register", "login", "restore"]);
const privateRoutes = new Set(["profile"]);

const getRouteSegment = (pathname: string) => {
    const [, locale, segment] = pathname.split("/");
    if (!locale || !routing.locales.includes(locale as any)) {
        return "";
    }

    return segment ?? "";
};

export function authMiddleware(req: NextRequest) {
    const token = req.cookies.get("access");
    const { pathname } = req.nextUrl;
    const locale = req.cookies.get('NEXT_LOCALE')?.value ?? 'kz';
    const routeSegment = getRouteSegment(pathname);

    if (privateRoutes.has(routeSegment) && !token) {
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
    }

    if (publicRoutes.has(routeSegment) && token) {
        return NextResponse.redirect(new URL(`/${locale}`, req.url))
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
