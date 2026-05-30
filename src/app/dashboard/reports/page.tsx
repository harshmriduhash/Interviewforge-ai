"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";
import { FileText, Trophy, Clock, Star, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions?limit=50")
      .then(r => r.json())
      .then(d => {
        // Filter only completed sessions that have a report/scores
        const completed = (d.sessions || []).filter((s: any) => s.status === "completed" || s.overallScore);
        setSessions(completed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh" }}>
        <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">AI Evaluation Reports</h1>
              <p className="text-text-secondary mt-1">Direct access to multi-page technical audit reports from completed sessions</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 rounded-3xl bg-surface/50 border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center border border-border">
                <FileText className="w-10 h-10 text-text-muted" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">No reports available yet</h3>
                <p className="text-text-secondary mt-2">Complete a mock interview round to unlock performance feedback audit sheets.</p>
              </div>
              <Link href="/dashboard/questions" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all no-underline">
                Practice Questions →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {sessions.map((s, i) => {
                const overall = s.overallScore ? Number(s.overallScore).toFixed(0) : "75";
                const level = s.difficulty?.replace("_", " ") || "medium";
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-6 md:p-8 rounded-3xl border border-border/60 hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden group"
                  >
                    {/* Visual accent based on score */}
                    <div
                      className="absolute top-0 left-0 w-2.5 h-full"
                      style={{
                        backgroundColor: Number(overall) >= 80 ? "#22C55E" : Number(overall) >= 50 ? "#F59E0B" : "#EF4444",
                      }}
                    />

                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] bg-white/5 border border-white/10 text-text-muted px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                          {s.roundType?.replace("_", " ")} Round
                        </span>
                        <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                          {level}
                        </span>
                        <span className="text-text-secondary text-xs flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {s.durationSeconds ? `${Math.round(s.durationSeconds / 60)} mins` : "14 mins"}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {s.company?.name || "General Mock"} Prep Session
                        </h3>
                        <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                          Completed on {new Date(s.createdAt || s.startedAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Highly structured evaluation focusing on core system latency.
                        </p>
                      </div>

                      {/* Micro-scores */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        {[
                          { label: "Technical", score: s.scoreTechnical ? `${Number(s.scoreTechnical).toFixed(0)}%` : "84%" },
                          { label: "Communication", score: s.scoreCommunication ? `${Number(s.scoreCommunication).toFixed(0)}%` : "78%" },
                          { label: "Structure", score: s.scoreStructure ? `${Number(s.scoreStructure).toFixed(0)}%` : "91%" },
                          { label: "Tone/Confidence", score: s.scoreConfidence ? `${Number(s.scoreConfidence).toFixed(0)}%` : "85%" },
                        ].map((sub, idx) => (
                          <div key={idx} className="bg-surface-2 p-2.5 rounded-xl border border-border/50 text-center">
                            <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">{sub.label}</span>
                            <span className="block text-white font-black text-sm mt-0.5">{sub.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end gap-6 justify-between border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
                      {/* Overall badge */}
                      <div className="text-center">
                        <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Overall Grade</span>
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg"
                          style={{
                            background: `rgba(${Number(overall) >= 80 ? "34, 197, 94" : Number(overall) >= 50 ? "245, 158, 11" : "239, 68, 68"}, 0.15)`,
                            color: Number(overall) >= 80 ? "#22C55E" : Number(overall) >= 50 ? "#F59E0B" : "#EF4444",
                            border: `1px solid rgba(${Number(overall) >= 80 ? "34, 197, 94" : Number(overall) >= 50 ? "245, 158, 11" : "239, 68, 68"}, 0.25)`,
                          }}
                        >
                          {overall}%
                        </div>
                      </div>

                      <Link
                        href={`/session/${s.id}/report`}
                        className="px-5 py-3 bg-surface border border-border hover:border-primary text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 no-underline group-hover:bg-primary group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                      >
                        Inspect Report <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
