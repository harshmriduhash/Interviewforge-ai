"use client";

import { motion } from "framer-motion";
import { XCircle, UserX, Compass } from "lucide-react";

const PAIN_POINTS = [
    {
        title: "No real-time feedback",
        description: "You finish a session and have no idea if your answer was good. Silence is the default. Silence doesn't get you hired.",
        icon: XCircle,
    },
    {
        title: "Human mock interviews are broken",
        description: "Pramp matches are flaky. Peers grade generously. You need an interviewer that doesn't care about your feelings.",
        icon: UserX,
    },
    {
        title: "Generic prep is wasted time",
        description: "LeetCode grinds without direction. You practice the wrong things for the wrong companies.",
        icon: Compass,
    },
];

export function Problem() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                        Why Engineers Fail Interviews They're Smart Enough to Pass
                    </h2>
                    <p className="text-xl text-text-secondary">
                        It's not knowledge. It's practice quality.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {PAIN_POINTS.map((point, index) => (
                        <motion.div
                            key={point.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass p-8 rounded-2xl hover:border-primary/50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center mb-6 border border-error/20 group-hover:bg-error/20 transition-colors">
                                <point.icon className="text-error w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{point.title}</h3>
                            <p className="text-text-secondary leading-relaxed">
                                {point.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
