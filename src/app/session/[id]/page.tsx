"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, PencilLine, PanelRightClose, MessageSquare, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SessionInterface() {
    const [isThinking, setIsThinking] = useState(false);
    const [transcript, setTranscript] = useState("Okay, let's dive into the data consistency model. For a globally distributed news feed, why would you choose eventual consistency over strong consistency?");
    const [userText, setUserText] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen bg-[#0D0D0D] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 px-6 border-b border-border flex items-center justify-between z-20 bg-background">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                        <span className="text-white font-bold tracking-tight">00:14:22</span>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex items-center gap-2 text-text-secondary">
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-black uppercase">Google L4</span>
                        <span className="text-[14px] font-bold">System Design Round</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-text-muted hover:text-white transition-colors text-sm font-bold flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface">
                        <PencilLine className="w-4 h-4" />
                        Scratchpad
                    </button>
                    <button className="px-4 py-2 bg-error text-white font-bold rounded-lg text-sm hover:bg-error/80 transition-all flex items-center gap-2">
                        <X className="w-4 h-4" />
                        End Session
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Interface Area */}
                <div className="flex-1 flex flex-col relative h-full">
                    {/* Center UI - AI Interviewer */}
                    <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-12">
                        <div className="relative group">
                            {/* Avatar Pulsing Ring */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute inset-0 bg-primary rounded-full blur-[40px] -z-10"
                            />
                            <div className="w-40 h-40 bg-surface border-4 border-primary/50 rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_0_60px_rgba(255,92,0,0.15)]">
                                <motion.div
                                    animate={isThinking ? { rotate: 360 } : {}}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute inset-0 border-t-2 border-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                                <Mic className="w-16 h-16 text-primary" />
                            </div>
                        </div>

                        <div className="max-w-2xl text-center space-y-6">
                            {/* AI Speech Transcript */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest mb-4">
                                    <MessageSquare className="w-3 h-3 text-primary" />
                                    AI Interviewer Speaking
                                </div>
                                <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed tracking-tight">
                                    {transcript}
                                </p>
                            </motion.div>

                            {/* Thinking State */}
                            {isThinking && (
                                <div className="flex items-center justify-center gap-2 pt-4">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                            className="w-2 h-2 bg-primary rounded-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Waveform / User Input Area */}
                    <div className="h-48 bg-gradient-to-t from-surface to-transparent border-t border-border/50 flex flex-col items-center justify-center px-12 z-10">
                        <div className="w-full max-w-4xl space-y-6">
                            {/* Audio Waveform Viz placeholder */}
                            <div className="h-12 flex items-center justify-center gap-1.5 opacity-50">
                                {[...Array(50)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, Math.random() * 24 + 8, 8] }}
                                        transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                                        className="w-1 bg-text-muted rounded-full"
                                    />
                                ))}
                            </div>
                            <div className="text-center italic text-text-secondary text-sm">
                                {userText || "AI is listening... begin speaking whenever you're ready"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Notes & Scores */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-[#0A0A0A] border-l border-border h-full flex flex-col relative"
                        >
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute left-0 top-1/2 -translate-x-full bg-border border border-border p-1 rounded-l-lg hover:text-primary transition-colors h-20 flex items-center z-50"
                            >
                                <PanelRightClose className="w-4 h-4 rotate-180" />
                            </button>

                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h3 className="text-white font-bold">Session Context</h3>
                                <div className="px-2 py-1 bg-surface-2 rounded text-[10px] font-black text-text-muted uppercase tracking-wider">L5 Profile</div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
                                        <Clock className="w-3 h-3" />
                                        Live Dimensions
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Technical Accuracy', val: 0, color: 'text-text-muted' },
                                            { label: 'Communication', val: 0, color: 'text-text-muted' },
                                            { label: 'Problem Structure', val: 0, color: 'text-text-muted' }
                                        ].map(d => (
                                            <div key={d.label} className="space-y-2">
                                                <div className="flex justify-between text-[11px] font-bold">
                                                    <span className={d.color}>{d.label}</span>
                                                    <span className="text-white">--%</span>
                                                </div>
                                                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                                    <motion.div className="h-full bg-primary" initial={{ width: 0 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-text-muted italic">Scores update after each response evaluation.</p>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
                                        <PencilLine className="w-3 h-3" />
                                        Notes & Thoughts
                                    </div>
                                    <textarea
                                        placeholder="Jot down notes while the AI speaks..."
                                        className="w-full h-48 bg-surface border border-border rounded-xl p-4 text-sm text-text-primary outline-none focus:border-primary transition-all resize-none"
                                    />
                                </section>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            {/* Thinking Layer - Visual Blockage on AI Evaluation */}
            <AnimatePresence>
                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="glass p-12 rounded-3xl flex flex-col items-center gap-6 shadow-2xl">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <div className="text-center">
                                <p className="text-white font-bold text-xl uppercase tracking-tighter">AI Evaluator Thinking</p>
                                <p className="text-text-secondary text-sm italic">Analyzing your technical accuracy & structure...</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
