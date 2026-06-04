"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { AlertCircle, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

export default function SharedReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const sessionId = params.id as string;
    const token = searchParams.get("token");

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Share token missing");
            setLoading(false);
            return;
        }

        fetch(`/api/sessions/${sessionId}/share?token=${token}`)
            .then((r) => {
                if (!r.ok) throw new Error("Invalid or expired share link");
                return r.json();
            })
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [sessionId, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-text-secondary">Loading shared report...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white p-6 text-center">
                <div className="space-y-4">
                    <AlertCircle className="w-12 h-12 text-error mx-auto" />
                    <h2 className="text-xl font-bold">{error || "Report not found"}</h2>
                    <p className="text-text-secondary text-sm">This link might be invalid or has been revoked.</p>
                </div>
            </div>
        );
    }

    const radarData = [
        { subject: "Technical Accuracy", val: data.scoreTechnical || 0 },
        { subject: "Communication", val: data.scoreCommunication || 0 },
        { subject: "Structure", val: data.scoreStructure || 0 },
        { subject: "Depth", val: data.scoreDepth || 0 },
        { subject: "Confidence", val: data.scoreConfidence || 0 },
        { subject: "Filler Control", val: data.scoreFillerWords || 0 },
        { subject: "Pacing", val: data.scoreResponseTime || 0 },
    ];

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white">
            {/* Header */}
            <header className="h-20 border-b border-border bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black">IF</div>
                        <span className="font-black tracking-tight text-white italic uppercase">InterviewForge AI</span>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20">
                        Public View
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Spoken Interview Performance</h1>
                    <p className="text-text-secondary">
                        {data.company?.name || "General"} Track · {data.roundType?.replace("_", " ")} · {data.difficulty}
                    </p>
                </div>

                <section className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 glass p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative w-48 h-48 bg-surface-2 rounded-full border-[10px] border-primary/20 flex items-center justify-center shadow-inner">
                            <span className="text-6xl font-black text-white">{(data.overallScore || 0).toFixed(0)}%</span>
                        </div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">FAANG Readiness</h2>
                    </div>

                    <div className="lg:col-span-2 glass p-8 rounded-3xl space-y-6">
                        <h3 className="text-white font-bold text-lg">7-Dimension Performance</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                    <PolarGrid stroke="#2E2E2E" />
                                    <PolarAngleAxis dataKey="subject" stroke="#A3A3A3" fontSize={10} tick={{ fill: "#A3A3A3", fontWeight: "bold" }} />
                                    <Radar name="Performance" dataKey="val" stroke="#FF5C00" fill="#FF5C00" fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ backgroundColor: "#141414", border: "1px solid #2E2E2E", borderRadius: "12px" }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {data.exchanges && data.exchanges.length > 0 && (
                    <section className="glass p-8 rounded-3xl space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-border/40 pb-4">Transcript Highlights</h3>
                        <div className="space-y-6">
                            {data.exchanges.slice(0, 3).map((ex: any, idx: number) => (
                                <div key={idx} className="space-y-4 p-6 bg-[#0D0D0D] border border-border/60 rounded-2xl">
                                    <div className="space-y-2">
                                        <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">AI Question</span>
                                        <p className="text-white text-sm font-semibold leading-relaxed">{ex.aiQuestion}</p>
                                    </div>
                                    <div className="space-y-2 pl-4 border-l-2 border-primary/40 bg-surface/10 p-3 rounded-r-xl">
                                        <span className="block text-[10px] text-primary font-bold uppercase tracking-wider">Candidate Answer</span>
                                        <p className="text-text-secondary text-sm italic">"{ex.userAnswerText || "(No speech captured)"}"</p>
                                    </div>
                                </div>
                            ))}
                            {data.exchanges.length > 3 && (
                                <p className="text-center text-text-muted text-xs italic">... and {data.exchanges.length - 3} more exchanges in the full session.</p>
                            )}
                        </div>
                    </section>
                )}

                <div className="text-center pt-8">
                    <a href="/" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-primary-hover transition-all">
                        Try InterviewForge yourself <Sparkles className="w-4 h-4" />
                    </a>
                </div>
            </main>
        </div>
    );
}
