"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ORANGE = "#FF5C00";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const ERROR_COLOR = "#EF4444";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

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

const labelStyle = { fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 8, display: "block" };

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setAuthError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError(result.error === "CredentialsSignin"
        ? "Invalid email or password"
        : result.error
      );
      return;
    }

    router.push("/dashboard");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your interview prep.">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Social Auth */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = ORANGE)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = ORANGE)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            GitHub
          </button>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: BORDER }} />
        </div>

        {authError && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: ERROR_COLOR, fontSize: 14 }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input {...register("email")} type="email" placeholder="you@gmail.com" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = ORANGE)}
              onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)} />
            {errors.email && <p style={{ color: ERROR_COLOR, fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
              <Link href="/auth/forgot-password" style={{ fontSize: 12, color: ORANGE, textDecoration: "none", fontWeight: 600 }}>Forgot password?</Link>
            </div>
            <input {...register("password")} type="password" placeholder="Your password" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = ORANGE)}
              onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)} />
            {errors.password && <p style={{ color: ERROR_COLOR, fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
          </div>

          <button
            disabled={isSubmitting}
            style={{ width: "100%", padding: "16px", borderRadius: 12, background: ORANGE, color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.6 : 1, boxShadow: "0 4px 20px rgba(255,92,0,0.3)", transition: "background 0.2s" }}
            onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#E64D00"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ORANGE; }}
          >
            {isSubmitting ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: MUTED }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
