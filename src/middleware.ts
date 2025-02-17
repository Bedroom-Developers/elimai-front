import { routing } from "@/i18n/routing";
import { rIsAdmin } from "@/shared/api/auth";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

async function adminMiddleware(req: NextRequest) {
    const token = req.cookies.get("access");
    const { pathname } = req.nextUrl;
    if (!token) {
        return NextResponse.redirect(new URL(`/ru/login`, req.url))
    }
    const isAdmin = await rIsAdmin(token.value)
    if (!isAdmin && pathname == '/admin') {
        return NextResponse.redirect(new URL(`/ru/login`, req.url))
    }
    return NextResponse.next()
}
const publicRoutes = ['register', 'login']
const privateRoutes = ['profile']

function authMiddleware(req: NextRequest) {
    const token = req.cookies.get("access");
    const { pathname } = req.nextUrl;
    const locale = pathname.split("/")[1];
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

    const locale = pathname.split("/")[1];
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
