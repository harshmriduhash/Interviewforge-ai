"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Github } from "lucide-react";
import Link from "next/link";

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
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle="Start your journey to a FAANG offer today."
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
            </div>
        </AuthLayout>
    );
}
