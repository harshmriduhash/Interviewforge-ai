import { cacheGet, cacheSet, cacheIncr, cacheTtl } from "./redis";
import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
    /** Max requests per window */
    limit: number;
    /** Window duration in seconds */
    windowSeconds: number;
    /** Key prefix */
    prefix: string;
}

/**
 * Sliding window rate limiter using Redis (or in-memory fallback).
 * Returns { allowed, remaining, resetIn } or a 429 response.
 */
export async function rateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const key = `${config.prefix}:${identifier}`;
    const count = await cacheIncr(key);

    // Set TTL on first request in window
    if (count === 1) {
        await cacheSet(key, "1", config.windowSeconds);
    }

    const ttl = await cacheTtl(key);
    const remaining = Math.max(0, config.limit - count);

    return {
        allowed: count <= config.limit,
        remaining,
        resetIn: ttl > 0 ? ttl : config.windowSeconds,
    };
}

/**
 * Quick middleware helper that returns a 429 response if rate limited.
 */
export async function checkRateLimit(
    req: NextRequest,
    config: RateLimitConfig
): Promise<NextResponse | null> {
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

    const result = await rateLimit(ip, config);

    if (!result.allowed) {
        return NextResponse.json(
            {
                error: "Too many requests. Please try again later.",
                retryAfter: result.resetIn,
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(result.resetIn),
                    "X-RateLimit-Limit": String(config.limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(result.resetIn),
                },
            }
        );
    }

    return null;
}

/**
 * Account lockout check for login attempts.
 * Returns true if account is locked.
 */
export async function checkAccountLockout(email: string): Promise<boolean> {
    const key = `login_lockout:${email}`;
    const locked = await cacheGet(key);
    return locked === "locked";
}

/**
 * Record a failed login attempt. Locks account after 5 failures for 15 minutes.
 */
export async function recordFailedLogin(email: string): Promise<{ locked: boolean; attempts: number }> {
    const key = `login_attempts:${email}`;
    const lockKey = `login_lockout:${email}`;

    const attempts = await cacheIncr(key);

    if (attempts === 1) {
        await cacheSet(key, "1", 900); // 15 min window
    }

    if (attempts >= 5) {
        await cacheSet(lockKey, "locked", 900); // Lock for 15 minutes
        return { locked: true, attempts };
    }

    return { locked: false, attempts };
}

/**
 * Clear failed login attempts after successful login
 */
export async function clearFailedLogins(email: string): Promise<void> {
    await cacheSet(`login_attempts:${email}`, "0", 1);
    await cacheSet(`login_lockout:${email}`, "", 1);
}
