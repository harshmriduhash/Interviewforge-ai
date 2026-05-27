"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ORANGE = "#FF5C00";
const BG = "#0A0A0A";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";

const FAQS = [
    { q: "Is this better than practicing with a friend?", a: "Your friend won't push back as hard, won't know FAANG-specific patterns, and can't give you a 7-dimension score. InterviewForge does all three, 24/7." },
    { q: "Does the AI actually understand system design answers?", a: "Yes. The AI evaluates your answer across scalability approach, bottleneck ID, data model, API design, trade-off articulation, and communication structure." },
    { q: "What if I'm a junior engineer?", a: "The adaptive difficulty system starts at your level. Begin with LC Easy and build up. There's no minimum experience required." },
    { q: "Is there a limit on session length?", a: "Pro sessions can run up to 90 minutes. Free sessions cap at 30 minutes." },
    { q: "Does the AI remember previous sessions?", a: "Pro tier — yes. Every session is RAG-indexed so the AI knows what you've covered, what you've struggled with, and what to push next." },
    { q: "Can I prep for behavioral interviews too?", a: "Yes. STAR-format evaluation, tone analysis, story structure scoring — full behavioral round support with AI feedback." },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section style={{ padding: "100px 24px", background: BG }}>
            <div style={{ maxWidth: 780, margin: "0 auto" }}>
                <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: TEXT, letterSpacing: "-1.5px", textAlign: "center", marginBottom: 64 }}>
                    Questions Engineers Actually Ask
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {FAQS.map((faq, i) => (
                        <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                style={{ width: "100%", padding: "24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                            >
                                <span style={{ fontSize: 17, fontWeight: 700, color: openIndex === i ? ORANGE : TEXT, transition: "color 0.2s" }}>
                                    {faq.q}
                                </span>
                                <ChevronDown style={{ width: 20, height: 20, color: openIndex === i ? ORANGE : MUTED, transform: `rotate(${openIndex === i ? 180 : 0}deg)`, transition: "transform 0.3s", flexShrink: 0, marginLeft: 16 }} />
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <p style={{ paddingBottom: 24, fontSize: 15, color: MUTED, lineHeight: 1.8 }}>{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
