"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Sparkles, Send, RefreshCcw, Mic } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_QUESTION = "How would you design a rate limiter for a high-traffic API like Twitter's, ensuring horizontally scalable consistency?";

const ORANGE = "#FF5C00";
const BG = "#0A0A0A";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";

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
        { subject: 'Technical Accuracy', val: evaluation.scores.technical_accuracy },
        { subject: 'Comm. Clarity', val: evaluation.scores.communication_clarity },
        { subject: 'Architecture', val: evaluation.scores.answer_structure },
    ] : [];

    return (
        <section style={{ padding: "100px 24px", position: "relative", overflow: "hidden", background: BG }}>
            {/* Ambient Background Glows */}
            <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "80%", height: 600, background: `radial-gradient(ellipse, rgba(255,92,0,0.08) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

            <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 10 }}>
                <div style={{ textAlign: "center", marginBottom: 64, display: "flex", flexDirection: "column", gap: 16 }}>
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: TEXT, letterSpacing: "-1.5px", margin: 0, textTransform: "uppercase", fontStyle: "italic" }}>
                        TEST THE <span style={{ color: ORANGE, borderBottom: `4px solid ${ORANGE}`, display: "inline-block", paddingBottom: 4 }}>ENGINE</span>
                    </h2>
                    <p style={{ fontSize: 18, color: MUTED, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
                        Experience our 7-dimension AI grader. Answer a real senior-level system design prompt below.
                    </p>
                </div>

                <div style={{
                    background: "rgba(20,20,20,0.8)",
                    backdropFilter: "blur(24px)",
                    borderRadius: 32,
                    border: `1px solid ${BORDER}`,
                    padding: "48px",
                    boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,92,0,0.05)",
                    position: "relative"
                }}>
                    {!evaluation ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <label style={{ fontSize: 11, fontWeight: 900, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.2em", display: "flex", alignItems: "center", gap: 8 }}>
                                    <Sparkles style={{ width: 14, height: 14 }} /> TARGET PROMPT
                                </label>
                                <p style={{ fontSize: 22, color: TEXT, fontWeight: 600, lineHeight: 1.5, fontStyle: "italic", margin: 0 }}>
                                    "{SAMPLE_QUESTION}"
                                </p>
                            </div>

                            <div style={{ position: "relative" }}>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your architectural approach here... (e.g. Using Redis fixed window or Token Bucket with sliding logs...)"
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        background: "#0D0D0D",
                                        border: `1px solid ${BORDER}`,
                                        borderRadius: 16,
                                        padding: 24,
                                        fontSize: 15,
                                        color: TEXT,
                                        outline: "none",
                                        resize: "none",
                                        transition: "border-color 0.2s",
                                        fontFamily: "var(--font-sans)",
                                        lineHeight: 1.6
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = ORANGE}
                                    onBlur={(e) => e.currentTarget.style.borderColor = BORDER}
                                />
                                <button
                                    onClick={handleEvaluate}
                                    disabled={loading || !answer.trim()}
                                    style={{
                                        position: "absolute",
                                        bottom: 16,
                                        right: 16,
                                        background: ORANGE,
                                        color: "#fff",
                                        padding: "12px 24px",
                                        borderRadius: 12,
                                        fontWeight: 700,
                                        fontSize: 14,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "transform 0.2s, background 0.2s",
                                        boxShadow: "0 8px 24px rgba(255,92,0,0.2)"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading && answer.trim()) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.background = "#E64D00";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.background = ORANGE;
                                    }}
                                >
                                    {loading ? <RefreshCcw style={{ width: 18, height: 18, animation: "spin 2s linear infinite" }} /> : <><Send style={{ width: 18, height: 18 }} /> Analyze Answer</>}
                                </button>
                            </div>

                            <p style={{ textAlign: "center", fontSize: 11, color: "#525252", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                                No login required · Analyzed in real-time by InterviewForge AI
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}
                            className="md:grid-cols-2 grid-cols-1"
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                <h3 style={{ fontSize: 24, fontWeight: 900, color: TEXT, textTransform: "uppercase", fontStyle: "italic", margin: 0 }}>Evaluation Scorecard</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div style={{ background: "#0D0D0D", padding: 24, borderRadius: 16, border: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: 8 }}>
                                        <label style={{ fontSize: 11, fontWeight: 800, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.1em" }}>Feedback Summary</label>
                                        <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, margin: 0 }}>{evaluation.feedback_summary}</p>
                                    </div>
                                    <div style={{ display: "flex", gap: 16 }}>
                                        <div style={{ flex: 1, background: "#0D0D0D", padding: 24, borderRadius: 16, border: `1px solid ${BORDER}`, textAlign: "center" }}>
                                            <span style={{ fontSize: 32, fontWeight: 900, color: TEXT, display: "block" }}>{evaluation.overall_score}%</span>
                                            <span style={{ fontSize: 10, fontWeight: 800, color: "#525252", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4, display: "block" }}>Overall Grade</span>
                                        </div>
                                        <button
                                            onClick={() => { setEvaluation(null); setAnswer(""); }}
                                            style={{
                                                flex: 1,
                                                background: "transparent",
                                                border: `1px solid ${BORDER}`,
                                                borderRadius: 16,
                                                color: MUTED,
                                                fontWeight: 800,
                                                fontSize: 12,
                                                textTransform: "uppercase",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 8,
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = TEXT; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
                                        >
                                            <RefreshCcw style={{ width: 18, height: 18 }} /> Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: 320, position: "relative" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#2E2E2E" />
                                        <PolarAngleAxis dataKey="subject" stroke="#525252" fontSize={11} tick={{ fill: "#A3A3A3", fontWeight: 700 }} />
                                        <Radar name="Performance" dataKey="val" stroke={ORANGE} fill={ORANGE} fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </section>
    );
}
