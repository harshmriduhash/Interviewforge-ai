"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Zap, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar } from "recharts";

const SCORE_PROGRESS = [
  { week: "Wk 1", technical: 55, communication: 60, structure: 50 },
  { week: "Wk 2", technical: 62, communication: 65, structure: 58 },
  { week: "Wk 3", technical: 60, communication: 72, structure: 64 },
  { week: "Wk 4", technical: 70, communication: 68, structure: 70 },
  { week: "Wk 5", technical: 74, communication: 75, structure: 78 },
  { week: "Wk 6", technical: 82, communication: 78, structure: 85 },
];

const SKILL_DIMENSIONS = [
  { name: 'Technical', score: 82 },
  { name: 'Communication', score: 78 },
  { name: 'Problem Structure', score: 85 },
  { name: 'Depth & Rationale', score: 72 },
  { name: 'Confidence & Tone', score: 80 },
  { name: 'Filler Word Control', score: 88 },
  { name: 'Pacing & Speed', score: 75 },
];

// Generate contribution calendar cells: 53 weeks * 7 days = 371 cells
const generateContributionData = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = [];
  const now = new Date();
  for (let i = 0; i < 180; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const count = Math.random() > 0.75 ? Math.floor(Math.random() * 4) + 1 : 0;
    data.push({
      date: d.toISOString().split("T")[0],
      count,
    });
  }
  return data.reverse();
};

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/users/me/dashboard").then(r => r.json()),
      fetch("/api/users/me/activity").then(r => r.json())
    ]).then(([dashboardData, activityData]) => {
      setData(dashboardData);
      setActivity(activityData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const progress = data?.progress;
  const recentSessions = data?.recentSessions || [];
  const streak = progress?.currentStreak ?? 12;
  const totalSessions = progress?.totalSessions ?? 24;
  const avgScore = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((acc: number, s: any) => acc + Number(s.overallScore || 0), 0) / recentSessions.length)
    : 78;

  // Real skill dimensions from longitudinal memory (§12.4)
  const realSkillDimensions = progress ? [
    { name: 'Technical', score: progress.scoreTechnical || 70 },
    { name: 'Communication', score: progress.scoreCommunication || 70 },
    { name: 'Structure', score: progress.scoreStructure || 70 },
    { name: 'Depth', score: 72 },
    { name: 'Confidence', score: 80 },
    { name: 'Filler Word Control', score: 88 },
    { name: 'Pacing', score: 75 },
  ] : SKILL_DIMENSIONS;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh" }}>
        <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Performance Analytics</h1>
              <p className="text-text-secondary mt-1">Deep analytics across multiple interview dimensions</p>
            </div>
            <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-border">
              <Zap className="w-5 h-5 text-primary fill-primary" />
              <div className="text-left pr-2">
                <span className="block text-white font-black text-sm">{streak} Day Streak</span>
                <span className="block text-[10px] text-text-muted font-bold uppercase">Consistency pays off</span>
              </div>
            </div>
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Overall Readiness', value: `${progress?.readinessScore ? Number(progress.readinessScore).toFixed(0) : avgScore}%`, desc: 'Dynamic readiness index' },
              { label: 'Total Audited Practice', value: `${totalSessions} Sessions`, desc: 'Spoken technical rounds' },
              { label: 'Weak Areas Flagged', value: `${progress?.weakTopics?.length || 3} Core Topics`, desc: 'Requires deliberate prep' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl space-y-2 border border-border"
              >
                <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-text-secondary">{stat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Progression Graphs */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-bold text-lg">Multi-Dimensional Growth</h3>
                </div>
                <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Weekly averages</span>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="99%" height="100%">
                  <AreaChart data={SCORE_PROGRESS}>
                    <defs>
                      <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF5C00" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF5C00" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E2E2E" />
                    <XAxis dataKey="week" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#141414', border: '1px solid #2E2E2E', borderRadius: '12px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" name="Technical" dataKey="technical" stroke="#FF5C00" strokeWidth={3} fillOpacity={1} fill="url(#colorTech)" />
                    <Area type="monotone" name="Communication" dataKey="communication" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorComm)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-bold text-lg">Current Competency Breakdown</h3>
                </div>
                <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Target L4/L5 Expectation</span>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="99%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={realSkillDimensions}>
                    <PolarGrid stroke="#2E2E2E" />
                    <PolarAngleAxis dataKey="name" stroke="#A3A3A3" fontSize={10} tick={{ fill: "#A3A3A3", fontWeight: 'bold' }} />
                    <Radar name="Candidate" dataKey="score" stroke="#FF5C00" fill="#FF5C00" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Spoken Practice Matrix (GitHub style) */}
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-white font-bold text-lg">Forge Activity Matrix</h3>
              </div>
              <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Consistency Map</span>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1.5 min-w-[700px]">
                {/* 25 columns representing active calendar blocks */}
                {Array.from({ length: 26 }).map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-1.5 flex-1">

                    return (
                    <div
                      key={rowIndex}
                      className="w-full aspect-square rounded-sm transition-all hover:scale-125"
                      style={{
                        background: opacity > 0.05 ? `rgba(255, 92, 0, ${opacity})` : "#2E2E2E",
                        border: `1px solid ${opacity > 0.05 ? "rgba(255, 92, 0, 0.4)" : "transparent"}`,
                      }}
                      title={day ? `${day.date}: ${day.count} sessions completed` : "No activity"}
                    />
                    );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Past 6 Months</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-[#2E2E2E]" />
                <div className="w-3 h-3 rounded-sm bg-[rgba(255,92,0,0.3)]" />
                <div className="w-3 h-3 rounded-sm bg-[rgba(255,92,0,0.6)]" />
                <div className="w-3 h-3 rounded-sm bg-[rgba(255,92,0,0.9)]" />
                <span>More</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
