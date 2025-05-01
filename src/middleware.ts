import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, siteUrls } from "@/config/urls";
import { getAbsoluteUrl } from "@/lib/utils";
import { env } from "@/env";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 🔐 Captura IP e User-Agent durante o callback de login
    if (pathname.startsWith("/api/auth/callback")) {

        
        const ip =
            request.ip ??
            request.headers.get("x-forwarded-for") ??
            "ip_not_found";
        const userAgent = request.headers.get("user-agent") ?? "ua_not_found";


        const response = NextResponse.next();
        response.cookies.set("client-ip", ip, {
            httpOnly: false, // precisa ser false para ser lido por headers().get("cookie")
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 300, // 5 minutos
        });

        response.cookies.set("client-ua", userAgent, {
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 300,
        });

        return response;
    }

    const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

    /** check if application setting is on or off */
    const maintenanceMode = env.NEXT_PUBLIC_MAINTENANCE_MODE === "on";
    const waitlistMode = env.NEXT_PUBLIC_WAITLIST_MODE === "on";

    if (
        maintenanceMode &&
        !request.nextUrl.pathname.startsWith("/maintenance") &&
        !isAdminPath &&
        !request.nextUrl.pathname.startsWith("/auth")
    ) {
        return NextResponse.redirect(getAbsoluteUrl(siteUrls.maintenance));
    }

    if (
        waitlistMode &&
        !request.nextUrl.pathname.startsWith("/waitlist") &&
        !isAdminPath &&
        !request.nextUrl.pathname.startsWith("/auth")
    ) {
        return NextResponse.redirect(getAbsoluteUrl(siteUrls.waitlist));
    }

    /** if path is public route than do nothing */
    if (protectedRoutes.includes(request.nextUrl.pathname)) {
        const session = await getToken({ req: request });

        /** if path name starts from /auth, and session is there redirect to dashboard */
        if (session && request.nextUrl.pathname.startsWith("/auth")) {
            return NextResponse.redirect(
                getAbsoluteUrl(siteUrls.dashboard.home),
            );
        }

        /** if path name does not start from /auth, and session is not there redirect to login */
        if (!session && !request.nextUrl.pathname.startsWith("/auth")) {
            return NextResponse.redirect(getAbsoluteUrl(siteUrls.auth.login));
        }

        /** if path name start from admin, and session role is not admin or super admin redirect to dashboard */
        const isAdmin =
            session?.role === "Admin" || session?.role === "Super Admin";

        if (
            session &&
            request.nextUrl.pathname.startsWith("/admin") &&
            !isAdmin
        ) {
            return NextResponse.redirect(
                getAbsoluteUrl(siteUrls.dashboard.home),
            );
        }
    } else {
        return NextResponse.next();
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/((?!api|assets|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
        "/api/auth/callback/email", // 👈 incluir explicitamente
    ],
    runtime: "nodejs",
};
