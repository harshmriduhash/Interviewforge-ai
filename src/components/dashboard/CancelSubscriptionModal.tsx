"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, BarChart3, TrendingUp, History, CheckCircle2, ChevronRight, Pause, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Stats {
    totalSessions: number;
    readinessScore: number;
    improvement: number;
}

interface CancelSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ORANGE = "#FF5C00";
const BG = "#0D0D0D";
const SURFACE = "#1A1A1A";
const BORDER = "#2E2E2E";

export function CancelSubscriptionModal({ isOpen, onClose, onConfirm }: CancelSubscriptionModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<Stats | null>(null);
    const [reason, setReason] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        if (isOpen && step === 1) {
            fetch("/api/subscriptions/stats")
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(() => toast.error("Failed to load your progress stats"));
        }
    }, [isOpen, step]);

    const handleCancel = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/subscriptions/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason, feedback }),
            });
            if (res.ok) {
                toast.success("Subscription cancelled. You will remain Pro until the end of this period.");
                onConfirm();
                onClose();
            } else {
                toast.error("Failed to cancel subscription");
            }
        } catch (err) {
            toast.error("An error occurred during cancellation");
        } finally {
            setLoading(false);
        }
    };

    const REASONS = [
        { id: "hired", label: "I got hired!" },
        { id: "expensive", label: "Too expensive" },
        { id: "useless", label: "Not useful for my role" },
        { id: "competitor", label: "Going with a competitor" },
        { id: "technical", label: "Technical issues" },
        { id: "other", label: "Other" },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg glass-heavy rounded-3xl overflow-hidden border border-border/50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-border/40 flex items-center justify-between">
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        Subscription <span className="text-primary truncate">Nexus</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">We're sorry to see you go.</h3>
                                    <p className="text-text-secondary">Before you leave, look at how much you've grown since you joined InterviewForge.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-2xl bg-surface border border-border/40 text-center">
                                        <History className="w-5 h-5 text-primary mx-auto mb-2" />
                                        <p className="text-xs font-bold text-text-muted uppercase">Sessions</p>
                                        <p className="text-xl font-black text-white">{stats?.totalSessions || "..."}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-surface border border-border/40 text-center">
                                        <TrendingUp className="w-5 h-5 text-success mx-auto mb-2" />
                                        <p className="text-xs font-bold text-text-muted uppercase">Growth</p>
                                        <p className="text-xl font-black text-white">+{stats?.improvement || 0}%</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-surface border border-border/40 text-center">
                                        <CheckCircle2 className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                                        <p className="text-xs font-bold text-text-muted uppercase">Readiness</p>
                                        <p className="text-xl font-black text-white">{stats?.readinessScore || 0}%</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                                    <p className="text-sm text-text-primary leading-relaxed">
                                        You'll lose access to your <span className="font-bold">longitudinal progress RAG memory</span> and <span className="font-bold">adaptive voice session history</span> at the end of this billing cycle.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-border rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    Continue to Cancel <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Tell us why.</h3>
                                    <p className="text-text-secondary">Your feedback helps us make the forge better for everyone.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {REASONS.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => setReason(r.id)}
                                            className={`p-4 rounded-2xl border text-left transition-all ${reason === r.id
                                                    ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/10"
                                                    : "bg-surface border-border text-text-secondary hover:border-text-muted"
                                                }`}
                                        >
                                            <p className="text-sm font-bold">{r.label}</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Anything else?</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Tell us what we could do better..."
                                        className="w-full p-4 bg-surface border border-border rounded-2xl text-white text-sm outline-none focus:border-primary transition-all h-24 resize-none"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 border border-border rounded-2xl text-text-secondary font-bold hover:bg-white/5 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={!reason}
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/40 disabled:text-white/40 rounded-2xl text-white font-bold transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2 text-center">
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Wait! Don't lose your progress.</h3>
                                    <p className="text-text-secondary">Keep your FAANG readiness edge with a special offer just for you.</p>
                                </div>

                                <div className="p-6 bg-surface border-2 border-primary/30 rounded-3xl relative overflow-hidden group hover:border-primary transition-all">
                                    <div className="absolute top-0 right-0 p-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">Exclusive Offer</div>
                                    <h4 className="text-white font-black text-xl mb-1">Stay for $14.99/mo</h4>
                                    <p className="text-text-secondary text-sm mb-4">For the next 3 months. Full Pro features, half the price.</p>
                                    <button className="w-full py-3 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-primary/20">
                                        Claim Offer & Keep Pro
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-surface border border-border space-y-3 rounded-2xl hover:border-text-muted transition-all cursor-pointer">
                                        <Pause className="w-5 h-5 text-text-secondary" />
                                        <div>
                                            <p className="text-white font-bold text-sm">Pause Membership</p>
                                            <p className="text-[10px] text-text-muted uppercase font-bold mt-0.5">30 Days · Free</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={handleCancel}
                                        className="p-5 bg-error/10 border border-error/30 space-y-3 rounded-2xl hover:bg-error/20 transition-all cursor-pointer group"
                                    >
                                        <X className="w-5 h-5 text-error" />
                                        <div>
                                            <p className="text-error font-bold text-sm">End Subscription</p>
                                            <p className="text-[10px] text-error/60 uppercase font-bold mt-0.5">Lose Pro Access</p>
                                        </div>
                                    </div>
                                </div>

                                {loading && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
