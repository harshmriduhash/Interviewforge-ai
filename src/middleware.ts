import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    // Content Security Policy
    const csp = [
        `default-src 'self'`,
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://us.i.posthog.com`,
        `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
        `img-src 'self' data: blob: https:`,
        `font-src 'self' https://fonts.gstatic.com`,
        `connect-src 'self' https://us.i.posthog.com https://*.sentry.io wss://localhost:3003 ws://localhost:3003 https://generativelanguage.googleapis.com`,
        `frame-ancestors 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `object-src 'none'`,
    ].join("; ");

    // Security headers
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Permissions-Policy",
        "camera=(), geolocation=(), microphone=(self)"
    );
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
    );

    // Set nonce for scripts
    response.headers.set("x-nonce", nonce);

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes that handle their own security
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        {
            source: "/((?!_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
