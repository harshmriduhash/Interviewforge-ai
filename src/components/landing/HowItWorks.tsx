"use client";

import { motion } from "framer-motion";

const STEPS = [
    {
        number: "01",
        title: "Choose your target",
        description: "Select company (Google, Meta, Stripe etc), role (SWE L4, Staff Eng, etc), round type (LC, System Design, Behavioral).",
        sub: "Our RAG engine pulls real questions from that company's actual interview patterns.",
    },
    {
        number: "02",
        title: "Speak. The AI listens, adapts, pushes back",
        description: "Deepgram transcribes you in real time. Claude AI evaluates your answer while ElevenLabs speaks the next question back.",
        sub: "It interrupts if your structure is off. It asks follow-ups. It acts like a real interviewer.",
    },
    {
        number: "03",
        title: "Get your report card. Track your arc.",
        description: "Post-session report: 7-dimension score breakdown, filler word map, areas to re-study, model answer comparison.",
        sub: "Your readiness score improves with every session. We remember every weakness.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-surface/30">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                        Three Steps. Infinite Practice. One Offer.
                    </h2>
                </div>

                <div className="relative space-y-24">
                    {/* Vertical Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

                    {STEPS.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className={`relative flex items-start md:items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Number Circle */}
                            <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black shrink-0 border-4 border-background md:absolute md:left-1/2 md:-translate-x-1/2">
                                {step.number}
                            </div>

                            {/* Content Card */}
                            <div className={`flex-1 glass p-8 rounded-2xl md:w-[45%] ${index % 2 === 0 ? "md:text-right" : "md:text-left"
                                }`}>
                                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-text-primary mb-4">{step.description}</p>
                                <p className="text-text-secondary text-sm italic">{step.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
