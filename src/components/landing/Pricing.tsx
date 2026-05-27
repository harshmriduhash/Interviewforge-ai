"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const PLANS = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for a quick practice before you dive in.",
        features: [
            "3 sessions / month",
            "Text-only mode",
            "Basic question bank",
            "No progress tracking",
            "Email support",
        ],
        cta: "Get Started Free",
        featured: false,
    },
    {
        name: "Pro",
        price: "$29.99",
        period: "/mo",
        description: "Everything you need to land your dream FAANG role.",
        features: [
            "Unlimited sessions",
            "Full voice AI (Deepgram+ElevenLabs)",
            "10,000+ questions all companies",
            "7-dimension scoring",
            "Progress memory + RAG",
            "System Design mode",
            "Behavioral + LC + SD rounds",
            "Priority support",
        ],
        cta: "Start Pro — Cancel Anytime",
        featured: true,
    },
    {
        name: "Teams",
        price: "$19.99",
        period: "/seat",
        description: "For bootcomps and engineering teams.",
        features: [
            "Everything in Pro",
            "Shared team leaderboard",
            "Manager visibility dashboard",
            "Bulk seat management",
            "Custom question uploads",
            "Dedicated Slack support",
        ],
        cta: "Contact Sales",
        featured: false,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        One Price. Unlimited Shots at Your Dream Role.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-3xl border ${plan.featured
                                    ? "bg-surface border-primary shadow-[0_0_40px_rgba(255,92,0,0.15)] relative scale-105"
                                    : "bg-surface/30 border-border"
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-black text-white">{plan.price}</span>
                                    {plan.period && <span className="text-text-muted">{plan.period}</span>}
                                </div>
                                <p className="text-text-secondary text-sm">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 shrink-0 ${plan.featured ? "text-primary" : "text-text-muted"}`} />
                                        <span className="text-text-primary text-[15px]">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={plan.name === "Teams" ? "/contact" : "/auth/signup"}
                                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center ${plan.featured
                                        ? "bg-primary text-white hover:bg-primary-hover shadow-[0_4px_20px_rgba(255,92,0,0.25)]"
                                        : "bg-surface-2 text-white hover:bg-surface-2/80"
                                    }`}
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
