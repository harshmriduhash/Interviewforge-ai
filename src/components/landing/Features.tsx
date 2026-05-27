"use client";

import { motion } from "framer-motion";
import { Mic, Building, BarChart3, Brain, 历史, Layout } from "lucide-react";

const FEATURES = [
    {
        title: "Voice AI Interviewer",
        description: "A real-time voice AI that asks, listens, adapts, and follows up — exactly like a human interviewer, without the scheduling.",
        icon: Mic,
    },
    {
        title: "Company-Specific Prep",
        description: "10,000+ questions curated by company, role, and round. Google SD vs Stripe behavioral vs Airbnb product — all different.",
        icon: Building,
    },
    {
        title: "7-Dimension Scoring",
        description: "Technical accuracy, communication clarity, structure, depth, confidence, filler words, and response time — all tracked.",
        icon: BarChart3,
    },
    {
        title: "Adaptive Difficulty",
        description: "Nail three in a row and difficulty auto-escalates. Struggle and it scaffolds. The AI calibrates to your edge.",
        icon: Brain,
    },
    {
        title: "Progress Memory",
        description: "Every session stored. Every weakness flagged. The AI retests you on what you got wrong 3 sessions ago.",
        icon: History,
    },
    {
        title: "System Design Mode",
        description: "Describe systems out loud. The AI plays architect, asks about scale, latency, consistency tradeoffs — the full experience.",
        icon: Layout,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Built for the Job You Actually Want
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-surface/50 border border-border hover:border-primary transition-all group"
                        >
                            <div className="mb-6">
                                <feature.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
