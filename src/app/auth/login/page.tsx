"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Link from "next/link";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginValues) => {
        console.log("Login data:", data);
    };

    return (
        <AuthLayout
            title="Login"
            subtitle="Welcome back. Ready for your next session?"
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-colors text-white font-bold text-sm">
                        Google
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-colors text-white font-bold text-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                        GitHub
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#0D0D0D] px-2 text-text-muted font-bold tracking-widest">or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-text-secondary">Email Address</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="you@gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                        {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[14px] font-bold text-text-secondary">Password</label>
                            <Link href="/auth/forgot-password" size="sm" className="text-xs text-primary font-bold hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                        {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Logging in..." : "Login →"}
                    </button>
                </form>

                <p className="text-center text-sm text-text-muted">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-primary font-bold hover:underline">
                        Get started for free
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
