"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building, Brain, Award, Play, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";

const DIFF_COLORS: Record<string, string> = {
  easy: "#22C55E", medium: "#F59E0B", hard: "#EF4444", uber_hard: "#9333EA",
};

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [round, setRound] = useState("");
  const [page, setPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (difficulty) query.append("difficulty", difficulty);
    if (round) query.append("round", round);
    query.append("page", page.toString());
    query.append("limit", "10");

    fetch(`/api/questions?${query.toString()}`)
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions || []);
        setTotal(d.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, difficulty, round, page]);

  const handleStartSession = async (q: any) => {
    setStartingSession(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companySlug: q.company?.slug || null,
          roundType: q.roundType,
          difficulty: q.difficulty,
        }),
      });
      const data = await res.json();
      if (data.session?.id) {
        router.push(`/session/${data.session.id}`);
      }
    } catch (e) {
      console.error(e);
      setStartingSession(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh" }}>
        <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Question Bank</h1>
              <p className="text-text-secondary mt-1">{total} high-yield standard interview questions</p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface p-4 rounded-2xl border border-border">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Fuzzy search titles or concepts..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-border rounded-xl text-white outline-none focus:border-primary transition-all text-sm"
              />
            </div>
            
            <div>
              <select
                value={round}
                onChange={e => { setRound(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-border rounded-xl text-text-secondary outline-none focus:border-primary transition-all text-sm capitalize"
              >
                <option value="">All Round Types</option>
                <option value="system_design">System Design</option>
                <option value="algorithms">Algorithms</option>
                <option value="behavioral">Behavioral</option>
              </select>
            </div>

            <div>
              <select
                value={difficulty}
                onChange={e => { setDifficulty(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-border rounded-xl text-text-secondary outline-none focus:border-primary transition-all text-sm capitalize"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="uber_hard">Uber Hard</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-surface/50 border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="glass rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-4">
              <p className="text-text-secondary text-lg">No matching questions found.</p>
              <button onClick={() => { setSearch(""); setDifficulty(""); setRound(""); }} className="px-6 py-2 bg-surface text-white rounded-xl border border-border font-bold">Clear Filters</button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedQuestion(q)}
                  className="glass p-6 rounded-2xl border border-border/60 hover:border-primary/50 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider" style={{ color: DIFF_COLORS[q.difficulty] || "#A3A3A3", background: `${DIFF_COLORS[q.difficulty]}15` }}>
                        {q.difficulty?.replace("_", " ")}
                      </span>
                      <span className="text-[10px] bg-white/5 border border-white/10 text-text-muted px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {q.roundType?.replace("_", " ")}
                      </span>
                      {q.company && (
                        <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                          <Building className="w-3 h-3" /> {q.company.name}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{q.title}</h3>
                      <p className="text-text-secondary text-sm line-clamp-2 mt-1">{q.body}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartSession(q);
                      }}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/10 group-hover:scale-[1.03]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Practice
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 10 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 glass rounded-lg font-bold text-text-muted hover:text-white disabled:opacity-30 transition-all">
                ← Previous
              </button>
              <span className="text-text-muted text-sm">Page {page} of {Math.ceil(total / 10)}</span>
              <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 glass rounded-lg font-bold text-text-muted hover:text-white disabled:opacity-30 transition-all">
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Detail Slideover Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuestion(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-surface border-l border-border h-full flex flex-col z-10 shadow-2xl p-8 overflow-y-auto space-y-6"
            >
              <button
                onClick={() => setSelectedQuestion(null)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-surface-2 border border-border text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4 pt-8">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider" style={{ color: DIFF_COLORS[selectedQuestion.difficulty] || "#A3A3A3", background: `${DIFF_COLORS[selectedQuestion.difficulty]}15` }}>
                    {selectedQuestion.difficulty?.replace("_", " ")}
                  </span>
                  <span className="text-[10px] bg-white/5 border border-white/10 text-text-muted px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    {selectedQuestion.roundType?.replace("_", " ")}
                  </span>
                </div>
                
                <h2 className="text-2xl font-black text-white leading-tight">{selectedQuestion.title}</h2>
                
                {selectedQuestion.company && (
                  <div className="flex items-center gap-2 text-text-secondary text-sm font-bold bg-[#0D0D0D] border border-border p-3 rounded-xl">
                    <Building className="w-4 h-4 text-primary" />
                    <span>Sourced from {selectedQuestion.company.name} interview loops</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Question Prompt</h4>
                <div className="bg-[#0D0D0D] border border-border rounded-2xl p-6 text-text-primary text-sm leading-relaxed whitespace-pre-line">
                  {selectedQuestion.body}
                </div>
              </div>

              {selectedQuestion.topicTags && selectedQuestion.topicTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Skills tested</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuestion.topicTags.map((tag: string) => (
                      <span key={tag} className="text-xs bg-surface-2 border border-border px-3 py-1.5 rounded-lg text-text-secondary font-bold capitalize">
                        {tag.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-border mt-auto">
                <button
                  disabled={startingSession}
                  onClick={() => handleStartSession(selectedQuestion)}
                  className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-black rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 text-base"
                >
                  <Play className="w-5 h-5 fill-white animate-pulse" />
                  {startingSession ? "Preparing voice room..." : "Initiate Spoken Practice"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
