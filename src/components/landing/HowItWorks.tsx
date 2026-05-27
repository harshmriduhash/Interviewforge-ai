"use client";

import { motion } from "framer-motion";

const ORANGE = "#FF5C00";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const DIM = "#525252";

const STEPS = [
    {
        number: "01",
        title: "Choose your target",
        description: "Pick company (Google, Meta, Stripe), role (SWE L4, Staff), and round type (Algorithms, System Design, Behavioral).",
        sub: "Our RAG engine pulls real questions from that company's actual interview patterns.",
    },
    {
        number: "02",
        title: "Speak. The AI listens, adapts, pushes back",
        description: "Deepgram transcribes you in real time. Claude AI evaluates your answer while ElevenLabs speaks the follow-up.",
        sub: "It interrupts if your structure is off. It asks follow-ups. It acts like a real interviewer.",
    },
    {
        number: "03",
        title: "Get your report card. Track your arc.",
        description: "7-dimension score breakdown, filler word map, areas to re-study, and a model answer comparison.",
        sub: "Your readiness score improves with every session. We remember every weakness.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" style={{ padding: "100px 24px", background: "rgba(20,20,20,0.5)", borderTop: `1px solid ${BORDER}` }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>HOW IT WORKS</p>
                    <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: TEXT, letterSpacing: "-1.5px", margin: 0 }}>
                        Three Steps. Infinite Practice. One Offer.
                    </h2>
                </div>

                <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 48 }}>
                    {STEPS.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            style={{ display: "flex", gap: 32, alignItems: "flex-start", flexDirection: index % 2 === 0 ? "row" : "row-reverse" }}
                        >
                            {/* Number */}
                            <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18, boxShadow: `0 0 24px rgba(255,92,0,0.4)` }}>
                                {step.number}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, padding: 32, background: "rgba(20,20,20,0.7)", backdropFilter: "blur(16px)", border: `1px solid ${BORDER}`, borderRadius: 20 }}>
                                <h3 style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 12 }}>{step.title}</h3>
                                <p style={{ fontSize: 16, color: TEXT, marginBottom: 8, lineHeight: 1.7 }}>{step.description}</p>
                                <p style={{ fontSize: 14, color: MUTED, fontStyle: "italic", lineHeight: 1.6 }}>{step.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
