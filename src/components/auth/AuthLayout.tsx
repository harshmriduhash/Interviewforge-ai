"use client";

import { motion } from "framer-motion";
import { Mic, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const ORANGE = "#FF5C00";
const BG = "#0A0A0A";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const SUCCESS = "#22C55E";

const HIGHLIGHTS = [
    "Voice-first adaptive interviews",
    "FAANG-level technical scoring",
    "7-dimension feedback reports",
    "Company-specific question banks",
];

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", background: BG }}>
            {/* Left Panel */}
            <div style={{ display: "none", width: "45%", background: "#0D0D0D", borderRight: `1px solid ${BORDER}`, padding: 48, flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }} className="hidden lg:flex lg:flex-col">
                <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", opacity: 0.15, pointerEvents: "none" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: `radial-gradient(circle at top right, ${ORANGE}, transparent)`, borderRadius: "50%" }} />
                </div>

                <div style={{ position: "relative", zIndex: 10 }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 80, textDecoration: "none" }}>
                        <Mic style={{ color: ORANGE, width: 32, height: 32 }} />
                        <span style={{ fontSize: 22, fontWeight: 800, color: TEXT, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.5px" }}>InterviewForge</span>
                        <span style={{ background: ORANGE, padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 900, color: "#fff" }}>AI</span>
                    </Link>

                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: 40, fontWeight: 900, color: TEXT, lineHeight: 1.2, letterSpacing: "-1.5px" }}>
                            Practice Until You <br /><em style={{ color: ORANGE }}>Can't Fail.</em>
                        </motion.h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {HIGHLIGHTS.map((item, i) => (
                                <motion.div key={item} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <CheckCircle2 style={{ width: 20, height: 20, color: SUCCESS, flexShrink: 0 }} />
                                    <span style={{ fontSize: 16, color: MUTED }}>{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ position: "relative", zIndex: 10, paddingTop: 40, borderTop: `1px solid ${BORDER}` }}>
                    <p style={{ fontSize: 14, color: MUTED, fontStyle: "italic", lineHeight: 1.7 }}>
                        "The AI pushed back on my edge cases just like my Google interviewer did. I was ready."
                    </p>
                    <p style={{ fontSize: 14, color: TEXT, fontWeight: 700, marginTop: 8 }}>— Alex W., Senior Engineer @ Google</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 32, background: "rgba(20,20,20,0.3)" }}>
                <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Mic style={{ color: ORANGE, width: 24, height: 24 }} />
                        <span style={{ fontSize: 18, fontWeight: 800, color: TEXT, fontStyle: "italic", textTransform: "uppercase" }}>InterviewForge</span>
                        <span style={{ background: ORANGE, padding: "1px 5px", borderRadius: 4, fontSize: 10, fontWeight: 900, color: "#fff" }}>AI</span>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 900, color: TEXT, margin: "0 0 8px", letterSpacing: "-1px" }}>{title}</h1>
                        <p style={{ fontSize: 16, color: MUTED, margin: 0 }}>{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
