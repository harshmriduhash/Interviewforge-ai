"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
    {
        q: "Is this better than practicing with a friend?",
        a: "It depends. Your friend won't push back as hard, won't know FAANG-specific patterns, and can't give you a 7-dimension score. InterviewForge does all three, 24/7.",
    },
    {
        q: "Does the AI actually understand system design answers?",
        a: "Yes. The AI evaluates your answer against a rubric that covers scalability approach, bottleneck identification, data model, API design, trade-off articulation, and communication structure.",
    },
    {
        q: "What if I'm a junior engineer?",
        a: "The adaptive difficulty system starts at your level. You can begin with LC Easy questions and build up. There's no minimum experience required.",
    },
    {
        q: "Is there a limit on session length?",
        a: "Pro sessions can run up to 90 minutes. Free sessions cap at 30 minutes.",
    },
    {
        q: "Does the AI remember previous sessions?",
        a: "Pro tier — yes. Every session is RAG-indexed so the AI knows what you've covered, what you've struggled with, and what to push next.",
    },
    {
        q: "Can I prep for behavioral interviews too?",
        a: "Yes. STAR-format evaluation, tone analysis, story structure scoring — full behavioral round support.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-background">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-16">
                    Questions Engineers Actually Ask
                </h2>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="border-b border-border">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full py-6 flex items-center justify-between text-left group"
                            >
                                <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                    {faq.q}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${openIndex === i ? "rotate-180 text-primary" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-6 text-text-secondary leading-relaxed">
                                            {faq.a}
                                        </p>
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
