"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";
import { History, Play, FileText, Clock, Building2 } from "lucide-react";
import Link from "next/link";

const DIFF_COLORS: Record<string, string> = {
  easy: "#22C55E", medium: "#F59E0B", hard: "#EF4444", uber_hard: "#9333EA",
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`/api/sessions?page=${page}&limit=15`)
      .then(r => r.json())
      .then(d => {
        setSessions(d.sessions || []);
        setTotal(d.total || 0);
        setLoading(false);
      });
  }, [page]);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh" }}>
        <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Session History</h1>
              <p className="text-text-secondary mt-1">{total} total sessions completed</p>
            </div>
            <Link href="/session/new" className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all no-underline">
              <Play className="w-4 h-4 fill-white" /> New Session
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl animate-shimmer" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center">
                <History className="w-10 h-10 text-text-muted" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">No sessions yet</h3>
                <p className="text-text-secondary mt-2">Start your first mock interview to see history here.</p>
              </div>
              <Link href="/session/new" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all no-underline">
                Start First Session →
              </Link>
            </div>
          ) : (
            <div className="glass overflow-hidden rounded-3xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-text-muted text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Round Type</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, i) => (
                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-surface-2 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-text-muted" />
                          </div>
                          <span className="text-white font-bold">{s.company?.name || "General"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary capitalize">{s.roundType?.replace("_", " ")}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-[10px] font-black uppercase" style={{ color: DIFF_COLORS[s.difficulty] || "#A3A3A3", background: `${DIFF_COLORS[s.difficulty]}20` }}>
                          {s.difficulty?.replace("_", " ") || "Medium"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold" style={{ color: s.overallScore ? (s.overallScore >= 80 ? "#22C55E" : s.overallScore >= 50 ? "#F59E0B" : "#EF4444") : "#525252" }}>
                        {s.overallScore ? `${Number(s.overallScore).toFixed(0)}%` : "--"}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {s.durationSeconds ? `${Math.round(s.durationSeconds / 60)}m` : "--"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${s.status === "completed" ? "text-success" : s.status === "active" ? "text-primary" : "text-text-muted"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                        {s.status === "completed" && (
                          <Link href={`/session/${s.id}/report`} className="flex items-center gap-1 text-primary hover:text-white font-bold transition-colors text-sm no-underline">
                            <FileText className="w-3 h-3" /> Report
                          </Link>
                        )}
                        <Link href={`/session/${s.id}`} className="flex items-center gap-1 text-text-muted hover:text-white font-bold transition-colors text-sm no-underline">
                          <Play className="w-3 h-3" /> Resume
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {total > 15 && (
            <div className="flex items-center justify-center gap-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 glass rounded-lg font-bold text-text-muted hover:text-white disabled:opacity-30 transition-all">
                ← Previous
              </button>
              <span className="text-text-muted text-sm">Page {page} of {Math.ceil(total / 15)}</span>
              <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 glass rounded-lg font-bold text-text-muted hover:text-white disabled:opacity-30 transition-all">
                Next →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
