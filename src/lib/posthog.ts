import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export function initPostHog() {
    if (typeof window === "undefined") return;
    if (initialized) return;
    if (!POSTHOG_KEY) {
        console.warn("PostHog key not configured — analytics disabled");
        return;
    }

    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        persistence: "localStorage+cookie",
    });

    initialized = true;
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
    if (!POSTHOG_KEY) return;
    posthog.identify(userId, properties);
}

export function trackEvent(event: string, properties?: Record<string, any>) {
    if (!POSTHOG_KEY) return;
    posthog.capture(event, properties);
}

export function resetUser() {
    if (!POSTHOG_KEY) return;
    posthog.reset();
}

export { posthog };
