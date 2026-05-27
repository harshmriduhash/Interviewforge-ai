"use client";

import { motion } from "framer-motion";
import { Play, Mic } from "lucide-react";
import Link from "next/link";

const ORANGE = "#FF5C00";
const BG = "#0A0A0A";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const DIM = "#525252";
const SUCCESS = "#22C55E";
const WARNING = "#F59E0B";

export function Hero() {
    return (
        <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", background: BG, padding: "0 24px" }}>
            {/* Background glow */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: `radial-gradient(ellipse, rgba(255,92,0,0.12) 0%, transparent 70%)`, borderRadius: "50%" }} />
                <div style={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, background: "rgba(255,92,0,0.05)", borderRadius: "50%", filter: "blur(80px)" }} />
            </div>

            <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", zIndex: 10, padding: "80px 0", position: "relative" }} className="lg:grid-cols-2 grid-cols-1">
                {/* Left Content */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    {/* Social Proof Badge */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: `1px solid ${BORDER}`, background: SURFACE, fontSize: 13, color: MUTED, width: "fit-content" }}>
                        <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
                            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: SUCCESS, opacity: 0.75, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                            <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: SUCCESS, display: "block" }} />
                        </span>
                        <span>Trusted by <strong style={{ color: TEXT }}>12,000+</strong> engineers at Google, Meta, Amazon</span>
                    </div>

                    <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, color: TEXT, lineHeight: 1.1, letterSpacing: "-2px", margin: 0 }}>
                        The AI That Interviews You Like{" "}
                        <em style={{ color: ORANGE, fontStyle: "italic" }}>Google</em> Does
                    </h1>

                    <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
                        Voice-first mock interviews that adapt to your skill level in real time. Get brutally honest feedback. Land the job.
                    </p>

                    <div style={{ display: "flex", flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                        <Link
                            href="/auth/signup"
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: ORANGE, color: "#fff", fontSize: 16, fontWeight: 700, borderRadius: 12, textDecoration: "none", boxShadow: "0 8px 32px rgba(255,92,0,0.3)", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#E64D00"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = ORANGE; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            Start for Free <span style={{ fontSize: 18 }}>→</span>
                        </Link>
                        <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", border: `1px solid ${BORDER}`, color: TEXT, fontSize: 16, fontWeight: 600, borderRadius: 12, background: "transparent", cursor: "pointer", transition: "border-color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = ORANGE)}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}>
                            <Play style={{ width: 18, height: 18, fill: TEXT }} />
                            Watch 90s Demo
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: 16, fontSize: 13, color: DIM }}>
                        <span>✓ 3 sessions free</span>
                        <span>·</span>
                        <span>✓ No card required</span>
                        <span>·</span>
                        <span>✓ Cancel anytime</span>
                    </div>

                    {/* Logo Strip */}
                    <div style={{ paddingTop: 32, borderTop: `1px solid ${BORDER}` }}>
                        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: DIM, fontWeight: 700, marginBottom: 16 }}>Engineers from these companies prepared here</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, opacity: 0.4, filter: "grayscale(1) contrast(1.2)" }}>
                            {['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Stripe'].map(c => (
                                <span key={c} style={{ color: TEXT, fontWeight: 900, fontSize: 20, fontStyle: "italic" }}>{c}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Content — Live Demo Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ position: "relative" }}>
                    <div style={{ background: "rgba(20,20,20,0.8)", backdropFilter: "blur(20px)", border: `1px solid ${BORDER}`, borderRadius: 24, padding: 32, boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,92,0,0.08)", position: "relative", overflow: "hidden" }}>
                        {/* Session Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: 0 }}>Google L4</h3>
                                <p style={{ fontSize: 14, color: ORANGE, margin: "4px 0 0", fontWeight: 600 }}>System Design Round</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 11, fontWeight: 700, color: "#EF4444" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "pulse 1.5s infinite" }} />
                                LIVE
                            </div>
                        </div>

                        {/* AI Avatar & Waveform */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 32 }}>
                            <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px rgba(255,92,0,0.4)` }}>
                                <Mic style={{ width: 36, height: 36, color: "#fff" }} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, height: 48 }}>
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: ["8px", `${20 + Math.random() * 30}px`, "8px"] }}
                                        transition={{ repeat: Infinity, duration: 0.8 + Math.random() * 0.8, ease: "easeInOut", delay: i * 0.05 }}
                                        style={{ width: 4, background: ORANGE, borderRadius: 2 }}
                                    />
                                ))}
                            </div>
                            <p style={{ fontSize: 12, color: DIM, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>AI Interviewer Speaking</p>
                        </div>

                        {/* Question */}
                        <div style={{ padding: 20, background: "#0A0A0A", borderRadius: 12, border: `1px solid ${BORDER}`, marginBottom: 24 }}>
                            <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.7, margin: 0 }}>
                                "For a globally distributed news feed, why would you choose <strong style={{ color: ORANGE }}>eventual consistency</strong> over strong consistency?"
                            </p>
                        </div>

                        {/* Score Mini Preview */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                            {[
                                { label: "Technical", val: 82, color: SUCCESS },
                                { label: "Comm.", val: 74, color: WARNING },
                                { label: "Structure", val: 90, color: SUCCESS }
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: "center" }}>
                                    <div style={{ position: "relative", width: 52, height: 52, margin: "0 auto" }}>
                                        <svg width="52" height="52" viewBox="0 0 52 52">
                                            <circle cx="26" cy="26" r="22" fill="none" stroke={BORDER} strokeWidth="4" />
                                            <circle cx="26" cy="26" r="22" fill="none" stroke={s.color} strokeWidth="4" strokeDasharray={`${2 * Math.PI * 22}`} strokeDashoffset={2 * Math.PI * 22 * (1 - s.val / 100)} strokeLinecap="round" transform="rotate(-90 26 26)" />
                                        </svg>
                                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: TEXT }}>{s.val}%</span>
                                    </div>
                                    <p style={{ fontSize: 10, color: DIM, marginTop: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Glow blobs */}
                    <div style={{ position: "absolute", top: -48, right: -48, width: 256, height: 256, background: "rgba(255,92,0,0.15)", borderRadius: "50%", filter: "blur(80px)", zIndex: -1, animation: "pulse 4s infinite" }} />
                    <div style={{ position: "absolute", bottom: -48, left: -48, width: 256, height: 256, background: "rgba(255,92,0,0.08)", borderRadius: "50%", filter: "blur(80px)", zIndex: -1 }} />
                </motion.div>
            </div>

            {/* Keyframe animations */}
            <style>{`
        @keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>
        </section>
    );
}
