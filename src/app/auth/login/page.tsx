"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Github } from "lucide-react";
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
        // Auth process logic will go here
    };

    return (
        <AuthLayout
            title="Login"
            subtitle="Welcome back. Ready for your next session?"
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-colors text-white font-bold">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Google
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-colors text-white font-bold">
                        <Github className="w-5 h-5" />
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
