"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { initPostHog, identifyUser, POSTHOG_KEY } from "@/lib/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    useEffect(() => {
        initPostHog();
    }, []);

    useEffect(() => {
        if (session?.user) {
            const user = session.user as any;
            identifyUser(user.id, {
                email: user.email,
                name: user.name,
                tier: user.tier,
            });
        }
    }, [session]);

    return <>{children}</>;
}
