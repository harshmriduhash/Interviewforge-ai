"use client";

import { motion } from "framer-motion";
import { XCircle, UserX, Compass } from "lucide-react";

const ORANGE = "#FF5C00";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const ERROR = "#EF4444";

const PAIN_POINTS = [
    { title: "No real-time feedback", description: "You finish a session and have no idea if your answer was good. Silence is the default. Silence doesn't get you hired.", icon: XCircle },
    { title: "Human mock interviews are broken", description: "Pramp matches are flaky. Peers grade generously. You need an interviewer that doesn't care about your feelings.", icon: UserX },
    { title: "Generic prep is wasted time", description: "LeetCode grinds without direction. You practice the wrong things for the wrong companies.", icon: Compass },
];

export function Problem() {
    return (
        <section style={{ padding: "100px 24px", background: "#0D0D0D" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: TEXT, letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 16px" }}>
                        Why Engineers Fail Interviews They're Smart Enough to Pass
                    </h2>
                    <p style={{ fontSize: 18, color: MUTED }}>It's not knowledge. It's practice quality.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                    {PAIN_POINTS.map((point, index) => (
                        <motion.div
                            key={point.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            style={{ padding: 32, borderRadius: 20, background: "rgba(20,20,20,0.8)", backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, transition: "border-color 0.3s" }}
                            whileHover={{ borderColor: "rgba(255,92,0,0.4)" }}
                        >
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                                <point.icon style={{ width: 24, height: 24, color: ERROR }} />
                            </div>
                            <h3 style={{ fontSize: 19, fontWeight: 800, color: TEXT, marginBottom: 12 }}>{point.title}</h3>
                            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>{point.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
