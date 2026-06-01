"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, ShieldAlert, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ERROR = "#EF4444";

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [scheduledAt, setScheduledAt] = useState<string | null>(null);

    const handleDeleteRequest = async () => {
        if (!password) {
            toast.error("Please enter your password to confirm");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/account/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok) {
                setScheduledAt(new Date(data.scheduledAt).toLocaleString());
                setStep(2);
            } else {
                toast.error(data.error || "Failed to schedule deletion");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md glass-heavy rounded-[32px] overflow-hidden border border-error/20 shadow-2xl shadow-error/5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-error/15 rounded-2xl flex items-center justify-center">
                                        <ShieldAlert className="w-6 h-6 text-error" />
                                    </div>
                                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-text-secondary" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Nuclear Option</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        Deleting your account will permanently purge all session history, voice transcripts, and readiness analytics. This is <span className="text-error font-bold italic underline">irreversible</span>.
                                    </p>
                                </div>

                                <div className="p-4 bg-error/5 border border-error/20 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-error" />
                                        <span className="text-xs font-black text-error uppercase tracking-widest">Cooling-off Policy</span>
                                    </div>
                                    <p className="text-[11px] text-text-muted leading-relaxed uppercase font-bold">
                                        Requests take 12 hours to process. You will receive an email confirmation with a link to cancel the request if you change your mind.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-1.5">
                                            <Lock className="w-3 h-3" /> Confirm with Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full px-5 py-4 bg-[#0A0A0A] border border-border rounded-2xl text-white outline-none focus:border-error transition-all text-sm font-bold placeholder:text-text-muted"
                                        />
                                    </div>

                                    <button
                                        disabled={loading || !password}
                                        onClick={handleDeleteRequest}
                                        className="w-full py-4 bg-error hover:bg-red-600 disabled:bg-error/30 disabled:text-white/30 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-error/20 uppercase italic tracking-wider"
                                    >
                                        {loading ? "Verifying..." : "Initialize Deletion Request"}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8 py-4 text-center"
                            >
                                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-success/5 animate-pulse">
                                    <CheckCircle2 className="w-10 h-10 text-success" />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-white italic uppercase">Request Received</h3>
                                    <p className="text-text-secondary text-sm px-4">
                                        Your account is scheduled for permanent deletion at:
                                        <br />
                                        <span className="text-white font-bold mt-2 inline-block">{scheduledAt}</span>
                                    </p>
                                </div>

                                <div className="p-4 bg-surface border border-border rounded-2xl text-xs text-text-muted">
                                    We've sent a confirmation email. You can cancel this request anytime within the next 12 hours.
                                </div>

                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-border rounded-2xl text-white font-bold uppercase tracking-widest text-xs transition-all"
                                >
                                    Log Out Immediately
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
