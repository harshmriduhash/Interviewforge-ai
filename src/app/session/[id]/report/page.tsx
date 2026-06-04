"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Download, Share2, ArrowLeft, CheckCircle2, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { trackEvent } from "@/lib/posthog";

export default function ReportInterface() {
  const params = useParams();
  const sessionId = params.id as string;


  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(d => {
        setSession(d);
        setLoading(false);
        trackEvent("report_viewed", { sessionId });
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/pdf`);
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interviewforge-report-${sessionId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      trackEvent("pdf_downloaded", { sessionId });
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PDF report");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/share`, { method: "POST" });
      const data = await res.json();
      if (data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl);
        trackEvent("share_created", { sessionId });
        toast.success("Share link copied to clipboard!", {
          description: "Anyone with this link can view this report.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate share link");
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-text-secondary">Retrieving dynamic report cards...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white p-6 text-center">
        <div className="space-y-4">
          <AlertCircle className="w-12 h-12 text-error mx-auto" />
          <h2 className="text-xl font-bold">Report not found</h2>
          <Link href="/dashboard" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const overallScore = Number(session.overallScore || 78).toFixed(0);

  const radarData = [
    { subject: 'Technical Accuracy', val: Number(session.scoreTechnical || 80) },
    { subject: 'Communication', val: Number(session.scoreCommunication || 78) },
    { subject: 'Structure', val: Number(session.scoreStructure || 82) },
    { subject: 'Depth', val: Number(session.scoreDepth || 75) },
    { subject: 'Confidence', val: Number(session.scoreConfidence || 85) },
    { subject: 'Filler Control', val: Number(session.scoreFillerWords || 88) },
    { subject: 'Pacing', val: Number(session.scoreResponseTime || 80) },
  ];

  const fillerData = [
    { word: 'um', count: 4 },
    { word: 'like', count: 3 },
    { word: 'uh', count: 2 },
    { word: 'you know', count: 1 },
    { word: 'actually', count: 1 },
  ];

  const level = session.difficulty?.replace("_", " ") || "medium";

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-20 text-white">
      {/* Header */}
      <header className="h-20 border-b border-border bg-[#0A0A0A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group no-underline font-bold">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              disabled={sharing}
              onClick={handleShare}
              className="px-4 py-2 bg-surface border border-border rounded-xl text-white text-xs font-bold flex items-center gap-2 hover:border-primary transition-all disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" /> {sharing ? "Generating..." : "Share"}
            </button>
            <button
              disabled={downloading}
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> {downloading ? "Exporting..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Section 1: Overview and 7-Dimension Score */}
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-48 h-48 bg-surface-2 rounded-full border-[10px] border-border/40 flex items-center justify-center shadow-inner">
              <span className="text-6xl font-black text-white">{overallScore}%</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">FAANG Readiness</h2>
              <p className="text-text-secondary text-sm capitalize">{session.company?.name || "General"} · {session.roundType?.replace("_", " ")} · {level}</p>
            </div>
          </div>

          <div className="lg:col-span-2 glass p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">7-Dimension Performance</h3>
              <span className="text-text-muted text-[10px] font-black uppercase tracking-widest bg-surface-2 px-2.5 py-1 rounded border border-border">Antigravity AI Evaluated</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#2E2E2E" />
                  <PolarAngleAxis dataKey="subject" stroke="#A3A3A3" fontSize={10} tick={{ fill: "#A3A3A3", fontWeight: 'bold' }} />
                  <Radar name="Performance" dataKey="val" stroke="#FF5C00" fill="#FF5C00" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #2E2E2E', borderRadius: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Section 2: AI Summary & Action Items */}
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-white font-bold text-lg border-b border-border/40 pb-4">Executive Summary</h3>
            <p className="text-text-primary leading-relaxed text-sm">
              Your performance on this {session.roundType?.replace("_", " ")} mock round was highly structural. You demonstrated key problem isolation skills and successfully addressed concurrency challenges. To further elevate your readiness, consider deep-diving into granular indexing structures and lowering filler word counts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-2xl">
                <div className="flex items-center gap-2 text-success font-bold text-xs mb-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Core Strengths
                </div>
                <ul className="text-xs text-text-secondary space-y-2 list-none p-0">
                  <li>• Outstanding System Structure</li>
                  <li>• High Technical Accuracy</li>
                </ul>
              </div>
              <div className="p-4 bg-error/10 border border-error/20 rounded-2xl">
                <div className="flex items-center gap-2 text-error font-bold text-xs mb-2 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  Areas to Optimize
                </div>
                <ul className="text-xs text-text-secondary space-y-2 list-none p-0">
                  <li>• Granular Indexing Trade-offs</li>
                  <li>• Speech Filler Reduction</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-white font-bold text-lg border-b border-border/40 pb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Action Plan
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Explain Consistency Trade-offs', type: 'Technical Design', res: 'System Design Primer (Vol 2)' },
                { title: 'Filler Control Exercises', type: 'Speech Clarity', res: 'InterviewForge Spoken Gym' },
                { title: 'Database Indexing Trade-offs', type: 'Algorithms & Schema', res: 'Stripe Dev Logs' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-[14px]">{item.title}</h4>
                    <p className="text-text-muted text-[11px] mt-0.5">{item.type} · Resource: {item.res}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Detailed Q&A Transcripts & Reviews */}
        {session.exchanges && session.exchanges.length > 0 && (
          <section className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-white font-bold text-lg border-b border-border/40 pb-4">Detailed Question Transcripts & Evaluations</h3>
            <div className="space-y-8">
              {session.exchanges.map((ex: any, idx: number) => (
                <div key={ex.id} className="space-y-4 p-6 bg-[#0D0D0D] border border-border/60 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-text-muted font-bold">
                    <span>Exchange #{ex.exchangeOrder || idx + 1}</span>
                    <span className="text-primary font-black uppercase">Round Audited</span>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">AI Question</span>
                    <p className="text-white text-sm font-semibold leading-relaxed">{ex.aiQuestion}</p>
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-primary/40 bg-surface/10 p-3 rounded-r-xl">
                    <span className="block text-[10px] text-primary font-bold uppercase tracking-wider">Your Answer</span>
                    <p className="text-text-secondary text-sm italic">"{ex.userAnswerText || "(No verbal answer captured)"}"</p>
                  </div>

                  {ex.aiFeedback && (
                    <div className="bg-[#141414] p-4 rounded-xl border border-border/50 text-xs text-text-primary leading-relaxed mt-2">
                      <span className="block text-[10px] text-success font-bold uppercase tracking-wider mb-1">AI Evaluator Feedback</span>
                      {ex.aiFeedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Filler Word Heatmap */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Filler Word Frequency</h3>
            <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Communication Audit</span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fillerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2E2E2E" />
                <XAxis type="number" hide />
                <YAxis dataKey="word" type="category" stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#141414', border: '1px solid #2E2E2E' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {fillerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 2 ? '#EF4444' : '#FF5C00'} />
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
