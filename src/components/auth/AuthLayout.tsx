"use client";

import { motion } from "framer-motion";
import { Mic, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const HIGHLIGHTS = [
    "Voice-first adaptive interviews",
    "FAANG-level technical scoring",
    "7-dimension feedback reports",
    "Company-specific question banks",
];

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Panel - Hero/Highlights */}
            <div className="hidden lg:flex w-[45%] bg-[#0D0D0D] border-r border-border p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,var(--color-primary),transparent)]" />
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 mb-20 group">
                        <Mic className="text-primary w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold text-white tracking-tighter italic">InterviewForge</span>
                        <span className="bg-primary px-1.5 py-0.5 rounded text-[12px] font-black text-white leading-none">AI</span>
                    </Link>

                    <div className="space-y-8">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-extrabold text-white leading-[1.2]"
                        >
                            Practice Until You <br /> <span className="text-primary italic">Can't Fail.</span>
                        </motion.h2>

                        <div className="space-y-4">
                            {HIGHLIGHTS.map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3 text-text-secondary"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                    <span className="text-lg">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-12 border-t border-border">
                    <p className="text-text-muted text-sm italic">
                        "The AI pushed back on my edge cases just like my Google interviewer did. I was ready."
                    </p>
                    <p className="text-white font-bold text-sm mt-2">
                        — Alex W., Senior Engineer @ Google
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-surface/20">
                <div className="w-full max-w-[440px] space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
                        <p className="text-text-secondary">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
