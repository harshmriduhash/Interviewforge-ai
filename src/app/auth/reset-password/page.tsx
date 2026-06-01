"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

const ORANGE = "#FF5C00";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const ERROR_COLOR = "#EF4444";

const schema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [token]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormValues) => {
        setError(null);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword: data.password }),
        });
        const json = await res.json();
        if (res.ok) {
            setDone(true);
            setTimeout(() => router.push("/auth/login"), 3000);
        } else {
            setError(json.error || "Something went wrong.");
        }
    };

    return (
        <AuthLayout title="Create new password" subtitle="Choose a strong password for your account.">
            {done ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "24px 0", textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, background: "rgba(34,197,94,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle size={32} color="#22C55E" />
                    </div>
                    <div>
                        <h3 style={{ color: TEXT, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Password updated!</h3>
                        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>
                            Your password has been reset successfully. Redirecting you to sign in...
                        </p>
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {error && (
                        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: ERROR_COLOR, fontSize: 14 }}>
                            {error}{" "}
                            {error.includes("expired") || error.includes("Invalid") ? (
                                <Link href="/auth/forgot-password" style={{ color: ORANGE, fontWeight: 700 }}>
                                    Request a new one →
                                </Link>
                            ) : null}
                        </div>
                    )}

                    {!error?.includes("Invalid reset link") && (
                        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 8, display: "block" }}>
                                    New Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        {...register("password")}
                                        type={showPass ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        style={{ ...inputStyle, paddingRight: 48 }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = ORANGE)}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTED }}
                                    >
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p style={{ color: ERROR_COLOR, fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>
                                )}
                                <p style={{ color: MUTED, fontSize: 11, marginTop: 6 }}>
                                    8+ chars · 1 uppercase · 1 number
                                </p>
                            </div>

                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 8, display: "block" }}>
                                    Confirm Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        {...register("confirmPassword")}
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        style={{ ...inputStyle, paddingRight: 48 }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = ORANGE)}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTED }}
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p style={{ color: ERROR_COLOR, fontSize: 12, marginTop: 4 }}>{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                disabled={isSubmitting || !token}
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
                                {isSubmitting ? "Updating..." : "Reset Password →"}
                            </button>
                        </form>
                    )}

                    <p style={{ textAlign: "center", fontSize: 14, color: MUTED }}>
                        <Link href="/auth/login" style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>
                            ← Back to Sign In
                        </Link>
                    </p>
                </div>
            )}
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0D0D0D" }} />}>
            <ResetPasswordContent />
        </Suspense>
    );
}
