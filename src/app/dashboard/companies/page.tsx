"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Star, GraduationCap, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

const COMPANY_META: Record<string, { logo: string; color: string; desc: string }> = {
  google: { logo: "G", color: "#4285F4", desc: "Heavy emphasis on algorithms, data structures, dynamic programming, and high-scale distributed caching structures." },
  meta: { logo: "M", color: "#0668E1", desc: "Rigorous focus on rapid system design (Live Streaming, feeds) and intense performance-oriented behavioral loops." },
  amazon: { logo: "A", color: "#FF9900", desc: "Strict alignment with Leadership Principles. System designs focus on highly redundant database structures." },
  apple: { logo: "", color: "#000000", desc: "Hardware-software integration, multi-threaded algorithms, low-level architecture, and detailed system safety." },
  netflix: { logo: "N", color: "#E50914", desc: "Exceptional behavioral autonomy focus alongside highly resilient stream ingestion systems & CDN design." },
  stripe: { logo: "S", color: "#635BFF", desc: "Practical system integrations, API design excellence, idempotency safety, and distributed concurrency." },
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch companies or use seeded high-yield ones
    fetch("/api/questions?limit=100")
      .then(r => r.json())
      .then(d => {
        // Aggregate companies from questions
        const seenSlugs = new Set<string>();
        const aggregated: any[] = [];
        d.questions.forEach((q: any) => {
          if (q.company && !seenSlugs.has(q.company.slug)) {
            seenSlugs.add(q.company.slug);
            aggregated.push({
              id: q.company.slug,
              name: q.company.name,
              slug: q.company.slug,
              questionCount: 4, // Default curated count
              avgDifficulty: "Hard",
            });
          }
        });

        // Add defaults if none fetched
        const defaultCompanies = [
          { id: "google", name: "Google", slug: "google", questionCount: 4, avgDifficulty: "Hard" },
          { id: "meta", name: "Meta", slug: "meta", questionCount: 3, avgDifficulty: "Uber Hard" },
          { id: "stripe", name: "Stripe", slug: "stripe", questionCount: 3, avgDifficulty: "Hard" },
          { id: "amazon", name: "Amazon", slug: "amazon", questionCount: 2, avgDifficulty: "Medium" },
          { id: "netflix", name: "Netflix", slug: "netflix", questionCount: 2, avgDifficulty: "Hard" },
          { id: "apple", name: "Apple", slug: "apple", questionCount: 1, avgDifficulty: "Hard" },
        ];

        setCompanies(aggregated.length > 0 ? aggregated : defaultCompanies);
        setLoading(false);
      })
      .catch(() => {
        setCompanies([
          { id: "google", name: "Google", slug: "google", questionCount: 4, avgDifficulty: "Hard" },
          { id: "meta", name: "Meta", slug: "meta", questionCount: 3, avgDifficulty: "Uber Hard" },
          { id: "stripe", name: "Stripe", slug: "stripe", questionCount: 3, avgDifficulty: "Hard" },
          { id: "amazon", name: "Amazon", slug: "amazon", questionCount: 2, avgDifficulty: "Medium" },
          { id: "netflix", name: "Netflix", slug: "netflix", questionCount: 2, avgDifficulty: "Hard" },
          { id: "apple", name: "Apple", slug: "apple", questionCount: 1, avgDifficulty: "Hard" },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh" }}>
        <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Company Prep Tracks</h1>
            <p className="text-text-secondary">Deliberate training programs customized to specific company interview styles</p>
          </div>

          {/* Premium banner */}
          <div className="relative p-8 bg-gradient-to-r from-primary to-orange-600 rounded-3xl overflow-hidden shadow-xl shadow-primary/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20" />
            <div className="relative max-w-2xl space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/20 text-white w-fit px-2 py-0.5 rounded">
                <Sparkles className="w-3.5 h-3.5 fill-white" /> Pro Feature
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">Simulate Real Company Panels</h2>
              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                Unlock fully dynamic 4-stage mock interview loops replicating actual pipelines at Google, Meta, or Stripe. Includes adaptive questioning, specific behavioral rubrics, and detailed panel evaluation report summaries.
              </p>
            </div>
          </div>

          {/* Company list grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-surface/50 border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((c, i) => {
                const meta = COMPANY_META[c.slug] || { logo: c.name.charAt(0), color: "#FF5C00", desc: "Comprehensive mock questions representing direct interviews." };
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-6 rounded-3xl border border-border/60 hover:border-primary/50 transition-all flex flex-col justify-between h-64 group relative overflow-hidden"
                  >
                    {/* Shadow decoration */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 -translate-y-6 translate-x-6"
                      style={{ background: meta.color }}
                    />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md"
                          style={{ backgroundColor: meta.color || "#1E1E1E" }}
                        >
                          {meta.logo}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                          <span>{c.avgDifficulty}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{c.name}</h3>
                        <p className="text-text-secondary text-xs line-clamp-3 mt-1.5 leading-relaxed">{meta.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
                      <div className="text-xs text-text-muted font-bold">
                        <span className="text-white font-black">{c.questionCount}</span> Curated Rounds
                      </div>
                      
                      <Link
                        href={`/dashboard/questions?company=${c.slug}`}
                        className="flex items-center gap-1.5 text-xs text-primary hover:text-white font-black uppercase tracking-wider group-hover:gap-2.5 transition-all no-underline"
                      >
                        Enter Track <ArrowRight className="w-4 h-4" />
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
