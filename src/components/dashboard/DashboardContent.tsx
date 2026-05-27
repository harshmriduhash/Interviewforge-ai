"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area } from "recharts";
import { Flame, Star, Trophy, Clock, Play, BarChart3 } from "lucide-react";
import Link from "next/link";

const READINESS_DATA = [
    { day: "Mon", score: 45 },
    { day: "Tue", score: 48 },
    { day: "Wed", score: 52 },
    { day: "Thu", score: 50 },
    { day: "Fri", score: 58 },
    { day: "Sat", score: 62 },
    { day: "Sun", score: 65 },
];

const SKILL_DATA = [
    { subject: 'Technical', A: 82, fullMark: 100 },
    { subject: 'Comm.', A: 74, fullMark: 100 },
    { subject: 'Structure', A: 90, fullMark: 100 },
    { subject: 'Depth', A: 68, fullMark: 100 },
    { subject: 'Confidence', A: 85, fullMark: 100 },
    { subject: 'Fillers', A: 78, fullMark: 100 },
    { subject: 'Speed', A: 80, fullMark: 100 },
];

export function DashboardContent() {
    return (
        <div className="p-8 lg:p-12 space-y-10 max-w-[1600px] mx-auto">
            {/* Zone 1 - Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white">Good morning, Harsh.</h1>
                    <p className="text-text-secondary text-lg">Ready for your next session?</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-surface border border-border rounded-xl flex items-center gap-2">
                        <Flame className="w-5 h-5 text-primary fill-primary" />
                        <span className="text-white font-bold tracking-tight">12 day streak</span>
                    </div>
                    <Link
                        href="/session/new"
                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-white" />
                        Start Session
                    </Link>
                </div>
            </div>

            {/* Zone 2 - Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'FAANG Readiness', value: '72%', icon: Trophy, trend: '+8%' },
                    { label: 'Total Sessions', value: '24', icon: Star, trend: '+2' },
                    { label: 'Avg Session Score', value: '78%', icon: BarChart, trend: '+4%' },
                    { label: 'Longest Streak', value: '15d', icon: Clock, trend: 'Best' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-6 rounded-2xl space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-success text-xs font-black uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Zone 3 - Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Readiness Over Time</h3>
                        <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Last 7 Days</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={READINESS_DATA}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E2E2E" />
                                <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2E2E2E', borderRadius: '12px' }}
                                    itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Weakness Radar</h3>
                        <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Core Dimensions</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
                                <PolarGrid stroke="#2E2E2E" />
                                <PolarAngleAxis dataKey="subject" stroke="#525252" fontSize={10} tick={{ fill: "#A3A3A3", fontWeight: 'bold', textAnchor: 'middle' }} />
                                <Radar name="Skills" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Zone 4 - Suggested & Recent */}
            <div className="grid lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-white font-bold text-lg">Suggested Next Session</h3>
                    <div className="p-6 bg-primary rounded-2xl space-y-4 shadow-xl shadow-primary/20 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-150 transition-transform duration-500" />
                        <div>
                            <h4 className="text-white font-black text-xl">System Design Round</h4>
                            <p className="text-white/80 text-sm">Targeting: Meta (L5)</p>
                        </div>
                        <div className="flex items-center gap-2 text-white font-bold text-xs">
                            <span className="bg-white/20 px-2 py-1 rounded">Difficulty: Uber Hard</span>
                            <span className="bg-white/20 px-2 py-1 rounded">45 Mins</span>
                        </div>
                        <button className="w-full py-3 bg-white text-primary font-black rounded-xl hover:scale-[1.02] transition-transform">
                            Start Challenge →
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Recent Sessions</h3>
                        <Link href="/dashboard/sessions" className="text-primary text-xs font-bold hover:underline">View All History</Link>
                    </div>
                    <div className="glass overflow-hidden rounded-2xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border bg-surface-2 text-text-muted text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Round</th>
                                    <th className="px-6 py-4">Score</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface/30">
                                {[
                                    { company: 'Google', round: 'Algorithms', score: '84%', status: 'Completed', logo: 'G' },
                                    { company: 'Stripe', round: 'System Design', score: '72%', status: 'Completed', logo: 'S' },
                                    { company: 'Amazon', round: 'Behavioral', score: '91%', status: 'Completed', logo: 'A' },
                                ].map((s, i) => (
                                    <tr key={i} className="border-b border-border/50 text-[13px] hover:bg-surface-2 transition-colors group">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-bold text-[10px]">{s.logo}</div>
                                            <span className="text-white font-bold">{s.company}</span>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">{s.round}</td>
                                        <td className="px-6 py-4 font-bold text-primary">{s.score}</td>
                                        <td className="px-6 py-4 text-success font-bold text-[11px] uppercase tracking-wider">{s.status}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-white font-bold transition-colors">Report →</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
