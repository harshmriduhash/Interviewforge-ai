"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html>
            <body
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0A0A0A",
                    color: "#F5F5F5",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <div style={{ textAlign: "center", maxWidth: 480, padding: 32 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            fontSize: 28,
                        }}
                    >
                        ⚠️
                    </div>
                    <h2
                        style={{
                            fontSize: 24,
                            fontWeight: 900,
                            marginBottom: 12,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Something went wrong
                    </h2>
                    <p
                        style={{
                            color: "#A3A3A3",
                            fontSize: 14,
                            lineHeight: 1.6,
                            marginBottom: 24,
                        }}
                    >
                        An unexpected error occurred. Our team has been notified and is
                        working on a fix.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: "12px 28px",
                            background: "#FF5C00",
                            color: "#fff",
                            fontWeight: 700,
                            borderRadius: 12,
                            border: "none",
                            cursor: "pointer",
                            fontSize: 14,
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
