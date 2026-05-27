"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Download, Share2, ArrowLeft, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

const SCORE_DATA = [
    { subject: 'Technical', A: 82, fullMark: 100 },
    { subject: 'Comm.', A: 74, fullMark: 100 },
    { subject: 'Structure', A: 90, fullMark: 100 },
    { subject: 'Depth', A: 68, fullMark: 100 },
    { subject: 'Confidence', A: 85, fullMark: 100 },
    { subject: 'Fillers', A: 48, fullMark: 100 },
    { subject: 'Speed', A: 80, fullMark: 100 },
];

const FILLER_DATA = [
    { word: 'um', count: 12 },
    { word: 'like', count: 8 },
    { word: 'uh', count: 5 },
    { word: 'you know', count: 4 },
    { word: 'actually', count: 3 },
];

export function ReportInterface() {
    const overallScore = 78;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="h-20 border-b border-border bg-surface/30 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-surface border border-border rounded-lg text-white text-sm font-bold flex items-center gap-2 hover:border-primary transition-all">
                            <Share2 className="w-4 h-4" />
                            Share Report
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Section 1: Overview and 7-Dimension Score */}
                <section className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 glass p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative w-48 h-48 bg-surface-2 rounded-full border-[12px] border-border flex items-center justify-center">
                            <svg className="absolute inset-x-0 inset-y-0 -rotate-90">
                                <motion.circle
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * overallScore / 100) }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    cx="96" cy="96" r="84"
                                    fill="none" stroke="var(--color-primary)" strokeWidth="12" strokeDasharray="440"
                                />
                            </svg>
                            <span className="text-5xl font-black text-white">{overallScore}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">FAANG Readiness</h2>
                            <p className="text-text-secondary text-sm">Meta L5 · System Design · 45 Mins</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 glass p-8 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg">7-Dimension Performance</h3>
                            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest bg-surface-2 px-2 py-1 rounded">Claude AI Evaluated</span>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SCORE_DATA}>
                                    <PolarGrid stroke="#2E2E2E" />
                                    <PolarAngleAxis dataKey="subject" stroke="#525252" fontSize={10} tick={{ fill: "#A3A3A3", fontWeight: 'bold' }} />
                                    <Radar name="Performance" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2E2E2E', borderRadius: '12px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                {/* Section 2: AI Summary & Action Items */}
                <section className="grid lg:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-3xl space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-border pb-4">Executive Summary</h3>
                        <p className="text-text-primary leading-relaxed">
                            Your performance on Meta's global news feed system design was strong in terms of high-level architecture. However, you struggled to articulate the trade-offs between eventual and strong consistency under heavy write load. Your communication was clear, but filler word frequency increased during technical deep-dives.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-success/10 border border-success/20 rounded-2xl">
                                <div className="flex items-center gap-2 text-success font-bold text-sm mb-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Strengths
                                </div>
                                <ul className="text-xs text-text-secondary space-y-2">
                                    <li>• API Design & Schema</li>
                                    <li>• Scaling Strategy</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-error/10 border border-error/20 rounded-2xl">
                                <div className="flex items-center gap-2 text-error font-bold text-sm mb-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Weaknesses
                                </div>
                                <ul className="text-xs text-text-secondary space-y-2">
                                    <li>• CAP Theorem deep-dive</li>
                                    <li>• Filler word frequency</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl space-y-6">
                        <h3 className="text-white font-bold text-lg border-b border-border pb-4">Next Action Items</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Explain Consistency Trade-offs', type: 'Technical', res: 'System Design Primer (Chap 3)' },
                                { title: 'Reduce Filler Word Ratio', type: 'Communication', res: 'InterviewForge Voice Drills' },
                                { title: 'Database Indexing deep-dive', type: 'Technical', res: 'PostHog Eng Blog' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-[14px] group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-text-muted text-[11px]">{item.type} · Resource: {item.res}</p>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-text-muted group-hover:text-success transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 3: Filler Word Heatmap */}
                <section className="glass p-8 rounded-3xl space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Filler Word Frequency</h3>
                        <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Crucial for Communication Scoring</span>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={FILLER_DATA} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2E2E2E" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="word" type="category" stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2E2E2E' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {FILLER_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index < 2 ? 'var(--color-error)' : 'var(--color-primary)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </main>
        </div>
    );
}
