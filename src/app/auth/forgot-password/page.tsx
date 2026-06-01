"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle } from "lucide-react";

const ORANGE = "#FF5C00";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const ERROR_COLOR = "#EF4444";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: `1px solid ${BORDER}`,
    background: SURFACE,
    color: TEXT,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
};

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormValues) => {
        setError(null);
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
        });
        if (res.ok) {
            setSubmitted(true);
        } else {
            const json = await res.json();
            setError(json.error || "Something went wrong. Please try again.");
        }
    };

    return (
        <AuthLayout title="Reset your password" subtitle="We'll send a secure link to your email.">
            {submitted ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "24px 0", textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, background: "rgba(34,197,94,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle size={32} color="#22C55E" />
                    </div>
                    <div>
                        <h3 style={{ color: TEXT, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Check your inbox</h3>
                        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>
                            If that email is registered, you'll receive a password reset link within a few minutes. Check your spam folder if you don't see it.
                        </p>
                    </div>
                    <Link
                        href="/auth/login"
                        style={{ color: ORANGE, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
                    >
                        ← Back to Sign In
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {error && (
                        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: ERROR_COLOR, fontSize: 14 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 8, display: "block" }}>
                                Email Address
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="you@gmail.com"
                                style={inputStyle}
                                onFocus={(e) => (e.currentTarget.style.borderColor = ORANGE)}
                                onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
                            />
                            {errors.email && (
                                <p style={{ color: ERROR_COLOR, fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            disabled={isSubmitting}
                            style={{
                                width: "100%", padding: "16px", borderRadius: 12,
                                background: ORANGE, color: "#fff", fontWeight: 700, fontSize: 16,
                                border: "none", cursor: isSubmitting ? "not-allowed" : "pointer",
                                opacity: isSubmitting ? 0.6 : 1,
                                boxShadow: "0 4px 20px rgba(255,92,0,0.3)",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#E64D00"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = ORANGE; }}
                        >
                            {isSubmitting ? "Sending..." : "Send Reset Link →"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", fontSize: 14, color: MUTED }}>
                        Remember your password?{" "}
                        <Link href="/auth/login" style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            )}
        </AuthLayout>
    );
}
