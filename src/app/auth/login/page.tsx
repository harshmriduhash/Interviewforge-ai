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
    };

    return (
        <AuthLayout
            title="Login"
            subtitle="Welcome back. Ready for your next session?"
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-colors text-white font-bold">
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
