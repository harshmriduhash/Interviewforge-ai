"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const signupSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupValues) => {
        console.log("Signup data:", data);
        // API call logic will go here
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle="Start your journey to a FAANG offer today."
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
                        <label className="text-[14px] font-bold text-text-secondary">Full Name</label>
                        <input
                            {...register("fullName")}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                        {errors.fullName && <p className="text-error text-xs">{errors.fullName.message}</p>}
                    </div>

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
                        <label className="text-[14px] font-bold text-text-secondary">Password</label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Create a strong password"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                        {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-text-secondary">Confirm Password</label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="Repeat your password"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                        {errors.confirmPassword && <p className="text-error text-xs">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating account..." : "Create Free Account →"}
                    </button>
                </form>

                <p className="text-center text-sm text-text-muted">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary font-bold hover:underline">
                        Login
                    </Link>
                </p>

                <p className="text-[11px] text-text-muted leading-relaxed text-center px-4">
                    By signing up, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
            </div>
        </AuthLayout>
    );
}
