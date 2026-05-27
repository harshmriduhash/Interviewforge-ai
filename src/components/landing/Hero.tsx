"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-background px-4">
            {/* Background Effect placeholder - will use Aceternity logic later */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--color-primary),transparent)]" />
            </div>

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center z-10 py-20">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Social Proof Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-[13px] text-text-secondary">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                        </span>
                        Trusted by 12,000+ engineers at Google, Meta, Amazon
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                        The AI That Interviews You Like <span className="text-primary italic">Google</span> Does
                    </h1>

                    <p className="text-lg md:text-xl text-text-secondary max-w-xl">
                        Voice-first mock interviews that adapt to your skill level in real time. Get brutally honest feedback. Land the job.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            href="/auth/signup"
                            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(255,92,0,0.25)] hover:shadow-[0_8px_32px_rgba(255,92,0,0.35)] flex items-center justify-center gap-2"
                        >
                            Start for Free
                            <span className="text-xl">→</span>
                        </Link>
                        <button className="px-8 py-4 border border-border hover:border-primary text-white text-lg font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group">
                            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                            Watch 90s Demo
                        </button>
                    </div>

                    <div className="text-sm text-text-muted flex gap-4">
                        <span>3 sessions free</span>
                        <span>•</span>
                        <span>No card required</span>
                        <span>•</span>
                        <span>Cancel anytime</span>
                    </div>

                    {/* Logo Strip Placeholder */}
                    <div className="pt-8 border-t border-border/50">
                        <p className="text-[12px] uppercase tracking-widest text-text-muted font-bold mb-4">
                            Engineers from these companies prepared here
                        </p>
                        <div className="flex flex-wrap gap-8 grayscale opacity-50 contrast-125">
                            {['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Stripe'].map(c => (
                                <span key={c} className="text-white font-black text-xl italic">{c}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Content - Live Demo Card Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-white font-bold text-lg">Google L4</h3>
                                <p className="text-primary text-sm font-medium">System Design Round</p>
                            </div>
                            <div className="px-3 py-1 rounded bg-error/10 text-error text-[12px] font-bold border border-error/20 flex items-center gap-1.5 animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-error" />
                                Live session
                            </div>
                        </div>

                        {/* AI Waveform Anim Placeholder */}
                        <div className="h-32 flex items-center justify-center gap-1 mb-8">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [12, Math.random() * 40 + 20, 12] }}
                                    transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                                    className="w-1.5 bg-primary rounded-full"
                                />
                            ))}
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-text-secondary text-sm italic">AI is speaking...</p>
                            <div className="h-px bg-border w-full" />
                            <p className="text-white text-lg font-medium leading-relaxed">
                                "Okay, let's dive into the data consistency model. For a globally distributed news feed, why would you choose eventual consistency over strong consistency?"
                            </p>
                        </div>

                        {/* Score Rings Preview */}
                        <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                            {[
                                { label: 'Technical', val: '82%', color: 'var(--color-success)' },
                                { label: 'Comm.', val: '74%', color: 'var(--color-warning)' },
                                { label: 'Structure', val: '90%', color: 'var(--color-success)' }
                            ].map(s => (
                                <div key={s.label} className="text-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-border mx-auto flex items-center justify-center relative">
                                        <span className="text-[10px] font-bold text-white">{s.val}</span>
                                        <svg className="absolute inset-0 -rotate-90">
                                            <circle cx="24" cy="24" r="21" fill="none" stroke={s.color} strokeWidth="4" strokeDasharray="132" strokeDashoffset={132 - (132 * parseInt(s.val) / 100)} className="opacity-80" />
                                        </svg>
                                    </div>
                                    <p className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-wider">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Abstract blobs for depth */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 blur-[100px] -z-10 animate-pulse" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
