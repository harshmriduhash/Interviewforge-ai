"use client";

import { motion } from "framer-motion";

const ORANGE = "#FF5C00";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const DIM = "#525252";

const TESTIMONIALS = [
    { name: "Rahul M.", role: "L5 @ Google", content: "InterviewForge was the only practice tool where I felt real pressure. Got a Google L5 offer 6 weeks in." },
    { name: "Sarah K.", role: "SWE @ Stripe", content: "The filler word tracker alone changed how I communicate. I went from 'uhh' every 8 seconds to clean delivery." },
    { name: "Devraj P.", role: "Staff @ Amazon", content: "System design mode is wild. The AI asked about CAP theorem and pushed back on my consistency model. I was sweating." },
    { name: "Mei L.", role: "Bootcamp grad → Meta", content: "3 months out of bootcamp, no CS degree. Got Meta APM offer. Wouldn't have been possible without the behavioral coaching." },
    { name: "Omar H.", role: "Finance → Stripe", content: "I was in finance. Used InterviewForge for 45 days. Got 3 FAANG calls, 1 offer. ROI on $29.99 is insane." },
    { name: "⭐ 4.9/5 Rating", role: "2,300+ Reviews on G2 & ProductHunt", content: "Consistently rated the #1 AI interview prep tool by engineers across FAANG, fintech, and startups." },
];

export function Testimonials() {
    return (
        <section style={{ padding: "100px 24px", background: "#0D0D0D", borderTop: `1px solid ${BORDER}` }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: TEXT, letterSpacing: "-1.5px", margin: "0 0 16px" }}>
                        From Stuck to Hired
                    </h2>
                    <p style={{ fontSize: 18, color: MUTED }}>Real engineers. Real offers. Real results.</p>
                </div>

                <div style={{ columns: "320px 3", gap: 24 }}>
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08 }}
                            viewport={{ once: true }}
                            style={{ breakInside: "avoid", padding: 28, borderRadius: 20, background: SURFACE, border: `1px solid ${BORDER}`, marginBottom: 24, cursor: "default", transition: "border-color 0.3s", display: "inline-block", width: "100%", boxSizing: "border-box" }}
                            whileHover={{ borderColor: "rgba(255,92,0,0.4)" }}
                        >
                            <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
                                "{t.content}"
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `rgba(255,92,0,0.15)`, border: `1px solid rgba(255,92,0,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: ORANGE, fontSize: 16, flexShrink: 0 }}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{t.name}</h4>
                                    <p style={{ fontSize: 12, color: DIM, margin: "2px 0 0" }}>{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
