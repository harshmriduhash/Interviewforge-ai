"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, Building, History, Layout, Mic } from "lucide-react";

const ORANGE = "#FF5C00";
const BG = "#0A0A0A";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";

const FEATURES = [
    { title: "Voice AI Interviewer", description: "Real-time voice AI that asks, listens, and adapts — exactly like a human interviewer, without the scheduling headache.", icon: Mic },
    { title: "Company-Specific Prep", description: "10,000+ questions curated by company, role and round. Google SD vs Stripe behavioral — all different, all accurate.", icon: Building },
    { title: "7-Dimension Scoring", description: "Technical accuracy, communication, structure, depth, confidence, filler words, and speed — all tracked every session.", icon: BarChart3 },
    { title: "Adaptive Difficulty", description: "Nail three in a row and difficulty auto-escalates. The AI calibrates to your exact skill edge in real time.", icon: Brain },
    { title: "Progress Memory", description: "Every session stored. Every weakness flagged. The AI retests you on what you got wrong 3 sessions ago.", icon: History },
    { title: "System Design Mode", description: "Describe systems out loud. The AI plays architect, asks about scale, latency, and consistency tradeoffs.", icon: Layout },
];

export function Features() {
    return (
        <section id="features" style={{ padding: "100px 24px", background: BG }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>FEATURES</p>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: TEXT, letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 16px" }}>
                        Built for the Job You Actually Want
                    </h2>
                    <p style={{ fontSize: 18, color: MUTED, maxWidth: 480, margin: "0 auto" }}>
                        Not a quiz app. Not flashcards. A real interviewer that makes you sweat.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -6, borderColor: ORANGE }}
                            style={{
                                padding: 32,
                                borderRadius: 20,
                                background: SURFACE,
                                border: `1px solid ${BORDER}`,
                                transition: "all 0.3s",
                                cursor: "default"
                            }}
                        >
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: `rgba(255,92,0,0.12)`, border: `1px solid rgba(255,92,0,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                                <feature.icon style={{ width: 24, height: 24, color: ORANGE }} />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 12 }}>{feature.title}</h3>
                            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
