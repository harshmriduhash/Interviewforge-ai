"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const ORANGE = "#FF5C00";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const DIM = "#525252";

const PLANS = [
    {
        name: "Free",
        price: "$0",
        period: "",
        description: "Perfect for a quick run before you dive in.",
        features: ["3 sessions / month", "Text-only mode", "Basic question bank", "Email support"],
        cta: "Get Started Free",
        href: "/auth/signup",
        featured: false,
    },
    {
        name: "Pro",
        price: "$29.99",
        period: "/mo",
        description: "Everything you need to land your dream FAANG role.",
        features: ["Unlimited sessions", "Full voice AI (Deepgram + ElevenLabs)", "10,000+ questions, all companies", "7-dimension real-time scoring", "Progress memory + RAG recall", "System Design mode", "Behavioral + LC + SD rounds", "Priority support"],
        cta: "Start Pro — Cancel Anytime",
        href: "/auth/signup",
        featured: true,
    },
    {
        name: "Teams",
        price: "$19.99",
        period: "/seat",
        description: "For bootcamps and engineering teams.",
        features: ["Everything in Pro", "Shared team leaderboard", "Manager visibility dashboard", "Bulk seat management", "Custom question uploads", "Dedicated Slack support"],
        cta: "Contact Sales",
        href: "/contact",
        featured: false,
    },
];

export function Pricing() {
    return (
        <section id="pricing" style={{ padding: "100px 24px", background: "#0A0A0A", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 500, height: 500, background: "rgba(255,92,0,0.05)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>PRICING</p>
                    <h2 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: TEXT, letterSpacing: "-1.5px", margin: "0 0 16px" }}>
                        One Price. Unlimited Shots at Your Dream Role.
                    </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                padding: 36,
                                borderRadius: 24,
                                background: plan.featured ? SURFACE : "rgba(20,20,20,0.5)",
                                border: `1px solid ${plan.featured ? ORANGE : BORDER}`,
                                boxShadow: plan.featured ? "0 0 60px rgba(255,92,0,0.15), 0 20px 60px rgba(0,0,0,0.4)" : "none",
                                position: "relative",
                                transform: plan.featured ? "scale(1.03)" : "scale(1)",
                            }}
                        >
                            {plan.featured && (
                                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: ORANGE, color: "#fff", padding: "4px 16px", borderRadius: 999, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
                                    Most Popular
                                </div>
                            )}

                            <div style={{ marginBottom: 28 }}>
                                <h3 style={{ fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 8 }}>{plan.name}</h3>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                                    <span style={{ fontSize: 44, fontWeight: 900, color: TEXT, letterSpacing: "-2px" }}>{plan.price}</span>
                                    {plan.period && <span style={{ color: DIM, fontSize: 16, fontWeight: 600 }}>{plan.period}</span>}
                                </div>
                                <p style={{ fontSize: 14, color: MUTED }}>{plan.description}</p>
                            </div>

                            <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                                {plan.features.map((feature) => (
                                    <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                        <Check style={{ width: 16, height: 16, color: plan.featured ? ORANGE : MUTED, marginTop: 2, flexShrink: 0 }} />
                                        <span style={{ fontSize: 14, color: TEXT }}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={plan.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: 12,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                    background: plan.featured ? ORANGE : "rgba(40,40,40,1)",
                                    color: "#fff",
                                    boxShadow: plan.featured ? "0 4px 20px rgba(255,92,0,0.3)" : "none",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = plan.featured ? "#E64D00" : "rgba(55,55,55,1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = plan.featured ? ORANGE : "rgba(40,40,40,1)"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
