"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
    {
        name: "Rahul M.",
        role: "L5 @ Google",
        content: "InterviewForge was the only practice tool where I felt real pressure. Got a Google L5 offer 6 weeks in.",
    },
    {
        name: "Sarah K.",
        role: "SWE @ Stripe",
        content: "The filler word tracker alone changed how I communicate. I went from 'uhh' every 8 seconds to clean delivery.",
    },
    {
        name: "Devraj P.",
        role: "Staff @ Amazon",
        content: "System design mode is wild. The AI asked about CAP theorem and then pushed back on my consistency model. I was sweating.",
    },
    {
        name: "Mei L.",
        role: "Bootcamp grad → Meta",
        content: "3 months out of bootcamp. No CS degree. Got Meta APM offer. Wouldn't have been possible without the behavioral coaching.",
    },
    {
        name: "Omar H.",
        role: "Career switcher → Stripe",
        content: "I was in finance. Used InterviewForge for 45 days. Got 3 FAANG calls, 1 offer. ROI on $29.99 is insane.",
    },
    {
        name: "Platform Rating",
        role: "2,300+ Reviews",
        content: "4.9/5 Average Rating across G2, ProductHunt, and LinkedIn.",
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-surface/10">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16">
                    From Stuck to Hired
                </h2>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="break-inside-avoid relative glass p-8 rounded-2xl border border-border group hover:border-primary/50 transition-all"
                        >
                            <p className="text-text-primary text-[15px] leading-relaxed mb-6 italic">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-tight">{t.name}</h4>
                                    <p className="text-text-muted text-[12px]">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
