"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarChart as RechartsRadarChart } from "recharts";
import { Sparkles, Send, RefreshCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_QUESTION = "How would you design a rate limiter for a high-traffic API like Twitter's, ensuring horizontally scalable consistency?";

export default function DemoWidget() {
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);

    const handleEvaluate = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/sessions/demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: SAMPLE_QUESTION, answer }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Evaluation failed");
            setEvaluation(data.evaluation);
            toast.success("AI Analysis Complete!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const radarData = evaluation ? [
        { subject: 'Technical', val: evaluation.scores.technical_accuracy },
        { subject: 'Clarity', val: evaluation.scores.communication_clarity },
        { subject: 'Structure', val: evaluation.scores.answer_structure },
    ] : [];

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-[#0A0A0A]">
            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter sm:text-5xl">
                        Test the <span className="text-primary underline">Engine</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-xl mx-auto">
                        Experience our 7-dimension AI grader. Answer a real senior-level system design prompt below.
                    </p>
                </div>

                <div className="glass p-8 md:p-12 rounded-[2rem] border border-border/60 bg-gradient-to-b from-surface/50 to-transparent shadow-2xl">
                    {!evaluation ? (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" /> Target Prompt
                                </label>
                                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic">
                                    "{SAMPLE_QUESTION}"
                                </p>
                            </div>

                            <div className="relative">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your architectural approach here... (e.g. Using Redis fixed window or Token Bucket with sliding logs...)"
                                    className="w-full h-48 bg-surface-2 border border-border rounded-xl p-6 text-sm text-text-primary outline-none focus:border-primary transition-all resize-none shadow-inner"
                                />
                                <button
                                    onClick={handleEvaluate}
                                    disabled={loading || !answer.trim()}
                                    className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
                                >
                                    {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-text-muted font-bold uppercase tracking-widest">
                                No login required · Analyzed in real-time by InterviewForge AI
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-2 gap-12 items-center"
                        >
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-white italic uppercase">Evaluation Scorecard</h3>
                                <div className="space-y-4">
                                    <p className="text-sm text-text-secondary leading-relaxed bg-surface-2 p-4 rounded-xl border border-border/40">
                                        <strong className="text-primary block mb-1">Feedback Summary</strong>
                                        {evaluation.feedback_summary}
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="text-center bg-surface-2 p-4 rounded-2xl flex-1 border border-border/40">
                                            <span className="text-2xl font-black text-white">{evaluation.overall_score}%</span>
                                            <span className="block text-[8px] font-black text-text-muted uppercase mt-1">Overall Grade</span>
                                        </div>
                                        <button
                                            onClick={() => { setEvaluation(null); setAnswer(""); }}
                                            className="flex-1 bg-surface border border-border hover:border-primary rounded-2xl text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1.5 transition-all text-text-secondary hover:text-white"
                                        >
                                            <RefreshCcw className="w-4 h-4" /> Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[240px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#2E2E2E" />
                                        <PolarAngleAxis dataKey="subject" stroke="#A3A3A3" fontSize={10} tick={{ fill: "#A3A3A3", fontWeight: 'bold' }} />
                                        <Radar name="Performance" dataKey="val" stroke="#FF5C00" fill="#FF5C00" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -z-10" />
        </section>
    );
}
